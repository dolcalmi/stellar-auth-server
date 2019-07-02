'use strict';

// NOTE: testUtils should be require'd before anything else in each spec file!

const StellarSdk = require('stellar-sdk');
require('mocha');
// Ensure we are using the 'as promised' libs before any tests are run:
require('chai').use(require('chai-as-promised'));

let serverKeyPair = StellarSdk.Keypair.random();

var utils = module.exports = {

  getClientPublicKey: function() {
    return 'GDH366IHIVN4OQNPUCBM23LVKKXAUOQ3P4BLMC4A2N4JOPX5XU2GTRRA';
  },

  getServerKeyPair: function() {
    return serverKeyPair;
  },

  getStellarAuthInstance: function(options) {
    var StellarAuth = require('../lib');
    return new StellarAuth(this.getServerKeyPair(), options);
  },
};
