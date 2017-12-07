var moment = require('moment');
var log = require('../core/log');

var strat = {};

strat.init = function() {
  this.history = [];
  this.currentAdvice = '';
  this.buyPrice = 0;
  this.trailingStop = 0;
}

strat.update = function (candle) {
  this.history = this.history.filter(c =>
    moment(c.start).add(this.settings.hours, 'h').isAfter(candle.start));
  this.history.push(candle);
}

strat.max = function() {
  return Math.max(...this.history.map(c => c.close));
}

strat.log = function() {
  log.debug(`${this.settings.hours} High:`);
  log.debug('\t', this.max());
}

strat.check = function() {
  const currentCandle = this.history[this.history.length - 1];
  const difference = moment(currentCandle.start).diff(this.history[0].start, 'h');
  if (this.history.length < this.tradingAdvisor.historySize
    || difference < this.settings.hours - 1) {
    return;
  }
  if (this.max() === currentCandle.close) {
    this.currentAdvice = 'long';
    this.buyPrice = currentCandle.close;
    this.advice('long');
  }
  if (this.currentAdvice === 'long') {
    const profit = 100 - (currentCandle.close * 100) / this.buyPrice;
    if (this.settings.trailingStop) {
      const trailingStop = currentCandle.close - (currentCandle.close * (this.settings.trailingStop / 100));
      if (trailingStop > this.trailingStop) {
        this.trailingStop = trailingStop;
      }
      if (currentCandle.close < this.trailingStop) {
        this.advice('short');
      }
    }
    if (profit > this.settings.takeProfit || profit < -this.settings.stopLoss) {
      this.advice('short');
      this.currentAdvice = 'short';
    }
  }
}

module.exports = strat;
