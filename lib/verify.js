const StellarSdk = require('stellar-sdk');
const utils = require('./utils');

function verify(txBase64) {

  const tx = new StellarSdk.Transaction(txBase64);
  const seq = this.options.invalidSequence;
  const isValidTx = isValidTransaction(tx, this.serverKeyPair, seq) && hasValidOperation(tx, this.options);

  if (!isValidTx) {
    return Promise.reject(new Error('stellar-auth.errors.invalid-transaction'));
  }

  if (!hasValidClientSignature(tx)) {
    return Promise.reject(new Error('stellar-auth.errors.invalid-signature'));
  }

  if (!hasValidTimeBounds(tx)) {
    return Promise.reject(new Error('stellar-auth.errors.expired-transaction'));
  }

  return Promise.resolve({
    clientPublicKey: tx.operations[0].source,
    hash: tx.hash().toString('hex')
  });
}

function isValidTransaction(tx, serverKeyPair, sequence) {
  return tx.signatures.length === 2 &&
    tx.operations.length === 1  &&
    tx.source === serverKeyPair.publicKey() &&
    tx.sequence === sequence &&
    serverKeyPair.verify(tx.hash(), tx.signatures[0].signature());
}

function hasValidTimeBounds(tx) {
  const now = Math.floor(Date.now() / 1000);
  return tx.timeBounds &&
      now >= Number.parseInt(tx.timeBounds.minTime, 10) &&
      now <= Number.parseInt(tx.timeBounds.maxTime, 10);
}

function hasValidOperation(tx, options) {
  const op = tx.operations[0];
  if (!utils.isValidPublicKey(op.source)) {
    return false;
  }

  return op.type === 'manageData' &&
    op.name === `${options.anchorName} auth`;
}

function hasValidClientSignature(tx) {
  const op = tx.operations[0];
  const clientKeyPair = StellarSdk.Keypair.fromPublicKey(op.source);
  return clientKeyPair.verify(tx.hash(), tx.signatures[1].signature())
}

module.exports = verify;
