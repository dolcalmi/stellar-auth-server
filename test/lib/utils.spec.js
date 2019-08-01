const { Transaction } = require('stellar-sdk');
var testUtils = require('../test-utils');
var utils = require('../../lib/utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth - Utils', function() {
  const clientPublicKey = testUtils.getClientPublicKey();

  it('Should return true with valid public key', function() {
    expect(utils.isValidPublicKey(clientPublicKey)).to.equal(true);
  });

  it('Should return false with invalid public key', function() {
    expect(utils.isValidPublicKey(clientPublicKey + 'D')).to.equal(false);
    expect(utils.isValidPublicKey(123)).to.equal(false);
    expect(utils.isValidPublicKey('')).to.equal(false);
    expect(utils.isValidPublicKey()).to.equal(false);
    expect(utils.isValidPublicKey(null)).to.equal(false);
  });

});
