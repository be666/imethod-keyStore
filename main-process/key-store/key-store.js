const {app, ipcMain} = require('electron');
const path = require('path');
const {encryption, decryption, keyFmt, resMsg, resWarp, resData, resErrMsg}=require('../../tools');
const keyStorePath = path.join(app.getPath('userData'), 'keyStore.db');
const DataBase = require('nedb')
  , keyStoreDB = new DataBase({filename: keyStorePath, autoload: true});

const aesKey = 'bqxu2016';

ipcMain.on('key-store-insert', function (evt, name, password, info, key) {
  keyStoreDB.insert({
    name: name,
    info: info,
    password: encryption(password, keyFmt(key || aesKey))
  }, function (err, newKey) {
    if (err) {
      return evt.sender.send('key-store-insert-reply', resWarp(err));
    }
    evt.sender.send('key-store-insert-reply', resMsg('success'))
  })
});

ipcMain.on('key-store-update', function (evt, id, name, password, info, key) {
  keyStoreDB.update({_id: id}, {
    name: name,
    info: info,
    password: encryption(password, keyFmt(key || aesKey))
  }, {}, function (err, newKey) {
    if (err) {
      return evt.sender.send('key-store-update-reply', resWarp(err));
    }
    evt.sender.send('key-store-update-reply', resMsg('success'))
  })
});

ipcMain.on('key-store-list', function (evt) {
  keyStoreDB.find({}).projection({name: 1, info: 1}).exec(function (err, keyList) {
    if (err) {
      return evt.sender.send('key-store-list-reply', resWarp(err));
    }
    evt.sender.send('key-store-list-reply', resData(keyList))
  });
});

ipcMain.on('key-store-query', function (evt, id) {
  keyStoreDB.findOne({_id: id}).projection({name: 1, info: 1}).exec(function (err, keyStroe) {
    if (err) {
      return evt.sender.send('key-store-query-reply', resWarp(err));
    }
    evt.sender.send('key-store-query-reply', resData(keyStroe))
  });
});

ipcMain.on('key-store-decode', function (evt, id, key) {
  keyStoreDB.findOne({_id: id}, function (err, keyStore) {
    if (err) {
      return evt.sender.send('key-store-decode-reply', resWarp(err));
    }
    let dc = '';
    try {
      dc = decryption(keyStore.password, keyFmt(key || aesKey));
    } catch (e) {
      return evt.sender.send('key-store-decode-reply', resErrMsg('密钥错误'));
    }
    evt.sender.send('key-store-decode-reply', resData({
      id: id,
      pwd: dc,
    }))
  });
});
