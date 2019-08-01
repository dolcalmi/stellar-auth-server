const { Transaction } = require('stellar-sdk');
var testUtils = require('../test-utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth - Challenge', function() {
  const clientPublicKey = testUtils.getClientPublicKey();
  const txBase64 = stellarAuth.challenge(clientPublicKey);
  const tx = new Transaction(txBase64);

  it('Should have an invalid sequence', function() {
    expect(tx.sequence).to.equal('0');
  });

  it('Should have valid timebounds', function() {
    const challengeExpiresIn = stellarAuth.getOption('challengeExpiresIn');
    expect(tx.timeBounds).to.have.property('minTime');
    expect(tx.timeBounds).to.have.property('maxTime');
    expect(tx.timeBounds.maxTime - tx.timeBounds.minTime).to.equal(challengeExpiresIn);
  });

  it('Should have a valid operation', function() {
    const op = tx.operations[0];
    expect(tx.operations).to.have.lengthOf(1);
    expect(op.type).to.equal('manageData');
    expect(op.name).to.equal('Anchor server auth');
    expect(op.source).to.equal(clientPublicKey);
  });

  it('Should have a valid server signature', function() {
    const serverKeyPair = testUtils.getServerKeyPair();
    expect(serverKeyPair.verify(tx.hash(), tx.signatures[0].signature())).to.equal(true);
  });

  it('Should throws an exception with invalid public key', function() {
    expect(() => stellarAuth.challenge('')).to.throw();
    expect(() => stellarAuth.challenge(null)).to.throw();
    expect(() => stellarAuth.challenge(123)).to.throw();
  });
});
