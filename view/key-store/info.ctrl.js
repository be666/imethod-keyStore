(function () {
  'use strict';
  const keyNum = '1234567890';

  const keyLowChar = Array.from({length: 26}).map(function (n, i) {
    return String.fromCharCode(97 + i)
  }).join('');

  const keyUpChar = Array.from({length: 26}).map(function (n, i) {
    return String.fromCharCode(65 + i)
  }).join('');

  const keySp = '#$@!&.><';

  angular
    .module('MyApp')
    .controller('KeyStoreInfoController', KeyStoreInfoController);

  /** @ngInject */
  function KeyStoreInfoController($rootScope, $location, $routeParams, $scope, StoreService) {
    var vm = this;

    vm.keyLengths = [6, 8, 12, 16];
    vm.keyLength = 6;

    vm.keyId = $routeParams.keyId;

    if (vm.keyId) {
      StoreService.query(vm.keyId, function (err, res) {
        if (!err) {
          vm.name = res.data.name;
          vm.info = res.data.info;
        }
        $scope.$apply();
      })
    }

    vm.genKey = function () {
      let keyChar = '';
      if (vm.keyTypeSel.includes('数字')) {
        keyChar += keyNum;
      }
      if (vm.keyTypeSel.includes('小写字母')) {
        keyChar += keyLowChar;
      }

      if (vm.keyTypeSel.includes('大写字母')) {
        keyChar += keyUpChar;
      }

      if (vm.keyTypeSel.includes('特殊字符')) {
        keyChar += keySp;
      }
      vm.password = Array.from({length: vm.keyLength}).map(function (n, i) {
        let index = Math.ceil(Math.random() * keyChar.length) - 1;
        return keyChar.charAt(index)
      }).join('');
    };

    vm.keyTypes = ['数字', '小写字母', '大写字母', '特殊字符'];
    vm.keyTypeSel = ['数字'];
    vm.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      }
      else {
        list.push(item);
      }
    };

    vm.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    vm.submit = function () {
      if (!vm.keyId) {
        StoreService.insert(vm.name, vm.password, vm.info, vm.key, function (err) {
          if (!err) {
            $location.url('/key-store')
            $rootScope.$apply();
          }
        })
      } else {
        StoreService.update(vm.keyId, vm.name, vm.password, vm.info, vm.key, function (err) {
          if (!err) {
            $location.url('/key-store')
            $rootScope.$apply();
          }
        })
      }
    };

    vm.cancel = function () {
      $location.url('/key-store')
      $rootScope.$apply();
    }


    vm.clipboard=function (text) {
      $rootScope.clipboard(text)
    }
  }

})();
