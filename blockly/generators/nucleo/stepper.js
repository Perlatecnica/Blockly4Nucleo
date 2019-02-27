/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Nucleo code generator for the Stepper library blocks.
 *     The Nucleo Stepper library docs: http://nucleo.cc/en/Reference/Stepper
 */
'use strict';

goog.provide('Blockly.Nucleo.stepper');

goog.require('Blockly.Nucleo');


/**
 * Code generator for the stepper generator configuration. Nothing is added
 * to the 'loop()' function. Sets the pins (X and Y), steps per revolution (Z),
 * speed(A) and instance name (B).
 * Nucleo code: #include <Stepper.h>
 *               Stepper B(Z, X, Y);
 *               setup() { B.setSpeed(A); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Empty string as no code goes into 'loop()'.
 */
Blockly.Nucleo['stepper_config'] = function(block) {
  var pinType = Blockly.Nucleo.PinTypes.STEPPER;
  var stepperName = block.getFieldValue('STEPPER_NAME');
  var numberOfPins = block.getFieldValue('STEPPER_NUMBER_OF_PINS');
  var stepperSteps = Blockly.Nucleo.valueToCode(block, 'STEPPER_STEPS',
      Blockly.Nucleo.ORDER_ATOMIC) || '360';
  var stepperSpeed = Blockly.Nucleo.valueToCode(block, 'STEPPER_SPEED',
      Blockly.Nucleo.ORDER_ATOMIC) || '90';
  var pins = [block.getFieldValue('STEPPER_PIN1'),
              block.getFieldValue('STEPPER_PIN2')];
  if (numberOfPins === 'FOUR') {
    pins.push(block.getFieldValue('STEPPER_PIN3'));
    pins.push(block.getFieldValue('STEPPER_PIN4'));
  }

  var pinArray = 'int ' + stepperName + '[' + pins.length +'] = {';
  var globalCode = 'Stepper stepper_' + stepperName + '(' + stepperSteps + ', ';
  for (var i = 0; i < pins.length; i++) {
    Blockly.Nucleo.reservePin(block, pins[i], pinType, 'Stepper');
    pinArray += pins[i] + ', ';
    globalCode += pins[i] + ', ';
  }
  pinArray = pinArray.slice(0, -2) + '};';
  globalCode = globalCode.slice(0, -2) + ');';

  //stepper is a variable containing the used pins
  Blockly.Nucleo.addVariable(stepperName,
      pinArray, true);
  stepperName = 'stepper_' + stepperName;

  Blockly.Nucleo.addInclude('stepper', '#include <Stepper.h>');

  Blockly.Nucleo.addDeclaration(stepperName, globalCode);

  var setupCode = stepperName + '.setSpeed(' + stepperSpeed + ');';
  Blockly.Nucleo.addSetup(stepperName, setupCode, true);

  return '';
};

/**
 * Code generator for moving the stepper instance (X) a number of steps (Y).
 * Library info in the setHelpUrl link.
 * This block requires the stepper_config block to be present.
 * Nucleo code: loop { X.steps(Y) }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['stepper_step'] = function(block) {
  var stepperInstanceName = 'stepper_' + block.getFieldValue('STEPPER_NAME');
  var stepperSteps = Blockly.Nucleo.valueToCode(block, 'STEPPER_STEPS',
      Blockly.Nucleo.ORDER_ATOMIC) || '0';
  var code = stepperInstanceName + '.step(' + stepperSteps + ');\n';
  return code;
};
