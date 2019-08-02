const MockDate = require('mockdate');
const { Transaction, Keypair, Networks } = require('stellar-sdk');
var testUtils = require('../test-utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth - Verify', function() {
  const clientPublicKey = testUtils.getClientPublicKey();
  const txChallengeBase64 = stellarAuth.challenge(clientPublicKey);
  const networkPassphrase = Networks.TESTNET;

  it('Should be valid', async function() {
    const tx = new Transaction(txChallengeBase64, networkPassphrase);
    tx.sign(testUtils.getClientKeyPair());
    const txSigned = tx.toEnvelope().toXDR('base64');
    await expect(stellarAuth.verify(txSigned)).to.be.fulfilled;
    await expect(stellarAuth.verify(txSigned)).to.become({
      clientPublicKey,
      hash: tx.hash().toString('hex'),
    });
  });

  it('Should be invalid without signature', async function() {
    const tx = new Transaction(txChallengeBase64, networkPassphrase);
    const txBase64 = tx.toEnvelope().toXDR('base64');
    await expect(stellarAuth.verify(txBase64)).to.be.rejectedWith('stellar-auth.errors.invalid-transaction');
  });

  it('Should be invalid with other signature', async function() {
    const tx = new Transaction(txChallengeBase64, networkPassphrase);
    tx.sign(Keypair.random());
    const txSigned = tx.toEnvelope().toXDR('base64');
    await expect(stellarAuth.verify(txSigned)).to.be.rejectedWith('stellar-auth.errors.invalid-signature');
  });

  it('Should be invalid for expired time', async function() {
    MockDate.set('2100-11-22');
    const tx = new Transaction(txChallengeBase64, networkPassphrase);
    tx.sign(testUtils.getClientKeyPair());
    const txSigned = tx.toEnvelope().toXDR('base64');
    await expect(stellarAuth.verify(txSigned)).to.be.rejectedWith('stellar-auth.errors.expired-transaction');
    MockDate.reset();
  });
});
