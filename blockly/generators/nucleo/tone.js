/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Nucleo Digital and Analogue input/output.
 *     Nucleo built in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.tone');

goog.require('Blockly.Nucleo');


/**
 * Function for turning the tone library on on a given pin (X).
 * Nucleo code: setup { pinMode(X, OUTPUT) }
 *               loop  { tone(X, frequency) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */

Blockly.Nucleo['io_tone'] = function(block) {
  var pin = block.getFieldValue('TONEPIN');
  var freq = Blockly.Nucleo.valueToCode(block, 'FREQUENCY', Blockly.Nucleo.ORDER_ATOMIC);
  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Tone Pin');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'tone(' + pin + ',' + freq + ');\n';
  return code;
};

Blockly.Nucleo['io_notone'] = function(block) {
  var pin = block.getFieldValue("TONEPIN");
  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Tone Pin');
  
  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'noTone(' + pin + ');\n';
  return code;
};
