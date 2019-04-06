/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Logic blocks for Blockly.
 *
 * This file is scraped to extract a .json file of block definitions. The array
 * passed to defineBlocksWithJsonArray(..) must be strict JSON: double quotes
 * only, no outside references, no functions, no trailing commas, etc. The one
 * exception is end-of-line comments, which the scraper will remove.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

goog.provide('Blockly.Blocks.nucleo');  // Deprecated
goog.provide('Blockly.Constants.Nucleo');

goog.require('Blockly.Blocks');
goog.require('Blockly');

/**
 * Unused constant for the common HSV hue for all blocks in this category.
 * @deprecated Use Blockly.Msg['LOGIC_HUE']. (2018 April 5)
 */
Blockly.Constants.Logic.HUE = 255;

Blockly.defineBlocksWithJsonArray([ 

	{
	  "type": "io_digitalwrite",
	  "message0": "set digital pin# %1 to %2",
	  "args0": [
		{
		  "type": "field_dropdown",
		  "name": "PIN",
		  "options": [
			[
			  "D0",
			  "D0"
			],
			[
			  "D1",
			  "D1"
			],
			[
			  "D2",
			  "D2"
			],
			[
			  "D3",
			  "D3"
			],
			[
			  "D4",
			  "D4"
			],
			[
			  "D5",
			  "D5"
			],
			[
			  "D6",
			  "D6"
			],
			[
			  "D7",
			  "D7"
			],
			[
			  "D8",
			  "D8"
			],
			[
			  "D9",
			  "D9"
			],
			[
			  "D10",
			  "D10"
			],
			[
			  "D11",
			  "D11"
			],
			[
			  "D12",
			  "D12"
			],
			[
			  "D13",
			  "D13"
			],
			[
			  "D14",
			  "D14"
			],
			[
			  "D15",
			  "D15"
			],
			[
			  "ledonboard",
			  "LED1"
			]
		  ]
		},
		{
		  "type": "input_value",
		  "name": "stateOUT",
		  "check": "Boolean"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": Blockly.Constants.Logic.HUE,
	  "tooltip": "set selected pin in digital out",
	  "helpUrl": ""
	},
	
	{
	  "type": "wait_millisecnds",
	  "message0": "wait %1",
	  "args0": [
		{
		  "type": "input_value",
		  "name": "SECONDS",
		  "check": "Number",
		  "align": "RIGHT"
		}
	  ],
	  "previousStatement": null,
	  "nextStatement": null,
	  "colour": Blockly.Constants.Logic.HUE,
	  "tooltip": "wait for a indicate milliseconds",
	  "helpUrl": ""
	},
	
		{
		  "type": "io_blinkled",
		  "message0": "set blink led %1 for %2",
		  "args0": [
			{
			  "type": "field_dropdown",
			  "name": "PIN",
			  "options": [
							[
						  "D0",
						  "d0"
						],
						[
						  "D1",
						  "d1"
						],
						[
						  "D2",
						  "d2"
						],
						[
						  "D3",
						  "d3"
						],
						[
						  "D4",
						  "d4"
						],
						[
						  "D5",
						  "d5"
						],
						[
						  "D6",
						  "d6"
						],
						[
						  "D7",
						  "d7"
						],
						[
						  "D8",
						  "d8"
						],
						[
						  "D9",
						  "d9"
						],
						[
						  "D10",
						  "d10"
						],
						[
						  "D11",
						  "d11"
						],
						[
						  "D12",
						  "d12"
						],
						[
						  "D13",
						  "d13"
						],
						[
						  "D14",
						  "d14"
						],
						[
						  "D15",
						  "d15"
						],
						[
						  "ledonboard",
						  "LED1"
						]
			  ]
			},
			{
			  "type": "input_value",
			  "name": "MilliSEC",
			  "check": "Number"
			}
		  ],
		  "previousStatement": null,
		  "nextStatement": null,
		  "colour": Blockly.Constants.Logic.HUE,
		  "tooltip": "set the selected pin to blink for indicated milliseconds",
		  "helpUrl": ""
		}
]);  // END JSON EXTRACT (Do not delete this comment.)