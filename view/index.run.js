(function () {
  'use strict';

  angular
    .module('MyApp')
    .run(authHookRunBlock)
    .run(runBlock)

  /** @ngInject */
  function runBlock($log) {
    $log.debug('runBlock end');
  }


  function authHookRunBlock($rootScope, $location, $mdDialog, AuthService) {

    $rootScope.showError = function (ev, errMsg, title) {
      $mdDialog.show(
        $mdDialog.alert()
          .clickOutsideToClose(true)
          .title(title || '错误')
          .textContent(errMsg)
          .ariaLabel('错误提示')
          .ok('确定')
          .targetEvent(ev)
      );
    };

    $rootScope.showLoading = function () {

    };

    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      if (next.$$route && next.$$route.requiresAuth) {
        if (!AuthService.isAuthenticated()) {
          evt.preventDefault();
          $location.url('/login')
        }
      }
    });
  }
})();
