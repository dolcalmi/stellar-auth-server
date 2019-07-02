var testUtils = require('../test-utils');
var stellarAuth = testUtils.getStellarAuthInstance();
var expect = require('chai').expect;

describe('StellarAuth - Options', function() {
  const serverKeyPair = testUtils.getServerKeyPair();
  it('Should have valid default values', function() {
    const options = stellarAuth.options;
    expect(options.challengeExpiresIn).to.equal(300);
    expect(options.invalidSequence).to.equal('0');
    expect(options.anchorName).to.equal('Anchor server');
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
