/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.decimalConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_decimal.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_decimal;
	Fleur.callback(function() {callback(a);});
};