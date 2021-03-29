"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.signatures.fn_abs_1 = {
  need_ctx: false,
  is_async: false,
  return_type: {type: Fleur.Type_double, occurence: "?"},
  params_type: [
    {type: Fleur.Type_double, occurence: "?"}
  ]
};
Fleur.Context.prototype.fn_abs_1 = function() {
  if (this.item.isNotEmpty()) {
    const op  = Fleur.toJSValue(this.item, true, false, false, false, false, false);
    if (op[0] >= 0) {
			const a = op[1];
			const a2 = op[1] < 0 ? -op[1] : op[1]
			const t = this.item.schemaTypeInfo;
      this.item.data = String(a2);
			let t2;
			switch (t.getPrimitiveType([Fleur.Types_XMLSchema["nonPositiveInteger"], Fleur.Types_XMLSchema["negativeInteger"], Fleur.Types_XMLSchema["byte"], Fleur.Types_XMLSchema["short"], Fleur.Types_XMLSchema["int"], Fleur.Types_XMLSchema["long"]], Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				case Fleur.Types_XMLSchema["nonPositiveInteger"]:
					t2 = Fleur.Types_XMLSchema["nonNegativeInteger"];
					break;
				case Fleur.Types_XMLSchema["negativeInteger"]:
					t2 = Fleur.Types_XMLSchema["positiveInteger"];
					break;
				case Fleur.Types_XMLSchema["byte"]:
					t2 = a2 === Fleur.BigInt(128) ? Fleur.Types_XMLSchema["short"] : Fleur.Types_XMLSchema["byte"];
					break;
				case Fleur.Types_XMLSchema["short"]:
					t2 = a2 === Fleur.BigInt(32768) ? Fleur.Types_XMLSchema["int"] : Fleur.Types_XMLSchema["short"];
					break;
				case Fleur.Types_XMLSchema["int"]:
					t2 = a2 === Fleur.BigInt(2147483648) ? Fleur.Types_XMLSchema["long"] : Fleur.Types_XMLSchema["int"];
					break;
				case Fleur.Types_XMLSchema["long"]:
					t2 = a2 === Fleur.BigInt(9223372036854775808) ? Fleur.Types_XMLSchema["integer"] : Fleur.Types_XMLSchema["long"];
					break;
				default:
					t2 = t;
			}
			this.item.schemaTypeInfo = t2;
    }
  }
  return this;
};

Fleur.XPathFunctions_fn["abs#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:abs",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		a2 = a < 0 ? -a : a;
		switch (t.getPrimitiveType([Fleur.Types_XMLSchema["nonPositiveInteger"], Fleur.Types_XMLSchema["negativeInteger"], Fleur.Types_XMLSchema["byte"], Fleur.Types_XMLSchema["short"], Fleur.Types_XMLSchema["int"], Fleur.Types_XMLSchema["long"]], Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			case Fleur.Types_XMLSchema["nonPositiveInteger"]:
				t2 = Fleur.Types_XMLSchema["nonNegativeInteger"];
				break;
			case Fleur.Types_XMLSchema["negativeInteger"]:
				t2 = Fleur.Types_XMLSchema["positiveInteger"];
				break;
			case Fleur.Types_XMLSchema["byte"]:
				t2 = a2 === Fleur.BigInt(128) ? Fleur.Types_XMLSchema["short"] : Fleur.Types_XMLSchema["byte"];
				break;
			case Fleur.Types_XMLSchema["short"]:
				t2 = a2 === Fleur.BigInt(32768) ? Fleur.Types_XMLSchema["int"] : Fleur.Types_XMLSchema["short"];
				break;
			case Fleur.Types_XMLSchema["int"]:
				t2 = a2 === Fleur.BigInt(2147483648) ? Fleur.Types_XMLSchema["long"] : Fleur.Types_XMLSchema["int"];
				break;
			case Fleur.Types_XMLSchema["long"]:
				t2 = a2 === Fleur.BigInt(9223372036854775808) ? Fleur.Types_XMLSchema["integer"] : Fleur.Types_XMLSchema["long"];
				break;
			default:
				t2 = t;
		}
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});