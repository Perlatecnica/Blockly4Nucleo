/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Generating Nucleo code for list blocks.
 *
 * TODO: A lot of this can be converted to arrays code by creating functions to
 *       replicate this kind of behavior.
 */
'use strict';

goog.provide('Blockly.Nucleo.lists');

goog.require('Blockly.Nucleo');


Blockly.Nucleo['lists_create_empty'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_create_with'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_repeat'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_length'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_isEmpty'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_indexOf'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_getIndex'] = Blockly.Nucleo.noGeneratorCodeInline;

Blockly.Nucleo['lists_setIndex'] = Blockly.Nucleo.noGeneratorCodeLine;
