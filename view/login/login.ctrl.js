(function (ipc) {
  'use strict';

  angular
    .module('MyApp')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($rootScope, $location, AuthService) {
    var vm = this;
    vm.username = 'admin';
    vm.password = '123456';

    vm.login = function () {
      AuthService.authenticate(vm.username, vm.password, function (err,res) {
        if (!res.error) {
          $location.path("/key-store");
          $rootScope.$apply();
        }
      });
    };
  }
})(ipc);
