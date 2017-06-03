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

      $scope.setApplicationBusy(true);

      $http.post('/api/people/', {
        name: $scope.inputName,
        imgurl: $scope.inputImgurl
      }).then(
        function (response) {
          $scope.redirect('/editor/persons/');
          $scope.fireAlert('"'+response.data.name+'" erfolgreich angelegt', 'success');
          $scope.setApplicationBusy(false);
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
          $scope.setApplicationBusy(false);
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

      $scope.setApplicationBusy(true);

      $http.delete('/api/people/'+$scope.personInFocus.id).then(
        function (response) {
          $('#deleteModal').modal('hide');
          populateModel();
          $scope.fireAlert('Person gelöscht');
          $scope.setApplicationBusy(false);
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Löschen: '+error.data.error.message, 'danger');
          $scope.setApplicationBusy(false);
        }
      );
    };

    $scope.updatePersonInFocus = function () {

      $scope.setApplicationBusy(true);

      $http.patch('/api/people/'+$scope.personInFocus.id, {
        sentence: $scope.inputName,
        imgurl: $scope.inputImgurl
      }).then(
        function(response){
          $('#editModal').modal('hide');
          populateModel();
          $scope.fireAlert('Person gespeichert', 'success');
          $scope.setApplicationBusy(false);
        },
        function(error){
          console.log(error);
          $scope.fireAlert('Fehler beim Speichern: '+error.data.error.message, 'danger');
          $scope.setApplicationBusy(false);
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
      $scope.setApplicationBusy(true);
      $http.get('/api/people/').then(
        function (response) {
          $scope.persons = response.data;
          $scope.setApplicationBusy(false);
        },
        function (error) {
          console.log(error);
          $scope.fireAlert('Fehler beim Laden. Bitte versuche es noch einmal.', 'danger');
          $scope.setApplicationBusy(false);
        }
      );
    };

    var init = function () {
      populateModel();
    };

    init();

  });
