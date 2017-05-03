angular.module('baemselcampCms')

  /**
   * App configuration
   */
  .config(['$locationProvider', '$routeProvider',
    function ($locationProvider, $routeProvider) {

      $locationProvider.hashPrefix('');

      $routeProvider
        .when('/login', {
          templateUrl: './login/login.template.html'
        })
        .when('/editor', {
          templateUrl: './editor-matrix/editor-matrix.template.html'
        })
        .when('/editor/matrix', {
          templateUrl: './editor-matrix/editor-matrix.template.html'
        })
        .when('/editor/persons', {
          templateUrl: './editor-persons/editor-persons-list/editor-persons-list.template.html'
        })
        .when('/editor/persons/list', {
          templateUrl: './editor-persons/editor-persons-list/editor-persons-list.template.html'
        })
        .when('/editor/persons/new', {
          templateUrl: './editor-persons/editor-persons-new/editor-persons-new.template.html'
        })
        .when('/editor/persons/edit', {
          templateUrl: './editor-persons/editor-persons-edit/editor-persons-edit.template.html'
        })
        .when('/editor/relations', {
          templateUrl: './editor-relations/editor-relations-list/editor-relations-list.template.html'
        })
        .when('/editor/relations/list', {
          templateUrl: './editor-relations/editor-relations-list/editor-relations-list.template.html'
        })
        .when('/editor/relations/new', {
          templateUrl: './editor-relations/editor-relations-new/editor-relations-new.template.html'
        })
        .when('/editor/relations/edit', {
          templateUrl: './editor-relations/editor-relations-edit/editor-relations-edit.template.html'
        })
        .otherwise('/editor');

    }])

  /**
   * App initialization
   */
  .run(['$cookies', '$rootScope', '$location', '$http',
    function($cookies, $rootScope, $location, $http){

      var credentials = $cookies.getObject('bc-credentials');
      $rootScope.credentials = credentials;
      if (credentials && credentials.userId && credentials.accessToken) {
        $http.defaults.headers.common['Authorization'] = credentials.accessToken;
        $http.get('/api/users/'+credentials.userId).then(
          // Success case
          function (response) {
            // all is fine
          },
          // Error case (credentials invalid)
          function (error) {
            $cookies.remove('bc-credentials');
            $rootScope.credentials = null;
            $http.defaults.headers.common['Authorization'] = '';
            $location.path('/login');
          }
        );
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if (!$rootScope.credentials && $location.path() != '/login') {
          $location.path('/login');
        } else if ($rootScope.credentials && $location.path() == '/login') {
          $location.path('/editor');
        }
      });

    }])

  /**
   * Main Controller of the app
   */
  .controller('MainController', function($scope, $location, $http, $cookies, $rootScope){

    /**
     * Redirect to a relative path inside the app
     * @param path
       */
    $scope.redirect = function (path) {
      $location.path(path);
    };

    /**
     * Send a logout request to the API
     */
    $scope.fireLogoutRequest = function () {

      $http.post('/api/users/logout').then(
        function (response) {
          $cookies.remove('bc-credentials');
          $rootScope.credentials = null;
          $http.defaults.headers.common['Authorization'] = '';
          $scope.redirect('/login');
        },
        function (error) {
          console.log(error);
        }
      );

    };

  });
