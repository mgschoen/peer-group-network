angular.module('baemselcampCms')
  .controller('LoginController', function($scope, $http, $rootScope, $cookies){

    $scope.hasError = false;

    $scope.fireLoginRequest = function () {

      var requestBody = {
        username: $scope.username,
        password: $scope.password
      };

      $http.post('/api/users/login', requestBody)
        .then(
          function (response) {
            $scope.hasError = false;
            var credentials = {
              userId: response.data.userId,
              accessToken: response.data.id
            };
            $rootScope.credentials  = credentials;
            $cookies.putObject('bc-credentials', credentials);
            $http.defaults.headers.common['Authorization'] = credentials.accessToken;
            location.hash = '/editor';
          },
          function (error) {
            $scope.hasError = true;
          });

    }

  });
