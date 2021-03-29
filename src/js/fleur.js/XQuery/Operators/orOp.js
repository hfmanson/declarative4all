/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_orOp = function(children) {
  let result = this.gen(children[0][1][0], Fleur.atomicTypes) + "\n" + this.indent + "if (" + this.ctxvarname + ".fn_boolean_1().dropFalse()) {";
  const previndent = this.indent;
  this.indent += this.step;
  result += this.gen(children[1][1][0], Fleur.atomicTypes);
  result += this.inst("fn_boolean_1()");
  this.indent = previndent;
  return result + "\n" + previndent + "}";
};

Fleur.XQueryEngine[Fleur.XQueryX.orOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSBoolean(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (op1[1]) {
			a1.data = "true";
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		} else {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				var op2;
				var a2 = Fleur.Atomize(n);
				op2 = Fleur.toJSBoolean(a2);
				if (op2[0] < 0) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a2.data = "" + op2[1];
				a2.schemaTypeInfo = Fleur.Type_boolean;
				Fleur.callback(function() {callback(a2);});
			});
		}
	});
};