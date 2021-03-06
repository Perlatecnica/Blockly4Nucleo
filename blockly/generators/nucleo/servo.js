/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Nucleo code generator for the Servo library blocks.
 *     The Nucleo Servo library docs: http://nucleo.cc/en/reference/servo
 *
 * TODO: If angle selector added to blocks edit code here.
 */
'use strict';

goog.provide('Blockly.Nucleo.servo');

goog.require('Blockly.Nucleo');


/**
 * Code generator to set an angle (Y) value to a servo pin (X).
 * Nucleo code: #include <Servo.h>
 *               Servo myServoX;
 *               setup { myServoX.attach(X); }
 *               loop  { myServoX.write(Y);  }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['servo_write'] = function(block) {
  var pinKey = block.getFieldValue('SERVO_PIN');
  var servoAngle = Blockly.Nucleo.valueToCode(
      block, 'SERVO_ANGLE', Blockly.Nucleo.ORDER_ATOMIC) || '90';
  var servoName = 'myServo' + pinKey;

  Blockly.Nucleo.reservePin(
      block, pinKey, Blockly.Nucleo.PinTypes.SERVO, 'Servo Write');

  Blockly.Nucleo.addInclude('servo', '#include <Servo.h>');
  Blockly.Nucleo.addDeclaration('servo_' + pinKey, 'Servo ' + servoName + ';');

  var setupCode = servoName + '.attach(' + pinKey + ');';
  Blockly.Nucleo.addSetup('servo_' + pinKey, setupCode, true);

  var code = servoName + '.write(' + servoAngle + ');\n';
  return code;
};

/**
 * Code generator to read an angle value from a servo pin (X).
 * Nucleo code: #include <Servo.h>
 *               Servo myServoX;
 *               setup { myServoX.attach(X); }
 *               loop  { myServoX.read();    }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['servo_read'] = function(block) {
  var pinKey = block.getFieldValue('SERVO_PIN');
  var servoName = 'myServo' + pinKey;

  Blockly.Nucleo.reservePin(
      block, pinKey, Blockly.Nucleo.PinTypes.SERVO, 'Servo Read');

  Blockly.Nucleo.addInclude('servo', '#include <Servo.h>');
  Blockly.Nucleo.addDeclaration('servo_' + pinKey, 'Servo ' + servoName + ';');

  var setupCode = servoName + '.attach(' + pinKey + ');';
  Blockly.Nucleo.addSetup('servo_' + pinKey, setupCode, true);

  var code = servoName + '.read()';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};
