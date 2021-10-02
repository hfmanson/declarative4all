"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_namespaceDeclaration = function(children) {
  return this.inst("xqx_namespaceDeclaration('" + (children.length === 1 ? "', '" + children[0][1][0] : children[0][1][0] + "', '" + children[1][1][0]) + "')");
};

Fleur.Context.prototype.xqx_namespaceDeclaration = function(prefix, uri) {
  const attr = new Fleur.Attr();
  attr.nodeName = prefix === "" ? "xmlns" : "xmlns" + ":" + prefix;
  attr.localName = prefix === "" ? "xmlns" : prefix;
  attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
  const attrvalue = new Fleur.Text(uri);
  attrvalue.schemaTypeInfo = Fleur.Type_untypedAtomic;
  attr.appendChild(attrvalue);
  this.itemstack.push(this.item);
  this.item = attr;
  this.rs.nsresolver.declareNamespace(prefix, uri);
  return this;
};

Fleur.Context.prototype.xqx_namespaceRemoval = function(prefix) {
  this.rs.nsresolver.removeNamespace(prefix);
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.namespaceDeclaration] = function(ctx, children, callback) {
	var attr;// = new Fleur.Attr();
	var t;
	if (children[0][0] === Fleur.XQueryX.prefixElt) {
		attr = document.createAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:" + children[0][1][0]);
/*
		attr.localName = children[0][1][0];
		attr.nodeName = "xmlns:" + attr.localName;
		attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
		attr.prefix = "xmlns";

		t = new Fleur.Text();
		t.data = children[1][1][0];
*/
		attr.value = children[1][1][0];
	} else {
		attr = document.createAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns");
/*
		attr.localName = "xmlns";
		attr.nodeName = "xmlns";
		attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
*/
		if (children[0][1].length !== 0) {
/*
			t = new Fleur.Text();
			t.data = children[0][1][0];
*/
			attr.value = children[0][1][0];
		}
	}
	Fleur.callback(function() {callback(attr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.nameTest] = function(ctx, children, callback) {
	if (ctx._curr.localName !== children[0]) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var nsURI;
	if (children.length === 1) {
		nsURI = ctx.env.nsresolver.lookupNamespaceURI("") || "";
	} else if (children[1][0] === Fleur.XQueryX.prefix) {
		nsURI = ctx.env.nsresolver.lookupNamespaceURI(children[1][1][0]) || "";
	} else {
		nsURI = children[1][1][0];
	}
	var currURI = ctx._curr.namespaceURI || "";
	if (currURI !==  nsURI && currURI !== "http://www.w3.org/1999/xhtml") {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};