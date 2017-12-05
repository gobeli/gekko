// This is a basic example strategy for Gekko.
// For more information on everything please refer
// to this document:
//
// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
//
// The example below is pretty bad investment advice: on every new candle there is
// a 10% chance it will recommend to change your position (to either
// long or short).

var log = require('../core/log');

// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
	this.currentAdvice = null;
	this.lastCrossOver = true;
	this.lastCrossUnder = true;
	this.requiredHistory = this.tradingAdvisor.historySize;
  this.addIndicator('stc', 'STC', this.settings);
}

// What happens on every new candle?
strat.update = function(candle) {
  this.indicators.stc.update(candle.close);
}

// For debugging purposes.
strat.log = function() {
  const stc = this.indicators.stc;
  log.debug('STC:');
  log.debug('\t', stc.result,
      this.settings.crossOver, this.settings.crossUnder);
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
	// Only continue if we have a new update.
  const result = this.indicators.stc.result;
  const crossOver = result > this.settings.crossOver;
  const crossUnder = result < this.settings.crossUnder;
  if ((crossUnder && !this.lastCrossUnder)
      || ( this.currentAdvice !== 'short' && result < this.settings.crossOver)) {
    this.currentAdvice = 'short';
    this.advice('short');
  } else if (crossOver && !this.lastCrossOver || ( this.currentAdvice !== 'long' && result > this.settings.crossUnder)) {
    this.currentAdvice = 'long';
    this.buyPrice = this.candlePrice;
    this.advice('long');
  } else {
    this.advice();
  }
  this.lastCrossOver = crossOver;
  this.lastCrossUnder = crossUnder;
	// Stoploss
	if (this.currentAdvice === 'long'
			&& this.candlePrice < this.buyPrice * ((100 - this.settings.stopLoss) / 100)) {
		this.currentAdvice = 'short';
		log.debug('STC:');
		log.debug('\t', 'Stop Loss');
		this.advice('short');
	} else if (this.currentAdvice === 'long'
			&& this.candlePrice * ((100 - this.settings.trailOffset) / 100) > this.buyPrice) {
		this.buyPrice = this.candlePrice * ((100 - this.settings.trailOffset) / 100);
	}
}

module.exports = strat;
