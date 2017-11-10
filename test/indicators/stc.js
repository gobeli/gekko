var chai = require('chai');
var expect = chai.expect;
var should = chai.should;
var sinon = require('sinon');

var _ = require('lodash');

var util = require('../../core/util');
var dirs = util.dirs();
var INDICATOR_PATH = dirs.indicators;

// Fake input prices to verify all indicators
// are working correctly by comparing fresh
// calculated results to pre calculated results.

// The precalculated results are already compared
// to MS Excel results, more info here:
//
// https://github.com/askmike/gekko/issues/161

var prices = [327.4, 220.61, 210, 217.44, 318.64, 342.3, 301.8, 273.85, 325.21, 315.08, 294.72, 300.45, 298.29, 299.92, 320.99, 340.28, 320.25, 360.57, 422.36, 400.53, 490, 471.1, 532.2, 622.87, 614.33, 590.7, 545.08, 579.39, 593.54, 628, 572, 611.14, 518.94, 543.64, 645.99, 666.99, 604.77, 584.75, 557.8, 554.91, 535.63, 504.99, 388.9, 428.09, 442.78, 438.77, 487.03, 528.73, 477.91]
describe.only('indicators/STC', function() {

  var STC = require(INDICATOR_PATH + 'STC');
  it('should correctly calculate STCs', function() {
    var stc = new STC({ length: 9,
      fastLength: 23,
      slowLength: 50,
      factor: 0.5 });
    _.each(prices, function(p, i) {
      stc.update(p);
      // console.log(p, stc.result);
    });
  });
});
