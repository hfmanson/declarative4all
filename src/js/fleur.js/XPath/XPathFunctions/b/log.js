/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.b_log_1 = {
  need_ctx: false,
  is_async: false,
  return_type: Fleur.EmptySequence,
  params_type: [
    Fleur.Type_string
  ]
};
Fleur.Context.prototype.b_log_1 = function() {
  console.log(this.item.data);
  this.item = new Fleur.Sequence();
  return this;
};

Fleur.XPathFunctions_b["log#1"] = new Fleur.Function("http://xqib.org", "b:log",
	function(s) {
		console.log(s);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});