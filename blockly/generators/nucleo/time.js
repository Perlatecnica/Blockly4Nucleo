/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Nucleo code generator for the Time blocks.
 *     Nucleo built-in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.time');

goog.require('Blockly.Nucleo');

/**
 * Code generator for the delay in milliseconds Nucleo block.
 * Nucleo code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['wait_millisecnds'] = function(block) {
  var value_seconds = Blockly.Nucleo.valueToCode(block, 'SECONDS', Blockly.Nucleo.ORDER_ATOMIC) || 0;
  var code = 'wait_ms ('+ value_seconds +');\n'
  return code;
}; 


/**
 * Code generator for the delayMicroseconds block.
 * Nucleo code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Nucleo['wait_microseconds'] = function(block) {
 var value_seconds = Blockly.Nucleo.valueToCode(block, 'DELAY', Blockly.Nucleo.ORDER_ATOMIC) || 0;
  var code = 'wait_us ('+ value_seconds +');\n'
  return code;
};


/**
 * Code generator for the wait forever (end of program) block
 * Nucleo code: loop { while(true); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Nucleo['infinite_loop'] = function(block) {
  return 'while(true);\n';
};
