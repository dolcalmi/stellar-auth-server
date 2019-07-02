const StellarSdk = require('stellar-sdk');

function verify(txBase64) {

  const tx = new StellarSdk.Transaction(txBase64);

  const isValidTx = isValidTransaction(tx, this.serverKeyPair) && hasValidOperation(tx, this.options);

  if (!isValidTx) {
    return Promise.reject(new Error('stellar-auth.errors.invalid-transaction'));
  }

  if (!hasValidClientSignature(tx)) {
    return Promise.reject(new Error('stellar-auth.errors.invalid-signature'));
  }

  if (!hasValidTimeBounds(tx)) {
    return Promise.reject(new Error('stellar-auth.errors.expired-transaction'));
  }

  return Promise.resolve(txBase64);
}

function isValidTransaction(tx, serverKeyPair) {
  return tx.signatures.length === 2 &&
    tx.operations.length === 1  &&
    tx.source === serverKeyPair.publicKey() &&
    serverKeyPair.verify(tx.hash(), tx.signatures[0].signature());
}

function hasValidTimeBounds(tx) {
  return tx.timeBounds &&
      Date.now() > Number.parseInt(tx.timeBounds.minTime, 10) &&
      Date.now() < Number.parseInt(tx.timeBounds.maxTime, 10);
}

function hasValidOperation(tx, options) {
  const op = tx.operations[0];
  if (!isValidPublicKey(op.source)) {
    return false;
  }

  return op.type === "manageData" &&
    op.name === `${options.anchorName} auth`;
}

function hasValidClientSignature(tx) {
  const op = tx.operations[0];
  const clientKeyPair = StellarSdk.Keypair.fromPublicKey(op.source);
  return clientKeyPair.verify(tx.hash(), tx.signatures[1].signature())
}

function isValidPublicKey(input) {
  if (!input) {
    return false;
  }
  return StellarSdk.StrKey.isValidEd25519PublicKey(input);
}

module.exports = verify;
