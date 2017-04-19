angular.module('baemselcampCms')

  .config(['$locationProvider', '$routeProvider',
    function config ($locationProvider, $routeProvider) {

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
          templateUrl: './editor-persons-list/editor-persons-list.template.html'
        })
        .when('/editor/persons/list', {
          templateUrl: './editor-persons-list/editor-persons-list.template.html'
        })
        .when('/editor/persons/new', {
          templateUrl: './editor-persons-new/editor-persons-new.template.html'
        })
        .when('/editor/persons/edit', {
          templateUrl: './editor-persons-edit/editor-persons-edit.template.html'
        })
        .when('/editor/relations', {
          templateUrl: './editor-relations-list/editor-relations-list.template.html'
        })
        .when('/editor/relations/list', {
          templateUrl: './editor-relations-list/editor-relations-list.template.html'
        })
        .when('/editor/relations/new', {
          templateUrl: './editor-relations-new/editor-relations-new.template.html'
        })
        .when('/editor/relations/edit', {
          templateUrl: './editor-relations-edit/editor-relations-edit.template.html'
        })
        .otherwise('/editor');

    }])

  .controller('MainController', function($scope){
    $scope.redirect = function (url) {
      location.hash = url;
    }
  });
