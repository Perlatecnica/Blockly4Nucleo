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
 * Code generator for the delay Nucleo block.
 * Nucleo code: loop { delay(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Nucleo['time_delay'] = function(block) {
  var delayTime = Blockly.Nucleo.valueToCode(
      block, 'DELAY_TIME_MILI', Blockly.Nucleo.ORDER_ATOMIC) || '0';
  var code = 'wait_ms(' + delayTime + ');\n';
  return code;
};

/**
 * Code generator for the delayMicroseconds block.
 * Nucleo code: loop { delayMicroseconds(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 Blockly.Nucleo['time_delaymicros'] = function(block) {
  var delayTimeMs = Blockly.Nucleo.valueToCode(
      block, 'DELAY_TIME_MICRO', Blockly.Nucleo.ORDER_ATOMIC) || '0';
  var code = 'wait_us(' + delayTimeMs + ');\n';
  return code;
};

/**
 * Code generator for the elapsed time in milliseconds block.
 * Nucleo code: loop { millis() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.Nucleo['time_millis'] = function(block) {
  var code = 'wait_ms()';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Code generator for the elapsed time in microseconds block.
 * Nucleo code: loop { micros() }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
 Blockly.Nucleo['time_micros'] = function(block) {
  var code = 'micros()';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
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
