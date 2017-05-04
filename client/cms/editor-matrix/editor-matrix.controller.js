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
            console.log($scope.relations);
            recomputeMatrix();
          },
          function (error) { console.log(error); }
        )
      }
    });

    $scope.$watch('matrix', function(){
      $('[data-toggle="tooltip"]').tooltip();
    });

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
          resultingMatrix[pi1][pi2] = $.extend({},relationTypesList);
        });
      });
      $.each($scope.relations, function(i,r){
        resultingMatrix[r.personId[0]][r.personId[1]][r.relationTypeId] = true;
        resultingMatrix[r.personId[1]][r.personId[0]][r.relationTypeId] = true;
      });
      console.log(resultingMatrix);
      $scope.matrix = resultingMatrix;
      $('[data-toggle="tooltip"]').tooltip();
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

      // Get Relations from API
      var relationsPromise = $http.get('/api/relations/').then(
        function (response) {
          $scope.relations = response.data;
        },
        function (error) { console.log(error); }
      );

      return $q.all([relationTypesPromise, peoplePromise, keyframesPromise, relationsPromise]);
    };

    var init = function () {

      populateModel().then(function(){
        $scope.selectedKeyframe = $scope.keyframes[0];
      });

    };

    init();

  });
