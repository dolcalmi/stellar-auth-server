const StellarSdk = require('stellar-sdk');
const merge = require('lodash.merge');
const challenge = require('./challenge');
const verify = require('./verify');

function StellarAuth(serverKeyPair, options) {
  this.serverKeyPair = serverKeyPair;

  this.options = merge({
    challengeExpiresIn: 300, // 5 minutes
    invalidSequence: '0',
    anchorName: 'Anchor server',
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  }, options);
}

StellarAuth.prototype = {

  challenge(clientPublicKey) {
    return challenge.call(this, clientPublicKey);
  },

  verify(txBase64) {
    return verify.call(this, txBase64);
  },

  setOption(key, value) {
    this.options[key] = value;
  },

  getOption(key) {
    return this.options[key];
  },
};

module.exports = StellarAuth;
