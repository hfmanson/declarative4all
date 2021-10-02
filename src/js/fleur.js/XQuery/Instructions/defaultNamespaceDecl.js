/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceDecl] = function(ctx, children, callback) {
	//ctx.env.nsresolver.declareNamespace(" " + children[0][1][0], children[1][1][0]);
	ctx.env["default_" + children[0][1][0] + "_namespace"] = children[1][1][0];
  Fleur.callback(function() {callback();});
};