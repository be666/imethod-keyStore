(function (ipc) {
  'use strict';

  angular
    .module('MyApp')
    .service('AuthService', AuthService);

  /** @ngInject */
  function AuthService($q, $rootScope, $sessionStorage) {
    var vm = this;
    vm.$storage = $sessionStorage.$default({
      authToken: ''
    });

    return {
      isAuthenticated() {
        return !!vm.$storage.authToken
      },
      authenticate(username, password, next){
        ipc.once('auth-login-reply', function (evt, res) {
          if (!res.error) {
            vm.$storage.authToken = res.data;
          }
          next(null, res);
        });
        ipc.send('auth-login', username, password)
      },
      logout(){
        ipc.once('auth-logout-reply', function (evt, res) {
          if (!res.error) {
            vm.$storage.authToken = '';
          }
        });
        ipc.send('auth-logout', vm.$storage.authToken)
      },
      valid(password, next){
        ipc.once('auth-valid-reply', function (evt, res) {
          next(null, res);
        });
        ipc.send('auth-valid', vm.$storage.authToken, password)
      }
    }
  }
})(ipc);
