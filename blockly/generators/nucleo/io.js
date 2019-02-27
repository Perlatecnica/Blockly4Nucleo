/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Nucleo Digital and Analogue input/output.
 *     Nucleo built in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.IO');

goog.require('Blockly.Nucleo');


/**
 * Function for 'set pin' (X) to a state (Y).
 * Nucleo code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 
Blockly.Nucleo['wait_millisecnds'] = function(block) {
  var value_seconds = Blockly.Nucleo.valueToCode(block, 'SECONDS', Blockly.Nucleo.ORDER_ATOMIC) || 0;
  var code = '';
  
  code = 'wait ('+ value_seconds +');\n'
  return code;
}; 

Blockly.Nucleo['io_digitalwrite'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var stateOutput = Blockly.Nucleo.valueToCode(
      block, 'stateOUT', Blockly.Nucleo.ORDER_ATOMIC) || 'false';
  // var stateOutput = block.getFieldValue('stateOUT');
  var varname = 'digital_'.concat( pin ) ; 
  var code = '';
  
  
  var varName = Blockly.Nucleo.variableDB_.getName(
      varname, Blockly.Variables.NAME_TYPE);
	  

  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Digital Write');

  var pinSetupCode = 'DigitalOut'+' '+ varname +'(' + pin + ');';
  
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);
  
 
  
  if (stateOutput == 'false')
	code =   varname + ' = '+ 0 + ';\n';
  
  else 
	code =   varname + ' = '+ 1 + ';\n';
  
  
  return code;
  
  /* var code =  'digital_' + pin + '.write('  + stateOutput + ');\n';
  return code;   */ 
};

/**
 * Function for 'set pin' (X) to a state (Y).
 * Nucleo code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 
Blockly.Nucleo['io_blinkled'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var stateOutput = Blockly.Nucleo.valueToCode( block, 'MilliSEC', Blockly.Nucleo.ORDER_ATOMIC) || '1000';
  var varname = 'digital_'.concat( pin ) ;   
  
  
  var varName = Blockly.Nucleo.variableDB_.getName(
      varname, Blockly.Variables.NAME_TYPE);
	  

  Blockly.Nucleo.reservePin(block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Digital Write');

  var pinSetupCode = 'DigitalOut'+' '+ varname +'(' + pin + ');';
  
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);
  
  var code = varname+' = 1;\n wait_ms('+stateOutput+');\n '+varname+' = 0;\n wait_ms('+stateOutput+');\n';

   
  return code;
};

/**
 * Function for reading a digital pin (X).
 * Nucleo code: setup { pinMode(X, INPUT); }
 *               loop  { digitalRead(X)     }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['io_digitalread'] = function(block) {
  var pin = block.getFieldValue('PIN');
  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.INPUT, 'Digital Read');
	  
  var varname = 'digital_'.concat( pin ) ;
  
  var pinSetupCode = 'DigitalIn'+' '+ varname + '(' + pin + ');';
   
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

   var code =  varname + '.read('  + pin + ')\n';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Function for setting the state (Y) of a built-in LED (X).
 * Nucleo code: setup { pinMode(X, OUTPUT); }
 *               loop  { digitalWrite(X, Y); }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
 
Blockly.Nucleo['io_builtin_led'] = function(block) {
  var pin = block.getFieldValue('BUILT_IN_LED');
  var stateOutput = Blockly.Nucleo.valueToCode(
      block, 'STATE', Blockly.Nucleo.ORDER_ATOMIC) || 'LOW';

  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Set LED');

  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'digitalWrite(' + pin + ', ' + stateOutput + ');\n';
  return code;
};

/**
 * Function for setting the state (Y) of an analogue output (X).
 * Nucleo code: setup { pinMode(X, OUTPUT); }
 *               loop  { analogWrite(X, Y);  }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {string} Completed code.
 */
Blockly.Nucleo['io_analogwrite'] = function(block) {
  var pin = block.getFieldValue('PIN');
  var stateOutput = Blockly.Nucleo.valueToCode(
      block, 'NUM', Blockly.Nucleo.ORDER_ATOMIC) || '0';
  var varname = 'analogIn_'.concat( pin ) ;

  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Analogue Write');
 
                       
  var pinSetupCode = 'AnalogIn'+' ' + varname +'(' + pin + ');';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);
  
  // Warn if the input value is out of range
  if ((stateOutput < 0) || (stateOutput > 255)) {
    block.setWarningText('The analogue value set must be between 0 and 255',
                         'pwm_value');
  } else {
    block.setWarningText(null, 'pwm_value');
  }

  var code =  varname + '('  + stateOutput + ');\n';
  return code;
  
};

/**
 * Function for reading an analogue pin value (X).
 * Nucleo code: setup { pinMode(X, INPUT); }
 *               loop  { analogRead(X)      }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['io_analogread'] = function(block) {
  var pin = block.getFieldValue('PIN');
  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.INPUT, 'Analogue Read');
  var varname = 'analogIn_'.concat( pin ) ;
  var pinSetupCode = 'AnalogIn'+' '+ varname+ '(' + pin + ');';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = varname + '.read()';
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

/**
 * Value for defining a digital pin state.
 * Nucleo code: loop { HIGH / LOW }
 * @param {!Blockly.Block} block Block to generate the code from.
 * @return {array} Completed code with order of operation.
 */
Blockly.Nucleo['io_highlow'] = function(block) {
  var code = block.getFieldValue('STATE');
  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

Blockly.Nucleo['io_pulsein'] = function(block) {
  var pin = block.getFieldValue("PULSEPIN");
  var type = Blockly.Nucleo.valueToCode(block, "PULSETYPE", Blockly.Nucleo.ORDER_ATOMIC);

  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.INPUT, 'Pulse Pin');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'pulseIn(' + pin + ', ' + type + ')';

  return [code, Blockly.Nucleo.ORDER_ATOMIC];
};

Blockly.Nucleo['io_pulsetimeout'] = function(block) {
  var pin = block.getFieldValue("PULSEPIN");
  var type = Blockly.Nucleo.valueToCode(block, "PULSETYPE", Blockly.Nucleo.ORDER_ATOMIC);
  var timeout = Blockly.Nucleo.valueToCode(block, "TIMEOUT", Blockly.Nucleo.ORDER_ATOMIC);

  Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.INPUT, 'Pulse Pin');

  var pinSetupCode = 'pinMode(' + pin + ', INPUT);\n';
  Blockly.Nucleo.addSetup('io_' + pin, pinSetupCode, false);

  var code = 'pulseIn(' + pin + ', ' + type + ', ' + timeout + ')';

  return [code, Blockly.Nucleo.ORDER_ATOMIC];
}; 

