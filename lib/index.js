const StellarSdk = require('stellar-sdk');
const Crypto = require("crypto");
const merge = require('lodash.merge');

StellarSdk.Network.usePublicNetwork();

function StellarAuth(serverKeyPair, options) {
  this.serverKeyPair = serverKeyPair;

  this.options = merge({
    challengeExpiresIn: 300, // 5 minutes
    invalidSequence: "0",
    anchorName: 'Anchor Server'
  }, options);
}

StellarAuth.prototype = {

  challenge(clientPublicKey) {
    const minTime = Date.now();
    const maxTime = minTime + this.options.challengeExpiresIn;
    const timebounds = {
      minTime: minTime.toString(),
      maxTime: maxTime.toString()
    };

    const op = StellarSdk.Operation.manageData({
      source: clientPublicKey,
      name: `${this.options.anchorName} auth`,
      value: Crypto.randomBytes(32).toString("hex"),
    });

    const stellarServerAccount = new StellarSdk.Account(
      this.serverKeyPair.publicKey(),
      this.options.invalidSequence
    );

    const tx = new StellarSdk
      .TransactionBuilder(stellarServerAccount, { fee: 100, timebounds })
      .addOperation(op)
      .build();

    tx.sign(this.serverKeyPair);

    return tx.toEnvelope().toXDR("base64");
  },

  setOption(key, value) {
    this.options[key] = value;
  },

  getOption(key) {
    return this.options[key];
  },
};

module.exports = StellarAuth;
module.exports.StellarAuth = StellarAuth;
