/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Nucleo serial blocks.
 *     Nucleo Serial library docs: https://www.nucleo.cc/en/Reference/Serial
 *
 * TODO: There are more functions that can be added:
 *       http://nucleo.cc/en/Reference/Serial
 */
'use strict';

goog.provide('Blockly.Nucleo.serial');

goog.require('Blockly.Nucleo');


/**
 * Code generator of block for writing to the serial com.
 * Nucleo code: loop { Serial.print(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['serial_print'] = function(block) {
  var serialId = block.getFieldValue('SERIAL_ID');
  var content = Blockly.Nucleo.valueToCode(block, 'CONTENT', Blockly.Nucleo.ORDER_ATOMIC) || '0';
  var checkbox_name = (block.getFieldValue('NEW_LINE') == 'TRUE');

 /* var serialPins = Blockly.Nucleo.Boards.selected.serialPins[serialId];
  for (var i = 0; i < serialPins.length; i++) {
    Blockly.Nucleo.reservePin(block, serialPins[i][1],
        Blockly.Nucleo.PinTypes.SERIAL, 'SERIAL ' + serialPins[i][0]);
  }*/

  if (checkbox_name) {
    var code = /*serialId + */'seriale.printf(' + content +');\n';
  } else {
    var code = /*serialId + */'seriale.printf(' + content + ');\n';
  }
  return code;
};

/**
 * Code generator for block for setting the serial com speed.
 * Nucleo code: setup{ Serial.begin(X); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code.
 */
Blockly.Nucleo['serial_setup'] = function(block) {
  var serialId = block.getFieldValue('SERIAL_ID');
  var serialSpeed = block.getFieldValue('SPEED');
  
  var serialPins = Blockly.Nucleo.Boards.selected.serialPins[serialId];
  for (var i = 0; i < serialPins.length; i++) {
    Blockly.Nucleo.reservePin(block, serialPins[i][1], Blockly.Nucleo.PinTypes.SERIAL, 'SERIAL ' + serialPins[i][0]);
  }
  
  var serialSetupCode = serialId + ' seriale(' + serialPins[0][0] + ',' + serialPins[1][0] + ');';
  
  
  Blockly.Nucleo.addSetup('serial_' + serialId, serialSetupCode, true);
  var code = 'seriale.baud('+serialSpeed+');';
  return code;
};
