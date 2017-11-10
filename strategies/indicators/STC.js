// required indicators
var MACD = require('./MACD.js');

var Indicator = function(config) {
  this.result = false;
  this.length = config.length;
  this.fastLength = config.fastLength;
  this.slowLength = config.slowLength;
  this.factor = config.factor;
  this.MACD = new MACD({ short: config.fastLength, long: config.slowLength, signal: 0 });
  this.last = { f1: 0, f2: 0, pf: 0, pff: 0 };
}

Indicator.prototype.update = function(price) {
  this.MACD.update(price);
  const m = this.MACD.diff;
  const v1 = Math.min(m, this.length);
  const v2 = Math.max(m, this.length) - v1;
  const f1 = v2 > 0 ? ((m - v1) / v2) * 100 : this.last.f1;
  const pf = !this.last.pf ? f1 : this.last.pf + (this.factor * (f1 - this.last.pf));
  const v3 = Math.min(pf, this.length);
  const v4 = Math.max(pf, this.length) - v3;
  const f2 = v4 > 0 ? ((pf - v3) / v4) * 100 : this.last.f2;
  this.result = !this.last.pff ? f2 : this.last.pff + (this.factor * (f2 - this.last.pff));
  this.last = { f1, f2, pf, pff: this.result };
}

module.exports = Indicator;
