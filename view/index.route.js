(function () {
  'use strict';

  angular
    .module('MyApp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login', {
        state:'login',
        templateUrl: 'view/login/login.html',
        controller: 'LoginController',
        controllerAs: 'login'
      })
      .when('/key-store', {
        templateUrl: 'view/key-store/list.html',
        controller: 'KeyStoreListController',
        controllerAs: 'kList',
        requiresAuth: true
      })
      .when('/key-store/info', {
        templateUrl: 'view/key-store/info.html',
        controller: 'KeyStoreInfoController',
        controllerAs: 'kInfo',
        requiresAuth: true
      })
      .when('/key-store/:keyId', {
        templateUrl: 'view/key-store/info.html',
        controller: 'KeyStoreInfoController',
        controllerAs: 'kInfo',
        requiresAuth: true
      });

    $routeProvider.otherwise('/key-store');

    $locationProvider.html5Mode(false);
  }

})();
