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
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.addIndicator('stc', 'STC', this.settings);
}

// What happens on every new candle?
strat.update = function(candle) {
}

// For debugging purposes.
strat.log = function() {
  const stc = this.indicators.stc;
  log.debug('STC:');
  log.debug('\t', stc.result, this.settings.crossOver, this.settings.crossUnder);
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
  // Only continue if we have a new update.
  const crossOver = this.indicators.stc.result > this.settings.crossOver;
  const crossUnder = this.indicators.stc.result < this.settings.crossUnder;
  if (crossOver && crossUnder)
    this.advice();
  else if (crossUnder)
    this.advice('short');
  else if (crossOver)
    this.advice('long');

}

module.exports = strat;
