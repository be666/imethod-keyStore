const {app, ipcMain} = require('electron');
const path = require('path');
const {hashPwd, checkPwd, resWarp, resData, resMsg}=require('../../tools');
const authPath = path.join(app.getPath('userData'), 'auth.db');
const authTokenPath = path.join(app.getPath('userData'), 'authToken.db');
const DataBase = require('nedb')
  , authDB = new DataBase({filename: authPath, autoload: true})
  , authTokenDB = new DataBase({filename: authTokenPath, autoload: true});

const jwt = require('jsonwebtoken');

const cert = 'bqxu.me';

authDB.count({}, function (err, count) {
  if (count == 0) {
    let user = {
      username: 'admin',
      password: hashPwd('123456')
    };
    authDB.insert(user, function (err, newUser) {
      if (err) {
        return console.log(err);
      }
    })
  }
});

ipcMain.on('auth-login', function (event, username, password) {
  authDB.findOne({username: username}, function (err, user) {
    if (err) {
      return event.sender.send('auth-login-reply', resWarp(err))
    } else {
      checkPwd(password, user.password, function (err, isMatch) {
        if (!isMatch) {
          return event.sender.send('auth-login-reply', resWarp(err, null, '密码错误'));
        }
        if (err) {
          return event.sender.send('auth-login-reply', resWarp(err));
        }
        let token = jwt.sign({userId: user._id, username: user.username}, cert);
        authTokenDB.insert({userId: user._id, authToken: token});
        return event.sender.send('auth-login-reply', resData(token));
      })
    }
  });
});

ipcMain.on('auth-check', function (event, authToken) {
  jwt.verify(authToken, cert, function (err, token) {
    if (err) {
      return event.sender.send('auth-check-reply', resWarp(err, null, '无效的authToken'))
    }
    authTokenDB.findOne({authToken: authToken}, function (err, auth) {
      if (!err && auth) {
        return event.sender.send('auth-check-reply', resData(token))
      }
      event.sender.send('auth-check-reply', resWarp(err, null, '无效的authToken'))
    });
  })
});

ipcMain.on('auth-valid', function (event, authToken, password) {
  jwt.verify(authToken, cert, function (err, token) {
    if (err) {
      return event.sender.send('auth-valid-reply', resWarp(err, null, '无效的authToken'))
    }
    authDB.findOne({_id: token.userId}, function (err, user) {
      if (err) {
        return event.sender.send('auth-valid-reply', resWarp(err))
      } else {
        checkPwd(password, user.password, function (err, isMatch) {
          if (!isMatch) {
            return event.sender.send('auth-valid-reply', resWarp(err, null, '密码错误'));
          }
          return event.sender.send('auth-valid-reply', resMsg('success'));
        })
      }
    });
  })
});

ipcMain.on('auth-logout', function (event, authToken) {
  authTokenDB.remove({authToken: authToken}, function (err) {
    if (err) {
      event.sender.send('auth-logout-reply', 'success')
    }
  })
});
