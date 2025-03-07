/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Henri Manson <hfmanson@gmail.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathFunctions_b["getLocation#1"] = new Fleur.Function("http://xqib.org", "b:getLocation",
	function(property) {
		return window.location[property];
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});