angular.module('baemselcampCms')
  .controller('PersonsController', function($scope, $http) {

    var init = function () {
      $http.get('/api/people/').then(
        function (response) {
          $scope.persons = response.data;
        },
        function (error) {
          console.log(error);
        }
      );
    };

    init();

  });
