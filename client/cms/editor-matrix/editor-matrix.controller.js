function bitwiseXor (a, b, c) {
  if (a.length !== b.length  || a.length !== c.length) {
    return new Error('Strings a and b must be of same length');
  }
  var result = "";
  for (var i=0; i< a.length; i++) {
    result += String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i) ^ c.charCodeAt(i));
  }
  return result;
}

angular.module('baemselcampCms')
  .controller('MatrixController', function($scope, $http, $q){

    $scope.hasPendingChanges = false;
    $scope.keyframes = [];
    $scope.matrix = [];
    $scope.pendingChanges = {};
    $scope.persons = [];
    $scope.relations = [];
    $scope.relationTypes = [];
    $scope.selectedKeyframe = null;

    $scope.$watch('selectedKeyframe', function(){
      if ($scope.selectedKeyframe && $scope.selectedKeyframe.id) {
        $scope.setApplicationBusy(true);
        $http.get('/api/relations?filter[where][keyframeId]='+$scope.selectedKeyframe.id).then(
          function (response) {
            $scope.relations = response.data;
            recomputeMatrix();
            $scope.setApplicationBusy(false);
          },
          function (error) {
            console.log(error);
            $scope.fireAlert('Fehler beim Laden. Bitte versuche es noch einmal.', 'danger');
            $scope.setApplicationBusy(false);
          }
        )
      }
    });

    $scope.$watch('matrix', function(){
      $('[data-toggle="tooltip"]').tooltip();
    });

    /* K E Y F R A M E S */

    $scope.selectKeyframe = function (event) {
      var selectedId = event.target.attributes['data-keyframe-id'].nodeValue;
      var selectedKeyframe = $scope.keyframes.filter(function(kf){
        return kf.id == selectedId;
      });
      if (selectedKeyframe.length === 1) {
        $scope.selectedKeyframe = selectedKeyframe[0];
      } else if (selectedKeyframe.length === 0) {
        throw 'Error in MatrixController: Cannot find selected keyframe';
      } else {
        throw 'Error in MatrixController: Keyframe IDs are not unique';
      }
    };

    $scope.deleteSelectedKeyframe = function () {

      $scope.setApplicationBusy(true);

      $http.delete('/api/keyframes/'+$scope.selectedKeyframe.id).then(
        function(response){
          $('#deleteKeyframeModal').modal('hide');
          $scope.fireAlert('Jahr gelöscht');
          // Call init() instead of populateModel() in order to reassign
          // selected keyframe after reloading the data
          init();
        },
        function(error){
          console.log(error);
          $scope.fireAlert('Failed to delete keyframe: '+error.data.error.message, 'danger');
          $scope.setApplicationBusy(false);
        }
      )
    };

    $scope.triggerCreateKeyframe = function () {

      $scope.setApplicationBusy(true);

      var time = new Date($scope.inputNewKeyframeYear + '-02-01 00:00:00');
      $http.post('/api/keyframes/', {
        time: time
      }).then(
        function(response){
          $('#newKeyframeModal').modal('hide');
          var year = new Date(response.data.time).getFullYear();
          $scope.fireAlert(year + ' erfolgreich angelegt', 'success');
          populateModel().then(function(){
            $scope.setApplicationBusy(false);
          });
          $scope.inputNewKeyframeYear = '';
        },
        function(error){
          $scope.fireAlert(error.data.error.message, 'danger');
          $scope.setApplicationBusy(false);
        }
      )
    };

    /* M A T R I X */

    $scope.setRelationInMatrix = function (from, to, relation, value) {
      if (typeof from != 'string' || typeof to != 'string' || typeof relation != 'string'
          || typeof value != 'boolean') {
        return new Error('IDs must be strings and value must be boolean');
      }
      // Save value before change and check for inconsistencies
      var origA = $scope.matrix[from][to][relation],
          origB = $scope.matrix[to][from][relation];
      if (origA !== origB) {
        $scope.fireAlert('Daten sind möglicherweise nicht korrekt. Bitte lade die Seite neu.', 'danger');
        return new Error('Inconsistent data: values for relation with type '+relation+' between '+from+' and '
          +to+' do not match.');
      }
      // Update view
      $scope.matrix[from][to][relation] = value;
      $scope.matrix[to][from][relation] = value;
      // Update list of pending changes
      var hash = bitwiseXor(from, to, relation);   // same for every unique triple of values
      if ($scope.pendingChanges[hash]) {
        $scope.pendingChanges[hash].value = value;
      } else {
        $scope.pendingChanges[hash] = {
          from: from,
          to: to,
          relationType: relation,
          value: value,
          origValue: origA
        };
      }
      $scope.hasPendingChanges = true;
    };

    $scope.storeMatrixChanges = function () {

      $scope.setApplicationBusy(true);

      // Remove all those updates from the list that would not change the stored value
      var updateQueue = [];
      var updatePromises = [];
      for (var hash in $scope.pendingChanges) {
        var updateObject = $scope.pendingChanges[hash];
        if (updateObject.value !== updateObject.origValue) {
          updateQueue.push(updateObject);
        }
      }
      // Fire remaining create and delete requests and wrap them into a $q promise
      for (var idx in updateQueue) {
        var update = updateQueue[idx], promise;
        if (update.value) {
          promise = createRelation(update.from, update.to, update.relationType);
        } else {
          promise = deleteRelation(update.from, update.to, update.relationType);
        }
        updatePromises.push(promise);
      }
      var wrapperPromise = $q.all(updatePromises);
      // Evaluate the wrapper promise and react to the result
      wrapperPromise
        .then(function() {
          $scope.pendingChanges = {};
          $scope.hasPendingChanges = false;
          $scope.fireAlert('Matrix gespeichert', 'success');
          $scope.setApplicationBusy(false);
        })
        .catch(function(err){
          console.error(err);
          $scope.fireAlert('Matrix konnte nicht vollständig gespeichert werden. Bitte versuche es '
            +'erneut oder lade die Seite neu.', 'danger', 8000);
          $scope.setApplicationBusy(false);
        });
    };

    var recomputeMatrix = function () {
      var relationTypesList = {};
      $.each($scope.relationTypes, function(i,rt){
        relationTypesList[rt.id] = false;
      });
      var personIds = $scope.persons.map(function(p){
        return p.id;
      });
      var resultingMatrix = {};
      $.each(personIds, function(i,pi1) {
        resultingMatrix[pi1] = {};
        $.each(personIds, function(j,pi2){
          // deep copy the array
          resultingMatrix[pi1][pi2] = $.extend({},relationTypesList);
        });
      });
      $.each($scope.relations, function(i,r){
        resultingMatrix[r.personAId][r.personBId][r.relationTypeId] = true;
        resultingMatrix[r.personBId][r.personAId][r.relationTypeId] = true;
      });
      $scope.matrix = resultingMatrix;
    };

    /* G E N E R A L */

    var createRelation = function (from, to, relationType) {
      return $q(function(resolve, reject){
        $http.post('/api/relations/', {
          keyframeId: $scope.selectedKeyframe.id,
          relationTypeId: relationType,
          personAId: from,
          personBId: to
        }).then(
          function(response){
            resolve(response.data);
          },
          function(error){
            $scope.fireAlert('Fehler beim Erstellen einer Beziehung', 'danger');
            reject(error.data.error);
          }
        );
      });
    };

    var deleteRelation = function (from, to, relationType) {
      return $q(function(resolve, reject){
        $http.post('/api/relations/destroyByValues/', {
          keyframeId: $scope.selectedKeyframe.id,
          relationTypeId: relationType,
          personAId: from,
          personBId: to
        }).then(
          function(response){
            resolve(response.data);
          },
          function (error) {
            $scope.fireAlert('Fehler beim Löschen einer Beziehung', 'danger');
            reject(error.data.error);
          }
        );
      });
    };

    var populateModel = function () {

      // Get RelationTypes from API
      var relationTypesPromise = $http.get('/api/relationtypes/').then(
        function (response) {
          $scope.relationTypes = response.data;
        },
        function (error) { console.log(error); }
      );

      // Get Persons from API
      var peoplePromise = $http.get('/api/people/').then(
        function (response) {
          $scope.persons = response.data;
        },
        function (error) { console.log(error); }
      );

      // Get Keyframes from API, transform and sort them descending
      var keyframesPromise = $http.get('/api/keyframes/').then(
        function (response) {
          var keyframes = response.data.map(function(kf){
            return {
              id: kf.id,
              time: new Date(kf.time)
            };});
          $scope.keyframes = keyframes.sort(function(a,b){
            return b.time.getTime() - a.time.getTime();
          });
        },
        function (error) { console.log(error); }
      );

      return $q.all([relationTypesPromise, peoplePromise, keyframesPromise]);
    };

    var init = function () {

      $scope.setApplicationBusy(true);

      populateModel().then(function(){
        $scope.selectedKeyframe = $scope.keyframes[0];
        $scope.setApplicationBusy(false);
      });
    };

    init();

    // Event listeners for warning the user when he tries to leave the page without saving changes.
    $scope.$on('$locationChangeStart', function(event){
      if ($scope.hasPendingChanges) {
        var answer = confirm('Du hast Änderungen noch nicht gespeichert. Diese Seite wirklich verlassen?');
        if (!answer) event.preventDefault();
      }
    });

    window.onbeforeunload = function (event){
      if ($scope.hasPendingChanges) {
        return 'nase'; // It does not matter what we return here as long as it is a defined value
      } else {
        return undefined;
      }
    }

  });
