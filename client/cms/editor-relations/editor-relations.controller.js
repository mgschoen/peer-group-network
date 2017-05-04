angular.module('baemselcampCms')
  .controller('RelationsController', function($scope, $http){

    $scope.relationTypes = [];
    $scope.relationTypeInFocus = null;

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
