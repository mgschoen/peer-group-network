angular.module('baemselcampCms')
  .controller('RelationsController', function($scope, $http){

    $scope.relationTypes = [];
    $scope.relationTypeInFocus = null;

    $scope.inputColor = '#000000';
    $scope.inputIcon = 'asterisk';
    $scope.inputHasError = false;

    $scope.receivedApiError = false;

    $scope.triggerCreateRelationType = function () {
      if (!$scope.inputSentence || !$scope.inputColor || !$scope.inputIcon ||
          $scope.inputSentence == '' || $scope.inputColor == '' ||$scope.inputIcon == '') {
        $scope.inputHasError = true;
        return;
      }
      $scope.fireCreateRelationTypeRequest();
    };

    $scope.fireCreateRelationTypeRequest = function () {
      $http.post('/api/relationtypes/', {
        sentence: $scope.inputSentence,
        color: $scope.inputColor,
        icon: $scope.inputIcon
      }).then(
        function (response) {
          $scope.redirect('/editor/relations/');
          $scope.fireAlert('Beziehungstyp "'+response.data.sentence+'" erfolgreich gespeichert', 'success');
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
        }
      );
    };

    $scope.triggerDeleteModal = function (event) {
      var searchId = event.currentTarget.attributes['data-relationtype-id'].value;
      var focusRelationType = $scope.relationTypes.filter(function(rt){
        return rt.id == searchId;
      });
      var msg = '';
      if (focusRelationType.length === 0) {
        msg = 'No RelationType with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      if (focusRelationType.length > 1) {
        msg = 'ID not unique. Multiple RelationTypes with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      $scope.relationTypeInFocus = focusRelationType[0];
      $('#deleteModal').modal('show');
    };

    $scope.triggerEditModal = function (event) {
      var searchId = event.currentTarget.attributes['data-relationtype-id'].value;
      var focusRelationType = $scope.relationTypes.filter(function(rt){
        return rt.id == searchId;
      });
      var msg = '';
      if (focusRelationType.length === 0) {
        msg = 'No RelationType with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      if (focusRelationType.length > 1) {
        msg = 'ID not unique. Multiple RelationTypes with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      var focus = $scope.relationTypeInFocus = focusRelationType[0];
      $scope.inputSentence = focus.sentence;
      $scope.inputColor = focus.color;
      $scope.inputIcon = focus.icon;
      $('#editModal').modal('show');
    };

    $scope.deleteRelationTypeInFocus = function () {
      $http.delete('/api/relationtypes/'+$scope.relationTypeInFocus.id).then(
        function (response) {
          $('#deleteModal').modal('hide');
          populateModel();
          $scope.fireAlert('Beziehungstyp gelöscht');
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Löschen: '+error.data.error.message, 'danger');
        }
      );
    };

    $scope.updateRelationTypeInFocus = function () {
      $http.patch('/api/relationtypes/'+$scope.relationTypeInFocus.id, {
        sentence: $scope.inputSentence,
        color: $scope.inputColor,
        icon: $scope.inputIcon
      }).then(
        function(response){
          $('#editModal').modal('hide');
          populateModel();
          $scope.fireAlert('Beziehungstyp gespeichert', 'success');
        },
        function(error){
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
        }
      );
    };

    $('#deleteModal').on('hide.bs.modal', function(){
      $scope.relationTypeInFocus = null;
    });

    $('#editModal').on('hide.bs.modal', function(){
      $scope.relationTypeInFocus = null;
    });

    var populateModel = function () {
      return $http.get('/api/relationtypes/').then(
        function (response) {
          $scope.relationTypes = response.data;
          $('[data-toggle="tooltip"]').tooltip();
        },
        function (error) {
          console.log(error);
        }
      );
    };

    var init = function () {
      populateModel();
    };

    init();

  });
