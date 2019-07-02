const { Transaction, Keypair } = require("stellar-sdk");
var testUtils = require('../test-utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth Resource', function() {
  const serverKeyPair = testUtils.getServerKeyPair();
  describe('Options', function() {
    it('Should have valid default values', function() {
      const options = stellarAuth.options;
      expect(options.challengeExpiresIn).to.equal(300);
      expect(options.invalidSequence).to.equal('0');
      expect(options.anchorName).to.equal('Anchor Server');
    });

    it('Should allow set challenge expires value', function() {
      var sa = testUtils.getStellarAuthInstance({ challengeExpiresIn: 100 });
      expect(sa.options.challengeExpiresIn).to.equal(100);
      sa.setOption('challengeExpiresIn', 5000);
      expect(sa.getOption('challengeExpiresIn')).to.equal(5000);
    });

    it('Should allow set invalid sequence value', function() {
      var sa = testUtils.getStellarAuthInstance({ invalidSequence: '1' });
      expect(sa.options.invalidSequence).to.equal('1');
      sa.setOption('invalidSequence', '2');
      expect(sa.getOption('invalidSequence')).to.equal('2');
    });

    it('Should allow set anchor name value', function() {
      var sa = testUtils.getStellarAuthInstance({ anchorName: 'my anchor' });
      expect(sa.options.anchorName).to.equal('my anchor');
      sa.setOption('anchorName', 'your anchor');
      expect(sa.getOption('anchorName')).to.equal('your anchor');
    });
  });

  describe('challenge', function() {
    const clientPublicKey = testUtils.getClientPublicKey();
    const txBase64 = stellarAuth.challenge(clientPublicKey);
    const tx = new Transaction(txBase64);

    it('Should have valid timebounds', function() {
      const challengeExpiresIn = stellarAuth.getOption('challengeExpiresIn');
      expect(tx.timeBounds).to.have.property('minTime');
      expect(tx.timeBounds).to.have.property('maxTime');
      const diffTime = tx.timeBounds.maxTime - tx.timeBounds.minTime;
      expect(diffTime).to.equal(challengeExpiresIn);
    });

    it('Should have a valid operation', function() {
      const op = tx.operations[0];
      expect(tx.operations).to.have.lengthOf(1);
      expect(op.type).to.equal('manageData');
      expect(op.name).to.equal('Anchor Server auth');
      expect(op.source).to.equal(clientPublicKey);
    });

    it('Should have a valid server signature', function() {

      expect(serverKeyPair.verify(tx.hash(), tx.signatures[0].signature())).to.equal(true);
    });
  });
});
