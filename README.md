# Stellar Auth server library
[![Version](https://img.shields.io/npm/v/stellar-auth-server.svg)](https://www.npmjs.org/package/stellar-auth-server)
[![Build Status](https://api.travis-ci.org/dolcalmi/stellar-auth-server.svg?branch=master)](https://travis-ci.org/dolcalmi/stellar-auth-server)
[![Coverage Status](https://coveralls.io/repos/github/dolcalmi/stellar-auth-server/badge.svg?branch=master)](https://coveralls.io/github/dolcalmi/stellar-auth-server?branch=master)
[![David](https://img.shields.io/david/dolcalmi/stellar-auth-server.svg)](https://david-dm.org/dolcalmi/stellar-auth-server)
[![David](https://img.shields.io/david/dev/dolcalmi/stellar-auth-server.svg)](https://david-dm.org/dolcalmi/stellar-auth-server?type=dev)
[![Try on RunKit](https://badge.runkitcdn.com/stellar-auth-server.svg)](https://runkit.com/npm/stellar-auth-server)

Server side library for [Stellar SEP 0010](https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0010.md) implementation.

## Installation

Install the package with:

    npm install stellar-auth-server --save

## Usage

### Initialization

``` js
const StellarAuth = require('stellar-auth-server');

const serverKeyPair = StellarSdk.Keypair.fromSecret('SDL...A2J');

// optional param
const options = {
  challengeExpiresIn: 300, // 5 minutes
  invalidSequence: '0',
  anchorName: 'Anchor server'
}

const stellarAuth = new StellarAuth(serverKeyPair, options);
```

- **serverKeyPair**\
Server Keypair object.\
Required: true
- **options**\
Object with optional params .\
Required: false
  - **challengeExpiresIn**\
  time in seconds in which the challenge expires.\
  Default value: `300` (5 minutes)\
  Required: false
  - **invalidSequence**\
  Invalid sequence for stellar transaction.\
  Default value: `'0'`\
  Required: false
  - **anchorName**\
  Default anchor name.\
  Default value: `'Anchor server'`\
  Required: false

### Challenge

``` js
const clientPublicKey = 'GBF...3UZ';
const txBase64 = stellarAuth.challenge(clientPublicKey);
return { transaction: txBase64 };
```

### Verify

``` js
stellarAuth.verify(txBase64SignedByClient)
.then(() => { token: buildToken() })
.catch(e => { error: translate(err.message) || err.message })
```

## Development

Run all tests:

```bash
$ npm install
$ npm test
```

Run a single test suite:

```bash
$ npm run mocha -- test/lib/challenge.spec.js
```

Run a single test (case sensitive):

```bash
$ npm run mocha -- test/lib/challenge.spec.js --grep 'Should have valid timebounds'
```
<sub><sup>Library based on [Stellar SEP-0010 implementation](https://github.com/gzigzigzeo/stellar-sep-0010-implementation)</sup></sub>
