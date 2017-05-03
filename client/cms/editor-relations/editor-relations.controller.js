angular.module('baemselcampCms')
  .controller('RelationsController', function($scope, $http){

    var init = function () {
      $http.get('/api/relationtypes/').then(
        function (response) {
          $scope.relationTypes = response.data;
        },
        function (error) {
          console.log(error);
        }
      );
    };

    init();

  });
