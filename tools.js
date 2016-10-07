'use strict'
var crypto = require('crypto');
var bcrypt;
try {
  bcrypt = require('bcrypt');
  if (bcrypt && typeof bcrypt.compare !== 'function') {
    bcrypt = require('bcryptjs');
  }
} catch (err) {
  bcrypt = require('bcryptjs');
}

var SALT_WORK_FACTOR = 10;

exports.hashPwd = function (plain) {
  var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
  return bcrypt.hashSync(plain, salt);
};

exports.checkPwd = function (plain, password, next) {
  bcrypt.compare(plain, password, function (err, isMatch) {
    if (err) return next(err);
    next(null, isMatch);
  });
}

let resWarp = function (err, data, msg) {
  return {
    error: !!err,
    data: data,
    message: msg || (err ? err.message : '')
  }
}
exports.resWarp = resWarp;

exports.resSuccess = function (data, msg) {
  return exports.resWarp(null, data, msg)
}

exports.resData = function (data) {
  return resWarp(null, data, null)
}

exports.resMsg = function (msg) {
  return resWarp(null, null, msg)
};

exports.resErrMsg = function (msg) {
  return resWarp(msg, null, msg)
};


/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
exports.encryption = function (data, key, iv) {
  iv = iv || "";
  var clearEncoding = 'utf8';
  var cipherEncoding = 'base64';
  var cipherChunks = [];
  var cipher = crypto.createCipheriv('aes-256-ecb', key, iv);
  cipher.setAutoPadding(true);
  cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
  cipherChunks.push(cipher.final(cipherEncoding));
  return cipherChunks.join('');
}

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
exports.decryption = function (data, key, iv) {
  if (!data) {
    return "";
  }
  iv = iv || "";
  var clearEncoding = 'utf8';
  var cipherEncoding = 'base64';
  var cipherChunks = [];
  var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv);
  decipher.setAutoPadding(true);
  cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
  cipherChunks.push(decipher.final(clearEncoding));
  return cipherChunks.join('');
}

exports.keyFmt = function (key) {
  key = Array.from({length: 32}).map(()=>0).join('') + key;
  return key.substr(key.length - 32);
}
