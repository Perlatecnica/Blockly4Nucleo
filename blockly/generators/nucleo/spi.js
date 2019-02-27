/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Nucleo ode generator for SPI library blocks.
 *     The Nucleo SPI library docs: http://nucleo.cc/en/Reference/SPI
 */
'use strict';

goog.provide('Blockly.Nucleo.spi');

goog.require('Blockly.Nucleo');


/**
 * Code generator for the SPI configuration block. It does not add any LoC to
 * the loop(), but it generates code for the setup() function.
 * Nucleo code: #include <SPI.h>
 *               setup() { SPI.setBitOrder(X);
 *                         SPI.setDataMode(Y);
 *                         SPI.setClockDivider(Z);
 *                         SPI.begin(); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['spi_setup'] = function(block) {
  var spiId = block.getFieldValue('SPI_ID');
  var spiShift = block.getFieldValue('SPI_SHIFT_ORDER');
  var spiClockDivide = block.getFieldValue('SPI_CLOCK_DIVIDE');
  var spiMode = block.getFieldValue('SPI_MODE');

  Blockly.Nucleo.addInclude('spi', '#include <SPI.h>');
  Blockly.Nucleo.addSetup('spi_order',
      spiId + '.setBitOrder(' + spiShift + ');', true);
  Blockly.Nucleo.addSetup('spi_mode',
      spiId + '.setDataMode(' + spiMode + ');', true);
  Blockly.Nucleo.addSetup('spi_div',
      spiId + '.setClockDivider(' + spiClockDivide + ');', true);
  Blockly.Nucleo.addSetup('spi_begin',
      spiId + '.begin();', true);

  return '';
};

/**
 * Code generator for the SPI transfer block.
 * SPI bus can have several slaves, which are selected using a digital output
 * as a SS pin. This digital pin will be configured as a normal output.
 * Nucleo code: #include <SPI.h>
 *               setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, HIGH);
 *                       SPI.transfer(0);
 *                       digitalWrite(X, LOW); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['spi_transfer'] = function(block) {
  var spiId = block.getFieldValue('SPI_ID');
  var spiSs = block.getFieldValue('SPI_SS');
  var spiData = Blockly.Nucleo.valueToCode(
      block, 'SPI_DATA', Blockly.Nucleo.ORDER_ATOMIC) || '0';

  Blockly.Nucleo.addInclude('spi', '#include <SPI.h>');
  Blockly.Nucleo.addSetup('spi_begin', spiId + '.begin();', false);

  // Reserve SPI pins MOSI, MISO, and SCK
  var spiPins = Blockly.Nucleo.Boards.selected.spiPins[spiId];
  for (var i = 0; i < spiPins.length; i++) {
    Blockly.Nucleo.reservePin(block, spiPins[i][1],
        Blockly.Nucleo.PinTypes.SPI, 'SPI ' + spiPins[i][0]);
  }

  // Configure the Slave Select as a normal output if a pin is used
  if (spiSs !== 'none') {
    Blockly.Nucleo.reservePin(
        block, spiSs, Blockly.Nucleo.PinTypes.OUTPUT, 'SPI Slave pin');
    var setupCode = 'DigitalOut(' + spiSs + ', OUTPUT);';
    Blockly.Nucleo.addSetup('io_' + spiSs, setupCode, false);
  } // else means the SS pin is always set for the device

  // Add the code, but only use a SS pin if one is selected
  var code = [];
  if (spiSs !== 'none') {
    code.push('digitalWrite(' + spiSs + ', HIGH);');
  }
  code.push(spiId + '.transfer(' + spiData + ');');
  if (spiSs !== 'none') {
    code.push('digitalWrite(' + spiSs + ', LOW);');
  }
  return code.join('\n') + '\n';
};

/**
 * Code generator for the SPI transfer block with a return value.
 * The rest is the same as the spi_transfer block.
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['spi_transfer_return'] = function(block) {
  var spiId = block.getFieldValue('SPI_ID');
  var spiSs = block.getFieldValue('SPI_SS');
  var spiData = Blockly.Nucleo.valueToCode(
      block, 'SPI_DATA', Blockly.Nucleo.ORDER_ATOMIC) || '0';
  // The spi_transfer block invoked to generate all setup stuff, code discarded
  var spiTransferOnlyCode = Blockly.Nucleo['spi_transfer'](block);
  if (spiSs === 'none') {
    var code = spiId + '.transfer(' + spiData + ')';
  } else {
    var func = [
        'int ' + Blockly.Nucleo.DEF_FUNC_NAME + '() {',
        '  int spiReturn = 0;',
        '  digitalWrite(' + spiSs + ', HIGH);',
        '  spiReturn = ' + spiId + '.transfer(' + spiData + ');',
        '  digitalWrite(' + spiSs + ', LOW);',
        '  return spiReturn;',
        '}'];
    var functionName = Blockly.Nucleo.addFunction(
        'spiReturnSlave' + spiSs, func.join('\n'));
    var code = functionName + '()';
  }
  return [code, Blockly.Nucleo.ORDER_UNARY_POSTFIX];
};
