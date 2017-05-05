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
          location.hash = '/editor/relations/';
        },
        function (error) {
          console.log(error);
          $scope.receivedApiError = true;
          $scope.apiError = error.message;
        }
      );
    };

    $scope.triggerDeleteModal = function (event) {
      var searchId = event.currentTarget.attributes['data-relationtype-id'].value;
      var focusRelationType = $scope.relationTypes.filter(function(rt){
        return rt.id == searchId;
      });
      if (focusRelationType.length === 0) {
        throw 'No RelationType with ID '+searchId+' found';
        return;
      }
      if (focusRelationType.length > 1) {
        throw 'ID not unique. Multiple RelationTypes with ID '+searchId+' found';
        return;
      }
      $scope.relationTypeInFocus = focusRelationType[0];
      $('#deleteModal').modal('show');
    };

    $scope.deleteRelationTypeInFocus = function () {
      $http.delete('/api/relationtypes/'+$scope.relationTypeInFocus.id).then(
        function (response) {
          $('#deleteModal').modal('hide');
          populateModel();
        },
        function (error) {
          console.log(error);
        }
      );
    };

    $('#deleteModal').on('hide.bs.modal', function(){
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
