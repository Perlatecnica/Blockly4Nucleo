/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Nucleo Digital and Analogue input/output.
 *     Nucleo built in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.pwm');

goog.require('Blockly.Nucleo');


Blockly.Nucleo['pwm_period'] = function(block) {
	//Blockly.Nucleo.addInclude('mbed', '#include "mbed.h"\n');
	var pin = block.getFieldValue('PIN');
	var stateOutput = Blockly.Nucleo.valueToCode(block, 'PERIOD', Blockly.Nucleo.ORDER_ATOMIC) || 0;
	var varname = 'pwm_'.concat( pin ) ; 
	
	var varName = Blockly.Nucleo.variableDB_.getName(
      varname, Blockly.Variables.NAME_TYPE);
	  
	Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Digital pwm');

	var pinSetupCode = 'PwmOut'+' '+ varname +'(' + pin + ');\n';
	Blockly.Nucleo.addSetup('pwm_' + pin, pinSetupCode, false);
	var temp = stateOutput/100;
	
	var code = varName+'.period((float)'+temp+');\n';
	
	return code;
};

Blockly.Nucleo['pwm_dutycycle'] = function(block) {
	//Blockly.Nucleo.addInclude('mbed', '#include "mbed.h"\n');
	var pin = block.getFieldValue('PIN');
	var stateOutput = Blockly.Nucleo.valueToCode(block, 'DUTYCYCLE', Blockly.Nucleo.ORDER_ATOMIC) || 0;
	var varname = 'pwm_'.concat( pin ) ; 
	var code = '';
	
	var varName = Blockly.Nucleo.variableDB_.getName(
      varname, Blockly.Variables.NAME_TYPE);
	  
	Blockly.Nucleo.reservePin(
      block, pin, Blockly.Nucleo.PinTypes.OUTPUT, 'Digital pwm');

	var pinSetupCode = 'PwmOut'+' '+ varname +'(' + pin + ');\n';
	Blockly.Nucleo.addSetup('pwm_' + pin, pinSetupCode, false);
	
	var temp = stateOutput/100;
	var code = varName+'.write((float)'+temp+');\n';
	return code;
};