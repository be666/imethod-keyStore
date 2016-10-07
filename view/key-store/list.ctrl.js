(function () {
  'use strict';

  angular
    .module('MyApp')
    .controller('KeyStoreListController', KeyStoreListController);

  /** @ngInject */
  function KeyStoreListController($location, $mdDialog, $scope, $rootScope, StoreService, AuthService) {
    var vm = this;
    vm.itemList = [];

    vm.addKeyStore = function () {
      $location.url('/key-store/info')
    }

    StoreService.list(function (err, res) {
      if (err || res.error) {
        return
      }
      vm.itemList = res.data;
      $scope.$apply();
    });

    vm.show = function (item, ev) {
      var confirm = $mdDialog.prompt()
        .title(`是否显示${item.name}密码?`)
        .textContent('请输入解密密钥')
        .placeholder('密钥')
        .ariaLabel('显示')
        .targetEvent(ev)
        .ok('显示')
        .cancel('取消');

      $mdDialog.show(confirm).then(function (result) {
        StoreService.decode(item._id, result, function (err, res) {
          if (err || res.error) {
            return $rootScope.showError(ev, res.message);
          }
          let item = vm.itemList.find(function (n) {
            return n._id == res.data.id;
          });
          item.pwd = res.data.pwd;
          $scope.$apply();
        });
      }, function () {

      });
    }

    vm.edit = function (item, ev) {
      var confirm = $mdDialog.prompt()
        .title(`登录验证!`)
        .textContent('请输入登录密码')
        .placeholder('密码')
        .ariaLabel('请输入登录密码')
        .targetEvent(ev)
        .ok('确定')
        .cancel('取消');

      $mdDialog.show(confirm).then(function (result) {
        AuthService.valid(result, function (err, res) {
          if (err || res.error) {
            return $rootScope.showError(ev, res.message);
          }
          $location.path(`/key-store/${item._id}`);
          $rootScope.$apply();
        });
      }, function () {

      });

    }
  }
})();
