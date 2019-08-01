const StellarSdk = require('stellar-sdk');

module.exports = {
  isValidPublicKey: input => {
    if (!input) {
      return false;
    }
    return StellarSdk.StrKey.isValidEd25519PublicKey(input);
  }
}
