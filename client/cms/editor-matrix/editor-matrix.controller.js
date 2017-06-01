angular.module('baemselcampCms')
  .controller('MatrixController', function($scope, $http, $q){

    $scope.relationTypes = [];
    $scope.persons = [];
    $scope.keyframes = [];
    $scope.selectedKeyframe = null;
    $scope.relations = [];
    $scope.matrix = [];

    $scope.$watch('selectedKeyframe', function(){
      if ($scope.selectedKeyframe && $scope.selectedKeyframe.id) {
        $http.get('/api/relations?filter[where][keyframeId]='+$scope.selectedKeyframe.id).then(
          function (response) {
            $scope.relations = response.data;
            recomputeMatrix();
          },
          function (error) { console.log(error); }
        )
      }
    });

    $scope.$watch('matrix', function(){
      $('[data-toggle="tooltip"]').tooltip();
    });

    /* * * * * * * * * * * * * * * * * */
    /* K E Y F R A M E   M E T H O D S */
    /* * * * * * * * * * * * * * * * * */

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
        }
      )
    };

    $scope.triggerCreateKeyframe = function () {
      var time = new Date($scope.inputNewKeyframeYear + '-02-01 00:00:00');
      $http.post('/api/keyframes/', {
        time: time
      }).then(
        function(response){
          $('#newKeyframeModal').modal('hide');
          var year = new Date(response.data.time).getFullYear();
          $scope.fireAlert(year + ' erfolgreich angelegt', 'success');
          populateModel();
          $scope.inputNewKeyframeYear = '';
        },
        function(error){
          $scope.fireAlert(error.data.error.message, 'danger');
        }
      )
    };

    /* * * * * * * * * * * * * * * * * */
    /* M A T R I X   M E T H O D S     */
    /* * * * * * * * * * * * * * * * * */

    $scope.setRelationInMatrix = function (from, to, relation, value) {
      if (typeof from != 'string' || typeof to != 'string' || typeof relation != 'string'
          || typeof value != 'boolean') {
        return new Error('IDs must be strings and value must be boolean');
      }
      $scope.matrix[from][to][relation] = value;
      $scope.matrix[to][from][relation] = value;
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
          // $.extend({},array) deep copies the array
          resultingMatrix[pi1][pi2] = $.extend({},relationTypesList);
        });
      });
      $.each($scope.relations, function(i,r){
        resultingMatrix[r.personAId][r.personBId][r.relationTypeId] = true;
        resultingMatrix[r.personBId][r.personAId][r.relationTypeId] = true;
      });
      $scope.matrix = resultingMatrix;
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

      populateModel().then(function(){
        $scope.selectedKeyframe = $scope.keyframes[0];
      });
    };

    init();

  });
