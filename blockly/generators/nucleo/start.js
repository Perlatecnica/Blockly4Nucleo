/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for Nucleo Digital and Analogue input/output.
 *     Nucleo built in function docs: http://nucleo.cc/en/Reference/HomePage
 */
'use strict';

goog.provide('Blockly.Nucleo.start');

goog.require('Blockly.Nucleo');


Blockly.Nucleo['Nucleo_start'] = function(block) {
	Blockly.Nucleo.addInclude('mbed', '#include "mbed.h"\n');
	var code = '';
	return code;
};