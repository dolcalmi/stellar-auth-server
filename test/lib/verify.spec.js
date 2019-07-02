const MockDate = require('mockdate');
const { Transaction, Keypair } = require("stellar-sdk");
var testUtils = require('../test-utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth - Verify', function() {
  const clientPublicKey = testUtils.getClientPublicKey();
  const txChallengeBase64 = stellarAuth.challenge(clientPublicKey);

  it('Should be valid', function() {
    const tx = new Transaction(txChallengeBase64);
    tx.sign(testUtils.getClientKeyPair());
    const txSigned = tx.toEnvelope().toXDR("base64");
    expect(stellarAuth.verify(txSigned)).to.be.fulfilled;
    expect(stellarAuth.verify(txSigned)).to.become(tx.hash().toString("hex"));
  });

  it('Should be invalid without signature', function() {
    const tx = new Transaction(txChallengeBase64);
    const txBase64 = tx.toEnvelope().toXDR("base64");
    expect(stellarAuth.verify(txBase64)).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with other signature', function() {
    const tx = new Transaction(txChallengeBase64);
    tx.sign(Keypair.random());
    const txSigned = tx.toEnvelope().toXDR("base64");
    expect(stellarAuth.verify(txSigned)).to.be.rejectedWith('stellar-auth.errors.invalid-signature');
  });

  it('Should be invalid for expired time', function() {
    MockDate.set('2100-11-22');
    const tx = new Transaction(txChallengeBase64);
    tx.sign(testUtils.getClientKeyPair());
    const txSigned = tx.toEnvelope().toXDR("base64");
    expect(stellarAuth.verify(txSigned)).to.be.rejectedWith('stellar-auth.errors.expired-transaction');
    MockDate.reset();
  });
});
