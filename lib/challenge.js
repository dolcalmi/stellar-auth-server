const StellarSdk = require('stellar-sdk');
const BigNumber = require('bignumber.js');
const Crypto = require('crypto');

function challenge(clientPublicKey) {
  const minTime = Date.now();
  const maxTime = minTime + this.options.challengeExpiresIn;
  const timebounds = {
    minTime: minTime.toString(),
    maxTime: maxTime.toString()
  };

  const op = StellarSdk.Operation.manageData({
    source: clientPublicKey,
    name: `${this.options.anchorName} auth`,
    value: Crypto.randomBytes(32).toString('hex'),
  });

  const stellarServerAccount = new StellarSdk.Account(
    this.serverKeyPair.publicKey(),
    fixSequence(this.options.invalidSequence)
  );

  const tx = new StellarSdk
    .TransactionBuilder(stellarServerAccount, { fee: 100, timebounds })
    .addOperation(op)
    .build();

  tx.sign(this.serverKeyPair);

  return tx.toEnvelope().toXDR('base64');
}

function fixSequence(invalidSequence) {
  const seq = new BigNumber(invalidSequence);
  // must substract 1 because stellar base increments sequence before create tx
  return seq.minus(1).toString();
}

module.exports = challenge;
