angular.module('baemselcampCms')
  .controller('LoginController', function($scope, $http, $rootScope, $cookies){

    $scope.hasError = false;

    $scope.fireLoginRequest = function () {

      $scope.setApplicationBusy(true);

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
            $scope.redirect('/editor');
            $scope.fireAlert('Login erfolgreich', 'success');
            $scope.setApplicationBusy(false);
          },
          function (error) {
            $scope.hasError = true;
            $scope.fireAlert('Fehler beim Login: '+error.data.error.message, 'danger');
            $scope.setApplicationBusy(false);
          });

    };

  });
