/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Nucleo map functionality.
 *     Nucleo built-in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.map');

goog.require('Blockly.Nucleo');


/**
 * Code generator for the map block.
 * Nucleo code: loop { map(x, 0, 1024, 0, y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['base_map'] = function(block) {
  var valueNum = Blockly.Nucleo.valueToCode(
      block, 'NUM', Blockly.Nucleo.ORDER_NONE) || '0';
  var valueDmax = Blockly.Nucleo.valueToCode(
      block, 'DMAX', Blockly.Nucleo.ORDER_ATOMIC) || '0';

  var code = 'map(' + valueNum + ', 0, 1024, 0, ' + valueDmax + ')';
  return [code, Blockly.Nucleo.ORDER_NONE];
};
