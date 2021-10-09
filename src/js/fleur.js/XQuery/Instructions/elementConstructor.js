"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_elementConstructor = function(children) {
  let r = "";
  const prefix = children[0][1].length === 2 ? children[0][1][1][1][0] : "";
  let l = 0;
  if (children.length > 1) {
    const transp = this;
    r = children[1][1].reduce((inst, child) => inst + transp.gen(child), "");
    l += children[1][1].length;
    if (children.length === 3) {
      r += children[2][1].reduce((inst, child) => inst + transp.gen(child), "");
      l += children[2][1].length;
    }
  }
  r += this.inst("xqx_elementConstructor('" + prefix + "', '" +  children[0][1][0] + "', " + String(l) + ")");
  if (children.length > 1) {
    const transp = this;
    r += children[1][1].reduce((inst, child) => inst + (child[0] === Fleur.XQueryX.namespaceDeclaration ? transp.inst("xqx_namespaceRemoval('" + (child[1].length === 2 ? child[1][0][1][0] : "") + "')") : ""), "");
  }
  return r;
};

Fleur.Context.prototype.xqx_elementConstructor = function(prefix, localName, count) {
  const elt = new Fleur.Element();
  elt.internal_id = String(Fleur.Document_index++);
  elt.internal_id = String.fromCharCode(64 + elt.internal_id.length) + elt.internal_id;
  elt.nodeName = prefix === "" ? localName : prefix + ":" + localName;
  elt.localName = localName;
  elt.prefix = prefix === "" ? null : prefix;
  elt.namespaceURI = this.rs.nsresolver.lookupNamespaceURI(prefix);
  const args = count !== 0 ? [this.item] : (this.itemstack.push(this.item), []);
  for (let i = 1; i < count; i++) {
    args.push(this.itemstack.pop());
  }
  args.reverse();
  args.forEach(arg => {
    if (arg.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
      elt.setAttributeNode(arg);
    } else {
      elt.appendChild(arg);
    }
  });
  this.item = elt;
  return this;
};

Fleur.XQueryEngine[Fleur.XQueryX.elementConstructor] = function(ctx, children, callback) {
/*
	var elt = new Fleur.Element();
	elt.internal_id = String(Fleur.Document_index++);
	elt.internal_id = String.fromCharCode(64 + elt.internal_id.length) + elt.internal_id;
	elt.nodeName = children[0][1][0];
	elt.namespaceURI = null;
	elt.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		elt.prefix = children[0][1][1][1][0];
	} else {
		elt.prefix = null;
	}
	elt.childNodes = new Fleur.NodeList();
	elt.children = new Fleur.NodeList();
	elt.textContent = "";
*/
	var elt = document.createElementNS(ctx.env.current_element_namespace, children[0][1][0]);
	elt.new_prefix = "";
	if (children[0][1].length === 2) {
		elt.new_prefix = children[0][1][1][1][0] + ":";
	}
	
	if (children.length > 1) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			//elt.cachedNamespaceURI = elt.lookupNamespaceURI(elt.prefix) || ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
			elt = n;
			if (children.length > 2) {
				var nsr = ctx.env.nsresolver;
				ctx.env.nsresolver = new Fleur.XPathNSResolver(elt);
				if (nsr.nsresolver) {
					ctx.env.nsresolver.pf = nsr.nsresolver.pf;
					ctx.env.nsresolver.uri = nsr.nsresolver.uri;
				} else {
					ctx.env.nsresolver.pf = nsr.pf;
					ctx.env.nsresolver.uri = nsr.uri;
				}
				Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
					ctx.env.nsresolver = nsr;
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(n);});
			}
		}, elt);
	} else {
		elt.cachedNamespaceURI = ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
		Fleur.callback(function() {callback(elt);});
	}
};