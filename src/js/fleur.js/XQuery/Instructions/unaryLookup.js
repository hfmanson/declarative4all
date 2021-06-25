/*eslint-env browser, node*/
/*globals Fleur */
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XQueryEngine[Fleur.XQueryX.unaryLookup] = function(ctx, children, callback) {
  Fleur.XQueryEngine.lookups(ctx, children, callback, Fleur.XQueryX.unaryLookup);
};