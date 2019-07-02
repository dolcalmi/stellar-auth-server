'use strict';

// NOTE: testUtils should be require'd before anything else in each spec file!

const StellarSdk = require('stellar-sdk');
require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));

let serverKeyPair = StellarSdk.Keypair.random();
let clientKeyPair = StellarSdk.Keypair.fromSecret('SDNEEPE7IUAAVVFD26RBFAT5G3SR2SOQMT265ETXEWIM4MQZHUJDYDMT');

var utils = module.exports = {

  getClientPublicKey: function() {
    return clientKeyPair.publicKey();
  },

  getClientKeyPair: function() {
    return clientKeyPair;
  },

  getServerKeyPair: function() {
    return serverKeyPair;
  },

  getStellarAuthInstance: function(options) {
    var StellarAuth = require('../lib');
    return new StellarAuth(this.getServerKeyPair(), options);
  },
};
