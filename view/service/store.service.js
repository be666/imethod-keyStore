(function (ipc) {
  'use strict';

  angular
    .module('MyApp')
    .service('StoreService', StoreService);

  /** @ngInject */
  function StoreService($q, $rootScope) {
    var vm = this;

    return {
      insert: function (name, password, info, key, next) {
        ipc.once('key-store-insert-reply', function (evt, res) {
          next(res.error);
        });
        ipc.send('key-store-insert', name, password, info, key)
      },
      list: function (next) {
        ipc.once('key-store-list-reply', function (evt, res) {
          next(null, res);
        });
        ipc.send('key-store-list')
      },
      decode: function (id, key, next) {
        ipc.once('key-store-decode-reply', function (evt, res) {
          next(null, res);
        });
        ipc.send('key-store-decode', id, key)
      },
      update: function (id, name, password, info, key, next) {
        ipc.once('key-store-update-reply', function (evt, res) {
          next(null, res);
        });
        ipc.send('key-store-update', id, name, password, info, key)
      },
      query: function (id, next) {
        ipc.once('key-store-query-reply', function (evt, res) {
          next(null, res);
        });
        ipc.send('key-store-query', id)
      }
    }
  }
})(ipc);
