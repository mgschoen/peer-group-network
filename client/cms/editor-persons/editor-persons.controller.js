angular.module('baemselcampCms')
  .controller('PersonsController', function($scope, $http) {

    $scope.persons = [];
    $scope.personInFocus = null;

    $scope.inputHasError = false;

    $scope.triggerCreatePerson = function () {
      if (!$scope.inputName || $scope.inputName == '') {
        $scope.inputHasError = true;
        return;
      }
      $scope.fireCreatePersonRequest();
    };

    $scope.fireCreatePersonRequest = function () {
      $http.post('/api/people/', {
        name: $scope.inputName,
        imgurl: $scope.inputImgurl
      }).then(
        function (response) {
          $scope.redirect('/editor/persons/');
          $scope.fireAlert('"'+response.data.name+'" erfolgreich angelegt', 'success');
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
        }
      );
    };

    $scope.triggerDeleteModal = function (event) {
      var searchId = event.currentTarget.attributes['data-person-id'].value;
      var focusPerson = $scope.persons.filter(function(p){
        return p.id == searchId;
      });
      var msg = '';
      if (focusPerson.length === 0) {
        msg = 'No Person with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      if (focusPerson.length > 1) {
        msg = 'ID not unique. Multiple Persons with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      $scope.personInFocus = focusPerson[0];
      $('#deleteModal').modal('show');
    };

    $scope.triggerEditModal = function (event) {
      var searchId = event.currentTarget.attributes['data-person-id'].value;
      var focusPerson = $scope.persons.filter(function(p){
        return p.id == searchId;
      });
      var msg = '';
      if (focusPerson.length === 0) {
        msg = 'No Person with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      if (focusPerson.length > 1) {
        msg = 'ID not unique. Multiple Persons with ID '+searchId+' found';
        $scope.fireAlert(msg, 'error');
        throw msg;
        return;
      }
      var focus = $scope.personInFocus = focusPerson[0];
      $scope.inputName = focus.name;
      $scope.inputImgurl = focus.imgurl;
      $('#editModal').modal('show');
    };

    $scope.deletePersonInFocus = function () {
      $http.delete('/api/people/'+$scope.personInFocus.id).then(
        function (response) {
          $('#deleteModal').modal('hide');
          populateModel();
          $scope.fireAlert('Person gelöscht');
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Löschen: '+error.data.error.message, 'danger');
        }
      );
    };

    $scope.updatePersonInFocus = function () {
      $http.patch('/api/people/'+$scope.personInFocus.id, {
        sentence: $scope.inputName,
        imgurl: $scope.inputImgurl
      }).then(
        function(response){
          $('#editModal').modal('hide');
          populateModel();
          $scope.fireAlert('Person gespeichert', 'success');
        },
        function(error){
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
        }
      );
    };

    $('#deleteModal').on('hide.bs.modal', function(){
      $scope.personInFocus = null;
    });

    $('#editModal').on('hide.bs.modal', function(){
      $scope.personInFocus = null;
    });

    var populateModel = function () {
      $http.get('/api/people/').then(
        function (response) {
          $scope.persons = response.data;
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
