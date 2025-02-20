/*
Fleur rev.14 (14)
Comformance impr. for types and functions

Copyright (C) 2019 agenceXML - Alain Couthures
Contact at : info@agencexml.com

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

"use strict";
(function(Fleur) {
Fleur.NodeList = function() {};
Fleur.NodeList.prototype = new Array();
Fleur.NodeList.prototype.item = function(index) {
	return this[index];
};
Fleur.Node = function() {
	this._userData = {};
	this.childNodes = new Fleur.NodeList();
	this.children = new Fleur.NodeList();
};
Fleur.Node.ELEMENT_NODE = 1;
Fleur.Node.ATTRIBUTE_NODE = 2;
Fleur.Node.TEXT_NODE = 3;
Fleur.Node.CDATA_NODE = 4;
Fleur.Node.ENTITY_REFERENCE_NODE = 5;
Fleur.Node.ENTITY_NODE = 6;
Fleur.Node.PROCESSING_INSTRUCTION_NODE = 7;
Fleur.Node.COMMENT_NODE = 8;
Fleur.Node.DOCUMENT_NODE = 9;
Fleur.Node.DOCUMENT_TYPE_NODE = 10;
Fleur.Node.DOCUMENT_FRAGMENT_NODE = 11;
Fleur.Node.NOTATION_NODE = 12;
Fleur.Node.NAMESPACE_NODE = 129;
Fleur.Node.ATOMIC_NODE = Fleur.Node.TEXT_NODE;
Fleur.Node.SEQUENCE_NODE = 130;
Fleur.Node.MULTIDIM_NODE = 131;
Fleur.Node.ARRAY_NODE = 132;
Fleur.Node.MAP_NODE = 133;
Fleur.Node.ENTRY_NODE = 134;
Fleur.Node.FUNCTION_NODE = 135;
Fleur.Node.DOCUMENT_POSITION_DISCONNECTED = 1;
Fleur.Node.DOCUMENT_POSITION_PRECEDING = 2;
Fleur.Node.DOCUMENT_POSITION_FOLLOWING = 4;
Fleur.Node.DOCUMENT_POSITION_CONTAINS = 8;
Fleur.Node.DOCUMENT_POSITION_CONTAINED_BY = 16;
Fleur.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = 32;
Fleur.Node.QNameReg = /^([_A-Z][-_.\w]*:)?[_A-Z][-_.\w]*$/i;
Fleur.Node.QNameCharsReg = /^[-_.\w:]+$/i;
Fleur.Node.prefixReg = /^[-_.\w]+$/i;
Fleur.Node.JSNameReg = /^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[a-zA-Z_$][0-9a-zA-Z_$]*$/;
Object.defineProperties(Fleur.Node.prototype, {
	prefix: {
		set: function(value) {
			if ((value === "xml" && this.namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
				(value === "xmlns" && this.namespaceURI !== "http://www.w3.org/2000/xmlns/")) {
				throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
			}
			if (!Fleur.Node.prefixReg.test(value)) {
				throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
			}
			this._prefix = value;
			if (value) {
				this.nodeName = value + ":" + this.localName;
			}
		},
		get: function() {
			return this._prefix;
		}
	},
	textContent: {
		set: function(value) {
			if (this.nodeType === Fleur.Node.TEXT_NODE || this.nodeType === Fleur.Node.CDATA_NODE || this.nodeType === Fleur.Node.COMMENT_NODE) {
				this.data = value;
			} else {
				while (this.firstChild) {
					this.removeChild(this.firstChild);
				}
				if (value !== "") {
					this.appendChild(new Fleur.Text());
					this.firstChild.data = value;
				}
			}
		},
		get: function() {
			var _textContent = "", i = 0, li = this.childNodes.length;
			if (this.nodeType === Fleur.Node.TEXT_NODE || this.nodeType === Fleur.Node.CDATA_NODE) {
				return this.data;
			}
			while (i < li) {
				_textContent += this.childNodes[i++].textContent;
			}
			return _textContent;
		}
	}
});
Fleur.Node.prototype.appendChild = function(newChild) {
	var n = this, i = 0, l;
	if (newChild.nodeType === Fleur.Node.DOCUMENT_FRAGMENT_NODE) {
		l = newChild.childNodes.length;
		while (i < l) {
			this.appendChild(newChild.childNodes[0]);
			i++;
		}
		return newChild;
	}
	if ((this.nodeType !== Fleur.Node.SEQUENCE_NODE || this.ownerDocument) && (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE || (this.nodeType === Fleur.Node.ATTRIBUTE_NODE && newChild.nodeType !== Fleur.Node.TEXT_NODE))) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	} else {
		if ((this.nodeType !== Fleur.Node.SEQUENCE_NODE && this.nodeType !== Fleur.Node.MULTIDIM_NODE) || this.ownerDocument) {
			while (n) {
				if (n === newChild) {
					throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
				}
				n = n.parentNode || n.ownerElement;
			}
			if (newChild.ownerDocument && (this.ownerDocument || this) !== newChild.ownerDocument) {
				throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
			}
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			if (this.childNodes.length === 0) {
				this.firstChild = newChild;
			}
			newChild.previousSibling = this.lastChild;
			newChild.nextSibling = null;
			if (this.lastChild) {
				this.lastChild.nextSibling = newChild;
			}
			newChild.parentNode = this;
			this.lastChild = newChild;
		}
		this.childNodes.push(newChild);
		if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.MULTIDIM_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
			this.children.push(newChild);
		}
	}
	if (this.nodeType !== Fleur.Node.SEQUENCE_NODE && this.nodeType !== Fleur.Node.MULTIDIM_NODE) {
		newChild.idRecalculate(String(this.childNodes.length - 1));
	}
	return newChild;
};
Fleur.Node.prototype.idRecalculate = function(strpos) {
	var i, l;
	var upper = this.parentNode || this.ownerElement;
	if (upper) {
		upper = upper.internal_id;
	}
	if (upper) {
		this.internal_id = (this.parentNode || this.ownerElement).internal_id + (this.parentNode ? "-" : "+") + String.fromCharCode(96 + strpos.length) + strpos;
		if (this.attributes) {
			for (i = 0, l = this.attributes.length; i < l; i++) {
				this.attributes[i].idRecalculate(String(i));
			}
		}
		for (i = 0, l = this.childNodes.length; i < l; i++) {
			this.childNodes[i].idRecalculate(String(i));
		}
	}
};
Fleur.Node.prototype.appendDescendants = function(src) {
	if (src.childNodes) {
		var dest = this;
		if (src.childNodes.forEach) {
			src.childNodes.forEach(function(n) {dest.appendChild(n); dest.appendDescendants(n);});
		} else {
			for (var i = 0, l = src.childNodes.length; i < l; i++) {
				dest.appendChild(src.childNodes[i]);
				dest.appendDescendants(src.childNodes[i]);
			}
		}
	}
};
Fleur.Node.prototype.appendDescendantsRev = function(src) {
	if (src.childNodes) {
		var dest = this;
		if (src.childNodes.forEach) {
			src.childNodes.forEach(function(n) {dest.appendDescendantsRev(n); dest.appendChild(n);});
		} else {
			for (var i = 0, l = src.childNodes.length; i < l; i++) {
				dest.appendDescendantsRev(src.childNodes[i]);
				dest.appendChild(src.childNodes[i]);
			}
		}
	}
};
Fleur.Node.prototype.appendContent = function(n, sep) {
	var n2;
	switch(n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (this.lastChild && this.lastChild.nodeType === Fleur.Node.TEXT_NODE) {
				this.lastChild.data += sep + n.data;
			} else if (n.data && n.data !== "") {
				n2 = new Fleur.Text();
				n2.data = n.data;
				n2.schemaTypeInfo = Fleur.Type_untypedAtomic;
				this.appendChild(n2);
			}
			break;
		case Fleur.Node.COMMENT_NODE:
			n2 = new Fleur.Comment();
			n2.data = n.data;
			this.appendChild(n2);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			n2 = new Fleur.ProcessingInstruction();
			n2.nodeName = n2.target = n.target;
			n2.data = n.data;
			this.appendChild(n2);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			n2 = new Fleur.Attr();
			n2.nodeName = n.nodeName;
			n2.localName = n.localName;
			n2.schemaTypeInfo = n.schemaTypeInfo;
			n2.namespaceURI = n.namespaceURI;
			n2.prefix = n.prefix;
			n.childNodes.forEach(function(c) {
				n2.appendContent(c);
			});
			this.setAttributeNodeNS(n2);
			break;
		case Fleur.Node.ELEMENT_NODE:
			n2 = new Fleur.Element();
			n2.nodeName = n.nodeName;
			n2.localName = n.localName;
			n2.schemaTypeInfo = n.schemaTypeInfo;
			n2.namespaceURI = n.namespaceURI;
			n2.prefix = n.prefix;
			n.attributes.forEach(function(c) {
				n2.appendContent(c, "");
			});
			n.childNodes.forEach(function(c) {
				n2.appendContent(c, "");
			});
			this.appendChild(n2);
			break;
		case Fleur.Node.SEQUENCE_NODE:
			var n0 = this;
			n.childNodes.forEach(function(c) {
				n0.appendContent(c, " ");
			});
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
};
Fleur.Node.prototype.canonicalize = function() {
	if (this.nodeType === Fleur.Node.TEXT_NODE && this.schemaTypeInfo) {
		try {
			this.data = this.schemaTypeInfo.canonicalize(this.data);
			return true;
		} catch (e) {}
	}
	return false;
};
Fleur.Node.prototype.clearUserData = function() {
	this._userData = {};
};
Fleur.Node.prototype.cloneNode = function(deep) {
	var i = 0, li = 0, j = 0, lj = 0, clone = null;
	switch (this.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (this.ownerDocument) {
				clone = this.ownerDocument.createTextNode(this.data);
			} else {
				clone = new Fleur.Text();
				clone.appendData(this.data);
			}
			clone.schemaTypeInfo = this.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			clone = this.ownerDocument.createComment(this.data);
			break;
		case Fleur.Node.CDATA_NODE:
			clone = this.ownerDocument.createCDATASection(this.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			clone = this.ownerDocument.createAttributeNS(this.namespaceURI, this.nodeName);
			clone.schemaTypeInfo = this.schemaTypeInfo;
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ENTRY_NODE:
			if (this.ownerDocument) {
				clone = this.ownerDocument.createEntry(this.nodeName);
			} else {
				clone = new Fleur.Entry();
				clone.childNodes = new Fleur.NodeList();
				clone.children = new Fleur.NodeList();
				clone.nodeName = clone.localName = this.nodeName;
				clone.textContent = "";
			}
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			clone = this.ownerDocument.createElementNS(this.namespaceURI, this.nodeName);
			clone.schemaTypeInfo = this.schemaTypeInfo;
			li = this.attributes.length;
			while (i < li) {
				clone.setAttributeNode(this.attributes[i++].cloneNode(false));
			}
			if (deep) {
				lj = this.childNodes.length;
				while (j < lj) {
					clone.appendChild(this.childNodes[j++].cloneNode(true));
				}
			}
			break;
		case Fleur.Node.MAP_NODE:
			clone = this.ownerDocument ? this.ownerDocument.createMap() : new Fleur.Map();
			li = this.entries.length;
			while (i < li) {
				clone.setEntryNode(this.entries[i++].cloneNode(false));
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			clone = this.ownerDocument ? this.ownerDocument.createSequence() : new Fleur.Sequence();
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			clone = this.ownerDocument.createArray();
			lj = this.childNodes.length;
			while (j < lj) {
				clone.appendChild(this.childNodes[j++].cloneNode(true));
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
			break;
		case Fleur.Node.FUNCTION_NODE:
			clone = new Fleur.Function(this.namespaceURI, this.nodeName, this.jsfunc, this.xqxfunc, this.argtypes, this.needctx, this.needcallback, this.restype, this.updating);
			break;
	}
	return clone;
};
Fleur.Node.prototype.compareDocumentPosition = function(other) {
	var nancestor = this.ownerElement || this.parentNode;
	var nancestors = [];
	var oancestor = other.ownerElement || other.parentNode;
	var oancestors = [];
	var i = 0, j = 0;
	if (this.ownerDocument.implementation !== other.ownerDocument.implementation) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (this === other) {
		return 0;
	}
	while (nancestor) {
		nancestors.splice(0, 0, nancestor);
		nancestor = nancestor.parentNode;
	}
	while (oancestor) {
		oancestors.splice(0, 0, oancestor);
		oancestor = oancestor.parentNode;
	}
	do {
		if (nancestors[i] !== oancestors[i]) {
			if (i === 0) {
				return Fleur.Node.DOCUMENT_POSITION_DISCONNECTED;
			}
			if (!nancestors[i]) {
				return Fleur.Node.DOCUMENT_POSITION_CONTAINS | Fleur.Node.DOCUMENT_POSITION_PRECEDING;
			}
			if (!oancestors[i]) {
				return Fleur.Node.DOCUMENT_POSITION_CONTAINED_BY | Fleur.Node.DOCUMENT_POSITION_FOLLOWING;
			}
			do {
				if (nancestors[i - 1].childNodes[j] === nancestors[i]) {
					return Fleur.Node.DOCUMENT_POSITION_PRECEDING;
				}
				if (nancestors[i - 1].childNodes[j] === oancestors[i]) {
					return Fleur.Node.DOCUMENT_POSITION_FOLLOWING;
				}
			} while (j++);
		}
		if (!nancestors[i]) {
			return (this.localName < other.localName ? Fleur.Node.DOCUMENT_POSITION_PRECEDING : Fleur.Node.DOCUMENT_POSITION_FOLLOWING) | Fleur.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;
		}
	} while (i++);
};
Fleur.Node.prototype.copyNode = function() {
	var i = 0, li = 0, j = 0, lj = 0, copy = null;
	switch (this.nodeType) {
		case Fleur.Node.TEXT_NODE:
			copy = new Fleur.Text();
			copy.appendData(this.data);
			copy.schemaTypeInfo = this.schemaTypeInfo;
			break;
		case Fleur.Node.ENTRY_NODE:
			copy = new Fleur.Entry();
			copy.childNodes = new Fleur.NodeList();
			copy.children = new Fleur.NodeList();
			copy.nodeName = copy.localName = this.nodeName;
			copy.textContent = "";
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.MAP_NODE:
			copy = new Fleur.Map();
			li = this.entries.length;
			while (i < li) {
				copy.setEntryNode(this.entries[i++].copyNode());
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			if (this === Fleur.EmptySequence) {
				return this;
			}
			copy = new Fleur.Sequence();
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			copy = new Fleur.Array();
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			copy = new Fleur.Attr();
			copy.nodeName = this.nodeName;
			copy.localName = this.localName;
			copy.prefix = this.prefix;
			copy.namespaceURI = this.namespaceURI;
			copy.schemaTypeInfo = this.schemaTypeInfo;
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			copy = new Fleur.Element();
			copy.nodeName = this.nodeName;
			copy.localName = this.localName;
			copy.prefix = this.prefix;
			copy.namespaceURI = this.namespaceURI;
			copy.schemaTypeInfo = this.schemaTypeInfo;
			li = this.attributes.length;
			while (i < li) {
				copy.setAttributeNode(this.attributes[i++].copyNode());
			}
			lj = this.childNodes.length;
			while (j < lj) {
				copy.appendChild(this.childNodes[j++].copyNode());
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
			break;
		case Fleur.Node.FUNCTION_NODE:
			copy = new Fleur.Function(this.namespaceURI, this.nodeName, this.jsfunc, this.xqxfunc, this.argtypes, this.needctx, this.needcallback, this.restype, this.updating);
			break;
	}
	return copy;
};
Fleur.Node.prototype.getFeature = function(feature, version) {
	return this.ownerDocument.implementation.getFeature(feature, version);
};
Fleur.Node.prototype.getUserData = function(key) {
	return this._userData[key];
};
Fleur.Node.prototype.hasAttributes = function() {
	return !!this.attributes && this.attributes.length !== 0;
};
Fleur.Node.prototype.hasEntries = function() {
	return !!this.entries && this.entries.length !== 0;
};
Fleur.Node.prototype.hasChildNodes = function() {
	return !!this.childNodes && this.childNodes.length !== 0;
};
Fleur.Node.prototype.insertBefore = function(newChild, refChild) {
	var i = 0, j = 0, l = this.childNodes.length, n = refChild, ln;
	if (newChild.nodeType === Fleur.Node.DOCUMENT_FRAGMENT_NODE) {
		ln = newChild.childNodes.length;
		while (i < ln) {
			this.insertBefore(newChild.childNodes[i], refChild);
			i++;
		}
		return newChild;
	} else if (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE || (this.nodeType === Fleur.Node.ATTRIBUTE_NODE && newChild.nodeType !== Fleur.Node.TEXT_NODE)) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	} else {
		if (refChild) {
			while (n) {
				if (n === newChild) {
					throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
				}
				n = n.parentNode || n.ownerElement;
			}
			if (refChild.ownerDocument !== newChild.ownerDocument) {
				throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
			}
			if (refChild.parentNode !== this) {
				throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
			}
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			while (i < l) {
				if (this.childNodes[i] === refChild) {
					newChild.parentNode = this;
					newChild.previousSibling = refChild.previousSibling;
					refChild.previousSibling = newChild;
					if (newChild.previousSibling) {
						newChild.previousSibling.nextSibling = newChild;
					} else {
						this.firstChild = newChild;
					}
					newChild.nextSibling = refChild;
					if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
						this.children.splice(j, 0, newChild);
					}
					this.childNodes.splice(i, 0, newChild);
					return newChild;
				}
				if (this.childNodes[i] === this.children[j]) {
					j++;
				}
				i++;
			}
		} else {
			if (newChild.parentNode) {
				newChild.parentNode.removeChild(newChild);
			}
			newChild.parentNode = this;
			if (this.childNodes.length !== 0) {
				newChild.previousSibling = this.childNodes[this.childNodes.length - 1];
				this.childNodes[this.childNodes.length - 1].nextSibling = newChild;
			} else {
				newChild.previousSibling = null;
			}
			newChild.nextSibling = null;
			if (newChild.nodeType === Fleur.Node.ELEMENT_NODE || newChild.nodeType === Fleur.Node.SEQUENCE_NODE || newChild.nodeType === Fleur.Node.ARRAY_NODE || newChild.nodeType === Fleur.Node.MAP_NODE || newChild.nodeType === Fleur.Node.ENTRY_NODE) {
				this.children.push(newChild);
			}
			this.childNodes.push(newChild);
			this.lastChild = newChild;
			return newChild;
		}
	}
};
Fleur.Node.prototype.isDefaultNamespace = function(namespaceURI) {
	var pnode = this.parentNode || this.ownerElement || this.documentElement;
	if (this.nodeType === Fleur.Node.ELEMENT_NODE) {
		return this.prefix ? this.getAttribute("xmlns") === namespaceURI : this.namespaceURI === namespaceURI;
	}
	return pnode ? pnode.isDefaultNamespace(namespaceURI) : false;
};
Fleur.Node.prototype.isEqualNode = function(arg) {
	var i = 0, j = 0, li, lj;
	if (!arg || this.nodeType !== arg.nodeType || this.nodeName !== arg.nodeName || this.localName !== arg.localName || this.namespaceURI !== arg.namespaceURI || this.prefix !== arg.prefix || this.nodeValue !== arg.nodeValue) {
		return false;
	}
	if (this.attributes) {
		li = this.attributes.length;
		if (!arg.attributes || arg.attributes.length !== li) {
			return false;
		}
		while (i < li) {
			if (!this.attributes[i].isEqualNode(arg.getAttributeNodeNS(this.attributes[i].namespaceURI, this.attributes[i].localName))) {
				return false;
			}
			i++;
		}
	}
	if (this.entries) {
		li = this.entries.length;
		if (!arg.entries || arg.entries.length !== li) {
			return false;
		}
		while (i < li) {
			if (!this.entries[i].isEqualNode(arg.getEntryNode(this.entries[i].nodeName))) {
				return false;
			}
			i++;
		}
	}
	if (this.childNodes) {
		lj = this.childNodes.length;
		if (!arg.childNodes || arg.childNodes.length !== lj) {
			return false;
		}
		while (j < lj) {
			if (!this.childNodes[j].isEqualNode(arg.childNodes[j])) {
				return false;
			}
			j++;
		}
	}
	if (this.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		if (this.publicId !== arg.publicId || this.systemId !== arg.systemId || this.internalSubset !== arg.internalSubset) {
			return false;
		}
	}
	return true;
};
Fleur.Node.prototype.isSameNode = function(other) {
	return other === this;
};
Fleur.Node.prototype.isSupported = function(feature, version) {
 var doc = this.ownerDocument ? this.ownerDocument : this;
 return doc.implementation.hasFeature(feature, version);
};
Fleur.Node.prototype.lookupNamespaceURI = function(prefix) {
	var namespaceURI, xmlns, pnode = this;
	if (pnode.nodeType === Fleur.Node.DOCUMENT_NODE) {
		pnode = pnode.documentElement;
	}
	if (prefix === null || prefix === '') {
		while (pnode) {
			if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
				xmlns = pnode.getAttributeNode("xmlns");
				if (xmlns) {
					return xmlns.textContent;
				}
			}
			pnode = pnode.parentNode || pnode.ownerElement;
		}
		return null;
	}
	while (pnode) {
		if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
			namespaceURI = pnode.getAttributeNS("http://www.w3.org/2000/xmlns/", prefix);
			if (namespaceURI !== '') {
				return namespaceURI;
			}
		}
		pnode = pnode.parentNode || pnode.ownerElement;
	}
	return null;
};
Fleur.Node.prototype.lookupPrefix = function(namespaceURI) {
	var pnode = this;
	if (namespaceURI === null || namespaceURI === '') {
		return null;
	}
	if (pnode.nodeType === Fleur.Node.DOCUMENT_NODE) {
		pnode = pnode.documentElement;
	}
	while (pnode) {
		if (pnode.nodeType === Fleur.Node.ELEMENT_NODE) {
			for (var i = 0, l = pnode.attributes.length; i < l; i++) {
				if (pnode.attributes[i].namespaceURI === "http://www.w3.org/2000/xmlns/" && pnode.attributes[i].value === namespaceURI) {
					return pnode.attributes[i].localName;
				}
			}
		}
		pnode = pnode.parentNode || pnode.ownerElement;
	}
	return null;
};
Fleur.Node.prototype.normalize = function() {
	var i = 0;
	while (i < this.childNodes.length) {
		switch (this.childNodes[i].nodeType) {
			case Fleur.Node.DOCUMENT_NODE:
			case Fleur.Node.ATTRIBUTE_NODE:
			case Fleur.Node.ELEMENT_NODE:
			case Fleur.Node.SEQUENCE_NODE:
			case Fleur.Node.ARRAY_NODE:
			case Fleur.Node.MAP_NODE:
			case Fleur.Node.ENTRY_NODE:
				this.childNodes[i].normalize();
				break;
			case Fleur.Node.TEXT_NODE:
				while (i + 1 < this.childNodes.length) {
					if (this.childNodes[i + 1].nodeType !== Fleur.Node.TEXT_NODE) {
						break;
					}
					this.childNodes[i].appendData(this.childNodes[i + 1].nodeValue);
					this.removeChild(this.childNodes[i + 1]);
				}
				if (this.childNodes[i].data.length === 0) {
					this.removeChild(this.childNodes[i]);
				}
				break;
		}
		i++;
	}
};
Fleur.Node.prototype.removeChild = function(oldChild) {
	var i = 0, j = 0, l = this.childNodes.length;
	if (oldChild.parentNode !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	while (i < l) {
		if (this.childNodes[i] === oldChild) {
			if (oldChild.previousSibling) {
				oldChild.previousSibling.nextSibling = oldChild.nextSibling;
			} else {
				this.firstChild = oldChild.nextSibling;
			}
			if (oldChild.nextSibling) {
				oldChild.nextSibling.previousSibling = oldChild.previousSibling;
			} else {
				this.lastChild = oldChild.previousSibling;
			}
			this.childNodes.splice(i, 1);
			if (this.children[j] === oldChild) {
				this.children.splice(j, 1);
			}
			oldChild.parentNode = null;
			oldChild.previousSibling = null;
			oldChild.nextSibling = null;
			return oldChild;
		}
		if (this.childNodes[i] === this.children[j]) {
			j++;
		}
		i++;
	}
};
Fleur.Node.prototype.replaceChild = function(newChild, oldChild) {
	var i = 0, j = 0, l = this.childNodes.length, n = this;
	if (this.nodeType === Fleur.Node.DOCUMENT_NODE && oldChild.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (newChild.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	}
	while (n) {
		if (n === newChild) {
			throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
		}
		n = n.parentNode || n.ownerElement;
	}
	if (oldChild.parentNode !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	if (newChild.ownerDocument && newChild.ownerDocument !== (this.ownerDocument || this)) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	if (oldChild === newChild) {
		return oldChild;
	}
	while (i < l) {
		if (this.childNodes[i] === oldChild) {
			this.childNodes[i] = newChild;
			if (this.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE || this.childNodes[i].nodeType === Fleur.Node.SEQUENCE_NODE || this.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE || this.childNodes[i].nodeType === Fleur.Node.MAP_NODE || this.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE) {
				this.children[j] = newChild; //Incomplete
			}
			newChild.parentNode = this;
			newChild.previousSibling = oldChild.previousSibling;
			if (newChild.previousSibling) {
				newChild.previousSibling.nextSibling = newChild;
			} else {
				this.firstChild = newChild;
			}
			newChild.nextSibling = oldChild.nextSibling;
			if (newChild.nextSibling) {
				newChild.nextSibling.previousSibling = newChild;
			} else {
				this.lastChild = newChild;
			}
			oldChild.parentNode = null;
			oldChild.previousSibling = null;
			oldChild.nextSibling = null;
			return oldChild;
		}
		if (this.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE || this.childNodes[i].nodeType === Fleur.Node.SEQUENCE_NODE || this.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE || this.childNodes[i].nodeType === Fleur.Node.MAP_NODE || this.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE) {
			j++;
		}
		i++;
	}
	return oldChild;
};
Fleur.Node.prototype.setUserData = function(key, data, handler) {
	if (data) {
		this._userData[key] = data;
	} else {
		delete this._userData[key];
	}
};
Fleur.Node.prototype._setOwnerDocument = function(doc) {
	if (this.ownerDocument) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	this.ownerDocument = doc;
};
Fleur.Node.prototype._setNodeNameLocalNamePrefix = function(namespaceURI, qualifiedName) {
	var pos = qualifiedName.indexOf(":");
	if ( pos === 0 || pos === qualifiedName.length - 1 || (!namespaceURI && pos > 0)) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	this.nodeName = qualifiedName;
	this.namespaceURI = namespaceURI;
	this.localName = qualifiedName.substr(pos + 1);
	this.prefix = pos > 0 ? qualifiedName.substr(0, pos) : null;
};
Fleur.Node.prototype.then = function(resolve, reject) {
	if (this.schemaTypeInfo === Fleur.Type_error) {
		reject(this);
	} else {
		resolve(this);
	}
};
Fleur.CharacterData = function() {
	this.data = "";
	this.length = 0;
};
Fleur.CharacterData.prototype = new Fleur.Node();
Fleur.CharacterData.prototype.appendData = function(arg) {
	this.textContent = this.nodeValue = this.data += arg;
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.deleteData = function(offset, count) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + this.data.substr(offset + count);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.insertData = function(offset, data) {
	if (offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + data + this.data.substr(offset);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.replaceData = function(offset, count, arg) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	this.textContent = this.nodeValue = this.data = this.data.substr(0, offset) + arg + this.data.substr(offset + count);
	this.length = this.data.length;
};
Fleur.CharacterData.prototype.substringData = function(offset, count) {
	if (count < 0 || offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	}
	return this.data.substr(offset, count);
};
Fleur.Array = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ARRAY_NODE;
	this.nodeName = "#array";
};
Fleur.Array.prototype = new Fleur.Node();
Fleur.Attr = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ATTRIBUTE_NODE;
};
Fleur.Attr.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Attr.prototype, {
	nodeValue: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	},
	specified: {
		get: function() {
			return true;
		}
	},
	value: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	}
});
Fleur.CDATASection = function() {
	this.nodeType = Fleur.Node.CDATA_NODE;
	this.nodeName = "#cdata-section";
};
Fleur.CDATASection.prototype = new Fleur.CharacterData();
Fleur.Comment = function() {
	this.nodeType = Fleur.Node.COMMENT_NODE;
	this.nodeName = "#comment";
};
Fleur.Comment.prototype = new Fleur.CharacterData();
Fleur.Document_index = 0;
Fleur.Document = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.DOCUMENT_NODE;
	this.nodeName = "#document";
	this.inputEncoding = "UTF-8";
	this.xmlStandalone = false;
	this.xmlVersion = "1.0";
	this._elementById = {};
	this._elementsByTagName = {};
	this.internal_id = String(Fleur.Document_index++);
	this.internal_id = String.fromCharCode(64 + this.internal_id.length) + this.internal_id;
};
Fleur.Document.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Document.prototype, {
	documentElement: {
		get: function() {
			return this.children[0] ? this.children[0] : null;
		}
	},
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.Document.prototype._adoptNode = function(source) {
	var ic = 0, lc = source.childNodes ? source.childNodes.length : 0, ia = 0, la = source.attributes ? source.attributes.length : 0;
	source.ownerDocument = this;
	while (ia < la) {
		this.adoptNode(source.attributes.item(ia));
		ia++;
	}
	while (ic < lc) {
		this.adoptNode(source.childNodes[ic]);
		ic++;
	}
	return source;
};
Fleur.Document.prototype.adoptNode = function(source) {
	if (source.nodeType === Fleur.Node.DOCUMENT_NODE || source.nodeType === Fleur.Node.DOCUMENT_TYPE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	if (source.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		source.ownerElement = null;
	}
	return this._adoptNode(source);
};
Fleur.Document.prototype.createAttribute = function(attrname) {
	return this.createAttributeNS(null, attrname);
};
Fleur.Document.prototype.createAttributeNS = function(namespaceURI, qualifiedName) {
	var node = new Fleur.Attr();
	if (!Fleur.Node.QNameReg.test(qualifiedName)) {
		if (Fleur.Node.QNameCharsReg.test(qualifiedName)) {
			throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
		} else {
			console.log(qualifiedName);
			throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
		}
	}
	if ((namespaceURI === null && qualifiedName.indexOf(":") !== -1) ||
		(qualifiedName.substr(0, 4) === "xml:" && namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
		((qualifiedName === "xmlns" || qualifiedName.substr(0, 6) === "xmlns:") && namespaceURI !==  "http://www.w3.org/2000/xmlns/") ||
		(namespaceURI ===  "http://www.w3.org/2000/xmlns/" && qualifiedName !== "xmlns" && qualifiedName.indexOf(":") !== -1 && qualifiedName.substr(0, 6) !== "xmlns:")) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
	node.name = qualifiedName;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createCDATASection = function(data) {
	var node = new Fleur.CDATASection();
	node._setOwnerDocument(this);
	node.appendData(data);
	return node;
};
Fleur.Document.prototype.createComment = function(data) {
	var node = new Fleur.Comment();
	node._setOwnerDocument(this);
	node.appendData(data);
	return node;
};
Fleur.Document.prototype.createDocumentFragment = function() {
	var node = new Fleur.DocumentFragment();
	node._setOwnerDocument(this);
	return node;
};
Fleur.Document.prototype.createElement = function(tagName) {
	var node = new Fleur.Element();
	node._setOwnerDocument(this);
	node.nodeName = tagName;
	node.namespaceURI = null;
	node.localName = tagName;
	node.prefix = null;
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createElementNS = function(namespaceURI, qualifiedName) {
	var node = new Fleur.Element();
	if ((namespaceURI === null && qualifiedName.indexOf(":") !== -1) ||
		(qualifiedName.substr(0, 4) === "xml:" && namespaceURI !== "http://www.w3.org/XML/1998/namespace") ||
		((qualifiedName === "xmlns" || qualifiedName.substr(0, 6) === "xmlns:") && namespaceURI !==  "http://www.w3.org/2000/xmlns/") ||
		(namespaceURI ===  "http://www.w3.org/2000/xmlns/" && qualifiedName !== "xmlns" && qualifiedName.indexOf(":") !== -1 && qualifiedName.substr(0, 6) !== "xmlns:")) {
		throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
	}
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createEntityReference = function(entname) {
	var node = new Fleur.EntityReference();
	node._setOwnerDocument(this);
	node._setNodeNameLocalNamePrefix(null, entname);
	node.nodeName = entname;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createProcessingInstruction = function(target, data) {
	var node = new Fleur.ProcessingInstruction();
	if (!Fleur.Node.QNameReg.test(target)) {
		throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
	}
	node._setOwnerDocument(this);
	node.nodeName = node.target = target;
	node.textContent = node.data = data;
	return node;
};
Fleur.Document.prototype.createSequence = function() {
	var node = new Fleur.Sequence();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createArray = function() {
	var node = new Fleur.Array();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createMap = function() {
	var node = new Fleur.Map();
	node._setOwnerDocument(this);
	return node;
};
Fleur.Document.prototype.createEntry = function(entryname) {
	var node = new Fleur.Entry();
	node._setOwnerDocument(this);
	node.childNodes = new Fleur.NodeList();
	node.children = new Fleur.NodeList();
	node.nodeName = node.localName = entryname;
	node.textContent = "";
	return node;
};
Fleur.Document.prototype.createTextNode = function(data) {
	var node = new Fleur.Text();
	node._setOwnerDocument(this);
	node.appendData(data);
	node.schemaTypeInfo = Fleur.Type_untypedAtomic;
	return node;
};
Fleur.Document.prototype.createTypedValueNode = function(typeNamespace, typeName, data) {
	var node = new Fleur.Text();
	node._setOwnerDocument(this);
	node.appendData(data);
	node.schemaTypeInfo = Fleur.Types[typeNamespace][typeName];
	return node;
};
Fleur.Document.prototype.createNamespace = function(prefix, namespaceURI) {
	var node = new Fleur.Namespace();
	node.name = prefix;
	node.textContent = node.data = namespaceURI;
	return node;
};
Fleur.Document.prototype.getElementById = function(elementId) {
	return this._elementById[elementId];
};
Fleur.Document.prototype.getElementsByTagName = function(tagName) {
	var i = 0, l = this.children.length, elts = new Fleur.NodeList();
	while (i < l) {
		this.children[i++]._getElementsByTagName(tagName, elts);
	}
	return elts;
};
Fleur.Document.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
	var i = 0, l = this.children.length, elts = new Fleur.NodeList();
	if (!namespaceURI) {
		return this.getElementsByTagName(localName);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
	return elts;
};
Fleur.Document.prototype.importNode = function(importedNode, deep) {
	var i = 0, li = 0, j = 0, lj = 0, node = null;
	switch (importedNode.nodeType) {
		case Fleur.Node.TEXT_NODE:
			node = this.createTextNode(importedNode.data);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			node = this.createComment(importedNode.data);
			break;
		case Fleur.Node.CDATA_NODE:
			node = this.createCDATASection(importedNode.data);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			node = this.createProcessingInstruction(importedNode.target, importedNode.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			node = this.createAttributeNS(importedNode.namespaceURI, importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.ELEMENT_NODE:
			node = this.createElementNS(importedNode.namespaceURI, importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			li = importedNode.attributes.length;
			while (i < li) {
				node.setAttributeNode(this.importNode(importedNode.attributes[i++], true));
			}
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(this.importNode(importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.SEQUENCE_NODE:
			node = this.createSequence();
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.ARRAY_NODE:
			node = this.createArray();
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.MAP_NODE:
			node = this.createMap();
			li = importedNode.entries.length;
			while (i < li) {
				node.setEntryNode(this.importNode(importedNode.entries[i++], true));
			}
			break;
		case Fleur.Node.ENTRY_NODE:
			node = this.createEntry(importedNode.nodeName);
			lj = importedNode.childNodes.length;
			while (j < lj) {
				node.appendChild(this.importNode(importedNode.childNodes[j++], true));
			}
			break;
		case Fleur.Node.DOCUMENT_FRAGMENT_NODE:
			node = this.createDocumentFragment();
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(this.importNode(importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	return node;
};
Fleur.Document.docImportNode = function(doc, importedNode, deep) {
	var i = 0, li = 0, j = 0, lj = 0, node = null;
	switch (importedNode.nodeType) {
		case Fleur.Node.TEXT_NODE:
			node = doc.createTextNode(importedNode.data);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			break;
		case Fleur.Node.COMMENT_NODE:
			node = doc.createComment(importedNode.data);
			break;
		case Fleur.Node.CDATA_NODE:
			node = doc.createCDATASection(importedNode.data);
			break;
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			node = doc.createProcessingInstruction(importedNode.target, importedNode.data);
			break;
		case Fleur.Node.ATTRIBUTE_NODE:
			node = doc.createAttributeNS(importedNode.namespaceURI || "", importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			node.value = importedNode.value;
			break;
		case Fleur.Node.ELEMENT_NODE:
			node = doc.createElementNS(importedNode.namespaceURI || "http://www.w3.org/1999/xhtml", importedNode.nodeName);
			node.schemaTypeInfo = importedNode.schemaTypeInfo;
			li = importedNode.attributes.length;
			while (i < li) {
				node.setAttributeNode(Fleur.Document.docImportNode(doc, importedNode.attributes[i++], true));
			}
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(Fleur.Document.docImportNode(doc, importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_FRAGMENT_NODE:
			node = doc.createDocumentFragment();
			if (deep) {
				lj = importedNode.childNodes.length;
				while (j < lj) {
					node.appendChild(Fleur.Document.docImportNode(doc, importedNode.childNodes[j++], true));
				}
			}
			break;
		case Fleur.Node.DOCUMENT_NODE:
		case Fleur.Node.DOCUMENT_TYPE_NODE:
			throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	return node;
};
Fleur.Document.prototype.sortNodes = function(nodes) {
	nodes.sort(function(a, b) {
		var ia = a.internal_id;
		var ib = b.internal_id;
		return ia === ib ? 0 : ia < ib ? -1 : 1;
	});
	return nodes;
};
Fleur.Document.prototype._serializeToString = function(indent) {
	var s, i, l;
	for (i = 0, l = this.childNodes.length; i < l; i++) {
		s += this._serializeToString(this.childNodes[i], indent, "");
	}
	return s;
};
Fleur.Document.prototype.compileXslt = function() {
	return this.documentElement.compileXslt();
};
Fleur._evaluate = function(expression, contextNode, env, type, xpresult) {
	var doc;
	if (contextNode) {
		if (contextNode.nodeType === Fleur.Node.DOCUMENT_NODE) {
			doc = contextNode;
		} else if (contextNode.ownerDocument) {
			doc = contextNode.ownerDocument;
		}
	}
	env = env || {};
	var d = new Date();
	if (!env.timezone) {
		var jstz = d.getTimezoneOffset();
		env.timezone = Fleur.msToDayTimeDuration(-jstz * 60 * 1000);
	}
	if (!env.now) {
		env.now = d;
	}
	if (!env.nsresolver) {
		var nsResolver;
		if (doc && doc.documentElement) {
			nsResolver = function(element) {
				return {
					defaultNamespace: element.getAttribute("xmlns"),
					nsresolver: element.ownerDocument.createNSResolver(element),
					lookupNamespaceURI: function(prefix) {
						if (prefix === "_") {
							return this.defaultNamespace;
						}
						return this.nsresolver.lookupNamespaceURI(prefix);
					},
					lookupPrefix: function(uri) {
						return this.nsresolver.lookupPrefix(uri);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(doc.documentElement);
		} else if (doc) {
			nsResolver = function(document) {
				return {
					nsresolver: document.createNSResolver(),
					lookupNamespaceURI: function(prefix) {
						return this.nsresolver.lookupNamespaceURI(prefix);
					},
					lookupPrefix: function(uri) {
						return this.nsresolver.lookupPrefix(uri);
					},
					declareNamespace: function(prefix, uri) {
						return this.nsresolver.declareNamespace(prefix, uri);
					}
				};
			};
			env.nsresolver = nsResolver(doc);
		} else {
			env.nsresolver = new Fleur.XPathNSResolver();
		}
	}
	type = type || Fleur.XPathResult.ANY_TYPE;
	var invalidmsg = "";
	if (typeof expression === "string") {
		try {
			var compiled = new Fleur.XPathExpression(expression);
			expression = compiled;
		} catch(e) {
			invalidmsg = e.error;
		}
	}
	if (!xpresult) {
		xpresult = new Fleur.XPathResult(doc, invalidmsg === "" ? expression : null, contextNode, env, type);
		if (!xpresult.expression) {
			xpresult.expression = expression;
		}
	} else {
		xpresult.document = doc;
		xpresult.expression = expression;
		xpresult.contextNode = contextNode;
		xpresult.env = env;
		xpresult.resultType = type;
		xpresult._index = 0;
	}
	if (invalidmsg !== "") {
		xpresult._result = new Fleur.Text();
		xpresult._result.schemaTypeInfo = Fleur.Type_error;
		xpresult._result._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0003");
		xpresult._result.data = invalidmsg;
	}
	return xpresult;
};
Fleur.Document.prototype._evaluate = function(expression, contextNode, env, type, xpresult) {
	contextNode = contextNode || this;
	return Fleur._evaluate(expression, contextNode, env, type, xpresult);
};
Fleur.evaluate = function(expression, contextNode, env, type, xpresult) {
	if (xpresult && xpresult._result) {
		xpresult._result = null;
	}
	var xpr = Fleur._evaluate(expression, contextNode, env, type, xpresult);
	return xpr._result ? xpr : new Promise(function(resolve, reject) {
		xpr.evaluate(function(res) {
			resolve(res);
		}, function(res) {
			reject(res);
		});
	});
};
Fleur.Document.prototype.evaluate = function(expression, contextNode, env, type, xpresult) {
	contextNode = contextNode || this;
	return Fleur.evaluate(expression, contextNode, env, type, xpresult);
};;
Fleur.createExpression = function(expression) {
	expression = expression || "";
	return new Fleur.XPathExpression(expression);
};
Fleur.Document.prototype.createExpression = Fleur.createExpression;
Fleur.Document.prototype.createNSResolver = function(node) {
	return new Fleur.XPathNSResolver(node);
};
Fleur.DocumentFragment = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.DOCUMENT_FRAGMENT_NODE;
	this.nodeName = "#document-fragment";
};
Fleur.DocumentFragment.prototype = new Fleur.Node();
Object.defineProperties(Fleur.DocumentFragment.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.DocumentType = function() {
	this.nodeType = Fleur.Node.DOCUMENT_TYPE_NODE;
	this.entities = new Fleur.NamedNodeMap();
	this.entities.ownerNode = this;
	this.notations = new Fleur.NamedNodeMap();
	this.notations.ownerNode = this;
};
Fleur.DocumentType.prototype = new Fleur.Node();
Object.defineProperties(Fleur.DocumentType.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	}
});
Fleur.DocumentType.prototype.createEntity = function(entname) {
	var node = new Fleur.Entity();
	node.localName = node.nodeName = entname;
	return node;
};
Fleur.DocumentType.prototype.hasEntity = function(entname) {
	return !!this.entities.getNamedItem(entname);
};
Fleur.DocumentType.prototype.setEntity = function(entname, value) {
	var entity;
	if (this.hasEntity(entname)) {
		return;
	}
	entity = this.createEntity(entname);
	entity.nodeValue = Fleur.DocumentType.resolveEntities(this, value);
	this.entities.setNamedItem(entity);
};
Fleur.DocumentType.prototype.getEntity = function(entname) {
	var i = 0, l = this.entities.length;
	while (i < l) {
		if (this.entities[i].nodeName === entname) {
			return this.entities[i].nodeValue;
		}
		i++;
	}
	return null;
};
Fleur.DocumentType.resolveEntities = function(doctype, s) {
	var offset = 0, index, entityname, entityvalue = null;
	while ((index = s.indexOf("&", offset)) !== -1) {
		entityname = s.substring(index + 1, s.indexOf(";", index + 1));
		switch (entityname) {
			case "amp":
				entityvalue = "&";
				break;
			case "lt":
				entityvalue = "<";
				break;
			case "gt":
				entityvalue = ">";
				break;
			case "apos":
				entityvalue = "'";
				break;
			case "quot":
				entityvalue = '"';
				break;
			default:
				if (entityname.charAt(0) === "#") {
					entityvalue = String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
				} else if (doctype) {
					entityvalue = doctype.getEntity(entityname);
				}
		}
		if (!entityvalue) {
			entityvalue = Fleur.encchars[entityname];
		}
		if (entityvalue) {
			s = s.substr(0, index) + entityvalue + s.substr(index + entityname.length + 2);
			offset = index + entityvalue.length;
			entityvalue = null;
		} else {
			break;
		}
	}
	return s.split("\r\n").join("\n");
};
Fleur.DOMConfiguration = function() {
	this._parameters = {
		"canonical-form": false,
		"cdata-sections": true,
		"check-character-normalization": false,
		"comments": true,
		"datatype-normalization": false,
		"element-content-whitespace": true,
		"entities": true,
		"error-handler": function(){},
		"infoset": true,
		"namespaces": true,
		"namespace-declarations": true,
		"normalize-characters": false,
		"schema-location": null,
		"schema-type" : null,
		"split-cdata-sections": true,
		"validate": false,
		"validate-if-schema": false,
		"well-formed": true
	};
	this.parametersNames = new Fleur.DOMStringList();
	for (var p in this._parameters) {
		if (this._parameters.hasOwnProperty(p)) {
			this.parametersNames.push(p);
		}
	}
};
Fleur.DOMConfiguration.prototype.canSetParameter = function(pname, value) {
	return this.parametersNames.contains(pname) && (typeof value === typeof this._parameters[pname]);
};
Fleur.DOMConfiguration.prototype.setParameter = function(pname, value) {
	this._parameters[pname] = value;
};
Fleur.DOMConfiguration.prototype.getParameter = function(pname) {
	return this._parameters[pname];
};
Fleur.DOMError = function() {};
Fleur.DOMError.SEVERITY_WARNING = 1;
Fleur.DOMError.SEVERITY_ERROR = 2;
Fleur.DOMError.SEVERITY_FATAL_ERROR = 3;
Fleur.DOMErrorHandler = function() {};
Fleur.DOMException = function(code) {
	this.code = code;
};
Fleur.DOMException.INDEX_SIZE_ERR = 1;
Fleur.DOMException.DOMSTRING_SIZE_ERR = 2;
Fleur.DOMException.HIERARCHY_REQUEST_ERR = 3;
Fleur.DOMException.WRONG_DOCUMENT_ERR = 4;
Fleur.DOMException.INVALID_CHARACTER_ERR = 5;
Fleur.DOMException.NO_DATA_ALLOWED_ERR = 6;
Fleur.DOMException.NO_MODIFICATION_ALLOWED_ERR = 7;
Fleur.DOMException.NOT_FOUND_ERR = 8;
Fleur.DOMException.NOT_SUPPORTED_ERR = 9;
Fleur.DOMException.INUSE_ATTRIBUTE_ERR = 10;
Fleur.DOMException.INVALID_STATE_ERR = 11;
Fleur.DOMException.SYNTAX_ERR = 12;
Fleur.DOMException.INVALID_MODIFICATION_ERR = 13;
Fleur.DOMException.NAMESPACE_ERR = 14;
Fleur.DOMException.INVALID_ACCESS_ERR = 15;
Fleur.DOMException.VALIDATION_ERR = 16;
Fleur.DOMException.TYPE_MISMATCH_ERR = 17;
Fleur.DOMImplementationList = function() {};
Fleur.DOMImplementationList.prototype = new Array();
Fleur.DOMImplementationList.prototype.item = function(index) {
	return this[index];
};
Fleur._DOMImplementations = new Fleur.DOMImplementationList();
Fleur.DOMImplementation = function() {};
Fleur.DOMImplementation.prototype._Features = [
	["core", "3.0"],
	["core", "2.0"],
	["core", "1.0"],
	["xml", "3.0"],
	["xml", "2.0"],
	["xml", "1.0"],
	["xpath", "3.0"],
	["xpath", "2.0"],
	["xpath", "1.0"]
];
Fleur.DOMImplementation.prototype.createDocument = function(namespaceURI, qualifiedName, doctype, mediatype) {
	var doc = new Fleur.Document();
	if (doctype && (doctype.ownerDocument || doctype._implementation !== this)) {
		throw new Fleur.DOMException(Fleur.DOMException.WRONG_DOCUMENT_ERR);
	}
	doc.implementation = this;
	if (qualifiedName) {
		doc.appendChild(doc.createElementNS(namespaceURI, qualifiedName));
	}
	if (doctype) {
		doctype.ownerDocument = doc;
		doc.doctype = doctype;
	}
	doc.mediatype = mediatype;
	return doc;
};
Fleur.DOMImplementation.prototype.createDocumentType = function(qualifiedName, publicId, systemId) {
	var dt = new Fleur.DocumentType();
	if (!Fleur.Node.QNameReg.test(qualifiedName)) {
		if (Fleur.Node.QNameCharsReg.test(qualifiedName)) {
			throw new Fleur.DOMException(Fleur.DOMException.NAMESPACE_ERR);
		} else {
			throw new Fleur.DOMException(Fleur.DOMException.INVALID_CHARACTER_ERR);
		}
	}
	dt.nodeName = dt.name = qualifiedName;
	dt.entities = new Fleur.NamedNodeMap();
	dt.entities.ownernode = dt;
	dt.notations = new Fleur.NamedNodeMap();
	dt.notations.ownerNode = dt;
	dt.publicId = publicId;
	dt.systemId = systemId;
	dt._implementation = this;
	return dt;
};
Fleur.DOMImplementation.prototype.getFeature = function(feature, version) {
	return this.hasFeature(feature, version) ? this : null;
};
Fleur.DOMImplementation.prototype.hasFeature = function(feature, version) {
	var i = 0, l = this._Features.length;
	if (version === "") {
		version = null;
	}
	feature = feature.toLowerCase();
	while (i < l) {
		if (this._Features[i][0] === feature && (!version || this._Features[i][1] === version)) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur._DOMImplementation = new Fleur.DOMImplementation();
Fleur._DOMImplementations.push(Fleur._DOMImplementation);
Fleur.DOMImplementationSource = function() {};
Fleur.DOMImplementationSource.prototype.getDOMImplementation = function(features) {
	var f, l0 = Fleur._DOMImplementations.length, l1, i = 0, j = 0, version = /^[0-9]*\.[0-9]*$/;
	f = features.split(" ");
	l1 = f.length;
	while (j < l1) {
		if (j < l1 - 1 && !version.test(f[j + 1])) {
			f.splice(j + 1, 0, "");
			f[j + 1] = null;
			l1++;
		}
		j += 2;
	}
	while (i < l0) {
		j = 0;
		while (j < l1 && Fleur._DOMImplementations.item(i).hasFeature(f[j], f[j + 1])) {
			j += 2;
		}
		if (j >= l1) {
			return Fleur._DOMImplementations.item(i);
		}
		i++;
	}
};
Fleur.DOMImplementationSource.prototype.getDOMImplementationList = function(features) {
	var f, l0 = Fleur._DOMImplementations.length, l1, i = 0, j = 0, version = /^[0-9]*\.[0-9]*$/g, list = new Fleur.DOMImplementationList();
	f = features.split(" ");
	l1 = f.length;
	while (j < l1) {
		if (j < l1 - 1 && !version.test(f[j + 1])) {
			f.splice(j + 1, 0, "");
			f[j + 1] = null;
			l1++;
		}
		j += 2;
	}
	while (i < l0) {
		j = 0;
		while (j < l1 && Fleur._DOMImplementations.item(i).hasFeature(f[j], f[j + 1])) {
			j += 2;
		}
		if (j >= l1) {
			list.push(Fleur._DOMImplementations.item(i));
		}
		i++;
	}
	return list;
};
Fleur.DOMLocator = function() {};
Fleur.DOMParser = function() {};
Fleur.DOMParser._appendFromCSVString = function(node, s, config) {
	var offset = 0, end, sep, head = config.header === "present", ignore;
	var first = head;
	var row, a;
	sep = config.separator ? decodeURIComponent(config.separator) : ",";
	s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
	if (s.charAt(s.length - 1) !== "\n") {
		s += "\n";
	}
	ignore = Math.max(parseInt(config.ignore, 10) || 0, 0);
	end = s.length;
	if (ignore !== 0) {
		while (offset !== end) {
			if (s.charAt(offset) === "\n") {
				ignore--;
				if (ignore === 0) {
					offset++;
					break;
				}
			}
			offset++;
		}
	}
	row = new Fleur.Multidim();
	if (head) {
		node.collabels = [];
	}
	while (offset !== end) {
		var v = "";
		if (s.charAt(offset) === '"') {
			offset++;
			do {
				if (s.charAt(offset) !== '"') {
					v += s.charAt(offset);
					offset++;
				} else {
					if (s.substr(offset, 2) === '""') {
						v += '"';
						offset += 2;
					} else {
						offset++;
						break;
					}
				}
			} while (offset !== end);
		} else {
			while (s.substr(offset, sep.length) !== sep && s.charAt(offset) !== "\n") {
				v += s.charAt(offset);
				offset++;
			}
		}
		if (first) {
			node.collabels.push(v);
		} else {
			a = new Fleur.Text();
			a.data = v;
			a.schemaTypeInfo = Fleur.Type_untypedAtomic;
			row.appendChild(a);
		}
		if (s.charAt(offset) === "\n") {
			node.appendChild(row);
			row = new Fleur.Multidim();
			first = false;
		}
		offset++;
	}
	if (node.childNodes.length < 2) {
		node.childNodes = node.childNodes[0].childNodes;
	}
};
Fleur.DOMParser._appendFromXMLString = function(node, s, leaftags) {
	var ii, ll, text, entstart, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrs, parents = [], doc = node.ownerDocument || node, currnode = node, eltnode, attrnode, c,
		seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		n, namespaces = {}, newnamespaces = {}, pindex, prefix, localName, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue, uri;
	while (offset !== end) {
		text = "";
		c = s.charAt(offset);
		while (c !== "<" && offset !== end) {
			if (c === "&") {
				c = s.charAt(++offset);
				entstart = offset;
				entityname = "";
				while (c !== ";" && offset !== end) {
					entityname += c;
					c = s.charAt(++offset);
				}
				if (offset === end) {
					break;
				}
				entityvalue = "";
				switch (entityname) {
					case "amp":
						text += "&";
						break;
					case "lt":
						text += "<";
						break;
					case "gt":
						text += ">";
						break;
					case "apos":
						text += "'";
						break;
					case "quot":
						text += '"';
						break;
					default:
						if (entityname.charAt(0) === "#") {
							text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
						} else if (doc.doctype) {
							entityvalue = doc.doctype.getEntity(entityname);
							s = s.substr(0, entstart) + entityvalue + s.substr(offset + 1);
							offset = entstart;
							end = s.length;
						}
				}
			} else {
				text += c;
			}
			c = s.charAt(++offset);
		}
		if (text !== "") {
			currnode.appendChild(doc.createTextNode(text));
		}
		if (offset === end) {
			break;
		}
		if (leaftags && leaftags.indexOf(currnode.nodeName) !== -1) {
			if (currnode.firstChild.data.endsWith("\r\n")) {
				currnode.firstChild.data = currnode.firstChild.data.substring(0, currnode.firstChild.data.length - 2);
			}
			n = parents.pop();
			namespaces = {};
			for (prefix in n.namespaces) {
				if (n.namespaces.hasOwnProperty(prefix)) {
					namespaces[prefix] = n.namespaces[prefix];
				}
			}
			currnode = n.node;
		}
		offset++;
		if (s.charAt(offset) === "!") {
			offset++;
			if (s.substr(offset, 2) === "--") {
				offset += 2;
				index = s.indexOf("-->", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					currnode.appendChild(doc.createComment(text));
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "[CDATA[") {
				offset += 7;
				index = s.indexOf("]]>", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					currnode.appendChild(doc.createCDATASection(text));
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "DOCTYPE") {
				offset += 7;
				index = s.indexOf(">", offset);
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				nodename = "";
				while (seps_dtd.indexOf(c) === -1) {
					nodename += c;
					c = s.charAt(offset++);
				}
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				dtdtype = "";
				while (seps_dtd.indexOf(c) === -1) {
					dtdtype += c;
					c = s.charAt(offset++);
				}
				if (dtdtype === "PUBLIC" || dtdtype === "SYSTEM") {
					if (dtdtype === "PUBLIC") {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						dtdpublicid = "";
						ii = offset;
						ll = Math.min(index - 1, s.indexOf(c, offset));
						while (ii < ll) {
							dtdpublicid += s.charAt(ii++);
						}
						offset += dtdpublicid.length + 1;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					dtdsystemid = "";
					ii = offset;
					ll = Math.min(index - 1, s.indexOf(c, offset));
					while (ii < ll) {
						dtdsystemid += s.charAt(ii++);
					}
					offset += dtdsystemid.length + 1;
					c = s.charAt(offset++);
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
				} else {
					dtdpublicid = dtdsystemid = null;
				}
				currnode.appendChild(doc.doctype = doc.implementation.createDocumentType(nodename, dtdpublicid, dtdsystemid));
				doc.doctype.ownerDocument = doc;
				if (c === "[") {
					index = s.indexOf("]", offset);
					c = s.charAt(offset++);
					while (c !== "]" && offset < end) {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						if (c === "]") {
							break;
						}
						if (s.substr(offset, 7) === "!ENTITY") {
							offset += 7;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (c === "%") {
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							entityvalue = "";
							ii = offset;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (ii < ll) {
								entityvalue += s.charAt(ii++);
							}
							offset += entityvalue.length + 1;
							c = s.charAt(offset++);
							doc.doctype.setEntity(nodename, entityvalue);
						} else if (s.substr(offset, 9) === "!NOTATION") {
							offset += 9;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							if (c === '"' || c === "'") {
								notationvalue = "";
								ii = offset;
								ll = Math.min(index - 1, s.indexOf(c, offset));
								while (ii < ll) {
									notationvalue += s.charAt(ii++);
								}
								offset += notationvalue.length + 1;
								c = s.charAt(offset++);
							}
						}
						offset = s.indexOf(">", offset - 1) + 1;
						c = s.charAt(offset++);
					}
					index = s.indexOf(">", offset);
				}
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset++;
			}
		} else if (s.charAt(offset) === "?") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_pi.indexOf(c) === -1) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf("?>", offset - 1);
			if (index === -1) {
				index = end;
			}
			if (nodename === "xml") {
				if (s.charCodeAt(index + 2) === 13) {
					index++;
				}
				if (s.charCodeAt(index + 2) === 10) {
					index++;
				}
			} else if (nodename !== "") {
				text = "";
				ii = offset;
				while (ii < index) {
					text += s.charAt(ii++);
				}
				text = text.replace(/\x01/gm,"<");
				currnode.appendChild(doc.createProcessingInstruction(nodename, index === offset - 1 ? "" : text));
			}
			if (index === end) {
				break;
			}
			offset = index + 2;
		} else if (s.charAt(offset) === "/") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_close.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			if (nodename === currnode.nodeName) {
				n = parents.pop();
				namespaces = {};
				for (prefix in n.namespaces) {
					if (n.namespaces.hasOwnProperty(prefix)) {
						namespaces[prefix] = n.namespaces[prefix];
					}
				}
				currnode = n.node;
			} else {
				while (parents.length !== 0) {
					n = parents.pop();
					if (nodename === n.node.nodeName) {
						namespaces = {};
						for (prefix in n.namespaces) {
							if (n.namespaces.hasOwnProperty(prefix)) {
								namespaces[prefix] = n.namespaces[prefix];
							}
						}
						currnode = n.node;
						break;
					}
				}
			}
			offset = s.indexOf(">", offset - 1) + 1;
			if (offset === 0) {
				break;
			}
		} else {
			c = s.charAt(offset++);
			nodename = "";
			while (seps_elt.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf(">", offset - 1);
			if (nodename !== "") {
				newnamespaces = {};
				for (prefix in namespaces) {
					if (namespaces.hasOwnProperty(prefix)) {
						newnamespaces[prefix] = namespaces[prefix];
					}
				}
				attrs = {};
				while (offset <= end) {
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					if (c === "/" || c === ">" || offset === end) {
						break;
					}
					attrname = "";
					while (seps_attr.indexOf(c) === -1 && offset <= end) {
						attrname += c;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "=") {
						c = s.charAt(offset++);
						while (seps.indexOf(c) !== -1 && offset <= end) {
							c = s.charAt(offset++);
						}
						attrvalue = "";
						if (c === "'" || c === "\"") {
							attrvalue = "";
							ii = offset;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (ii < ll) {
								attrvalue += s.charAt(ii++);
							}
							offset += attrvalue.length + 1;
							c = s.charAt(offset++);
						} else {
							while (seps_elt.indexOf(c) === -1 && offset <= end) {
								attrvalue += c;
								c = s.charAt(offset++);
							}
						}
					} else {
						attrvalue = attrname;
					}
					pindex = attrname.indexOf(":");
					prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
					localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
					if (!attrs[prefix]) {
						attrs[prefix] = {};
					}
					attrs[prefix][localName] = attrvalue;
					if (prefix === "xmlns") {
						newnamespaces[localName] = attrvalue;
					} else if (prefix === " " && localName === "xmlns") {
						newnamespaces[" "] = attrvalue;
					}
				}
				pindex = nodename.indexOf(":");
				uri = newnamespaces[pindex !== -1 ? nodename.substr(0, pindex) : " "];
				eltnode = doc.createElementNS(uri, nodename);
				if (!doc._elementsByTagName[uri]) {
					doc._elementsByTagName[uri] = {};
					doc._elementsByTagName[uri][nodename] = [eltnode];
				} else if (!doc._elementsByTagName[uri][nodename]) {
					doc._elementsByTagName[uri][nodename] = [eltnode];
				} else {
					doc._elementsByTagName[uri][nodename].push(eltnode);
				}
				for (prefix in attrs) {
					if (attrs.hasOwnProperty(prefix)) {
						for (attrname in attrs[prefix]) {
							if (attrs[prefix].hasOwnProperty(attrname)) {
								attrvalue = Fleur.DocumentType.resolveEntities(doc.doctype, attrs[prefix][attrname]).replace(/\x01/gm,"<");
								if (attrname === "id" && (prefix === " " || prefix === "xml")) {
									doc._elementById[attrvalue] = eltnode;
								}
								attrnode = doc.createAttributeNS(prefix === "xmlns" || prefix === " " && attrname === "xmlns" ? "http://www.w3.org/2000/xmlns/" : prefix === "xml" ? "http://www.w3.org/XML/1998/namespace" : prefix !== " " ? newnamespaces[prefix] : null, prefix !== " " ? prefix + ":" + attrname : attrname);
								eltnode.setAttributeNodeNS(attrnode);
								attrnode.appendChild(doc.createTextNode(attrvalue));
							}
						}
					}
				}
				currnode.appendChild(eltnode);
				if (s.charAt(offset - 1) !== "/") {
					parents.push({node: currnode, namespaces: namespaces});
					currnode = eltnode;
					namespaces = {};
					for (prefix in newnamespaces) {
						if (newnamespaces.hasOwnProperty(prefix)) {
							namespaces[prefix] = newnamespaces[prefix];
						}
					}
				}
			}
			offset = index + 1;
			if (offset === 0) {
				break;
			}
		}
	}
};
Fleur.DOMParser._parseTextAdvance = function(n, states, grammar, selection) {
	for (var i = 0; i < states[n].length; i++) {
		var state = states[n][i];
		if (state[2] === state[1].length) {
			var join = [];
			var prevtext = false;
			for (var j = 0, l = state[4].length; j < l ; j++) {
				if (state[4][j] !== "") {
					if (state[1][j][0] === 2 && !state[1][j][2]) {
						if (prevtext && typeof (state[4][j][1][0]) === "string") {
							join[join.length - 1] += state[4][j][1][0];
						} else {
							join = join.concat(state[4][j][1]);
							prevtext = typeof (state[4][j][1][0]) === "string";
						}
					} else if (state[1][j][2]) {
						if (state[1][j][0] === 2) {
							join.push([state[1][j][2], state[4][j][1]]);
							prevtext = false;
						} else {
							var joinitem = state[4][j];
							if (prevtext) {
								join[join.length - 1] += joinitem;
							} else if (joinitem !== "") {
								join.push(joinitem);
								prevtext = true;
							}
						}
					}
				}
			}
			state[4] = [[1, join]];
			for (var k = 0; k < states[state[3]].length; k++) {
				var state2 = states[state[3]][k];
				if (state2[1][state2[2]] && state2[1][state2[2]][0] === 2 && state2[1][state2[2]][1] === state[0]) {
					var data3 = state2[4].slice(0);
					data3.push(state[4][0]);
					states[n].push([state2[0], state2[1], state2[2] + 1, state2[3], data3]);
				}
			}
		} else {
			if (state[1][state[2]][0] === 2) {
				var next = state[1][state[2]][1];
				for (var i2 = 0, l2 = grammar[next].length; i2 < l2; i2++) {
					var r = grammar[next][i2];
					if (selection.indexOf(r) === -1) {
						if (r.length > 0) {
							selection.push(r);
							states[n].push([next, r, 0, n, []]);
						} else {
							var data4 = state[4].slice(0);
							data4.push("");
							states[n].push([state[0], state[1], state[2] + 1, state[3], data4]);
						}
					}
				}
			}
		}
	}
};
Fleur.DOMParser._appendFromGrammarString = function(node, s, grammar) {
	var states = [[]];
	var selection = [];
	for (var i = 0, l = grammar[0][0].length; i < l; i++) {
		selection[i] = grammar[0][0][i];
		states[0][i] = [0, grammar[0][0][i], 0, 0, []];
	}
	Fleur.DOMParser._parseTextAdvance(0, states, grammar[0], selection);
	for (var j = 0; j < s.length; j++) {
		states[j + 1] = [];
		for (var k = 0; k < states[j].length; k++) {
			var state = states[j][k];
			var c = s.charAt(j);
			if (state[1][state[2]]) {
				if ((state[1][state[2]][0] === 0 && state[1][state[2]][1] === c) || (state[1][state[2]][0] === 1 && state[1][state[2]][1].test(c))) {
					var data = state[4].slice(0);
					data.push(c);
					states[j + 1].push([state[0], state[1], state[2] + 1, state[3], data]);
				}
			}
		}
		Fleur.DOMParser._parseTextAdvance(j + 1, states, grammar[0], []);
		if (states[states.length - 1].length === 0) {
			return "error";
		}
	}
	var laststates = states[states.length - 1];
	for (i = 0, l = laststates.length; i < l; i++) {
		if (laststates[i][0] === 0 && laststates[i][1].length === laststates[i][2] && laststates[i][3] === 0) {
			Fleur.DOMParser._appendFromArray(node, grammar[1], [laststates[i][4][0]]);
			break;
		}
	}
	return node;
};
Fleur.DOMParser._appendFromZIP = function(node, s) {
	var f, doc = node.ownerDocument || node, filename;
	var m = doc.createMap();
	node.appendChild(m);
	var offset = s.lastIndexOf("PK\x05\x06") + 16;
	var r2 = function() {
		return offset += 2, ((s.charCodeAt(offset - 1) & 0xFF) << 8) | s.charCodeAt(offset - 2) & 0xFF;
	};
	var r4 = function() {
		return offset += 4, ((((((s.charCodeAt(offset - 1) & 0xFF) << 8) | s.charCodeAt(offset - 2) & 0xFF) << 8) | s.charCodeAt(offset - 3) & 0xFF) << 8) | s.charCodeAt(offset - 4) & 0xFF;
	};
	offset = r4();
	while (s.charCodeAt(offset) === 80 && s.charCodeAt(offset + 1) === 75 && s.charCodeAt(offset + 2) === 1 && s.charCodeAt(offset + 3) === 2) {
		f = {};
		offset += 4;
		f.versionMadeBy = r2();
		f.versionNeeded = r2();
		f.bitFlag = r2();
		f.compressionMethod = r2();
		f.date = r4();
		f.crc32 = r4();
		f.compressedSize = r4();
		f.uncompressedSize = r4();
		f.fileNameLength = r2();
		f.extraFieldsLength = r2();
		f.fileCommentLength = r2();
		f.diskNumber = r2();
		f.internalFileAttributes = r2();
		f.externalFileAttributes = r4();
		f.localHeaderOffset = r4();
		filename = s.substr(offset, f.fileNameLength);
		offset += f.fileNameLength;
		f.extraFields = s.substr(offset, f.extraFieldsLength);
		offset += f.extraFieldsLength;
		f.fileComment = s.substr(offset, f.fileCommentLength);
		offset += f.fileCommentLength;
		f.dir = f.externalFileAttributes & 0x00000010 ? true : false;
		var offset2 = offset;
		offset = f.localHeaderOffset + 28;
		f.lextraFieldsLength = r2();
		offset += f.fileNameLength;
		f.lextraFields = s.substr(offset, f.lextraFieldsLength);
		offset += f.lextraFieldsLength;
		f.compressedFileData = s.substr(offset, f.compressedSize);
		offset = offset2;
		var e = doc.createEntry(filename);
		Fleur.DOMParser._appendFromJSON(e, f);
		m.setEntryNode(e);
	}
	return node;
};
Fleur.DOMParser._appendFromArray = function(node, names, os) {
	var i, l, o, n, nodename, doc = node.ownerDocument || node;
	for (i = 0, l = os.length; i < l; i++) {
		o = os[i];
		if (typeof o === "string") {
			n = doc.createTextNode(o);
		} else {
			nodename = names[1][o[0]];
			switch (nodename[0]) {
				case Fleur.Node.ELEMENT_NODE:
					n = doc.createElementNS(names[0][nodename[1]], nodename[2]);
					Fleur.DOMParser._appendFromArray(n, names, o[1]);
					break;
				case Fleur.Node.ATTRIBUTE_NODE:
					n = doc.createAttributeNS(names[0][nodename[1]], nodename[2]);
					n.nodeValue = o[1][0];
					node.setAttributeNodeNS(n);
					continue;
				case Fleur.Node.CDATA_NODE:
					n = doc.createCDATASection(o[1][0]);
					break;
				case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
					n = doc.createProcessingInstruction(o[1], o[2]);
					break;
				case Fleur.Node.COMMENT_NODE:
					n = doc.createComment(o[1][0]);
					break;
			}
		}
		node.appendChild(n);
	}
	return node;
};
Fleur.DOMParser.prototype.parseFromArray = function(o) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromArray(doc, o[0], o[1]);
};
Fleur.DOMParser._appendFromEXML = function(node, enode) {
	var i, l;
	if (enode.nodeType === Fleur.Node.ELEMENT_NODE) {
		switch (enode.localName) {
			case "element":
		}
		i = 0;
		l = enode.childNodes.length;
		while (i < l) {
			i++;
		}
	} else if (enode.nodeType === Fleur.Node.TEXT_NODE && enode.textContent.trim() !== "") {
		node.appendChild(node.ownerDocument.importNode(enode, true));
	}
};
Fleur.DOMParser._appendFromJSON = function(node, o) {
	if (o === null) {
		return;
	}
	var doc = node.ownerDocument || node, n;
	switch (typeof o) {
		case "string":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "string", o);
			break;
		case "number":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "double", o);
			break;
		case "boolean":
			n = doc.createTypedValueNode("http://www.w3.org/2001/XMLSchema", "boolean", o);
			break;
		default:
			if (o instanceof RegExp) {
				n = doc.createTypedValueNode("http://www.agencexml.com/types", "regex", o);
			} else if (typeof o.length === "number") {
				n = doc.createArray();
				for (var i = 0, l = o.length; i < l; i++) {
					Fleur.DOMParser._appendFromJSON(n, o[i]);
				}
			} else {
				n = doc.createMap();
				for (var k in o) {
					if (o.hasOwnProperty(k)) {
						var e = doc.createEntry(k);
						n.setEntryNode(e);
						Fleur.DOMParser._appendFromJSON(e, o[k]);
					}
				}
			}
	}
	node.appendChild(n);
	return node;
};
Fleur.DOMParser._appendFromMD = function(node, s) {
	var lines = s.split("\n");
	var items = [], lseps = [];
	var blocks = [];
	var ser = "";
	for (var i = 0, l = lines.length; i < l; i++) {
		if (lines[i].trim() !== "") {
			items.push(lines[i]);
			lseps.push(0);
		} else if (lseps.length !== 0) {
			lseps[lseps.length - 1]++;
		}
	}
	var dashtrim = function(s) {
		var t = s.trim();
		for (var i0 = t.length - 1; i0 >= 0; i0--) {
			if (t.charAt(i0) !== "#") {
				return t.substr(0, i0 + 1).trim();
			}
		}
		return "";
	};
	var oi;
	var outol = true;
	var pol = false;
	var orderitem = function(s) {
		oi = 0;
		var c = s.charCodeAt(oi);
		if (outol || c !== 42 || c !== 43 || c !== 45) {
			while (c >= 48 && c <= 57) {
				oi++;
				c = s.charCodeAt(oi);
			}
			return c === 46 && oi !== 0 && s.charCodeAt(oi + 1) === 32 ? oi + 2 : -1;
		}
		return s.charCodeAt(1) === 32 ? 2 : -1;
	};
	var ui;
	var outul = true;
	var pul = false;
	var unorderitem = function(s) {
		ui = 0;
		var c = s.charCodeAt(ui);
		if (c === 42 || c === 43 || c === 45) {
			return s.charCodeAt(1) === 32 ? 2 : -1;
		}
		while (c >= 48 && c <= 57) {
			ui++;
			c = s.charCodeAt(ui);
		}
		return !outul && c === 46 && ui !== 0 && s.charCodeAt(ui + 1) === 32 ? ui + 2 : -1;
	};
	var inlinemd = function(s) {
		var r = "";
		var outem = true;
		var outstrong = true;
		var outdel = true;
		for (var il = 0, ll = s.length; il < ll; il++) {
			var c = s.charAt(il);
			if (c === "*" || c === "_") {
				if (s.charAt(il + 1) === c) {
					if ((outstrong && s.substr(il + 2).indexOf(c + c) !== -1) || !outstrong) {
						r += "<" + (outstrong ? "" : "/") + "strong>";
						outstrong = !outstrong;
						il++;
					} else {
						r += c + c;
					}
				} else {
					if ((outem && s.substr(il + 1).replace(c + c, "").indexOf(c) !== -1) || !outem) {
						r += "<" + (outem ? "" : "/") + "em>";
						outem = !outem;
					} else {
						r += c;
					}
				}
			} else if (c === "~" && s.charAt(il + 1) === "~") {
				if ((outdel && s.substr(il + 2).indexOf("~~") !== -1) || !outdel) {
					r += "<" + (outdel ? "" : "/") + "del>";
					outdel = !outdel;
					il++;
				} else {
					r += "~~";
				}
			} else {
				r += c;
			}
		}
		return r;
	};
	var lastli = 0;
	for (i = 0, l = items.length; i < l; i++) {
		if (items[i].startsWith("# ")) {
			blocks.push(["h1", inlinemd(dashtrim(items[i].substr(2)))]);
		} else if (items[i].startsWith("## ")) {
			blocks.push(["h2", inlinemd(dashtrim(items[i].substr(3)))]);
		} else if (items[i].startsWith("### ")) {
			blocks.push(["h3", inlinemd(dashtrim(items[i].substr(4)))]);
		} else if (items[i].startsWith("#### ")) {
			blocks.push(["h4", inlinemd(dashtrim(items[i].substr(5)))]);
		} else if (items[i].startsWith("##### ")) {
			blocks.push(["h5", inlinemd(dashtrim(items[i].substr(6)))]);
		} else if (items[i].startsWith("###### ")) {
			blocks.push(["h6", inlinemd(dashtrim(items[i].substr(7)))]);
		} else if (items[i].startsWith("---") && items[i].trim() === "-".repeat(items[i].trim().length)) {
			if (blocks.length === 0 || blocks[blocks.length - 1][0] !== "p" || lseps[i - 1] !== 0) {
				blocks.push(["hr"]);
			} else  {
				blocks[blocks.length - 1][0] = "h2";
			}
		} else if (items[i].startsWith("===") && items[i].trim() === "=".repeat(items[i].trim().length) && blocks.length !== 0 && blocks[blocks.length - 1][0] === "p" && lseps[i - 1] === 0) {
			blocks[blocks.length - 1][0] = "h1";
		} else if (orderitem(items[i]) !== -1 && outul) {
			if (outol) {
				pol = false;
			}
			blocks.push(["", (outol ? "<ol><li>" : "<li>") + (lseps[i] !== 0 || pol ? "<p>" : "") + inlinemd(items[i].substr(oi + 1).trim()) + (lseps[i] !== 0 || pol ? "</p>" : "") + "</li></ol>"]);
			if (!outol) {
				blocks[lastli][1] = blocks[lastli][1].substr(0, blocks[lastli][1].length - 5);
			}
			lastli = blocks.length - 1;
			outol = false;
			pol = lseps[i] !== 0;
		} else if (unorderitem(items[i]) !== -1) {
			if (outul) {
				pul = false;
			}
			blocks.push(["", (outul ? "<ul><li>" : "<li>") + (lseps[i] !== 0 || pul ? "<p>" : "") + inlinemd(items[i].substr(oi + 1).trim()) + (lseps[i] !== 0 || pul ? "</p>" : "") + "</li></ul>"]);
			if (!outul) {
				blocks[lastli][1] = blocks[lastli][1].substr(0, blocks[lastli][1].length - 5);
			}
			lastli = blocks.length - 1;
			outul = false;
			pul = lseps[i] !== 0;
		} else if (blocks.length === 0 || blocks[blocks.length - 1][0] !== "p" || lseps[i - 1] !== 0) {
			blocks.push(["p", [inlinemd(items[i])]]);
		} else {
			blocks[blocks.length - 1][1].push(inlinemd(items[i]));
		}
	}
	for (i = 0, l = blocks.length; i < l; i++) {
		if (blocks[i][0] !== "") {
			ser += "<" + blocks[i][0] + ">";
		}
		if (blocks[i][0] === "p") {
			for (var j = 0, l2 = blocks[i][1].length; j < l2; j++) {
				if (j !== 0) {
					ser += "<br/>";
				}
				ser += blocks[i][1][j];
			}
		} else if (blocks[i].length === 2) {
			ser += blocks[i][1];
		}
		if (blocks[i][0] !== "") {
			ser += "</" + blocks[i][0] + ">";
		}
	}
	if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
		ser = "<div>" + ser + "</div>";
	}
	Fleur.DOMParser._appendFromXMLString(node, ser);
	return node;
};
Fleur.DOMParser.prototype.parseFromJSON = function(o) {
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromJSON(doc, o);
};
Fleur.DOMParser._appendFromString = function(node, s, mediatype, grammar) {
	var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler;
	while (i < l) {
		param = paramreg.exec(media[i]);
		config[param[1]] = param[2];
		i++;
	}
	var mime = media[0].replace(/^\s+|\s+$/gm,'');
	if (mime.endsWith("+xml") && mime !== "application/exml+xml") {
		mime = "application/xml";
	}
	handler = Fleur.DOMParser.Handlers[mime];
	if (!handler) {
		return;
	}
	handler(node, s, config, grammar);
	return node;
};
Fleur.OFXtags = [
	"ACCTID",
	"ACCTTYPE",
	"BALAMT",
	"BANKID",
	"BRANCHID",
	"CODE",
	"CURDEF",
	"DTASOF",
	"DTEND",
	"DTPOSTED",
	"DTSERVER",
	"DTSTART",
	"FITID",
	"LANGUAGE",
	"MEMO",
	"NAME",
	"SEVERITY",
	"TRNAMT",
	"TRNTYPE",
	"TRNUID"
];
Fleur.DOMParser.Handlers = {
	"text/csv": function(node, s, config) {
		Fleur.DOMParser._appendFromCSVString(node, s, config);
	},
	"application/xquery": function(node, s) {
		Fleur.DOMParser.xpatharr = Fleur.XPathEvaluator._xp2js(s, "", "");
		eval("Fleur.DOMParser.xpatharr = [Fleur.XQueryX.module,[[Fleur.XQueryX.mainModule,[[Fleur.XQueryX.queryBody,[" + Fleur.DOMParser.xpatharr + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]]]];');
		Fleur.DOMParser._appendFromArray(node, Fleur.XQueryXNames, [Fleur.DOMParser.xpatharr]);
		delete Fleur.DOMParser.xpatharr;
	},
	"application/json": function(node, s) {
		try {
			eval("Fleur.DOMParser.json = " + s);
			Fleur.DOMParser._appendFromJSON(node, Fleur.DOMParser.json);
			delete Fleur.DOMParser.json;
		} catch (e) {}
	},
	"application/xml": function(node, s) {
		Fleur.DOMParser._appendFromXMLString(node, s);
	},
	"application/x-ofx": function(node, s) {
		if (s.startsWith("OFXHEADER:")) {
			var propertyname = "", propertyvalue = "", text ="", offset = 0, end = s.length, c, state = 0, doc = node.ownerDocument || node;
			c = s.charAt(offset);
			while (c !== "<" && offset !== end) {
				if (state === 0) {
					if (c === ":") {
						state = 1;
					} else {
						propertyname += c;
					}
				} else {
					if (c === "\n") {
						text += (text !== "" ? " " : "") + propertyname + "=\"" + propertyvalue + "\"";
						state = 0;
						propertyname = "";
						propertyvalue = "";
					} else if (c !== "\r") {
						propertyvalue += c;
					}
				}
				c = s.charAt(++offset);
			}
			node.appendChild(doc.createProcessingInstruction("OFX", text));
			Fleur.DOMParser._appendFromXMLString(node, s.substr(offset), Fleur.OFXtags);
		} else {
			Fleur.DOMParser._appendFromXMLString(node, s);
		}
	},
	"application/exml+xml": function(node, s) {
		var enode = node.ownerDocument.implementation.createDocument();
		Fleur.DOMParser._appendFromXMLString(enode, s);
		Fleur.DOMParser._appendFromEXML(node, enode.documentElement);
		enode.removeChild(enode.documentElement);
		enode = null;
	},
	"application/zip": function(node, s) {
		Fleur.DOMParser._appendFromZIP(node, s);
	},
	"text/markdown": function(node, s) {
		Fleur.DOMParser._appendFromMD(node, s);
	},
	"text/plain":  function(node, s, config, grammar) {
		if (grammar) {
			Fleur.DOMParser._appendFromGrammarString(node, s, grammar);
		} else {
			var t = new Fleur.Text();
			t.data = s;
			node.appendChild(t);
		}
	}
};
Fleur.DOMParser.Handlers["text/xml"] = Fleur.DOMParser.Handlers["application/xml"];
Fleur.DOMParser.Handlers["application/vnd.openxmlformats-officedocument.wordprocessingml.document"] = Fleur.DOMParser.Handlers["application/zip"];
Fleur.DOMParser.Handlers["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"] = Fleur.DOMParser.Handlers["application/zip"];
Fleur.DOMParser.Handlers["text/json"] = Fleur.DOMParser.Handlers["application/json"];
Fleur.DOMParser.prototype.parseFromString = function(s, mediatype, grammar) {
	if (mediatype.startsWith("text/csv")) {
		var seq = new Fleur.Sequence();
		return Fleur.DOMParser._appendFromString(seq, s, mediatype, grammar);
	}
	var doc, impl, domSource = new Fleur.DOMImplementationSource();
	impl = domSource.getDOMImplementation("XML");
	doc = impl.createDocument();
	return Fleur.DOMParser._appendFromString(doc, s, mediatype, grammar);
};
Fleur.DOMStringList = function() {};
Fleur.DOMStringList.prototype = new Array();
Fleur.DOMStringList.prototype.item = function(index) {
	return this[index];
};
Fleur.DOMStringList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i] === str) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur.Element = function() {
	Fleur.Node.apply(this);
	this.attributes = new Fleur.NamedNodeMap();
	this.attributes.ownerNode = this;
	this.namespaces = new Fleur.NamedNodeMap();
	this.nodeType = Fleur.Node.ELEMENT_NODE;
};
Fleur.Element.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Element.prototype, {
	nodeValue: {
		set: function() {},
		get: function() {
			return null;
		}
	},
	tagName: {
		set: function(value) {
			this.nodeName = value;
		},
		get: function() {
			return this.nodeName;
		}
	}
});
Fleur.Element.prototype.getAttribute = function(attrname) {
	return this.getAttributeNS(null, attrname);
};
Fleur.Element.prototype.getAttributeNode = function(attrname) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if (this.attributes[i].nodeName === attrname) {
			return this.attributes[i];
		}
		i++;
	}
	return null;
};
Fleur.Element.prototype.getAttributeNodeNS = function(namespaceURI, localName) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if (this.attributes[i].localName === localName && (!namespaceURI || this.attributes[i].namespaceURI === namespaceURI)) {
			return this.attributes[i];
		}
		i++;
	}
	return null;
};
Fleur.Element.prototype.getAttributeNS = function(namespaceURI, localName) {
	var i = 0, l = this.attributes.length;
	while (i < l) {
		if ( !namespaceURI && this.attributes[i].nodeName === localName || this.attributes[i].localName === localName && this.attributes[i].namespaceURI === namespaceURI) {
			return this.attributes[i].nodeValue;
		}
		i++;
	}
	return "";
};
Fleur.Element.prototype._getElementsByTagNameNS = function(namespaceURI, localName, elts) {
	var i = 0, l = this.children.length;
	if ((namespaceURI === "*" || this.namespaceURI === namespaceURI) && (localName === "*" || this.localName === localName)) {
		elts.push(this);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
};
Fleur.Element.prototype.getElementsByTagNameNS = function(namespaceURI, localName) {
	var elts = new Fleur.NodeList();
	var i = 0, l = this.children.length;
	if (!namespaceURI) {
		return this.getElementsByTagName(localName);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagNameNS(namespaceURI, localName, elts);
	}
	return elts;
};
Fleur.Element.prototype._getElementsByTagName = function(eltname, elts) {
	var i = 0, l = this.children.length;
	if (eltname === "*" || this.tagName === eltname) {
		elts.push(this);
	}
	while (i < l) {
		this.children[i++]._getElementsByTagName(eltname, elts);
	}
};
Fleur.Element.prototype.getElementsByTagName = function(eltname) {
	var elts = new Fleur.NodeList();
	var i = 0, l = this.children.length;
	while (i < l) {
		this.children[i++]._getElementsByTagName(eltname, elts);
	}
	return elts;
};
Fleur.Element.prototype.hasAttribute = function(attrname) {
	return Boolean(this.attributes.getNamedItem(attrname));
};
Fleur.Element.prototype.hasAttributeNS = function(namespaceURI, localName) {
	return this.attributes.getNamedItemNS(namespaceURI, localName) !== null;
};
Fleur.Element.prototype.removeAttribute = function(attrname) {
	this.attributes.removeNamedItem(attrname);
};
Fleur.Element.prototype.removeAttributeNode = function(oldAttr) {
	if (oldAttr.ownerElement !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	this.attributes.removeNamedItemNS(oldAttr.namespaceURI, oldAttr.localName);
	return oldAttr;
};
Fleur.Element.prototype.removeAttributeNS = function(namespaceURI, localName) {
	this.attributes.removeNamedItemNS(namespaceURI, localName);
};
Fleur.Element.prototype.setAttribute = function(attrname, value) {
	var attr;
	if (this.hasAttribute(attrname)) {
		attr = this.attributes.getNamedItem(attrname);
		attr.nodeValue = value;
		return;
	}
	attr = this.ownerDocument.createAttribute(attrname);
	this.attributes.setNamedItem(attr);
	attr.ownerElement = this;
	attr.idRecalculate(String(this.attributes.length - 1));
	attr.appendChild(this.ownerDocument.createTextNode(value));
};
Fleur.Element.prototype.setAttributeNode = function(newAttr) {
	var n = this.attributes.setNamedItem(newAttr);
	newAttr.ownerElement = this;
	newAttr.idRecalculate(String(this.attributes.length - 1));
	return n;
};
Fleur.Element.prototype.setAttributeNodeNS = function(newAttr) {
	var n = this.attributes.setNamedItemNS(newAttr);
	newAttr.ownerElement = this;
	newAttr.idRecalculate(String(this.attributes.length - 1));
	return n;
};
Fleur.Element.prototype.setAttributeNS = function(namespaceURI, qualifiedName, value) {
	var attr;
	if (this.hasAttributeNS(namespaceURI, qualifiedName)) {
		attr = this.attributes.getNamedItemNS(namespaceURI, qualifiedName);
		attr.nodeValue = value;
		return;
	}
	attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
	this.attributes.setNamedItemNS(attr);
	attr.ownerElement = this;
	attr.idRecalculate(String(this.attributes.length - 1));
	attr.nodeValue = value;
};
Fleur.Entity = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ENTITY_NODE;
};
Fleur.Entity.prototype = new Fleur.Node();
Fleur.Entry = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.ENTRY_NODE;
};
Fleur.Entry.prototype = new Fleur.Node();
Fleur.Function = function(namespaceURI, nodeName, jsfunc, xqxfunc, argtypes, needctx, needcallback, restype, updating) {
	Fleur.Node.apply(this);
	if (namespaceURI && nodeName) {
		this._setNodeNameLocalNamePrefix(namespaceURI, nodeName);
	}
	this.jsfunc = jsfunc;
	this.xqxfunc = xqxfunc;
	this.argtypes = argtypes;
	this.needctx = needctx;
	this.needcallback = needcallback;
	this.restype = restype;
	this.updating = Boolean(updating);
	this.nodeType = Fleur.Node.FUNCTION_NODE;
};
Fleur.Function.prototype = new Fleur.Node();
Fleur.GrammarParser = function() {};
Fleur.GrammarParser._skipSpaces = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var pre = "";
	do {
		if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
			return pre === "\n" ? i - 1 : i;
		}
		pre = c;
		c = s.charAt(++i);
	} while (c !== "");
	return i;
};
Fleur.GrammarParser._getName = function(s) {
	var i = 0;
	var o = s.charAt(0);
	while (o !== "" && "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-$".indexOf(o) !== -1) {
		o = s.charAt(++i);
	}
	return s.substr(0, i).toLowerCase();
};
Fleur.GrammarParser._bases = {
	b: "01",
	d: "0123456789",
	x: "0123456789abcdef"
};
Fleur.GrammarParser._getChar = function(s, base) {
	var i = 0;
	var o = s.charAt(0).toLowerCase();
	var c = 0;
	while (base.indexOf(o) !== -1) {
		c = c * base.length + base.indexOf(o);
		o = s.charAt(++i).toLowerCase();
	}
	return [i, c];
};
Fleur.GrammarParser._getTerm = function(s, gram) {
	var i = 0;
	var o = s.charAt(i);
	var prevo = "";
	var t = [];
	var l;
	var typ = 0;
	var ref = 1;
	var reg;
	var newrulename;
	var base;
	var c1, c2;
	var term;
	var min = 1;
	var max = 1;
	prevo = o;
	if ("0123456789".indexOf(o) !== -1) {
		min = 0;
		do {
			min = min * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
			o = s.charAt(++i);
		} while ("0123456789".indexOf(o) !== -1);
	}
	if (o === "*") {
		if (prevo === "*") {
			min = 0;
		}
		o = s.charAt(++i);
		if ("0123456789".indexOf(o) !== -1) {
			max = 0;
			do {
				max = max * 10 + Fleur.GrammarParser._bases.d.indexOf(o);
				o = s.charAt(++i);
			} while ("0123456789".indexOf(o) !== -1);
		} else {
			max = Number.POSITIVE_INFINITY;
		}
	} else {
		max = min;
	}
	if (min !== max) {
		newrulename = "$" + gram[0].length;
		if (min !== 0) {
			reg = "\r\n" + newrulename + " = " + min + s.substr(i) + " " + (max === Number.POSITIVE_INFINITY ? "*" : (max - min)) + s.substr(i);
		} else if (max !== Number.POSITIVE_INFINITY){
			reg = "\r\n" + newrulename + " = " + max + "[" + s.substr(i) + "]";
		} else {
			reg = "\r\n" + newrulename + " = / ^" + newrulename + " " + s.substr(i);
		}
		t.push([2, newrulename]);
		gram[0] += reg;
		return t;
	}
	if (min === 0) {
		return [[]];
	}
	if (o === "(") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = ";
		do {
			o = s.charAt(++i);
			if (o === ')') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else if (o === "[") {
		newrulename = "$" + gram[0].length;
		reg = "\r\n" + newrulename + " = / ";
		do {
			o = s.charAt(++i);
			if (o === ']') {
				if (prevo !== '\\') {
					t.push([2, newrulename]);
					gram[0] += reg;
					break;
				}
			}
			reg += o;
		} while (o !== "");
	} else {
		if (o === "^") {
			ref = 0;
			o = s.charAt(++i);
		} else if (o === "@") {
			ref = 1;
			typ = 2;
			o = s.charAt(++i);
		}
		if (o === '"') {
			typ = 3;
			do {
				o = s.charAt(++i);
				if (o === '"') {
					if (prevo === '"') {
						t.push(ref ? [0, '"', 1] : [0, '"']);
						prevo = "";
					} else {
						break;
					}
				} else {
					t.push(ref ? [0, o, 1] : [0, o]);
					prevo = o;
				}
			} while (o !== "");
		} else if (o === "%") {
			base = Fleur.GrammarParser._bases[s.charAt(++i)];
			c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
			i += c1[0] + 1;
			o = s.charAt(++i);
			if (o === "-") {
				c2 = Fleur.GrammarParser._getChar(s.substr(i), base);
				reg = "[\\x" + c1[1].charCodeAt(0).toString(16) + "-\\x" + c2[1].charCodeAt(0).toString(16) + "]";
				t.push(ref ? [1, new RegExp(reg), 1] : [1, new RegExp(reg)]);
			} else {
				t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				while (o === ".") {
					c1 = Fleur.GrammarParser._getChar(s.substr(i + 1), base);
					i += c1[0] + 1;
					o = s.charAt(++i);
					t.push(ref ? [0, c1[1], 1] : [0, c1[1]]);
				}
			}
			switch (s.charAt(i + 1)) {
				case ".":
					break;
				case "-":
					c2 = Fleur.GrammarParser._getChar(s.substr(i + 1));
			}
		} else {
			if (typ === 0) {
				typ = 1;
			}
			o = Fleur.GrammarParser._getName(s.substr(i));
			switch (o) {
				case "alpha":
					term = ref ? [1, /[A-Za-z]/, 1] : [1, /[A-Za-z]/];
					break;
				case "bit":
					term = ref ? [1, /[01]/, 1] : [1, /[01]/];
					break;
				case "char":
					term = ref ? [1, /[^\0]/, 1] : [1, /[^\0]/];
					break;
				case "cr":
					term = ref ? [0, "\r", 1] : [0, "\r"];
					break;
				case "ctl":
					term = ref ? [1, /[\0-\x1f\x7f]/, 1] : [1, /[\0-\x1f\x7f]/];
					break;
				case "digit":
					term = ref ? [1, /[0-9]/, 1] : [1, /[0-9]/];
					break;
				case "dquote":
					term = ref ? [0, '"', 1] : [0, '"'];
					break;
				case "hexdig":
					term = ref ? [1, /[0-9A-Fa-f]/, 1] : [1, /[0-9A-Fa-f]/];
					break;
				case "htab":
					term = ref ? [0, "\t", 1] : [0, "\t"];
					break;
				case "lf":
					term = ref ? [0, "\n", 1] : [0, "\n"];
					break;
				case "octet":
					term = ref ? [1, /[\0-\xff]/, 1] : [1, /[\0-\xff]/];
					break;
				case "sp":
					term = ref ? [0, " ", 1] : [0, " "];
					break;
				case "vchar":
					term = ref ? [1, /[\x21-\x7e]/, 1] : [1, /[\x21-\x7e]/];
					break;
				case "wsp":
					term = ref ? [1, /[ \t]/, 1] : [1, /[ \t]/];
					break;
				default:
					term = ref ? [2, o, typ] : [2, o];
			}
			t.push(term);
		}
	}
	if (min !== 1) {
		l = t.length * (min - 1);
		for (i = 0; i < l; i++) {
			term = t[i].slice(0);
			t.push(term);
		}
	}
	return t;
};
Fleur.GrammarParser._getAlternative = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var term = "";
	var alt = [];
	var nbpar = 0;
	while (o !== "") {
		if (o === " " && nbpar === 0) {
			term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
			if (term !== "") {
				alt = alt.concat(Fleur.GrammarParser._getTerm(term, gram));
			}
			term = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			term += o;
		}
		o = s.charAt(++offset);
	}
	term = term.substr(Fleur.GrammarParser._skipSpaces(term, 0));
	if (term !== "") {
		return alt.concat(Fleur.GrammarParser._getTerm(term, gram));
	}
	return alt;
};
Fleur.GrammarParser._getDefinition = function(s, gram) {
	var offset = 0;
	var o = s.charAt(offset);
	var alt = "";
	var def = [];
	var empty = true;
	var nbpar = 0;
	while (o !== "") {
		if (o === "/" && nbpar === 0) {
			alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
			if (alt !== "") {
				def.push(Fleur.GrammarParser._getAlternative(alt, gram));
				empty = false;
			} else if (empty) {
				def.push([]);
			}
			alt = "";
		} else {
			switch (o) {
				case "(":
				case "[":
					nbpar++;
					break;
				case ")":
				case "]":
					nbpar--;
			}
			alt += o;
		}
		o = s.charAt(++offset);
	}
	alt = alt.substr(Fleur.GrammarParser._skipSpaces(alt, 0));
	if (alt !== "") {
		def.push(Fleur.GrammarParser._getAlternative(alt, gram));
	} else if (empty) {
		def.push([]);
	}
	return def;
};
Fleur.GrammarParser.prototype.createGrammar = function(grammar) {
	var g = [];
	var gram = [grammar];
	var offset = 0;
	var n = [[""], [[2, 0, "xmlns"]]];
	var rules = {};
	var nbrules = 0;
	var rulename;
	var o;
	var def;
	var i, j, k, l, l2, l3;
	var prods = {};
	var nbprods = 1;
	var root = "";
	var ruleindex;
	while (offset < gram[0].length) {
		offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
		rulename = Fleur.GrammarParser._getName(gram[0].substr(offset));
		if (rulename !== "") {
			if (root === "") {
				root = rulename;
			}
			offset += rulename.length;
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			offset++;
			if (gram[0].charAt(offset) === "/") {
				ruleindex = rules[rulename];
				offset++;
			} else {
				rules[rulename] = nbrules++;
				ruleindex = g.length;
			}
			offset = Fleur.GrammarParser._skipSpaces(gram[0], offset);
			o = gram[0].charAt(offset);
			def = "";
			var pre = "";
			var instr = false;
			var incomment = false;
			while (o !== ""){
				if (pre === "\n") {
					if (o !== " ") {
						def = def.substr(0, def.length - 1);
						offset--;
						break;
					} else {
						def = def.substr(0, def.length - 1);
					}
				}
				if (instr) {
					instr = o !== '"';
				}
				if (incomment) {
					incomment = o !== "\n";
				} else if (o === ";" && !instr) {
					incomment = true;
				} else {
					def += o;
					instr = o === '"' && !incomment;
				}
				pre = o;
				o = gram[0].charAt(++offset);
			}
			offset++;
			if (ruleindex === g.length) {
				g.push(Fleur.GrammarParser._getDefinition(def, gram));
			} else {
				g[ruleindex] = g[ruleindex].concat(Fleur.GrammarParser._getDefinition(def, gram));
			}
		} else {
			offset++;
		}
	}
	prods["1 " + root] = 0;
	n[1][1] = [1, 0, root];
	for (i = 0, l = g.length; i < l; i++) {
		for (j = 0, l2 = g[i].length; j < l2; j++) {
			for (k = 0, l3 = g[i][j].length; k < l3; k++) {
				if (g[i][j][k][0] === 2) {
					if (g[i][j][k][2]) {
						if (prods[g[i][j][k][2] + " " + g[i][j][k][1]]) {
							g[i][j][k][2] = prods[g[i][j][k][2] + " " + g[i][j][k][1]];
						} else {
							prods[g[i][j][k][2] + " " + g[i][j][k][1]] = ++nbprods;
							n[1].push([g[i][j][k][2], 0, g[i][j][k][1]]);
							g[i][j][k][2] = nbprods;
						}
					}
					g[i][j][k][1] = rules[g[i][j][k][1]];
				}
			}
		}
	}
	return [g, n];
};
Fleur.Map = function() {
	Fleur.Node.apply(this);
	this.entries = new Fleur.NamedNodeMap();
	this.entries.ownerNode = this;
	this.nodeType = Fleur.Node.MAP_NODE;
	this.nodeName = "#map";
};
Fleur.Map.prototype = new Fleur.Node();
Fleur.Map.prototype.getEntryNode = function(entryname) {
	var i = 0, l = this.entries.length;
	while (i < l) {
		if (this.entries[i].nodeName === entryname) {
			return this.entries[i];
		}
		i++;
	}
	return null;
};
Fleur.Map.prototype.hasEntry = function(entryname) {
	return Boolean(this.entries.getNamedItem(entryname));
};
Fleur.Map.prototype.removeEntry = function(entryname) {
	this.entries.removeNamedItem(entryname);
};
Fleur.Map.prototype.removeEntryNode = function(oldEntry) {
	if (oldEntry.ownerMap !== this) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
	}
	this.entries.removeNamedItem(oldEntry.nodeName);
	return oldEntry;
};
Fleur.Map.prototype.setEntryNode = function(newEntry) {
	var n = this.entries.setNamedItem(newEntry);
	newEntry.ownerMap = this;
	return n;
};
Fleur.Multidim = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.MULTIDIM_NODE;
	this.nodeName = "#multidim";
};
Fleur.Multidim.prototype = new Fleur.Node();
Fleur.NamedNodeMap = function() {};
Fleur.NamedNodeMap.prototype = new Array();
Fleur.NamedNodeMap.prototype.getNamedItem = function(itemname) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i].nodeName === itemname) {
			return this[i];
		}
		i++;
	}
	return null;
};
Fleur.NamedNodeMap.prototype.getNamedItemNS = function(namespaceURI, localName) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i].namespaceURI === namespaceURI && this[i].localName === localName) {
			return this[i];
		}
		i++;
	}
	return null;
};
Fleur.NamedNodeMap.prototype.item = function(index) {
	return this[index];
};
Fleur.NamedNodeMap.prototype.removeNamedItem = function(itemname) {
	var i = 0, l = this.length, node;
	while (i < l) {
		if (this[i].localName === itemname) {
			node = this[i];
			this.splice(i, 1);
			return node;
		}
		i++;
	}
	throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
};
Fleur.NamedNodeMap.prototype.removeNamedItemNS = function(namespaceURI, localName) {
	var i = 0, l = this.length, node;
	while (i < l) {
		if (this[i].namespaceURI === namespaceURI && this[i].localName === localName) {
			node = this[i];
			this.splice(i, 1);
			return node;
		}
		i++;
	}
	throw new Fleur.DOMException(Fleur.DOMException.NOT_FOUND_ERR);
};
Fleur.NamedNodeMap.prototype.setNamedItem = function(arg) {
	var i = 0, l = this.length, node;
	if (arg.ownerElement && arg.ownerElement !== this.ownerNode) {
		throw new Fleur.DOMException(Fleur.DOMException.INUSE_ATTRIBUTE_ERR);
	}
	if (this.ownerNode && this.ownerNode.nodeType === Fleur.Node.ELEMENT_NODE && arg.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
		throw new Fleur.DOMException(Fleur.DOMException.HIERARCHY_REQUEST_ERR);
	}
	while (i < l) {
		if (this[i].localName === arg.localName) {
			node = this[i];
			this.splice(i, 1);
			this.push(arg);
			return node;
		}
		i++;
	}
	this.push(arg);
	return null;
};
Fleur.NamedNodeMap.prototype.setNamedItemNS = function(arg) {
	var i = 0, l = this.length, node;
	if (arg.ownerElement && arg.ownerElement !== this.ownerNode) {
		throw new Fleur.DOMException(Fleur.DOMException.INUSE_ATTRIBUTE_ERR);
	}
	while (i < l) {
		if (this[i].namespaceURI === arg.namespaceURI && this[i].localName === arg.localName) {
			node = this[i];
			this.splice(i, 1);
			this.push(arg);
			return node;
		}
		i++;
	}
	this.push(arg);
	return null;
};
Fleur.NameList = function() {};
Fleur.NameList.prototype = new Array();
Fleur.NameList.prototype.contains = function(str) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][1] === str) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur.NameList.prototype.containsNS = function(namespaceURI, n) {
	var i = 0, l = this.length;
	while (i < l) {
		if (this[i][0] === namespaceURI && this[i][1] === n) {
			return true;
		}
		i++;
	}
	return false;
};
Fleur.NameList.prototype.getName = function(index) {
	return this[index][1];
};
Fleur.NameList.prototype.getNamespaceURI = function(index) {
	return this[index][0];
};
Fleur.Namespace = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.NAMESPACE_NODE;
};
Fleur.Namespace.prototype = new Fleur.Node();
Object.defineProperties(Fleur.Namespace.prototype, {
	nodeValue: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	},
	specified: {
		get: function() {
			return !!this.firstChild;
		}
	},
	value: {
		set: function(value) {
			if (value) {
				if (!this.firstChild) {
					this.appendChild(this.ownerDocument.createTextNode(value));
					return;
				}
				this.firstChild.nodeValue = value;
				return;
			}
			if (this.firstChild) {
				this.removeChild(this.firstChild);
			}
		},
		get: function() {
			var s = "", i = 0, l = this.childNodes ? this.childNodes.length : 0;
			while (i < l) {
				s += this.childNodes[i].nodeValue;
				i++;
			}
			return s;
		}
	}
});
Fleur.ProcessingInstruction = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.PROCESSING_INSTRUCTION_NODE;
};
Fleur.ProcessingInstruction.prototype = new Fleur.Node();
Object.defineProperties(Fleur.ProcessingInstruction.prototype, {
	nodeValue: {
		set: function(value) {
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
			if (value !== "") {
				this.appendChild(new Fleur.Text());
				this.firstChild.data = value;
			}
		},
		get: function() {
			var _textContent = "", i = 0, li = this.childNodes.length;
			while (i < li) {
				_textContent += this.childNodes[i++].textContent;
			}
			return _textContent;
		}
	}
});
Fleur.Sequence = function() {
	Fleur.Node.apply(this);
	this.nodeType = Fleur.Node.SEQUENCE_NODE;
	this.nodeName = "#sequence";
};
Fleur.Sequence.prototype = new Fleur.Node();
Object.defineProperty(Fleur, "EmptySequence", {
	value: new Fleur.Sequence(),
	writable: false,
	enumerable: true,
	configurable: false
});
Fleur.Serializer = function() {};
Fleur.Serializer.escapeXML = function(s, quotes, inline) {
	var i = 0, c, code, l = s.length, r = "";
	while (i < l) {
		c = s.charAt(i);
		switch (c) {
			case '&':
				r += '&amp;';
				break;
			case '<':
				r += '&lt;';
				break;
			case '>':
				r += '&gt;';
				break;
			case "'":
				r += '&apos;';
				break;
			case '"':
				r += quotes ? '&quot;' : '"';
				break;
			default:
				code = c.charCodeAt(0);
				if ((!inline && (code === 9 || code === 10 || code === 13)) || (code > 31 && code < 127)) {
					r += c;
				} else {
					r += '&#' + code + ';';
				}
		}
		i++;
	}
	return r;
};
Fleur.Serializer._serializeXMLToString = function(node, indent, offset, knownns) {
	var s, i, l, index, nsl;
	knownns = knownns || {pf: [], uri: []};
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = (indent ? offset + "<" : "<") + node.nodeName;
			nsl = knownns.pf.length;
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					names.push(node.attributes[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					if (names[i] === "xmlns") {
						index = knownns.pf.lastIndexOf(" ");
						if (index !== -1 && knownns.uri[index] === node.getAttribute(names[i])) {
							continue;
						}
						knownns.pf.push(" ");
						knownns.uri.push(node.getAttribute(names[i]));
					} else if (node.getAttributeNode(names[i]).namespaceURI === "http://www.w3.org/2000/xmlns/") {
						index = knownns.pf.lastIndexOf(node.getAttributeNode(names[i]).localName);
						if (index !== -1 && knownns.uri[index] === node.getAttributeNode(names[i]).nodeValue) {
							continue;
						}
						knownns.pf.push(node.getAttributeNode(names[i]).localName);
						knownns.uri.push(node.getAttributeNode(names[i]).nodeValue);
					}
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					if (node.attributes[i].nodeName === "xmlns") {
						index = knownns.pf.lastIndexOf(" ");
						if (index !== -1 && knownns.uri[index] === node.attributes[i].nodeValue) {
							continue;
						}
						knownns.pf.push(" ");
						knownns.uri.push(node.attributes[i].nodeValue);
					} else if (node.attributes[i].namespaceURI === "http://www.w3.org/2000/xmlns/") {
						index = knownns.pf.lastIndexOf(node.attributes[i].localName);
						if (index !== -1 && knownns.uri[index] === node.attributes[i].nodeValue) {
							continue;
						}
						knownns.pf.push(node.attributes[i].localName);
						knownns.uri.push(node.attributes[i].nodeValue);
					}
					s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
				}
			}
			if (node.childNodes.length === 0) {
				knownns.pf.length = nsl;
				knownns.uri.length = nsl;
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset + "  ", knownns);
			}
			knownns.pf.length = nsl;
			knownns.uri.length = nsl;
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			if ((indent || (node.ownerDocument && node === node.ownerDocument.firstChild)) && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
				return "";
			}
			return Fleur.Serializer.escapeXML(node.data);
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.SEQUENCE_NODE:
			s = "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset, knownns);
			}
			return s;
		case Fleur.Node.DOCUMENT_NODE:
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeXMLToString(node.childNodes[i], indent, offset);
			}
			return s;
	}
};
Fleur.Serializer._serializeHTMLToString = function(node, indent, offset) {
	var s, i, l;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = "";
			if (node.localName.toLowerCase() === "html") {
				s += indent ? "<!DOCTYPE html>\n" : "<!DOCTYPE html>";
			}
			s += (indent ? offset + "<" : "<") + node.localName.toLowerCase();
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
						names.push(node.attributes[i].localName.toLowerCase());
					}
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					if (node.attributes[i].localName !== "xmlns" && node.attributes[i].prefix !== "xmlns") {
						s += " " + node.attributes[i].localName.toLowerCase() + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true) + "\"";
					}
				}
			}
			if (node.childNodes.length === 0) {
				if (["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].indexOf(node.localName.toLowerCase()) !== -1) {
					return s + (indent ? ">\n" : ">");
				}
				return s + (indent ? "></" + node.localName.toLowerCase() + ">\n" : "></" + node.localName.toLowerCase() + ">");
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName.toLowerCase() + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
				return "";
			}
			return node.parentNode.localName && ["script", "style"].indexOf(node.parentNode.localName.toLowerCase()) !== -1 ? node.data : Fleur.Serializer.escapeXML(node.data);
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeHTMLToString(node.childNodes[i], indent, offset);
			}
			return s;
	}
};
Fleur.Serializer._serializeNodeToXQuery = function(node, indent, offset, tree, postfix, inmap) {
	var s, i, l;
	postfix = postfix || "";
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
			s = (indent ? offset + "<" : "<") + node.nodeName;
			if (indent) {
				var names = [];
				for (i = 0, l = node.attributes.length; i < l; i++) {
					names.push(node.attributes[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i]), true, false) + "\"";
				}
			} else {
				for (i = 0, l = node.attributes.length; i < l; i++) {
					s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue, true, true) + "\"";
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>" + postfix + "\n" : "/>" + postfix);
			}
			s += indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", true);
			}
			return s + (indent && (node.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || node.childNodes[0].data.match(/^[ \t\n\r]*$/)) ? offset + "</" : "</") + node.nodeName + ">" + postfix + (indent ? "\n" : "");
		case Fleur.Node.SEQUENCE_NODE:
			if (node.rowlabels || node.collabels) {
				s = (indent ? offset : "") + "matrix:labels(";
				var seriarr = function(arr) {
					if (!arr) {
						return "()";
					}
					if (arr.length === 1) {
						return "'" + arr[0] + "'";
					}
					var sarr = "";
					arr.forEach(function(l, index) {
						sarr += (index !== 0 ? ", " : "") + "'" + l + "'";
					});
					return "(" +  sarr + ")";
				};
				s += seriarr(node.rowlabels) + ", ";
				s += seriarr(node.collabels) + ", (";
			} else {
				s = indent ? offset + "(" : "(";
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? ")\n" : ")");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? node.childNodes[i].nodeType === Fleur.Node.MULTIDIM_NODE ? ";" : "," : "");
			}
			if (node.rowlabels || node.collabels) {
				return s + (indent ? offset + "))\n" : "))");
			}
			return s + (indent ? offset + ")\n" : ")");
		case Fleur.Node.MULTIDIM_NODE:
			s = indent ? offset : "";
			if (node.childNodes.length === 0) {
				return s + (indent ? "\n" : "");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? "," : "");
			}
			return s + (indent ? offset + postfix + "\n" : postfix);
		case Fleur.Node.ATTRIBUTE_NODE:
			return (indent ? offset : "") + "attribute " + node.nodeName + " {\"" + Fleur.Serializer.escapeXML(node.value).replace(/"/gm, "\"\"") + "\"}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.FUNCTION_NODE:
			return (indent ? offset : "") + node.nodeName + "#" + String(node.argtypes.length);
		case Fleur.Node.MAP_NODE:
			s = (indent ? offset : "") + "map {"; 
			if (node.entries.length === 0) {
				return s + "}" + (indent ? "\n" : "");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.entries.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.entries[i], indent, offset + "  ", false, i !== l - 1 ? ", " : "", true);
			}
			return s + "}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.ARRAY_NODE:
			s = (indent ? offset : "") + "array {"; 
			if (node.childNodes.length === 0) {
				return s + "}" + (indent ? "\n" : "");
			}
			s += indent ? "\n" : "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset + "  ", false, i !== l - 1 ? "," : "");
			}
			return s + "}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.ENTRY_NODE:
			if (inmap) {
				return (indent ? offset : "") + "\"" + node.nodeName + "\": " + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ") + postfix + (indent ? "\n" : "");
			}
			return (indent ? offset : "") + "entry " + node.nodeName + " {" + Fleur.Serializer._serializeNodeToXQuery(node.firstChild, indent, offset + "  ") + "}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.TEXT_NODE:
			var typeName;
			var prefix;
			if (node.schemaTypeInfo) {
				var nres = new Fleur.XPathNSResolver(node);
				typeName = node.schemaTypeInfo.typeName;
				prefix = nres.lookupPrefix(node.schemaTypeInfo.typeNamespace);
			} else {
				typeName = "untypedAtomic";
				prefix = "xs";
			}
			if (tree) {
				if (indent && node.data.match(/^[ \t\n\r]*$/) && node.parentNode.childNodes.length !== 1) {
					return "";
				}
				return Fleur.Serializer.escapeXML(node.data, !indent, !indent);
			}
			if (node.schemaTypeInfo === Fleur.Type_error) {
				var errmess = Fleur.noErrorMessage ? null : node.textContent;
				return "fn:error(fn:QName(\"" + node.namespaceURI + "\", \"" + node.nodeName + "\")" + (errmess ? ",\"" + Fleur.Serializer.escapeXML(errmess, false, false).replace(/"/gm, "\"\"") + "\"" : "") + ")" + postfix;
			}
			if (node.schemaTypeInfo === Fleur.Type_QName) {
				return "fn:QName(\"" + node.namespaceURI + "\", \"" + node.nodeName + "\")" + postfix;
			}
			return (indent ? offset : "") + prefix + ":" + typeName + "(\"" + Fleur.Serializer.escapeXML(node.data, !indent, !indent).replace(/"/gm, "\"\"") + "\")" + postfix + (indent ? "\n" : "");
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "processing-instruction " : "processing-instruction ") + node.nodeName + " {\"" + Fleur.Serializer.escapeXML(node.data, false, false).replace(/"/gm, "\"\"") + "\"}" + postfix + (indent ? "\n" : "");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			if (node.childNodes.length === 0) {
				return "document {}";
			}
			s = 'document {';
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeNodeToXQuery(node.childNodes[i], indent, offset, true);
			}
			return s + "}" + postfix;
	}
};
Fleur.Serializer._serializeEXMLToString = function(node, indent, offset) {
	var s, i, l, nodeName, isqname;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.ENTRY_NODE:
			isqname = node.nodeType === Fleur.Node.ELEMENT_NODE && Fleur.Node.QNameReg.test(node.nodeName);
			nodeName = isqname ? node.nodeName : "exml:" + (node.nodeType === Fleur.Node.ELEMENT_NODE ? "element" : "entry");
			s = (indent ? offset + "<" : "<") + nodeName;
			if (!isqname) {
				s += " name=\"" + Fleur.Serializer.escapeXML(node.nodeName) + "\"";
			}
			if (node.attributes) {
				if (indent) {
					var names = [];
					for (i = 0, l = node.attributes.length; i < l; i++) {
						names.push(node.attributes[i].nodeName);
					}
					names.sort();
					for (i = 0, l = names.length; i < l; i++) {
						s += " " + names[i] + "=\"" + Fleur.Serializer.escapeXML(node.getAttribute(names[i])) + "\"";
					}
				} else {
					for (i = 0, l = node.attributes.length; i < l; i++) {
						s += " " + node.attributes[i].nodeName + "=\"" + Fleur.Serializer.escapeXML(node.attributes[i].nodeValue) + "\"";
					}
				}
			}
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</" : "</") + nodeName + (indent ? ">\n" : ">");
		case Fleur.Node.TEXT_NODE:
			s = indent ? offset + '<exml:atom' : '<exml:atom';
			return s +  ' type="Q{' + node.schemaTypeInfo.typeNamespace + '}' + node.schemaTypeInfo.typeName + '">' + Fleur.Serializer.escapeXML(node.data) + (indent ? "</exml:atom>\n" : "</exml:atom>");
		case Fleur.Node.CDATA_NODE:
			return (indent ? offset + "<![CDATA[" : "<![CDATA[") + node.data + (indent ? "]]>\n" : "]]>");
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return (indent ? offset + "<?" : "<?") + node.nodeName + " " + node.data + (indent ? "?>\n" : "?>");
		case Fleur.Node.COMMENT_NODE:
			return (indent ? offset + "<!--" : "<!--") + node.data + (indent ? "-->\n" : "-->");
		case Fleur.Node.DOCUMENT_NODE:
			s = '<?xml version="1.0" encoding="UTF-8"?>\r\n';
			s += '<exml:document xmlns:exml="http://www.agencexml.com/exml">' + (indent ? "\n" : "");
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, "  ");
			}
			return  s + "</exml:document>";
		case Fleur.Node.ARRAY_NODE:
			s = indent ? offset + "<exml:array" : "<exml:array";
			if (node.childNodes.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.childNodes[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</" : "</") + "exml:array" + (indent ? ">\n" : ">");
		case Fleur.Node.MAP_NODE:
			s = indent ? offset + "<exml:map" : "<exml:map";
			if (node.entries.length === 0) {
				return s + (indent ? "/>\n" : "/>");
			}
			s += indent ? ">\n" : ">";
			for (i = 0, l = node.entries.length; i < l; i++) {
				s += Fleur.Serializer._serializeEXMLToString(node.entries[i], indent, offset + "  ");
			}
			return s + (indent ? offset + "</exml:map>\n" : "</exml:map>");
	}
};
Fleur.Serializer.escapeJSON = function(s) {
	var i = 0, c, code, l = s.length, r = "";
	while (i < l) {
		c = s.charAt(i);
		switch (c) {
			case '\t':
				r += '\\t';
				break;
			case '\n':
				r += '\\n';
				break;
			case '\r':
				r += '\\r';
				break;
			case '\\':
				r += '\\\\';
				break;
			case '"':
				r += '\\"';
				break;
			default:
				code = c.charCodeAt(0);
				if (code > 31 && code < 127) {
					r += c;
				} else {
					r += '\\u' + ('000' + code.toString(16)).slice(-4);
				}
		}
		i++;
	}
	return r;
};
Fleur.Serializer._serializeJSONToString = function(node, indent, offset, inline, comma) {
	var s, i, l, quote;
	switch (node.nodeType) {
		case Fleur.Node.MAP_NODE:
			s = indent && !inline ? offset + "{" : "{";
			if (node.entries.length === 0) {
				return s + (indent ? "}" + comma + "\n" : "}" + comma);
			}
			if (indent) {
				s += "\n";
			}
			if (indent) {
				var names = [];
				for (i = 0, l = node.entries.length; i < l; i++) {
					names.push(node.entries[i].nodeName);
				}
				names.sort();
				for (i = 0, l = names.length; i < l; i++) {
					s += Fleur.Serializer._serializeJSONToString(node.getEntryNode(names[i]), indent, offset + "  ", false, (i === l - 1 ? "" : ","));
				}
			} else {
				for (i = 0, l = node.entries.length; i < l; i++) {
					s += Fleur.Serializer._serializeJSONToString(node.entries[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
				}
			}
			return s + (indent ? offset + "}" + comma + "\n" : "}" + comma);
		case Fleur.Node.ENTRY_NODE:
			if (indent && Fleur.Node.JSNameReg.test(node.nodeName)) {
				s = offset + node.nodeName + ": ";
			} else {
				s = (indent ? offset + '"' : '"') + Fleur.Serializer.escapeJSON(node.nodeName) + '":' + (indent ? " " : "");
			}
			s += Fleur.Serializer._serializeJSONToString(node.firstChild, indent, offset, true, comma);
			return s;
		case Fleur.Node.TEXT_NODE:
			quote = node.schemaTypeInfo === Fleur.Type_string  || node.schemaTypeInfo === Fleur.Type_untypedAtomic ? '"' : node.schemaTypeInfo === Fleur.Type_regex ? '/' : "";
			return (indent && !inline ? offset + quote : quote) + Fleur.Serializer.escapeJSON(node.data) + quote + comma + (indent ? "\n" : "");
		case Fleur.Node.ARRAY_NODE:
		case Fleur.Node.SEQUENCE_NODE:
			s = indent && !inline ? offset + "[" : "[";
			if (node.childNodes.length === 0) {
				return s + (indent ? "]" + comma + "\n" : "]" + comma);
			}
			if (indent) {
				s += "\n";
			}
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset + "  ", false, (i === l - 1 ? "" : ","));
			}
			return s + (indent ? offset + "]" + comma + "\n" : "]" + comma);
		case Fleur.Node.DOCUMENT_NODE:
			s = "";
			for (i = 0, l = node.childNodes.length; i < l; i++) {
				s += Fleur.Serializer._serializeJSONToString(node.childNodes[i], indent, offset, false, "");
			}
			return s;
	}
};
Fleur.Serializer.escapeCSV = function(s, sep) {
	if (s.indexOf(sep) !== -1) {
		return '"' + s.replace(/"/g, '""') + '"';
	}
	return s;
};
Fleur.Serializer._serializeMatrixToString = function(node, head, sep) {
	var s;
	if (head && node.collabels) {
		s = node.collabels.join(sep) + "\n";
	} else {
		s = "";
	}
	var seq2string = function(seq) {
		seq.childNodes.forEach(function(n, index) {
			s += (index !== 0 ? sep : "") + n.data;
		});
		s += "\n";
	};
	if (node.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
		node.childNodes.forEach(seq2string);
	} else {
		seq2string(node);
	}
	return s;
};
Fleur.Serializer._serializeCSVToString = function(node, head, key, sep, level) {
	var s = "", s2, s3, i, l, rowname, nextlevel = level, headref;
	switch (node.nodeType) {
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.ARRAY_NODE:
		case Fleur.Node.DOCUMENT_NODE:
			if (node.childNodes.length === 0) {
				nextlevel = 2;
			} else if (node.nodeType !== Fleur.Node.DOCUMENT_NODE || node.childNodes[0].nodeType === Fleur.Node.ARRAY_NODE) {
				nextlevel = level + 1;
			}
			if (node.childNodes.length > 1 && nextlevel < 2) {
				l = node.childNodes.length;
				i = 1;
				rowname = node.childNodes[0].nodeName;
				while (i < l) {
					if (rowname !== node.childNodes[i].nodeName) {
						nextlevel++;
						break;
					}
					i++;
				}
			}
			if (head && level === 0 && nextlevel !== 0) {
				if (key !== null) {
					headref = node.childNodes[0].entries[0];
					l = headref.childNodes.length;
					i = 0;
					while (i < l) {
						if (s !== "") {
							s += sep;
						}
						if (i === key) {
							s += node.nodeName + sep;
						}
						s += headref.childNodes[i].nodeName;
						i++;
					}
					if (l === key) {
						if (s !== "") {
							s += sep;
						}
						s += node.nodeName;
					}
					head = false;
				} else {
					if (node.childNodes.length !== 0) {
						headref = nextlevel === level + 1 ? node.childNodes[0] : node;
						l = headref.childNodes.length;
						i = 0;
						while (i < l) {
							if (s !== "") {
								s += sep;
							}
							s += headref.childNodes[i].nodeName;
							i++;
						}
					} else {
						s  = node.nodeName;
					}
				}
				s += "\n";
			}
			l = node.childNodes.length;
			i = 0;
			s3 = "";
			while (i < l) {
				s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], key ? head : level === 0, key, sep, nextlevel);
				if (s2) {
					if (s3 !== "") {
						s3 += nextlevel === 1 ? "\n" : ((nextlevel - level === 2 || node.nodeType === Fleur.Node.ARRAY_NODE) ? sep : "");
					}
					s3 += s2;
				}
				i++;
			}
			return s + s3;
		case Fleur.Node.SEQUENCE_NODE:
			return null;
		case Fleur.Node.MAP_NODE:
			l = node.entries.length;
			i = 0;
			while (i < l) {
				s += Fleur.Serializer._serializeCSVToString(node.entries[i], false, key, sep, nextlevel) + "\n";
				i++;
			}
			return s;
		case Fleur.Node.ENTRY_NODE:
			l = node.childNodes.length;
			i = 0;
			s3 = "";
			while (i < l) {
				if (i === key) {
					if (s3 !== "") {
						s3 += sep;
					}
					s3 += Fleur.Serializer.escapeCSV(node.nodeName);
				}
				s2 = Fleur.Serializer._serializeCSVToString(node.childNodes[i], false, key, sep, nextlevel);
				if (s2) {
					if (s3 !== "") {
						s3 += sep;
					}
					s3 += s2;
				}
				i++;
			}
			return s + s3;
		case Fleur.Node.TEXT_NODE:
			if (head && level !== 2) {
				s = (node.parentNode ? Fleur.Serializer.escapeCSV(node.nodeName) : "#text") + "\n";
			}
			s += Fleur.Serializer.escapeCSV(node.data);
			return s;
		default:
			return null;
	}
};
Fleur.Serializer.XQX_delimitedList = function(node, delimiter, leftEncloser, rightEncloser, selector) {
	var s = leftEncloser, i = 0, l = node.childNodes.length;
	while (i < l) {
		Fleur.Serializer._serializeXQXToString(node.childNodes[i]);
		i++;
		if (i !== l) {
			s += delimiter;
		}
	}
	return s + rightEncloser;
};
Fleur.Serializer.XQX_parenthesizedList = function(node, delimiter) {
	delimiter = delimiter || ", ";
	return Fleur.Serializer.XQX_delimitedList(node, delimiter, "(", ")");
};
Fleur.Serializer.XQX_commaSeparatedList = function(node) {
	return Fleur.Serializer.XQX_delimitedList(node, ", ");
};
Fleur.Serializer.XQX_quote = function(item) {
	return '"' + item.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\x85/g, "&amp;#x85;").replace(/\x2028/g, "&#x2028;").replace (/\"/g, '""') + '"';
};
Fleur.Serializer.XQX_renderQName = function(node) {
	return (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") ? node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" : "") + node.textContent;
};
Fleur.Serializer.XQX_renderEQName = function(node) {
	if (node.localName === "elementConstructor" && node.namespaceURI === "http://www.w3.org/2005/XQueryX") {
		var i = 0, l = node.children.length;
		while (i < l) {
			if (node.children[i].localName === "tagName" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
				return Fleur.Serializer.XQX_renderQName(node.children[i]);
			}
			i++;
		}
	}
	if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "prefix")) {
		return node.getAttributeNS("http://www.w3.org/2005/XQueryX", "prefix") + ":" + node.textContent;
	}
	if (node.hasAttributeNS("http://www.w3.org/2005/XQueryX", "URI")) {
		return "Q{" + node.getAttributeNS("http://www.w3.org/2005/XQueryX", "URI") + "}" + node.textContent;
	}
	return node.textContent;
};
Fleur.Serializer.XQX_renderChildren = function(node, filter) {
	var i = 0, l, s = "";
	l = node.children.length;
	while (i < l) {
		if (!filter || (filter.indexOf(node.children[i].localName) !== -1 && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX")) {
			s += Fleur.Serializer._serializeXQXToString(node.children[i]);
		}
		i++;
	}
	return s;
};
Fleur.Serializer.XQX_ops = {
	"unaryMinusOp": "-",
	"unaryPlusOp": "+",
	"addOp": "+",
	"subtractOp": " - ",
	"multiplyOp": "*",
	"divOp": " div ",
	"idivOp": " idiv ",
	"modOp": " mod ",
	"stringConcatenateOp": "||",
	"eqOp": " eq ",
	"neOp": " ne ",
	"ltOp": " lt ",
	"gtOp": " gt ",
	"leOp": " le ",
	"geOp": " ge ",
	"equalOp": " = ",
	"notEqualOp": " != ",
	"lessThanOp": " < ",
	"greaterThanOp": " > ",
	"lessThanOrEqualOp": " <= ",
	"greaterThanOrEqualOp": " >= ",
	"isOp": " is ",
	"nodeBeforeOp": " << ",
	"nodeAfterOp": " >> ",
	"andOp": " and ",
	"orOp": " or ",
	"unionOp": " union ",
	"intersectOp": " intersect ",
	"exceptOp": " except "
};
Fleur.Serializer._serializeXQXToString = function(node) {
	var i = 0, l, s, n;
	if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
		return Fleur.Serializer._serializeXQXToString(node.documentElement);
	}
	if (node.namespaceURI !== "http://www.w3.org/2005/XQueryX") {
		return;
	}
	switch(node.localName) {
		case "attributeName":
			return Fleur.Serializer.XQX_renderQName(node);
		case "NCName":
			return node.textContent;
		case "rootExpr":
			return "/";
		case "argumentPlaceholder":
			return "?";
		case "contextItemExpr":
			return ".";
		case "stringConstantExpr":
		case "stringLiteral":
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return "";
		case "integerConstantExpr":
		case "integerLiteral":
		case "decimalConstantExpr":
		case "doubleConstantExpr":
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "value" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return node.children[i].textContent;
				}
				i++;
			}
			return "";
		case "varRef":
		case "variableRef":
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["name"]);
		case "pragma":
			return "(# " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaName"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["pragmaContents"]) + " #)";
		case "extensionExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["pragma"]) + "{" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + "}";
		case "simpleMapExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "pathExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += (s === "" ? "( " : "\n! ( ") + Fleur.Serializer._serializeXQXToString(node.children[i]) + " )";
				}
				i++;
			}
			return s;
		case "functionCallExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "arguments" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
				}
				i++;
			}
			return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + (s === "" ? "()" : s);
		case "constructorFunctionExpr":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName === "argExpr" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_parenthesizedList(node.children[i]) ;
				}
				i++;
			}
			return Fleur.Serializer.XQX_renderChildren(node, ["typeName"]) + (s === "" ? "()" : s);
		case "unaryMinusOp":
		case "unaryPlusOp":
			return "(" + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["operand"]) + ")";
		case "addOp":
		case "subtractOp":
		case "multiplyOp":
		case "divOp":
		case "idivOp":
		case "modOp":
		case "stringConcatenateOp":
		case "eqOp":
		case "neOp":
		case "ltOp":
		case "gtOp":
		case "leOp":
		case "geOp":
		case "equalOp":
		case "notEqualOp":
		case "lessThanOp":
		case "greaterThanOp":
		case "lessThanOrEqualOp":
		case "greaterThanOrEqualOp":
		case "isOp":
		case "nodeBeforeOp":
		case "nodeAfterOp":
		case "andOp":
		case "orOp":
		case "unionOp":
		case "intersectOp":
		case "exceptOp":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["firstOperand"]) + Fleur.Serializer.XQX_ops[node.localName] + Fleur.Serializer.XQX_renderChildren(node, ["secondOperand"]) + ")";
		case "sequenceExpr":
			return Fleur.Serializer.XQX_parenthesizedList(node, ",\n");
		case "firstOperand":
		case "secondOperand":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "rangeSequenceExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["startExpr"]) + " to " + Fleur.Serializer.XQX_renderChildren(node, ["endExpr"]) + ")";
		case "forClause":
			return " for " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "forClauseItem":
		case "letClauseItem":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += Fleur.Serializer._serializeXQXToString(node.children[i]);
				i++;
			}
			return s;
		case "allowingEmpty":
			return " allowing empty ";
		case "forExpr":
			return "\n    in " + Fleur.Serializer.XQX_renderChildren(node);
		case "letClause":
			return " let " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "letExpr":
			return " := " + Fleur.Serializer.XQX_renderChildren(node);
		case "windowClause":
			return " for " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "tumblingWindowClause":
			return "   tumbling window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
				" in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
		case "slidingWindowClause":
			return "   sliding window " + Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) +
				" in " + Fleur.Serializer.XQX_renderChildren(node, ["bindingSequence"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowStartCondition"]) + "\n" +
				"      " + Fleur.Serializer.XQX_renderChildren(node, ["windowEndCondition"]);
		case "bindingSequence":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "windowStartCondition":
			return "start " + Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) +
				" when " + Fleur.Serializer.XQX_renderChildren(node, ["winStartExpr"]);
		case "windowEndCondition":
			return (node.getAttributeNS("http://www.w3.org/2005/XQueryX", "onlyEnd") === "true" ? "only end " : "end " ) +
				Fleur.Serializer.XQX_renderChildren(node, ["windowVars"]) + " when " + Fleur.Serializer.XQX_renderChildren(node, ["winEndExpr"]);
		case "windowVars":
			return Fleur.Serializer.XQX_renderChildren(node, ["currentItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["positionalVariableBinding"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["previousItem"]) + Fleur.Serializer.XQX_renderChildren(node, ["nextItem"]);
		case "currentItem":
			return "$" + Fleur.Serializer.XQX_renderEQName(node);
		case "previousItem":
			return " previous $" + Fleur.Serializer.XQX_renderEQName(node);
		case "nextItem":
			return " next $" + Fleur.Serializer.XQX_renderEQName(node);
		case "countClause":
			return " count " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "whereClause":
			return " where " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "groupByClause":
			return "  group by " + Fleur.Serializer.XQX_commaSeparatedList(node) + "\n";
		case "groupingSpec":
			return "$" + Fleur.Serializer.XQX_renderChildren(node);
		case "groupVarInitialize":
		case "collation":
			return " collation " + Fleur.Serializer.XQX_quote(node.textContent);
		case "emptyOrderingMode":
		case "orderingKind":
			return " " + node.textContent;
		case "orderModifier":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "orderBySpec":
			return Fleur.Serializer.XQX_renderChildren(node, ["orderByExpr"]) + " " + Fleur.Serializer.XQX_renderChildren(node, ["orderModifier"]);
 		case "orderByClause":
		case "returnClause":
			return " return " + Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "flworExpr":
			return "\n(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "ifThenElseExpr":
			return "( if (" + Fleur.Serializer.XQX_renderChildren(node, ["ifClause"]) + ") then " + Fleur.Serializer.XQX_renderChildren(node, ["thenClause"]) + " else " + Fleur.Serializer.XQX_renderChildren(node, ["elseClause"]) + ")";
		case "positionalVariableBinding":
			return " at $" + Fleur.Serializer.XQX_renderEQName(node);
		case "variableBinding":
			return "$" + Fleur.Serializer.XQX_renderEQName(node) + (node.parentNode.localName === "typeswitchExprCaseClause" && node.parentNode.namespaceURI === "http://www.w3.org/2005/XQueryX" ? " as " : "");
		case "typedVariableBinding": 
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
		case "quantifiedExprInClause":
			return Fleur.Serializer.XQX_renderChildren(node, ["typedVariableBinding"]) + " in " + Fleur.Serializer.XQX_renderChildren(node, ["sourceExpr"]);
		case "quantifiedExpr":
		case "instanceOfExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " instance of " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
		case "castExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " cast as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
		case "castableExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " castable as " + Fleur.Serializer.XQX_renderChildren(node, ["singleType"]) + ")";
		case "treatExpr":
			return "(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + " treat as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ")";
		case "switchExprCaseClause":
		case "switchExprDefaultClause":
			return "\n   default return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "switchExpr":
			return "(switch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
				Fleur.Serializer.XQX_renderChildren(node, ["switchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["switchExprDefaultClause"]) + ")";
		case "typeswitchExprCaseClause":
			return " case " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["sequenceType", "sequenceTypeUnion"]) + " return " +
				Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "typeswitchExprDefaultClause":
			return " default " + Fleur.Serializer.XQX_renderChildren(node, ["variableBinding"]) + " return " + Fleur.Serializer.XQX_renderChildren(node, ["resultExpr"]);
		case "typeswitchExpr":
			return "(typeswitch(" + Fleur.Serializer.XQX_renderChildren(node, ["argExpr"]) + ")" +
				Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprCaseClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeswitchExprDefaultClause"]) +
				")";
		case "tryCatchExpr":
			return "\n(try " + Fleur.Serializer.XQX_renderChildren(node, ["tryClause"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchClause"]) + ")";
		case "tryClause":
			return "{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "catchClause":
			return "\n  catch " + Fleur.Serializer.XQX_renderChildren(node, ["catchErrorList"]) + Fleur.Serializer.XQX_renderChildren(node, ["catchExpr"]);
		case "catchErrorList":
		case "catchExpr":
			return "\n{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "validateExpr":
		case "xpathAxis":
			return node.textContent + "::";
		case "predicates":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += "[" + Fleur.Serializer._serializeXQXToString(node.children[i]) + "]";
				i++;
			}
			return s;
		case "predicate":
			return "[" + Fleur.Serializer.XQX_renderChildren(node) + "]";
		case "dynamicFunctionInvocationExpr":
		case "functionItem":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "mapConstructor":
		case "mapConstructorEntry":
		case "arrayConstructor":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "squareArray":
		case "curlyArray":
			return " array { " + Fleur.Serializer.XQX_renderChildren(node) + " } ";
		case "star":
			return "*";
		case "textTest":
			return "text()";
		case "commentTest":
			return "comment()";
		case "namespaceTest":
			return "namespace-node()";
		case "anyKindTest":
			return "node()";
		case "piTest":
			return "processing-instruction(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "documentTest":
			return "document-node(" + Fleur.Serializer.XQX_renderChildren(node) + ")";
		case "nameTest":
			return Fleur.Serializer.XQX_renderEQName(node);
		case "attributeTest":
		case "elementTest":
		case "schemaElementTest":
			return "schema-element(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
		case "schemaAttributeTest":
			return "schema-attribute(" + Fleur.Serializer.XQX_renderEQName(node) + ")";
		case "anyFunctionTest":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function(*)";
		case "typedFunctionTest":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function" + Fleur.Serializer.XQX_renderChildren(node, ["paramTypeList"]) +
				" as " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]);
		case "paramTypeList":
			return Fleur.Serializer.XQX_parenthesizedList(node);
		case "anyMapTest":
			return " map(*)";
		case "typedMapTest":
			return " map(" + Fleur.Serializer.XQX_renderChildren(node, ["atomicType"]) + ", " + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
		case "lookup":
			return " ?" + Fleur.Serializer.XQX_renderChildren(node);
		case "arrowPostfix":
		case "anyArrayTest":
			return " array(*)";
		case "typedArrayTest":
			return " array(" + Fleur.Serializer.XQX_renderChildren(node, ["sequenceType"]) + ") ";
		case "parenthesizedItemType":
			return " ( " + Fleur.Serializer.XQX_renderChildren(node) + " ) ";
		case "stepExpr":
			s = "";
			n = node.previousSibling;
			while (n) {
				if (n.localName === "stepExpr" && n.namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s = "/";
					break;
				}
				n = n.previousSibling;
			}
			return s + Fleur.Serializer.XQX_renderChildren(node);
		case "filterExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "namedFunctionRef":
			return Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + "#" + Fleur.Serializer.XQX_renderChildren(node, ["integerConstantExpr"]);
		case "inlineFunctionExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) +
				Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]) +	 Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
		case "pathExpr":
			return Fleur.Serializer.XQX_renderChildren(node, ["rootExpr", "stepExpr"]);
		case "attributeConstructor":
		case "namespaceDeclaration":
		case "attributeList":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "elementContent":
			l = node.children.length;
			s = "";
			while (i < l) {
				if (node.children[i].localName !== "elementConstructor" || node.children[i].namespaceURI !== "http://www.w3.org/2005/XQueryX") {
					s += " {" + Fleur.Serializer._serializeXQXToString(node.children[i]) + " }";
				} else {
					s += Fleur.Serializer._serializeXQXToString(node.children[i]);
				}
				i++;
			}
			return s;
		case "elementConstructor":
			return "<" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["xqx:attributeList"]) +
				">" + Fleur.Serializer.XQX_renderChildren(node, ["elementContent"]) + "</" + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + ">";
		case "tagNameExpr":
			return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
		case "computedElementConstructor":
			return " element " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
				" { " + Fleur.Serializer.XQX_renderChildren(node, ["contentExpr"]) + " }";
		case "contentExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "computedAttributeConstructor":
			return " attribute " + Fleur.Serializer.XQX_renderChildren(node, ["tagName"]) + Fleur.Serializer.XQX_renderChildren(node, ["tagNameExpr"]) +
				" { " + Fleur.Serializer.XQX_renderChildren(node, ["valueExpr"]) + " }";
		case "computedDocumentConstructor":
			return " document {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedTextConstructor":
			return " text {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedCommentConstructor":
			return " comment {" + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "computedNamespaceConstructor":
		case "piTargetExpr":
			return "{" + Fleur.Serializer.XQX_renderChildren(node) + "}";
		case "piValueExpr":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "computedPIConstructor":
		case "unorderedExpr":
			return " unordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "orderedExpr":
			return " ordered{ " + Fleur.Serializer.XQX_renderChildren(node) + " }";
		case "versionDecl":
		case "namespaceDecl":
 			s = "declare namespace ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += "=";
			i = 0;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return s;
		case "defaultNamespaceDecl":
			s = "declare default ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "defaultNamespaceCategory" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += " namespace ";
			i = 0;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + Fleur.Serializer.XQX_quote(node.children[i].textContent);
				}
				i++;
			}
			return s;
		case "boundarySpaceDecl":
			return "declare boundary-space " + node.textContent;
		case "defaultCollationDecl":
			return "declare default collation " + Fleur.Serializer.XQX_quote(node.textContent);
		case "baseUriDecl":
			return "declare base-uri " + Fleur.Serializer.XQX_quote(node.textContent);
		case "constructionDecl":
			return "declare construction " + node.textContent;
		case "orderingModeDecl":
			return "declare ordering " + node.textContent;
		case "emptyOrderingDecl":
			return "declare default order " + node.textContent;
		case "copyNamespacesDecl":
		case "optionDecl":
			s = "declare option " + Fleur.Serializer.XQX_renderChildren(node, ["optionName"]) + " ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "optionContents" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s;
		case "decimalFormatDecl":
		case "decimalFormatParam":
			s = Fleur.Serializer.XQX_renderChildren(node, ["decimalFormatParamName"]) + " = ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "decimalFormatParamValue" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s + " ";
		case "voidSequenceType":
			return "empty-sequence()";
		case "occurrenceIndicator":
			return node.textContent;
		case "anyItemType":
			return "item()";
		case "sequenceType":
			return Fleur.Serializer.XQX_renderChildren(node);
		case "sequenceTypeUnion":
		case "singleType":
		case "typeDeclaration":
		case "contextItemType":
			return " as " + Fleur.Serializer.XQX_renderChildren(node);
		case "contextItemDecl":
		case "annotation":
		case "varDecl":
		case "targetLocation":
		case "schemaImport":
		case "moduleImport":
		case "javascriptImport":
		case "param":
			return "$" + Fleur.Serializer.XQX_renderChildren(node, ["varName"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
		case "paramList":
			return Fleur.Serializer.XQX_parenthesizedList(node);
		case "functionBody":
			return "\n{\n" + Fleur.Serializer.XQX_renderChildren(node) + "\n}";
		case "functionDecl":
			s = "declare" + Fleur.Serializer.XQX_renderChildren(node, ["annotation"]) + " function " + Fleur.Serializer.XQX_renderChildren(node, ["functionName"]) + Fleur.Serializer.XQX_renderChildren(node, ["paramList"]) + Fleur.Serializer.XQX_renderChildren(node, ["typeDeclaration"]);
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "externalDefinition" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					return s + " external ";
				}
				i++;
			}
			return s + Fleur.Serializer.XQX_renderChildren(node, ["functionBody"]);
		case "queryBody":
			return Fleur.Serializer.XQX_renderChildren(node) + "\n";
		case "moduleDecl":
			s = " module namespace ";
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "prefix" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += node.children[i].textContent;
					break;
				}
				i++;
			}
			s += "=";
			i = 0;
			l = node.children.length;
			while (i < l) {
				if (node.children[i].localName === "uri" && node.children[i].namespaceURI === "http://www.w3.org/2005/XQueryX") {
					s += Fleur.Serializer.XQX_quote(node.children[i].textContent);
					break;
				}
				i++;
			}
			return s + ";\n";
		case "prolog":
			s = "";
			l = node.children.length;
			while (i < l) {
				s += Fleur.Serializer._serializeXQXToString(node.children[i]) + ";\n";
				i++;
			}
			return s + ";\n";
		case "libraryModule":
			return Fleur.Serializer.XQX_renderChildren(node, ["moduleDecl"]) + Fleur.Serializer.XQX_renderChildren(node, ["prolog"]);
		case "mainModule":
			return Fleur.Serializer.XQX_renderChildren(node, ["prolog"]) + Fleur.Serializer.XQX_renderChildren(node, ["queryBody"]);
		case "module":
			return Fleur.Serializer.XQX_renderChildren(node);
	}
};
Fleur.Serializer.xhtml2html5 = function(s, jspath, csspath) {
	var ii, ll, text, index, offset = 0, end = s.length,
		nodename, attrs, parents = [], c,
		seps_pi = " \t\n\r?", seps_dtd = " \t\n\r[>", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r",
		n, newnamespaces = {}, pindex, prefix, dtdtype, dtdpublicid, dtdsystemid, entityvalue, notationvalue, uri;
	var r0 = "", r = "", rmodel = "", rsave = "", roptions = "";
	var xformsinside = false;
	var xmlser = false;
	var lt = "<";
	var gt = ">";
	var amp = "&";
	var xsltformscssfile = "<link type=\"text/css\" href=\"" + csspath + "\" rel=\"stylesheet\">";
	var xsltformsjsfile = "<script type=\"text/javascript\" src=\"" + jspath + "\" data-uri=\"http://www.agencexml.com/xsltforms\"></script>";
	var emptyelts = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
	var tableelts = ["thead", "tbody", "tfoot"];
	var tableeltpos;
	var tablerepeat;
	var xlinkattrs = ["actuate", "arcrole", "href", "role", "show", "title", "type"];
	var xmlattrs = ["base", "lang", "space"];
	var xmlnsattrs = ["xlink"];
	var htmluri = "http://www.w3.org/1999/xhtml";
	var mathmluri = "http://www.w3.org/1998/Math/MathML";
	var svguri = "http://www.w3.org/2000/svg";
	var xlinkuri = "http://www.w3.org/1999/xlink";
	var xmluri = "http://www.w3.org/XML/1998/namespace";
	var xmlnsuri = "http://www.w3.org/2000/xmlns/";
	var xformsuri = "http://www.w3.org/2002/xforms";
	var eventuri = "http://www.w3.org/2001/xml-events";
	var xsuri = "http://www.w3.org/2001/XMLSchema";
	var avt;
	var nsi;
	var namespaces = [
		{ prefix: "xml", namespaceURI: xmluri, htmlimplicit: true, xmlimplicit: true },
		{ prefix: "xmlns", namespaceURI: xmlnsuri, htmlimplicit: true, xmlimplicit: true },
		{ prefix: "", namespaceURI: htmluri, htmlimplicit: true, xmlimplicit: false },
		{ prefix: "xlink", namespaceURI: xlinkuri, htmlimplicit: false, xmlimplicit: false }
	];
	var nsLookupFirstpos = 0;
	var nsLookupLastpos = 3;
	var attr;
	var nsattr;
	while (offset !== end) {
		text = "";
		c = s.charAt(offset);
		while (c !== "<" && offset !== end) {
			if (c === ">") {
				text += gt;
			} else if (c === "&") {
				text += amp;
			} else if (r !== "" || r0 !== "" || (c !== "\r" && c !== "\n" && c !== "\t" && c !== " ")) {
				text += c;
			}
			c = s.charAt(++offset);
		}
		if (text !== "") {
			r += text;
		}
		if (offset === end) {
			break;
		}
		offset++;
		if (s.charAt(offset) === "!") {
			offset++;
			if (s.substr(offset, 2) === "--") {
				offset += 2;
				index = s.indexOf("-->", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm, lt);
					r += lt + "!--" + text + "--" + gt;
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "[CDATA[") {
				offset += 7;
				index = s.indexOf("]]>", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					r += lt + "[CDATA[" + text + "]]" + gt;
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "DOCTYPE") {
				offset += 7;
				index = s.indexOf(">", offset);
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				nodename = "";
				while (seps_dtd.indexOf(c) === -1) {
					nodename += c;
					c = s.charAt(offset++);
				}
				while (seps.indexOf(c) !== -1) {
					c = s.charAt(offset++);
				}
				dtdtype = "";
				while (seps_dtd.indexOf(c) === -1) {
					dtdtype += c;
					c = s.charAt(offset++);
				}
				if (dtdtype === "PUBLIC" || dtdtype === "SYSTEM") {
					if (dtdtype === "PUBLIC") {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						dtdpublicid = "";
						ii = offset;
						ll = Math.min(index - 1, s.indexOf(c, offset));
						while (ii < ll) {
							dtdpublicid += s.charAt(ii++);
						}
						offset += dtdpublicid.length + 1;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					dtdsystemid = "";
					ii = offset;
					ll = Math.min(index - 1, s.indexOf(c, offset));
					while (ii < ll) {
						dtdsystemid += s.charAt(ii++);
					}
					offset += dtdsystemid.length + 1;
					c = s.charAt(offset++);
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
				} else {
					dtdpublicid = dtdsystemid = null;
				}
				if (c === "[") {
					index = s.indexOf("]", offset);
					c = s.charAt(offset++);
					while (c !== "]" && offset < end) {
						while (seps.indexOf(c) !== -1) {
							c = s.charAt(offset++);
						}
						if (c === "]") {
							break;
						}
						if (s.substr(offset, 7) === "!ENTITY") {
							offset += 7;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (c === "%") {
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							entityvalue = "";
							ii = offset;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (ii < ll) {
								entityvalue += s.charAt(ii++);
							}
							offset += entityvalue.length + 1;
							c = s.charAt(offset++);
						} else if (s.substr(offset, 9) === "!NOTATION") {
							offset += 9;
							c = s.charAt(offset++);
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							nodename = "";
							while (seps_dtd.indexOf(c) === -1) {
								nodename += c;
								c = s.charAt(offset++);
							}
							while (seps.indexOf(c) !== -1) {
								c = s.charAt(offset++);
							}
							if (s.substr(offset - 1, 6) === "SYSTEM") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							} else if (s.substr(offset -1, 6) === "PUBLIC") {
								offset += 5;
								c = s.charAt(offset++);
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
								while (seps_dtd.indexOf(c) === -1) {
									c = s.charAt(offset++);
								}
								while (seps.indexOf(c) !== -1) {
									c = s.charAt(offset++);
								}
							}
							if (c === '"' || c === "'") {
								notationvalue = "";
								ii = offset;
								ll = Math.min(index - 1, s.indexOf(c, offset));
								while (ii < ll) {
									notationvalue += s.charAt(ii++);
								}
								offset += notationvalue.length + 1;
								c = s.charAt(offset++);
							}
						}
						offset = s.indexOf(">", offset - 1) + 1;
						c = s.charAt(offset++);
					}
					index = s.indexOf(">", offset);
				}
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset++;
			}
		} else if (s.charAt(offset) === "?") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_pi.indexOf(c) === -1) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf("?>", offset - 1);
			if (index === -1) {
				index = end;
			}
			if (nodename === "xml") {
				if (s.charCodeAt(index + 2) === 13) {
					index++;
				}
				if (s.charCodeAt(index + 2) === 10) {
					index++;
				}
			} else if (nodename !== "") {
				text = "";
				ii = offset;
				while (ii < index) {
					text += s.charAt(ii++);
				}
				text = text.replace(/\x01/gm,"<");
				if (nodename === "xsltforms-options") {
					roptions += " " + text;
				} else if (nodename !== "xml-stylesheet") {
					r += lt + "?" + nodename + " " + (index === offset - 1 ? "" : text) + "?" + gt;
				}
			}
			if (index === end) {
				break;
			}
			offset = index + 2;
		} else if (s.charAt(offset) === "/") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_close.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			n = parents.pop();
			nsLookupFirstpos = n.nsLookupFirstpos;
			nsLookupLastpos = n.nsLookupLastpos;
			if (nodename !== n.nodeName) {
				return "Malformed XHTML";
			}
			if (n.localName === "instance" && n.namespaceURI === xformsuri) {
				r += "</script>";
				xmlser = false;
				lt = "<";
				gt = ">";
				amp = "&";
				nsLookupFirstpos = 0;
			} else if (n.localName === "head" && n.namespaceURI === htmluri) {
				r += xsltformsjsfile;
			}
			if (n.namespaceURI !== xformsuri || n.localName !== "repeat" || parents[parents.length - 1].namespaceURI !== htmluri ||!tableelts.includes(parents[parents.length - 1].localName)) { 
				r += lt + "/" + (xmlser ? n.nodeName : (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName) + gt;
				if (xmlser && n.namespaceURI === xsuri && n.localName === "schema") {
					r += "</script>";
					xmlser = false;
					lt = "<";
					gt = ">";
					amp = "&";
					nsLookupFirstpos = 0;
				}
				if (n.localName === "model" && n.namespaceURI === xformsuri) {
					rmodel = r;
					r = rsave;
				}
			}
			offset = s.indexOf(">", offset - 1) + 1;
			if (offset === 0) {
				break;
			}
		} else {
			c = s.charAt(offset++);
			n = {};
			n.nsLookupFirstpos = nsLookupFirstpos;
			n.nsLookupLastpos = nsLookupLastpos;
			n.nodeName = "";
			while (seps_elt.indexOf(c) === -1 && offset <= end) {
				n.nodeName += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf(">", offset - 1);
			if (n.nodeName !== "") {
				attrs = [];
				attr = {};
				while (offset <= end) {
					while (seps.indexOf(c) !== -1) {
						c = s.charAt(offset++);
					}
					if (c === "/" || c === ">" || offset === end) {
						break;
					}
					attr.nodeName = "";
					while (seps_attr.indexOf(c) === -1 && offset <= end) {
						attr.nodeName += c;
						c = s.charAt(offset++);
					}
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "=") {
						c = s.charAt(offset++);
						while (seps.indexOf(c) !== -1 && offset <= end) {
							c = s.charAt(offset++);
						}
						attr.nodeValue = "";
						if (c === "'" || c === "\"") {
							attr.nodeValueDelim = c;
							ll = Math.min(index - 1, s.indexOf(c, offset));
							while (offset < ll) {
								attr.nodeValue += s.charAt(offset++);
							}
							offset++;
							c = s.charAt(offset++);
						} else {
							return "Malformed XHTML";
						}
					} else {
						return "Malformed XHTML";
					}
					pindex = attr.nodeName.indexOf(":");
					attr.prefix = pindex !== -1 ? attr.nodeName.substr(0, pindex) : "";
					attr.localName = pindex !== -1 ? attr.nodeName.substr(pindex + 1) : attr.nodeName;
					attrs.push(attr);
					attr = {};
				}
				pindex = n.nodeName.indexOf(":");
				n.prefix = pindex !== -1 ? n.nodeName.substr(0, pindex) : "";
				n.localName = pindex !== -1 ? n.nodeName.substr(pindex + 1) : n.nodeName;
				avt = false;
				var nextFirstpos = nsLookupLastpos + 1;
				for (var i = 0, l = attrs.length; i < l; i++) {
					attr = attrs[i];
					if (attr.nodeName === "xmlns") {
						namespaces[++nsLookupLastpos] = {prefix: "", namespaceURI: attr.nodeValue, htmlimplicit: false, xmlimplicit: false};
					} else if (attr.prefix === "xmlns") {
						namespaces[++nsLookupLastpos] = {prefix: attr.localName, namespaceURI: attr.nodeValue, htmlimplicit: false, xmlimplicit: false};
					}
				}
				nsi = nsLookupLastpos;
				while (nsi >= 0 && n.prefix !== namespaces[nsi].prefix) {
					nsi--;
				}
				if (nsi < 0) {
					return "Malformed XHTML";
				}
				n.namespaceURI = namespaces[nsi].namespaceURI;
				if (n.namespaceURI === xformsuri) {
					xformsinside = true;
				}
				if (n.localName === "model" && n.namespaceURI === xformsuri) {
					rsave = r;
					r = rmodel;
				}
				tablerepeat = n.namespaceURI === xformsuri && n.localName === "repeat" && tableelts.includes(parents[parents.length - 1].localName);
				if (tablerepeat) {
					r = r.substr(0, tableeltpos);
				} else {
					if (!xmlser && n.namespaceURI === xsuri) {
						r += "<script type=\"application/xml\">";
						xmlser = true;
						lt = "&lt;";
						gt = "&gt;";
						amp = "&amp;";
						nsLookupFirstpos = nextFirstpos;
					}
					r += lt + (xmlser ? n.nodeName : (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName);
				}
				if (!namespaces[nsi][xmlser ? "xmlimplicit" : "htmlimplicit"] && nsi < nsLookupFirstpos) {
					nsattr = {};
					nsattr.localName = namespaces[nsi].prefix;
					nsattr.prefix = "xmlns";
					nsattr.nodeName = nsattr.prefix + ":" + nsattr.localName;
					nsattr.namespaceURI = xmlnsuri;
					nsattr.nodeValueDelim = "\"";
					nsattr.nodeValue = namespaces[nsi].namespaceURI;
					attrs.push(nsattr);
				}
				for (var i = 0, l = attrs.length; i < l; i++) {
					attr = attrs[i];
					if (attr.prefix !== "") {
						nsi = nsLookupLastpos;
						while (nsi >= 0 && attr.prefix !== namespaces[nsi].prefix) {
							nsi--;
						}
						if (nsi < 0) {
							return "Malformed XHTML";
						}
						attrs[i].namespaceURI = namespaces[nsi].namespaceURI;
						if (!namespaces[nsi][xmlser ? "xmlimplicit" : "htmlimplicit"] && nsi < nsLookupFirstpos) {
							nsattr = {};
							nsattr.localName = namespaces[nsi].prefix;
							nsattr.prefix = "xmlns";
							nsattr.nodeName = nsattr.prefix + ":" + nsattr.localName;
							nsattr.namespaceURI = xmlnsuri;
							nsattr.nodeValueDelim = "\"";
							nsattr.nodeValue = namespaces[nsi].namespaceURI;
							attrs.push(nsattr);
						}
					}
				}
				for (var i = 0, l = attrs.length; i < l; i++) {
					attr = attrs[i];
					if (xmlser || attr.localName !== "xmlns") {
						if (xmlser) {
							r += " " + (attr.prefix !== "" ? attr.prefix + ":" : "") + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
						} else if (n.localName === "html" && n.namespaceURI === htmluri && attr.prefix === "xmlns") {
							r += " xmlns-" + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
						} else if (attr.namespaceURI === xmlnsuri) {
							if (xmlnsattrs.includes(attr.localName) && attr.nodeValue === xlinkuri) {
								r += " xmlns:link=\"" + xlinkuri + "\"";
							}
						} else {
							if (attr.nodeValue.indexOf("{") !== -1) {
								if (!avt) {
									r += " xf-avt";
									avt = true;
								}
								r += " xf-template-" + attr.localName + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
							} else {
								r += " " + (attr.namespaceURI === eventuri ? "ev-" : n.namespaceURI === xformsuri && attr.localName !== "id" && attr.localName !== "style" && attr.localName !== "class" ? "xf-" + (tablerepeat ? "repeat-" : "") : "") + (n.namespaceURI === xformsuri && attr.localName === "nodeset" ? "ref" : attr.localName) + "=" + attr.nodeValueDelim + attr.nodeValue + attr.nodeValueDelim;
							}
						}
					}
				}
				if (s.charAt(offset - 1) !== "/") {
					if (tableelts.includes(n.localName) && n.namespaceURI === htmluri) {
						tableeltpos = r.length;
					}
					r += gt;
					if (n.localName === "html" && n.namespaceURI === htmluri) {
						r += "\n<!--HTML elements generated by XSLTForms 1.5beta (655) - Copyright (C) 2020 <agenceXML> - Alain Couthures - http://www.agencexml.com-->\n";
					} else if (n.localName === "head" && n.namespaceURI === htmluri) {
						r0 = r;
						r = "";
					} else if (n.localName === "body" && n.namespaceURI === htmluri) {
						if (roptions !== "") {
							r += "<xforms-options" + roptions + "/>";
						}
						r += rmodel;
					} else if (n.localName === "instance" && n.namespaceURI === xformsuri) {
						var mediatype = "application/xml";
						for (var i = 0, l = attrs.length; i < l; i++) {
							attr = attrs[i];
							if (attr.nodeName === "mediatype") {
								mediatype = attr.nodeValue;
								break;
							}
						}
						r += lt + "script type=\"" + mediatype + "\"" + gt;
						xmlser = true;
						lt = "&lt;";
						gt = "&gt;";
						amp = "&amp;";
						nsLookupFirstpos = nsLookupLastpos + 1;
					}
					parents.push(n);
					for (prefix in newnamespaces) {
						if (newnamespaces.hasOwnProperty(prefix)) {
							namespaces[prefix] = newnamespaces[prefix];
						}
					}
				} else if (!xmlser && emptyelts.includes(n.localName)) {
					r += gt;
				} else {
					if (!xmlser && n.localName === "head" && n.namespaceURI === htmluri) {
						r0 = r + gt;
						r = lt + "/head" + gt;
					}
					if (xmlser) {
						r += "/" + gt;
					} else {
						r += gt + lt + "/" + (n.namespaceURI === xformsuri ? "xforms-" : "") + n.localName + gt;
					}
				}
			}
			offset = index + 1;
			if (offset === 0) {
				break;
			}
		}
	}
	return "<!DOCTYPE html>\r\n" + r0 + (xformsinside ? xsltformscssfile : "") + r;
};
Fleur.Serializer.prototype.serializeToString = function(node, mediatype, indent) {
	var media = mediatype.split(";"), config = {}, param, paramreg = /^\s*(\S*)\s*=\s*(\S*)\s*$/, i = 1, l = media.length, handler, mime;
	while (i < l) {
		param = paramreg.exec(media[i]);
		config[param[1]] = param[2];
		i++;
	}
	mime = media[0].replace(/^\s+|\s+$/gm,'');
	if (mime.endsWith("+xml") && mime !== "application/exml+xml") {
		mime = "application/xml";
	}
	handler = Fleur.Serializer.Handlers[mime];
	if (!handler) {
		return "";
	}
	return handler(node, indent, config);
};
Fleur.Serializer.Handlers = {
	"application/xml": function(node, indent) {
		var ser = Fleur.Serializer._serializeXMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"application/exml+xml": function(node, indent) {
		var ser = Fleur.Serializer._serializeEXMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"application/xquery": function(node) {
		return Fleur.Serializer._serializeNodeToXQuery(node);
	},
	"text/csv": function(node, indent, config) {
		if (node.nodeType === Fleur.Node.SEQUENCE_NODE) {
			return Fleur.Serializer._serializeMatrixToString(node, config.header === "present", config.separator ? decodeURIComponent(config.separator) : ",");
		}
		return Fleur.Serializer._serializeCSVToString(node, config.header === "present", config.key ? parseInt(config.key, 10) : null, config.separator ? decodeURIComponent(config.separator) : ",", 0);
	},
	"text/plain": function(node) {
		return node.textContent;
	},
	"application/json": function(node, indent) {
		var ser = Fleur.Serializer._serializeJSONToString(node, indent, "", false, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	},
	"text/html": function(node, indent) {
		var ser = Fleur.Serializer._serializeHTMLToString(node, indent, "");
		if (indent && ser.charAt(ser.length - 1) === "\n") {
			ser = ser.substr(0, ser.length - 1);
		}
		return ser;
	}
};
Fleur.Serializer.Handlers["text/xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["application/xquery+xml"] = Fleur.Serializer.Handlers["application/xml"];
Fleur.Serializer.Handlers["text/json"] = Fleur.Serializer.Handlers["application/json"];
Fleur.Text = function() {
	this.nodeType = Fleur.Node.TEXT_NODE;
	this.nodeName = "#text";
};
Fleur.Text.prototype = new Fleur.CharacterData();
Object.defineProperties(Fleur.Text.prototype, {
	nodeValue: {
		set: function(value) {
			this.data = value;
			this.length = value.length;
		},
		get: function() {
			return this.data;
		}
	}
});
Fleur.Text.prototype.splitText = function(offset) {
	var t;
	if (offset < 0 || this.data.length < offset) {
		throw new Fleur.DOMException(Fleur.DOMException.INDEX_SIZE_ERR);
	} 
	t = this.cloneNode(true);
	t.deleteData(0, offset);
	this.deleteData(offset, this.length - offset);
	if (this.parentNode) {
		this.parentNode.insertBefore(t, this.nextSibling);
	}
	return t;
};
Fleur.TypeInfo = function(typeNamespace, typeName, derivationMethod, derivationType) {
	this.typeNamespace = typeNamespace;
	this.typeName = typeName;
	Fleur.Types[typeNamespace][typeName] = this;
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			this.restriction = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			this.extension = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			this.union = derivationType;
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			this.list = derivationType;
			break;
	}
};
Fleur.TypeInfo.DERIVATION_RESTRICTION = 1;
Fleur.TypeInfo.DERIVATION_EXTENSION = 2;
Fleur.TypeInfo.DERIVATION_UNION = 4;
Fleur.TypeInfo.DERIVATION_LIST = 8;
Fleur.TypeInfo.prototype.canonicalize = function(s) {return s;};
Fleur.TypeInfo.prototype.isDerivedFrom = function(typeNamespaceArg, typeNameArg, derivationMethod) {
	var propname, t, typeArg = Fleur.Types[typeNamespaceArg][typeNameArg];
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			propname = "restriction";
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			propname = "extension";
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			propname = "union";
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			propname = "list";
			break;
	}
	if (this === typeArg) {
		return true;
	}
	t = this[propname];
	while (t) {
		if (t === typeArg) {
			return true;
		}
		t = t[propname];
	}
	return false;
};
Fleur.TypeInfo.prototype.getPrimitiveType = function(types, derivationMethod) {
	var propname, t, prim;
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			propname = "restriction";
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			propname = "extension";
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			propname = "union";
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			propname = "list";
			break;
	}
	if (types.indexOf(this) !== -1) {
		return this;
	}
	prim = this;
	t = this[propname];
	while (t) {
		if (types.indexOf(t) !== -1) {
			return t;
		}
		prim = t;
		t = t[propname];
	}
	return prim;
};
Fleur.TypeInfo.prototype.compareType = function(typeArg, derivationMethod) {
	var propname, t;
	switch (derivationMethod) {
		case Fleur.TypeInfo.DERIVATION_RESTRICTION:
			propname = "restriction";
			break;
		case Fleur.TypeInfo.DERIVATION_EXTENSION:
			propname = "extension";
			break;
		case Fleur.TypeInfo.DERIVATION_UNION:
			propname = "union";
			break;
		case Fleur.TypeInfo.DERIVATION_LIST:
			propname = "list";
			break;
	}
	var arr = [this];
	t = this[propname];
	while (t) {
		if (t === typeArg) {
			return typeArg;
		}
		arr.push(t);
		t = t[propname];
	}
	t = typeArg;
	while (t) {
		if (arr.indexOf(t) !== -1) {
			return t;
		}
		t = t[propname];
	}
	return null;
};
Fleur.Types = {};
Fleur.Types["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.Types_XMLSchema = Fleur.Types["http://www.w3.org/2001/XMLSchema"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "error");
Fleur.Type_error = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["error"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "untypedAtomic");
Fleur.Type_untypedAtomic = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["untypedAtomic"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anySimpleType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyAtomicType");
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "string");
Fleur.Type_string = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["string"];
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "boolean");
Fleur.Type_boolean = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["boolean"];
Fleur.Type_boolean.canonicalize = function(s) {
	if (/^\s*(true|false|0|1)\s*$/.test(s)) {
		s = s.trim();
		if (s === "0") {
			return "false";
		}
		if (s === "1") {
			return "true";
		}
		return s;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "decimal");
Fleur.Type_decimal = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["decimal"];
Fleur.Type_decimal.canonicalize = function(s) {
	if (/^\s*[\-+]?([0-9]+(\.[0-9]*)?|[\-+]?\.[0-9]+)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		var dec = "";
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		} else if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		if (c === ".") {
			i++;
			c = s.charAt(i);
			dec = ret === "-" || ret === "" ? "0." : ".";
		}
		while (c >= "0" && c <= "9") {
			if (c === "0") {
				dec += c;
			} else {
				ret += dec + c;
				dec = "";
			}
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "float");
Fleur.Type_float = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["float"];
Fleur.Type_float.canonicalize = function(s) {
	if (/^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|[\-+]?(\.[0-9]+))([eE][\-+]?[0-9]+)?|[\-+]?INF|NaN)\s*$/.test(s)) {
		s = s.trim();
		if (s === "+INF") {
			s = "INF";
		}
		if (s !== "INF" && s !== "-INF" && s !== "NaN") {
			var value = parseFloat(s);
			if (value === Infinity) {
				return "INF";
			}
			if (value === -Infinity) {
				return "-INF";
			}
			if (1 / value === -Infinity) {
				return "-0";
			}
			var absvalue = Math.abs(value);
			if (absvalue < 0.000001 || absvalue >= 1000000) {
				var ret;
				if (absvalue >= 1000000 && absvalue < 1e+21) {
					value *= 1e+15;
					ret = String(value).split("e");
					ret = ret[0] + "E" + String(parseInt(ret[1], 10) - 15);
				} else {
					ret = String(value).replace("e+", "E").replace("e", "E");
				}
				if (ret.indexOf(".") === -1 && ret.indexOf("E") !== -1) {
					ret = ret.split("E");
					return ret[0] + ".0E" + ret[1];
				}
				return ret;
			}
			return String(value);
		}
		return s;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "double");
Fleur.Type_double = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["double"];
Fleur.Type_double.canonicalize = Fleur.Type_float.canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "duration");
Fleur.Type_duration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["duration"];
Fleur.Type_duration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?\s*$/.test(s)) {
		var dur = Fleur.toJSONDuration(s);
		if (!dur.year && !dur.month && !dur.hour && !dur.minute && !dur.second) {
			return "PT0S";
		}
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTime");
Fleur.Type_dateTime = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTime"];
Fleur.Type_dateTime.canonicalize = function(s) {
	if (/^\s*([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		s = s.trim();
		return Fleur.dateToDateTime(Fleur.toDateTime(s));
	}
	if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "time");
Fleur.Type_time = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["time"];
Fleur.Type_time.canonicalize = function(s) {
	if (/^\s*(([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T)?(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?)(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		s = s.trim();
		if (s.startsWith("24")) {
			s = "00" + s.substr(2);
		}
		return Fleur.dateToTime(Fleur.toTime(s));
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "date");
Fleur.Type_date = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["date"];
Fleur.Type_date.canonicalize = function(s) {
	if (/^\s*([0-9]{4})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		return Fleur.dateToDate(Fleur.toDate(s.trim()));
	}
	if (/^\s*-?[0-9]+-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])(T(24:00:00(\.0+)?|([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?))?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])?\s*$/.test(s)) {
		throw new Fleur.DOMException(Fleur.DOMException.NOT_SUPPORTED_ERR);
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYearMonth");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYearMonth"].canonicalize = function(s) {
	if (/^\s*([0-9]{4})-(0[1-9]|1[012])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gYear");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYear"].canonicalize = function(s) {
	if (/^\s*([\-+]?([0-9]{4}|[1-9][0-9]{4,}))?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonthDay");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonthDay"].canonicalize = function(s) {
	if (/^\s*--(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gDay");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gDay"].canonicalize = function(s) {
	if (/^\s*---(0[1-9]|[12][0-9]|3[01])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "gMonth");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonth"].canonicalize = function(s) {
	if (/^\s*--(0[1-9]|1[012])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "hexBinary");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["hexBinary"].canonicalize = function(s) {
	if (/^\s*([0-9A-Fa-f]{2})+\s*$/.test(s)) {
		return s.trim().toUpperCase();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "base64Binary");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["base64Binary"].canonicalize = function(s) {
	if (/^\s*(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "anyURI");
Fleur.Type_anyURI = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"];
Fleur.Type_anyURI.canonicalize = function(s) {
	if (/^\s*((([^ :\/?#]+):\/\/)?[^ \/\?#]+([^ \?#]*)(\?([^ #]*))?(#([^ \:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "QName");
Fleur.Type_QName = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["QName"];
Fleur.Type_QName.canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\:[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)?\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "normalizedString", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["normalizedString"].canonicalize = function(s) {
	return s.replace(/[\t\r\n]/g, " ");
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "token", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].normalizedString);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["token"].canonicalize = function(s) {
	return s.trim().replace(/\s+/g, " ");
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NOTATION");
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NOTATION"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["token"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "language", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["language"].canonicalize = function(s) {
	if (/^\s*[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKEN", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKEN"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NMTOKENS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NMTOKEN);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKENS"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+(\s+[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]+)*\s*$/.test(s)) {
		return s.trim().replace(/\s+/g, " ");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "Name", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].token);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["Name"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\:\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "NCName", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].Name);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ID", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ID"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREF", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREF"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "IDREFS", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREF);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREFS"].canonicalize = function(s) {
	if (/^\s*[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*(\s+[A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF][A-Za-z_\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF\\-\\.0-9\\xB7]*)*\s*$/.test(s)) {
		return s.trim().replace(/\s+/g, " ");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITY", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].NCName);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITY"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "ENTITIES", Fleur.TypeInfo.DERIVATION_LIST, Fleur.Types["http://www.w3.org/2001/XMLSchema"].IDREFS);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITIES"].canonicalize = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREFS"].canonicalize;
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].decimal);
Fleur.Type_integer = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["integer"];
Fleur.Type_integer.canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		} else if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonPositiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonPositiveInteger"].canonicalize = function(s) {
	if (/^\s*(-[0-9]+|0)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "-") {
			ret = "-";
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "-" || ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "negativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonPositiveInteger);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["negativeInteger"].canonicalize = function(s) {
	if (/^\s*-0*[1-9][0-9]*\s*$/.test(s)) {
		s = s.trim();
		var ret = "-";
		var i = 1;
		var c = s.charAt(i);
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "long", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["long"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = Fleur.BigInt(s);
		if (value >= Fleur.BigInt("-9223372036854775808") && value <= Fleur.BigInt("9223372036854775807")) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "int", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].long);
Fleur.Type_int = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["int"];
Fleur.Type_int.canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -2147483648 && value <= 2147483647) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "short", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].int);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["short"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -32768 && value <= 32767) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "byte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].short);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["byte"].canonicalize = function(s) {
	if (/^\s*[\-+]?[0-9]+\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value >= -128 && value <= 127) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "nonNegativeInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].integer);
Fleur.Type_nonNegativeInteger = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"];
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "+" || c === "-") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedLong", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedLong"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = Fleur.BigInt(s);
		if (value <= Fleur.BigInt("18446744073709551615")) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedInt", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedLong);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedInt"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 4294967295) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedShort", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedInt);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedShort"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 65535) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "unsignedByte", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedByte"].canonicalize = function(s) {
	if (/^\s*(\+?[0-9]+|-0+)\s*$/.test(s)) {
		s = s.trim();
		var value = parseInt(s, 10);
		if (value <= 255) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "positiveInteger", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].nonNegativeInteger);
Fleur.Type_positiveInteger = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["positiveInteger"];
Fleur.Type_positiveInteger.canonicalize = function(s) {
	if (/^\s*\+?0*[1-9][0-9]*\s*$/.test(s)) {
		s = s.trim();
		var ret = "";
		var i = 0;
		var c = s.charAt(i);
		if (c === "+") {
			i++;
			c = s.charAt(i);
		}
		while (c === "0") {
			i++;
			c = s.charAt(i);
		}
		while (c >= "0" && c <= "9") {
			ret += c;
			i++;
			c = s.charAt(i);
		}
		return ret === "" ? "0" : ret;
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
Fleur.Type_yearMonthDuration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["yearMonthDuration"];
Fleur.Type_yearMonthDuration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+Y)?([0-9]+M)?\s*$/.test(s)) {
		var res = Fleur.toJSONYearMonthDuration(s.trim());
		return (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 ? String(res.month) + "M" : (res.year === 0 ? "T0S": ""));
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].duration);
Fleur.Type_dayTimeDuration = Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dayTimeDuration"];
Fleur.Type_dayTimeDuration.canonicalize = function(s) {
	if (/^\s*-?P(?!$)([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\.[0-9]+)?S)?)?\s*$/.test(s)) {
		var res = Fleur.toJSONDayTimeDuration(s.trim());
		return (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || (res.day + res.hour + res.minute + res.second) === 0 ? String(res.second) + "S" : "");
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("http://www.w3.org/2001/XMLSchema", "dateTimeStamp", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].dateTime);
Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTimeStamp"].canonicalize = function(s) {
	if (/^\s*([012][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?(Z|[+\-]([01][0-9]|2[0-3]):[0-5][0-9])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
Fleur.Types["http://www.agencexml.com/fleur"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "regex", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_regex = Fleur.Types["http://www.agencexml.com/fleur"]["regex"];
new Fleur.TypeInfo("http://www.agencexml.com/fleur", "handler");
Fleur.Type_handler = Fleur.Types["http://www.agencexml.com/fleur"]["handler"];
Fleur.Types["https://tools.ietf.org/rfc/index"] = {};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "ipv4", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_ipv4 = Fleur.Types["https://tools.ietf.org/rfc/index"]["ipv4"];
Fleur.Type_ipv4.canonicalize = function(s) {
	if (/^\s*((1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5]).){3}(1?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*$/.test(s)) {
		return s.trim();
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "mac", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_mac = Fleur.Types["https://tools.ietf.org/rfc/index"]["mac"];
new Fleur.TypeInfo("https://tools.ietf.org/rfc/index", "port", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Types["http://www.w3.org/2001/XMLSchema"].unsignedShort);
Fleur.Type_port = Fleur.Types["https://tools.ietf.org/rfc/index"]["port"];
Fleur.Type_port.canonicalize = function(s) {
	if (/^\s*[0-9]+\s*$/.test(s)) {
		var value = parseInt(s.trim(), 10);
		if (value <= 65535) {
			return String(value);
		}
	}
	throw new Fleur.DOMException(Fleur.DOMException.VALIDATION_ERR);
};
Fleur.Types["http://www.agencexml.com/fleur/unit"] = {};
new Fleur.TypeInfo("http://www.agencexml.com/fleur/unit", "information", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_unit_information = Fleur.Types["http://www.agencexml.com/fleur/unit"]["information"];
Fleur.Type_unit_information.canonicalize = function(s) {
	return s;
};
Fleur.Types["http://www.w3.org/2005/xquery"] = {};
new Fleur.TypeInfo("http://www.w3.org/2005/xquery", "main-module", Fleur.TypeInfo.DERIVATION_RESTRICTION, Fleur.Type_string);
Fleur.Type_xquery_main_module = Fleur.Types["http://www.w3.org/2005/xquery"]["main-module"];
Fleur.Type_xquery_main_module.canonicalize = function(s) {
	Fleur.createExpression(s);
	return s;
};
Fleur.numericTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double];
Fleur.UserDataHandler = function() {};
Fleur.UserDataHandler.NODE_CLONED = 1;
Fleur.UserDataHandler.NODE_IMPORTED = 2;
Fleur.UserDataHandler.NODE_DELETED = 3;
Fleur.UserDataHandler.NODE_RENAMED = 4;
Fleur.UserDataHandler.NODE_ADOPTED = 5;
Fleur.XMLSerializer = function() {};
Fleur.XMLSerializer.prototype = new Fleur.Serializer();
Fleur.XMLSerializer.prototype.serializeToString = function(node, indent) {
	return Fleur.Serializer.prototype.serializeToString.call(this, node, "application/xml", indent);
};
Fleur.XPathFunctions = {};
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"] = {};
Fleur.XPathFunctions_array = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/array"];
Fleur.XPathFunctions["http://xqib.org"] = {};
Fleur.XPathFunctions_b = Fleur.XPathFunctions["http://xqib.org"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"] = {};
Fleur.XPathFunctions_fn = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"] = {};
Fleur.XPathFunctions_map = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/map"];
Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"] = {};
Fleur.XPathFunctions_math = Fleur.XPathFunctions["http://www.w3.org/2005/xpath-functions/math"];
Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"] = {};
Fleur.XPathFunctions_xs = Fleur.XPathFunctions["http://www.w3.org/2001/XMLSchema"];
Fleur.XPathFunctions["http://expath.org/ns/binary"] = {};
Fleur.XPathFunctions_bin = Fleur.XPathFunctions["http://expath.org/ns/binary"];
Fleur.XPathFunctions["http://expath.org/ns/file"] = {};
Fleur.XPathFunctions_file = Fleur.XPathFunctions["http://expath.org/ns/file"];
Fleur.XPathFunctions["http://expath.org/ns/http-client"] = {};
Fleur.XPathFunctions_http = Fleur.XPathFunctions["http://expath.org/ns/http-client"];
Fleur.XPathFunctions["http://exquery.org/ns/request"] = {};
Fleur.XPathFunctions_request = Fleur.XPathFunctions["http://exquery.org/ns/request"];
Fleur.XPathFunctions["http://basex.org/modules/prof"] = {};
Fleur.XPathFunctions_prof = Fleur.XPathFunctions["http://basex.org/modules/prof"];
Fleur.XPathFunctions["http://basex.org/modules/proc"] = {};
Fleur.XPathFunctions_proc = Fleur.XPathFunctions["http://basex.org/modules/proc"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"] = {};
Fleur.XPathFunctions_dgram = Fleur.XPathFunctions["http://www.agencexml.com/fleur/dgram"];
Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"] = {};
Fleur.XPathFunctions_ietf = Fleur.XPathFunctions["https://tools.ietf.org/rfc/index"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/base64"] = {};
Fleur.XPathFunctions_base64 = Fleur.XPathFunctions["http://www.agencexml.com/fleur/base64"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/internal"] = {};
Fleur.XPathFunctions_internal = Fleur.XPathFunctions["http://www.agencexml.com/fleur/internal"];
Fleur.XPathFunctions["http://schemas.openxmlformats.org/spreadsheetml/2006/main"] = {};
Fleur.XPathFunctions_excel = Fleur.XPathFunctions["http://schemas.openxmlformats.org/spreadsheetml/2006/main"];
Fleur.XPathFunctions["http://expath.org/ns/zip"] = {};
Fleur.XPathFunctions_zip = Fleur.XPathFunctions["http://expath.org/ns/zip"];
Fleur.XPathFunctions["http://www.mathunion.org/matrix"] = {};
Fleur.XPathFunctions_matrix = Fleur.XPathFunctions["http://www.mathunion.org/matrix"];
Fleur.XPathFunctions["http://www.agencexml.com/fleur/unit"] = {};
Fleur.XPathFunctions_unit = Fleur.XPathFunctions["http://www.agencexml.com/fleur/unit"];
Fleur.XPathFunctions["http://www.w3.org/2005/xquery"] = {};
Fleur.XPathFunctions_xquery = Fleur.XPathFunctions["http://www.w3.org/2005/xquery"];
Fleur.canonize = {};
Fleur.XPathFunctions_array["append"] = function(ctx, children) {};
Fleur.XPathFunctions_array["filter"] = function(ctx, children) {};
Fleur.XPathFunctions_array["flatten"] = function(ctx, children) {};
Fleur.XPathFunctions_array["fold-left"] = function(ctx, children) {};
Fleur.XPathFunctions_array["fold-right"] = function(ctx, children) {};
Fleur.XPathFunctions_array["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_array["for-each-pair"] = function(ctx, children) {};
Fleur.XPathFunctions_array["get"] = function(ctx, children) {};
Fleur.XPathFunctions_array["head"] = function(ctx, children) {};
Fleur.XPathFunctions_array["insert-before"] = function(ctx, children) {};
Fleur.XPathFunctions_array["join"] = function(ctx, children) {};
Fleur.XPathFunctions_array["remove"] = function(ctx, children) {};
Fleur.XPathFunctions_array["reverse"] = function(ctx, children) {};
Fleur.XPathFunctions_array["size"] = function(ctx, children) {};
Fleur.XPathFunctions_array["sort"] = function(ctx, children) {};
Fleur.XPathFunctions_array["subarray"] = function(ctx, children) {};
Fleur.XPathFunctions_array["tail"] = function(ctx, children) {};
Fleur.XPathFunctions_b["addEventListener#3"] = new Fleur.Function("http://xqib.org", "b:addEventListener",
	function(htmlelt, eventname, handler, ctx) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.addEventListener(eventname, function(evt) {
			var newctx = {
				_curr: null,
				env: {}
			};
			newctx.env.varresolver = new Fleur.varMgr([], ctx.env.varresolver);
			newctx.env.nsresolver = ctx.env.nsresolver;
			newctx.env.varresolver.set(ctx, "", handler.argtypes[0].name, evt.target);
			var evtelt = new Fleur.Element();
			evtelt.nodeName = "event";
			evtelt.namespaceURI = null;
			evtelt.localName = "event";
			evtelt.prefix = null;
			evtelt.childNodes = new Fleur.NodeList();
			evtelt.children = new Fleur.NodeList();
			evtelt.textContent = "";
			["screenX", "screenY", "clientX", "clientY", "button", "key", "ctrlKey", "shiftKey", "altKey", "metaKey"].forEach(function(p) {
				var prop;
				if (evt[p] !== null && evt[p] !== undefined) {
					prop = new Fleur.Element();
					prop.nodeName = p;
					prop.namespaceURI = null;
					prop.localName = p;
					prop.prefix = null;
					prop.childNodes = new Fleur.NodeList();
					prop.children = new Fleur.NodeList();
					prop.textContent = String(evt[p]);
					evtelt.appendChild(prop);
				}
			});
			newctx.env.varresolver.set(ctx, "", handler.argtypes[1].name, evtelt);
			newctx.evt = evt;
			Fleur.XQueryEngine[handler.xqxfunc[0]](newctx, handler.xqxfunc[1], function() {});
			return false;
		}, false);
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node}], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["alert#1"] = new Fleur.Function("http://xqib.org", "b:alert",
	function(s) {
		alert(s);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["dom#0"] = new Fleur.Function("http://xqib.org", "b:dom",
	function() {
		return document;
	},
	null, [], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_b["getProperty#2"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(htmlelt, propertyname) {
		if (!htmlelt) {
			return null;
		}
		return String(htmlelt[propertyname]);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["getProperty#1"] = new Fleur.Function("http://xqib.org", "b:getProperty",
	function(propertyname, ctx) {
		return String(ctx._curr[propertyname]);
	},
	null, [{type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["getStyle#2"] = new Fleur.Function("http://xqib.org", "b:getStyle",
	function(htmlelt, stylepropertyname) {
		if (!htmlelt) {
			return null;
		}
		return htmlelt.style[stylepropertyname];
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_b["js-eval#1"] = new Fleur.Function("http://xqib.org", "b:js-eval",
	function(s) {
		return String((0, eval)(s));
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_b["preventDefault#0"] = new Fleur.Function("http://xqib.org", "b:preventDefault",
	function(ctx) {
		if (ctx.evt) {
			ctx.evt.preventDefault();
		}
	},
	null, [], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["setStyle#3"] = new Fleur.Function("http://xqib.org", "b:setStyle",
	function(htmlelt, stylepropertyname, stylepropertyvalue) {
		if (!htmlelt) {
			return null;
		}
		htmlelt.style[stylepropertyname] = stylepropertyvalue;
		return null;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_b["stopPropagation#0"] = new Fleur.Function("http://xqib.org", "b:stopPropagation",
	function(ctx) {
		if (ctx.evt) {
			ctx.evt.stopPropagation();
		}
	},
	null, [], true, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_base64["decode#1"] = new Fleur.Function("http://www.agencexml.com/fleur/base64", "base64:decode",
	function(a) {
		if (Fleur.inBrowser) {
			return window.atob(a);
		}
		return Buffer.from(a, 'base64').toString('ascii');
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_bin["and#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:and",
	function(a, b) {
		return a & b;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});
Fleur.XPathFunctions_bin["not#1"] = new Fleur.Function("http://expath.org/ns/binary", "bin:not",
	function(i) {
		return ~i;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});
Fleur.XPathFunctions_bin["or#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:or",
	function(a, b) {
		return a | b;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});
Fleur.XPathFunctions_bin["shift#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:shift",
	function(i, by) {
		return by > 0 ? i << by : by < 0 ? i >> by : i;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});
Fleur.XPathFunctions_bin["xor#2"] = new Fleur.Function("http://expath.org/ns/binary", "bin:xor",
	function(a, b) {
		return a ^ b;
	},
	null, [{type: Fleur.Type_nonNegativeInteger}, {type: Fleur.Type_nonNegativeInteger}], false, false, {type: Fleur.Type_nonNegativeInteger});
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
Fleur.XPathFunctions_fn["adjust-date-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-date-to-timezone",
	function(arg) {
		if (arg === null) {
			return null;
		}
		var dt = Fleur.toDate(arg);
		var jstz = dt.d.getTimezoneOffset();
		var timezone = {
			sign: jstz < 0 ? 1 : -1,
			day: 0,
			hour: Math.floor(Math.abs(jstz) / 60),
			minute: Math.abs(jstz) % 60,
			second: 0
		};
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, true, false);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}], false, false, {type: Fleur.Type_date, occurence: "?"});
Fleur.XPathFunctions_fn["adjust-date-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-date-to-timezone",
	function(arg, timezone) {
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, true, false);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_date, occurence: "?"});
Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-dateTime-to-timezone",
	function(arg) {
		if (arg === null) {
			return null;
		}
		var dt = Fleur.toDateTime(arg);
		var jstz = dt.d.getTimezoneOffset();
		var timezone = {
			sign: jstz < 0 ? 1 : -1,
			day: 0,
			hour: Math.floor(Math.abs(jstz) / 60),
			minute: Math.abs(jstz) % 60,
			second: 0
		};
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, false);
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});
Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-dateTime-to-timezone",
	function(arg, timezone, notime, nodate) {
		var dt;
		if (arg === null) {
			return null;
		}
		if (notime) {
			dt = Fleur.toDate(arg);
		} else if (nodate) {
			dt = Fleur.toTime(arg);
		} else {
			dt = Fleur.toDateTime(arg);
		}
		if (timezone) {
			if (timezone.second !== 0 || timezone.day !== 0 || timezone.hour > 14 || (timezone.hour === 14 && timezone.minute !== 0)) {
				var e = new Error("");
				e.name = "FODT0003";
				return e;
			}
			if (dt.tz !== null) {
				dt.d.setHours(dt.d.getHours() + timezone.sign * timezone.hour - Math.floor(dt.tz / 60));
				dt.d.setMinutes(dt.d.getMinutes() + timezone.sign * timezone.minute - (dt.tz % 60));
			}
			dt.tz = timezone.sign * (timezone.hour * 60 + timezone.minute);
		} else {
			dt.tz = null;
		}
		var res;
		if (notime) {
			res = Fleur.dateToDate(dt);
		} else if (nodate) {
			res = Fleur.dateToTime(dt);
		} else {
			res = Fleur.dateToDateTime(dt);
		}
		return res;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});
Fleur.XPathFunctions_fn["adjust-time-to-timezone#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-time-to-timezone",
	function(arg) {
		if (arg === null) {
			return null;
		}
		var dt = Fleur.toTime(arg);
		var jstz = dt.d.getTimezoneOffset();
		var timezone = {
			sign: jstz < 0 ? 1 : -1,
			day: 0,
			hour: Math.floor(Math.abs(jstz) / 60),
			minute: Math.abs(jstz) % 60,
			second: 0
		};
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Type_time, occurence: "?"});
Fleur.XPathFunctions_fn["adjust-time-to-timezone#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:adjust-time-to-timezone",
	function(arg, timezone) {
		return Fleur.XPathFunctions_fn["adjust-dateTime-to-timezone#2"].jsfunc(arg, timezone, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_dayTimeDuration, occurence: "?"}], false, false, {type: Fleur.Type_time, occurence: "?"});
Fleur.XPathFunctions_fn["avg#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:avg",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		if (arg[0] instanceof Array) {
			var r = arg.reduce(function(p, c) {
				var rt;
				if (c[1] === Fleur.Type_untypedAtomic) {
					c[1] = Fleur.Type_double;
				}
				if (!p[1]) {
					return c;
				}
				rt = p[1].compareType(c[1], Fleur.TypeInfo.DERIVATION_RESTRICTION);
				if (!rt) {
					if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
							rt = Fleur.Type_double;
						} else {
							rt = Fleur.Type_float;
						}
					} else {
						rt = Fleur.Type_double;
					}
				}
				if (typeof p[0] !== typeof c[0]) {
					p[0] = Number(p[0]);
					c[0] = Number(c[0]);
				}
				return [p[0] + c[0], rt];
			}, [0, null]);
			var argl = typeof r[0] === "number" ? arg.length : Fleur.BigInt(arg.length);
			var v = r[0] / argl;
			var t = r[1];
			if (t.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				if (r[0] !== v * argl) {
					v = Number(r[0]) / Number(argl);
					t = Fleur.Type_decimal;
				}
			}
			return [v, t];
		}
		if (arg[1] === Fleur.Type_untypedAtomic) {
			arg[1] = Fleur.Type_double;
		}
		return arg;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "*"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["base-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri",
	function(ctx) {
		return Fleur.XPathFunctions_fn["base-uri#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["base-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:base-uri",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		return "";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["boolean#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:boolean",
	function(arg) {
		var e;
		if (arg === Fleur.EmptySequence) {
			return false;
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (arg.childNodes.length === 0) {
				return false;
			}
			if (arg.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || arg.childNodes[0].ownerDocument) {
				return true;
			}
			e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
			e.name = "FORG0006";
			return e;
		}
		if (arg.nodeType !== Fleur.Node.TEXT_NODE) {
			return true;
		}
		if (arg.schemaTypeInfo === Fleur.Type_boolean) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo === Fleur.Type_string || arg.schemaTypeInfo === Fleur.Type_untypedAtomic || arg.schemaTypeInfo === Fleur.Type_anyURI) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo === Fleur.Type_integer || arg.schemaTypeInfo === Fleur.Type_decimal || arg.schemaTypeInfo === Fleur.Type_float || arg.schemaTypeInfo === Fleur.Type_double) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		if (arg.schemaTypeInfo && arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.data === "true";
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return arg.hasOwnProperty("data") && arg.data.length !== 0;
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN";
		}
		e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
		e.name = "FORG0006";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["ceiling#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ceiling",
	function(a) {
		return a ? [typeof a[0] === "bigint" ? a[0] : Math.ceil(a[0]), a[1]] : null;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["codepoint-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoint-equal",
	function(comparand1, comparand2) {
		return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_fn["codepoints-to-string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:codepoints-to-string",
	function(arg) {
		if (arg === null) {
			return "";
		}
		if (arg instanceof Array) {
			try {
				return arg.reduce(function(a, v) {
					if (v < 1 || v > 655535) {
						var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
						e.name = "FOCH0001";
						throw e;
					}
					return a + String.fromCodePoint(Number(v));
				}, "");
			} catch(err) {
				return err;
			}
		}
		if (arg < 1 || arg > 655535) {
			var e = new Error("codepoints-to-string(): the input contains an integer that is not the codepoint of a valid XML character");
			e.name = "FOCH0001";
			return e;
		}
		return String.fromCodePoint(Number(arg));
	},
	null, [{type: Fleur.Type_integer, occurence: "*"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["compare#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare",
	function(comparand1, comparand2) {
		return comparand1 === null || comparand2 === null ? null : comparand1 === comparand2 ? 0 : comparand1 < comparand2 ? -1 : 1;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["compare#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:compare",
	function(comparand1, comparand2, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return comparand1 === null || comparand2 === null ? null : c.equals(comparand1, comparand2) ? 0 : c.lessThan(comparand1, comparand2) ? -1 : 1;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["concat#"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat",
	function() {
		var s = "";
		var e;
		for (var i = 0, l = arguments.length; i < l; i++) {
			var n = arguments[i];
			if (n !== Fleur.EmptySequence && n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions}concat#" + String(l));
				e.name = "XPTY0004";
				return e;
			}
			if (n.nodeType === Fleur.Node.FUNCTION_NODE) {
				e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions}concat#" + String(l));
				e.name = "FOTY0013";
				return e;
			}
			var a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				return a;
			}
			s += a.data || "";
		}
		return s;
	},
	null, [], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["contains#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains",
	function(a, b) {
		return !b ? true : !a ? false : a.indexOf(b) !== -1;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["contains#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return !b ? true : !a ? false : c.contains(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["contains-token#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token",
	function(input, token) {
		return Fleur.XPathFunctions_fn["contains-token#3"].jsfunc(input, token, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["contains-token#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:contains-token",
	function(input, token, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (!input || input === "") {
			return false;
		}
		token = token.trim();
		if (token === "") {
			return false;
		}
		if (!(input instanceof Array)) {
			input = [input];
		}
		for (var i1 = 0, l1 = input.length; i1 < l1; i1++) {
			input[i1] = input[i1].split(" ");
			for (var i2 = 0, l2 = input[i1].length; i2 < l2; i2++) {
				if ( c.equals(input[i1][i2], token)) {
					return true;
				}
			}
		}
		return false;
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["count#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:count",
	function(arg) {
		return arg === Fleur.EmptySequence ? 0 : arg.nodeType === Fleur.Node.SEQUENCE_NODE ? arg.childNodes.length : 1;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["current#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current",
	function(ctx) {
		return ctx._item || ctx._curr;
	},
	null, [], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["current-date#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-date",
	function(ctx) {
		return ctx.env.now;
	},
	null, [], true, false, {type: Fleur.Type_date});
Fleur.XPathFunctions_fn["current-dateTime#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-dateTime",
	function(ctx) {
		return ctx.env.now;
	},
	null, [], true, false, {type: Fleur.Type_dateTime});
Fleur.XPathFunctions_fn["current-time#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:current-time",
	function(ctx) {
		return ctx.env.now;
	},
	null, [], true, false, {type: Fleur.Type_time});
Fleur.XPathFunctions_fn["data#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:data",
	function(ctx) {
		return Fleur.XPathFunctions_fn["data#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["data#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:data",
	function(arg) {
		return Fleur.Atomize(arg, true);
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:dateTime",
	function(arg1, arg2) {
		if (arg1 === null || arg2 === null) {
			return null;
		}
		var dt = Fleur.toDate(arg1);
		var tm = Fleur.toTime(arg2);
		if (dt.tz === null) {
			dt.tz = tm.tz;
		} else if (dt.tz !== tm.tz && tm.tz !== null) {
			var e = new Error();
			e.name = "FORG0008";
			return e;
		}
		dt.d.setHours(tm.d.getHours());
		dt.d.setMinutes(tm.d.getMinutes());
		dt.d.setSeconds(tm.d.getSeconds());
		dt.d.setMilliseconds(tm.d.getMilliseconds());
		return Fleur.dateToDateTime(dt);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Type_dateTime, occurence: "?"});
Fleur.XPathFunctions_fn["day-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:day-from-date",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-\d{2}-(\d{2})(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_date, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["day-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:day-from-dateTime",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-\d{2}-(\d{2})T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["days-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:days-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			d = Fleur.toJSONDayTimeDuration(a.data);
			return d.sign * d.day;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.day;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["deep-equal#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal",
	function(parameter1, parameter2) {
		return Fleur.XPathFunctions_fn["deep-equal#3"].jsfunc(parameter1, parameter2, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["deep-equal#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:deep-equal",
	function(parameter1, parameter2, collation) {
		var e;
		if (parameter1.nodeType === Fleur.Node.FUNCTION_NODE || parameter2.nodeType === Fleur.Node.FUNCTION_NODE) {
			e = new Error("");
			e.name = "FOTY0015";
			return e;
		}
		var c = Fleur.getCollation(collation);
		if (!c) {
			e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (parameter1.nodeType !== parameter2.nodeType) {
			return false;
		}
		switch (parameter1.nodeType) {
			case Fleur.Node.ELEMENT_NODE:
				if (parameter1.localName !== parameter2.localName || parameter1.namespaceURI !== parameter2.namespaceURI) {
					return false;
				}
				if (parameter1.attributes.some(function(attr) {
					if ((attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/") {
						return false;
					}
					var attr2value = parameter2.getAttributeNS(attr.namespaceURI, attr.localName);
					return !c.equals(attr.textContent, attr2value);
				})) {
					return false;
				}
				var r1 = parameter1.attributes.reduce(function(acc, attr) {
					return (attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/" ? acc : acc + 1;
				}, 0);
				var r2 = parameter2.attributes.reduce(function(acc, attr) {
					return (attr.localName === "xmlns" && attr.namespaceURI === "http://www.w3.org/XML/1998/namespace") || attr.namespaceURI === "http://www.w3.org/2000/xmlns/" ? acc : acc + 1;
				}, 0);
				if (r1 !== r2) {
					return false;
				}
				break;
			case Fleur.Node.ATTRIBUTE_NODE:
				return parameter1.localName === parameter2.localName && parameter1.namespaceURI === parameter2.namespaceURI && c.equals(parameter1.textContent, parameter2.textContent);
			case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
				return parameter1.nodeName === parameter2.nodeName && c.equals(parameter1.data, parameter2.data);
			case Fleur.Node.TEXT_NODE:
				if ((parameter1.schemaTypeInfo === Fleur.Type_string || parameter1.schemaTypeInfo === Fleur.Type_untypedAtomic || parameter1.schemaTypeInfo === Fleur.Type_anyURI) &&
					(parameter2.schemaTypeInfo === Fleur.Type_string || parameter2.schemaTypeInfo === Fleur.Type_untypedAtomic || parameter2.schemaTypeInfo === Fleur.Type_anyURI)) {
					return c.equals(parameter1.data, parameter2.data);
				}
				if (Fleur.numericTypes.indexOf(parameter1.schemaTypeInfo) !== -1 &&
					Fleur.numericTypes.indexOf(parameter2.schemaTypeInfo) !== -1) {
					return (parameter1.data === "INF" && parameter2.data === "INF") ||
						(parameter1.data === "-INF" && parameter2.data === "-INF") ||
						(parameter1.data === "NaN" && parameter2.data === "NaN") ||
						parseFloat(parameter1.data) === parseFloat(parameter2.data);
				}
				return parameter1.schemaTypeInfo === parameter2.schemaTypeInfo && parameter1.data === parameter2.data;
		}
		if (parameter1.childNodes) {
			if (parameter2.childNodes && parameter1.childNodes.length === parameter2.childNodes.length) {
				return parameter1.childNodes.every(function(child, i) {
					return Fleur.XPathFunctions_fn["deep-equal#3"].jsfunc(child, parameter2.childNodes[i], collation);
				});
			}
			return false;
		}
		return true;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["default-collation#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:default-collation",
	function() {
		return "http://www.w3.org/2005/xpath-functions/collation/codepoint";
	},
	null, [], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["distinct-values#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:distinct-values",
	function(arg) {
		return Fleur.XPathFunctions_fn["distinct-values#2"].jsfunc(arg, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["distinct-values#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:distinct-values",
	function(arg, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return arg;
		}
		var result = new Fleur.Sequence();
		arg.childNodes.forEach(function(d) {
			var a = Fleur.Atomize(d);
			var opa = Fleur.toJSValue(a, true, true, true, true, false, false, true);
			if (!result.childNodes.some(function(r) {
					var opr = Fleur.toJSValue(r, true, true, true, true, false, false, true);
					return Fleur.eqOp(opa, opr, c);
				})) {
				result.appendChild(a);
			}
		});
		if (result.childNodes.length === 1) {
			result = result.childNodes[0];
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.extension2contentType = {
	".css":   "text/css",
	".csv":   "text/csv",
	".docx":  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".gif":   "image/gif",
	".htm":   "text/html",
	".html":  "text/html",
	".ico":   "image/x-icon",
	".jpeg":  "image/jpeg",
	".jpg":   "image/jpeg",
	".js":    "application/javascript",
	".json":  "application/json",
	".ofx":   "application/x-ofx",
	".png":   "image/png",
	".svg":   "image/svg+xml",
	".txt":   "text/plain",
	".xhtml": "application/xhtml+xml",
	".xlsx":  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".xml":   "application/xml;charset=utf-8",
	".xsl":   "text/xsl",
	".zip":   "application/zip"
};
Fleur.extension2encoding = {
	".css":   "utf8",
	".csv":   "utf8",
	".docx":  "binary",
	".gif":   "binary",
	".htm":   "utf8",
	".html":  "utf8",
	".ico":   "binary",
	".jpeg":  "binary",
	".jpg":   "binary",
	".js":    "utf8",
	".json":  "utf8",
	".ofx":   "utf8",
	".png":   "binary",
	".svg":   "utf8",
	".txt":   "utf8",
	".xhtml": "utf8",
	".xlsx":  "binary",
	".xml":   "utf8",
	".xsl":   "utf8",
	".zip":   "binary"
};
Fleur.encoding2encoding = {
	"us-ascii":   "latin1",
	"iso-8859-1": "latin1",
	"utf-8":      "utf8",
	"utf-16":     "utf16le"   
};
Fleur.XPathFunctions_fn["doc#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, ctx, callback) {
		return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, null, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}], true, true, {type: Fleur.Node});
Fleur.XPathFunctions_fn["doc#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, serialization, ctx, callback) {
		return Fleur.XPathFunctions_fn["doc#3"].jsfunc(docname, serialization, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});
Fleur.XPathFunctions_fn["doc#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:doc",
	function(docname, serialization, data, ctx, callback) {
		var contentType;
		var encoding;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			serialization = op2[1];
			contentType = Fleur.toContentType(serialization);
			if (serialization["encoding"]) {
				encoding = Fleur.encoding2encoding[serialization["encoding"].toLowerCase()];
			}
		}
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var cmdexec = docname.startsWith("cmd://");
		var ps1exec = docname.startsWith("ps1://");
		var fileread = (docname.startsWith("file://") || !httpget) && !cmdexec && !ps1exec;
		var parser = new Fleur.DOMParser();
		if (httpget) {
			if (!Fleur.inBrowser) {
				var options = global.url.parse(docname);
				options.method = (serialization["http-verb"] || "GET").toUpperCase();
				options.headers = serialization["http-headers"] || {};
				if (serialization["http-cookie"]) {
					options.headers.Cookie = serialization["http-cookie"];
				}
				var postdata = null;
				if (data) {
					var ser = new Fleur.Serializer();
					postdata = ser.serializeToString(data, contentType);
					options.headers["Content-Type"] = contentType;
					options.headers["Content-Length"] = postdata.length;
				}
				var resdata = "";
				var hreq = global.http.request(options, function(res) {
					res.setEncoding("utf8");
					res.on("data", function(chunk) {
						resdata += chunk;
					});
					res.on("end", function() {
						callback(parser.parseFromString(resdata, res.headers["Content-Type"] || contentType));
					});
				});
				if (serialization["timeout"]) {
					hreq.setTimeout(parseInt(serialization["timeout"], 10), function() {
						callback(null);
					});
				}
				hreq.on("error", function(e) {
					callback(e);
				});
				if (postdata) {
					hreq.write(postdata);
				}
				hreq.end();
			} else {
				var getp = new Promise(function(resolve, reject) {
					var req = new XMLHttpRequest();
					req.open(serialization && serialization["http-verb"] ? serialization["http-verb"].toUpperCase() : "GET", docname, true);
					req.onload = function() {
						if (req.status === 200) {
							resolve({text: req.responseText, contenttype: serialization ? contentType : req.getResponseHeader("Content-Type")});
						} else {
							reject(Fleur.error(ctx, "FODC0002"));
				      	}
					};
					req.send(null);
				});
				getp.then(
					function(o) {
						callback(parser.parseFromString(o.text, o.contenttype));
					},
					function(a) {
						callback(a);
					}
				);
			}
		} else if (fileread) {
			if (docname.startsWith("file://")) {
				docname = docname.substr(7);
			}
			var extension = global.path.extname(docname).toLowerCase();
			if (!contentType) {
				contentType = Fleur.extension2contentType[extension] || "application/xml";
			}
			if (!encoding) {
				encoding = "utf8";
			}
			global.fs.readFile(docname, encoding, function(err, file) {
				if (err) {
					callback(Fleur.error(ctx, "FODC0002"));
				} else {
					callback(parser.parseFromString(file.startsWith('\uFEFF') ? file.substr(1) : file, contentType));
				}
			});
		} else if (cmdexec || ps1exec) {
			docname = decodeURIComponent(docname.substr(6));
			if (!contentType) {
				contentType = "application/xml";
			}
			var dropone = false;
			if (global.os.platform() === "win32") {
				if (cmdexec) {
					docname = "@chcp 65001 | " + docname;
				} else {
					docname = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy Bypass \"& {chcp 65001 ; $ProgressPreference='SilentlyContinue' ; " + docname + "}\"";
					dropone = true;
				}
			}
			global.child_process.exec(docname, {windowsHide: true, maxBuffer: 1024*1024*1024}, function(err, stdout, stderr) {
				if (err) {
					err.name = "FOPR0001";
					callback(err);
				} else if (stderr) {
					var e = new Error(stderr);
					e.name = "FOPR0001";
					callback(e);
				} else {
					if (dropone) {
						stdout = stdout.substr(stdout.indexOf("\r\n") + 2);
					}
					callback(parser.parseFromString(stdout, contentType));
				}
			});
		}
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.Node});
Fleur.XPathFunctions_fn["document-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri",
	function(ctx) {
		return Fleur.XPathFunctions_fn["document-uri#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["document-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:document-uri",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		return "";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:empty",
	function(arg) {
		return arg === Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["encode-for-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:encode-for-uri",
	function(uripart) {
		return uripart !== null ? encodeURIComponent(uripart).replace(/[!'()*]/g, function(c) {return '%' + c.charCodeAt(0).toString(16).toUpperCase();}) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["ends-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ends-with",
	function(a, b) {
		return !b ? true : !a ? false : a.endsWith(b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["ends-with#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:ends-with",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return !b ? true : !a ? false : c.endsWith(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["error#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error",
	function(ctx) {
		return Fleur.XPathFunctions_fn["error#3"].jsfunc(null, null, null, ctx);
	},
	null, [], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["error#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error",
	function(code, ctx) {
		return Fleur.XPathFunctions_fn["error#3"].jsfunc(code, null, null, ctx);
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["error#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error",
	function(code, description, ctx) {
		return Fleur.XPathFunctions_fn["error#3"].jsfunc(code, description, null, ctx);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["error#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:error",
	function(code, description, errorObject, ctx) {
		var a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_error;
		if (!code || code === Fleur.EmptySequence) {
			a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:FOER0000");
		} else if (code.nodeType !== Fleur.Node.TEXT_NODE || (code.schemaTypeInfo !== Fleur.Type_QName && code.schemaTypeInfo !== Fleur.Type_error)) {
			a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		} else if (code.schemaTypeInfo === Fleur.Type_error) {
			return code;
		} else {
			a._setNodeNameLocalNamePrefix(code.namespaceURI, code.nodeName);
		}
		if (description) {
			a.data = description;
		}
		return a;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["escape-html-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:escape-html-uri",
	function(s) {
		return !s ? "" : s.replace(/[^ -~]/g, function(c) {return encodeURIComponent(c);});
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["evaluate#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:evaluate",
	function(arg) {
		return arg !== Fleur.EmptySequence;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["exactly-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:exactly-one",
	function(arg, ctx) {
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var err = Fleur.error(ctx, "FORG0005");
			var result = err;
			arg.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === err) {
					result = c;
				}
			});
			return result;
		} else {
			return arg;
		}
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["exists#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:exists",
	function(arg) {
		return arg !== Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["false#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:false",
	function() {
		return false;
	},
	null, [], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["floor#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:floor",
	function(a) {
		return a ? [typeof a[0] === "bigint" ? a[0] : Math.floor(a[0]), a[1]] : null;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["format-date#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date",
	function(value, picture, ctx) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, true, false);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["format-date#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date",
	function(value, picture, language, calendar, place, ctx) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, language, calendar, place, ctx, true, false);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["format-dateTime#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime",
	function(value, picture, ctx) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, false, false);
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["format-dateTime#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-dateTime",
	function(value, picture, language, calendar, place, ctx, notime, nodate) {
		var s = "";
		var i = 0, l = picture.length;
		var format = "";
		var pdate = false;
		var ptime = false;
		var valueDate = notime ? Fleur.toDate(value) : nodate ? Fleur.toTime(value) : Fleur.toDateTime(value);
		language = language || Fleur.defaultLanguage;
		while (i < l) {
			var c = picture.charAt(i);
			var prec = "";
			while (c !== "[" && i < l) {
				if (c !== "]") {
					s += c;
				} else if (prec === c) {
					s += c;
					c = "";
				}
				prec = c;
				c = picture.charAt(++i);
			}
			if (c === "[") {
				c = picture.charAt(++i);
				if (c === "[") {
					s += c;
					i++;
				} else {
					format = "";
					while (c !== "]" && i < l) {
						format += c;
						c = picture.charAt(++i);
					}
					if (c === "]") {
						var intvalue = null, stringvalue = null;
						switch(format.charAt(0)) {
							case "Y":
								pdate = true;
								if (format.charAt(1).toLowerCase() === "i") {
									stringvalue = Fleur.convertToRoman(parseInt(value.substr(0, 4), 10));
									if (format.charAt(1) === "i") {
										stringvalue = stringvalue.toLowerCase();
									}
								} else {
									intvalue = parseInt(value.substr(0, 4), 10);
								}
								break;
							case "M":
								pdate = true;
								if (format.charAt(1).toLowerCase() === "i") {
									stringvalue = Fleur.convertToRoman(parseInt(value.substr(5, 2), 10));
									if (format.charAt(1) === "i") {
										stringvalue = stringvalue.toLowerCase();
									}
								} else if (format.charAt(1).toLowerCase() === "n") {
									stringvalue = Fleur.getMonthName(language, valueDate.d);
									if (format.charAt(1) === "N") {
										if (format.charAt(2) === "n") {
											stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
										} else {
											stringvalue = stringvalue.toUpperCase();
										}
									} else {
										stringvalue = stringvalue.toLowerCase();
									}
								} else {
									intvalue = parseInt(value.substr(5, 2), 10);
								}
								break;
							case "D":
								pdate = true;
								intvalue = parseInt(value.substr(8, 2), 10);
								break;
							case "d":
								break;
							case "F":
								pdate = true;
								stringvalue = Fleur.getDayName(language, valueDate.d);
								if (format.charAt(1) === "N") {
									if (format.charAt(2) === "n") {
										stringvalue = stringvalue.charAt(0).toUpperCase() + stringvalue.substr(1).toLowerCase();
									} else {
										stringvalue = stringvalue.toUpperCase();
									}
								} else {
									stringvalue = stringvalue.toLowerCase();
								}
								break;
							case "W":
								break;
							case "w":
								break;
							case "H":
								break;
							case "h":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 0 : 11, 2), 10);
								break;
							case "P":
								break;
							case "m":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 3 : 14, 2), 10);
								break;
							case "s":
								ptime = true;
								intvalue = parseInt(value.substr(nodate ? 6 : 17, 2), 10);
								break;
							case "f":
								break;
							case "Z":
								break;
							case "z":
								break;
							case "C":
								break;
							case "E":
								break;
						}
						if ((ptime && notime) || (pdate && nodate)) {
							return Fleur.error(ctx, "FOFD1350");
						}
						if (intvalue !== null || stringvalue !== null) {
							format = format.split(',');
							var maxw, minw;
							if (format[1]) {
								var ws = format[1].split('-');
								minw = ws[0] === "*" ? 1 : parseInt(ws[0], 10);
								maxw = !ws[1] || ws[1] === "*" ? Infinity : parseInt(ws[1], 10);
							} else {
								minw = Math.max(format[0].length - 1, 1);
								maxw = Infinity;
							}
							if (intvalue !== null) {
								stringvalue = String(intvalue);
							}
							stringvalue = "0".repeat(Math.max(minw - stringvalue.length, 0)) + stringvalue;
							if (stringvalue.length > maxw) {
								if (format[0].charAt(0) === 'Y') {
									stringvalue = stringvalue.substr(stringvalue.length - maxw);
								}
							}
						}
						if (stringvalue !== null) {
							s += stringvalue;
						}
						i++;
					}
				}
			}
		}
		return s;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.romanValues = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
Fleur.romanLetters = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
Fleur.convertToRoman = function(num, index) {
	if (Number(num) === 0) {
		return "";
	}
	for (var i = index || 0; i < 13; i++) {
		if (num >= Fleur.romanValues[i]) {
			return Fleur.romanLetters[i] + Fleur.convertToRoman(Number(num) - Fleur.romanValues[i], i);
		}
	}
};
Fleur.XPathFunctions_fn["format-integer#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-integer",
	function(value, picture) {
		var i, j, l, l2, pictures, dss, ess, ps, pms, ms, msbefore, psafter, pmsafter, signs, esigns, iipgp, ipgp, mips, prefix, fstart, fpgp, minfps, maxfps, mes, suffix, dsspos, evalue, esign, s0, s;
		pictures = picture.split(";");
		picture = value < 0 && pictures[1] ? pictures[1] : pictures[0];
		signs = ".,-%\u2030#0123456789";
		esigns = ".,e-%\u2030#0123456789";
		i = 0;
		l = picture.length;
		while (i < l && signs.indexOf(picture.charAt(i)) === -1) {
			i++;
		}
		prefix = picture.substring(0, i);
		dss = ess = ps = pms = false;
		mips = 0;
		minfps = 0;
		maxfps = 0;
		mes = 0;
		iipgp = [];
		ipgp = [];
		fpgp = [];
		while (i < l && esigns.indexOf(picture.charAt(i)) !== -1) {
			switch (picture.charAt(i)) {
				case ".":
					dss = true;
					fstart = i + 1;
					j = 0;
					l2 = iipgp.length;
					while (j < l2) {
						ipgp[l2 - j - 1] = i - iipgp[j] - 1;
						j++;
					}
					break;
				case ",":
					if (dss) {
						fpgp.push(i - fstart);
					} else {
						iipgp.push(i);
					}
					break;
				case "e":
					ess = true;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "-":
					ms = true;
					msbefore = mips === 0;
					break;
				case "%":
					ps = true;
					psafter = mips !== 0;
					value *= Fleur.BigInt(100);
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "\u2030":
					pms = true;
					pmsafter = mips !== 0;
					value *= Fleur.BigInt(1000);
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					if (ess) {
						mes++;
					} else if (dss) {
						minfps++;
						maxfps++;
					} else {
						mips++;
					}
					break;
				case "#":
					if (dss) {
						maxfps++;
					}
					break;
			}
			i++;
		}
		if (!dss) {
			if (iipgp.length !== ipgp.length) {
				j = 0;
				l2 = iipgp.length;
				while (j < l2) {
					ipgp[l2 - j - 1] = i - iipgp[j] - 1;
					j++;
				}
			}
			if (mips === 0) {
				mips = 1;
			}
		}
		if (ipgp.length > 1) {
			j = 1;
			l2 = ipgp.length;
			while (j < l2 && ipgp[j] % ipgp[0] === 0) {
				j++;
			}
			if (j === l2) {
				ipgp = [ipgp[0]];
			}
		}
		if (ipgp.length === 1) {
			j = 1;
			while (j < 30) {
				ipgp[j] = ipgp[j - 1] + ipgp[0];
				j++;
			}
		}
		suffix = picture.substring(i);
		if (value === Number.POSITIVE_INFINITY) {
			return prefix + "Infinity" + suffix;
		} else if (value === Number.NEGATIVE_INFINITY) {
			return "-" + prefix + "Infinity" + suffix;
		}
		if (value < 0 && pictures.length === 1) {
			prefix = "-" + prefix;
		}
		if (ess) {
			evalue = Math.floor(Math.log(value) / Math.LN10) + 1 - mips;
			value /= Math.pow(10, evalue);
			esign = evalue < 0 ? "-" : "";
			evalue = String(Math.abs(evalue));
			evalue = esign + ("000000000000000000000000000000").substr(0, Math.max(0, mes - evalue.length)) + evalue;
		}
		s0 = Math.abs(Number(value)).toFixed(maxfps);
		if (maxfps === 0 && dss) {
			s0 += ".";
		}
		dsspos = s0.indexOf(".") === -1 ? s0.length : s0.indexOf(".");
		if (dsspos < mips) {
			s0 = ("000000000000000000000000000000").substr(0, mips - dsspos) + s0;
			dsspos = mips;
		}
		j = dsspos - 1;
		s = "";
		i = 0;
		l2 = s0.length;
		while (j >= 0) {
			s = s0.charAt(j) + s;
			if (j !== 0 && ipgp[i] === dsspos - j) {
				s = "," + s;
				i++;
			}
			j--;
		}
		if (dss) {
			s += ".";
			j = dsspos + 1;
			i = 0;
			while (j < l2) {
				s += s0.charAt(j);
				if (j !== l2 - 1 && fpgp[i] === j - dsspos) {
					s += ",";
					i++;
				}
				j++;
			}
		}
		if (ps) {
			if (psafter) {
				s += "%";
			} else {
				s = "%" + s;
			}
		}
		if (pms) {
			if (pmsafter) {
				s += "\u2030";
			} else {
				s = "\u2030" + s;
			}
		}
		if (ess) {
			s += "e" + evalue;
		}
		return prefix + s + suffix;
	},
	null, [{type: Fleur.Type_integer, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["format-number#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-number",
	function(value, picture) {
		var i, j, l, l2, pictures, dss, ess, ps, pms, ms, msbefore, psafter, pmsafter, signs, esigns, iipgp, ipgp, mips, prefix, fstart, fpgp, minfps, maxfps, mes, suffix, dsspos, evalue, esign, s0, s;
		pictures = picture.split(";");
		picture = value < 0 && pictures[1] ? pictures[1] : pictures[0];
		signs = ".,-%\u2030#0123456789";
		esigns = ".,e-%\u2030#0123456789";
		i = 0;
		l = picture.length;
		while (i < l && signs.indexOf(picture.charAt(i)) === -1) {
			i++;
		}
		prefix = picture.substring(0, i);
		dss = ess = ps = pms = false;
		mips = 0;
		minfps = 0;
		maxfps = 0;
		mes = 0;
		iipgp = [];
		ipgp = [];
		fpgp = [];
		while (i < l && esigns.indexOf(picture.charAt(i)) !== -1) {
			switch (picture.charAt(i)) {
				case ".":
					dss = true;
					fstart = i + 1;
					j = 0;
					l2 = iipgp.length;
					while (j < l2) {
						ipgp[l2 - j - 1] = i - iipgp[j] - 1;
						j++;
					}
					break;
				case ",":
					if (dss) {
						fpgp.push(i - fstart);
					} else {
						iipgp.push(i);
					}
					break;
				case "e":
					ess = true;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "-":
					ms = true;
					msbefore = mips === 0;
					break;
				case "%":
					ps = true;
					psafter = mips !== 0;
					value *= 100;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "\u2030":
					pms = true;
					pmsafter = mips !== 0;
					value *= 1000;
					if (!dss) {
						j = 0;
						l2 = iipgp.length;
						while (j < l2) {
							ipgp[l2 - j - 1] = i - iipgp[j] - 1;
							j++;
						}
					}
					break;
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					if (ess) {
						mes++;
					} else if (dss) {
						minfps++;
						maxfps++;
					} else {
						mips++;
					}
					break;
				case "#":
					if (dss) {
						maxfps++;
					}
					break;
			}
			i++;
		}
		if (!dss) {
			if (iipgp.length !== ipgp.length) {
				j = 0;
				l2 = iipgp.length;
				while (j < l2) {
					ipgp[l2 - j - 1] = i - iipgp[j] - 1;
					j++;
				}
			}
			if (mips === 0) {
				mips = 1;
			}
		}
		if (ipgp.length > 1) {
			j = 1;
			l2 = ipgp.length;
			while (j < l2 && ipgp[j] % ipgp[0] === 0) {
				j++;
			}
			if (j === l2) {
				ipgp = [ipgp[0]];
			}
		}
		if (ipgp.length === 1) {
			j = 1;
			while (j < 30) {
				ipgp[j] = ipgp[j - 1] + ipgp[0];
				j++;
			}
		}
		suffix = picture.substring(i);
		if (Number(value) === Number.POSITIVE_INFINITY) {
			return prefix + "Infinity" + suffix;
		} else if (Number(value) === Number.NEGATIVE_INFINITY) {
			return "-" + prefix + "Infinity" + suffix;
		}
		if (value < 0 && pictures.length === 1) {
			prefix = "-" + prefix;
		}
		if (ess) {
			evalue = Math.floor(Math.log(Number(value)) / Math.LN10) + 1 - mips;
			value = Number(value) / Math.pow(10, evalue);
			esign = evalue < 0 ? "-" : "";
			evalue = String(Math.abs(evalue));
			evalue = esign + ("000000000000000000000000000000").substr(0, Math.max(0, mes - evalue.length)) + evalue;
		}
		s0 = Math.abs(Number(value)).toFixed(maxfps);
		if (maxfps === 0 && dss) {
			s0 += ".";
		}
		dsspos = s0.indexOf(".") === -1 ? s0.length : s0.indexOf(".");
		if (dsspos < mips) {
			s0 = ("000000000000000000000000000000").substr(0, mips - dsspos) + s0;
			dsspos = mips;
		}
		j = dsspos - 1;
		s = "";
		i = 0;
		l2 = s0.length;
		while (j >= 0) {
			s = s0.charAt(j) + s;
			if (j !== 0 && ipgp[i] === dsspos - j) {
				s = "," + s;
				i++;
			}
			j--;
		}
		if (dss) {
			s += ".";
			j = dsspos + 1;
			i = 0;
			while (j < l2) {
				s += s0.charAt(j);
				if (j !== l2 - 1 && fpgp[i] === j - dsspos) {
					s += ",";
					i++;
				}
				j++;
			}
		}
		if (ps) {
			if (psafter) {
				s += "%";
			} else {
				s = "%" + s;
			}
		}
		if (pms) {
			if (pmsafter) {
				s += "\u2030";
			} else {
				s = "\u2030" + s;
			}
		}
		if (ess) {
			s += "e" + evalue;
		}
		return prefix + s + suffix;
	},
	null, [{type: Fleur.numericTypes, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["format-time#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-time",
	function(value, picture, ctx) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["format-time#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-time",
	function(value, picture, language, calendar, place, ctx) {
		return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, language, calendar, place, ctx, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["function-arity#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-arity",
	function(f) {
		return f.argtypes.length;
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["function-lookup#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-lookup",
	function(fqname, arity) {
		if (fqname.namespaceURI === "http://www.w3.org/2005/xpath-functions" && fqname.localName === "concat" && arity > 1 && !Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity]) {
			var cparam = [];
			for (var i = 0; i < arity; i++) {
				cparam[i] = {type: Fleur.Node};
			}
			Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
		}
		return Fleur.XPathFunctions[fqname.namespaceURI] ? Fleur.XPathFunctions[fqname.namespaceURI][fqname.localName + "#" + arity] || null : null;
	},
	null, [{type: Fleur.Type_QName}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["function-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:function-name",
	function(f) {
		var	a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_QName;
		a._setNodeNameLocalNamePrefix(f.namespaceURI, f.nodeName);
		return a;
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Type_QName});
Fleur.XPathFunctions_fn["has-children#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children",
	function(ctx) {
		return Fleur.XPathFunctions_fn["has-children#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["has-children#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:has-children",
	function(node) {
		if (node === null) {
			return false;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		if (node.nodeType !== Fleur.Node.SEQUENCE_NODE && node.nodeType !== Fleur.Node.ATTRIBUTE_NODE) {
			return node.childNodes && node.childNodes.length !== 0;
		}
		return false;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["head#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:head",
	function(arg) {
		return arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE ? arg : arg.childNodes[0];
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["hours-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:hours-from-dateTime",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-\d{2}-\d{2}T(\d{2}):\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["hours-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:hours-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			d = Fleur.toJSONDayTimeDuration(a.data);
			return d.sign * d.hour;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.hour;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["hours-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:hours-from-time",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^(\d{2}):\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["id#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id",
	function(arg, ctx) {
		return Fleur.XPathFunctions_fn["id#2"].jsfunc(arg, ctx._curr);
	},
	null, [{type: Fleur.Type_string, occurence: "*"}], true, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["id#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:id",
	function(arg, node) {
		if (!arg || !node || (!node.ownerDocument && node.nodeType !== Fleur.Node.DOCUMENT_NODE)) {
			return null;
		}
		node = node.ownerDocument || node;
		if (arg instanceof Array) {
			var res = [];
			arg.forEach(function(id) {
				var elt = node.getElementById(id);
				if (elt) {
					res.push(elt);
				}
			});
			return res.length === 0 ? null : res.length === 1 ? res[0] : node.sortNodes(res);
		}
		return node.getElementById(arg);
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["implicit-timezone#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:implicit-timezone",
	function(ctx) {
		var a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_dayTimeDuration;
		a.data = ctx.env.timezone;
		return a;
	},
	null, [], true, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["index-of#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:index-of",
	function(seq, search) {
		return Fleur.XPathFunctions_fn["index-of#3"].jsfunc(seq, search, "http://www.w3.org/2005/xpath-functions/collation/codepoint");
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Type_integer, occurence: "*"});
Fleur.XPathFunctions_fn["index-of#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:index-of",
	function(seq, search, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		var a1 = Fleur.Atomize(seq, true);
		if (a1 === Fleur.EmptySequence || a1.schemaTypeInfo === Fleur.Type_error) {
			return a1;
		}
		var a2 = Fleur.Atomize(search);
		if (a2.schemaTypeInfo === Fleur.Type_error) {
			return a2;
		}
		if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
			e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		var v2 = Fleur.toJSValue(a2, true, true, true, true);
		if (a1.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			var v1 = Fleur.toJSValue(a1, v2[0] < 4, true, true, true);
			if (v1[0] === v2[0] && Fleur.eqOp(v1, v2, c)) {
				a2.schemaTypeInfo = Fleur.Type_integer;
				a2.data = "1";
				return a2;
			}
			return null;
		}
		var result = new Fleur.Sequence();
		a1.childNodes.forEach(function(d, i) {
			var vd = Fleur.toJSValue(d, v2[0] < 4, true, true, true);
			if (vd[0] === v2[0] && Fleur.eqOp(vd, v2, c)) {
				var b = new Fleur.Text();
				b.schemaTypeInfo = Fleur.Type_integer;
				b.data = String(i + 1);
				result.appendChild(b);
			}
		});
		if (result.childNodes.length === 0) {
			result = Fleur.EmptySequence;
		} else if (result.childNodes.length === 1) {
			result = result.childNodes[0];
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer, occurence: "*"});
Fleur.XPathFunctions_fn["insert-before"] = function(ctx, children, callback) {
	if (children.length !== 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		var seq = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var index;
			var a1 = Fleur.Atomize(n);
			if (a1.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			if (a1.schemaTypeInfo !== Fleur.Type_integer) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			index = Math.max(parseInt(a1.data, 10) - 1, 0);
			Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
				var a2 = Fleur.Atomize(n);
				if (a2 === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(seq);});
					return;
				}
				if (seq === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				var result = new Fleur.Sequence();
				if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
					var i = 0, l;
					l = seq.childNodes.length;
					index = Math.min(index, l);
					while (i < index) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					while (i < l) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
				} else {
					result = new Fleur.Sequence();
					if (index !== 0) {
						result.appendChild(seq);
					}
					if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
						a2.childNodes.forEach(function(m) {result.appendChild(m);});
					} else {
						result.appendChild(a2);
					}
					if (index === 0) {
						result.appendChild(seq);
					}
				}
				Fleur.callback(function() {callback(result);});
			});
		});
	});
};
Fleur.XPathFunctions_fn["iri-to-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:iri-to-uri",
	function(iri) {
		return iri !== null ? iri.replace(/([^!-~]|[<>"{}|\\\^\`])/g, function(c) {return encodeURIComponent(c);}) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["last#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:last",
	function(ctx) {
		return ctx._last;
	},
	null, [], true, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["local-name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name",
	function(ctx) {
		if (ctx._curr === Fleur.EmptySequence) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.localName;
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["local-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:local-name",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.localName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["lower-case#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:lower-case",
	function(arg) {
		return arg ? arg.toLowerCase() : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["matches#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches",
	function(input, pattern) {
		return Fleur.XPathFunctions_fn["matches#3"].jsfunc(input, pattern);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["matches#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:matches",
	function(input, pattern, flags) {
			input = input || "";
			flags = flags || "";
			try {
				var re = new RegExp(pattern, flags);
				return re.test(input);
			} catch (e) {
				return false;
			}
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["max"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var max, val, t = 0, comp;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.Atomize(n));});
			return;
		}
		var items = n.childNodes, a;
		var i, l;
		i = 0;
		l = items.length;
		while (i < l) {
			a = Fleur.Atomize(items[i]);
			if (!comp) {
				if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					comp = Fleur.Type_string;
				} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
					comp = Fleur.Type_string;
				} else {
					comp = Fleur.Type_double;
				}
			}
			if (comp === Fleur.Type_double) {
				val = Fleur.toJSNumber(a);
			} else {
				val = Fleur.toJSString(a);
			}
			if (val[0] < 0) {
				if (!comp) {
					comp = Fleur.Type_string;
					val = Fleur.toJSString(a);
				} else {
					Fleur.error("");
				}
			}
			if (!max) {
				t = val[0];
				max = val[1];
			} else {
				if (comp === Fleur.Type_double) {
					if (max < val[1]) {
						t = val[0];
						max = val[1];
					}
				} else if (max.localeCompare(val[1]) < 0) {
					max = val[1];
				}
			}
			i++;
		}
		a.data = "" + max;
		a.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["min"] = function(ctx, children, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var min, val, t = 0, comp;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.Atomize(n));});
			return;
		} else {
			var items = n.childNodes;
			var i, l, a;
			i = 0;
			l = items.length;
			while (i < l) {
				a = Fleur.Atomize(items[i]);
				if (!comp) {
					if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						comp = Fleur.Type_string;
					} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
						comp = Fleur.Type_string;
					} else {
						comp = Fleur.Type_double;
					}
				}
				if (comp === Fleur.Type_double) {
					val = Fleur.toJSNumber(a);
				} else {
					val = Fleur.toJSString(a);
				}
				if (val[0] < 0) {
					if (!comp) {
						comp = Fleur.Type_string;
						val = Fleur.toJSString(a);
					} else {
						Fleur.error("");
					}
				}
				if (!min) {
					t = val[0];
					min = val[1];
				} else {
					if (comp === Fleur.Type_double) {
						if (min > val[1]) {
							t = val[0];
							min = val[1];
						}
					} else if (min.localeCompare(val[1]) > 0) {
						min = val[1];
					}
				}
				i++;
			}
		}
		a.data = "" + min;
		a.schemaTypeInfo = comp === Fleur.Type_double ? Fleur.numericTypes[t] : Fleur.Type_string;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathFunctions_fn["minutes-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:minutes-from-dateTime",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-\d{2}-\d{2}T\d{2}:(\d{2}):\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["minutes-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:minutes-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			d = Fleur.toJSONDayTimeDuration(a.data);
			return d.sign * d.minute;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.minute;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["minutes-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:minutes-from-time",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{2}:(\d{2}):\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["month-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:month-from-date",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-(\d{2})-\d{2}(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_date, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["month-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:month-from-dateTime",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^\d{4}-(\d{2})-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["months-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:months-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			d = Fleur.toJSONYearMonthDuration(a.data);
			return d.sign * d.month;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.month;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name",
	function(ctx) {
		if (ctx._curr === null) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.nodeName;
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:name",
	function(node) {
		if (node === null) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.nodeName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["namespace-uri#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri",
	function(ctx) {
		if (ctx._curr === null) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.namespaceURI;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["namespace-uri#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:namespace-uri",
	function(node) {
		if (node === null) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.namespaceURI;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_anyURI});
Fleur.XPathFunctions_fn["nilled#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled",
	function(ctx) {
		return Fleur.XPathFunctions_fn["nilled#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["nilled#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:nilled",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if ((node.nodeType === Fleur.Node.TEXT_NODE && node.schemaTypeInfo !== Fleur.Type_untypedAtomic) || node.nodeType === Fleur.Node.FUNCTION_NODE) {
			var e = new Error("");
			e.name = "XPTY0004";
			return e;
		}
		return false;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["node-name#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:node-name",
	function(ctx) {
		if (ctx._curr === Fleur.EmptySequence) {
			return null;
		}
		if (ctx._curr.nodeType === Fleur.Node.DOCUMENT_NODE || ctx._curr.nodeType === Fleur.Node.COMMENT_NODE || ctx._curr.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return ctx._curr.nodeName;
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["node-name#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:node-name",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE || node.nodeType === Fleur.Node.COMMENT_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
			return "";
		}
		return node.nodeName;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-empty#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty",
	function(ctx) {
		return ctx._curr && ctx._curr.textContent !== "" ? ctx._curr.textContent : null;
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-empty#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-empty",
	function(arg) {
		return arg && arg !== "" ? arg : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-space#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space",
	function(ctx) {
		return ctx._curr ? ctx._curr.textContent.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-space#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-space",
	function(arg) {
		return arg ? arg.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ") : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-unicode#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-unicode",
	function(arg) {
		if (!arg) {
			return "";
		}
		return arg.normalize();
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["normalize-unicode#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:normalize-unicode",
	function(arg, normalizationForm) {
		if (!arg) {
			return "";
		}
		normalizationForm = normalizationForm.toUpperCase().trim();
		if (normalizationForm === "") {
			return arg;
		}
		try {
			return arg.normalize(normalizationForm);
		} catch(e) {
			return arg;
		}
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["not#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:not",
	function(arg, ctx) {
		var e;
		if (arg === Fleur.EmptySequence) {
			return true;
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (arg.childNodes.length === 0) {
				return true;
			}
			if (arg.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || arg.childNodes[0].ownerDocument) {
				return false;
			}
			e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
			e.name = "FORG0006";
			return e;
		}
		if (arg.nodeType !== Fleur.Node.TEXT_NODE) {
			return false;
		}
		if (arg.schemaTypeInfo === Fleur.Type_boolean) {
			return arg.data !== "true";
		}
		if (arg.schemaTypeInfo === Fleur.Type_string || arg.schemaTypeInfo === Fleur.Type_untypedAtomic || arg.schemaTypeInfo === Fleur.Type_anyURI) {
			return !(arg.hasOwnProperty("data") && arg.data.length !== 0);
		}
		if (arg.schemaTypeInfo === Fleur.Type_integer || arg.schemaTypeInfo === Fleur.Type_decimal || arg.schemaTypeInfo === Fleur.Type_float || arg.schemaTypeInfo === Fleur.Type_double) {
			return !(arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN");
		}
		if (arg.schemaTypeInfo && arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return arg.data !== "true";
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return !(arg.hasOwnProperty("data") && arg.data.length !== 0);
		}
		if (arg.schemaTypeInfo && (arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || arg.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
			return !(arg.data !== "0" && arg.data !== "0.0" && arg.data !== "0.0e0" && arg.data !== "NaN");
		}
		e = new Error("The supplied sequence contains values inappropriate to fn:boolean");
		e.name = "FORG0006";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["number#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number",
	function(ctx) {
		return Fleur.XPathFunctions_fn["number#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_double});
Fleur.XPathFunctions_fn["number#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:number",
	function(arg) {
		var a = Fleur.Atomize(arg);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			return a;
		}
		if (a === Fleur.EmptySequence || a.data === "NaN") {
			return NaN;
		}
		if (a.schemaTypeInfo === Fleur.Type_boolean) {
			return a.data === "true" ? 1.0e0 : 0.0e0;
		}
		if (!(a.schemaTypeInfo !== Fleur.Type_anyURI && /^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|(\.[0-9]+))([eE][-+]?[0-9]+)?|-?INF|NaN)\s*$/.test(a.data))) {
			return NaN;
		}
		if (a.data === "INF") {
			return Number.POSITIVE_INFINITY
		}
		if (a.data === "-INF") {
			return Number.NEGATIVE_INFINITY
		}
		return parseFloat(a.data);
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_double});
Fleur.XPathFunctions_fn["one-or-more#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:one-or-more",
	function(arg, ctx) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.error(ctx, "FORG0004");
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = arg;
			arg.childNodes.forEach(function(c) {
				if (c.schemaTypeInfo === Fleur.Type_error && result === arg) {
					result = c;
				}
			});
			return result;
		} else {
			return arg;
		}
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["parse#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse",
	function(arg, serialization) {
		var contentType;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			serialization = op2[1];
			contentType = Fleur.toContentType(serialization);
		} else {
			contentType = "application/xml";
		}
		var parser = new Fleur.DOMParser();
		return arg !== null ? parser.parseFromString(arg, contentType) : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["parse-ietf-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-ietf-date",
	function(value) {
		return value ? new Date(value) : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_dateTime});
Fleur.XPathFunctions_fn["parse-md#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-md",
	function(arg) {
		var parser = new Fleur.DOMParser();
		return arg !== null ? parser.parseFromString(arg, "text/markdown") : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["parse-xml#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:parse-xml",
	function(arg) {
		var parser = new Fleur.DOMParser();
		return arg !== null ? parser.parseFromString(arg, "application/xml") : null;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["position#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:position",
	function(ctx) {
		return ctx._pos;
	},
	null, [], true, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["QName#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:QName",
	function(paramURI, paramQName) {
		var	a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_QName;
		a._setNodeNameLocalNamePrefix(paramURI, paramQName);
		return a;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_QName});
Fleur.XPathFunctions_fn["remove"] = function(ctx, children, callback) {
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		var seq = n;
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var i, l, index, result;
			var a = Fleur.Atomize(n);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a);});
				return;
			}
			if (a.schemaTypeInfo !== Fleur.Type_integer) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
			index = parseInt(a.data, 10) - 1;
			if (seq.nodeType === Fleur.Node.SEQUENCE_NODE) {
				l = seq.childNodes.length;
				if (index >= 0 && index < l) {
					result = new Fleur.Sequence();
					result.nodeType = Fleur.Node.SEQUENCE_NODE;
					i = 0;
					while (i < index) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					i++;
					while (i < l) {
						result.appendChild(seq.childNodes[i]);
						i++;
					}
					if (result.childNodes.length === 1) {
						result = result.childNodes[0];
					}
				} else {
					result = seq;
				}
			} else if (index === 0) {
				result = Fleur.EmptySequence;
			} else {
				result = seq;
			}
			Fleur.callback(function() {callback(result);});
		});
	});
};
Fleur.XPathFunctions_fn["replace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace",
	function(input, pattern, replacement) {
		return Fleur.XPathFunctions_fn["replace#4"].jsfunc(input, pattern, replacement);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["replace#4"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:replace",
	function(input, pattern, replacement, flags) {
			input = input || "";
			flags = (flags || "") + "g";
			try {
				var re = new RegExp(pattern, flags);
				return input.replace(re, replacement);
			} catch (e) {
				return input;
			}
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["reverse#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:reverse",
	function(arg) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE) {
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			var i = arg.childNodes.length - 1;
			while (i >= 0) {
				result.appendChild(arg.childNodes[i]);
				i--;
			}
			return result;
		}
		return arg;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["round#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		a2 = Math.round(a);
		t2 = t;
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["round#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round",
	function(arg, precision) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		a2 = Math.round(a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15)) / Math.pow(10, precision);
		t2 = t;
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["round-half-to-even#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2, t2;
		if (a - Math.floor(a) === 0.5 && Math.floor(a) % 2 === 0) {
			a -= 1;
		}
		a2 = Math.round(a);
		t2 = t;
		return [a2, t2];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["round-half-to-even#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:round-half-to-even",
	function(arg, precision) {
		if (arg === null) {
			return [null, null];
		}
		var a = arg[0];
		var t = arg[1];
		var a2;
		a2 = a * Math.pow(10, precision) + Math.pow(10, Math.floor(Math.log(Math.abs(a)) * Math.LOG10E) + precision - 15);
		if (a2 === Number.POSITIVE_INFINITY) {
			return [a, t];
		}
		if (a2 === 0) {
			return [0, t];
		}
		if (Math.round(a2 * 2) / 2  - Math.floor(a2) === 0.5 && Math.floor(a2) % 2 === 0) {
			a2 -= 1;
		}
		return [Math.round(a2) * Math.pow(10, -precision), t];
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["seconds-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-dateTime",
	function(arg) {
		return arg !== null ? parseFloat(arg.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1]) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_decimal, occurence: "?"});
Fleur.XPathFunctions_fn["seconds-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			var d = Fleur.toJSONDayTimeDuration(a.data);
			return d.sign * d.second;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_decimal, occurence: "?"});
Fleur.XPathFunctions_fn["seconds-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:seconds-from-time",
	function(arg) {
		return arg !== null ? parseFloat(arg.match(/^\d{2}:\d{2}:(\d{2}(?:\.\d+)?)(?:Z|[+\-]\d{2}:\d{2})?$/)[1]) : null;
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], true, false, {type: Fleur.Type_decimal, occurence: "?"});
Fleur.XPathFunctions_fn["serialize#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:serialize",
	function(node) {
		return Fleur.XPathFunctions_fn["serialize#2"].jsfunc(node, null);
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["serialize#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:serialize",
	function(node, serialization) {
		var contentType;
		var defContentType = null;
		var i, l;
		var defDetect = function(n) {
			switch(n.nodeType) {
				case Fleur.Node.ARRAY_NODE :
				case Fleur.Node.MAP_NODE :
					defContentType = "application/json";
					break;
				case Fleur.Node.TEXT_NODE:
					defContentType = "text/plain";
					break;
				case Fleur.Node.SEQUENCE_NODE:
					defContentType = "text/csv";
					break;
				case Fleur.Node.ELEMENT_NODE:
					defContentType = "application/xml";
			}
		};
		if (node.nodeType === Fleur.Node.DOCUMENT_NODE) {
			for (i = 0, l = node.children.length; i < l && !defContentType; i++) {
				defDetect(node.children[i]);
			}
			for (i = 0, l = node.childNodes.length; i < l && !defContentType; i++) {
				defDetect(node.childNodes[i]);
			}
		} else {
			defDetect(node);
		}
		var indent = false;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				return a2;
			}
			contentType = Fleur.toContentType(op2[1], defContentType);
			indent = op2[1].indent === "yes";
		}
		if (!contentType) {
			contentType = defContentType;
		}
		var ser = new Fleur.Serializer();
		return ser.serializeToString(node, contentType, indent);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["sort#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input) {
		return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, null, null);
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["sort#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input, collation) {
		return Fleur.XPathFunctions_fn["sort#3"].jsfunc(input, collation, null);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["sort#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sort",
	function(input, collation, key) {
		if (input.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return Fleur.Atomize(input);
		}
		if (input === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		var i, l;
		var seq = new Fleur.Sequence();
		var arr = [];
		for (i = 0, l = input.childNodes.length; i < l; i++) {
			arr.push(Fleur.Atomize(input.childNodes[i]));
		}
		var v = function(n) {
			if (n.schemaTypeInfo === Fleur.Type_integer) {
				return parseInt(n.data, 10);
			} else if (n.schemaTypeInfo === Fleur.Type_decimal) {
				return parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_float) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_double) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return parseInt(n.data, 10);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data === "INF" ? Number.POSITIVE_INFINITY : n.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(n.data);
			} else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_anyURI || n.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return n.data;
			} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return n.data;
			}
		};
		arr.sort(function(a, b) {
			if (a.data === b.data) {
				return 0;
			}
			if (v(a) < v(b)) {
				return -1;
			}
			return 1;
		});
		arr.forEach(function(n) {
			seq.appendChild(n);
		});
		return seq;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["starts-with#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
	function(a, b) {
		return !b ? true : !a ? false : a.startsWith(b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["starts-with#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:starts-with",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return !b ? true : !a ? false : c.startsWith(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["string#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
	function(ctx) {
		return Fleur.XPathFunctions_fn["string#1"].jsfunc(ctx._curr);
	},
	null, [], true, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["string#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string",
	function(arg) {
		if (arg === Fleur.EmptySequence) {
			return "";
		}
		var a = Fleur.Atomize(arg);
		return a.data;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["string-join#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join",
	function(arg1) {
		return Fleur.XPathFunctions_fn["string-join#2"].jsfunc(arg1, "");
	},
	null, [{type: Fleur.Type_string, occurence: "*"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["string-join#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-join",
	function(arg1, arg2) {
		return arg1 instanceof Array ? arg1.join(arg2 || "") : arg1;
	},
	null, [{type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["string-length#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(ctx) {
		if (!ctx._curr) {
			return 0;
		}
		var a = Fleur.Atomize(ctx._curr);
		return a.data.length;
	},
	null, [], true, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["string-length#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-length",
	function(arg) {
		return !arg ? 0 : arg.length;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_fn["string-to-codepoints#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:string-to-codepoints",
	function(arg) {
		if (!arg || arg === "") {
			return null;
		}
		if (arg.length === 1) {
			return arg.codePointAt(0);
		}
		var ret = [];
		var i, l;
		for (i = 0, l = arg.length; i < l; i++) {
			ret.push(arg.codePointAt(i));
		}
		return ret;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "*"});
Fleur.XPathFunctions_fn["subsequence#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:subsequence",
	function(sourceSeq, startingLoc) {
		return Fleur.XPathFunctions_fn["subsequence#3"].jsfunc(sourceSeq, startingLoc, Number.POSITIVE_INFINITY);
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["subsequence#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:subsequence",
	function(sourceSeq, startingLoc, length) {
		if (startingLoc === Number.NEGATIVE_INFINITY && length === Number.POSITIVE_INFINITY) {
			return Fleur.EmptySequence;
		}
		if (typeof length === "number") {
			length = Math.round(length);
		}
		if (typeof startingLoc === "number") {
			startingLoc = Math.round(startingLoc);
		}
		if (length <= 0) {
			return Fleur.EmptySequence;
		}
		if (Number(length) === 1 || (sourceSeq.nodeType === Fleur.Node.SEQUENCE_NODE && Number(startingLoc) === sourceSeq.childNodes.length && length > 1)) {
			if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				return Number(startingLoc) === 1 ? sourceSeq : Fleur.EmptySequence;
			}
			if (startingLoc <= sourceSeq.childNodes.length) {
				return sourceSeq.childNodes[Number(startingLoc) - 1];
			}
			return Fleur.EmptySequence;
		}
		if (sourceSeq.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return Number(startingLoc) === 1 ? sourceSeq : Fleur.EmptySequence;
		}
		var seq = new Fleur.Sequence();
		for (var i = Number(startingLoc) - 1, l = Math.min(i + Number(length), sourceSeq.childNodes.length); i < l; i++) {
			seq.appendChild(sourceSeq.childNodes[i]);
		}
		return seq;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["substring#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start) {
		return source ? source.substr(Number(start) - 1) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring",
	function(source, start, end) {
		return source ? source.substr(Number(start) - 1, Number(end)) : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-after#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after",
	function(a, b) {
		if (!a) {
			return "";
		}
		if (!b || b === "") {
			return a;
		}
		var index = a.indexOf(b);
		return index === -1 ? "" : a.substring(index + b.length);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-after#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-after",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		if (!a) {
			return "";
		}
		if (!b || b === "") {
			return a;
		}
		return c.substringAfter(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-before#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before",
	function(a, b) {
		return !a || !b ? "" : a.substring(0, a.indexOf(b));
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["substring-before#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:substring-before",
	function(a, b, collation) {
		var c = Fleur.getCollation(collation);
		if (!c) {
			var e = new Error("");
			e.name = "FOCH0002";
			return e;
		}
		return !a || !b ? "" : c.substringBefore(a, b);
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_fn["sum#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:sum",
	function(arg) {
		if (arg === null) {
			return [null, null];
		}
		if (arg[0] instanceof Array) {
			var r = arg.reduce(function(p, c) {
				var rt;
				if (c[1] === Fleur.Type_untypedAtomic) {
					c[1] = Fleur.Type_double;
				}
				if (p[1]) {
					rt = p[1].compareType(c[1], Fleur.TypeInfo.DERIVATION_RESTRICTION);
					if (!rt) {
						if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
							if (p[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION) || c[1].isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
								rt = Fleur.Type_double;
							} else {
								rt = Fleur.Type_float;
							}
						} else {
							rt = Fleur.Type_double;
						}
					}
				} else {
					rt = c[1];
				}
				var val = typeof p[0] === typeof c[0] ? p[0] + c[0] : Number(p[0]) + Number(c[0]);
				var precision = p[2] !== undefined && c[2] !== undefined ? Math.max(p[2], c[2]) : undefined;
				if (rt === Fleur.Type_decimal) {
					val = Math.round(val * Math.pow(10, precision)) / Math.pow(10, precision);
				}
				return [val, rt, precision];
			}, [0, null, 0]);
			return r;
		}
		if (arg[1] === Fleur.Type_untypedAtomic) {
			arg[1] = Fleur.Type_double;
		}
		return arg;
	},
	null, [{type: Fleur.numericTypes, adaptative: true, occurence: "*"}], false, false, {type: Fleur.numericTypes, adaptative: true, occurence: "?"});
Fleur.XPathFunctions_fn["tail#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tail",
	function(arg) {
		if (arg === Fleur.EmptySequence || arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return Fleur.EmptySequence;
		}
		if (arg.childNodes.length > 2) {
			var result = new Fleur.Sequence();
			for (var i = 1, l = arg.childNodes.length; i < l; i++) {
				result.appendChild(arg.childNodes[i]);
			}
			return result;
		}
		return arg.childNodes[1];
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["timezone-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-date",
	function(arg) {
		return Fleur.XPathFunctions_fn["timezone-from-dateTime#1"].jsfunc(arg, true, false);
	},
	null, [{type: Fleur.Type_date, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["timezone-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-datTime",
	function(arg, nodate, notime) {
		var dt;
		if (arg === null) {
			return null;
		}
		if (notime) {
			dt = Fleur.toDate(arg);
		} else if (nodate) {
			dt = Fleur.toTime(arg);
		} else {
			dt = Fleur.toDateTime(arg);
		}
		if (dt.tz === null) {
			return null;
		}
		var a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_dayTimeDuration;
		a.data = Fleur.msToDayTimeDuration(dt.tz * 60 * 1000);
		return a;
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["timezone-from-time#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:timezone-from-time",
	function(arg) {
		return Fleur.XPathFunctions_fn["timezone-from-dateTime#1"].jsfunc(arg, false, true);
	},
	null, [{type: Fleur.Type_time, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_fn["tokenize#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input) {
		if (!input || input === "") {
			return null;
		}
		input = input.split(" ");
		if (input[0] === "") {
			input.splice(0, 1);
		}
		if (input[input.length - 1] === "") {
			input.pop();
		}
		return input.length === 1 ? input[0] : input;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "*"});
Fleur.XPathFunctions_fn["tokenize#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input, pattern) {
		return Fleur.XPathFunctions_fn["tokenize#3"].jsfunc(input, pattern, "");
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});
Fleur.XPathFunctions_fn["tokenize#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:tokenize",
	function(input, pattern, flags) {
		pattern = new RegExp(pattern, flags);
		if (!input || input === "") {
			return null;
		}
		input = input.split(pattern);
		var result = [];
		input.forEach(function(t) {
			if (t !== undefined && !pattern.test(t)) {
				result.push(t);
			}
		});
		return result.length === 0 ? "" : result.length === 1 ? result[0] : result;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "*"});
Fleur.XPathFunctions_fn["trace#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n) {
		console.log(Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		return n;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["trace#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label) {
		console.log((label || "") + Fleur.Serializer._serializeNodeToXQuery(n, false, ""));
		return n;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["trace#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:trace",
	function(n, label, serialization) {
		var contentType;
		var indent = false;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				return n;
			}
			contentType = Fleur.toContentType(op2[1],  "application/xquery");
			indent = op2[1].indent === "yes";
		}
		if (!contentType) {
			contentType = "application/xquery";
		}
		var ser = new Fleur.Serializer();
		console.log((label || "") + ser.serializeToString(n, contentType, indent));
		return n;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["translate#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:translate",
	function(arg, mapString, transString) {
		var res = "", i, j, l, tl = transString.length;
		if (arg === null) {
			return "";
		}
		for (i = 0, l = arg.length; i < l; i++) {
			j = mapString.indexOf(arg.charAt(i));
			if (j !== -1) {
				if (j < tl) {
					res += transString.charAt(j);
				}
			} else {
				res += arg.charAt(i);
			}
		}
		return res;
	},
	null, [{type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["true#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:true",
	function() {
		return true;
	},
	null, [], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_fn["type-QName#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:type-QName",
	function(n) {
		var	a = new Fleur.Text();
		a.schemaTypeInfo = Fleur.Type_QName;
		a._setNodeNameLocalNamePrefix(n.schemaTypeInfo ? n.schemaTypeInfo.typeNamespace : "http://www.w3.org/2001/XMLSchema", n.schemaTypeInfo ? n.schemaTypeInfo.typeName : "untypedAtomic");
		return a;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_QName});
Fleur.XPathFunctions_fn["unordered#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:unordered",
	function(sourceSeq) {
		return sourceSeq;
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node, occurence: "*"});
Fleur.XPathFunctions_fn["unparsed-text"] = function(ctx, children, callback) {
	var mediatype = "text/plain";
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSString(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		var docname = op1[1];
		var httpget = docname.startsWith("http://") || Fleur.inBrowser;
		var fileread = docname.startsWith("file://") || !httpget;
		if (httpget) {
			if (docname.startsWith("http://")) {
				docname = docname.substr(7);
			}
			var getp = new Promise(function(resolve, reject) {
				var req = new XMLHttpRequest();
				req.open('GET', docname, true);
				req.onload = function() {
					if (req.status === 200) {
						resolve(req.responseText);
					} else {
						reject(Fleur.error(ctx, "FODC0002"));
			      	}
				};
				req.send(null);
			});
			getp.then(
				function(s) {
					var parser = new Fleur.DOMParser();
					callback(parser.parseFromString(s, mediatype));
				},
				function(a) {
					callback(a);
				}
			);
		} else if (fileread) {
			if (docname.startsWith("file://")) {
				docname = docname.substr(7);
			}
			if (!docname.startsWith(global.path.sep)) {
				docname = global.path.join(Fleur.baseDir, docname);
			}
			global.fs.readFile(docname, 'binary', function(err, file){
				if (err) {
					process.stdout.write(err);
					Fleur.callback(function() {callback();});
				} else {
					var a = new Fleur.Text();
					a.schemaTypeInfo = Fleur.Type_string;
					a.data = file;
					Fleur.callback(function() {callback(a);});
				}
			});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XPathFunctions_fn["upper-case#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:upper-case",
	function(arg) {
		return arg ? arg.toUpperCase() : "";
	},
	null, [{type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_fn["xsi-type#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:xsi-type",
	function(n, ctx) {
		if (!n.schemaTypeInfo || (n.schemaTypeInfo.typeNamespace === "http://www.w3.org/2001/XMLSchema" && (n.schemaTypeInfo.typeName === "untypedAtomic" || n.schemaTypeInfo.typeName === "string"))) {
			return null;
		}
		var	a = new Fleur.Attr();
		a.nodeName = "xsi:type";
		a.localName = "type";
		a.namespaceURI = "http://www.w3.org/2001/XMLSchema-instance";
		var t = new Fleur.Text();
		t.data = ctx.env.nsresolver.lookupPrefix(n.schemaTypeInfo.typeNamespace) + ":" + n.schemaTypeInfo.typeName;
		a.appendChild(t);
		return a;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["year-from-date#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:year-from-date",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^(\d{4})-\d{2}-\d{2}(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_date, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["year-from-dateTime#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:year-from-dateTime",
	function(arg) {
		return arg !== null ? parseInt(arg.match(/^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})?$/)[1], 10) : null;
	},
	null, [{type: Fleur.Type_dateTime, occurence: "?"}], true, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["years-from-duration#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:years-from-duration",
	function(arg) {
		var a = Fleur.Atomize(arg);
		var d;
		if (a === Fleur.EmptySequence) {
			return null;
		}
		if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
			return 0;
		}
		if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
			d = Fleur.toJSONYearMonthDuration(a.data);
			return d.sign * d.year;
		}
		if (a.schemaTypeInfo === Fleur.Type_duration) {
			d = Fleur.toJSONDuration(a.data);
			return d.sign * d.year;
		}
		var e = new Error("");
		e.name = "XPTY0004";
		return e;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_fn["zero-or-one#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:zero-or-one",
	function(arg, ctx) {
		if (arg.nodeType === Fleur.Node.SEQUENCE_NODE && arg.childNodes && arg.childNodes.length > 1) {
			return Fleur.error(ctx, "FORG0003");
		}
		return arg;
	},
	null, [{type: Fleur.Node, occurence: "*"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_fn["analyze-string"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["apply"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["available-environment-variables"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["collation-key"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["collection"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["element-with-id"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["environment-variable"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["filter"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["fold-left"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["fold-right"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["for-each"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["for-each-pair"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["generate-id"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["idref"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["in-scope-prefixes"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["innermost"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["json-doc"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["lang"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["load-xquery-module"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["local-name-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["namespace-uri-for-prefix"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["namespace-uri-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["outermost"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-json"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["parse-xml-fragment"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["path"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["prefix-from-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["random-number-generator"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["resolve-QName"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["resolve-uri"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["root"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["static-base-uri"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["transform"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-available"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["unparsed-text-lines"] = function(ctx, children) {};
Fleur.XPathFunctions_fn["uri-collection"] = function(ctx, children) {};
Fleur.XPathFunctions_http["send-request#1"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, callback) {
		return Fleur.XPathFunctions_http["send-request#3"].jsfunc(request, null, null, callback);
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_http["send-request#2"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, href, callback) {
		return Fleur.XPathFunctions_http["send-request#3"].jsfunc(request, href, null, callback);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}], false, true, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_http["send-request#3"] = new Fleur.Function("http://expath.org/ns/http-client", "http:send-request",
	function(request, href, body, callback) {
		var method = request.getAttribute("method");
		href = href || request.getAttribute("href");
		if (body === Fleur.EmptySequence) {
			body = null;
		}
		if (body) {
			var b2 = body.documentElement || body;
			var contenttype;
			switch (b2.nodeType) {
				case Fleur.Node.ELEMENT_NODE:
					if (b2.nodeName === "html") {
						if (body.nodeType === Fleur.Node.DOCUMENT_NODE) {
							for (var i = 0, l = body.childNodes.length; i < l; i++) {
								if (body.childNodes[i].nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE && body.childNodes[i].nodeName === "xml-stylesheet") {
									contenttype = "application/xml";
									break;
								}
							}
						}
						contenttype = "text/html";
						break;
					}
					contenttype = "application/xml";
					break;
				case Fleur.Node.SEQUENCE_NODE:
					contenttype = "application/xml";
					break;
				case Fleur.Node.MAP_NODE:
					contenttype = "application/json";
					break;
				default:
					contenttype = "text/plain";
			}
			var ser = new Fleur.Serializer();
			body = ser.serializeToString(body, contenttype);
		}
		var parser = new Fleur.DOMParser();
		var seq = new Fleur.Sequence();
		var elt = new Fleur.Element();
		elt.nodeName = "http:response";
		elt.namespaceURI = "http://expath.org/ns/http-client";
		elt.localName = "response";
		elt.prefix = "http";
		elt.childNodes = new Fleur.NodeList();
		elt.children = new Fleur.NodeList();
		elt.textContent = "";
		seq.appendChild(elt);
		var doc;
		try {
			if (global && global.http) {
				var options = global.url.parse(href);
				options.method = (method || "GET").toUpperCase();
				options.headers = {};
				if (body) {
					options.headers["Content-Type"] = contenttype;
					options.headers["Content-Length"] = body.length;
				}
				var resdata = "";
				var hreq = global.http.request(options, function(res) {
					res.setEncoding("utf8");
					res.on("data", function(chunk) {
						resdata += chunk;
					});
					res.on("end", function() {
						if (resdata !== "") {
							doc = parser.parseFromString(resdata, res.headers["Content-Type"] || res.headers["content-type"] || contenttype);
							seq.appendChild(doc);
						}
						callback(seq);
					});
				});
				hreq.on("error", function(e) {
					callback(e);
				});
				if (body) {
					hreq.write(body);
				}
				hreq.end();
				return;
			}
		} catch (e) {
			var req = new XMLHttpRequest();
			req.addEventListener("load", function() {
				if (req.responseText !== "") {
					var mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : "application/xml";
					var lines = mediatype.split(";");
					doc = parser.parseFromString(req.responseText, lines[0]);
					seq.appendChild(doc);
				}
				callback(seq);
			});
			req.open(method.toUpperCase(), href);
			if (!body || body === Fleur.EmptySequence) {
				req.send();
			} else {
				req.setRequestHeader("Content-Type", contenttype);
				req.send(body);
			}
		}
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_dgram["socket-create#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-create",
	function(protocol) {
		console.log("create");
		return global.dgram.createSocket(protocol);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_handler});
Fleur.XPathFunctions_dgram["socket-send#4"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-send",
	function(sock, packet, address, port, callback) {
		console.log(packet[6].toString(16) + ":" + packet[7].toString(16) + ":" + packet[8].toString(16) + ":" + packet[9].toString(16) + ":" + packet[10].toString(16) + ":" + packet[11].toString(16) + " " + address + ":" + port);
		callback(null);
	},
	null, [{type: Fleur.Type_handler}, {type: Fleur.Type_integer, occurence: "+"}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_port}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_dgram["socket-close#1"] = new Fleur.Function("http://www.agencexml.com/fleur/dgram", "dgram:socket-close",
	function(sock) {
		console.log("close");
		sock.close();
	},
	null, [{type: Fleur.Type_handler}], false, false, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_excel["c-from-ref#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:c-from-ref",
	function(arg) {
		var i = 0, l = arg.length, column = 0, c = arg.charCodeAt(i);
		while (i < l && c >= 65 && c <= 90) {
			column = column * 26 + c - 64;
			c = arg.charCodeAt(++i);
		}
		return column;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_excel["r-from-ref#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:r-from-ref",
	function(arg) {
		var i = 0, l = arg.length, row = 0, c = arg.charCodeAt(i);
		while (i < l && c >= 65 && c <= 90) {
			i++;
		}
		while (i < l && c >= 48 && c <= 57) {
			row = row * 10 + c - 48;
			c = arg.charCodeAt(++i);
		}
		return row;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_integer});
Fleur.XPathFunctions_excel["rc-to-ref#2"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:rc-to-ref",
	function(row, column) {
		var column = column - 1, s = "";
		while (column > 25) {
			s = String.fromCharCode(65 + (column % 26)) + s;
			column = Math.round((column - (column % 26)) / 26) - 1;
		}
		s = String.fromCharCode(65 + column) + s;
		return s + String(row);
	},
	null, [{type: Fleur.Type_integer}, {type: Fleur.Type_integer}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_excel["values#1"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, null, false, false);
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_excel["values#2"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, false, false);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_excel["values#3"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader) {
		return Fleur.XPathFunctions_excel["values#4"].jsfunc(book, range, rheader, false);
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_excel["values#4"] = new Fleur.Function("http://schemas.openxmlformats.org/spreadsheetml/2006/main", "excel:values",
	function(book, range, rheader, cheader) {
		var i, l, n;
		if (book === null) {
			return Fleur.EmptySequence;
		}
		var sheetname, sheetrid, sheetfname;
		range = range || "";
		rheader = rheader || false;
		cheader = cheader || false;
		if (range.indexOf("!") !== -1) {
			sheetname = range.substr(0, range.indexOf("!"));
			range = range.substr(range.indexOf("!") + 1);
		}
		var shs = book.firstChild.getEntryNode("xl/sharedStrings.xml");
		var shsdoc;
		var sharedstrings = [];
		if (shs) {
			shs = shs.firstChild;
			if (!shs.hasEntry("doc")) {
				shsdoc = book.createEntry("doc");
				Fleur.DOMParser._appendFromXMLString(shsdoc, Fleur.bin2utf8(Fleur.inflate(shs.getEntryNode("compressedFileData").textContent)));
				shs.setEntryNode(shsdoc);
			} else {
				shsdoc = shs.getEntryNode("doc");
			}
			n = shsdoc.firstChild;
			while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
				n = n.nextSibling;
			}
			n = n.firstChild;
			while (n !== null) {
				if (n.localName === "si") {
					sharedstrings.push(n.children[0].textContent);
				}
				n = n.nextSibling;
			}
		}
		var wb = book.firstChild.getEntryNode("xl/workbook.xml").firstChild;
		var wbdoc;
		if (!wb.hasEntry("doc")) {
			wbdoc = book.createEntry("doc");
			Fleur.DOMParser._appendFromXMLString(wbdoc, Fleur.bin2utf8(Fleur.inflate(wb.getEntryNode("compressedFileData").textContent)));
			wb.setEntryNode(wbdoc);
		} else {
			wbdoc = wb.getEntryNode("doc");
		}
		n = wbdoc.firstChild;
		while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
			n = n.nextSibling;
		}
		n = n.firstChild;
		while (n !== null && n.localName !== "sheets") {
			n = n.nextSibling;
		}
		if (!sheetname) {
			sheetrid = n.children[0].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
		} else {
			for (i = 0, l = n.children.length; i < l; i++) {
				if (n.children[i].getAttribute("name") === sheetname) {
					sheetrid = n.children[i].getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
					break;
				}
			}
		}
		if (sheetrid) {
			var wbrels = book.firstChild.getEntryNode("xl/_rels/workbook.xml.rels").firstChild;
			var wbrelsdoc;
			if (!wbrels.hasEntry("doc")) {
				wbrelsdoc = book.createEntry("doc");
				Fleur.DOMParser._appendFromXMLString(wbrelsdoc, Fleur.bin2utf8(Fleur.inflate(wbrels.getEntryNode("compressedFileData").textContent)));
				wbrels.setEntryNode(wbrelsdoc);
			} else {
				wbrelsdoc = wbrels.getEntryNode("doc");
			}
			n = wbrelsdoc.firstChild;
			while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
				n = n.nextSibling;
			}
			n = n.firstChild;
			while (n !== null && n.getAttribute("Id") !== sheetrid) {
				n = n.nextSibling;
			}
			if (n !== null) {
				sheetfname = "xl/" + n.getAttribute("Target");
				var sheetdoc, sheet = book.firstChild.getEntryNode(sheetfname).firstChild;
				if (!sheet.hasEntry("doc")) {
					sheetdoc = book.createEntry("doc");
					Fleur.DOMParser._appendFromXMLString(sheetdoc, Fleur.bin2utf8(Fleur.inflate(sheet.getEntryNode("compressedFileData").textContent)));
					sheet.setEntryNode(sheetdoc);
				} else {
					sheetdoc = sheet.getEntryNode("doc");
				}
				n = sheetdoc.firstChild;
				while (n !== null && n.nodeType !== Fleur.Node.ELEMENT_NODE) {
					n = n.nextSibling;
				}
				n = n.firstChild;
				if (n.localName === "dimension") {
					range = n.getAttribute("ref");
				}
				var maxrow = 0;
				var maxcolumn = 0;
				var cell = function(s, defrow, defcolumn) {
					s = s.toUpperCase();
					var ii = 0, ll = s.length, row = 0, column = 0, c = s.charCodeAt(ii);
					while (ii < ll && c >= 65 && c <= 90) {
						column = column * 26 + c - 64;
						c = s.charCodeAt(++ii);
					}
					if (ii === 0) {
						column = defcolumn;
					} else {
						column--;
					}
					if (ii === ll) {
						row = defrow;
					} else {
						while (ii < ll && c >= 48 && c <= 57) {
							row = row * 10 + c - 48;
							c = s.charCodeAt(++ii);
						}
						row--;
					}
					return {row: row, column: column};
				};
				var cells = [];
				while (n !== null && n.localName !== "sheetData") {
					n = n.nextSibling;
				}
				if (n.localName === "sheetData") {
					n = n.firstChild;
					while (n !== null) {
						if (n.localName === "row") {
							var n2 = n.firstChild;
							while (n2 !== null) {
								if (n2.localName === "c") {
									var cref = cell(n2.getAttribute("r"));
									var ctype = n2.getAttribute("t");
									if (n2.children[0]) {
										var cvalue = n2.children[0].textContent;
										if (ctype === "s") {
											cvalue = sharedstrings[parseInt(cvalue, 10)];
										} else if (cvalue.indexOf(".0") !== -1) {
											cvalue = cvalue.substr(0, cvalue.indexOf(".0"));
										}
										if (!cells[cref.row]) {
											cells[cref.row] = [];
										}
										cells[cref.row][cref.column] = cvalue;
										maxrow = Math.max(maxrow, cref.row);
										maxcolumn = Math.max(maxcolumn, cref.column);
									}
								}
								n2 = n2.nextSibling;
							}
						}
						n = n.nextSibling;
					}
				}
				var firstcell, lastcell;
				if (range.indexOf(":") !== -1) {
					range = range.split(":");
					firstcell = cell(range[0], 0, 0);
					lastcell = cell(range[1], maxrow, maxcolumn);
				} else {
					firstcell = cell(range, 0, 0);
					lastcell = cell(range, maxrow, maxcolumn);
				}
				var seq = new Fleur.Sequence();
				if (rheader) {
					seq.rowlabels = [];
					for (var r = cheader ? firstcell.row + 1 : firstcell.row; r <= lastcell.row; r++) {
						seq.rowlabels.push(cells[r][firstcell.column]);
					}
					firstcell.column++;
				}
				if (cheader) {
					seq.collabels = cells[firstcell.row].slice(firstcell.column, lastcell.column + 1);
					firstcell.row++;
				}
				for (var currow = firstcell.row; currow <= lastcell.row; currow++) {
					var m;
					if (firstcell.row !== lastcell.row) {
						m = new Fleur.Multidim();
					} else {
						m = seq;
					}
					for (var curcol = firstcell.column; curcol <= lastcell.column; curcol++) {
						var a = new Fleur.Text();
						a.data = cells[currow] ? cells[currow][curcol] || "" : "";
						a.schemaTypeInfo = Fleur.Type_string;
						m.appendChild(a);
					}
					if (m !== seq) {
						seq.appendChild(m);
					}
				}
				return seq;
			}
		}
		return Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}, {type: Fleur.Type_boolean, occurence: "?"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_ietf["email#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:email",
	function(message, callback) {
		return Fleur.XPathFunctions_ietf["email#2"].jsfunc(message, null, callback);
	},
	null, [{type: Fleur.Node}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_ietf["email#2"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:email",
	function(message, options, callback) {
		var cmd = "Send-MailMessage ";
		var toString = function (n) {
			return '"' + n.textContent + '"';
		};
		var QName = function (n) {
			return "Q{" + n.namespaceURI + "}" + n.localName;
		};
		var addressformat = function(n) {
			return "'" + n.children.map(function(m) {
				switch (QName(m)) {
					case "Q{URN:ietf:params:email-xml:}name":
						return m.textContent.replace(/'/g, "''");
					case "Q{URN:ietf:params:email-xml:}adrs":
						return "<" + m.textContent.replace(/'/g, "''") + ">";
				}
			}).sort(function(a, b) { return a < b ? 1 : -1; }).join(" ") +"'";
		};
		cmd += message.children.map(function(n) {
			switch (QName(n)) {
				case "Q{URN:ietf:params:rfc822:}subject":
					return "-Subject '" + n.textContent.replace(/'/g, "''") + "'";
				case "Q{URN:ietf:params:rfc822:}from":
					return "-From " + addressformat(n.children[0]);
				case "Q{URN:ietf:params:rfc822:}to":
					return "-To " + n.children.map(addressformat).join(", ");
				case "Q{URN:ietf:params:email-xml:}content":
					if (QName(n.children[0]) === "Q{http://www.w3.org/1999/xhtml}html") {
						return "-BodyAsHtml -Body '" + Fleur.Serializer._serializeHTMLToString(n.children[0]).replace(/\n/g, "") + "'";
					}
					return "-Body '" + n.textContent + "'";
			}
		}).join(" ");
		if (options && options !== Fleur.EmptySequence) {
			cmd += " " + options.children.map(function(n) {
				switch (n.localName) {
					case "authentication":
						return "-Credential (New-Object Management.Automation.PSCredential " + n.children.sort(function(a, b) {
							var nameorder = ["username", "password"];
							return nameorder.indexOf(a.localName) < nameorder.indexOf(b.localName) ? -1 : 1;
						}).map(function(m) {
							switch (m.localName) {
								case "username":
									return toString(m);
								case "password":
									return "(ConvertTo-SecureString " + toString(m) + " -AsPlainText -Force)";
							}
						}).join(", ") + ")";
					case "verify-cert":
						return "-UseSsl";
					case "smtp-server":
						return "-SmtpServer " + toString(n);
					case "port":
						return "-Port " + n.textContent;
				}
			}).join(" ");
		}
		cmd += " -Encoding ([System.Text.Encoding]::UTF8)";
		console.log(cmd);
		cmd = "%SystemRoot%\\system32\\WindowsPowerShell\\v1.0\\powershell.exe -NoProfile -NoLogo -NonInteractive -ExecutionPolicy Bypass \"& {chcp 65001 ; $ProgressPreference='SilentlyContinue' ; " + cmd + "}\"";
		global.child_process.exec(cmd, {windowsHide: true}, function(err, stdout, stderr) {
			if (err) {
				err.name = "FOPR0001";
				callback(err);
			} else if (stderr) {
				var e = new Error(stderr);
				e.name = "FOPR0001";
				callback(e);
			} else {
				callback();
			}
		});
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_ietf["ipv4"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_ipv4, function() {}, callback);
};
Fleur.XPathFunctions_ietf["mac#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:mac",
	function(macaddress) {
		var result = new Fleur.Text();
		result.schemaTypeInfo = Fleur.Type_mac;
		result.data = "";
		var i, l;
		for (i = 0, l = macaddress.length; i < l; i++) {
			if ("0123456789ABCDEFabcdef".indexOf(macaddress.charAt(i)) !== -1) {
				result.data += (result.data === "" ? "" : ":") + (macaddress.charAt(i) + macaddress.charAt(i + 1)).toLowerCase();
				i++;
			}
		}
		return result;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_mac});
Fleur.XPathFunctions_ietf["on-subnet#3"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "ietf:on-subnet",
	function(address, mask, subnet) {
		address = address.split('.').map(function(i) {return parseInt(i, 10);});
		mask = mask.split('.').map(function(i) {return parseInt(i, 10);});
		subnet = subnet.split('.').map(function(i) {return parseInt(i, 10);});
		return address.reduce(function(a, c, i) {return a && ((c & mask[i]) === subnet[i]);}, true);
	},
	null, [{type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}, {type: Fleur.Type_ipv4}], false, false, {type: Fleur.Type_boolean});
Fleur.XPathFunctions_ietf["port"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Type_port, function() {}, callback);
};
Fleur.XPathFunctions_internal["get-id#1"] = new Fleur.Function("https://tools.ietf.org/rfc/index", "internal:get-id",
	function(node) {
		if (node === Fleur.EmptySequence) {
			return null;
		}
		return node.internal_id || "undefined";
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_map["merge#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:merge",
	function(maps) {
		return Fleur.XPathFunctions_map["merge#2"].jsfunc(maps, null);
	},
	null, [{type: Fleur.Node, occurence: "*"}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_map["merge#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:merge",
	function(maps, options) {
		var e, i, l;
		if (maps.nodeType === Fleur.Node.MAP_NODE) {
			return maps.copyNode();
		}
		e = new Error("The dynamic type of a value does not match a required type for Q{http://www.w3.org/2005/xpath-functions/map}merge#" + (options ? "2" : "1"));
		e.name = "XPTY0004";
		if (maps.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return e;
		}
		var duplicates;
		if (!options) {
			duplicates = "use-first";
		} else {
			var dentry = options.getEntryNode("duplicates");
			duplicates = dentry ? dentry.textContent : "use-first";
		}
		if (maps.childNodes[0].nodeType !== Fleur.Node.MAP_NODE) {
			return e;
		}
		var map = maps.childNodes[0].copyNode();
		for (i = 1, l = maps.childNodes.length; i < l; i++) {
			var extend = maps.childNodes[i].copyNode();
			extend.entries.forEach(function(exent) {
				if (map.hasEntry(exent.nodeName)) {
					switch (duplicates) {
						case "use-last":
							map.setEntryNode(exent.copyNode());
							break;
					}
				} else {
					map.setEntryNode(exent.copyNode());
				}
			});
		}
		return map;
	},
	null, [{type: Fleur.Node, occurence: "*"}, {type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_map["put#3"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:put",
	function(m, k, v) {
		var map = new Fleur.Map();
		var a = Fleur.Atomize(k);
		var i = 0, l = m.entries.length;
		while (i < l) {
			if (m.entries[i].nodeName !== a.nodeValue) {
				map.setEntryNode(m.entries[i].cloneNode(true));
			}
			i++;
		}
		var entry = new Fleur.Entry();
		entry.nodeName = a.nodeValue;
		entry.namespaceURI = null;
		entry.localName = a.nodeValue;
		entry.appendChild(v.cloneNode(true));
		map.setEntryNode(entry);
		return map;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node}, {type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_map["remove#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/map", "map:remove",
	function(m, k) {
		var map = new Fleur.Map();
		var a = Fleur.Atomize(k);
		var i = 0, l = m.entries.length;
		while (i < l) {
			if (m.entries[i].nodeName !== a.nodeValue) {
				map.setEntryNode(m.entries[i].cloneNode(true));
			}
			i++;
		}
		return map;
	},
	null, [{type: Fleur.Node}, {type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_math["acos#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:acos",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.acos(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["asin#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:asin",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.asin(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["atan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.atan(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["atan2#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:atan2",
	function(arg1, arg2) {
		return Math.atan2(Number(arg1), Number(arg2));},
	null, [{type: Fleur.numericTypes}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["cos#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:cos",
	function(theta) {
		if (theta === null) {
			return null;
		}
		return Math.cos(Number(theta));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["exp#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:exp",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.exp(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["exp10#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:exp10",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.pow(10, Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["log#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:log",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.log(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["log10#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:log10",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.log10(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["pi#0"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pi",
	function() { return 3.141592653589793; },
	null, [], false, false, {type: Fleur.Type_double});
Fleur.XPathFunctions_math["pow#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:pow",
	function(x, y) {
		if (x === null) {
			return null;
		}
		return y >= 0 && typeof x === "bigint" && typeof y === "bigint" ? eval("x ** y") : Math.pow(Number(x), Number(y));},
	null, [{type: Fleur.numericTypes, occurence: "?"}, {type: Fleur.numericTypes}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["sin#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:sin",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sin(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["sqrt#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:sqrt",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.sqrt(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_math["tan#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions/math", "math:tan",
	function(arg) {
		if (arg === null) {
			return null;
		}
		return Math.tan(Number(arg));},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Type_double, occurence: "?"});
Fleur.XPathFunctions_matrix["identity#1"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:identity",
	function(arg) {
		if (arg === null) {
			return Fleur.EmptySequence;
		}
		var result;
		if (arg === 1) {
			result = new Fleur.Text();
			result.data = "1";
			result.schemaTypeInfo = Fleur.Type_integer;
		} else {
			result = new Fleur.Sequence();
			for (var i = 0; i < arg; i++) {
				var m = new Fleur.Multidim();
				for (var j = 0; j < arg; j++) {
					var n = new Fleur.Text();
					n.data = i === j ? "1" : "0";
					n.schemaTypeInfo = Fleur.Type_integer;
					m.appendChild(n);
				}
				result.appendChild(m);
			}
		}
		return result;
	},
	null, [{type: Fleur.numericTypes, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_matrix["labels#2"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:labels",
	function(collabels, arg) {
		return Fleur.XPathFunctions_matrix["labels#3"].jsfunc(Fleur.EmptySequence, collabels, arg);
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_matrix["labels#3"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:labels",
	function(rowlabels, collabels, arg) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		var atomlabels = function(n) {
			var a;
			var res = [];
			if (n === Fleur.EmptySequence) {
				return null;
			}
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				n.childNodes.forEach(function(n2) {
					a = Fleur.Atomize(n2);
					res.push(a.data);
				});
			} else {
				a = Fleur.Atomize(n);
				res.push(a.data);
			}
			return res;
		};
		var seq = new Fleur.Sequence();
		arg.childNodes.forEach(function(child) {
			seq.appendChild(child);
		});
		seq.rowlabels = atomlabels(rowlabels);
		seq.collabels = atomlabels(collabels);
		return seq;
	},
	null, [{type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_matrix["transpose#1"] = new Fleur.Function("http://www.mathunion.org/matrix", "matrix:transpose",
	function(arg) {
		if (arg === Fleur.EmptySequence) {
			return Fleur.EmptySequence;
		}
		if (arg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			return arg;
		}
		var result = new Fleur.Sequence();
		result.rowlabels = arg.collabels;
		result.collabels = arg.rowlabels;
		if (arg.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
			var newnbrow = arg.childNodes[0].childNodes.length;
			if (newnbrow === 1) {
				arg.childNodes.forEach(function(n) {
					result.appendChild(n.childNodes[0]);
				});
			} else {
				var newnbcol = arg.childNodes.length;
				for (var i = 0; i < newnbrow; i++) {
					var newm = new Fleur.Multidim();
					for (var j = 0; j < newnbcol; j++) {
						newm.appendChild(arg.childNodes[j].childNodes[i]);
					}
					result.appendChild(newm);
				} 
			}
		} else {
			arg.childNodes.forEach(function(n) {
				var m = new Fleur.Multidim();
				m.appendChild(n);
				result.appendChild(m);
			});
		}
		return result;
	},
	null, [{type: Fleur.Node, occurence: "?"}], false, false, {type: Fleur.Node, occurence: "?"});
Fleur.XPathFunctions_file["base-dir"] = function(ctx, children, callback) {
	if (children.length !== 0) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var result = Fleur.EmptySequence;
	Fleur.callback(function() {callback(result);});
};
Fleur.XPathFunctions_file["children#1"] = new Fleur.Function("http://expath.org/ns/file", "file:children",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (err) {
				callback(err);
				return;
			}
			if (stats.isFile()) {
				callback(null);
				return;
			}
			global.fs.readdir(path, function(err, files) {
				if (err) {
					callback(err);
					return;
				}
				if (files.length === 0) {
					callback(null);
					return;
				}
				path = global.path.resolve(path);
				files = files.map(function(file) {
					return global.path.join(path, file);
				});
				if (files.length === 1) {
					callback(files[0]);
					return;
				}
				callback(files);
			});
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_string, occurence: "*"});
Fleur.XPathFunctions_file["copy#2"] = new Fleur.Function("http://expath.org/ns/file", "file:copy",
	function(source, target, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.copyFile(source, target, function(err) {
			callback(err ? err : null);
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["create-dir#1"] = new Fleur.Function("http://expath.org/ns/file", "file:create-dir",
	function(dir, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.mkdir(dir, function(err) {
			callback(err ? err : null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["current-dir#0"] = new Fleur.Function("http://expath.org/ns/file", "file:current-dir",
	function() { return process ? process.cwd() : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["delete#1"] = new Fleur.Function("http://expath.org/ns/file", "file:delete",
	function(path, callback) {
		return Fleur.XPathFunctions_file["delete#2"].jsfunc(path, false, callback);
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["delete#2"] = new Fleur.Function("http://expath.org/ns/file", "file:delete",
	function(path, recursive, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (err) {
				callback(err);
				return;
			}
			if (stats.isFile()) {
				global.fs.unlink(path, function(err) {
					if (err) {
						callback(err);
						return;
					}
					callback(null);
				});
			} else {
				if (recursive) {
					var rdel = function(paths, cb) {
						var cpath = paths.shift();
						var nextdel = function(err) {
							if (err) {
								callback(err);
								return;
							}
							if (paths.length !== 0) {
								rdel(paths, cb);
							} else {
								cb(null);
							}
						};
						global.fs.stat(cpath, function(err, stats) {
							if (err) {
								callback(err);
								return;
							}
							if (stats.isFile()) {
								global.fs.unlink(cpath, nextdel);
								return;
							}
							global.fs.readdir(cpath, function(err, files) {
								if (err) {
									callback(err);
									return;
								}
								if (files.length === 0) {
									global.fs.rmdir(path, nextdel);
									return;
								}
								rdel(files.map(function(file) {
										return global.path.join(cpath, file);
									}), function(err) {
									if (err) {
										callback(err);
										return;
									}
									global.fs.rmdir(cpath, nextdel);
								});
								return;
							});
						});
					};
					rdel([path], callback);
					return;
				}
				global.fs.readdir(path, function(err, files) {
					if (err) {
						callback(err);
						return;
					}
					if (files.length === 0) {
						global.fs.rmdir(path, function(err) {
							if (err) {
								callback(err);
								return;
							}
							callback(null);
						});
						return;
					}
					callback(null);
				});
			}
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_boolean}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["dir-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:dir-separator",
	function() { return global.path ? global.path.sep : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["exists#1"] = new Fleur.Function("http://expath.org/ns/file", "file:exists",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.access(path, function(err) {
			callback(!err);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-absolute#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-absolute",
	function(path) {
		return global.path ? String(global.path.isAbsolute(path)) : null;
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-dir#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-dir",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			callback(!err && stats.isDirectory());
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["is-file#1"] = new Fleur.Function("http://expath.org/ns/file", "file:is-file",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			callback(!err && stats.isFile());
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_boolean, occurence: "?"});
Fleur.XPathFunctions_file["last-modified#1"] = new Fleur.Function("http://expath.org/ns/file", "file:last-modified",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (!err) {
				callback(stats.mtime);
				return;
			}
			callback(null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_dateTime, occurence: "?"});
Fleur.XPathFunctions_file["line-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:line-separator",
	function() { return global.os ? global.os.EOL : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["move#2"] = new Fleur.Function("http://expath.org/ns/file", "file:move",
	function(source, target, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.rename(source, target, function(err) {
			callback(!err);
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["name#1"] = new Fleur.Function("http://expath.org/ns/file", "file:name",
	function(path) {
		var spl = path.replace("\\", "/").split("/");
		if (spl.length > 0) {
			return spl[spl.length - 1];
		}
		return "";
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_file["path-separator#0"] = new Fleur.Function("http://expath.org/ns/file", "file:path-separator",
	function() { return global.path ? global.path.delimiter : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["resolve-path#1"] = new Fleur.Function("http://expath.org/ns/file", "file:resolve-path",
	function(path) {
		if (!global.path) {
			return;
		}
		return global.path.resolve(path);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_file["size#1"] = new Fleur.Function("http://expath.org/ns/file", "file:size",
	function(path, callback) {
		if (!global.fs) {
			callback(null);
			return;
		}
		global.fs.stat(path, function(err, stats) {
			if (!err) {
				callback(stats.isFile() ? stats.size : 0);
				return;
			}
			callback(null);
		});
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_integer, occurence: "?"});
Fleur.XPathFunctions_file["temp-dir#0"] = new Fleur.Function("http://expath.org/ns/file", "file:temp-dir",
	function() { return global.os ? global.os.tmpdir() : null; },
	null, [], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_file["write#2"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, ctx, callback) {
		return Fleur.XPathFunctions_file["write#3"].jsfunc(filename, node, null, ctx, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_file["write#3"] = new Fleur.Function("http://expath.org/ns/file", "file:write",
	function(filename, node, serialization, ctx, callback) {
		var contentType;
		var indent = false;
		var encoding;
		if (serialization) {
			var a2 = Fleur.Atomize(serialization);
			var	op2 = Fleur.toJSObject(a2);
			if (op2[0] < 0) {
				callback(a2);
				return;
			}
			serialization = op2[1];
			contentType = Fleur.toContentType(serialization, Fleur.extension2contentType[global.path.extname(filename).toLowerCase()] || "application/xml");
			indent = serialization.indent === "yes";
			if (serialization["encoding"]) {
				encoding = Fleur.encoding2encoding[serialization["encoding"].toLowerCase()];
			}
		}
		if (!contentType) {
			contentType = Fleur.extension2contentType[global.path.extname(filename).toLowerCase()] || "application/xml";
		}
		var ser = new Fleur.Serializer();
		if (!encoding) {
			encoding = "utf8";
		}
		global.fs.writeFile(filename, (encoding === "utf8" ? '\ufeff' : '') + ser.serializeToString(node, contentType, indent), encoding, function(err) {
			if (err) {
				callback(Fleur.error(ctx, "FODC0002"));
			} else {
				callback(Fleur.EmptySequence);
			}
		});
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Node, occurence: "?"}, {type: Fleur.Node, occurence: "?"}], true, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_prof["sleep#1"] = new Fleur.Function("http://basex.org/modules/proc", "prof:sleep",
	function(ms, callback) {
		if (ms > 0) {
			setTimeout(function() {
				callback(null);
			}, Number(ms));
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_integer}], false, true, {type: Fleur.EmptySequence});
Fleur.XPathFunctions_proc["property#1"] = new Fleur.Function("http://basex.org/modules/proc", "proc:property",
	function(pname) {
		switch (pname) {
			case "host-name":
				if (process) {
					return global.os.hostname();
				}
				return null;
			case "host-addresses":
				if (process) {
					var addrs = '';
					var interfs = global.os.networkInterfaces();
					for (var interf in interfs) {
						if (interfs.hasOwnProperty(interf)) {
							if (interfs[interf].length !== 0 && interfs[interf][0].mac !== "00:00:00:00:00:00") {
								if (addrs !== "" && interfs[interf].length !== 0) {
									addrs += " /";
								}
								if (interfs[interf].length !== 0) {
									if (addrs === "") {
										addrs = interfs[interf][0].mac;
									} else {
										addrs += " " + interfs[interf][0].mac;
									}
								}
								interfs[interf].forEach(function(e) {
									if (addrs === "") {
										addrs = e.address;
									} else {
										addrs += ' ' + e.address;
									}
								});
							}
						}
					}
					return addrs;
				}
				return null;
			case "host-engine":
				if (process) {
					var filename = global.path.basename(process.argv[1]);
					if (!filename.endsWith(".js")) {
						filename += ".js";
					}
					var filestats = global.fs.statSync(filename);
					return global.os.platform() + ' ' + global.os.release() + " nodeJS " + process.version + " " + global.path.basename(filename) + " " + filestats.mtime.toISOString();
				}
				return navigator.userAgent;
			case "xquery-engine":
				return "Fleur.js " + global.fleurmtime;
			default:
				return null;
		}
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_proc["system#1"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, callback) {
		return Fleur.XPathFunctions_proc["system#3"].jsfunc(cmd, null, null, callback);
	},
	null, [{type: Fleur.Type_string}], false, true, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_proc["system#2"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, args, callback) {
		return Fleur.XPathFunctions_proc["system#3"].jsfunc(cmd, args, null, callback);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "*"}], false, true, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_proc["system#3"] = new Fleur.Function("http://basex.org/modules/proc", "proc:system",
	function(cmd, args, options, callback) {
		if (cmd !== "" && global.child_process) {
			var cmdline = cmd.indexOf(" ") !== -1 ? '"' + cmd + '"' : cmd;
			if (args) {
				args.forEach(function(arg) {
					cmdline += arg.indexOf(" ") !== -1 ? ' "' + arg + '"' : " " + arg;
				});
			}
			global.child_process.exec(cmdline, {windowsHide: true}, function(err, stdout, stderr) {
				if (err) {
					err.name = "FOPR0001";
					callback(err);
				} else if (stderr) {
					var e = new Error(stderr);
					e.name = "FOPR0001";
					callback(e);
				} else {
					callback(stdout);
				}
			});
			return;
		}
		callback(null);
	},
	null, [{type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "*"}, {type: Fleur.Node, occurence: "?"}], false, true, {type: Fleur.Type_string, occurence: "?"});
Fleur.XPathFunctions_request["body-doc#0"] = new Fleur.Function("http://exquery.org/ns/request", "request:body-doc",
	function(ctx) {
		return Fleur.XPathFunctions_request["body-doc#1"].jsfunc(null, ctx);
	},
	null, [], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_request["body-doc#1"] = new Fleur.Function("http://exquery.org/ns/request", "request:body-doc",
	function(serialization, ctx) {
		if (ctx.env.request && ctx.env.request.body) {
			var contentType;
			if (serialization) {
				var a2 = Fleur.Atomize(serialization);
				var	op2 = Fleur.toJSObject(a2);
				if (op2[0] < 0) {
					return a2;
				}
				serialization = op2[1];
				contentType = Fleur.toContentType(serialization);
			}
			if (!contentType) {
				contentType = ctx.env.request.headers["Content-Type"] || ctx.env.request.headers["content-type"];
			}
			var parser = new Fleur.DOMParser();
			return parser.parseFromString(ctx.env.request.body, contentType);
		}
		return Fleur.EmptySequence;
	},
	null, [{type: Fleur.Node, occurence: "?"}], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_request["query-map#0"] = new Fleur.Function("http://exquery.org/ns/request", "request:query-map",
	function(ctx) {
		var map = new Fleur.Map();
		if (ctx.env.request && ctx.env.request.query) {
			ctx.env.request.query.split("&").forEach(function (p) {
				p = p.split("=");
				var entry = new Fleur.Entry();
				entry.nodeName = p[0];
				entry.namespaceURI = null;
				entry.localName = p[0];
				var text = new Fleur.Text();
				text.schemaTypeInfo = Fleur.Type_string;
				text.nodeValue = decodeURIComponent(p[1]);
				entry.appendChild(text);
				map.setEntryNode(entry);
			});
		}
		return map;
	},
	null, [], true, false, {type: Fleur.Node});
Fleur.XPathFunctions_unit["information#1"] = new Fleur.Function("http://www.agencexml.com/fleur/unit", "unit:information",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.agencexml.com/fleur/unit"]["information"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xquery["main-module"] = function(ctx, children, callback) {
	Fleur.XPathConstructor(ctx, children, Fleur.Types["http://www.w3.org/2005/xquery"]["main-module"], function() {}, callback);
};
Fleur.XPathFunctions_xs["anyURI#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:anyURI",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["anyURI"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["base64Binary#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:base64Binary",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["base64Binary"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["boolean#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:boolean",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_boolean, function(node) {
			if (node.schemaTypeInfo === Fleur.Type_integer || node.schemaTypeInfo === Fleur.Type_decimal || node.schemaTypeInfo === Fleur.Type_float || node.schemaTypeInfo === Fleur.Type_double) {
				node.data = (node.data === "0" || node.data === "NaN") ? "false" : "true";
			} else {
				node = Fleur.error(ctx, "FORG0001");
			}
		});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["byte#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:byte",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["byte"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["date#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:date",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_date, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["dateTime#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dateTime",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_dateTime, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["dateTimeStamp#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dateTimeStamp",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["dateTimeStamp"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["dayTimeDuration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:dayTimeDuration",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_dayTimeDuration, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["decimal#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:decimal",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_decimal, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["double#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:double",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_double, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["duration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:duration",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["duration"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["ENTITIES#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:ENTITIES",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITIES"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["ENTITY#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:ENTITY",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ENTITY"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["float#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:float",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_float, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["gDay#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gDay",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gDay"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["gMonth#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gMonth",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonth"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["gMonthDay#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gMonthDay",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gMonthDay"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["gYear#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gYear",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYear"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["gYearMonth#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:gYearMonth",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["gYearMonth"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["hexBinary#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:hexBinary",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["hexBinary"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["ID#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:ID",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["ID"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["IDREF#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:IDREF",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREF"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["IDREFS#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:IDREFS",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["IDREFS"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["int#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:int",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_int, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["integer#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:integer",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_integer, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["language#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:language",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["language"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["long#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:long",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["long"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["Name#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:Name",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["Name"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["NCName#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:NCName",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NCName"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["negativeInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:negativeInteger",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["negativeInteger"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["NMTOKEN#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:NMTOKEN",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKEN"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["NMTOKENS#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:NMTOKENS",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["NMTOKENS"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["nonNegativeInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:nonNegativeInteger",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonNegativeInteger"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["nonPositiveInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:nonPositiveInteger",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["nonPositiveInteger"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["normalizedString#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:normalizedString",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["normalizedString"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["positiveInteger#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:positiveInteger",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["positiveInteger"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["QName#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:QName",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_QName, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["QName"] = function(ctx, children, callback) {
	var namespaceURI, qualifiedName, a;
	if (children.length === 1) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = "";
			qualifiedName = n.data;
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_QName;
			a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
			Fleur.callback(function() {callback(a);});
		});
	} else if (children.length === 2) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
			namespaceURI = n.data;
			Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
				qualifiedName = n.data;
				a = new Fleur.Text();
				a.schemaTypeInfo = Fleur.Type_QName;
				a._setNodeNameLocalNamePrefix(namespaceURI, qualifiedName);
				Fleur.callback(function() {callback(a);});
			});
		});
	} else {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
	}
};
Fleur.XPathFunctions_xs["short#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:short",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["short"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["string#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:string",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_string, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["time#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:time",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_time, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["token#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:token",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["token"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["unsignedByte#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedByte",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedByte"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["unsignedInt#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedInt",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedInt"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["unsignedLong#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedLong",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedLong"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["unsignedShort#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:unsignedShort",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Types["http://www.w3.org/2001/XMLSchema"]["unsignedShort"], function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["untypedAtomic#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:untypedAtomic",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_untypedAtomic, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_xs["yearMonthDuration#1"] = new Fleur.Function("http://www.w3.org/2001/XMLSchema", "xs:yearMonthDuration",
	function(arg) {
		return Fleur.XPathConstructor(arg, Fleur.Type_yearMonthDuration, function() {});
	},
	null, [{type: Fleur.Node}], false, false, {type: Fleur.Node});
Fleur.XPathFunctions_zip["deflate#1"] = new Fleur.Function("http://expath.org/ns/zip", "zip:deflate",
	function(arg) {
		return Fleur.deflate(arg);
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur.XPathFunctions_zip["inflate#1"] = new Fleur.Function("http://expath.org/ns/zip", "zip:inflate",
	function(arg) {
		return Fleur.bin2utf8(Fleur.inflate(arg));
	},
	null, [{type: Fleur.Type_string}], false, false, {type: Fleur.Type_string});
Fleur._schemaTypeInfoLookup = function(n) {
	var i, l, s;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			return n.schemaTypeInfo;
		case Fleur.Node.ATTRIBUTE_NODE:
		case Fleur.Node.ELEMENT_NODE:
		case Fleur.Node.MAP_NODE:
		case Fleur.Node.ENTRY_NODE:
			for (i = 0, l < n.childNodes.length; i < l; i++) {
				s = Fleur._schemaTypeInfoLookup(n.childNodes[i]);
				if (s !== Fleur.Type_untypedAtomic) {
					return s;
				}
			}
			return Fleur.Type_untypedAtomic;
	}
};
Fleur._Atomize = function(a, n, force) {
	var i, l, n2, seq;
	switch (n.nodeType) {
		case Fleur.Node.TEXT_NODE:
			if (n.schemaTypeInfo === Fleur.Type_error || n.nodeName !== "#text") {
				return n;
			}
			a = new Fleur.Text();
			a.data = n.data;
			a.schemaTypeInfo = n.schemaTypeInfo;
			return a;
		case Fleur.Node.DOCUMENT_NODE:
			n = n.documentElement;
		case Fleur.Node.ELEMENT_NODE:
			a = new Fleur.Text();
			a.data = n.textContent;
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.ATTRIBUTE_NODE:
			a = new Fleur.Text();
			a.data = n.value.slice(0);
			a.schemaTypeInfo = Fleur._schemaTypeInfoLookup(n);
			return a;
		case Fleur.Node.MAP_NODE:
			a = new Fleur.Map();
			i = 0;
			l = n.entries.length;
			while (i < l) {
				a.setEntryNode(Fleur._Atomize(null, n.entries[i]));
				i++;
			}
			return a;
		case Fleur.Node.ENTRY_NODE:
			if (force) {
				return Fleur._Atomize(null, n.firstChild);
			}
			a = new Fleur.Entry();
			a.nodeName = n.nodeName;
			a.namespaceURI = null;
			a.localName = n.nodeName;
			a.appendChild(Fleur._Atomize(null, n.firstChild));
			return a;
		case Fleur.Node.SEQUENCE_NODE:
			if (force) {
				var seq = new Fleur.Sequence();
				seq.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(n3) {
					seq.appendChild(Fleur._Atomize(null, n3));
				});
				return seq;
			}
			a = new Fleur.Text();
			a.data = "";
			var nextsep = "";
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i], n.childNodes[i].nodeType === Fleur.Node.ENTRY_NODE ? true : force);
				if (n2.schemaTypeInfo === Fleur.Type_error || n2.nodeName !== "#text") {
					return n2;
				}
				a.data += nextsep + n2.data;
				nextsep = " ";
			}
			return a;
		case Fleur.Node.ARRAY_NODE:
			if (n.childNodes.length === 0) {
				return null;
			}
			for (i = 0, l = n.childNodes.length; i < l; i++) {
				n2 = Fleur._Atomize(a, n.childNodes[i]);
				if (n2) {
					if (!a) {
						a = n2;
					} else {
						if (a.nodeType !== Fleur.Node.ARRAY_NODE) {
							seq = new Fleur.Array();
							seq.appendChild(a);
							a = seq;
						}
						if (n2.nodeType !== Fleur.Node.ARRAY_NODE) {
							a.appendChild(n2);
						} else {
							n2.childNodes.forEach(function(n3) {
								a.appendChild(n3);
							});
						}
					}
				}
			}
			return a;
		case Fleur.Node.FUNCTION_NODE:
			if (force) {
				a = new Fleur.Text();
				a.schemaTypeInfo = Fleur.Type_error;
				a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:FOTY0013");
			} else {
				a = new Fleur.Function(n.namespaceURI, n.nodeName, n.jsfunc, n.xqxfunc, n.argtypes, n.needctx, n.needcallback, n.restype, n.updating);
			}
			return a;
	}
};
Fleur.Atomize = function(n, force) {
	return n === Fleur.EmptySequence ? Fleur.EmptySequence : Fleur._Atomize(null, n, n.nodeType === Fleur.Node.ENTRY_NODE ? true : force);
};
Fleur.Collations = {};
Fleur.getCollation = function(collation) {
	var c = Fleur.Collations[collation];
	if (!c && !collation.startsWith("http://")) {
		c = Fleur.Collations["http://www.w3.org/2005/xpath-functions/" + collation];
	}
	return c;
}
Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/codepoint"] = {
	equals: function(a, b) {
		return a === b;
	},
	lessThan: function(a, b) {
		return a < b;
	},
	greaterThan: function(a, b) {
		return a > b;
	},
	startsWith: function(a, b) {
		return a.startsWith(b);
	},
	endsWith: function(a, b) {
		return a.endsWith(b);
	},
	contains: function(a, b) {
		return a.indexOf(b) !== -1;
	},
	substringBefore: function(a, b) {
		var i = a.indexOf(b);
		return i === -1 ? "" : a.substr(0, i);
	},
	substringAfter: function(a, b) {
		var i = a.indexOf(b);
		return i === -1 ? "" : a.substr(i + b.length);
	}
};
Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/html-ascii-case-insensitive"] = {
	equals: function(a, b) {
		return a.toLowerCase() === b.toLowerCase();
	},
	lessThan: function(a, b) {
		return a.toLowerCase() < b.toLowerCase();
	},
	greaterThan: function(a, b) {
		return a.toLowerCase() > b.toLowerCase();
	},
	startsWith: function(a, b) {
		return a.toLowerCase().startsWith(b.toLowerCase());
	},
	endsWith: function(a, b) {
		return a.toLowerCase().endsWith(b.toLowerCase());
	},
	contains: function(a, b) {
		return a.toLowerCase().indexOf(b.toLowerCase()) !== -1;
	},
	substringBefore: function(a, b) {
		var i = a.toLowerCase().indexOf(b.toLowerCase());
		return i === -1 ? "" : a.substr(0, i);
	},
	substringAfter: function(a, b) {
		var i = a.toLowerCase().indexOf(b.toLowerCase());
		return i === -1 ? "" : a.substr(i + b.length);
	}
};
Fleur.Collations["http://www.w3.org/2010/09/qt-fots-catalog/collation/caseblind"] = Fleur.Collations["http://www.w3.org/2005/xpath-functions/collation/html-ascii-case-insensitive"];
Fleur.XPathConstructor = function(arg, schemaType, others) {
	var err;
	var a = Fleur.Atomize(arg, true);
	if (a === Fleur.EmptySequence) {
		return a;
	}
	if (a.schemaTypeInfo === Fleur.Type_error || a.schemaTypeInfo === schemaType) {
		return a;
	}
	if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		if (!a.hasOwnProperty("data")) {
			err = new Error("");
			err.name = "FORG0001";
			return err;
		}
	} else {
		others(a);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			return a;
		}
	}
	a.schemaTypeInfo = schemaType;
	try {
		a.data = a.schemaTypeInfo.canonicalize(a.data);
		return a;
	} catch (e) {
		err = new Error(e.error || "");
		err.name = e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001";
		return err;
	}
};
Fleur.XPathConstructor_old = function(ctx, children, schemaType, others, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n, true);
		if (a === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_error || a.schemaTypeInfo === schemaType) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			if (!a.hasOwnProperty("data")) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
		} else {
			others(a);
			if (a.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a);});
				return;
			}
		}
		a.schemaTypeInfo = schemaType;
		try {
			a.data = a.schemaTypeInfo.canonicalize(a.data);
			Fleur.callback(function() {callback(a);});
		} catch (e) {
			Fleur.callback(function() {callback(Fleur.error(ctx, e.code === Fleur.DOMException.VALIDATION_ERR ? "FORG0001" : "FODT0001", e.error));});
		}
	});
};
Fleur.XPathStringFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length > 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	var cb = function(n, forceString) {
		var a = Fleur.Atomize(n);
		if (a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.schemaTypeInfo = Fleur.Type_string;
			a.data = "";
		}
		if (forceString === "force") {
			a.schemaTypeInfo = Fleur.Type_string;
		}
		if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a.data = String(f(a.data));
			if (schemaTypeInfo) {
				a.schemaTypeInfo = schemaTypeInfo;
			}
			Fleur.callback(function() {callback(a);});
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		}
	};
	if (children.length === 0) {
		cb(ctx._curr, "force");
	} else {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	}
};
Fleur.XPathStringContentFunction = function(ctx, children, empty, f, schemaTypeInfo, callback) {
	var arg1, arg2;
	if (children.length === 3) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "FOCH0002"));});
		return;
	}
	if (children.length !== 2) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			if (empty) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			arg1 = "";
		} else {
			if (a1.schemaTypeInfo !== Fleur.Type_string && a1.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			arg1 = a1.data;
		}
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2 === Fleur.EmptySequence) {
				if (empty) {
					Fleur.callback(function() {callback(a2);});
					return;
				}
				a2 = new Fleur.Text();
				arg2 = "";
			} else {
				if (a2.schemaTypeInfo !== Fleur.Type_string && a2.schemaTypeInfo !== Fleur.Type_untypedAtomic) {
					callback(Fleur.error(ctx, "XPTY0004"));
					return;
				}
				arg2 = a2.data;
			}
			a2.data = String(f(arg1, arg2));
			a2.schemaTypeInfo = schemaTypeInfo;
			Fleur.callback(function() {callback(a2);});
		});
	});
};
Fleur.XPathNumberFunction = function(ctx, children, f, schemaTypeInfo, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var value;
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
			value = f(a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : a.data === "NaN" ? Number.NaN : parseFloat(a.data));
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseInt(a.data, 10));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			value = f(parseFloat(a.data));
			if (schemaTypeInfo !== Fleur.Type_double && isNaN(value)) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0001"));});
				return;
			}
			a.data = value === Number.POSITIVE_INFINITY ? "INF" : value === Number.NEGATIVE_INFINITY ? "-INF" : isNaN(value) ? "NaN" : String(value).replace("e+", "e");
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		if (schemaTypeInfo) {
			if (typeof schemaTypeInfo === "function") {
				a.schemaTypeInfo = schemaTypeInfo(a);
			} else {
				a.schemaTypeInfo = schemaTypeInfo;
			}
		}
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
			return;
		}
		var op1 = Fleur.toJSValue(a1, a1.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
			a1.schemaTypeInfo = Fleur.Type_double;
		} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			a1.schemaTypeInfo = Fleur.Type_string;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n);
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			var op2 = Fleur.toJSValue(a2, a2.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
				a2.schemaTypeInfo = Fleur.Type_double;
			} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a2.schemaTypeInfo = Fleur.Type_string;
			}
			if (a1.schemaTypeInfo !== a2.schemaTypeInfo) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			a1.data = String(f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint")));
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XPathGenTestOpFunction = function(ctx, children, f, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n, true);
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.data = "false";
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a1.childNodes.forEach(function(a) {
				if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
					a.schemaTypeInfo = Fleur.Type_double;
				} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a.schemaTypeInfo = Fleur.Type_string;
				}
			});
		} else {
			if (Fleur.numericTypes.indexOf(a1.schemaTypeInfo) !== -1) {
				a1.schemaTypeInfo = Fleur.Type_double;
			} else if (a1.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				a1.schemaTypeInfo = Fleur.Type_string;
			}
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n, true);
			var i1, res = false, b, l;
			if (a2 === Fleur.EmptySequence) {
				a1 = new Fleur.Text();
				a1.data = "false";
				a1.schemaTypeInfo = Fleur.Type_boolean;
				Fleur.callback(function() {callback(a1);});
				return;
			}
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
				a2.childNodes.forEach(function(a) {
					if (Fleur.numericTypes.indexOf(a.schemaTypeInfo) !== -1) {
						a.schemaTypeInfo = Fleur.Type_double;
					} else if (a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
						a.schemaTypeInfo = Fleur.Type_string;
					}
				});
			} else {
				if (Fleur.numericTypes.indexOf(a2.schemaTypeInfo) !== -1) {
					a2.schemaTypeInfo = Fleur.Type_double;
				} else if (a2.schemaTypeInfo === Fleur.Type_untypedAtomic) {
					a2.schemaTypeInfo = Fleur.Type_string;
				}
			}
			do {
				if (a1.nodeType === Fleur.Node.SEQUENCE_NODE) {
					i1 = a1.childNodes.shift();
					if (a1.childNodes.length === 1) {
						a1 = a1.childNodes[0];
					}
				} else {
					i1 = a1;
					a1 = Fleur.EmptySequence;
				}
				var op1 = Fleur.toJSValue(i1, true, true, true, true, false, true);
				var op2;
				if (a2.nodeType === Fleur.Node.SEQUENCE_NODE) {
					for (b = 0, l = a2.childNodes.length; b < l && !res; b++) {
						op2 = Fleur.toJSValue(a2.childNodes[b], true, true, true, true, false, true);
						res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
					}
				} else {
					op2 = Fleur.toJSValue(a2, true, true, true, true, false, true);
					res = f(op1, op2, Fleur.getCollation("http://www.w3.org/2005/xpath-functions/collation/codepoint"));
				}
				if (res) {
					break;
				}
			} while(a1 !== Fleur.EmptySequence);
			a1 = new Fleur.Text();
			a1.data = String(res);
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XPathFromDateTimeFunction = function(ctx, children, t1, r, t2, callback) {
	if (children.length !== 1) {
		Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017"));});
		return;
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence || a.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo !== t1) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		a.schemaTypeInfo = t2;
		a.data = String(t2 === Fleur.Type_integer ? parseInt(a.data.match(r)[1], 10) : parseFloat(a.data.match(r)[1]));
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XPathEvaluator = function() {};
Fleur.XPathEvaluator._precedence = "././/.:.as.&0.!.!!.&1.~+.~-.&2.cast as.&3.castable as.&4.treat as.&5.instance of.&6.intersect.except.&7.|.union.&8.div.mod.*.idiv.&9.+.-.&10.to.&11.||.&12.eq.ne.lt.le.gt.ge.<.>.<=.>=.is.<<.>>.=.!=.&13.and.&14.or.&15.allowing.&16.at.&17.:=.in.&18.after.before.into.with.value.&19.node.nodes.&20.~~ascending.~~descending.empty.&28.~,.&29.for.let.group by.order by.stable order by.count.where.some.every.&30.then.catch.&31.else.return.satisfies.&32.,.&50.;.&51.";
Fleur.XPathEvaluator._rightgrouping1 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf(".then.") + 6);
Fleur.XPathEvaluator._rightgrouping1 = Fleur.XPathEvaluator._rightgrouping1.substr(Fleur.XPathEvaluator._rightgrouping1.indexOf("&") + 1);
Fleur.XPathEvaluator._rightgrouping1 = parseInt(Fleur.XPathEvaluator._rightgrouping1.substr(0, Fleur.XPathEvaluator._rightgrouping1.indexOf(".")), 10);
Fleur.XPathEvaluator._rightgrouping2 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf(".return.") + 6);
Fleur.XPathEvaluator._rightgrouping2 = Fleur.XPathEvaluator._rightgrouping2.substr(Fleur.XPathEvaluator._rightgrouping2.indexOf("&") + 1);
Fleur.XPathEvaluator._rightgrouping2 = parseInt(Fleur.XPathEvaluator._rightgrouping2.substr(0, Fleur.XPathEvaluator._rightgrouping2.indexOf(".")), 10);
Fleur.XPathEvaluator._opcodes = "./;stepExpr.|;unionOp.union;unionOp.div;divOp.mod;modOp.*;multiplyOp.idiv;idivOp.+;addOp.-;subtractOp.to;toOp.||;stringConcatenateOp.eq;eqOp.ne;neOp.lt;ltOp.le;leOp.gt;gtOp.ge;geOp.<;lessThanOp.>;greaterThanOp.<=;lessThanOrEqualOp.>=;greaterThanOrEqualOp.is;isOp.<<;nodeBeforeOp.>>;nodeAfterOp.=;equalOp.!=;notEqualOp.and;andOp.or;orOp.,;argExpr.";
Fleur.XPathEvaluator._skipComment = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var d = s.charAt(i + 1);
	var l = s.length;
	do {
		if (c === "(" && d === ":") {
			i = Fleur.XPathEvaluator._skipComment(s, i + 2);
		} else if (c === ":" && d === ")") {
			return i + 1;
		}
		c = s.charAt(++i);
		d = s.charAt(i + 1);
	} while (i < l);
};
Fleur.XPathEvaluator._skipSpaces = function(s, offset) {
	var i = offset;
	var c = s.charAt(i);
	var l = s.length;
	do {
		if (c === "(" && s.charAt(i + 1) === ":") {
			i = Fleur.XPathEvaluator._skipComment(s, i + 2);
		} else if (c !== "\n" && c !== "\r" && c !== "\t" && c !== " ") {
			return i;
		}
		c = s.charAt(++i);
	} while (i < l);
	return i;
};
Fleur.XPathEvaluator._getName = function(s) {
	var i = 0;
	var o = s.charAt(0);
	var prev = "";
	while (o !== "" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:*{".indexOf(o) !== -1) {
		if (o === "*") {
			if (i > 0 && (s.charAt(i - 1) === ":" || s.charAt(i - 1) === "}")) {
				i++;
				break;
			} else if (s.charAt(i + 1) !== ":") {
				if (i === 0) {
					i++;
				}
				break;
			}
		}
		if (o === "{") {
			if (prev !== "Q") {
				return s.substr(0, i);
			}
			while (o !== "" && o !== "}") {
				o = s.charAt(++i);
			}
		}
		prev = o;
		o = s.charAt(++i);
	}
	if (o === "#") {
		o = s.charAt(++i);
		while (o !== "" && "0123456789".indexOf(o) !== -1) {
			o = s.charAt(++i);
		}
	}
	return s.substr(0, i);
};
Fleur.XPathEvaluator._getNameStep = function(s, attr) {
	var n = Fleur.XPathEvaluator._getName(s);
	var fctind = n.indexOf("#");
	if (fctind !== -1) {
		var pindex = n.indexOf(":");
		if (pindex === -1) {
			return n.length + ".[Fleur.XQueryX.namedFunctionRef,[[Fleur.XQueryX.functionName,['" + n.substr(0, fctind) + "']],[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + n.substr(fctind + 1) + "']]]]]]";
		}
		return n.length + ".[Fleur.XQueryX.namedFunctionRef,[[Fleur.XQueryX.functionName,['" + n.substr(0, fctind).substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + n.substr(0, pindex) + "']]]],[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + n.substr(fctind + 1) + "']]]]]]";
	}
	var aind = n.indexOf("::");
	var axis = aind !== -1 ? n.substr(0, aind) : attr ? "attribute" : "child";
	var n2 = aind !== -1 ? n.substr(aind + 2) : n;
	var eq = n2.substr(0, 2) === "Q{";
	var sind = eq ? n2.indexOf("}") : n2.indexOf(":");
	var n3 = sind !== -1 ? n2.substr(sind + 1) : n2;
	var nsp = eq ? n2.substr(2, sind - 2) : sind !== -1 ? n2.substr(0, sind) : "";
	var ntest = n3 === "*" || nsp === "*" ? "[Fleur.XQueryX.Wildcard,[" + (n3 !== "*" && nsp === "*" ? "[Fleur.XQueryX.star,[]],[Fleur.XQueryX.NCName,['" + n3 + "']]" : "") + (nsp !== "*" && nsp !== "" && n3 === "*"? "[Fleur.XQueryX.NCName,['" + nsp + "']],[Fleur.XQueryX.star,[]]" : "") + "]]" : "[Fleur.XQueryX.nameTest,['" + n3 + "'" + (eq || sind !== -1 ? ",[" + (eq ? "Fleur.XQueryX.URI" : "Fleur.XQueryX.prefix") + ",['" + nsp + "']]" : "") + "]]";
	return (n.length + attr) + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['" + axis + "']]," + ntest + "]]]]";
};
Fleur.XPathEvaluator._pathExprFormat = function(s, p) {
	if (s.substr(0, 25) === "[Fleur.XQueryX.pathExpr,[") {
		return s.substr(25, s.length - 29) + p + "]]";
	}
	return "[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[" + s + "]]" + p + "]]";
};
Fleur.XPathEvaluator._calc = function(args, ops, opprec) {
	var curop = parseInt(ops.split(".")[1], 10);
	if ((ops === "" || curop > opprec || opprec === 31) || (curop >= opprec && (curop === Fleur.XPathEvaluator._rightgrouping1 || curop === Fleur.XPathEvaluator._rightgrouping2))) {
		return args.length + "." + args + ops.length + "." + ops;
	}
	var op0 = ops.substr(ops.indexOf(".") + 1, parseInt(ops.split(".")[0], 10));
	var op = op0.substr(op0.indexOf(".") + 1);
	var arg2len = args.substr(0, args.indexOf("."));
	var arg2val = args.substr(args.indexOf(".") + 1).substr(0, parseInt(arg2len, 10));
	var arg2val2, arg2val3;
	var args3, arg1len, arg1val, arg1val2, arg1val3;
	if (op.startsWith("~~")) {
		args3 = args;
		arg1len = arg2len;
		arg1val = arg2val;
	} else {
		args3 = args.substr(arg2len.length + 1 + parseInt(arg2len, 10));
		arg1len = args3.substr(0, args3.indexOf("."));
		arg1val = args3.substr(args3.indexOf(".") + 1).substr(0, parseInt(arg1len, 10));
	}
	var arg;
	var occ;
	switch (op) {
		case ";":
				if (arg1val.substr(0, 58) === "[Fleur.XQueryX.sequenceExpr,[[Fleur.XQueryX.multidimExpr,[") {
					arg = "[Fleur.XQueryX.sequenceExpr,[[Fleur.XQueryX.multidimExpr,[" + arg1val.substr(58, arg1val.length - 62) + "," + arg2val + "]]]]";
				} else {
					arg = "[Fleur.XQueryX.sequenceExpr,[[Fleur.XQueryX.multidimExpr,[" + arg1val + "," + arg2val + "]]]]";
				}
			break;
		case ",":
			if (ops.substr(0, 13) === "4.50.,5.999.(") {
				if (arg1val.substr(0, 26) === "[Fleur.XQueryX.arguments,[") {
					arg = arg1val.substr(0, arg1val.length - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.arguments,[" + arg1val + "," + arg2val + "]]";
				}
			} else if (ops.substr(0, 13) === "4.50.,5.999.q") {
				arg = arg1val + "," + arg2val;
			} else if (ops.startsWith("4.50.,")) {
				if (arg1val.substr(0, 36) === "[Fleur.XQueryX.mapConstructorEntry,[") {
					arg = arg1val + "," + arg2val;
				} else if (arg1val.substr(0, 29) === "[Fleur.XQueryX.sequenceExpr,[" && arg1val !== "[Fleur.XQueryX.sequenceExpr,[]]") {
					arg = arg1val.substr(0, arg1val.length - 2) + "," + arg2val + "]]";
				} else {
					arg = "[Fleur.XQueryX.sequenceExpr,[" + arg1val + "," + arg2val + "]]";
				}
			} else {
				arg = arg1val + "," + arg2val;
			}
			break;
		case "~,":
			if (arg1val.substr(0, 29) === "[Fleur.XQueryX.letClauseItem," || arg1val.substr(0, 27) === "[Fleur.XQueryX.groupBySpec,") {
				arg = arg1val + "," + arg2val;
			} else if (arg1val.substr(0, 25) === "[Fleur.XQueryX.letClause,") {
				if (arg2val.substr(0, 25) === "Fleur.XQueryX.letClause,") {
					arg = arg1val.substr(0, arg1val.length - 2) + "," + arg2val.substr(25);
				} else {
					arg = arg1val.substr(0, arg1val.length - 2) + "," + arg2val + "]]";
				}
			} else {
				if (arg1val.substr(0, 27) !== "[Fleur.XQueryX.orderBySpec,") {
					arg = "[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg1val + "]]]]";
				} else {
					arg = arg1val;
				}
				arg += ",";
				if (arg2val.substr(0, 27) !== "[Fleur.XQueryX.orderBySpec,") {
					arg += "[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg2val + "]]]]";
				} else {
					arg += arg2val;
				}
			}
			break;
		case "//":
			arg = "[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + ",[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['descendant-or-self']],[Fleur.XQueryX.anyKindTest,[]]]]," + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") + "]]";
			break;
		case "/":
			arg = "[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + (arg2val !== "" ? "," + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") : "") + "]]";
			break;
		case "!!":
			arg = "[Fleur.XQueryX.doubleMapExpr,[[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + "]],[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") + "]]]]";
			break;
		case "!":
			arg = "[Fleur.XQueryX.simpleMapExpr,[[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg1val, "") + "]],[Fleur.XQueryX.pathExpr,[" + Fleur.XPathEvaluator._pathExprFormat(arg2val, "") + "]]]]";
			break;
		case "|":
			if (ops.startsWith("3.8.|8.31.catch")) {
				if (arg1val.substr(0, 24) === "[Fleur.XQueryX.pathExpr,") {
					arg1val2 = arg1val.substr(86);
					arg1val = arg1val2.substr(0, arg1val2.length - 4);
				}
				if (arg2val.substr(0, 24) === "[Fleur.XQueryX.pathExpr,") {
					arg2val2 = arg2val.substr(86);
					arg2val = arg2val2.substr(0, arg2val2.length - 4);
					arg = arg1val + "," + arg2val;
				} else {
					arg = "[Fleur.XQueryX.catchErrorList,[" + arg1val + "," + arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.catchErrorList,[") + 31);
				}
			} else {
				arg = "[Fleur.XQueryX.unionOp,[[Fleur.XQueryX.firstOperand,[" + arg1val + "]],[Fleur.XQueryX.secondOperand,[" + arg2val + "]]]]";
			}
			break;
		case ":":
			arg = "[Fleur.XQueryX.mapConstructorEntry,[[Fleur.XQueryX.mapKeyExpr,[" + arg1val + "]],[Fleur.XQueryX.mapValueExpr,[" + arg2val + "]]]]";
			break;
		case "?":
			break;
		case "to":
			arg = "[Fleur.XQueryX.rangeSequenceExpr,[[Fleur.XQueryX.startExpr,[" + arg1val + "]],[Fleur.XQueryX.endExpr,[" + arg2val + "]]]]";
			break;
		case "~-":
			arg = "[Fleur.XQueryX.unaryMinusOp,[[Fleur.XQueryX.operand,[" + arg2val + "]]]]";
			break;
		case "~+":
			arg = "[Fleur.XQueryX.unaryPlusOp,[[Fleur.XQueryX.operand,[" + arg2val + "]]]]";
			break;
		case "allowing":
			arg = "[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.allowingEmpty,[]]";
			break;
		case "at":
			if (arg1val.substr(0, 36) === "[Fleur.XQueryX.typedVariableBinding,") {
				arg = arg1val + ",[Fleur.XQueryX.positionalVariableBinding,[" + arg2val.substr(0, arg2val.length - 4).substr(44) + "]]";
			} else {
				arg = "[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.positionalVariableBinding,[" + arg2val.substr(0, arg2val.length - 4).substr(44) + "]]";
			}
			break;
		case "in":
			if (ops.substr(ops.length - 7) === "5.999.q") {
				arg = "[Fleur.XQueryX.quantifiedExprInClause,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.sourceExpr,[" + arg2val + "]]]]";
			} else if (arg1val.substr(0, 36) === "[Fleur.XQueryX.typedVariableBinding,") {
				arg = "[Fleur.XQueryX.forClause,[[Fleur.XQueryX.forClauseItem,[" + arg1val + ",[Fleur.XQueryX.forExpr,[" + arg2val + "]]]]]]";
			} else {
				arg = "[Fleur.XQueryX.forClause,[[Fleur.XQueryX.forClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.forExpr,[" + arg2val + "]]]]]]";
			}
			break;
		case "as":
			if (arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['last']]]]]]") {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsLast,[]]]]";
			} else if (arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['first']]]]]]") {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[[Fleur.XQueryX.insertAsFirst,[]]]]";
			} else {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
				arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
				arg = "[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]],[Fleur.XQueryX.typeDeclaration,[" + arg2val3 + "]]";
			}
			break;
		case ":=":
			if (ops.startsWith("5.18.:=11.30.group by") || ops.startsWith("5.18.:=5.29.~,11.30.group by")) {
				if (arg1val.substr(0, 28) === "[Fleur.XQueryX.groupingSpec,") {
					arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.groupVarInitialize,[[Fleur.XQueryX.varValue,[" + arg2val + "]]]]]]";
				} else {
					arg = "[Fleur.XQueryX.groupingSpec,[[Fleur.XQueryX.varName,[" + arg1val.substr(44, arg1val.length - 48) + "]],[Fleur.XQueryX.groupVarInitialize,[[Fleur.XQueryX.varValue,[" + arg2val + "]]]]]]";
				}
			} else if (arg1val.substr(0, 23) === "[Fleur.XQueryX.varName,") {
				arg = "[Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[" + arg1val + "]],[Fleur.XQueryX.letExpr,[" + arg2val + "]]]]]]";
			} else {
				arg = "[Fleur.XQueryX.letClause,[[Fleur.XQueryX.letClauseItem,[[Fleur.XQueryX.typedVariableBinding,[[Fleur.XQueryX.varName,[" + arg1val.substr(0, arg1val.length - 4).substr(44) + "]]]],[Fleur.XQueryX.letExpr,[" + arg2val + "]]]]]]";
			}
			break;
		case "return":
			arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.returnClause,[" + arg2val + "]]]]";
			break;
		case "satisfies":
			arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.predicateExpr,[" + arg2val + "]]]]";
			break;
		case "cast as":
		case "cast as?":
			occ = op.charAt(7);
			arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
			arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			arg = "[Fleur.XQueryX.castExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.singleType,[" + arg2val3 + (occ === "?" ? ",[Fleur.XQueryX.optional,[]]" : "") + "]]]]";
			break;
		case "castable as":
		case "castable as?":
			occ = op.charAt(11);
			arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
			arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			arg = "[Fleur.XQueryX.castableExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.singleType,[" + arg2val3 + (occ === "?" ? ",[Fleur.XQueryX.optional,[]]" : "") + "]]]]";
			break;
		case "treat as":
		case "treat as+":
		case "treat as?":
		case "treat as*":
			occ = op.charAt(8);
			if (arg2val.indexOf("[Fleur.XQueryX.nameTest,") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
				arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			} else if (arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") + 86);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			} else {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],") + 90);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			}
			arg = "[Fleur.XQueryX.treatExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.sequenceType,[" + arg2val3 + (occ !== "" ? ",[Fleur.XQueryX.occurrenceIndicator,['" + occ + "']]" : "") + "]]]]";
			break;
		case "instance of":
		case "instance of+":
		case "instance of?":
		case "instance of*":
			occ = op.charAt(11);
			if (arg2val.indexOf("[Fleur.XQueryX.nameTest,") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.nameTest,") + 24);
				arg2val3 = "[Fleur.XQueryX.atomicType," + arg2val2.substr(0, arg2val2.length - 4);
			} else if (arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") !== -1) {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],") + 86);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			} else {
				arg2val2 = arg2val.substr(arg2val.indexOf("[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],") + 90);
				arg2val3 = arg2val2.substr(0, arg2val2.length - 4);
			}
			arg = "[Fleur.XQueryX.instanceOfExpr,[[Fleur.XQueryX.argExpr,[" + arg1val + "]],[Fleur.XQueryX.sequenceType,[" + arg2val3 + (occ !== "" ? ",[Fleur.XQueryX.occurrenceIndicator,['" + occ + "']]" : "") + "]]]]";
			break;
		case "then":
			if (arg1val.substr(0, 95) === "[Fleur.XQueryX.functionCallExpr,[[Fleur.XQueryX.functionName,['if']],[Fleur.XQueryX.arguments,[") {
				arg = "[Fleur.XQueryX.ifThenElseExpr,[[Fleur.XQueryX.ifClause,[" + arg1val.substr(0, arg1val.length - 4).substr(arg1val.indexOf(",[Fleur.XQueryX.arguments,[") + 27) + "]],[Fleur.XQueryX.thenClause,[" + arg2val + "]]]]";
			}
			opprec = -1;
			break;
		case "else":
			if (arg1val.substr(0, 30) === "[Fleur.XQueryX.ifThenElseExpr,") {
				arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.elseClause,[" + arg2val + "]]]]";
			}
			break;
		case "catch":
			if (arg1val.substr(0, 28) === "[Fleur.XQueryX.tryCatchExpr,") {
				arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.catchClause,[" + arg2val + "]]]]";
			}
			break;
		case "let":
			arg = arg1val + "," + arg2val;
			break;
		case "for":
			arg = arg1val + "," + arg2val;
			break;
		case "group by":
			arg = arg1val + ",[Fleur.XQueryX.groupByClause,[" + arg2val + "]]";
			break;
		case "order by":
			if (arg2val.substr(0, 27) === "[Fleur.XQueryX.orderBySpec,") {
				arg = arg1val + ",[Fleur.XQueryX.orderByClause,[" + arg2val + "]]";
			} else {
				arg = arg1val + ",[Fleur.XQueryX.orderByClause,[[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg2val + "]]]]]]";
			}
			break;
		case "~~ascending":
		case "~~descending":
			arg = "[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg1val + "]],[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,['" + op.substr(2) + "']]]]]]";
			break;
		case "empty":
			if (arg1val.substr(0,27) === "[Fleur.XQueryX.orderBySpec,") {
				if (arg1val.endsWith(",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,['ascending']]]]]]") || arg1val.endsWith(",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.orderingKind,['descending']]]]]]")) {
					arg = arg1val.substr(0, arg1val.length - 4) + ",[Fleur.XQueryX.emptyOrderingMode,['empty " + arg2val.substr(112, arg2val.length - 119) + "']]]]]]";
				} else {
					arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.emptyOrderingMode,['empty " + arg2val.substr(112, arg2val.length - 119) + "']]]]]]";
				}
			} else {
				arg = "[Fleur.XQueryX.orderBySpec,[[Fleur.XQueryX.orderByExpr,[" + arg1val + "]],[Fleur.XQueryX.orderModifier,[[Fleur.XQueryX.emptyOrderingMode,['empty " + arg2val.substr(112, arg2val.length - 119) + "']]]]]]";
			}
			break;
		case "where":
			arg = arg1val + ",[Fleur.XQueryX.whereClause,[" + arg2val + "]]";
			break;
		case "count":
			arg = arg1val + ",[Fleur.XQueryX.countClause,[" + arg2val + "]]";
			break;
		case "nodes":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['delete']]]]]]") {
				arg = "[Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[" + arg2val + "]]]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['insert']]]]]]") {
				arg = "[Fleur.XQueryX.insertExpr,[" + arg2val + "]]";
			}
			break;
		case "node":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['delete']]]]]]") {
				arg = "[Fleur.XQueryX.deleteExpr,[[Fleur.XQueryX.targetExpr,[" + arg2val + "]]]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['insert']]]]]]") {
				arg = "[Fleur.XQueryX.insertExpr,[" + arg2val + "]]";
			} else if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['replace']]]]]]") {
				arg = "[Fleur.XQueryX.replaceExpr,[" + arg2val + "]]";
			} else if (arg1val === "[Fleur.XQueryX.replaceValue,[]]") {
				arg = "[Fleur.XQueryX.replaceExpr,[[Fleur.XQueryX.replaceValue,[]]," + arg2val + "]]";
			}
			break;
		case "into":
			if (arg1val.substr(0, 28) === "[Fleur.XQueryX.sourceExprUf,") {
				arg = arg1val + ",[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			} else {
				arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertInto,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			}
			break;
		case "after":
			arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertAfter,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			break;
		case "before":
			arg = "[Fleur.XQueryX.sourceExprUf,[" + arg1val + "]],[Fleur.XQueryX.insertBefore,[]],[Fleur.XQueryX.targetExpr,[" + arg2val + "]]";
			break;
		case "value":
			if (arg1val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['replace']]]]]]" && arg2val === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['of']]]]]]") {
				arg = "[Fleur.XQueryX.replaceValue,[]]";
			}
			break;
		case "with":
			arg = "[Fleur.XQueryX.targetExpr,[" + arg1val + "]],[Fleur.XQueryX.replacementExpr,[" + arg2val + "]]";
			break;
		default:
			var opcode0 = Fleur.XPathEvaluator._opcodes.substr(Fleur.XPathEvaluator._opcodes.indexOf("." + op + ";") + op.length + 2);
			var opcode = opcode0.substr(0, opcode0.indexOf("."));
			arg = "[Fleur.XQueryX." + opcode + ",[[Fleur.XQueryX.firstOperand,[" + arg1val + "]],[Fleur.XQueryX.secondOperand,[" + arg2val + "]]]]";
	}
	var args2 = arg.length + "." + arg + args3.substr(arg1len.length + 1 + parseInt(arg1len, 10));
	return Fleur.XPathEvaluator._calc(args2, ops.substr(ops.indexOf(".") + 1).substr(parseInt(ops.substr(0, ops.indexOf(".")), 10)), opprec);
};
Fleur.XPathEvaluator._testFormat = function(s, namecode) {
	var arg1, arg2, arg20, arg200;
	if (s === "") {
		return "";
	}
	if (s.indexOf(",[Fleur.XQueryX.pathExpr,[") !== -1) {
		arg1 = s.substr(0, s.indexOf(",[Fleur.XQueryX.pathExpr,["));
		arg20 = s.substr(s.indexOf(",[Fleur.XQueryX.pathExpr,[") + 1);
		arg200 = arg20.substr(arg20.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
		arg2 = "," + "[Fleur.XQueryX.typeName,[" + arg200.substr(0, arg200.length - 6) + "]]";
	} else {
		arg1 = s;
		arg2 = "";
	}
	var arg120 = arg1.indexOf("[Fleur.XQueryX.nameTest,['") !== -1 ? arg1.substr(arg1.indexOf("[Fleur.XQueryX.nameTest,['") + 25) : "[Fleur.XQueryX.star,[]]";
	var arg12 = "[" + namecode + ",[" + (arg120 === "[Fleur.XQueryX.star,[]]" ? arg120 : "[Fleur.XQueryX.QName,[" + arg120.substr(0, arg120.length - 6) + "]]") + "]]";
	return arg12 + arg2;
};
Fleur.XPathEvaluator._getNodeConstructor = function(s) {
	var ii, text, texts, entityname, index, offset = 0, end = s.length, nodename, attrname, attrvalue, attrvalues, attrs, parents = [], currnodename = "", c, c0, c1, c2, braces,
		seps_pi = " \t\n\r?", seps_close = " \t\n\r>", seps_elt = " \t\n\r/>", seps_attr = " \t\n\r=/<>", seps = " \t\n\r", rseps = /^\s*$/gm,
		namespaces = {}, newnamespaces = {}, pindex, prefix, localName, r0, r = "", nextsep = "";
	while (offset !== end) {
		text = "";
		texts = [];
		c1 = " ";
		c = s.charAt(offset);
		braces = 0;
		while ((c !== "<" || braces !== 0) && offset !== end) {
			c2 = s.charAt(offset + 1);
			if (c === "{" && c2 !== c) {
				if (braces === 0 && text !== "") {
					if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r"))) {
						texts.push([0, text]);
					}
					text = "";
				}
				if (braces !== 0) {
					text += "{";
				}
				if (c1 === c) {
					braces--;
					if (braces === 0) {
						text = (texts.length > 0 ? texts.pop()[1] : "") + "{";
					}
				} else {
					braces++;
				}
			} else if (c === "}" && c2 !== c) {
				if (braces === 1 && text !== "") {
					texts.push([1, text]);
					text = "";
				}
				if (braces !== 1 && braces !== -1) {
					text += "}";
				}
				if (c1 === c) {
					braces++;
				} else {
					braces--;
				}
			} else if (c === "&") {
				c = s.charAt(++offset);
				entityname = "";
				while (c !== ";" && offset !== end) {
					entityname += c;
					c = s.charAt(++offset);
				}
				if (offset === end) {
					break;
				}
				if (entityname.charAt(0) === "#") {
					text += String.fromCharCode(parseInt(entityname.charAt(1).toLowerCase() === 'x' ? "0" + entityname.substr(1).toLowerCase() : entityname.substr(1), entityname.charAt(1).toLowerCase() === 'x' ? 16 : 10));
				} else {
					text += Fleur.encchars[entityname];
				}
			} else if (braces === 0 && c === "\n") {
				text += "\\n";
			} else if (braces === 0 && c === "\r") {
				text += "\\r";
			} else {
				text += c;
				if (c2 === c && (c === "{" || c === "}")) {
					if (braces !== 0) {
						text += c;
					}
					offset++;
					c = " ";
				}
			}
			c1 = c;
			c = s.charAt(++offset);
		}
		if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r")) && texts.length === 0) {
			r += nextsep + "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text.replace(/'/gm,"\\'") + "']]]]";
			nextsep = ",";
		} else if (texts.length > 0) {
			if (/\S/.test(text.replace("\\n", "\n").replace("\\r", "\r"))) {
				texts.push([0, text]);
			}
			texts.forEach(function(t) {
				r += nextsep;
				if (t[0] === 0) {
					r += "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + t[1].replace(/'/gm,"\\'") + "']]]]";
				} else {
					r += Fleur.XPathEvaluator._xp2js(t[1], "", "");
				}
				nextsep = ",";
			});
		}
		if (offset === end) {
			break;
		}
		offset++;
		if (s.charAt(offset) === "!") {
			offset++;
			if (s.substr(offset, 2) === "--") {
				offset += 2;
				index = s.indexOf("-->", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					r0 = "[Fleur.XQueryX.computedCommentConstructor,[[Fleur.XQueryX.argExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]]]]]";
					if (r === "") {
						return offset + "." + r0;
					}
					r += nextsep + r0;
					nextsep = ",";
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			} else if (s.substr(offset, 7) === "[CDATA[") {
				offset += 7;
				index = s.indexOf("]]>", offset);
				if (index !== offset) {
					if (index === -1) {
						index = end;
					}
					text = "";
					ii = offset;
					while (ii < index) {
						text += s.charAt(ii++);
					}
					text = text.replace(/\x01/gm,"<");
					if (text !== "") {
						r += nextsep + "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]";
						nextsep = ",";
					}
					if (index === end) {
						break;
					}
					offset = index;
				}
				offset += 3;
			}
		} else if (s.charAt(offset) === "?") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_pi.indexOf(c) === -1) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf("?>", offset - 1);
			if (index === -1) {
				index = end;
			}
			if (nodename.toLowerCase() === "xml") {
				throw Error("Invalid processing instruction");
			} else if (nodename !== "") {
				text = "";
				ii = offset;
				while (ii < index) {
					text += s.charAt(ii++);
				}
				text = text.replace(/\x01/gm,"<");
				r0 = "[Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTarget,['" + nodename + "']],[Fleur.XQueryX.piValueExpr,[[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + text + "']]]]]]]]";
				if (r === "") {
					return String(index + 2) + "." + r0;
				}
				r += nextsep + r0;
				nextsep = ",";
			}
			if (index === end) {
				break;
			}
			offset = index + 2;
		} else if (s.charAt(offset) === "/") {
			offset++;
			c = s.charAt(offset++);
			nodename = "";
			while (seps_close.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			if (nodename === currnodename) {
				if (nextsep !== ",") {
					r += "]]";
				} else {
					r += "]]]]";
				}
				nextsep = ",";
				if (parents.length === 1) {
					return offset + "." + r;
				}
				currnodename = parents.pop();
			} else {
				throw Error("Malformed XML fragment");
			}
			offset = s.indexOf(">", offset - 1) + 1;
			if (offset === 0) {
				break;
			}
		} else {
			c = s.charAt(offset++);
			nodename = "";
			while (seps_elt.indexOf(c) === -1 && offset <= end) {
				nodename += c;
				c = s.charAt(offset++);
			}
			index = s.indexOf(">", offset - 1);
			if (nodename !== "") {
				newnamespaces = {};
				for (prefix in namespaces) {
					if (namespaces.hasOwnProperty(prefix)) {
						newnamespaces[prefix] = namespaces[prefix];
					}
				}
				attrs = {};
				while (offset <= end) {
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "/" || c === ">" || offset === end) {
						break;
					}
					attrname = "";
					while (seps_attr.indexOf(c) === -1 && offset <= end) {
						attrname += c;
						c = s.charAt(offset++);
					}
					if (attrname === "") {
						throw new Error("Invalid character: " + c);
					}
					while (seps.indexOf(c) !== -1 && offset <= end) {
						c = s.charAt(offset++);
					}
					if (c === "=") {
						c = s.charAt(offset++);
						while (seps.indexOf(c) !== -1 && offset <= end) {
							c = s.charAt(offset++);
						}
						attrvalue = "";
						attrvalues = [];
						if (c === "'" || c === "\"") {
							c0 = c;
							c1 = c;
							c = s.charAt(offset++);
							c2 = s.charAt(offset);
							braces = 0;
							attrvalue = "";
							ii = offset;
							while ((c !== c0 || c2 === c0 || braces !== 0) && offset <= end) {
								if (c === "{") {
									if (braces === 0 && attrvalue !== "") {
										attrvalues.push([0, attrvalue]);
										attrvalue = "";
									}
									if (c1 === c) {
										braces--;
										if (braces === 0) {
											attrvalue = (attrvalues.length > 0 ? attrvalues.pop()[1] : "") + "{";
										}
									} else {
										braces++;
									}
								} else if (c === "}") {
									if (braces === 1 && attrvalue !== "") {
										attrvalues.push([1, attrvalue]);
										attrvalue = "";
									}
									if (c1 === c) {
										braces++;
										if (braces === 0) {
											attrvalue += "}";
										}
									} else {
										braces--;
									}
								} else if (c === c2 && c === c0) {
									attrvalue += c;
									c1 = c;
									c = s.charAt(++offset);
									c2 = s.charAt(++offset);
									continue;
								} else {
									attrvalue += c;
								}
								c1 = c;
								c = c2;
								c2 = s.charAt(++offset);
							}
							if (attrvalue !== "") {
								attrvalues.push([0, attrvalue]);
							}
							c = c2;
							offset++;
						} else {
							while (seps_elt.indexOf(c) === -1 && offset <= end) {
								attrvalue += c;
								c = s.charAt(offset++);
							}
							attrvalues = [[0, attrvalue]];
						}
					} else {
						attrvalues = [[0, attrname]];
					}
					pindex = attrname.indexOf(":");
					prefix = pindex !== -1 ? attrname.substr(0, pindex) : " ";
					localName = pindex !== -1 ? attrname.substr(pindex + 1) : attrname;
					if (!attrs[prefix]) {
						attrs[prefix] = {};
					}
					attrs[prefix][localName] = attrvalues;
					if (prefix === "xmlns") {
						newnamespaces[localName] = attrvalues;
					} else if (prefix === " " && localName === "xmlns") {
						newnamespaces[" "] = attrvalues;
					}
				}
				pindex = nodename.indexOf(":");
				if (pindex === -1) {
					r0 = nextsep + "[Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,['" + nodename + "']]";
				} else {
					r0 = nextsep + "[Fleur.XQueryX.elementConstructor,[[Fleur.XQueryX.tagName,['" + nodename.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + nodename.substr(0, pindex) + "']]]]";
				}
				if (Object.keys(attrs).length) {
					nextsep = ",[Fleur.XQueryX.attributeList,[";
					if (attrs[" "] && attrs[" "].xmlns) {
						r0 += nextsep + "[Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.uri,[" + (attrs[" "].xmlns.length !== 0 ? "'" + attrs[" "].xmlns[0][1] + "'" : "") + "]]]]";
						nextsep = ",";
						delete attrs[" "].xmlns;
					}
					for (attrname in attrs.xmlns) {
						if (attrs.xmlns.hasOwnProperty(attrname)) {
							r0 += nextsep + "[Fleur.XQueryX.namespaceDeclaration,[[Fleur.XQueryX.prefixElt,['" + attrname + "']],[Fleur.XQueryX.uri,['" + attrs.xmlns[attrname][0][1] + "']]]]";
							nextsep = ",";
						}
					}
					delete attrs.xmlns;
					for (prefix in attrs) {
						if (attrs.hasOwnProperty(prefix)) {
							for (attrname in attrs[prefix]) {
								if (attrs[prefix].hasOwnProperty(attrname)) {
									r0 += nextsep + "[Fleur.XQueryX.attributeConstructor,[[Fleur.XQueryX.attributeName,['" + attrname + "'";
									if (prefix !== " ") {
										r0 += ",[Fleur.XQueryX.prefix,['" + prefix + "']]";
									}
									r0 += "]],";
									if (attrs[prefix][attrname].length === 0) {
										r0 += "[Fleur.XQueryX.attributeValue,[]]";
										nextsep = ",";
									} else if (attrs[prefix][attrname].length === 1 && attrs[prefix][attrname][0][0] === 0) {
										r0 += "[Fleur.XQueryX.attributeValue,['" + Fleur.DocumentType.resolveEntities(null, attrs[prefix][attrname][0][1]).replace(/'/gm,"\\'").replace(/\x01/gm,"<") + "']]";
										nextsep = ",";
									} else {
										nextsep = "[Fleur.XQueryX.attributeValueExpr,[";
										attrs[prefix][attrname].forEach(function(v) {
											r0 += nextsep;
											if (v[0] === 0) {
												r0 += "[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,['" + Fleur.DocumentType.resolveEntities(null, v[1]).replace(/'/gm,"\\'") + "']]]]";
											} else {
												r0 += Fleur.XPathEvaluator._xp2js(v[1], "", "");
											}
											nextsep = ",";
										});
										r0 += "]]";
									}
									r0 += "]]";
								}
							}
						}
					}
					r0 += "]]";
				}
				if (s.charAt(offset - 1) !== "/") {
					nextsep = ",[Fleur.XQueryX.elementContent,[";
					parents.push(currnodename);
					currnodename = nodename;
					r += r0;
				} else {
					if (r === "") {
						return String(offset + 1) + "." + r0 + "]]";
					}
					r += r0 + "]]";
					nextsep = ",";
				}
			} else {
				throw Error("Invalid element name");
			}
			offset = index + 1;
			if (offset === 0) {
				break;
			}
		}
	}
};
Fleur.XPathEvaluator._getPredParam = function(c, s, l, arg, allowpredicates, predstart, predarr, ops) {
	var t;
	l = l || 0;
	var p, plen, arg20, arg2;
	var isret = false;
	if (c === "?") {
		var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
		var c2 = s.charAt(i);
		var d = s.substr(i + 1);
		var r, t1;
		if (c2 !== "" && "0123456789".indexOf(c2) !== -1) {
			t1 = Fleur.XPathEvaluator._getNumber(c2 + d);
			r = "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + t1.replace(/e\+/, "e") + "']]]]]]";
			t = (t1.length + 1) + "." + r;
			plen = t1.length + 1;
		} else if (c2 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c2) !== -1) {
			t1 = Fleur.XPathEvaluator._getName(c2 + d);
			r = "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.NCName,['" + t1 + "']]]]";
			t = (t1.length + 1) + "." + r;
			plen = t1.length + 1;
		} else if (c2 === "*") {
			t = "2.[Fleur.XQueryX.lookup,[[Fleur.XQueryX.star,[]]]]";
			plen = 2;
		} else if (c2 === "(") {
			t = Fleur.XPathEvaluator._xp2js(s.substr(i + 1), "", "5.999.(");
			plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1 + i;
			t = String(plen) + "." + "[Fleur.XQueryX.lookup,[[Fleur.XQueryX.expr,[" + t.substr(t.indexOf(".") + 1) + "]]]]";
		}
	} else {
		var func = "";
		if (arg.indexOf("[Fleur.XQueryX.nameTest,['") !== -1) {
			var func0 = arg.substr(arg.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
			func = func0.substr(0, func0.length - 6);
		}
		if (func === "'function'") {
			t = "function";
			plen = s.length;
		} else {
			t = Fleur.XPathEvaluator._xp2js(s, "", l === 0 ? "" : arg.substr(0, 57) === "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier," ? "5.999.q" : "5.999.(");
			plen = s.length - parseInt(t.substr(0, t.indexOf(".")), 10) + 1;
		}
	}
	if (t.indexOf("~~~~") !== -1) {
		var t0 = t + "~#~#";
		t0 = t0.substr(0, t0.indexOf("~#~#"));
		t0 = t0.replace('"', "");
		var msg = '"~~~~' + t0.substr(t0.indexOf("~~~~") + 4) + "in '" + s + "'~#~#" + '"';
		p = plen + "." + msg;
		throw Error(t0 + "in '" + s + "'~#~#");
	} else if (t === "") {
		var msg2 = '"' + "~~~~Unrecognized expression '" + s + "'~#~#" + '"';
		p = plen + "." + msg2;
		throw Error("~~~~Unrecognized expression '" + s + "'~#~#");
	} else if (c === "{") {
		var cargs = t.substr(t.indexOf(".") + 1);
		if (cargs.substr(0, 25) === "[Fleur.XQueryX.arguments,") {
			cargs = "[Fleur.XQueryX.sequenceExpr," + cargs.substr(25);
		}
		if (arg.substr(0, 40) === "[Fleur.XQueryX.computedEntryConstructor," || arg.substr(0, 42) === "[Fleur.XQueryX.computedElementConstructor," || arg.substr(0, 44) === "[Fleur.XQueryX.computedAttributeConstructor,") {
			p = plen + "." + arg.substr(0, arg.length - 2) + ",[Fleur.XQueryX.valueExpr,[" + cargs + "]]]]";
		} else if (arg.substr(0, 37) === "[Fleur.XQueryX.computedPIConstructor,") {
			p = plen + "." + arg.substr(0, arg.length - 2) + ",[Fleur.XQueryX.piValueExpr,[" + cargs + "]]]]";
		} else {
			var cname0 = arg.substr(arg.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
			var cname = cname0.substr(0, cname0.length - 6);
			switch (cname) {
				case "'document'":
					p = plen + "." + "[Fleur.XQueryX.computedDocumentConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
				case "'comment'":
					p = plen + "." + "[Fleur.XQueryX.computedCommentConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
				case "'map'":
					var cargs2 = cargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? cargs.substr(26, cargs.length - 28) : cargs;
					p = plen + "." + "[Fleur.XQueryX.mapConstructor,[" + cargs2 + "]]";
					break;
				case "'array'":
					var cargs3 = cargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? cargs.substr(26, cargs.length - 28) : cargs;
					p = plen + "." + "[Fleur.XQueryX.arrayConstructor,[" + cargs3 + "]]";
					break;
				case "'entry'":
					p = plen + "." + "[Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'element'":
					p = plen + "." + "[Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'attribute'":
					p = plen + "." + "[Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagNameExpr,[" + cargs + "]]]]";
					break;
				case "'processing-instruction'":
					p = plen + "." + "[Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTargetExpr,[" + cargs + "]]]]";
					break;
				case "'text'":
					p = plen + "." + "[Fleur.XQueryX.computedTextConstructor,[[Fleur.XQueryX.argExpr,[" + cargs + "]]]]";
					break;
				case "'try'":
					p = plen + "." + "[Fleur.XQueryX.tryCatchExpr,[[Fleur.XQueryX.tryClause,[" + cargs + "]]]]";
					break;
				default:
					if (ops.startsWith("8.31.catch") || ops.startsWith("3.8.|8.31.catch")) {
						arg20 = arg.substr(86);
						arg2 = arg20.substr(0, arg20.length - 4);
						p = plen + "." + "[Fleur.XQueryX.catchErrorList,[" + arg2 + "]],[Fleur.XQueryX.catchExpr,[" + cargs + "]]";
					}
					break;
			}
		}
	} else if (c === "(") {
		if (arg.substr(0, 77) === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['") {
			var fname0 = arg.substr(arg.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
			var fname = fname0.substr(0, fname0.length - 6);
			var fargs = t.substr(t.indexOf(".") + 1);
			var fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			var parg0, parg;
			switch (fname) {
				case "'array'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['array']]]]")) + "[Fleur.XQueryX.arrayTest,[]]]]]]";
					break;
				case "'attribute'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.attributeName");
					p = plen + "." + "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['attribute']],[Fleur.XQueryX.attributeTest,[" + parg + "]]]]]]";
					break;
				case "'comment'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['comment']]]]")) + "[Fleur.XQueryX.commentTest,[]]]]]]";
					break;
				case "'document-node'":
					if (fargs2 !== "") {
						parg0 = fargs2.substr(fargs2.indexOf("[Fleur.XQueryX.elementTest,["));
						parg = parg0.substr(0, parg0.length - 4);
					} else {
						parg = "";
					}
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['document-node']]]]")) + "[Fleur.XQueryX.documentTest,[" + parg + "]]]]]]";
					break;
				case "'element'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.elementName");
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['element']]]]")) + "[Fleur.XQueryX.elementTest,[" + parg + "]]]]]]";
					break;
				case "'entry'":
					parg = Fleur.XPathEvaluator._testFormat(fargs2, "Fleur.XQueryX.entryName");
					p = plen + "." + "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['entry']],[Fleur.XQueryX.entryTest,[" + parg + "]]]]]]";
					break;
				case "'function'":
					var j = -1;
					var xq = s;
					var pindex, np, nbpar = 0;
					var fres = "[Fleur.XQueryX.paramList,[";
					var end = xq.length;
					do {
						j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
						c = xq.charAt(j);
						if (c !== ")") {
							if (c !== "$") {
								throw Error("Unexpected char at '" + xq.substr(j) + "'");
							}
							j++;
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
								throw Error("Unexpected char at '" + xq.substr(j) + "'");
							}
							var pname = Fleur.XPathEvaluator._getName(c + d);
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + pname.length);
							c = xq.charAt(j);
							var tdecl = "";
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								d = xq.substr(j + 1);
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "as") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
										d = xq.substr(j + 1);
										var ptype = Fleur.XPathEvaluator._getName(c + d);
										pindex = ptype.indexOf(":");
										np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
										c = xq.charAt(j + ptype.length);
										tdecl = ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
										if ("?+*".indexOf(c) !== -1) {
											tdecl += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
											j++;
										}
										tdecl += "]]";
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + ptype.length);
										c = xq.charAt(j);
									}
								}
							}
							if (nbpar !== 0) {
								fres += ",";
							}
							fres += "[Fleur.XQueryX.param,[[Fleur.XQueryX.varName,['" + pname + "']]" + tdecl + "]]";
							nbpar++;
						}
					} while (c === ",");
					if (c !== ")") {
						throw Error("Unexpected char at '" + xq.substr(j) + "'");
					}
					fres += "]]";
					j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
					c = xq.charAt(j);
					if (c === "a") {
						d = xq.substr(j + 1);
						r = Fleur.XPathEvaluator._getName(c + d);
						if (r === "as") {
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								d = xq.substr(j + 1);
								ptype = Fleur.XPathEvaluator._getName(c + d);
								pindex = ptype.indexOf(":");
								np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
								c = xq.charAt(j + ptype.length);
								fres += ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
								if ("?+*".indexOf(c) !== -1) {
									fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
									j++;
								}
								fres += "]]";
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + ptype.length);
								c = xq.charAt(j);
							}
						}
					}
					if (c === "{") {
						fres += ",[Fleur.XQueryX.functionBody,[";
						var braces = 1;
						var body = "";
						while ((c !== "}" || braces !== 0) && j !== end) {
							c = xq.charAt(++j);
							if (c === "{") {
								braces++;
							} else if (c === "}") {
								braces--;
							}
							if (braces !== 0) {
								body += c;
							}
						}
						if (body !== "") {
							fres += Fleur.XPathEvaluator._xp2js(body, "", "");
						}
						fres += "]]";
					} else {
						throw Error("Unexpected char at '" + xq.substr(j) + "'");
					}
					plen = j + 2;
					p = plen + ".[Fleur.XQueryX.inlineFunctionExpr,[" + fres + "]]";
					break;
				case "'item'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['item']]]]")) + "[Fleur.XQueryX.anyItemType,[]]]]]]";
					break;
				case "'map'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['map']]]]")) + "[Fleur.XQueryX.mapTest,[]]]]]]";
					break;
				case "'namespace-node'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['namespace-node']]]]")) + "[Fleur.XQueryX.namespaceTest,[]]]]]]";
					break;
				case "'node'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['node']]]]")) + "[Fleur.XQueryX.anyKindTest,[]]]]]]";
					break;
				case "'processing-instruction'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['processing-instruction']]]]")) + "[Fleur.XQueryX.piTest,[" + (fargs2 ? "[Fleur.XQueryX.piTarget,[" + fargs2.substr(57) : "]]") + "]]]]";
					break;
				case "'schema-attribute'":
					parg0 = fargs.substr(fargs.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
					parg = parg0.substr(0, parg0.length - 6);
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['schema-attribute']]]]")) + "[Fleur.XQueryX.schemaAttributeTest,[" + parg + "]]]]]]";
					break;
				case "'schema-element'":
					parg0 = fargs.substr(fargs.indexOf("[Fleur.XQueryX.nameTest,['") + 25);
					parg = parg0.substr(0, parg0.length - 6);
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['schema-element']]]]")) + "[Fleur.XQueryX.schemaElementTest,[" + parg + "]]]]]]";
					break;
				case "'text'":
					p = plen + "." + arg.substr(0, arg.indexOf("[Fleur.XQueryX.nameTest,['text']]]]")) + "[Fleur.XQueryX.textTest,[]]]]]]";
					break;
				default:
					p = plen + ".[Fleur.XQueryX.functionCallExpr,[[Fleur.XQueryX.functionName,[" + fname + "]],[Fleur.XQueryX.arguments,[" + fargs2 + "]]]]";
			}
		} else if (arg.substr(0, 77) === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[") {
			var arg1, lookup = false;
			if (arg.indexOf(",[Fleur.XQueryX.predicates,[") !== -1) {
				arg1 = arg.substr(0, arg.indexOf(",[Fleur.XQueryX.predicates,[")).substr(77);
				arg20 = arg.substr(arg.indexOf(",[Fleur.XQueryX.predicates,[") + 28);
				arg2 = arg20.substr(0, arg20.length - 6);
			} else if (arg.indexOf(",[Fleur.XQueryX.lookup,[") !== -1) {
				lookup = true;
				arg1 = arg.substr(0, arg.indexOf(",[Fleur.XQueryX.lookup,[")).substr(77);
				arg20 = arg.substr(arg.indexOf(",[Fleur.XQueryX.lookup,[") + 24);
				arg2 = arg20.substr(0, arg20.length - 6);
			} else {
				arg1 = arg.substr(0, arg.length - 8).substr(77);
				arg2 = "";
			}
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg1 + (arg2 === "" ? "" : (lookup ? ",[Fleur.XQueryX.lookup,[" : ",[Fleur.XQueryX.predicates,[")+ arg2 + "]]") + (fargs2 === "" ? "" : ",[Fleur.XQueryX.arguments,[" + fargs2 + "]]") + "]]]]]]]]";
		} else if (arg.substr(0, 32) === "[Fleur.XQueryX.namedFunctionRef,") {
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg + "]]]]]]]]]]";
		} else if (arg === "[Fleur.XQueryX.flworExpr,[]]") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.flworExpr,[" + fargs2 + "]]";
			isret = true;
		} else if (arg.substr(0, 57) === "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + "." + arg.substr(0, arg.length - 2) + "," + fargs2 + "]]";
			isret = true;
		} else if (arg !== "") {
			fargs = t.substr(t.indexOf(".") + 1);
			fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
			p = plen + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[[Fleur.XQueryX.dynamicFunctionInvocationExpr,[[Fleur.XQueryX.functionItem,[" + arg + "]]" + (fargs2 === "" ? "" : ",[Fleur.XQueryX.arguments,[" + fargs2 + "]]") + "]]]]]]]]";
		} else {
			p = plen + "." + t.substr(t.indexOf(".") + 1);
		}
	} else {
		if (arg.substr(0, 25) !== "[Fleur.XQueryX.pathExpr,[") {
			arg = "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[" + arg + "]]]]]]";
		}
		if (c === "?") {
			if (arg.indexOf(",[Fleur.XQueryX.predicates,[") === -1) {
				p = plen + "." + arg.substr(0, arg.length - 4) + "," + t.substr(t.indexOf(".") + 1) + "]]]]";
			} else {
				p = plen + "." + arg.substr(0, predstart) + predarr.reduce(function(s, pr) {return s + ",[Fleur.XQueryX.predicate,[" + pr + "]]";}, "") + "," + t.substr(t.indexOf(".") + 1) + "]]]]";;
			}
			allowpredicates = false;
		} else if (arg.indexOf(",[Fleur.XQueryX.predicates,[") === -1) {
			if (allowpredicates) {
				predarr = [];
				predarr.push(t.substr(t.indexOf(".") + 1));
				predstart = arg.length - 4;
			}
			p = plen + "." + arg.substr(0, arg.length - 4) + ",[" + (allowpredicates ? "Fleur.XQueryX.predicates" : "Fleur.XQueryX.predicate") + ",[" + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		} else {
			if (allowpredicates) {
				predarr.push(t.substr(t.indexOf(".") + 1));
			}
			p = plen + "." + arg.substr(0, arg.length - 6) + "," + t.substr(t.indexOf(".") + 1) + "]]]]]]";
		}
	}
	if (!isret) {
		var inext = Fleur.XPathEvaluator._skipSpaces(s, plen - 1);
		var cnext = s.charAt(inext);
		if (cnext === "(" || cnext === "[" || cnext === "{" || cnext === "?") {
			return Fleur.XPathEvaluator._getPredParam(cnext, s.substr(inext + 1), l + inext + 1, p.substr(p.indexOf(".") + 1), allowpredicates, predstart, predarr, ops);
		}
	}
	return (l + plen) + "." + p.substr(p.indexOf(".") + 1);
};
Fleur.XPathEvaluator._getPredParams = function(s, len, arg, ops) {
	var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
	if (s.charAt(i) === "(" || s.charAt(i) === "[" || s.charAt(i) === "{" || (s.charAt(i) === "?" && ops.substr(0, 16) !== "13.6.instance of" && ops.substr(0, 16) !== "9.3.cast as" && ops.substr(0, 16) !== "13.4.castable as")) {
		return Fleur.XPathEvaluator._getPredParam(s.charAt(i), s.substr(i + 1), len + i, arg, true, 0, [], ops);
	}
	return (len + i) + "." + arg;
};
Fleur.XPathEvaluator._getStringLiteral = function(s) {
	var i = Fleur.XPathEvaluator._skipSpaces(s, 0);
	var d = s.substr(i + 1);
	if (s.charAt(i) === "'") {
		var sep2 = d.indexOf("'");
		var t2 = d.substr(0, d.indexOf("'"));
		while (d.substr(sep2 + 1, 1) === "'") {
			var d2 = d.substr(sep2 + 2);
			t2 += "\\'" + d2.substr(0, d2.indexOf("'"));
			sep2 += 2 + d2.indexOf("'");
		}
		var t2b = "'" + Fleur.DocumentType.resolveEntities(null, t2) + "'";
		if (t2b === "''") {
			t2b = "";
		}
		return (sep2 + 2) + "." + t2b;
	} else if (s.charAt(i) === '"') {
		var sep3 = d.indexOf('"');
		var t3 = d.substr(0, d.indexOf('"'));
		while (d.substr(sep3 + 1, 1) === '"') {
			var d3 = d.substr(sep3 + 2);
			t3 += '\\"' + d3.substr(0, d3.indexOf('"'));
			sep3 += 2 + d3.indexOf('"');
		}
		var t3b = '"' + Fleur.DocumentType.resolveEntities(null, t3) + '"';
		if (t3b === '""') {
			t3b = "";
		}
		return (sep3 + 2) + "." + t3b;
	}
};
Fleur.XPathEvaluator._getNumber = function(s, r) {
	r = r || "";
	if (s === "") {
		return r;
	}
	var c = s.charAt(0);
	if (c === "E") {
		c = "e";
	}
	if ("0123456789".indexOf(c) !== -1 || ((c === "." || c === "e") && r.indexOf(c) === -1) ||
		((c === "-" || c === "+") && r.endsWith("e"))) {
		return Fleur.XPathEvaluator._getNumber(s.substr(1), r + c);
	}
	return r;
};
Fleur.XPathEvaluator._xp2js = function(xp, args, ops) {
	var i = Fleur.XPathEvaluator._skipSpaces(xp, 0);
	var c = xp.charAt(i);
	var d = xp.substr(i + 1);
	var d2;
	var r = "";
	if (c === "." && (d === "" || "0123456789".indexOf(d.charAt(0)) === -1)) {
		if (d.charAt(0) === ".") {
			r = "2.[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['parent']],[Fleur.XQueryX.anyKindTest,[]]]]]]";
		} else {
			r = "1.[Fleur.XQueryX.contextItemExpr,[]]";
		}
	} else if (c === ")" || c === "}") {
		r = "0.";
	} else if (c === "/") {
		var ir = Fleur.XPathEvaluator._skipSpaces(d, 0);
		r = (d.charAt(0) === "" || "/@*.(_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(d.charAt(ir)) === -1 ? "1" : "0") + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.rootExpr,[]]]]";
	} else if (c === "@") {
		r = Fleur.XPathEvaluator._getNameStep(d, 1);
	} else if (c === "'") {
		var sep2 = d.indexOf("'");
		var t2 = Fleur.DocumentType.resolveEntities(null, d.substr(0, d.indexOf("'"))).replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\\"').replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
		while (d.substr(sep2 + 1, 1) === "'") {
			d2 = d.substr(sep2 + 2);
			t2 += "\\'" + Fleur.DocumentType.resolveEntities(null, d2.substr(0, d2.indexOf("'"))).replace(/[\\]/g, '\\\\').replace(/[\"]/g, '\\\"').replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
			sep2 += 2 + d2.indexOf("'");
		}
		var t2b = "'" + t2 + "'";
		if (t2b === "''") {
			t2b = "";
		}
		r = (sep2 + 2) + ".[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[" + t2b + "]]]]";
	} else if (c === '"') {
		var sep3 = d.indexOf('"');
		var t3 = Fleur.DocumentType.resolveEntities(null, d.substr(0, d.indexOf('"'))).replace(/[\\]/g, '\\\\').replace(/[\']/g, "\\\'").replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
		while (d.substr(sep3 + 1, 1) === '"') {
			var d3 = d.substr(sep3 + 2);
			t3 += '\\"' + Fleur.DocumentType.resolveEntities(null, d3.substr(0, d3.indexOf('"'))).replace(/[\\]/g, '\\\\').replace(/[\']/g, "\\\'").replace(/[\/]/g, '\\/').replace(/[\b]/g, '\\b').replace(/[\f]/g, '\\f').replace(/[\n]/g, '\\n').replace(/[\r]/g, '\\r').replace(/[\t]/g, '\\t');
			sep3 += 2 + d3.indexOf('"');
		}
		var t3b = '"' + t3 + '"';
		if (t3b === '""') {
			t3b = "";
		}
		r = (sep3 + 2) + ".[Fleur.XQueryX.stringConstantExpr,[[Fleur.XQueryX.value,[" + t3b + "]]]]";
	} else if (c === "(") {
		var endseq = Fleur.XPathEvaluator._skipSpaces(d, 0);
		if (d.charAt(endseq) === ")") {
			r = String(2 + endseq) + ".[Fleur.XQueryX.sequenceExpr,[]]";
		} else {
			r = "0.";
		}
	} else if (c === "-" || c === "+") {
			c = "~" + c;
			r = "0.";
	} else if (c !== "" && ".0123456789".indexOf(c) !== -1) {
		var t5 = Fleur.XPathEvaluator._getNumber(c + d);
		r = t5.length + ".[" + (t5.indexOf("e") !== -1 ? "Fleur.XQueryX.doubleConstantExpr" : t5.indexOf(".") !== -1 ? "Fleur.XQueryX.decimalConstantExpr" : "Fleur.XQueryX.integerConstantExpr") + ",[[Fleur.XQueryX.value,['" + t5.replace(/e\+/, "e") + "']]]]";
	} else if (c === "$") {
		var t51 = Fleur.XPathEvaluator._getName(d);
		var pt51 = (t51.indexOf(":") === -1 ? ":" : "") + t51;
		var instr;
		if (ops.startsWith("11.30.group by") || ops.startsWith("5.29.~,11.30.group by")) {
			instr = "[Fleur.XQueryX.groupingSpec,[[Fleur.XQueryX.varName,[";
		} else {
			instr = "[Fleur.XQueryX.varRef,[[Fleur.XQueryX.name,[";
		}
		r = (t51.length + 1) + "." + instr + "'" + pt51.substr(pt51.indexOf(":") + 1) + "'" + (pt51.charAt(0) === ":" ? "" : ",[Fleur.XQueryX.prefix,['" + pt51.substr(0, pt51.indexOf(":")) + "']]") + "]]]]";
	} else if (c === "?") {
		var c2 = d.charAt(0);
		d = d.substr(1);
		var t52;
		if (c2 !== "" && "0123456789".indexOf(c2) !== -1) {
			t52 = Fleur.XPathEvaluator._getNumber(c2 + d);
			r = String(t52.length) + ".[Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.integerConstantExpr,[[Fleur.XQueryX.value,['" + t52.replace(/e\+/, "e") + "']]]]]]";
		} else if (c2 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c2) !== -1) {
			t52 = Fleur.XPathEvaluator._getName(c2 + d);
			r = String(t52.length) + ".[Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.NCName,['" + t52 + "']]]]";
		} else if (c2 === "*") {
			r = "1.[Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.star,[]]]]";
		} else if (c2 === "(") {
			t52 = Fleur.XPathEvaluator._xp2js(d, "", "5.999.(");
			var plen52 = d.length - parseInt(t52.substr(0, t52.indexOf(".")), 10) + 1;
			r = String(plen52) + "." + "[Fleur.XQueryX.unaryLookup,[[Fleur.XQueryX.expr,[" + t52.substr(t52.indexOf(".") + 1) + "]]]]";
		}
	} else if (c !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz*".indexOf(c) !== -1) {
		var t61 = Fleur.XPathEvaluator._getName(c+d);
		if (["element","attribute","entry","processing-instruction"].indexOf(t61) !== -1) {
			var i61 = Fleur.XPathEvaluator._skipSpaces(xp, i + t61.length);
			var c61 = xp.charAt(i61);
			if (c61 !== "" && "_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".indexOf(c61) !== -1) {
				var d61 = xp.substr(i61 + 1);
				var t62 = Fleur.XPathEvaluator._getName(c61 + d61);
				switch(t61) {
					case "element":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedElementConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
						break;
					case "attribute":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedAttributeConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
						break;
					case "processing-instruction":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedPIConstructor,[[Fleur.XQueryX.piTarget,['" + t62  + "']]]]";
						break;
					case "entry":
						r = String(i61 - i + t62.length) + ".[Fleur.XQueryX.computedEntryConstructor,[[Fleur.XQueryX.tagName,['" + t62  + "']]]]";
				}
			} else {
				r = Fleur.XPathEvaluator._getNameStep(c + d, 0);
			}
		} else {
			r = Fleur.XPathEvaluator._getNameStep(c + d, 0);
		}
	} else if (c === "<") {
		r = Fleur.XPathEvaluator._getNodeConstructor(c + d);
	} else {
		r = "~~~~Unexpected char at '" + c + d + "'~#~#";
		throw Error("~~~~Unexpected char at '" + c + d + "'~#~#");
	}
	if (r.indexOf("~~~~") !== -1) {
		return r;
	}
	var rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
	var rval = r.substr(r.indexOf(".") + 1);
	d2 = rlen === 0 ? c + d : d.substr(rlen - 1);
	r = Fleur.XPathEvaluator._getPredParams(d2, rlen, rval, ops);
	rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
	rval = r.substr(r.indexOf(".") + 1);
	var args2 = rval.length + "." + rval + args;
	var f = rlen === 0 ? c + d : d.substr(rlen - 1);
	var i4 = Fleur.XPathEvaluator._skipSpaces(f, 0);
	var o = f.charAt(i4);
	var p = f.substr(f.indexOf(o));
	var op = "null";
	var op2 = "null";
	if ((p.substr(0, 9) === "ascending" || p.substr(0, 10) === "descending") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(o === "a" ? 9 : 10)) === -1) {
		var postprec0 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf(".~~" + (o === "a" ? "ascending" : "descending") + ".") + (o === "a" ? 13 : 14));
		var postprec00 = postprec0.substr(postprec0.indexOf("&") + 1);
		var postprec = postprec00.substr(0, postprec00.indexOf("."));
		var poststacks = Fleur.XPathEvaluator._calc(args2, ops, parseInt(postprec, 10));
		var postargslen = poststacks.substr(0, poststacks.indexOf("."));
		args2 = poststacks.substr(poststacks.indexOf(".") + 1).substr(0, parseInt(postargslen, 10));
		var postnextstack = poststacks.substr(postargslen.length + 1 + parseInt(postargslen, 10));
		var postopslen = postnextstack.substr(0, postnextstack.indexOf("."));
		ops = (postprec.length + 1 + (o === "a" ? 11 : 12)) + "." + postprec + ".~~" + (o === "a" ? "ascending" : "descending") + postnextstack.substr(postnextstack.indexOf(".") + 1).substr(0, parseInt(postopslen, 10));
		f = f.substr(i4 + (o === "a" ? 9 : 10));
		i4 = Fleur.XPathEvaluator._skipSpaces(f, 0);
		o = f.charAt(i4);
		p = f.substr(f.indexOf(o));
	}
	if (ops.substr(0, 16) === "13.6.instance of") {
		if (o === "+" || o === "?" || o === "*") {
			ops = "14.6.instance of" + o + ops.substr(16);
			i4 = Fleur.XPathEvaluator._skipSpaces(f, 1);
			o = f.charAt(i4);
			p = f.substr(f.indexOf(o));
		}
	} else if (ops.substr(0, 13) === "10.5.treat as") {
		if (o === "+" || o === "?" || o === "*") {
			ops = "11.5.treat as" + o + ops.substr(13);
			i4 = Fleur.XPathEvaluator._skipSpaces(f, 1);
			o = f.charAt(i4);
			p = f.substr(f.indexOf(o));
		}
	} else if (ops.substr(0, 11) === "9.3.cast as") {
		if (o === "?") {
			ops = "10.3.cast as" + o + ops.substr(11);
			i4 = Fleur.XPathEvaluator._skipSpaces(f, 1);
			o = f.charAt(i4);
			p = f.substr(f.indexOf(o));
		}
	} else if (ops.substr(0, 16) === "13.4.castable as") {
		if (o === "?") {
			ops = "14.4.castable as" + o + ops.substr(16);
			i4 = Fleur.XPathEvaluator._skipSpaces(f, 1);
			o = f.charAt(i4);
			p = f.substr(f.indexOf(o));
		}
	}
	if (o === "") {
		var stacks = Fleur.XPathEvaluator._calc(args2, ops, 9999999);
		var reslen0 = stacks.substr(stacks.indexOf(".") + 1);
		var reslen = reslen0.substr(0, reslen0.indexOf("."));
		var ret0 = stacks.substr(stacks.indexOf(".") + 1);
		return ret0.substr(ret0.indexOf(".") + 1).substr(0, parseInt(reslen, 10));
	}
	if (o === "]" || o === ")" || o === "}" || (p.substr(0, 6) === "return" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) || (p.substr(0, 9) === "satisfies" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1)) {
		var stacks2 = Fleur.XPathEvaluator._calc(args2, ops, 998);
		var reslen20 = stacks2.substr(stacks2.indexOf(".") + 1);
		var reslen2 = reslen20.substr(0, reslen20.indexOf("."));
		var ret20 = stacks2.substr(stacks2.indexOf(".") + 1);
		return (f.substr(f.indexOf(o) + 1).length - (o === "r" ? 5 : o === "s" ? 8 : 0)) + "." + ret20.substr(ret20.indexOf(".") + 1).substr(0, parseInt(reslen2, 10));
	}
	if (o === "$") {
		switch(rval) {
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['for']]]]]]":
				rval = "[Fleur.XQueryX.flworExpr,[]]";
				op = "for";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['let']]]]]]":
				rval = "[Fleur.XQueryX.flworExpr,[]]";
				op = "let";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['every']]]]]]":
				rval = "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,['every']]]]";
				op = "every";
				break;
			case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['some']]]]]]":
				rval = "[Fleur.XQueryX.quantifiedExpr,[[Fleur.XQueryX.quantifier,['some']]]]";
				op = "some";
				break;
		}
		if (op !== "null") {
			r = Fleur.XPathEvaluator._getPredParams("(" + f, rlen, rval);
			rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
			rval = r.substr(r.indexOf(".") + 1);
			args2 = rval.length + "." + rval + args;
			op = op === "for" || op === "let" ? "return" : "satisfies";
			f = d.substr(rlen - 2 - op.length);
			p = f.substr(1);
		}
	} else if (p.substr(0, 9) === "intersect" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1) {
		op = p.substr(0, 9);
	} else if (p.substr(0, 8) === "allowing" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
		op = p.substr(0, 8);
	} else if (p.substr(0, 8) === "instance" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 8) + 2);
		op2 = "instance of";
	} else if (p.substr(0, 8) === "castable" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(8)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 8) + 2);
		op2 = "castable as";
	} else if ((p.substr(0, 6) === "except" || p.substr(0, 6) === "before") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) {
		op = p.substr(0, 6);
	} else if (p.substr(0, 5) === "treat" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 5) + 2);
		op2 = "treat as";
	} else if (p.substr(0, 5) === "group" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 5) + 2);
		op2 = "group by";
	} else if (p.substr(0, 5) === "order" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 5) + 2);
		op2 = "order by";
	} else if ((p.substr(0, 5) === "union" || p.substr(0, 5) === "every" || p.substr(0, 5) === "nodes" || p.substr(0, 5) === "after" || p.substr(0, 5) === "value" || p.substr(0, 5) === "count" || p.substr(0, 5) === "where" || p.substr(0, 5) === "empty" || p.substr(0, 5) === "catch") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(5)) === -1) {
		op = p.substr(0, 5);
	} else if (p.substr(0, 4) === "cast" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, Fleur.XPathEvaluator._skipSpaces(p, 4) + 2);
		op2 = "cast as";
	} else if ((p.substr(0, 4) === "idiv" || p.substr(0, 4) === "some" || p.substr(0, 4) === "then" || p.substr(0, 4) === "else" || p.substr(0, 4) === "node" || p.substr(0, 4) === "with" || p.substr(0, 4) === "into") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(4)) === -1) {
		op = p.substr(0, 4);
	} else if ((p.substr(0, 3) === "div" || p.substr(0, 3) === "and" || p.substr(0, 3) === "mod" || p.substr(0, 3) === "let" || p.substr(0, 3) === "for") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(3)) === -1) {
		op = p.substr(0, 3);
	} else if ((p.substr(0, 2) === "or" || p.substr(0, 2) === "eq" || p.substr(0, 2) === "ne" || p.substr(0, 2) === "lt" || p.substr(0, 2) === "le" || p.substr(0, 2) === "gt" || p.substr(0, 2) === "ge" || p.substr(0, 2) === "is" || p.substr(0, 2) === "to" || p.substr(0, 2) === "in" || p.substr(0, 2) === "as" || p.substr(0, 2) === "at" || p.substr(0, 2) === "by") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(2)) === -1) {
		op = p.substr(0, 2);
	} else if (p.substr(0, 2) === "!=" || p.substr(0, 2) === "<=" || p.substr(0, 2) === ">=" || p.substr(0, 2) === "<<" || p.substr(0, 2) === ">>" || p.substr(0, 2) === "//" || p.substr(0, 2) === "~+" || p.substr(0, 2) === "~-" || p.substr(0, 2) === ":=" || p.substr(0, 2) === "||" || p.substr(0, 2) === "!!") {
		op = p.substr(0, 2);
	} else if ("+-*=|,;<>/!{:".indexOf(o) !== -1) {
		op = o;
		if (op === ",") {
			if (ops.startsWith("5.18.:=") || ops.startsWith("11.30.group by") || ops.startsWith("5.29.~,11.30.group by")) {
				op2 = "~,";
			} else {
				var optrack = ops;
				while (optrack !== "") {
					if (optrack.startsWith("11.30.order by")) {
						op2 = "~,";
						break;
					}
					var optracklen = parseInt(optrack.substr(0, optrack.indexOf(".")), 10);
					var optrackprec0 = optrack.substring(optrack.indexOf(".") + 1, optracklen);
					var optrackprec = parseInt(optrackprec0.substr(0, optrackprec0.indexOf(".")), 10);
					if (optrackprec > 30) {
						break;
					}
					optrack = optrack.substr(optrack.indexOf(".") + 1 + optracklen);
				}
			}
		}
	}
	if (op !== "null") {
		var opprec0 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf("." + (op2 !== "null" ? op2 : op) + ".") + (op2 !== "null" ? op2 : op).length + 2);
		var opprec00 = opprec0.substr(opprec0.indexOf("&") + 1);
		var opprec = opprec00.substr(0, opprec00.indexOf("."));
		var stacks3 = Fleur.XPathEvaluator._calc(args2, ops, parseInt(opprec, 10));
		var args3len = stacks3.substr(0, stacks3.indexOf("."));
		var args3 = stacks3.substr(stacks3.indexOf(".") + 1).substr(0, parseInt(args3len, 10));
		var nextstack = stacks3.substr(args3len.length + 1 + parseInt(args3len, 10));
		var ops3len = nextstack.substr(0, nextstack.indexOf("."));
		var ops3 = nextstack.substr(nextstack.indexOf(".") + 1).substr(0, parseInt(ops3len, 10));
		var xp3 = p.substr(op.length);
		return Fleur.XPathEvaluator._xp2js(xp3, args3, (opprec.length + 1 + (op2 !== "null" ? op2 : op).length) + "." + opprec + "." + (op2 !== "null" ? op2 : op) + ops3);
	}
	throw Error("~~~~Unknown operator at '" + f + "'~#~#");
};
Fleur.XPathEvaluator._getVersion = function(xq) {
	var i = Fleur.XPathEvaluator._skipSpaces(xq, 0);
	var c = xq.charAt(i);
	var d = xq.substr(i + 1);
	var r = "";
	var v, e;
	if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
		return i + ".";
	}
	r = Fleur.XPathEvaluator._getName(c + d);
	if (r === "xquery") {
		var j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
		c = xq.charAt(j);
		d = xq.substr(j + 1);
		if (c === "" || "abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
			return i + ".";
		}
		r = Fleur.XPathEvaluator._getName(c + d);
		if (r === "version") {
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
			c = xq.charAt(j);
			d = xq.substr(j + 1);
			if (c !== "'" && c !== '"') {
				return i + ".";
			}
			r = Fleur.XPathEvaluator._getStringLiteral(c + d);
			var vl = r.substr(0, r.indexOf("."));
			v = r.substr(vl.length + 1);
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
			c = xq.charAt(j);
			if (c === ";") {
				return (j + 1) + ".[Fleur.XQueryX.versionDecl,[[Fleur.XQueryX.version,[" + v + "]]]],";
			}
			d = xq.substr(j + 1);
			r = Fleur.XPathEvaluator._getName(c + d);
		}
		if (r === "encoding") {
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
			c = xq.charAt(j);
			d = xq.substr(j + 1);
			if (c !== "'" && c !== '"') {
				return i + ".";
			}
			r = Fleur.XPathEvaluator._getStringLiteral(c + d);
			var el = r.substr(0, r.indexOf("."));
			e = r.substr(el.length + 1);
			j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(el, 10));
			c = xq.charAt(j);
			if (c === ";") {
				return (j + 1) + ".[Fleur.XQueryX.versionDecl,[" + (v ? "[Fleur.XQueryX.version,[" + v + "]]," : "") + "[Fleur.XQueryX.encoding,[" + e + "]]]],";
			}
		}
	}
	return i + ".";
};
Fleur.XPathEvaluator._getProlog = function(xq, i) {
	var pindex;
	i = Fleur.XPathEvaluator._skipSpaces(xq, i);
	var c = xq.charAt(i);
	var d = xq.substr(i + 1);
	var r = "", prefix, v, vl;
	var res = i + ".";
	var end = xq.length;
	var updatingfunction = false;
	var j;
	if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
		r = Fleur.XPathEvaluator._getName(c + d);
		switch (r) {
			case "declare":
				j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
				c = xq.charAt(j);
				d = xq.substr(j + 1);
				while (c === "%") {
					r = Fleur.XPathEvaluator._getName(d);
					if (r === "updating") {
						updatingfunction = true;
					}
					j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1 + r.length);
					c = xq.charAt(j);
					d = xq.substr(j + 1);
				}
				if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
					r = Fleur.XPathEvaluator._getName(c + d);
					switch (r) {
						case "default":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								switch (r) {
									case "element":
									case "function":
										var category = r;
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "namespace") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												d = xq.substr(j + 1);
												if (c === "'" || c === '"') {
													r = Fleur.XPathEvaluator._getStringLiteral(c + d);
													vl = r.substr(0, r.indexOf("."));
													v = r.substr(vl.length + 1);
													j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
													c = xq.charAt(j);
													if (c === ";") {
														return (j + 1) + ".[Fleur.XQueryX.defaultNamespaceDecl,[[Fleur.XQueryX.defaultNamespaceCategory,['" + category + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
													}
												}
											}
										}
										break;
									case "collation":
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if (c === "'" || c === '"') {
											r = Fleur.XPathEvaluator._getStringLiteral(c + d);
											vl = r.substr(0, r.indexOf("."));
											v = r.substr(vl.length + 1);
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
											c = xq.charAt(j);
											if (c === ";") {
												return (j + 1) + ".[Fleur.XQueryX.defaultCollationDecl,[" + v + "]],";
											}
										}
										break;
									case "order":
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "empty") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												d = xq.substr(j + 1);
												if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
													r = Fleur.XPathEvaluator._getName(c + d);
													if (r === "greatest" || r === "least") {
														j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
														c = xq.charAt(j);
														if (c === ";") {
															return (j + 1) + ".[Fleur.XQueryX.emptyOrderingDecl,['empty " + r + "']],";
														}
													}
												}
											}
										}
										break;
									case "decimal-format":
								}
							}
							break;
						case "boundary-space":
						case "construction":
							var decl = r === "boundary-space" ? "boundarySpaceDecl" : "constructionDecl";
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "strip" || r === "preserve") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX." + decl + ",['" + r + "']],";
									}
								}
							}
							break;
						case "base-uri":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if (c === "'" || c === '"') {
								r = Fleur.XPathEvaluator._getStringLiteral(c + d);
								vl = r.substr(0, r.indexOf("."));
								v = r.substr(vl.length + 1);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
								c = xq.charAt(j);
								if (c === ";") {
									return (j + 1) + ".[Fleur.XQueryX.baseUriDecl,[" + v + "]],";
								}
							}
							break;
						case "ordering":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "ordered" || r === "unordered") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX.orderingModeDecl,['" + r + "']],";
									}
								}
							}
							break;
						case "copy-namespaces":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "preserve" || r === "no-preserve") {
									var preserve = r;
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									if (c === ",") {
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
										if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
											r = Fleur.XPathEvaluator._getName(c + d);
											if (r === "inherit" || r === "no-inherit") {
												j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
												c = xq.charAt(j);
												if (c === ";") {
													return (j + 1) + ".[Fleur.XQueryX.copyNamespacesDecl,[[Fleur.XQueryX.preserveMode,['" + preserve + "']],[Fleur.XQueryX.inheritMode,['" + r + "']]]],";
												}
											}
										}
									}
								}
							}
							break;
						case "decimal-format":
							break;
						case "namespace":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								prefix = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + prefix.length);
								c = xq.charAt(j);
								if (c === "=") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
									c = xq.charAt(j);
									d = xq.substr(j + 1);
									if (c === "'" || c === '"') {
										r = Fleur.XPathEvaluator._getStringLiteral(c + d);
										vl = r.substr(0, r.indexOf("."));
										v = r.substr(vl.length + 1);
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
										c = xq.charAt(j);
										if (c === ";") {
											return (j + 1) + ".[Fleur.XQueryX.namespaceDecl,[[Fleur.XQueryX.prefixElt,['" + prefix + "']],[Fleur.XQueryX.uri,[" + v + "]]]],";
										}
									}
								}
							}
							break;
						case "context":
							break;
						case "variable":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							if (c !== "$") {
								return res;
							}
							j++;
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var vname = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + vname.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								pindex = vname.indexOf(":");
								var np = pindex === -1 ? "'" + vname + "'" : "'" + vname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + vname.substr(0, pindex) + "']]";
								var fres = ".[Fleur.XQueryX.varDecl,[[Fleur.XQueryX.varName,[" + np + "]]";
								var nbpar = 0;
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "external") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									fres += ",[Fleur.XQueryX.external,[]]";
									if (c === ";") {
										return (j + 1) + fres + "]],";
									}
									d = xq.substr(j + 1);
								}
								if (c + d.charAt(0) !== ":=") {
									return res;
								}
								fres += ",[Fleur.XQueryX.varValue,[";
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + 2);
								c = xq.charAt(j);
								var parents = 0;
								var vvalue = "";
								var instring = false;
								var stringstart;
								while ((c !== ";" || parents !== 0 || instring) && j !== end) {
									vvalue += c;
									if (instring) {
										if (c === stringstart && c !== xq.charAt(j + 1)) {
											instring = false;
										}
									} else {
										if (c === "'" || c === '"') {
											instring = true;
											stringstart = c;
										} else if (c === "(") {
											parents++;
										} else if (c === ")") {
											parents--;
										}
									}
									c = xq.charAt(++j);
								}
								if (vvalue !== "") {
									fres += Fleur.XPathEvaluator._xp2js(vvalue, "", "");
								}
								fres += "]]]],";
								if (c === ";") {
									return (j + 1) + fres;
								}
							}
							break;
						case "function":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var fname = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + fname.length);
								c = xq.charAt(j);
								pindex = fname.indexOf(":");
								var np = pindex === -1 ? "'" + fname + "'" : "'" + fname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + fname.substr(0, pindex) + "']]";
								var fres = ".[Fleur.XQueryX.functionDecl,[" + (updatingfunction ? "[Fleur.XQueryX.updatingFunction,['true']]," : "") + "[Fleur.XQueryX.functionName,[" + np + "]],[Fleur.XQueryX.paramList,[";
								var nbpar = 0;
								if (c === "(") {
									do {
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										if (c !== ")") {
											if (c !== "$") {
												return res;
											}
											j++;
											c = xq.charAt(j);
											d = xq.substr(j + 1);
											if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) === -1) {
												return res;
											}
											var pname = Fleur.XPathEvaluator._getName(c + d);
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + pname.length);
											c = xq.charAt(j);
											var tdecl = "";
											if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
												d = xq.substr(j + 1);
												r = Fleur.XPathEvaluator._getName(c + d);
												if (r === "as") {
													j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
													c = xq.charAt(j);
													if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
														d = xq.substr(j + 1);
														var ptype = Fleur.XPathEvaluator._getName(c + d);
														pindex = ptype.indexOf(":");
														np = pindex === -1 ? "'" + ptype + "'" : "'" + ptype.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + ptype.substr(0, pindex) + "']]";
														c = xq.charAt(j + ptype.length);
														tdecl = ",[Fleur.XQueryX.typeDeclaration,[[Fleur.XQueryX.atomicType,[" + np + "]]";
														if ("?+*".indexOf(c) !== -1) {
															tdecl += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
															j++;
														}
														tdecl += "]]";
														j = Fleur.XPathEvaluator._skipSpaces(xq, j + ptype.length);
														c = xq.charAt(j);
													}
												}
											}
											if (nbpar !== 0) {
												fres += ",";
											}
											fres += "[Fleur.XQueryX.param,[[Fleur.XQueryX.varName,['" + pname + "']]" + tdecl + "]]";
											nbpar++;
										}
									} while (c === ",");
									if (c !== ")") {
										return res;
									}
									fres += "]]";
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
									c = xq.charAt(j);
									if (c === "a") {
										d = xq.substr(j + 1);
										r = Fleur.XPathEvaluator._getName(c + d);
										if (r === "as") {
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
											c = xq.charAt(j);
											var ftdecl = "";
											while ("{?+*".indexOf(c) === -1 && j !== end) {
												ftdecl += c;
												c = xq.charAt(++j);
											}
											np = Fleur.XPathEvaluator._xp2js(ftdecl, "", "");
											if (np === "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.anyItemType,[]]]]]]") {
												np = "[Fleur.XQueryX.anyItemType,[]]";
											} else {
												np = np.substr(np.indexOf("[Fleur.XQueryX.nameTest,") + 24);
												np = "[Fleur.XQueryX.atomicType," + np.substr(0, np.length - 4);
											}
											fres += ",[Fleur.XQueryX.typeDeclaration,[" + np;
											if ("?+*".indexOf(c) !== -1) {
												fres += ",[Fleur.XQueryX.occurrenceIndicator,['" + c + "']]";
												j++;
											}
											fres += "]]";
											j = Fleur.XPathEvaluator._skipSpaces(xq, j);
											c = xq.charAt(j);
										}
									}
									if (c === "{") {
										fres += ",[Fleur.XQueryX.functionBody,[";
										var braces = 1;
										var body = "";
										while ((c !== "}" || braces !== 0) && j !== end) {
											c = xq.charAt(++j);
											if (c === "{") {
												braces++;
											} else if (c === "}") {
												braces--;
											}
											if (braces !== 0) {
												body += c;
											}
										}
										if (body !== "") {
											fres += Fleur.XPathEvaluator._xp2js(body, "", "");
										}
										fres += "]]]],";
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										if (c === ";") {
											return (j + 1) + fres;
										}
									} else if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
										d = xq.substr(j + 1);
										r = Fleur.XPathEvaluator._getName(c + d);
										if (r === "external") {
											j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
											c = xq.charAt(j);
											fres += ",[Fleur.XQueryX.externalDefinition,[]]]],";
											if (c === ";") {
												return (j + 1) + fres;
											}
										}
									}
								}
							}
							break;
						case "option":
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								var optionname = Fleur.XPathEvaluator._getName(c + d);
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + optionname.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								if (c === "'" || c === '"') {
									r = Fleur.XPathEvaluator._getStringLiteral(c + d);
									vl = r.substr(0, r.indexOf("."));
									v = r.substr(vl.length + 1);
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
									c = xq.charAt(j);
									if (c === ";") {
										pindex = optionname.indexOf(":");
										if (pindex === -1) {
											return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname + "']],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
										}
										return (j + 1) + ".[Fleur.XQueryX.optionDecl,[[Fleur.XQueryX.optionName,['" + optionname.substr(pindex + 1) + "',[Fleur.XQueryX.prefix,['" + optionname.substr(0, pindex) + "']]]],[Fleur.XQueryX.optionContents,[" + v + "]]]],";
									}
								}
							}
					}
				}
				break;
			case "import":
				j = Fleur.XPathEvaluator._skipSpaces(xq, i + r.length);
				c = xq.charAt(j);
				d = xq.substr(j + 1);
				if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
					r = Fleur.XPathEvaluator._getName(c + d);
					if (r === "javascript") {
						j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
						c = xq.charAt(j);
						d = xq.substr(j + 1);
						if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
							r = Fleur.XPathEvaluator._getName(c + d);
							if (r === "at") {
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								if (c === "'" || c === '"') {
									r = Fleur.XPathEvaluator._getStringLiteral(c + d);
									vl = r.substr(0, r.indexOf("."));
									v = r.substr(vl.length + 1);
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
									c = xq.charAt(j);
									if (c === ";") {
										return (j + 1) + ".[Fleur.XQueryX.javascriptImport,[[Fleur.XQueryX.targetLocation,[" + v + "]]]],";
									}
								}
							} else {
								return res;
							}
						} else {
							return res;
						}
					} else if (r === "module") {
						j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
						c = xq.charAt(j);
						d = xq.substr(j + 1);
						prefix = null;
						if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
							r = Fleur.XPathEvaluator._getName(c + d);
							if (r === "namespace") {
								j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
								c = xq.charAt(j);
								d = xq.substr(j + 1);
								if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
									prefix = Fleur.XPathEvaluator._getName(c + d);
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + prefix.length);
									c = xq.charAt(j);
									if (c === "=") {
										j = Fleur.XPathEvaluator._skipSpaces(xq, j + 1);
										c = xq.charAt(j);
										d = xq.substr(j + 1);
									} else {
										return res;
									}
								} else {
									return res;
								}
							} else {
								return res;
							}
						}
						if (c === "'" || c === '"') {
							r = Fleur.XPathEvaluator._getStringLiteral(c + d);
							vl = r.substr(0, r.indexOf("."));
							var modname = r.substr(vl.length + 1);
							j = Fleur.XPathEvaluator._skipSpaces(xq, j + parseInt(vl, 10));
							c = xq.charAt(j);
							d = xq.substr(j + 1);
							v = null;
							if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
								r = Fleur.XPathEvaluator._getName(c + d);
								if (r === "at") {
									j = Fleur.XPathEvaluator._skipSpaces(xq, j + r.length);
									c = xq.charAt(j);
									var locexpr = "";
									while (c !== ";" && j !== end) {
										locexpr += c;
										c = xq.charAt(++j);
									}
									if (locexpr !== "") {
										v = Fleur.XPathEvaluator._xp2js(locexpr, "", "");
									}
								}
							}
							if (c === ";") {
								return (j + 1) + ".[Fleur.XQueryX.moduleImport,[[Fleur.XQueryX.targetNamespace,[" + modname + "]]" + (prefix ? ",[Fleur.XQueryX.namespacePrefix,['" + prefix + "']]" : "") + (v ? ",[Fleur.XQueryX.targetLocationExpr,[" + v + "]]" : "") + "]],";
							}
						}
					}
				}
		}
	}
	return res;
};
Fleur.XPathEvaluator._xq2js = function(xq) {
	var v = Fleur.XPathEvaluator._getVersion(xq);
	var vl = v.substr(0, v.indexOf("."));
	var prolog = "", p, pc, pl = parseInt(vl, 10);
	do {
		p = Fleur.XPathEvaluator._getProlog(xq, pl);
		pl = parseInt(p.substr(0, p.indexOf(".")), 10);
		pc = p.substr(p.indexOf(".") + 1);
		prolog += pc;
	} while (pc !== "");
	return "[Fleur.XQueryX.module,[" + v.substr(v.indexOf(".") + 1) + "[Fleur.XQueryX.mainModule,[" + (prolog === "" ? "" : "[Fleur.XQueryX.prolog,[" + prolog.substr(0, prolog.length - 1) + "]],") + "[Fleur.XQueryX.queryBody,[" + Fleur.XPathEvaluator._xp2js(xq.substr(pl), "", "") + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]],[Fleur.XQueryX.xqxuf,["http://www.w3.org/2007/xquery-update-10"]],[Fleur.XQueryX.schemaLocation,["http://www.w3.org/2007/xquery-update-10 http://www.w3.org/2007/xquery-update-10/xquery-update-10-xqueryx.xsd http://www.w3.org/2005/XQueryX http://www.w3.org/2005/XQueryX/xqueryx.xsd"]],[Fleur.XQueryX.xsi,["http://www.w3.org/2001/XMLSchema-instance"]]]]';
};
Fleur.XPathException = function(code, error) {
	this.code = code;
	this.error = error;
};
Fleur.XPathException.INVALID_EXPRESSION_ERR = 51;
Fleur.XPathException.TYPE_ERR = 52;
Fleur.XPathExpression = function(expression, compiled) {
	this.expression = expression;
	if (!compiled) {
		var src;
		try {
			src = Fleur.XPathEvaluator._xq2js(expression);
			compiled = eval(src);
		} catch (e) {
			throw new Fleur.XPathException(Fleur.XPathException.INVALID_EXPRESSION_ERR, e.message);
		}
	}
	this.compiled = compiled;
};
Fleur.XPathExpression.prototype.evaluate = function(contextNode, env, type, xpresult) {
	return Fleur.evaluate(this, contextNode, env, type, xpresult);
};
Fleur.XPathNSResolver = function(node) {
	this.pf = [
		"xml",
		"xmlns",
		"xs",
		"xsi",
		"xf",
		" function",
		"fn",
		"local",
		"math",
		"map",
		"array",
		"err",
		"b",
		"bin",
		"file",
		"http",
		"request",
		"prof",
		"proc",
		"js",
		"fleur",
		"dgram",
		"base64",
		"internal",
		"unit",
		"ietf",
		"excel",
		"zip",
		"matrix",
		"xpath",
		"xquery"
	];
	this.uri = [
		"http://www.w3.org/XML/1998/namespace",
		"http://www.w3.org/2000/xmlns/",
		"http://www.w3.org/2001/XMLSchema",
		"http://www.w3.org/2001/XMLSchema-instance",
		"http://www.w3.org/2002/xforms",
		"http://www.w3.org/2005/xpath-functions",
		"http://www.w3.org/2005/xpath-functions",
		"http://www.w3.org/2005/xpath",
		"http://www.w3.org/2005/xpath-functions/math",
		"http://www.w3.org/2005/xpath-functions/map",
		"http://www.w3.org/2005/xpath-functions/array",
		"http://www.w3.org/2005/xqt-errors",
		"http://xqib.org",
		"http://expath.org/ns/binary",
		"http://expath.org/ns/file",
		"http://expath.org/ns/http-client",
		"http://exquery.org/ns/request",
		"http://basex.org/modules/prof",
		"http://basex.org/modules/proc",
		"http://www.w3.org/standards/webdesign/script",
		"http://www.agencexml.com/fleur",
		"http://www.agencexml.com/fleur/dgram",
		"http://www.agencexml.com/fleur/base64",
		"http://www.agencexml.com/fleur/internal",
		"http://www.agencexml.com/fleur/unit",
		"https://tools.ietf.org/rfc/index",
		"http://schemas.openxmlformats.org/spreadsheetml/2006/main",
		"http://expath.org/ns/zip",
		"http://www.mathunion.org/matrix",
		"http://www.w3.org/2005/xpath",
		"http://www.w3.org/2005/xquery"
	];
	this.node = node;
};
Fleur.XPathNSResolver.prototype.lookupNamespaceURI = function(prefix) {
	var uri;
	var index = this.pf.lastIndexOf(prefix);
	if (index !== -1) {
		return this.uri[index];
	}
	if (this.node) {
		uri = this.node.lookupNamespaceURI(prefix);
		if (uri) {
			this.pf.push(prefix);
			this.uri.push(uri);
		}
	}
	return uri;
};
Fleur.XPathNSResolver.prototype.lookupPrefix = function(namespaceURI) {
	var pf;
	var index = this.uri.lastIndexOf(namespaceURI);
	if (index !== -1) {
		return this.pf[index];
	}
	if (this.node) {
		pf = this.node.lookupPrefix(namespaceURI);
		if (pf) {
			this.pf.push(pf);
			this.uri.push(namespaceURI);
		}
	}
	return pf;
};
Fleur.XPathNSResolver.prototype.declareNamespace = function(prefix, uri) {
	this.pf.push(prefix);
	this.uri.push(uri);
};
Fleur.XPathResult = function(doc, expression, contextNode, env, resultType) {
	this.document = doc;
	this.expression = typeof expression === "string" && expression ? new Fleur.XPathExpression(expression) : expression;
	this.contextNode = contextNode;
	this.env = env;
	this.resultType = resultType;
	this._index = 0;
};
Fleur.XPathResult.ANY_TYPE = 0;
Fleur.XPathResult.NUMBER_TYPE = 1;
Fleur.XPathResult.STRING_TYPE = 2;
Fleur.XPathResult.BOOLEAN_TYPE = 3;
Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
Fleur.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
Fleur.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE = 9;
Object.defineProperties(Fleur.XPathResult.prototype, {
	numberValue: {
		get: function() {
			var jsNumber = Fleur.toJSNumber(this);
			if (jsNumber[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsNumber[1];
		}
	},
	stringValue: {
		get: function() {
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	},
	booleanValue: {
		get: function() {
			var jsBoolean = Fleur.toJSBoolean(this);
			if (jsBoolean[0] === -1) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsBoolean[1];
		}
	},
	singleNodeValue: {
		get: function() {
			if (this._result && this._result.nodeType === Fleur.Node.SEQUENCE_NODE) {
				var firstnode = this._result.childNodes[0];
				this._result = firstnode;
			}
			Fleur.Atomize(this);
			var jsString = Fleur.toJSString(this);
			if (jsString[0] === -1 || (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.ANY_UNORDERED_NODE_TYPE && this.resultType !== Fleur.XPathResult.FIRST_ORDERED_NODE_TYPE)) {
				throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
			}
			return jsString[1];
		}
	},
	mediatype: {
		get: function() {
			var opt = this.env.options ? this.env.options["http://www.w3.org/2010/xslt-xquery-serialization"] : null;
			if (opt && opt["media-type"]) {
				return opt["media-type"];
			}
			return ({
				xml: "application/xml",
				html: "text/html",
				json: "application/json",
				text: "text/plain"
			})[this.method];
		}
	},
	method: {
		get: function() {
			var opt = this.env.options ? this.env.options["http://www.w3.org/2010/xslt-xquery-serialization"] : null;
			if (opt && opt.method) {
				return opt.method;
			}
			if (!opt || !opt["media-type"]) {
				if (!this._result) {
					return "text";
				}
				var elt = this._result.documentElement || this._result;
				switch (elt.nodeType) {
					case Fleur.Node.ELEMENT_NODE:
						if (elt.nodeName === "html") {
							if (this._result.nodeType === Fleur.Node.DOCUMENT_NODE) {
								for (var i = 0, l = this._result.childNodes.length; i < l; i++) {
									if (this._result.childNodes[i].nodeType === Fleur.Node.PROCESSING_INSTRUCTION_NODE && this._result.childNodes[i].nodeName === "xml-stylesheet") {
										return "xml";
									}
								}
							}
							return "html";
						}
						return "xml";
					case Fleur.Node.SEQUENCE_NODE:
						return "xml";
					case Fleur.Node.MAP_NODE:
						return "json";
					default:
						return "text";
				}
			}
			switch (opt["media-type"]) {
				case "application/xml":
					return "xml";
				case "text/html":
					return "html";
				default:
					return "text";
			}
		}
	},
	indent: {
		get: function() {
			var opt = this.env.options ? this.env.options["http://www.w3.org/2010/xslt-xquery-serialization"] : null;
			if (!opt) {
				return false;
			}
			return opt["indent"] === "yes" || opt["indent"] === "true" || opt["indent"] === "1";
		}
	}
});
Fleur.XPathResult.prototype.evaluate = function(resolve, reject) {
	var ctx = {
		_curr: this.contextNode || this.document,
		env: this.env,
		xpresult: this
	};
	ctx.env.globalvarresolver = ctx.env.varresolver || new Fleur.varMgr();
	ctx.env.varresolver = new Fleur.varMgr([], ctx.env.globalvarresolver);
	try {
		Fleur.XQueryEngine[this.expression.compiled[0]](ctx, this.expression.compiled[1], function(n) {
			ctx.xpresult._result = n;
			ctx.xpresult.env = ctx.env;
			resolve(ctx.xpresult);
		});
	} catch (e) {
		ctx.xpresult._result = Fleur.error(ctx, "XPST0003", e.message);
		resolve(ctx.xpresult);
	}
};
Fleur.XPathResult.prototype.iterateNext = function() {
	if (this.resultType !== Fleur.XPathResult.ANY_TYPE && this.resultType !== Fleur.XPathResult.UNORDERED_NODE_ITERATOR_TYPE && this.resultType !== Fleur.XPathResult.ORDERED_NODE_ITERATOR_TYPE) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result && this._result.schemaTypeInfo === Fleur.Type_error ? this._result.nodeName : null);
	}
	if (this._result === Fleur.EmptySequence) {
		return null;
	}
	if (this._result.schemaTypeInfo === Fleur.Type_error) {
		throw new Fleur.XPathException(Fleur.XPathException.TYPE_ERR, this._result.nodeName);
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		if (this._index === 0) {
			this._index++;
			return this._result;
		}
		return null;
	}
	if (this._index >= this._result.childNodes.length) {
		return null;
	}
	return this._result.childNodes[this._index++];
};
Fleur.XPathResult.prototype.serialize = function() {
	var ser = new Fleur.Serializer();
	return ser.serializeToString(this._result, this.mediatype, this.indent);
};
Fleur.XPathResult.prototype.toXQuery = function(indent) {
	if (this._result === Fleur.EmptySequence) {
		return "()";
	}
	return Fleur.Serializer._serializeNodeToXQuery(this._result, indent, "");
};
Fleur.XPathResult.prototype.toArray = function() {
	if (this._result === Fleur.EmptySequence) {
		return [];
	}
	if (this._result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
		return [this._result];
	}
	return this._result.childNodes;
};
Fleur.XPathResult.prototype.promise = function() {
	var xpr = this;
	return new Promise(function(resolve, reject) {
		xpr.evaluate(resolve, reject);
	});
};
Fleur.varMgr = function(vars, previous) {
	this.vars = vars || [];
	this.previous = previous;
	this.globals = 0;
};
Fleur.varMgr.prototype.clone = function() {
	var vars = [];
	this.vars.forEach(function(v) {
		vars.push({
			vuri: v.vuri,
			vname: v.vname,
			value: v.value
		});
	});
	return new Fleur.varMgr(vars, this.previous);
};
Fleur.varMgr.prototype.get = function(ctx, vuri, vname) {
	var i;
	var r = this;
	do {
		i = r.vars.length;
		while (i) {
			i--;
			if (r.vars[i].vuri === vuri && r.vars[i].vname === vname) {
				return r.vars[i].value;
			}
		}
		r = r.previous;
	} while (r);
	return Fleur.error(ctx, "XPST0008", "$" + (vuri && vuri !== '' ? "Q{" + vuri + "}" + vname : vname) + " is undefined");
};
Fleur.varMgr.prototype.set = function(ctx, vuri, vname, value) {
	var i;
	var r = this;
	do {
		i = r.vars.length;
		while (i) {
			i--;
			if (r.vars[i].vuri === vuri && r.vars[i].vname === vname) {
				r.vars[i].value = value;
				return value;
			}
		}
		r = r.previous;
	} while (r);
	this.vars.push({vuri: vuri, vname: vname, value: value});
	return value;
};
Fleur.encchars = {
	"quot": "\x22",
	"amp": "\x26",
	"apos": "\x27",
	"lt": "\x3c",
	"gt": "\x3e",
	"nbsp": "\xa0",
	"iexcl": "\xa1",
	"cent": "\xa2",
	"pound": "\xa3",
	"curren": "\xa4",
	"yen": "\xa5",
	"brvbar": "\xa6",
	"sect": "\xa7",
	"uml": "\xa8",
	"copy": "\xa9",
	"ordf": "\xaa",
	"laquo": "\xab",
	"not": "\xac",
	"shy": "\xad",
	"reg": "\xae",
	"macr": "\xaf",
	"deg": "\xb0",
	"plusmn": "\xb1",
	"sup2": "\xb2",
	"sup3": "\xb3",
	"acute": "\xb4",
	"micro": "\xb5",
	"para": "\xb6",
	"middot": "\xb7",
	"cedil": "\xb8",
	"sup1": "\xb9",
	"ordm": "\xba",
	"raquo": "\xbb",
	"frac14": "\xbc",
	"frac12": "\xbd",
	"frac34": "\xbe",
	"iquest": "\xbf",
	"Agrave": "\xc0",
	"Aacute": "\xc1",
	"Acirc": "\xc2",
	"Atilde": "\xc3",
	"Auml": "\xc4",
	"Aring": "\xc5",
	"AElig": "\xc6",
	"Ccedil": "\xc7",
	"Egrave": "\xc8",
	"Eacute": "\xc9",
	"Ecirc": "\xca",
	"Euml": "\xcb",
	"Igrave": "\xcc",
	"Iacute": "\xcd",
	"Icirc": "\xce",
	"Iuml": "\xcf",
	"ETH": "\xd0",
	"Ntilde": "\xd1",
	"Ograve": "\xd2",
	"Oacute": "\xd3",
	"Ocirc": "\xd4",
	"Otilde": "\xd5",
	"Ouml": "\xd6",
	"times": "\xd7",
	"Oslash": "\xd8",
	"Ugrave": "\xd9",
	"Uacute": "\xda",
	"Ucirc": "\xdb",
	"Uuml": "\xdc",
	"Yacute": "\xdd",
	"THORN": "\xde",
	"szlig": "\xdf",
	"agrave": "\xe0",
	"aacute": "\xe1",
	"acirc": "\xe2",
	"atilde": "\xe3",
	"auml": "\xe4",
	"aring": "\xe5",
	"aelig": "\xe6",
	"ccedil": "\xe7",
	"egrave": "\xe8",
	"eacute": "\xe9",
	"ecirc": "\xea",
	"euml": "\xeb",
	"igrave": "\xec",
	"iacute": "\xed",
	"icirc": "\xee",
	"iuml": "\xef",
	"eth": "\xf0",
	"ntilde": "\xf1",
	"ograve": "\xf2",
	"oacute": "\xf3",
	"ocirc": "\xf4",
	"otilde": "\xf5",
	"ouml": "\xf6",
	"divide": "\xf7",
	"oslash": "\xf8",
	"ugrave": "\xf9",
	"uacute": "\xfa",
	"ucirc": "\xfb",
	"uuml": "\xfc",
	"yacute": "\xfd",
	"thorn": "\xfe",
	"yuml": "\xff",
	"OElig": "\u0152",
	"oelig": "\u0153",
	"Scaron": "\u0160",
	"scaron": "\u0161",
	"Yuml": "\u0178",
	"fnof": "\u0192",
	"circ": "\u02c6",
	"tilde": "\u02dc",
	"Alpha": "\u0391",
	"Beta": "\u0392",
	"Gamma": "\u0393",
	"Delta": "\u0394",
	"Epsilon": "\u0395",
	"Zeta": "\u0396",
	"Eta": "\u0397",
	"Theta": "\u0398",
	"Iota": "\u0399",
	"Kappa": "\u039a",
	"Lambda": "\u039b",
	"Mu": "\u039c",
	"Nu": "\u039d",
	"Xi": "\u039e",
	"Omicron": "\u039f",
	"Pi": "\u03a0",
	"Rho": "\u03a1",
	"Sigma": "\u03a3",
	"Tau": "\u03a4",
	"Upsilon": "\u03a5",
	"Phi": "\u03a6",
	"Chi": "\u03a7",
	"Psi": "\u03a8",
	"Omega": "\u03a9",
	"alpha": "\u03b1",
	"beta": "\u03b2",
	"gamma": "\u03b3",
	"delta": "\u03b4",
	"epsilon": "\u03b5",
	"zeta": "\u03b6",
	"eta": "\u03b7",
	"theta": "\u03b8",
	"iota": "\u03b9",
	"kappa": "\u03ba",
	"lambda": "\u03bb",
	"mu": "\u03bc",
	"nu": "\u03bd",
	"xi": "\u03be",
	"omicron": "\u03bf",
	"pi": "\u03c0",
	"rho": "\u03c1",
	"sigmaf": "\u03c2",
	"sigma": "\u03c3",
	"tau": "\u03c4",
	"upsilon": "\u03c5",
	"phi": "\u03c6",
	"chi": "\u03c7",
	"psi": "\u03c8",
	"omega": "\u03c9",
	"thetasym": "\u03d1",
	"upsih": "\u03d2",
	"piv": "\u03d6",
	"ensp": "\u2002",
	"emsp": "\u2003",
	"thinsp": "\u2009",
	"zwnj": "\u200c",
	"zwj": "\u200d",
	"lrm": "\u200e",
	"rlm": "\u200f",
	"ndash": "\u2013",
	"mdash": "\u2014",
	"lsquo": "\u2018",
	"rsquo": "\u2019",
	"sbquo": "\u201a",
	"ldquo": "\u201c",
	"rdquo": "\u201d",
	"bdquo": "\u201e",
	"dagger": "\u2020",
	"Dagger": "\u2021",
	"bull": "\u2022",
	"hellip": "\u2026",
	"permil": "\u2030",
	"prime": "\u2032",
	"Prime": "\u2033",
	"lsaquo": "\u2039",
	"rsaquo": "\u203a",
	"oline": "\u203e",
	"frasl": "\u2044",
	"euro": "\u20ac",
	"image": "\u2111",
	"weierp": "\u2118",
	"real": "\u211c",
	"trade": "\u2122",
	"alefsym": "\u2135",
	"larr": "\u2190",
	"uarr": "\u2191",
	"rarr": "\u2192",
	"darr": "\u2193",
	"harr": "\u2194",
	"crarr": "\u21b5",
	"lArr": "\u21d0",
	"uArr": "\u21d1",
	"rArr": "\u21d2",
	"dArr": "\u21d3",
	"hArr": "\u21d4",
	"forall": "\u2200",
	"part": "\u2202",
	"exist": "\u2203",
	"empty": "\u2205",
	"nabla": "\u2207",
	"isin": "\u2208",
	"notin": "\u2209",
	"ni": "\u220b",
	"prod": "\u220f",
	"sum": "\u2211",
	"minus": "\u2212",
	"lowast": "\u2217",
	"radic": "\u221a",
	"prop": "\u221d",
	"infin": "\u221e",
	"ang": "\u2220",
	"and": "\u2227",
	"or": "\u2228",
	"cap": "\u2229",
	"cup": "\u222a",
	"int": "\u222b",
	"there4": "\u2234",
	"sim": "\u223c",
	"cong": "\u2245",
	"asymp": "\u2248",
	"ne": "\u2260",
	"equiv": "\u2261",
	"le": "\u2264",
	"ge": "\u2265",
	"sub": "\u2282",
	"sup": "\u2283",
	"nsub": "\u2284",
	"sube": "\u2286",
	"supe": "\u2287",
	"oplus": "\u2295",
	"otimes": "\u2297",
	"perp": "\u22a5",
	"sdot": "\u22c5",
	"lceil": "\u2308",
	"rceil": "\u2309",
	"lfloor": "\u230a;",
	"rfloor": "\u230b",
	"lang": "\u2329",
	"rang": "\u232a",
	"loz": "\u25ca",
	"spades": "\u2660",
	"clubs": "\u2663",
	"hearts": "\u2665",
	"diams": "\u2666"
};
Fleur.Xlength = 0;
Fleur.XQueryXNames = [["http://www.w3.org/2005/XQueryX", "http://www.w3.org/2000/xmlns/", "http://www.w3.org/2001/XMLSchema-instance", "http://www.w3.org/2007/xquery-update-10"], []];
Fleur.XQueryX = {};
Fleur.XQueryXNames[1][Fleur.XQueryX.NCName = Fleur.Xlength++] = [1, 0, "xqx:NCName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.QName = Fleur.Xlength++] = [1, 0, "xqx:QName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.URIExpr = Fleur.Xlength++] = [1, 0, "xqx:URIExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.Wildcard = Fleur.Xlength++] = [1, 0, "xqx:Wildcard"];
Fleur.XQueryXNames[1][Fleur.XQueryX.addOp = Fleur.Xlength++] = [1, 0, "xqx:addOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.allowingEmpty = Fleur.Xlength++] = [1, 0, "xqx:allowingEmpty"];
Fleur.XQueryXNames[1][Fleur.XQueryX.andOp = Fleur.Xlength++] = [1, 0, "xqx:andOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.annotation = Fleur.Xlength++] = [1, 0, "xqx:annotation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.annotationName = Fleur.Xlength++] = [1, 0, "xqx:annotationName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyElementTest = Fleur.Xlength++] = [1, 0, "xqx:anyElementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyFunctionTest = Fleur.Xlength++] = [1, 0, "xqx:anyFunctionTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyItemType = Fleur.Xlength++] = [1, 0, "xqx:anyItemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.anyKindTest = Fleur.Xlength++] = [1, 0, "xqx:anyKindTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arrayConstructor = Fleur.Xlength++] = [1, 0, "xqx:arrayConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.argExpr = Fleur.Xlength++] = [1, 0, "xqx:argExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.argumentPlaceholder = Fleur.Xlength++] = [1, 0, "xqx:argumentPlaceholder"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arguments = Fleur.Xlength++] = [1, 0, "xqx:arguments"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arithmeticOp = Fleur.Xlength++] = [1, 0, "xqx:arithmeticOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.arrayTest = Fleur.Xlength++] = [1, 0, "xqx:arrayTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.atomicType = Fleur.Xlength++] = [1, 0, "xqx:atomicType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeConstructor = Fleur.Xlength++] = [1, 0, "xqx:attributeConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeList = Fleur.Xlength++] = [1, 0, "xqx:attributeList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeName = Fleur.Xlength++] = [1, 0, "xqx:attributeName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeTest = Fleur.Xlength++] = [1, 0, "xqx:attributeTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeValue = Fleur.Xlength++] = [1, 0, "xqx:attributeValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.attributeValueExpr = Fleur.Xlength++] = [1, 0, "xqx:attributeValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.baseUriDecl = Fleur.Xlength++] = [1, 0, "xqx:baseUriDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.bindingSequence = Fleur.Xlength++] = [1, 0, "xqx:bindingSequence"];
Fleur.XQueryXNames[1][Fleur.XQueryX.boundarySpaceDecl = Fleur.Xlength++] = [1, 0, "xqx:boundarySpaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.castExpr = Fleur.Xlength++] = [1, 0, "xqx:castExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.castableExpr = Fleur.Xlength++] = [1, 0, "xqx:castableExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchClause = Fleur.Xlength++] = [1, 0, "xqx:catchClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchErrorList = Fleur.Xlength++] = [1, 0, "xqx:catchErrorList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.catchExpr = Fleur.Xlength++] = [1, 0, "xqx:catchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.collation = Fleur.Xlength++] = [1, 0, "xqx:collation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.commentTest = Fleur.Xlength++] = [1, 0, "xqx:commentTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.comparisonOp = Fleur.Xlength++] = [1, 0, "xqx:comparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedAttributeConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedAttributeConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedCommentConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedCommentConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedDocumentConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedDocumentConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedElementConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedElementConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedEntryConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedEntryConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedNamespaceConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedNamespaceConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedPIConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedPIConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.computedTextConstructor = Fleur.Xlength++] = [1, 0, "xqx:computedTextConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constantExpr = Fleur.Xlength++] = [1, 0, "xqx:constantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constructionDecl = Fleur.Xlength++] = [1, 0, "xqx:constructionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.constructorFunctionExpr = Fleur.Xlength++] = [1, 0, "xqx:constructorFunctionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contentExpr = Fleur.Xlength++] = [1, 0, "xqx:contentExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contextItemDecl = Fleur.Xlength++] = [1, 0, "xqx:contextItemDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.contextItemExpr = Fleur.Xlength++] = [1, 0, "xqx:contextItemExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copyNamespacesDecl = Fleur.Xlength++] = [1, 0, "xqx:copyNamespacesDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.countClause = Fleur.Xlength++] = [1, 0, "xqx:countClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.currentItem = Fleur.Xlength++] = [1, 0, "xqx:currentItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:decimalConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatDecl = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatName = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParam = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParam"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParamName = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParamName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.decimalFormatParamValue = Fleur.Xlength++] = [1, 0, "xqx:decimalFormatParamValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultCollationDecl = Fleur.Xlength++] = [1, 0, "xqx:defaultCollationDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultElementNamespace = Fleur.Xlength++] = [1, 0, "xqx:defaultElementNamespace"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultNamespaceCategory = Fleur.Xlength++] = [1, 0, "xqx:defaultNamespaceCategory"];
Fleur.XQueryXNames[1][Fleur.XQueryX.defaultNamespaceDecl = Fleur.Xlength++] = [1, 0, "xqx:defaultNamespaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.divOp = Fleur.Xlength++] = [1, 0, "xqx:divOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.documentTest = Fleur.Xlength++] = [1, 0, "xqx:documentTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.doubleConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:doubleConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.doubleMapExpr = Fleur.Xlength++] = [1, 0, "xqx:doubleMapExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.dynamicFunctionInvocationExpr = Fleur.Xlength++] = [1, 0, "xqx:dynamicFunctionInvocationExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementConstructor = Fleur.Xlength++] = [1, 0, "xqx:elementConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementContent = Fleur.Xlength++] = [1, 0, "xqx:elementContent"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementName = Fleur.Xlength++] = [1, 0, "xqx:elementName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elementTest = Fleur.Xlength++] = [1, 0, "xqx:elementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.elseClause = Fleur.Xlength++] = [1, 0, "xqx:elseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.emptyOrderingDecl = Fleur.Xlength++] = [1, 0, "xqx:emptyOrderingDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.emptyOrderingMode = Fleur.Xlength++] = [1, 0, "xqx:emptyOrderingMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.encoding = Fleur.Xlength++] = [1, 0, "xqx:encoding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.endExpr = Fleur.Xlength++] = [1, 0, "xqx:endExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.entryTest = Fleur.Xlength++] = [1, 0, "xqx:entryTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.eqOp = Fleur.Xlength++] = [1, 0, "xqx:eqOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.equalOp = Fleur.Xlength++] = [1, 0, "xqx:equalOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.exceptOp = Fleur.Xlength++] = [1, 0, "xqx:exceptOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.expr = Fleur.Xlength++] = [1, 0, "xqx:expr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.extensionExpr = Fleur.Xlength++] = [1, 0, "xqx:extensionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.external = Fleur.Xlength++] = [1, 0, "xqx:external"];
Fleur.XQueryXNames[1][Fleur.XQueryX.externalDefinition = Fleur.Xlength++] = [1, 0, "xqx:externalDefinition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.filterExpr = Fleur.Xlength++] = [1, 0, "xqx:filterExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.firstOperand = Fleur.Xlength++] = [1, 0, "xqx:firstOperand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.flworExpr = Fleur.Xlength++] = [1, 0, "xqx:flworExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forClause = Fleur.Xlength++] = [1, 0, "xqx:forClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forClauseItem = Fleur.Xlength++] = [1, 0, "xqx:forClauseItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forExpr = Fleur.Xlength++] = [1, 0, "xqx:forExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.forLetClauseItemExtensions = Fleur.Xlength++] = [1, 0, "xqx:forLetClauseItemExtensions"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionBody = Fleur.Xlength++] = [1, 0, "xqx:functionBody"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionCallExpr = Fleur.Xlength++] = [1, 0, "xqx:functionCallExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionDecl = Fleur.Xlength++] = [1, 0, "xqx:functionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionItem = Fleur.Xlength++] = [1, 0, "xqx:functionItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.functionName = Fleur.Xlength++] = [1, 0, "xqx:functionName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.geOp = Fleur.Xlength++] = [1, 0, "xqx:geOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.generalComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:generalComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.greaterThanOp = Fleur.Xlength++] = [1, 0, "xqx:greaterThanOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.greaterThanOrEqualOp = Fleur.Xlength++] = [1, 0, "xqx:greaterThanOrEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupByClause = Fleur.Xlength++] = [1, 0, "xqx:groupByClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupVarInitialize = Fleur.Xlength++] = [1, 0, "xqx:groupVarInitialize"];
Fleur.XQueryXNames[1][Fleur.XQueryX.groupingSpec = Fleur.Xlength++] = [1, 0, "xqx:groupingSpec"];
Fleur.XQueryXNames[1][Fleur.XQueryX.gtOp = Fleur.Xlength++] = [1, 0, "xqx:gtOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.idivOp = Fleur.Xlength++] = [1, 0, "xqx:idivOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ifClause = Fleur.Xlength++] = [1, 0, "xqx:ifClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ifThenElseExpr = Fleur.Xlength++] = [1, 0, "xqx:ifThenElseExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.inheritMode = Fleur.Xlength++] = [1, 0, "xqx:inheritMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.inlineFunctionExpr = Fleur.Xlength++] = [1, 0, "xqx:inlineFunctionExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.instanceOfExpr = Fleur.Xlength++] = [1, 0, "xqx:instanceOfExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.integerConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:integerConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.intersectOp = Fleur.Xlength++] = [1, 0, "xqx:intersectOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.isOp = Fleur.Xlength++] = [1, 0, "xqx:isOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.itemType = Fleur.Xlength++] = [1, 0, "xqx:itemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.javascriptImport = Fleur.Xlength++] = [1, 0, "xqx:javascriptImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.kindTest = Fleur.Xlength++] = [1, 0, "xqx:kindTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.leOp = Fleur.Xlength++] = [1, 0, "xqx:leOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lessThanOrEqualOp = Fleur.Xlength++] = [1, 0, "xqx:lessThanOrEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClause = Fleur.Xlength++] = [1, 0, "xqx:letClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letClauseItem = Fleur.Xlength++] = [1, 0, "xqx:letClauseItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.letExpr = Fleur.Xlength++] = [1, 0, "xqx:letExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.libraryModule = Fleur.Xlength++] = [1, 0, "xqx:libraryModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.logicalOp = Fleur.Xlength++] = [1, 0, "xqx:logicalOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.lookup = Fleur.Xlength++] = [1, 0, "xqx:lookup"];
Fleur.XQueryXNames[1][Fleur.XQueryX.ltOp = Fleur.Xlength++] = [1, 0, "xqx:ltOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mainModule = Fleur.Xlength++] = [1, 0, "xqx:mainModule"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapConstructor = Fleur.Xlength++] = [1, 0, "xqx:mapConstructor"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapConstructorEntry = Fleur.Xlength++] = [1, 0, "xqx:mapConstructorEntry"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapKeyExpr = Fleur.Xlength++] = [1, 0, "xqx:mapKeyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapTest = Fleur.Xlength++] = [1, 0, "xqx:mapTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.mapValueExpr = Fleur.Xlength++] = [1, 0, "xqx:mapValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.modOp = Fleur.Xlength++] = [1, 0, "xqx:modOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.module = Fleur.Xlength++] = [1, 0, "xqx:module"];
Fleur.XQueryXNames[1][Fleur.XQueryX.moduleDecl = Fleur.Xlength++] = [1, 0, "xqx:moduleDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.moduleImport = Fleur.Xlength++] = [1, 0, "xqx:moduleImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.multidimExpr = Fleur.Xlength++] = [1, 0, "xqx:multidimExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.multiplyOp = Fleur.Xlength++] = [1, 0, "xqx:multiplyOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.name = Fleur.Xlength++] = [1, 0, "xqx:name"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nameTest = Fleur.Xlength++] = [1, 0, "xqx:nameTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namedFunctionRef = Fleur.Xlength++] = [1, 0, "xqx:namedFunctionRef"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceDecl = Fleur.Xlength++] = [1, 0, "xqx:namespaceDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceDeclaration = Fleur.Xlength++] = [1, 0, "xqx:namespaceDeclaration"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespacePrefix = Fleur.Xlength++] = [1, 0, "xqx:namespacePrefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX.namespaceTest = Fleur.Xlength++] = [1, 0, "xqx:namespaceTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.neOp = Fleur.Xlength++] = [1, 0, "xqx:neOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nextItem = Fleur.Xlength++] = [1, 0, "xqx:nextItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nillable = Fleur.Xlength++] = [1, 0, "xqx:nillable"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeAfterOp = Fleur.Xlength++] = [1, 0, "xqx:nodeAfterOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeBeforeOp = Fleur.Xlength++] = [1, 0, "xqx:nodeBeforeOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nodeComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:nodeComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.notEqualOp = Fleur.Xlength++] = [1, 0, "xqx:notEqualOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.occurrenceIndicator = Fleur.Xlength++] = [1, 0, "xqx:occurrenceIndicator"];
Fleur.XQueryXNames[1][Fleur.XQueryX.operand = Fleur.Xlength++] = [1, 0, "xqx:operand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.operatorExpr = Fleur.Xlength++] = [1, 0, "xqx:operatorExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionContents = Fleur.Xlength++] = [1, 0, "xqx:optionContents"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionDecl = Fleur.Xlength++] = [1, 0, "xqx:optionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optionName = Fleur.Xlength++] = [1, 0, "xqx:optionName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.optional = Fleur.Xlength++] = [1, 0, "xqx:optional"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orOp = Fleur.Xlength++] = [1, 0, "xqx:orOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderByClause = Fleur.Xlength++] = [1, 0, "xqx:orderByClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderByExpr = Fleur.Xlength++] = [1, 0, "xqx:orderByExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderBySpec = Fleur.Xlength++] = [1, 0, "xqx:orderBySpec"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:orderComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderModifier = Fleur.Xlength++] = [1, 0, "xqx:orderModifier"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderedExpr = Fleur.Xlength++] = [1, 0, "xqx:orderedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderingKind = Fleur.Xlength++] = [1, 0, "xqx:orderingKind"];
Fleur.XQueryXNames[1][Fleur.XQueryX.orderingModeDecl = Fleur.Xlength++] = [1, 0, "xqx:orderingModeDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.param = Fleur.Xlength++] = [1, 0, "xqx:param"];
Fleur.XQueryXNames[1][Fleur.XQueryX.paramList = Fleur.Xlength++] = [1, 0, "xqx:paramList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.paramTypeList = Fleur.Xlength++] = [1, 0, "xqx:paramTypeList"];
Fleur.XQueryXNames[1][Fleur.XQueryX.parenthesizedItemType = Fleur.Xlength++] = [1, 0, "xqx:parenthesizedItemType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pathExpr = Fleur.Xlength++] = [1, 0, "xqx:pathExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTarget = Fleur.Xlength++] = [1, 0, "xqx:piTarget"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTargetExpr = Fleur.Xlength++] = [1, 0, "xqx:piTargetExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piTest = Fleur.Xlength++] = [1, 0, "xqx:piTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.piValueExpr = Fleur.Xlength++] = [1, 0, "xqx:piValueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.positionalVariableBinding = Fleur.Xlength++] = [1, 0, "xqx:positionalVariableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragma = Fleur.Xlength++] = [1, 0, "xqx:pragma"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragmaContents = Fleur.Xlength++] = [1, 0, "xqx:pragmaContents"];
Fleur.XQueryXNames[1][Fleur.XQueryX.pragmaName = Fleur.Xlength++] = [1, 0, "xqx:pragmaName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicate = Fleur.Xlength++] = [1, 0, "xqx:predicate"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicateExpr = Fleur.Xlength++] = [1, 0, "xqx:predicateExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.predicates = Fleur.Xlength++] = [1, 0, "xqx:predicates"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefixElt = Fleur.Xlength++] = [1, 0, "xqx:prefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefixExpr = Fleur.Xlength++] = [1, 0, "xqx:prefixExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.preserveMode = Fleur.Xlength++] = [1, 0, "xqx:preserveMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.previousItem = Fleur.Xlength++] = [1, 0, "xqx:previousItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prolog = Fleur.Xlength++] = [1, 0, "xqx:prolog"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prologPartOneItem = Fleur.Xlength++] = [1, 0, "xqx:prologPartOneItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prologPartTwoItem = Fleur.Xlength++] = [1, 0, "xqx:prologPartTwoItem"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifiedExpr = Fleur.Xlength++] = [1, 0, "xqx:quantifiedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifiedExprInClause = Fleur.Xlength++] = [1, 0, "xqx:quantifiedExprInClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.quantifier = Fleur.Xlength++] = [1, 0, "xqx:quantifier"];
Fleur.XQueryXNames[1][Fleur.XQueryX.queryBody = Fleur.Xlength++] = [1, 0, "xqx:queryBody"];
Fleur.XQueryXNames[1][Fleur.XQueryX.rangeSequenceExpr = Fleur.Xlength++] = [1, 0, "xqx:rangeSequenceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.resultExpr = Fleur.Xlength++] = [1, 0, "xqx:resultExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.returnClause = Fleur.Xlength++] = [1, 0, "xqx:returnClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.rootExpr = Fleur.Xlength++] = [1, 0, "xqx:rootExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaAttributeTest = Fleur.Xlength++] = [1, 0, "xqx:schemaAttributeTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaElementTest = Fleur.Xlength++] = [1, 0, "xqx:schemaElementTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaImport = Fleur.Xlength++] = [1, 0, "xqx:schemaImport"];
Fleur.XQueryXNames[1][Fleur.XQueryX.secondOperand = Fleur.Xlength++] = [1, 0, "xqx:secondOperand"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceExpr = Fleur.Xlength++] = [1, 0, "xqx:sequenceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceType = Fleur.Xlength++] = [1, 0, "xqx:sequenceType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequenceTypeUnion = Fleur.Xlength++] = [1, 0, "xqx:sequenceTypeUnion"];
Fleur.XQueryXNames[1][Fleur.XQueryX.setOp = Fleur.Xlength++] = [1, 0, "xqx:setOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.simpleMapExpr = Fleur.Xlength++] = [1, 0, "xqx:simpleMapExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.singleType = Fleur.Xlength++] = [1, 0, "xqx:singleType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.slidingWindowClause = Fleur.Xlength++] = [1, 0, "xqx:slidingWindowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sourceExpr = Fleur.Xlength++] = [1, 0, "xqx:sourceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stable = Fleur.Xlength++] = [1, 0, "xqx:stable"];
Fleur.XQueryXNames[1][Fleur.XQueryX.star = Fleur.Xlength++] = [1, 0, "xqx:star"];
Fleur.XQueryXNames[1][Fleur.XQueryX.startExpr = Fleur.Xlength++] = [1, 0, "xqx:startExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stepExpr = Fleur.Xlength++] = [1, 0, "xqx:stepExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringConcatenateOp = Fleur.Xlength++] = [1, 0, "xqx:stringConcatenateOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringConstantExpr = Fleur.Xlength++] = [1, 0, "xqx:stringConstantExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.stringOp = Fleur.Xlength++] = [1, 0, "xqx:stringOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.subtractOp = Fleur.Xlength++] = [1, 0, "xqx:subtractOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchCaseExpr = Fleur.Xlength++] = [1, 0, "xqx:switchCaseExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExpr = Fleur.Xlength++] = [1, 0, "xqx:switchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExprCaseClause = Fleur.Xlength++] = [1, 0, "xqx:switchExprCaseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.switchExprDefaultClause = Fleur.Xlength++] = [1, 0, "xqx:switchExprDefaultClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tagName = Fleur.Xlength++] = [1, 0, "xqx:tagName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tagNameExpr = Fleur.Xlength++] = [1, 0, "xqx:tagNameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetLocation = Fleur.Xlength++] = [1, 0, "xqx:targetLocation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetLocationExpr = Fleur.Xlength++] = [1, 0, "xqx:targetLocationExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetNamespace = Fleur.Xlength++] = [1, 0, "xqx:targetNamespace"];
Fleur.XQueryXNames[1][Fleur.XQueryX.textTest = Fleur.Xlength++] = [1, 0, "xqx:textTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.thenClause = Fleur.Xlength++] = [1, 0, "xqx:thenClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.treatExpr = Fleur.Xlength++] = [1, 0, "xqx:treatExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tryCatchExpr = Fleur.Xlength++] = [1, 0, "xqx:tryCatchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tryClause = Fleur.Xlength++] = [1, 0, "xqx:tryClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.tumblingWindowClause = Fleur.Xlength++] = [1, 0, "xqx:tumblingWindowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeDeclaration = Fleur.Xlength++] = [1, 0, "xqx:typeDeclaration"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeName = Fleur.Xlength++] = [1, 0, "xqx:typeName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typedFunctionTest = Fleur.Xlength++] = [1, 0, "xqx:typedFunctionTest"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typedVariableBinding = Fleur.Xlength++] = [1, 0, "xqx:typedVariableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExpr = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExprCaseClause = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExprCaseClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.typeswitchExprDefaultClause = Fleur.Xlength++] = [1, 0, "xqx:typeswitchExprDefaultClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unaryMinusOp = Fleur.Xlength++] = [1, 0, "xqx:unaryMinusOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unaryPlusOp = Fleur.Xlength++] = [1, 0, "xqx:unaryPlusOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unionOp = Fleur.Xlength++] = [1, 0, "xqx:unionOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unorderedExpr = Fleur.Xlength++] = [1, 0, "xqx:unorderedExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.unaryLookup = Fleur.Xlength++] = [1, 0, "xqx:unaryLookup"];
Fleur.XQueryXNames[1][Fleur.XQueryX.uri = Fleur.Xlength++] = [1, 0, "xqx:uri"];
Fleur.XQueryXNames[1][Fleur.XQueryX.validateExpr = Fleur.Xlength++] = [1, 0, "xqx:validateExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.validationMode = Fleur.Xlength++] = [1, 0, "xqx:validationMode"];
Fleur.XQueryXNames[1][Fleur.XQueryX.value = Fleur.Xlength++] = [1, 0, "xqx:value"];
Fleur.XQueryXNames[1][Fleur.XQueryX.valueComparisonOp = Fleur.Xlength++] = [1, 0, "xqx:valueComparisonOp"];
Fleur.XQueryXNames[1][Fleur.XQueryX.valueExpr = Fleur.Xlength++] = [1, 0, "xqx:valueExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varDecl = Fleur.Xlength++] = [1, 0, "xqx:varDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varName = Fleur.Xlength++] = [1, 0, "xqx:varName"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varRef = Fleur.Xlength++] = [1, 0, "xqx:varRef"];
Fleur.XQueryXNames[1][Fleur.XQueryX.varValue = Fleur.Xlength++] = [1, 0, "xqx:varValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.variableBinding = Fleur.Xlength++] = [1, 0, "xqx:variableBinding"];
Fleur.XQueryXNames[1][Fleur.XQueryX.version = Fleur.Xlength++] = [1, 0, "xqx:version"];
Fleur.XQueryXNames[1][Fleur.XQueryX.versionDecl = Fleur.Xlength++] = [1, 0, "xqx:versionDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.voidSequenceType = Fleur.Xlength++] = [1, 0, "xqx:voidSequenceType"];
Fleur.XQueryXNames[1][Fleur.XQueryX.whereClause = Fleur.Xlength++] = [1, 0, "xqx:whereClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.winEndExpr = Fleur.Xlength++] = [1, 0, "xqx:winEndExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.winStartExpr = Fleur.Xlength++] = [1, 0, "xqx:winStartExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowClause = Fleur.Xlength++] = [1, 0, "xqx:windowClause"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowEndCondition = Fleur.Xlength++] = [1, 0, "xqx:windowEndCondition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowStartCondition = Fleur.Xlength++] = [1, 0, "xqx:windowStartCondition"];
Fleur.XQueryXNames[1][Fleur.XQueryX.windowVars = Fleur.Xlength++] = [1, 0, "xqx:windowVars"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xpathAxis = Fleur.Xlength++] = [1, 0, "xqx:xpathAxis"];
Fleur.XQueryXNames[1][Fleur.XQueryX.URI = Fleur.Xlength++] = [2, 0, "xqx:URI"];
Fleur.XQueryXNames[1][Fleur.XQueryX["default"] = Fleur.Xlength++] = [2, 0, "xqx:default"];
Fleur.XQueryXNames[1][Fleur.XQueryX.nondeterministic = Fleur.Xlength++] = [2, 0, "xqx:nondeterministic"];
Fleur.XQueryXNames[1][Fleur.XQueryX.onlyEnd = Fleur.Xlength++] = [2, 0, "xqx:onlyEnd"];
Fleur.XQueryXNames[1][Fleur.XQueryX.prefix = Fleur.Xlength++] = [2, 0, "xqx:prefix"];
Fleur.XQueryXNames[1][Fleur.XQueryX["private"] = Fleur.Xlength++] = [2, 0, "xqx:private"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sequentialFunction = Fleur.Xlength++] = [2, 0, "xqx:sequentialFunction"];
Fleur.XQueryXNames[1][Fleur.XQueryX.updatingFunction = Fleur.Xlength++] = [2, 0, "xqx:updatingFunction"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xqx = Fleur.Xlength++] = [2, 1, "xmlns:xqx"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xsi = Fleur.Xlength++] = [2, 1, "xmlns:xsi"];
Fleur.XQueryXNames[1][Fleur.XQueryX.schemaLocation = Fleur.Xlength++] = [2, 2, "xsi:schemaLocation"];
Fleur.XQueryXNames[1][Fleur.XQueryX.xqxuf = Fleur.Xlength++] = [2, 1, "xmlns:xqxuf"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copyModifyExpr = Fleur.Xlength++] = [1, 3, "xqxuf:copyModifyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.copySource = Fleur.Xlength++] = [1, 3, "xqxuf:copySource"];
Fleur.XQueryXNames[1][Fleur.XQueryX.deleteExpr = Fleur.Xlength++] = [1, 3, "xqxuf:deleteExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAfter = Fleur.Xlength++] = [1, 3, "xqxuf:insertAfter"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAsFirst = Fleur.Xlength++] = [1, 3, "xqxuf:insertAsFirst"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertAsLast = Fleur.Xlength++] = [1, 3, "xqxuf:insertAsLast"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertBefore = Fleur.Xlength++] = [1, 3, "xqxuf:insertBefore"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertExpr = Fleur.Xlength++] = [1, 3, "xqxuf:insertExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.insertInto = Fleur.Xlength++] = [1, 3, "xqxuf:insertInto"];
Fleur.XQueryXNames[1][Fleur.XQueryX.modifyExpr = Fleur.Xlength++] = [1, 3, "xqxuf:modifyExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.newNameExpr = Fleur.Xlength++] = [1, 3, "xqxuf:newNameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.renameExpr = Fleur.Xlength++] = [1, 3, "xqxuf:renameExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replaceExpr = Fleur.Xlength++] = [1, 3, "xqxuf:replaceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replaceValue = Fleur.Xlength++] = [1, 3, "xqxuf:replaceValue"];
Fleur.XQueryXNames[1][Fleur.XQueryX.replacementExpr = Fleur.Xlength++] = [1, 3, "xqxuf:replacementExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.returnExpr = Fleur.Xlength++] = [1, 3, "xqxuf:returnExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.revalidationDecl = Fleur.Xlength++] = [1, 3, "xqxuf:revalidationDecl"];
Fleur.XQueryXNames[1][Fleur.XQueryX.sourceExprUf = Fleur.Xlength++] = [1, 3, "xqxuf:sourceExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.targetExpr = Fleur.Xlength++] = [1, 3, "xqxuf:targetExpr"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformCopies = Fleur.Xlength++] = [1, 3, "xqxuf:transformCopies"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformCopy = Fleur.Xlength++] = [1, 3, "xqxuf:transformCopy"];
Fleur.XQueryXNames[1][Fleur.XQueryX.transformExpr = Fleur.Xlength++] = [1, 3, "xqxuf:transformExpr"];
Fleur.XQueryEngine = [];
Fleur.XQueryEngine[Fleur.XQueryX.anyKindTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.arrayTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ARRAY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.arrayConstructor] = function(ctx, children, callback) {
	var arr = new Fleur.Array();
	var i = 0;
	var cb = function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n !== Fleur.EmptySequence) {
			arr.appendChild(n);
		}
		i++;
		if (i === children.length) {
			Fleur.callback(function() {callback(arr);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
	};
	if (children.length !== 0) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	} else {
		Fleur.callback(function() {callback(arr);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.atomicType] = function(ctx, children, callback) {
	if (!ctx._curr.schemaTypeInfo) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	var localname = children[0];
	var prefix = children[1][1][0];
	var namespace = ctx.env.nsresolver.lookupNamespaceURI(prefix);
	if ((localname === ctx._curr.schemaTypeInfo.typeName && namespace === ctx._curr.schemaTypeInfo.typeNamespace) ||
		ctx._curr.schemaTypeInfo.isDerivedFrom(namespace, localname, Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		Fleur.callback(function() {callback(ctx._curr);});
		return;
	}
	Fleur.callback(function() {callback(Fleur.EmptySequence);});
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeConstructor] = function(ctx, children, callback, elt) {
	var attr = new Fleur.Attr();
	var t;
	attr.nodeName = children[0][1][0];
	attr.localName = children[0][1][0];
	if (children[0][1].length === 2) {
		attr.prefix = children[0][1][1][1][0];
	} else {
		attr.prefix = null;
	}
	attr.namespaceURI = elt.lookupNamespaceURI(attr.prefix) || ctx.env.nsresolver.lookupNamespaceURI(attr.prefix);
	if (children[1][0] === Fleur.XQueryX.attributeValue) {
		if (children[1][1].length !== 0) {
			t = new Fleur.Text();
			t.data = children[1][1][0];
			attr.appendChild(t);
		}
		Fleur.callback(function() {callback(attr);});
	} else {
		t = new Fleur.Text();
		t.data = "";
		attr.appendChild(t);
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			Fleur.callback(function() {callback(n);});
		}, attr);
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeList] = function(ctx, children, callback, elt) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(elt);});
		} else if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			elt.setAttributeNode(n);
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.attributeList](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(elt);});
			}
		} else {
			Fleur.callback(function() {callback(n);});
		}
	}, elt);
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE || ctx._curr.nodeName === "xmlns" || ctx._curr.prefix === "xmlns" ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr] = function(ctx, children, callback, attr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a !== Fleur.EmptySequence && a.nodeType !== Fleur.Node.TEXT_NODE) {
			Fleur.callback(function() {callback(a);});
		} else {
			if (a !== Fleur.EmptySequence) {
				attr.firstChild.data += a.data;
			}
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.attributeValueExpr](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, attr);
			} else {
				Fleur.callback(function() {callback(attr);});
			}
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.castExpr] = function(ctx, children, callback) {
	var typename = children[1][1][0][1][0];
	var typeprefix = children[1][1][0][1][1][1][0];
	var typeuri = ctx.env.nsresolver.lookupNamespaceURI(typeprefix);
	var optional = children[1][1].length === 2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var err = Fleur.error(ctx, "FORG0001");
		var a;
		if (n === Fleur.EmptySequence) {
			if (optional) {
				a = new Fleur.Text();
				a.data = "true";
				a.schemaTypeInfo = Fleur.Type_boolean;
			} else {
				a = err;
			}
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a = err;
		} else {
			a = Fleur.Atomize(n);
			try {
				a.data = Fleur.Types[typeuri][typename].canonicalize(a.data);
				a.schemaTypeInfo = Fleur.Types[typeuri][typename];
			} catch(e) {
				a = err;
			}
		}
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.castableExpr] = function(ctx, children, callback) {
	var typename = children[1][1][0][1][0];
	var typeprefix = children[1][1][0][1][1][1][0];
	var typeuri = ctx.env.nsresolver.lookupNamespaceURI(typeprefix);
	var optional = children[1][1].length === 2;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a;
		if (n === Fleur.EmptySequence) {
			a = new Fleur.Text();
			a.data = String(optional);
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			a = new Fleur.Text();
			a.data = "false";
		} else {
			a = Fleur.Atomize(n);
			try {
				Fleur.Types[typeuri][typename].canonicalize(a.data);
				a.data = "true";
			} catch(e) {
				a.data = "false";
			}
		}
		a.schemaTypeInfo = Fleur.Type_boolean;
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.commentTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.COMMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedAttributeConstructor] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		attr.name = children[0][1][0];
		attr.namespaceURI = null;
		attr.nodeName = children[0][1][0];
		attr.localName = children[0][1][0];
		if (children[1][1].length === 0) {
			Fleur.callback(function() {callback(attr);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			attr.appendChild(n);
			Fleur.callback(function() {callback(attr);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				attr.name = a.data;
				attr.nodeName = a.data;
				attr.namespaceURI = null;
				attr.localName = a.data;
				if (children[1][1].length === 0) {
					Fleur.callback(function() {callback(attr);});
					return;
				}
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					attr.appendChild(n);
					Fleur.callback(function() {callback(attr);});
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedCommentConstructor] = function(ctx, children, callback) {
	var cmt = new Fleur.Comment();
	cmt.data = "";
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		cmt.data = n.data;
		Fleur.callback(function() {callback(cmt);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedDocumentConstructor] = function(ctx, children, callback) {
	var doc = new Fleur.Document();
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			n.childNodes.forEach(function(c) {
				doc.appendChild(c);
			});
		} else {
			doc.appendChild(n);
		}
		Fleur.callback(function() {callback(doc);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.computedElementConstructor] = function(ctx, children, callback) {
	var elt = new Fleur.Element();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		elt.name = children[0][1][0];
		elt.namespaceURI = null;
		elt.nodeName = children[0][1][0];
		if (children[1][1].length !== 0) {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				elt.appendChild(n);
				Fleur.callback(function() {callback(elt);});
			});
		} else {
			Fleur.callback(function() {callback(elt);});
		}	
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				if (a.schemaTypeInfo === Fleur.Type_QName) {
					elt.nodeName = a.nodeName;
					elt.namespaceURI = a.namespaceURI;
					elt.localName = a.localName;
				} else {
					elt.nodeName = a.data;
					elt.namespaceURI = null;
					elt.localName = a.data;
				}
				if (children[1][1].length !== 0) {
					Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
						elt.appendChild(n);
						Fleur.callback(function() {callback(elt);});
					});
				} else {
					Fleur.callback(function() {callback(elt);});
				}	
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedEntryConstructor] = function(ctx, children, callback) {
	var entry = new Fleur.Entry();
	if (children[0][0] === Fleur.XQueryX.tagName) {
		entry.name = children[0][1][0];
		entry.namespaceURI = null;
		entry.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			entry.appendChild(n);
			Fleur.callback(function() {callback(entry);});
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				entry.nodeName = a.data;
				entry.namespaceURI = null;
				entry.localName = a.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					entry.appendChild(n.copyNode());
					Fleur.callback(function() {callback(entry);});
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedPIConstructor] = function(ctx, children, callback) {
	var aval, prins = new Fleur.ProcessingInstruction();
	if (children[0][0] === Fleur.XQueryX.piTarget) {
		prins.nodeName = children[0][1][0];
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			aval = Fleur.Atomize(n);
			if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aval);});
			} else {
				prins.data = aval.data;
				Fleur.callback(function() {callback(prins);});
			}
		});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var aname = Fleur.Atomize(n);
			if (aname.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(aname);});
			} else {
				prins.nodeName = aname.data;
				Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
					aval = Fleur.Atomize(n);
					if (aval.nodeType !== Fleur.Node.TEXT_NODE) {
						Fleur.callback(function() {callback(aval);});
					} else {
						prins.data = aval.data;
						Fleur.callback(function() {callback(prins);});
					}
				});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.computedTextConstructor] = function(ctx, children, callback) {
	var txt = new Fleur.Text();
	txt.data = "";
	txt.schemaTypeInfo = Fleur.Type_string;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		txt.data = a.data;
		txt.schemaTypeInfo = n.schemaTypeInfo;
		Fleur.callback(function() {callback(txt);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.contextItemExpr] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.countClause] = function(ctx, children, callback, resarr) {
	var countname = children[0][1][0][1][0];
	resarr.forEach(function addcount(vmgr, i) {
		var countvalue = new Fleur.Text();
		countvalue.data = String(i + 1);
		countvalue.schemaTypeInfo = Fleur.Type_integer;
		vmgr.set(ctx, "", countname, countvalue);
	});
	Fleur.callback(function() {callback(Fleur.EmptySequence);});
};
Fleur.XQueryEngine[Fleur.XQueryX.decimalConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_decimal.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_decimal;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceCategory] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.defaultNamespaceDecl] = function(ctx, children, callback) {
	ctx.env.nsresolver.declareNamespace(" " + children[0][1][0], children[1][1][0]);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.deleteExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var i, l;
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				for (i = 0, l = n.childNodes.length; i < l; i++) {
					if (n.childNodes[i].parentElement) {
						if (n.childNodes[i].nodeType === Fleur.Node.ATTRIBUTE_NODE) {
							n.childNodes[i].parentElement.removeAttributeNode(n.childNodes[i]);
						} else {
							n.childNodes[i].parentElement.removeChild(n.childNodes[i]);
						}
					}
				}
			} else if (n.parentElement) {
				if (n.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
					n.parentElement.removeAttributeNode(n);
				} else {
					n.parentElement.removeChild(n);
				}
			}
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.documentTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.DOCUMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.doubleConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_double.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_double;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.doubleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var seq, md, subcurr, next, last, pos = 1, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
			next = new Fleur.Sequence();
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				next.appendChild(n.childNodes[i]);
			}
			next.rowlabels = n.rowlabels;
			next.collabels = n.collabels;
			last = next.childNodes.length;
			subcurr = next.childNodes.shift();
			seq = new Fleur.Sequence();
			seq.childNodes = subcurr.childNodes;
			subcurr = seq;
			subcurr.collabels = next.collabels;
			if (next.childNodes.length === 0) {
				next = Fleur.EmptySequence;
			}
		} else {
			subcurr = n;
			next = Fleur.EmptySequence;
			last = 1;
		}
		var cb = function(n) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						seq = new Fleur.Sequence();
						md = new Fleur.Multidim();
						seq.appendChild(md);
						md.appendChild(result);
						result = seq;
					} else if (result.childNodes[0].nodeType !== Fleur.Node.MULTIDIM_NODE) {
						seq = new Fleur.Sequence();
						md = new Fleur.Multidim();
						seq.appendChild(md);
						result.childNodes.forEach(function(node) {
							md.appendChild(node);
						});
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE || n.childNodes[0].nodeType !== Fleur.Node.MULTIDIM_NODE) {
						md = new Fleur.Multidim();
						result.appendChild(md);
						if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							md.appendChild(n);
						} else {
							n.childNodes.forEach(function(node) {
								md.appendChild(node);
							});
						}
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.doubleMapExpr);});
				return;
			}
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				subcurr = next.childNodes.shift();
				if (subcurr.nodeType === Fleur.Node.MULTIDIM_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = subcurr.childNodes;
					subcurr = seq;
					subcurr.collabels = next.collabels;
					if (next.childNodes.length === 0) {
						next = Fleur.EmptySequence;
					}
				} else {
					subcurr.collabels = next.collabels;
					if (next.childNodes.length === 1) {
						next = next.childNodes[0];
					}
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
			}
			pos++;
			Fleur.XQueryEngine[children[1][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			env: ctx.env
		}, children[1][1], cb);
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.dynamicFunctionInvocationExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n && n.nodeType === Fleur.Node.ENTRY_NODE) {
			n = n.firstChild;
		}
		var args = children[children.length - 1][0] === Fleur.XQueryX.arguments ? children[children.length - 1][1] : [];
		var preds = [];
		children.forEach(function(child) {
			if (child[0] === Fleur.XQueryX.predicates) {
				child[1].forEach(function(subchild) {preds.push(subchild);});
			} else if (child[0] === Fleur.XQueryX.predicate) {
				preds.push(child[1][0]);
			} else if (child[0] === Fleur.XQueryX.lookup) {
				preds.push(child);
			}
		});
		if (preds.length === 0) {
			if (!n || n.nodeType !== Fleur.Node.FUNCTION_NODE) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			Fleur.functionCall(ctx, children, n, args, callback);
		} else {
			var next;
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				next = new Fleur.Sequence();
				next.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(node) {
					next.appendChild(node);
				});
			} else {
				next = n;
			}
			Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
				_next: next,
				_item: ctx._item,
				env: ctx.env
			}, preds, function(n) {
				if (n && n.nodeType === Fleur.Node.ENTRY_NODE) {
					n = n.firstChild;
				}
				if (!n || n.nodeType !== Fleur.Node.FUNCTION_NODE) {
					Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
					return;
				}
				Fleur.functionCall(ctx, children, n, args, callback);
			});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.elementConstructor] = function(ctx, children, callback) {
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
	if (children.length > 1) {
		Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], function(n) {
			elt.namespaceURI = elt.lookupNamespaceURI(elt.prefix) || ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
			if (children.length > 2) {
				var nsr = ctx.env.nsresolver;
				ctx.env.nsresolver = new Fleur.XPathNSResolver(elt);
				Fleur.XQueryEngine[children[2][0]](ctx, children[2][1], function(n) {
					ctx.env.nsresolver = nsr;
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(n);});
			}
		}, elt);
	} else {
		elt.namespaceURI = ctx.env.nsresolver.lookupNamespaceURI(elt.prefix);
		Fleur.callback(function() {callback(elt);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.elementContent] = function(ctx, children, callback, elt) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
		} else {
			if (!n.namespaceURI) {
				n.namespaceURI = ctx.env.nsresolver.lookupNamespaceURI(n.prefix);
			}
			elt.appendContent(n, "");
			if (children.length > 1) {
				Fleur.XQueryEngine[Fleur.XQueryX.elementContent](ctx, children.slice(1), function(n) {
					Fleur.callback(function() {callback(n);});
				}, elt);
			} else {
				Fleur.callback(function() {callback(elt);});
			}
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.elementTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.encoding] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.entryTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.filterExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.flworExpr] = function(ctx, children, callback) {
	var i = 0;
	var prevvarres;
	var resarr;
	var cb = function(n, empty) {
		if (empty || n.schemaTypeInfo === Fleur.Type_error) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		i++;
		if (i === children.length) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr);
	};
	prevvarres = ctx.env.varresolver;
	resarr = [new Fleur.varMgr([], prevvarres)];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.forClause] = function(ctx, children, callback, resarr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n, empty) {
		if (empty) {
			Fleur.callback(function() {callback(n, empty);});
			return;
		}
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.forClause](ctx, children.slice(1), callback, resarr);
	}, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.forClauseItem] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	var allowingEmpty = children[1][0] === Fleur.XQueryX.allowingEmpty ? 1 : 0;
	var positionalVariableBinding = children[1 + allowingEmpty][0] === Fleur.XQueryX.positionalVariableBinding ? 1 : 0;
	var pvarname = positionalVariableBinding !== 0 ? children[1 + allowingEmpty][1][0] : "";
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var posvalue;
		if (n === Fleur.EmptySequence) {
			if (allowingEmpty) {
				resarr[i].set(ctx, "", varname, n);
				if (positionalVariableBinding !== 0) {
					posvalue = new Fleur.Text();
					posvalue.data = "0";
					posvalue.schemaTypeInfo = Fleur.Type_integer;
					resarr[i].set(ctx, "", pvarname, posvalue);
				}
				i++;
			} else {
				resarr.splice(i, 1);
				if (resarr.length === 0) {
					Fleur.callback(function() {callback(Fleur.EmptySequence, true);});
					return;
				}
			}
		} else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			resarr[i].set(ctx, "", varname, n);
			if (positionalVariableBinding !== 0) {
				posvalue = new Fleur.Text();
				posvalue.data = "1";
				posvalue.schemaTypeInfo = Fleur.Type_integer;
				resarr[i].set(ctx, "", pvarname, posvalue);
			}
			i++;
		} else {
			n.childNodes.forEach(function(e, ie) {
				if (ie === 0) {
					resarr[i].set(ctx, "", varname, e);
					if (positionalVariableBinding !== 0) {
						posvalue = new Fleur.Text();
						posvalue.data = "1";
						posvalue.schemaTypeInfo = Fleur.Type_integer;
						resarr[i].set(ctx, "", pvarname, posvalue);
					}
				} else {
					var newres = resarr[i].clone();
					newres.set(ctx, "", varname, e);
					if (positionalVariableBinding !== 0) {
						posvalue = new Fleur.Text();
						posvalue.data = String(ie + 1);
						posvalue.schemaTypeInfo = Fleur.Type_integer;
						newres.set(ctx, "", pvarname, posvalue);
					}
					resarr.splice(i + ie, 0, newres);
				}
			});
			i += n.childNodes.length;
		}
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1 + allowingEmpty + positionalVariableBinding][1][0][0]](ctx, children[1 + allowingEmpty + positionalVariableBinding][1][0][1], cb);
};
Fleur.XQueryEngine.updating = false;
Fleur.XQueryEngine.updateQueue = [];
Fleur.functionCall = function(ctx, children, xf, args, callback) {
	var mainUpdater = false;
	if (xf.updating && !ctx.updater) {
		if (Fleur.XQueryEngine.updating) {
			Fleur.XQueryEngine.updateQueue.push(function() {
				Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr](ctx, children, callback);
			});
			return;
		}
		Fleur.XQueryEngine.updating = true;
		mainUpdater = true;
		ctx.updater = true;
	}
	if (xf.jsfunc || xf.xqxfunc) {
		var argscalc = function(xqxargs, effargs, f) {
			if (xqxargs.length === 0) {
				f(effargs);
			} else {
				var xqxarg = xqxargs.shift();
				Fleur.XQueryEngine[xqxarg[0]](ctx, xqxarg[1], function(n) {
					if (n.schemaTypeInfo === Fleur.Type_error) {
						if (mainUpdater) {
							Fleur.XQueryEngine.updating = false;
							ctx.updater = false;
							if (Fleur.XQueryEngine.updateQueue.length !== 0) {
								setImmediate(Fleur.XQueryEngine.updateQueue.pop());
							}
						}
						Fleur.callback(function() {callback(n);});
						return;
					}
					if ((xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Node) || (n && n.nodeType === Fleur.Node.SEQUENCE_NODE)) {
						effargs.push(n);
					} else if (xf.argtypes && xf.argtypes[effargs.length].type === Fleur.Type_handler) {
						effargs.push(n.data);
					} else {
						var a = Fleur.Atomize(n);
						effargs.push(a);
					}
					argscalc(xqxargs, effargs, f);
				});
			}
		};
		argscalc(args.slice(), [], function(effargs) {
			var a = new Fleur.Text();
			a.schemaTypeInfo = xf.restype && xf.restype.type !== Fleur.numericTypes ? xf.restype.type : null;
			a.data = "";
			if (xf.jsfunc) {
				var jsargs = [];
				try {
					effargs.forEach(function(effarg, iarg) {
						var op;
						var carg = xf.argtypes ? xf.argtypes[iarg] : null;
						if (carg.type === Fleur.Node) {
							jsargs.push(effarg);
						} else {
							effarg = Fleur.Atomize(effarg, true);
							if (effarg === Fleur.EmptySequence) {
								if (carg && (!carg.occurence || (carg.occurence !== "?" && carg.occurence !== "*"))) {
									a.nodeType = Fleur.Node.TEXT_NODE;
									a.schemaTypeInfo = Fleur.Type_error;
									a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
									throw new Error("error");
								}
								jsargs.push(null);
							} else if (effarg.nodeType === Fleur.Node.SEQUENCE_NODE) {
								if (carg && (!carg.occurence || carg.occurence === "?")) {
									a.nodeType = Fleur.Node.TEXT_NODE;
									a.schemaTypeInfo = Fleur.Type_error;
									a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
									throw new Error("error");
								}
								var subarr = [];
								for (var iseq = 0, lseq = effarg.childNodes.length; iseq < lseq; iseq++) {
									var effchild = effarg.childNodes[iseq];
									if ((!carg && Fleur.numericTypes.indexOf(effchild.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1))) {
										op = Fleur.toJSNumber(effchild);
										if (op[0] < 0) {
											a = effchild;
											throw new Error("error");
										}
										subarr.push(op[1]);
									} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_string) || (carg && carg.type === Fleur.Type_string)) {
										op = Fleur.toJSString(effchild);
										if (op[0] < 0) {
											a = effchild;
											throw new Error("error");
										}
										subarr.push(op[1]);
									} else if ((!carg && effchild.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
										op = Fleur.toJSBoolean(effchild);
										if (op[0] < 0) {
											a = effchild;
											throw new Error("error");
										}
										subarr.push(op[1]);
									} else if (carg.type === Fleur.Type_dateTime) {
									} else {
										subarr.push(effchild);
									}
									if (carg && carg.adaptative) {
										var precision = undefined;
										if (effchild.schemaTypeInfo === Fleur.Type_integer) {
											precision = 0;
										} else if (effchild.schemaTypeInfo === Fleur.Type_decimal) {
											precision = effchild.data.indexOf(".") !== -1 ? effchild.data.length - effchild.data.indexOf(".") - 1 : 0;
										}
										subarr.push([subarr.pop(), effchild.schemaTypeInfo, precision]);
									}
								}
								jsargs.push(subarr);
							} else if ((!carg && Fleur.numericTypes.indexOf(effarg.schemaTypeInfo) !== -1) || (carg && (carg.type === Fleur.numericTypes || Fleur.numericTypes.indexOf(carg.type) !== -1 || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
								op = Fleur.toJSNumber(effarg);
								if (op[0] < 0) {
									a = effarg;
									throw new Error("error");
								}
								jsargs.push(op[1]);
							} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_string) || (carg && (carg.type === Fleur.Type_string || carg.type.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION)))) {
								op = Fleur.toJSString(effarg);
								if (op[0] < 0) {
									a = effarg;
									throw new Error("error");
								}
								jsargs.push(op[1]);
							} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_boolean) || (carg && carg.type === Fleur.Type_boolean)) {
								op = Fleur.toJSBoolean(effarg);
								if (op[0] < 0) {
									a = effarg;
									throw new Error("error");
								}
								jsargs.push(op[1]);
							} else if ((!carg && [Fleur.Type_dateTime, Fleur.Type_date, Fleur.Type_time].indexOf(effarg.schemaTypeInfo) !== -1) || [Fleur.Type_dateTime, Fleur.Type_date, Fleur.Type_time].indexOf(carg.type) !== -1) {
								op = Fleur.toJSDate(effarg);
								if (op[0] < 0) {
									a = effarg;
									throw new Error("error");
								}
								jsargs.push(op[1]);
							} else if ((!carg && effarg.schemaTypeInfo === Fleur.Type_dayTimeDuration) || (carg && carg.type === Fleur.Type_dayTimeDuration)) {
								jsargs.push(Fleur.toJSONDayTimeDuration(effarg.data));
							} else {
								jsargs.push(effarg);
							}
						}
						if (carg && carg.adaptative && effarg.nodeType !== Fleur.Node.SEQUENCE_NODE) {
							jsargs.push([jsargs.pop(), effarg.schemaTypeInfo]);
						}
					});
				} catch (e) {
					Fleur.callback(function() {callback(a);});
					return;
				}
				if (xf.needctx) {
					jsargs.push(ctx);
				}
				var convback = function(vret) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					var convret = function(v) {
						var t = null;
						if (v instanceof Array) {
							t = v[1];
							v = v[0];
						}
						if (v === undefined || v === null) {
							a = Fleur.EmptySequence;
							return;
						}
						if (v === Number.POSITIVE_INFINITY) {
							a.data = "INF";
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_double;
							}
						} else if (v === Number.NEGATIVE_INFINITY) {
							a.data = "-INF";
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_double;
							}
						} else if (typeof v === "number" || typeof v === "bigint" || typeof v === "boolean") {
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || (typeof v === "boolean" ? Fleur.Type_boolean : Fleur.Type_double);
							}
							a.data = a.schemaTypeInfo.canonicalize(String(v));
						} else if (typeof v === "string") {
							a.data = v;
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_string;
							}
						} else if (typeof v.getMonth === "function") {
							var o = vret.getTimezoneOffset();
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_datetime;
							}
							if (a.schemaTypeInfo === Fleur.Type_date) {
								a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							} else if (a.schemaTypeInfo === Fleur.Type_time) {
								a.data = ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							} else {
								a.data = ("000" + v.getFullYear()).slice(-4) + "-" + ("0" + (v.getMonth() + 1)).slice(-2) + "-" + ("0" + v.getDate()).slice(-2) + "T" + ("0" + v.getHours()).slice(-2) + ":" + ("0" + v.getMinutes()).slice(-2) + ":" + ("0" + v.getSeconds()).slice(-2) + "." + ("00" + v.getMilliseconds()).slice(-3) + (o < 0 ? "+" : "-") + ("0" + Math.floor(Math.abs(o)/60)).slice(-2) + ":" + ("0" + Math.floor(Math.abs(o) % 60)).slice(-2);
							}
						} else if (v instanceof Error) {
							a = Fleur.error(ctx, v.name, v.message);
						} else if (v instanceof Fleur.Node || (Fleur.inBrowser && v instanceof Node)) {
							a = v;
						} else {
							a.data = v;
							if (!a.schemaTypeInfo) {
								a.schemaTypeInfo = t || Fleur.Type_handler;
							}
						}
					};
					if (vret instanceof Array && !xf.restype.adaptative) {
						var seq = new Fleur.Sequence();
						vret.forEach(function(v) {
							a = new Fleur.Text();
							a.schemaTypeInfo = xf.restype ? xf.restype.type : null;
							a.data = "";
							convret(v);
							seq.appendChild(a);
						});
						Fleur.callback(function() {callback(seq);});
					} else if (typeof vret === 'object' && vret && !(vret instanceof Array || vret instanceof Fleur.Node || (Fleur.inBrowser && vret instanceof Node) || vret instanceof Error || typeof vret.getMonth === "function")) {
						var map = new Fleur.Map();
						var e;
						for (var p in vret) {
							if (vret.hasOwnProperty(p)) {
								e = new Fleur.Entry();
								e.nodeName = p;
								e.namespaceURI = null;
								e.localName = p;
								a = new Fleur.Text();
								a.schemaTypeInfo = null;
								a.data = "";
								convret(vret[p]);
								e.appendChild(a);
								map.setEntryNode(e);
							}
						}
						Fleur.callback(function() {callback(map);});
					} else {
						convret(vret);
						Fleur.callback(function() {callback(a);});
					}
				};
				if (xf.needcallback) {
					jsargs.push(convback);
					xf.jsfunc.apply(null, jsargs);
					return;
				}
				convback(xf.jsfunc.apply(null, jsargs));
			} else {
				var currvarres = ctx.env.varresolver;
				ctx.env.varresolver = new Fleur.varMgr([], ctx.env.globalvarresolver);
				effargs.forEach(function(effarg, iarg) {
					ctx.env.varresolver.set(ctx, "", xf.argtypes[iarg].name, effarg);
				});
				Fleur.XQueryEngine[xf.xqxfunc[0]](ctx, xf.xqxfunc[1], function(n) {
					if (mainUpdater) {
						Fleur.XQueryEngine.updating = false;
						ctx.updater = false;
						if (Fleur.XQueryEngine.updateQueue.length !== 0) {
							setImmediate(Fleur.XQueryEngine.updateQueue.pop());
						}
					}
					ctx.env.varresolver = currvarres;
					Fleur.callback(function() {callback(n);});
				});
			}
		});
	} else {
		xf(ctx, args, function(n) {
			if (mainUpdater) {
				Fleur.XQueryEngine.updating = false;
				ctx.updater = false;
				if (Fleur.XQueryEngine.updateQueue.length !== 0) {
					setImmediate(Fleur.XQueryEngine.updateQueue.pop());
				}
			}
			Fleur.callback(function() {callback(n);});
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.functionCallExpr] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var args = children[1][1];
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	var xf;
	if (uri === "http://www.w3.org/standards/webdesign/script") {
		xf = (Fleur.XPathFunctions[uri] && Fleur.XPathFunctions[uri][fname + "#" + args.length]) ? Fleur.XPathFunctions[uri][fname + "#" + args.length] : {};
		xf.jsfunc = eval(fname);
	} else {
		xf = Fleur.XPathFunctions[uri][fname + "#" + args.length] || Fleur.XPathFunctions[uri][fname];
	}
	if (!uri || !xf) {
		if (uri === "http://www.w3.org/2005/xpath-functions" && fname === "concat" && args.length > 1 && !Fleur.XPathFunctions[uri][fname + "#" + args.length]) {
			var cparam = [];
			for (var i = 0, l = args.length; i < l; i++) {
				cparam[i] = {type: Fleur.Node};
			}
			xf = Fleur.XPathFunctions[uri][fname + "#" + args.length] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPST0017", "The expanded QName and number of arguments in a static function call do not match the name and arity of a function signature in the static context for Q{" + uri + "}" + fname + "#" + args.length));});
			return;
		}
	}
	Fleur.functionCall(ctx, children, xf, args, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.functionDecl] = function(ctx, children, callback) {
	var updating = children[0][0] === Fleur.XQueryX.updatingFunction;
	var init = updating ? 1 : 0;
	var fname = children[init][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var prefix = null;
	if (children[init][1][1]) {
		if (children[init][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[init][1][1][1][0];
		} else if (children[init][1][1][0] === Fleur.XQueryX.prefix) {
			prefix = children[init][1][1][1][0];
			uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
		}
	}
	var args = children[init + 1][1].map(function(arg) {
		var o = {name: arg[1][0][1][0]};
		if (arg[1].length === 1) {
			o.type = Fleur.Node;
			o.occurence = "*";
		} else {
			var tprefix = null, turi;
			var atype = arg[1][1][1][0][1];
			var tname = atype[0];
			if (atype[1]) {
				if (atype[1][0] === Fleur.XQueryX.URI) {
					turi = atype[1][1][0];
				} else if (atype[1][0] === Fleur.XQueryX.prefix) {
					tprefix = atype[1][1][0];
					turi = ctx.env.nsresolver.lookupNamespaceURI(tprefix);
				}
			}
			o.type = Fleur.Types[turi][tname];
			if (arg[1][1][1].length === 2) {
				o.occurence = arg[1][1][1][1][1][0];
			}
		}
		return o;
	});
	var fbody, fret;
	if (children[init + 2][0] === Fleur.XQueryX.typeDeclaration) {
		fret = children[init + 2][1][0];
		fbody = children[init + 3][0] === Fleur.XQueryX.functionBody ? children[init + 3][1][0] : null;
	} else {
		fret = {type: Fleur.Node, occurence: "*"};
		fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
	}
	if (!Fleur.XPathFunctions[uri]) {
		Fleur.XPathFunctions[uri] = {};
	}
	Fleur.XPathFunctions[uri][fname + "#" + String(args.length)] = new Fleur.Function(uri, prefix ? prefix + ":" + fname : fname, null, fbody, args, false, false, fret, updating);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.groupByClause] = function(ctx, children, callback, resarr, groupkeynames) {
	groupkeynames = groupkeynames || [];
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			var aggregnames = [];
			resarr[0].vars.forEach(function(v) {if (groupkeynames.indexOf(v.vname) === -1) aggregnames.push(v.vname);});
			var kgroups = [];
			var ogroups = resarr.reduce(function(o, vmgr) {
				var okey = groupkeynames.reduce(function(k, gkname) {
					var v = vmgr.get(ctx, "", gkname);
					var jsv = Fleur.toJSValue(v, v.schemaTypeInfo !== Fleur.Type_untypedAtomic, true, true, true);
					if (jsv[0] < 3) {
						jsv[0] = 3;
					}
					if (jsv[0] === 6 || jsv[0] === 7) {
						jsv[0] = 8;
					}
					jsv[1] = String(jsv[1]);
					return k + String(jsv[0]) + "." + String(jsv[1].length) + "." + jsv[1] + "|";
				}, "");
				if (o[okey]) {
					aggregnames.forEach(function(aname) {
						var avalue = vmgr.get(ctx, "", aname);
						if (avalue !== Fleur.EmptySequence) {
							var ovalue = o[okey].get(ctx, "", aname);
							if (ovalue === Fleur.EmptySequence) {
								o[okey].set(ctx, "", aname, avalue);
							} else {
								if (ovalue.nodeType !== Fleur.Node.SEQUENCE_NODE) {
									var seq = new Fleur.Sequence();
									seq.appendChild(ovalue);
									ovalue = seq;
								}
								if (avalue.nodeType !== Fleur.Node.SEQUENCE_NODE) {
									ovalue.appendChild(avalue);
								} else {
									avalue.childNodes.forEach(function(av) {
										ovalue.appendChild(av);
									});
								}
								o[okey].set(ctx, "", aname, ovalue);
							}
						}
					});
				} else {
					kgroups.push(okey);
					o[okey] = vmgr;
				}
				return o;
			}, {});
			kgroups.forEach(function(k, i) {
				resarr[i] = ogroups[k];
			});
			resarr.splice(kgroups.length);
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.groupByClause](ctx, children.slice(1), callback, resarr, groupkeynames);
	}, resarr, groupkeynames);
};
Fleur.XQueryEngine[Fleur.XQueryX.groupingSpec] = function(ctx, children, callback, resarr, groupkeynames) {
	var varname = children[0][1][0];
	groupkeynames.push(varname);
	var i = 0;
	var cb = function(n) {
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE && n !== Fleur.EmptySequence) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
		}
		var a = Fleur.Atomize(n);
		resarr[i].set(ctx, "", varname, a);
		i++;
		if (i !== resarr.length) {
			if (children.length === 1) {
				cb(resarr[i].get(ctx, "", varname));	
			} else {
				ctx.env.varresolver = resarr[i];
				Fleur.XQueryEngine[children[1][1][0][1][0][0]](ctx, children[1][1][0][1][0][1], cb);
			}
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	if (children.length === 1) {
				cb(resarr[i].get(ctx, "", varname));	
	} else {
		ctx.env.varresolver = resarr[0];
		Fleur.XQueryEngine[children[1][1][0][1][0][0]](ctx, children[1][1][0][1][0][1], cb);
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.ifThenElseExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var boolean;
		if (n === Fleur.EmptySequence) {
			boolean = false;
		} else if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (n.childNodes.length === 0) {
				boolean = false;
			} else if (n.childNodes[0].nodeType !== Fleur.Node.TEXT_NODE || n.childNodes[0].ownerDocument) {
				boolean = true;
			} else {
				Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
				return;
			}
		} else if (n.nodeType !== Fleur.Node.TEXT_NODE) {
			boolean = true;
		} else if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} else if (n.schemaTypeInfo === Fleur.Type_boolean) {
			boolean = n.data === "true";
		} else if (n.schemaTypeInfo === Fleur.Type_string || n.schemaTypeInfo === Fleur.Type_untypedAtomic || n.schemaTypeInfo === Fleur.Type_anyURI) {
			boolean = !(!n.data || n.data.length === 0);
		} else if (n.schemaTypeInfo === Fleur.Type_integer || n.schemaTypeInfo === Fleur.Type_decimal || n.schemaTypeInfo === Fleur.Type_float || n.schemaTypeInfo === Fleur.Type_double) {
			boolean = !(n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN");
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = n.data === "true";
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = !(!n.data || n.data.length === 0);
		} else if (n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || n.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			boolean = !(n.data === "0" || n.data === "0.0" || n.data === "0.0e0" || n.data === "NaN");
		} else {
			Fleur.callback(function() {callback(Fleur.error(ctx, "FORG0006"));});
			return;
		}
		var cb = function(n) {
			callback(n);
		};
		if (boolean) {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], cb);
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.inlineFunctionExpr] = function(ctx, children, callback) {
	var updating = children[0][0] === Fleur.XQueryX.updatingFunction;
	var init = updating ? 1 : 0;
	var args = children[init][1].map(function(arg) {
		var o = {name: arg[1][0][1][0]};
		if (arg[1].length === 1) {
			o.type = Fleur.Node;
			o.occurence = "*";
		} else {
			var tprefix = null, turi;
			var atype = arg[1][1][1][0][1];
			var tname = atype[0];
			if (atype[1]) {
				if (atype[1][0] === Fleur.XQueryX.URI) {
					turi = atype[1][1][0];
				} else if (atype[1][0] === Fleur.XQueryX.prefix) {
					tprefix = atype[1][1][0];
					turi = ctx.env.nsresolver.lookupNamespaceURI(tprefix);
				}
			}
			o.type = Fleur.Types[turi][tname];
			if (arg[1][1][1].length === 2) {
				o.occurence = arg[1][1][1][1][1][0];
			}
		}
		return o;
	});
	var fbody, fret;
	if (children[init + 1][0] === Fleur.XQueryX.typeDeclaration) {
		fret = children[init + 1][1][0];
		fbody = children[init + 2][0] === Fleur.XQueryX.functionBody ? children[init + 2][1][0] : null;
	} else {
		fret = {type: Fleur.Node, occurence: "*"};
		fbody = children[init + 1][0] === Fleur.XQueryX.functionBody ? children[init + 1][1][0] : null;
	}
	var f = new Fleur.Function(null, null, null, fbody, args, false, false, fret, updating);
	f.closurevarresolver = ctx.env.varresolver;
	Fleur.callback(function() {callback(f);});
};
Fleur.XQueryEngine[Fleur.XQueryX.insertExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(source) {
		if (source !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], function(target) {
				var targetChoice = children[1][0];
				var intoPos = null;
				if (targetChoice === Fleur.XQueryX.insertInto) {
					if (children[1][1].length !== 0) {
						intoPos = children[1][1][0][0];
					}
				}
				if (source.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var tnode;
					if (target instanceof Fleur.Node) {
						tnode = target.ownerDocument ? target.ownerDocument.importNode(source, true) : source;
					} else {
						tnode = Fleur.Document.docImportNode(target.ownerDocument, source, true);
					}
					switch (target.nodeType) {
						case Fleur.Node.ELEMENT_NODE:
							switch (targetChoice) {
								case Fleur.XQueryX.insertInto:
									if (source.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
										target.setAttributeNode(source);
									} else {
										if (intoPos === Fleur.XQueryX.insertAsFirst) {
											target.insertBefore(tnode, target.firstChild);
										} else {
											target.appendChild(tnode);
										}
									}
									break;
								case Fleur.XQueryX.insertBefore:
									target.parentNode.insertBefore(tnode, target);
									break;
								case Fleur.XQueryX.insertAfter:
									if (target.nextSibling) {
										target.parentNode.insertBefore(tnode, target.nextSibling);
									} else {
										target.parentNode.appendChild(tnode);
									}
									break;
							}
							break;
						case Fleur.Node.MAP_NODE:
							target.setEntryNode(tnode.copyNode());
							break;
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.instanceOfExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var seqtype = children[1][1];
		var occurrence = "1";
		var a = new Fleur.Text();
		a.data = "false";
		a.schemaTypeInfo = Fleur.Type_boolean;
		if (seqtype.length === 2) {
			occurrence = seqtype[1][1][0];
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (occurrence === "1" || occurrence === "?") {
					a.data = "false";
					Fleur.callback(function() {callback(a);});
				} else {
					var i = 0;
					var l = n.childNodes.length;
					var cb = function(n2) {
						if (n2 === Fleur.EmptySequence) {
							a.data = "false";
							Fleur.callback(function() {callback(a);});
							return;
						}
						i++;
						if (i === l) {
							a.data = "true";
							Fleur.callback(function() {callback(a);});
							return;
						}
						Fleur.XQueryEngine[seqtype[0][0]]({
							_curr: n.childNodes[i],
							env: ctx.env
						}, seqtype[0][1], cb);
					};
					Fleur.XQueryEngine[seqtype[0][0]]({
						_curr: n.childNodes[i],
						env: ctx.env
					}, seqtype[0][1], cb);
				}
			} else {
				Fleur.XQueryEngine[seqtype[0][0]]({
					_curr: n,
					env: ctx.env
				}, seqtype[0][1], function(n) {
					a.data = String(n !== Fleur.EmptySequence);
					Fleur.callback(function() {callback(a);});
				});
			}
		} else {
			a.data = String(occurrence !== "1" && occurrence !== "+");
			Fleur.callback(function() {callback(a);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.integerConstantExpr] = function(ctx, children, callback) {
	var a = new Fleur.Text();
	a.appendData(Fleur.Type_integer.canonicalize(children[0][1][0]));
	a.schemaTypeInfo = Fleur.Type_integer;
	Fleur.callback(function() {callback(a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.javascriptImport] = function(ctx, children, callback) {
	var at = children[0][1][0];
	var httpget = at.startsWith("http://") || Fleur.inBrowser;
	var fileread = at.startsWith("file://") || !httpget;
	if (httpget) {
		if (at.startsWith("http://")) {
			at = at.substr(7);
		}
		var getp = new Promise(function(resolve, reject) {
			var req = new XMLHttpRequest();
			req.open('GET', at, true);
			req.onload = function() {
				if (req.status === 200) {
					resolve(req.responseText);
				} else {
					reject(Fleur.error(ctx, "FODC0002"));
		      	}
			};
			req.send(null);
		});
		getp.then(
			function(s) {
				Fleur.callback(function() {callback();});
			},
			function(a) {
				Fleur.callback(function() {callback();});
			}
		);
	} else if (fileread) {
		if (at.startsWith("file://")) {
			at = at.substr(7);
		}
		if (!at.startsWith(global.path.sep)) {
			at = global.path.join(Fleur.baseDir, at);
		}
		global.fs.readFile(at, 'binary', function(err, file){
			if (err) {
				process.stdout.write(err);
				Fleur.callback(function() {callback();});
			} else {
				(0, eval)(file);
				Fleur.callback(function() {callback();});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.letClause] = function(ctx, children, callback, resarr) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.letClause](ctx, children.slice(1), callback, resarr);
	}, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.letClauseItem] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		resarr[i].set(ctx, "", varname, n);
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};
Fleur.XQueryEngine.lookups = function(ctx, children, callback, functionid) {
	var ncname, ilabel, seq;
	if (ctx._label) {
		if (children[0][0] === Fleur.XQueryX.NCName) {
			ncname = children[0][1][0];
			if (ncname !== ctx._label) {
				Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
			} else {
				ctx._curr.collabels = null;
				Fleur.callback(function() {callback(ctx._curr, functionid);});
			}
		} else {
			Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
				var a = Fleur.Atomize(n);
				if (a.nodeType !== Fleur.Node.TEXT_NODE) {
					Fleur.callback(function() {callback(a, functionid);});
				} else {
					if (a.data !== ctx._label) {
						Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
					} else {
						ctx._curr.collabels = null;
						Fleur.callback(function() {callback(ctx._curr, functionid);});
					}
				}
			});
		}
		return;
	} else if (ctx._curr.collabels) {
		if (children[0][0] === Fleur.XQueryX.NCName) {
			ncname = children[0][1][0];
			ilabel = ctx._curr.collabels.indexOf(ncname);
			if (ilabel === -1) {
				Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
			} else if (ctx._curr.childNodes[ilabel]) {
				if (ctx._curr.childNodes[ilabel].nodeType === Fleur.Node.MULTIDIM_NODE) {
					seq = new Fleur.Sequence();
					seq.appendChild(ctx._curr.childNodes[ilabel]);
					Fleur.callback(function() {callback(seq, functionid);});
				} else {
					Fleur.callback(function() {callback(ctx._curr.childNodes[ilabel], functionid);});
				}
			} else {
				Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
			}
		} else {
			Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
				var a = Fleur.Atomize(n);
				if (a.nodeType !== Fleur.Node.TEXT_NODE) {
					Fleur.callback(function() {callback(a, functionid);});
				} else {
					ilabel = ctx._curr.collabels.indexOf(a.data);
					Fleur.callback(function() {callback(ilabel === -1 ? Fleur.EmptySequence : ctx._curr.childNodes[ilabel], functionid);});
				}
			});
		}
		return;
	}
	var parents = [];
	if (ctx._curr.nodeType === Fleur.Node.MAP_NODE || ctx._curr.nodeType === Fleur.Node.ARRAY_NODE) {
		parents.push(ctx._curr);
	} else if (ctx._curr.childNodes) {
		parents = ctx._curr.childNodes.filter(function(c) { return c.nodeType === Fleur.Node.MAP_NODE || c.nodeType === Fleur.Node.ARRAY_NODE;});	
	}
	if (parents.length === 0) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, functionid);});
		return;
	}
	seq = new Fleur.Sequence();
	seq.childNodes = new Fleur.NodeList();
	if (children[0][0] === Fleur.XQueryX.NCName) {
		ncname = children[0][1][0];
		parents.forEach(function(p) {
			var e;
			if (p.nodeType === Fleur.Node.MAP_NODE) {
				e = p.getEntryNode(ncname);
				if (e) {
					seq.appendChild(e);
				}
			}
		});
		if (seq.childNodes.length === 0) {
			seq = Fleur.EmptySequence;
		} else if (seq.childNodes.length === 1) {
			seq = seq.childNodes[0];
		}
		Fleur.callback(function() {callback(seq, functionid);});
	} else if (children[0][0] === Fleur.XQueryX.integerConstantExpr) {
		var idx = parseInt(children[0][1][0][1][0], 10) - 1;
		parents.forEach(function(p) {
			var e;
			if (p.nodeType === Fleur.Node.ARRAY_NODE) {
				e = p.childNodes[idx];
				if (e) {
					seq.appendChild(e);
				}
			}
		});
		if (seq.childNodes.length === 0) {
			seq = Fleur.EmptySequence;
		} else if (seq.childNodes.length === 1) {
			seq = seq.childNodes[0];
		}
		Fleur.callback(function() {callback(seq, functionid);});
	} else if (children[0][0] === Fleur.XQueryX.star) {
		parents.forEach(function(p) {
			if (p.nodeType === Fleur.Node.MAP_NODE) {
				p.entries.forEach(function(e) {
					seq.appendChild(e);
				});
			} else {
				p.childNodes.forEach(function(e) {
					seq.appendChild(e);
				});
			}
		});
		if (seq.childNodes.length === 0) {
			seq = Fleur.EmptySequence;
		} else if (seq.childNodes.length === 1) {
			seq = seq.childNodes[0];
		}
		Fleur.callback(function() {callback(seq, functionid);});
	} else {
		Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
			var a = Fleur.Atomize(n);
			if (a.nodeType !== Fleur.Node.TEXT_NODE) {
				Fleur.callback(function() {callback(a);});
			} else {
				parents.forEach(function(p) {
					var e; 
					if (p.nodeType === Fleur.Node.MAP_NODE) {
						e = p.getEntryNode(a.data);
					} else {
						e = p.childNodes[parseInt(a.data, 10) - 1];
					}
					if (e) {
						seq.appendChild(e);
					}
				});
				if (seq.childNodes.length === 0) {
					seq = Fleur.EmptySequence;
				} else if (seq.childNodes.length === 1) {
					seq = seq.childNodes[0];
				}
				Fleur.callback(function() {callback(seq, functionid);});
			}
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.lookup] = function(ctx, children, callback) {
	Fleur.XQueryEngine.lookups(ctx, children, callback, Fleur.XQueryX.lookup);
};
Fleur.XQueryEngine[Fleur.XQueryX.mainModule] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.mainModule](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructor] = function(ctx, children, callback) {
	var map = new Fleur.Map();
	var i = 0;
	var cb = function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				n.childNodes.forEach(function(e) {
					map.setEntryNode(e);
				});
			} else {
				map.setEntryNode(n);
			}
		}
		i++;
		if (i === children.length) {
			Fleur.callback(function() {callback(map);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
	};
	if (children.length !== 0) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	} else {
		Fleur.callback(function() {callback(map);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.mapConstructorEntry] = function(ctx, children, callback) {
	var entry = new Fleur.Entry();
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a = Fleur.Atomize(n);
		if (a.nodeType !== Fleur.Node.TEXT_NODE) {
			Fleur.callback(function() {callback(a);});
		} else {
			entry.nodeName = a.data;
			entry.namespaceURI = null;
			entry.localName = a.data;
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				if (n === Fleur.EmptySequence) {
					Fleur.callback(function() {callback(Fleur.EmptySequence);});
				} else {
					if (n.nodeType === Fleur.Node.ENTRY_NODE) {
						n = n.cloneNode(true).childNodes[0];
					}
					entry.appendChild(n);
					Fleur.callback(function() {callback(entry);});
				}
			});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.mapTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.MAP_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.module] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		ctx._result = n;
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.module](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.moduleImport] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		ctx._result = n;
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.moduleImport](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.multidimExpr] = function(ctx, children, callback) {
	var seq = new Fleur.Sequence();
	var i = 0;
	var cb = function(n) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (n !== Fleur.EmptySequence) {
			var md = new Fleur.Multidim();
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				md.appendChild(n);
			} else {
				n.childNodes.forEach(function(n2) {
					md.appendChild(n2);
				});
			}
			seq.appendChild(md);
		}
		i++;
		if (i === children.length) {
			Fleur.callback(function() {callback(seq);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb);
	};
	if (children.length !== 0) {
		Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
	} else {
		Fleur.callback(function() {callback(seq);});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.namedFunctionRef] = function(ctx, children, callback) {
	var fname = children[0][1][0];
	var uri = ctx.env.nsresolver.lookupNamespaceURI(" function");
	var nbargs = parseInt(children[1][1][0][1][0], 10);
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0017");
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix && ctx.env.nsresolver) {
			uri = ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]);
		}
	}
	if (uri === "http://www.w3.org/2005/xpath-functions" && fname === "concat" && nbargs > 1 && !Fleur.XPathFunctions[uri][fname + "#" + nbargs]) {
		var cparam = [];
		for (var i = 0; i < nbargs; i++) {
			cparam[i] = {type: Fleur.Node};
		}
		Fleur.XPathFunctions[uri][fname + "#" + nbargs] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:concat", Fleur.XPathFunctions_fn["concat#"].jsfunc, null, cparam, false, false, {type: Fleur.Type_string});
	}
	Fleur.callback(function() {callback(Fleur.XPathFunctions[uri] ? Fleur.XPathFunctions[uri][fname + "#" + nbargs].cloneNode() || a : a);});
};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDecl] = function(ctx, children, callback) {
	ctx.env.nsresolver.declareNamespace(children[0][1][0], children[1][1][0]);
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceDeclaration] = function(ctx, children, callback) {
	var attr = new Fleur.Attr();
	var t;
	if (children[0][0] === Fleur.XQueryX.prefixElt) {
		attr.localName = children[0][1][0];
		attr.nodeName = "xmlns:" + attr.localName;
		attr.namespaceURI = "http://www.w3.org/2000/xmlns/";
		attr.prefix = "xmlns";
		t = new Fleur.Text();
		t.data = children[1][1][0];
		attr.appendChild(t);
	} else {
		attr.localName = "xmlns";
		attr.nodeName = "xmlns";
		attr.namespaceURI = "http://www.w3.org/XML/1998/namespace";
		if (children[0][1].length !== 0) {
			t = new Fleur.Text();
			t.data = children[0][1][0];
			attr.appendChild(t);
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
Fleur.XQueryEngine[Fleur.XQueryX.optionDecl] = function(ctx, children, callback) {
	if (!ctx.env.options) {
		ctx.env.options = {};
	}
	var uri = children[0][1].length > 1 ? ctx.env.nsresolver.lookupNamespaceURI(children[0][1][1][1][0]) : "http://www.w3.org/2012/xquery";
	if (!ctx.env.options[uri]) {
		ctx.env.options[uri] = {};
	}
	ctx.env.options[uri][children[0][1][0]] = children[1][1][0];
	Fleur.callback(function() {callback();});
};
Fleur.XQueryEngine[Fleur.XQueryX.orderByClause] = function(ctx, children, callback, resarr, orderkeys, orderkinds) {
	orderkeys = orderkeys || [];
	orderkeys.push([]);
	orderkinds = orderkinds || [];
	if (children[0][1].length === 2 && children[0][1][1][1][0][1][0] === "descending") {
		orderkinds.push(-1);
	} else {
		orderkinds.push(1);
	}
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		} 
		if (children.length <= 1) {
			var kvs = [];
			orderkeys.forEach(function(ks, ki) {
				ks.forEach(function(k, kj) {
					kvs[kj] = kvs[kj] || [];
					kvs[kj][ki] = k;
				});
			}, []);
			resarr.forEach(function(vmgr, i) {
				resarr[i] = {
					kvs: kvs[i],
					resarr: resarr[i]
				};
			});
			resarr.sort(function(a, b) {
				for (var i = 0, l = a.kvs.length; i < l; i++) {
					if (Fleur.ltOp(a.kvs[i], b.kvs[i])) {
						return -orderkinds[i];
					}
					if (Fleur.gtOp(a.kvs[i], b.kvs[i])) {
						return orderkinds[i];
					}
				}
				return 0;
			});
			resarr.forEach(function(o, i) {
				resarr[i] = o.resarr;
			});
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.XQueryEngine[Fleur.XQueryX.orderByClause](ctx, children.slice(1), callback, resarr, orderkeys);
	}, resarr, orderkeys[orderkeys.length - 1]);
};
Fleur.XQueryEngine[Fleur.XQueryX.orderBySpec] = function(ctx, children, callback, resarr, orderkeyvalues) {
	var i = 0;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var a = Fleur.Atomize(n, true);
		var jsv = Fleur.toJSValue(a, true, true, true, true);
		orderkeyvalues.push(jsv);
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.pathExpr] = function(ctx, children, callback) {
	var next;
	var result = Fleur.EmptySequence;
	var tests = [];
	var preds = [];
	children[0][1].forEach(function(child) {
		if (child[0] === Fleur.XQueryX.predicates) {
			child[1].forEach(function(subchild) {preds.push(subchild);});
		} else if (child[0] === Fleur.XQueryX.predicate) {
			preds.push(child[1][0]);
		} else if (child[0] === Fleur.XQueryX.lookup) {
			preds.push(child);
		} else {
			tests.push(child);
		}
	});
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.pathExpr) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		}
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(result, Fleur.XQueryX.pathExpr);});
			return;
		}
		var cb2 = function(n) {
			if (children.length === 1 || n === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(n, Fleur.XQueryX.pathExpr);});
				return;
			}
			var subcurr;
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				subcurr = n.childNodes[0];
				if (n.childNodes.length === 2) {
					n = n.childNodes[1];
				} else {
					var seq2 = new Fleur.Sequence();
					seq2.childNodes = new Fleur.NodeList();
					seq2.children = new Fleur.NodeList();
					seq2.textContent = "";
					n.childNodes.forEach(function(n2) {
						seq2.appendChild(n2);
					});
					seq2.childNodes.shift();
					n = seq2;
				}
			} else {
				subcurr = n;
				n = Fleur.EmptySequence;
			}
			next = n;
			Fleur.XQueryEngine[Fleur.XQueryX.pathExpr]({
				_curr: subcurr,
				_item: ctx._item,
				env: ctx.env
			}, children.slice(1), cb);
		};
		if (preds.length !== 0) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				next = new Fleur.Sequence();
				next.childNodes = new Fleur.NodeList();
				n.childNodes.forEach(function(node) {
					next.appendChild(node);
				});
				next.collabels = n.collabels;
			} else {
				next = n;
			}
			Fleur.XQueryEngine[Fleur.XQueryX.predicates]({
				_next: next,
				_item: ctx._item,
				env: ctx.env
			}, preds, function(n) {
				Fleur.callback(function() {preds = []; cb2(n);});
			});
			return;
		}
		cb2(n);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, tests, cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.piTest] = function(ctx, children, callback) {
	if (ctx._curr.nodeType !== Fleur.Node.PROCESSING_INSTRUCTION_NODE || (children.length === 1 && ctx._curr.target !== children[0][1][0])) {
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
		return;
	}
	Fleur.callback(function() {callback(ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.predicate] = function(ctx, children, callback) {
	var next = ctx._next;
	var last;
	var pos = 1;
	var result = Fleur.EmptySequence;
	var subcurr;
	if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
		last = next.childNodes.length;
		subcurr = next.childNodes.shift();
		if (next.childNodes.length === 1) {
			next = next.childNodes[0];
		}
	} else {
		subcurr = next;
		next = Fleur.EmptySequence;
		last = 1;
	}
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.predicate) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.predicate);});
			return;
		}
		if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
			(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_string && n.data !== "") ||
			(n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
			if (result === Fleur.EmptySequence) {
				result = subcurr;
			} else {
				if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					var seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					seq.appendChild(result);
					result = seq;
				}
				result.appendChild(subcurr);
			}
		}
		if (next === Fleur.EmptySequence) {
			if (children.length === 1 || result === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.predicate);});
				return;
			}
			children.shift();
			next = result;
			result = Fleur.EmptySequence;
			pos = 1;
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
				last = 1;
			}
			Fleur.XQueryEngine[children[0][0]]({
						_curr: subcurr,
						_next: next,
						_last: last,
						_pos: pos,
						env: ctx.env
					}, children[0][1], cb);
			return;
		}
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				next = next.childNodes[0];
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
		}
		pos++;
		Fleur.XQueryEngine[children[0][0]]({
					_curr: subcurr,
					_next: next,
					_last: last,
					_pos: pos,
					env: ctx.env
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.predicateExpr] = function(ctx, children, callback, resarr, checkvalue) {
	var i = 0;
	var result = new Fleur.Text();
	result.schemaTypeInfo = Fleur.Type_boolean;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var currvalue = Fleur.XPathFunctions_fn["boolean#1"].jsfunc(n);
		if (currvalue instanceof Error) {
			Fleur.callback(function() {callback(Fleur.error(ctx, currvalue.name, currvalue.message));});
			return;
		}		
		if (currvalue === checkvalue) {
			result.data = String(checkvalue);
			Fleur.callback(function() {callback(result);});
			return;
		}		
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			result.data = String(!checkvalue);
			Fleur.callback(function() {callback(result);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.predicates] = function(ctx, children, callback) {
	var next = ctx._next;
	var last;
	var pos = 1;
	var i, l, label;
	var result = Fleur.EmptySequence;
	var subcurr;
	if (next.collabels) {
		label = next.collabels[0];
	}
	if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
		var seq = new Fleur.Sequence();
		next.childNodes.forEach(function(child) {
			if (child.nodeType === Fleur.Node.MULTIDIM_NODE) {
				var md = new Fleur.Multidim();
				child.childNodes.forEach(function(subchild) {md.appendChild(subchild);});
				seq.appendChild(md);
			} else {
				seq.appendChild(child);
			}
		});
		seq.collabels = next.collabels;
		next = seq;
		if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
			last = next.childNodes[0].childNodes.length;
			if (last !== 1) {
				subcurr = new Fleur.Sequence();
				for (i = 0, l = next.childNodes.length; i < l; i++) {
					var subitem = next.childNodes[i].childNodes.shift();
					var multi = new Fleur.Multidim();
					multi.appendChild(subitem);
					subcurr.appendChild(multi);
				}
				subcurr.rowlabels = next.rowlabels;
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
			}
		} else {
			last = next.childNodes.length;
			subcurr = next.childNodes.shift();
			if (next.childNodes.length === 1) {
				if (label) {
					next.childNodes[0].collabels = next.collabels;
				}
				next = next.childNodes[0];
			}
		}
	} else {
		subcurr = next;
		next = Fleur.EmptySequence;
		last = 1;
	}
	var cb = function(n, eob) {
		if (eob === Fleur.XQueryX.predicates) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.predicates);});
			return;
		}
		if (eob === Fleur.XQueryX.lookup) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(n2) {
							result.appendChild(n2);
						});
					}
				}
			}
		} else {
			if ((n.nodeType === Fleur.Node.SEQUENCE_NODE && n.childNodes.length !== 0) ||
				(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_boolean && n.data !== "false") ||
				(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_integer && parseInt(n.data, 10) === pos) ||
				(n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_string && n.data !== "") ||
				(n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.TEXT_NODE)) {
				if (result === Fleur.EmptySequence) {
					result = subcurr;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					result.appendChild(subcurr);
				}
			}
		}
		if (next === Fleur.EmptySequence) {
			if (children.length === 1 || result === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.predicates);});
				return;
			}
			children.shift();
			next = result;
			result = Fleur.EmptySequence;
			pos = 1;
			if (next.collabels) {
				label = next.collabels[0];
			}
			if (next !== Fleur.EmptySequence && next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					if (next.childNodes[0].childNodes.length !== 1) {
						subcurr = new Fleur.Sequence();
						for (i = 0, l = next.childNodes.length; i < l; i++) {
							var subitem = next.childNodes[i].childNodes.shift();
							var multi = new Fleur.Multidim();
							multi.appendChild(subitem);
							subcurr.appendChild(multi);
						}
						subcurr.rowlabels = next.rowlabels;
					} else {
						subcurr = next;
						next = Fleur.EmptySequence;
					}
				} else {
					last = next.childNodes.length;
					subcurr = next.childNodes.shift();
					if (next.childNodes.length === 1) {
						if (label) {
							next.childNodes[0].collabels = next.collabels;
						}
						next = next.childNodes[0];
					}
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
				last = 1;
			}
			Fleur.XQueryEngine[children[0][0]]({
						_curr: subcurr,
						_next: next,
						_last: last,
						_pos: pos,
						_label: label,
						env: ctx.env
					}, children[0][1], cb);
			return;
		}
		if (next.collabels) {
			label = next.collabels[pos];
		}
		if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
			if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
				last = next.childNodes[0].childNodes.length;
				if (last !== 1) {
					subcurr = new Fleur.Sequence();
					for (i = 0, l = next.childNodes.length; i < l; i++) {
						var subitem = next.childNodes[i].childNodes.shift();
						var multi = new Fleur.Multidim();
						multi.appendChild(subitem);
						subcurr.appendChild(multi);
					}
					subcurr.rowlabels = next.rowlabels;
				} else {
					subcurr = next;
					next = Fleur.EmptySequence;
				}
			} else {
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					if (label) {
						next.childNodes[0].collabels = next.collabels;
					}
					next = next.childNodes[0];
				}
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
		}
		pos++;
		Fleur.XQueryEngine[children[0][0]]({
					_curr: subcurr,
					_item: ctx._item,
					_next: next,
					_last: last,
					_pos: pos,
					_label: label,
					env: ctx.env
				}, children[0][1], cb);
	};
	Fleur.XQueryEngine[children[0][0]]({
				_curr: subcurr,
				_item: ctx._item,
				_next: next,
				_last: last,
				_pos: pos,
				_label: label,
				env: ctx.env
			}, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.prolog] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.prolog](ctx, children.slice(1), callback);
		} else {
			ctx.env.varresolver.globals = ctx.env.varresolver.length;
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExpr] = function(ctx, children, callback) {
	var i = 1;
	var prevvarres;
	var resarr;
	var checkvalue = children[0][1][0] === "some";
	var cb = function(n, empty) {
		if (n.schemaTypeInfo === Fleur.Type_error) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (empty) {
			var result = new Fleur.Text();
			result.schemaTypeInfo = Fleur.Type_boolean;
			result.data = String(!checkvalue);
			Fleur.callback(function() {callback(result);});
			return;
		}
		i++;
		if (i === children.length) {
			ctx.env.varresolver = prevvarres;
			Fleur.callback(function() {callback(n);});
			return;
		}
		Fleur.XQueryEngine[children[i][0]](ctx, children[i][1], cb, resarr, checkvalue);
	};
	prevvarres = ctx.env.varresolver;
	resarr = [new Fleur.varMgr([], prevvarres)];
	Fleur.XQueryEngine[children[1][0]](ctx, children[1][1], cb, resarr);
};
Fleur.XQueryEngine[Fleur.XQueryX.quantifiedExprInClause] = function(ctx, children, callback, resarr) {
	var i = 0;
	var varname = children[0][1][0][1][0];
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		if (n === Fleur.EmptySequence) {
			resarr.splice(i, 1);
			if (resarr.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence, true);});
				return;
			}
		} else if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
			resarr[i].set(ctx, "", varname, n);
			i++;
		} else {
			n.childNodes.forEach(function(e, ie) {
				if (ie === 0) {
					resarr[i].set(ctx, "", varname, e);
				} else {
					var newres = resarr[i].clone();
					newres.set(ctx, "", varname, e);
					resarr.splice(i + ie, 0, newres);
				}
			});
			i += n.childNodes.length;
		}
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.queryBody] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		if (children.length > 1) {
			Fleur.XQueryEngine[Fleur.XQueryX.queryBody](ctx, children.slice(1), callback);
		} else {
			Fleur.callback(function() {callback(n);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.rangeSequenceExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		if (a1 === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] !== 0 && (a1.schemaTypeInfo !== Fleur.Type_untypedAtomic || Math.floor(op1[1]) !== op1[1])) {
			Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var a2 = Fleur.Atomize(n);
			if (a2 === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] !== 0 && (a2.schemaTypeInfo !== Fleur.Type_untypedAtomic || Math.floor(op2[1]) !== op2[1])) {
				Fleur.callback(function() {callback(Fleur.error(ctx, "XPTY0004"));});
				return;
			}
			if (op1[1] > op2[1]) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (op1[1] === op2[1]) {
				a2.schemaTypeInfo = Fleur.Type_integer;
				Fleur.callback(function() {callback(a2);});
				return;
			}
			var result = new Fleur.Sequence();
			result.nodeType = Fleur.Node.SEQUENCE_NODE;
			while (op1[1] <= op2[1]) {
				var i = new Fleur.Text();
				i.schemaTypeInfo = Fleur.Type_integer;
				i.data = String(op1[1]);
				result.appendChild(i);
				op1[1]++;
			}
			Fleur.callback(function() {callback(result);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.replaceExpr] = function(ctx, children, callback) {
	var replaceValue = children[0][0] === Fleur.XQueryX.replaceValue ? 1 : 0;
	Fleur.XQueryEngine[children[replaceValue][1][0][0]](ctx, children[replaceValue][1][0][1], function(target) {
		if (target !== Fleur.EmptySequence) {
			Fleur.XQueryEngine[children[replaceValue + 1][1][0][0]](ctx, children[replaceValue + 1][1][0][1], function(replacement) {
				if (replaceValue === 1) {
					var a = Fleur.Atomize(replacement);
					target.textContent = a.data;
					target.firstChild.schemaTypeInfo = a.schemaTypeInfo;
				} else if (replacement === Fleur.EmptySequence) {
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						target.ownerElement.removeAttributeNode(target);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						target.ownerMap.removeEntryNode(target);
					} else {
						target.parentElement.removeChild(target);
					}
				} else {
					var parelt = target.nodeType === Fleur.Node.ATTRIBUTE_NODE ? target.ownerElement : target.nodeType === Fleur.Node.ENTRY_NODE ? target.ownerMap : target.nodeType === Fleur.Node.MAP_NODE ? target.parentNode : target.parentElement || target.parentNode;
					var n2;
					if (target.ownerDocument) {
						if (target instanceof Fleur.Node) {
							n2 = target.ownerDocument.importNode(replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
						} else {
							n2 = Fleur.Document.docImportNode(target.ownerDocument, replacement.nodeType === Fleur.Node.SEQUENCE_NODE ? replacement.firstChild : replacement, true);
						}
					} else {
						n2 = replacement;
					}
					if (target.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
						parelt.removeAttributeNode(target);
						parelt.setAttributeNode(n2);
					} else if (target.nodeType === Fleur.Node.ENTRY_NODE) {
						parelt.removeEntryNode(target);
						parelt.setEntryNode(n2);
					} else {
						parelt.replaceChild(n2, target);
					}
					if (replacement.nodeType === Fleur.Node.SEQUENCE_NODE) {
						var n3;
						for (var i = 1, l = replacement.childNodes.length; i < l; i++) {
							if (parelt instanceof Fleur.Node) {
								n3 = parelt.ownerDocument.importNode(replacement.childNodes[i], true);
							} else {
								n3 = Fleur.Document.docImportNode(parelt.ownerDocument, replacement.childNodes[i], true);
							}
							if (n3.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
								parelt.setAttributeNode(n3);
							} else if (n3.nodeType === Fleur.Node.ENTRY_NODE) {
								parelt.setEntryNode(n3);
							} else {
								parelt.insertBefore(n3, n2.followingSibling);
							}
						}
					}
				}
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			});
			return;
		}
		Fleur.callback(function() {callback(Fleur.EmptySequence);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.returnClause] = function(ctx, children, callback, resarr) {
	var i = 0;
	var result = Fleur.EmptySequence;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		var seq;
		if (n !== Fleur.EmptySequence) {
			if ((result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE) || (n.schemaTypeInfo && n.schemaTypeInfo === Fleur.Type_error)) {
				result = n;
			} else {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					if (result !== Fleur.EmptySequence) {
						seq.appendChild(result);
					}
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else if (n.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					n.childNodes.forEach(function(n2, index) {
						if (!result.childNodes[index]) {
							result.appendChild(new Fleur.Multidim());
						}
						n2.childNodes.forEach(function(node) {
							result.childNodes[index].appendChild(node);
						});
					});
				} else {
					n.childNodes.forEach(function(node) {
						result.appendChild(node);
					});
				}
				result.rowlabels = n.rowlabels;
				result.collabels = n.collabels;
			}
		}
		i++;
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			Fleur.callback(function() {callback(result);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.rootExpr] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.ownerDocument || ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.schemaLocation] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr] = function(ctx, children, callback, depth) {
	if (!depth) {
		depth = 0;
	}
	if (children.length === 0) {
		Fleur.callback(function() {callback(Fleur.EmptySequence, depth);});
		return;
	}
	var i, l;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		var seq;
		if (eob === depth) {
			if ((result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.MULTIDIM_NODE) || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
				result = n;
			} else if (n !== Fleur.EmptySequence && (result.nodeType !== Fleur.Node.TEXT_NODE || result.schemaTypeInfo !== Fleur.Type_error)) {
				if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					seq = new Fleur.Sequence();
					seq.childNodes = new Fleur.NodeList();
					seq.children = new Fleur.NodeList();
					seq.textContent = "";
					if (result !== Fleur.EmptySequence) {
						seq.appendChild(result);
					}
					result = seq;
				}
				if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
					result.appendChild(n);
				} else if (result.childNodes.length !== 0 && result.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					for (i = 0, l = result.childNodes.length; i < l; i++) {
						n.childNodes[i].childNodes.forEach(function(child) {result.childNodes[i].appendChild(child);});
					}
				} else {
					n.childNodes.forEach(function(child) {result.appendChild(child);});
				}
			}
			Fleur.callback(function() {callback(result, depth);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, depth);});
			return;
		}
		if ((result === Fleur.EmptySequence && n.nodeType !== Fleur.Node.SEQUENCE_NODE && n.nodeType !== Fleur.Node.MULTIDIM_NODE) || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
			result = n;
		} else if (n !== Fleur.EmptySequence && (result.nodeType !== Fleur.Node.TEXT_NODE || result.schemaTypeInfo !== Fleur.Type_error)) {
			if (result === Fleur.EmptySequence || result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				seq = new Fleur.Sequence();
				seq.childNodes = new Fleur.NodeList();
				seq.children = new Fleur.NodeList();
				seq.textContent = "";
				if (result !== Fleur.EmptySequence) {
					seq.appendChild(result);
				}
				result = seq;
			}
			if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
				result.appendChild(n);
			} else if (result.childNodes.length !== 0 && result.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
				for (i = 0, l = result.childNodes.length; i < l; i++) {
					n.childNodes[i].childNodes.forEach(function(child) {result.childNodes[i].appendChild(child);});
				}
			} else {
				n.childNodes.forEach(function(child) {result.appendChild(child);});
			}
		}
		Fleur.XQueryEngine[Fleur.XQueryX.sequenceExpr](ctx, children.slice(1), cb, depth);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb, children[0][0] === Fleur.XQueryX.sequenceExpr ? depth + 1 : depth);
};
Fleur.XQueryEngine[Fleur.XQueryX.simpleMapExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], function(n) {
		var subcurr, next, last, pos = 1, result = Fleur.EmptySequence;
		if (n === Fleur.EmptySequence || n.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		next = n;
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			next = new Fleur.Sequence();
			next.childNodes = new Fleur.NodeList();
			for (var i = 0, l = n.childNodes.length; i < l; i++) {
				next.appendChild(n.childNodes[i]);
			}
			next.rowlabels = n.rowlabels;
			next.collabels = n.collabels;
			if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
				last = next.childNodes[0].childNodes.length;
				if (last !== 1) {
					subcurr = new Fleur.Sequence();
					for (i = 0, l = next.childNodes.length; i < l; i++) {
						var subitem = next.childNodes[i].childNodes.shift();
						var multi = new Fleur.Multidim();
						multi.appendChild(subitem);
						subcurr.appendChild(multi);
					}
					subcurr.rowlabels = next.rowlabels;
				} else {
					subcurr = next;
					next = Fleur.EmptySequence;
				}
			} else {
				last = next.childNodes.length;
				subcurr = next.childNodes.shift();
				if (next.childNodes.length === 1) {
					next = next.childNodes[0];
				}
				subcurr.rowlabels = next.rowlabels;
			}
		} else {
			subcurr = next;
			next = Fleur.EmptySequence;
			last = 1;
		}
		var cb = function(n) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			if (next === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(result, Fleur.XQueryX.simpleMapExpr);});
				return;
			}
			if (next.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (next.childNodes[0].nodeType === Fleur.Node.MULTIDIM_NODE) {
					if (next.childNodes[0].childNodes.length !== 1) {
						subcurr = new Fleur.Sequence();
						for (i = 0, l = next.childNodes.length; i < l; i++) {
							var subitem = next.childNodes[i].childNodes.shift();
							var multi = new Fleur.Multidim();
							multi.appendChild(subitem);
							subcurr.appendChild(multi);
						}
						subcurr.rowlabels = next.rowlabels;
					} else {
						subcurr = next;
						next = Fleur.EmptySequence;
					}
				} else {
					subcurr = next.childNodes.shift();
					if (next.childNodes.length === 1) {
						next = next.childNodes[0];
					}
					subcurr.rowlabels = next.rowlabels;
				}
			} else {
				subcurr = next;
				next = Fleur.EmptySequence;
			}
			pos++;
			Fleur.XQueryEngine[children[1][0]]({
				_curr: subcurr,
				_item: subcurr,
				_next: next,
				_last: last,
				_pos: pos,
				env: ctx.env
			}, children[1][1], cb);
		};
		Fleur.XQueryEngine[children[1][0]]({
			_curr: subcurr,
			_item: subcurr,
			_next: next,
			_last: last,
			_pos: pos,
			env: ctx.env
		}, children[1][1], cb);
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.stepExpr] = function(ctx, children, callback) {
	var next;
	var result = Fleur.EmptySequence;
	var cb = function(n, eob) {
		var subcurr;
		if (eob === Fleur.XQueryX.stepExpr) {
			if (n !== Fleur.EmptySequence) {
				if (result === Fleur.EmptySequence || (n.nodeType === Fleur.Node.TEXT_NODE && n.schemaTypeInfo === Fleur.Type_error)) {
					result = n;
				} else {
					if (result.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						var seq = new Fleur.Sequence();
						seq.childNodes = new Fleur.NodeList();
						seq.children = new Fleur.NodeList();
						seq.textContent = "";
						seq.appendChild(result);
						result = seq;
					}
					if (n.nodeType !== Fleur.Node.SEQUENCE_NODE) {
						result.appendChild(n);
					} else {
						n.childNodes.forEach(function(node) {
							result.appendChild(node);
						});
					}
				}
			}
			n = next;
		}
		if (n === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(result, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (children.length === 1) {
			Fleur.callback(function() {callback(n, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (children.length > 1 && (children[1][0] === Fleur.XQueryX.predicates || children[1][0] === Fleur.XQueryX.predicate || children[1][0] === Fleur.XQueryX.lookup)) {
			Fleur.callback(function() {next = Fleur.EmptySequence; cb(n, Fleur.XQueryX.stepExpr);});
			return;
		}
		if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
			subcurr = n.childNodes.shift();
			if (n.childNodes.length === 1) {
				n = n.childNodes[0];
			}
		} else {
			subcurr = n;
			n = Fleur.EmptySequence;
		}
		next = n;
		Fleur.XQueryEngine[Fleur.XQueryX.stepExpr]({
				_curr: subcurr,
				_item: ctx._item,
				env: ctx.env
			}, children.slice(1), cb);
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.stringConstantExpr] = function(ctx, children, callback) {
	var n = new Fleur.Text();
	n.appendData(children[0][1][0] || "");
	n.schemaTypeInfo = Fleur.Type_string;
	Fleur.callback(function() {callback(n);});
};
Fleur.XQueryEngine[Fleur.XQueryX.textTest] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.TEXT_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.treatExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var seqtype = children[1][1];
		var occurrence = "1";
		var e = Fleur.error(ctx, "XPDY0050");
		if (seqtype.length === 2) {
			occurrence = seqtype[1][1][0];
		}
		if (n !== Fleur.EmptySequence) {
			if (n.nodeType === Fleur.Node.SEQUENCE_NODE) {
				if (occurrence === "1" || occurrence === "?") {
					Fleur.callback(function() {callback(e);});
				} else {
					var i = 0;
					var l = n.childNodes.length;
					var cb = function(n2) {
						if (n2 === Fleur.EmptySequence) {
							Fleur.callback(function() {callback(e);});
							return;
						}
						i++;
						if (i === l) {
							Fleur.callback(function() {callback(n);});
							return;
						}
						Fleur.XQueryEngine[seqtype[0][0]]({
							_curr: n.childNodes[i],
							env: ctx.env
						}, seqtype[0][1], cb);
					};
					Fleur.XQueryEngine[seqtype[0][0]]({
						_curr: n.childNodes[i],
						env: ctx.env
					}, seqtype[0][1], cb);
				}
			} else {
				Fleur.XQueryEngine[seqtype[0][0]]({
					_curr: n,
					env: ctx.env
				}, seqtype[0][1], function(n2) {
					Fleur.callback(function() {callback(n2 !== Fleur.EmptySequence ? n : e);});
				});
			}
		} else if (occurrence === "1" || occurrence === "+") {
			Fleur.callback(function() {callback(e);});
		}
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.tryCatchExpr] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		if (n && n.schemaTypeInfo === Fleur.Type_error) {
			for (var i = 1, l = children.length; i < l ; i++) {
				for (var j = 0, l2 = children[i][1][0][1].length; j < l2 ; j++) {
					var ctest = children[i][1][0][1][j];
					var cok = false;
					if (ctest[0] === Fleur.XQueryX.Wildcard) {
						cok = true;
						if (ctest[1][0]) {
							if (ctest[1][0][0] === Fleur.XQueryX.star && ctest[1][1][0] === Fleur.XQueryX.NCName) {
								cok = n.localName === ctest[1][1][1][0];
							}
						}
					} else {
						cok = ctest[1][0] === n.localName;
						var nsURI;
						if (ctest[1][1].length === 1) {
							nsURI = "";
						} else {
							nsURI = ctest[1][1][1][0];
						}
						var currURI = n.namespaceURI || null;
						var lookupURI = ctx.env.nsresolver.lookupNamespaceURI(nsURI) || null;
						if (currURI !==  lookupURI && currURI !== "http://www.w3.org/1999/xhtml") {
							cok = false;
						}
					}
					if (cok) {
						var errcode = new Fleur.Text();
						errcode.data = n.localName;
						errcode.schemaTypeInfo = Fleur.Type_string;
						ctx.env.varresolver.set(ctx, "http://www.w3.org/2005/xqt-errors", "code", errcode);
						var errdescription = new Fleur.Text();
						errdescription.data = n.data;
						errdescription.schemaTypeInfo = Fleur.Type_string;
						ctx.env.varresolver.set(ctx, "http://www.w3.org/2005/xqt-errors", "description", errdescription);
						Fleur.XQueryEngine[children[i][1][1][1][0][0]](ctx, children[i][1][1][1][0][1], function(n) {
							Fleur.callback(function() {callback(n);});
						});
						return;
					}
				}
			}
			Fleur.callback(function() {callback(n);});
			return;
		} 
		Fleur.callback(function() {callback(n);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.unaryLookup] = function(ctx, children, callback) {
	Fleur.XQueryEngine.lookups(ctx, children, callback, Fleur.XQueryX.unaryLookup);
};
Fleur.XQueryEngine[Fleur.XQueryX.uri] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.varDecl] = function(ctx, children, callback) {
	var vname = children[0][1][0];
	var uri = "";
	var prefix = null;
	if (children[0][1][1]) {
		if (children[0][1][1][0] === Fleur.XQueryX.URI) {
			uri = children[0][1][1][1][0];
		} else if (children[0][1][1][0] === Fleur.XQueryX.prefix) {
			prefix = children[0][1][1][1][0];
			uri = ctx.env.nsresolver.lookupNamespaceURI(prefix);
		}
	}
	if (children[1][0] === Fleur.XQueryX.external) {
		if (ctx.env.args && ctx.env.args[vname]) {
			var n = new Fleur.Text();
			n.data = ctx.env.args[vname];
			n.schemaTypeInfo = Fleur.Type_untypedAtomic;
			ctx.env.globalvarresolver.set(ctx, uri, vname, n);
			Fleur.callback(function() {callback();});
		} else if (children.length === 3) {
			Fleur.XQueryEngine[children[2][1][0][0]](ctx, children[2][1][0][1], function(n) {
				ctx.env.globalvarresolver.set(ctx, uri, vname, n);
				Fleur.callback(function() {callback();});
			});
		} else {
			callback(Fleur.error(ctx, "XPDY0002"));
		}
	} else {
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			ctx.env.globalvarresolver.set(ctx, uri, vname, n);
			Fleur.callback(function() {callback();});
		});
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.varRef] = function(ctx, children, callback) {
	var nsURI;
	if (children[0][1].length === 1) {
		nsURI = "";
	} else {
		nsURI = children[0][1][1][1][0];
	}
	var lookupURI = nsURI === "" ? "" : ctx.env.nsresolver.lookupNamespaceURI(nsURI) || "";
	var n = ctx.env.varresolver.get(ctx, lookupURI, children[0][1][0]);
	Fleur.callback(function() {callback(n);});
};
Fleur.XQueryEngine[Fleur.XQueryX.version] = function(ctx, children) {
};
Fleur.XQueryEngine[Fleur.XQueryX.Wildcard] = function(ctx, children, callback) {
	if (children[0]) {
		if (children[0][0] === Fleur.XQueryX.star && children[1][0] === Fleur.XQueryX.NCName) {
			if (ctx._curr.localName !== children[1][1][0]) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
		}
	}
	Fleur.callback(function() {callback(ctx._curr.nodeType !== Fleur.Node.ELEMENT_NODE && ctx._curr.nodeType !== Fleur.Node.ATTRIBUTE_NODE && ctx._curr.nodeType !== Fleur.Node.ENTRY_NODE ? Fleur.EmptySequence : ctx._curr);});
};
Fleur.XQueryEngine[Fleur.XQueryX.whereClause] = function(ctx, children, callback, resarr) {
	var i = 0;
	ctx.env.varresolver = resarr[0];
	var cb = function(n) {
		if (Fleur.XPathFunctions_fn["boolean#1"].jsfunc(n)) {
			i++;
		} else {
			resarr.splice(i, 1);
		}
		if (i !== resarr.length) {
			ctx.env.varresolver = resarr[i];
			Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
		} else {
			Fleur.callback(function() {callback(Fleur.EmptySequence);});
		}
	};
	Fleur.XQueryEngine[children[0][0]](ctx, children[0][1], cb);
};
Fleur.XQueryEngine[Fleur.XQueryX.xpathAxis] = function(ctx, children, callback) {
	var seq, n, i, l;
	var curr = ctx._curr;
	switch(children[0]) {
		case "ancestor-or-self":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			n = curr.parentNode || curr.ownerElement;
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "ancestor":
			if (!curr.parentNode && !curr.ownerElement) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.parentNode || curr.ownerElement;
			if (!n.parentNode) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.parentNode;
			while (n) {
				seq.appendChild(n);
				n = n.parentNode;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "attribute":
			if (!curr.attributes || curr.attributes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.attributes.length === 1 && curr.attributes[0].nodeName !== "xmlns" && curr.attributes[0].prefix !== "xmlns") {
				Fleur.callback(function() {callback(curr.attributes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.attributes.forEach) {
				curr.attributes.forEach(function(a) {
					if (a.nodeName !== "xmlns" && a.prefix !== "xmlns") {
						seq.appendChild(a);
					}
				});
			} else {
				for (i = 0, l = curr.attributes.length; i < l; i++) {
					if (curr.attributes[i].nodeName !== "xmlns" && curr.attributes[i].prefix !== "xmlns") {
						seq.appendChild(curr.attributes[i]);
					}
				}
			}
			if (seq.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
			} else {
				if (seq.childNodes.length === 1) {
					seq = seq.childNodes[0];
				}
				Fleur.callback(function() {callback(seq);});
			}
			return;
		case "entry":
			if (!curr.entries || curr.entries.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.entries.length === 1) {
				Fleur.callback(function() {callback(curr.entries[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			curr.entries.forEach(function(a) {seq.appendChild(a);});
			Fleur.callback(function() {callback(seq);});
			return;
		case "child":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			if (curr.childNodes.forEach) {
				curr.childNodes.forEach(function(a) {seq.appendChild(a);});
			} else {
				for (i = 0, l = curr.childNodes.length; i < l; i++) {
					seq.appendChild(curr.childNodes[i]);
				}
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			if (curr.childNodes.length === 1 && curr.childNodes[0].childNodes.length === 0) {
				Fleur.callback(function() {callback(curr.childNodes[0]);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "descendant-or-self":
			if (!curr.childNodes || curr.childNodes.length === 0) {
				Fleur.callback(function() {callback(curr);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(curr);
			seq.appendDescendants(curr);
			Fleur.callback(function() {callback(seq);});
			return;
		case "following":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				seq.appendDescendants(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "following-sibling":
			if (!curr.nextSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.nextSibling;
			if (!n.nextSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.nextSibling;
			while (n) {
				seq.appendChild(n);
				n = n.nextSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "parent":
			Fleur.callback(function() {callback(curr.parentNode || curr.ownerElement || Fleur.EmptySequence);});
			return;
		case "preceding":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendDescendantsRev(n);
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "preceding-sibling":
			if (!curr.previousSibling) {
				Fleur.callback(function() {callback(Fleur.EmptySequence);});
				return;
			}
			n = curr.previousSibling;
			if (!n.previousSibling) {
				Fleur.callback(function() {callback(n);});
				return;
			}
			seq = new Fleur.Sequence();
			seq.appendChild(n);
			n = n.previousSibling;
			while (n) {
				seq.appendChild(n);
				n = n.previousSibling;
			}
			Fleur.callback(function() {callback(seq);});
			return;
		case "self":
			Fleur.callback(function() {callback(curr);});
			return;
	}
};
Fleur.XQueryEngine[Fleur.XQueryX.xqx] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.xqxuf] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.xsi] = function(ctx, children, callback) {
	Fleur.callback(function() {callback(ctx._result);});
};
Fleur.XQueryEngine[Fleur.XQueryX.NCName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.QName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.URIExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.annotationName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyElementTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyFunctionTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.anyItemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.argumentPlaceholder] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.arguments] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.attributeName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.attributeValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.baseUriDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.bindingSequence] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.boundarySpaceDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchErrorList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.catchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.collation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.computedNamespaceConstructor] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constantExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constructionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.constructorFunctionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.contentExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.contextItemDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.copyNamespacesDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.currentItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParam] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParamName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.decimalFormatParamValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.defaultCollationDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.defaultElementNamespace] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.elementName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.emptyOrderingDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.emptyOrderingMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.endExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.expr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.extensionExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.external] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.externalDefinition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.firstOperand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.forLetClauseItemExtensions] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionBody] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.functionName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.inheritMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.itemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.kindTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.libraryModule] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.moduleDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.name] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespacePrefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.namespaceTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nextItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nillable] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.occurrenceIndicator] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.operatorExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.optional] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderingKind] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderingModeDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.param] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.paramList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.paramTypeList] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.parenthesizedItemType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragma] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaContents] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.pragmaName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefixExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.preserveMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.previousItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartOneItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prologPartTwoItem] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.quantifier] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.resultExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaAttributeTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaElementTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.schemaImport] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.secondOperand] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sequenceTypeUnion] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.singleType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.slidingWindowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.sourceExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.stable] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.star] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.startExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchCaseExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExprCaseClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.switchExprDefaultClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.targetLocation] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.targetNamespace] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tryClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.tumblingWindowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeDeclaration] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typedFunctionTest] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typedVariableBinding] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExprCaseClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.typeswitchExprDefaultClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unorderedExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.uri] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.validateExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.validationMode] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.value] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.valueExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.varName] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.varValue] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.variableBinding] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.versionDecl] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.voidSequenceType] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.winEndExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.winStartExpr] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowClause] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowEndCondition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowStartCondition] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.windowVars] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX["default"]] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nondeterministic] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.onlyEnd] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.prefix] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX["private"]] = function(ctx, children) {};
Fleur.addOpTypes = [
	[		 0,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 1,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 2,		 2,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 3,		 3,		 3,		 3,		-1,		-1,		-1,		-1,		-1,		-1, 	-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		 6,		 6],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		 7,		 7],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		 8],
	[		-1,		-1,		-1,		-1,		-1,		-1,		 6,		 7,		-1,		 9,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		 6,		 7,		 8,		-1,		10]
];
Fleur.XQueryEngine[Fleur.XQueryX.addOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n1) {
		var op1, d;
		var a1 = Fleur.Atomize(n1, true);
		if (a1 === Fleur.EmptySequence) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n2) {
			var op2;
			var restype, res, resvalue;
			var prevm;
			var a2 = Fleur.Atomize(n2, true);
			if (a2 === Fleur.EmptySequence) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			op1 = Fleur.toJSValue(a1, true, true, false, true, false, true);
			if (op1[0] < 0) {
				Fleur.callback(function() {callback(a1);});
				return;
			}
			op2 = Fleur.toJSValue(a2, true, true, false, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			restype = Fleur.addOpTypes[op1[0]][op2[0]];
			if (restype !== -1) {
				if (op1[0] < 4 && op2[0] < 4) {
					var val = typeof op1[1] === typeof op2[1] ? op1[1] + op2[1] : Number(op1[1]) + Number(op2[1]);
					if (restype > 1) {
						a1.data = Fleur.Type_double.canonicalize(String(val));
					} else {
						var precision1 = a1.data.indexOf(".") !== -1 ? a1.data.length - a1.data.indexOf(".") - 1 : 0;
						var precision2 = a2.data.indexOf(".") !== -1 ? a2.data.length - a2.data.indexOf(".") - 1 : 0;
						a1.data = Fleur.NumberToDecimalString(val, Math.max(precision1, precision2));
					}
				} else if (op1[0] === 4 && op2[0] === 4) {
					a1.data = op1[1] + op2[1];
				} else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 8) {
					d = op1[1].d;
					if (op2[0] === 9) {
						prevm = d.getMonth();
						if (op2[1].year !== 0) {
							d.setFullYear(d.getFullYear() + op2[1].sign * op2[1].year);
						}
						if (op2[1].month !== 0) {
							d.setMonth(d.getMonth() + op2[1].sign * op2[1].month);
						}
						if (d.getMonth() !== prevm + (op2[1].month !== 0 ? op2[1].sign * op2[1].month : 0)) {
							d.setDate(0);
						}
					} else {
						if (op2[1].day !== 0) {
							d.setDate(d.getDate() + op2[1].sign * op2[1].day);
						}
						if (op2[1].hour !== 0) {
							d.setHours(d.getHours() + op2[1].sign * op2[1].hour);
						}
						if (op2[1].minute !== 0) {
							d.setMinutes(d.getMinutes() + op2[1].sign * op2[1].minute);
						}
						if (op2[1].second !== 0) {
							d.setSeconds(d.getSeconds() + op2[1].sign * op2[1].second);
						}
					}
					a1.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op1[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op1[1].tz}) : Fleur.dateToTime({d: d, tz: op1[1].tz});
				} else if (op2[0] > 5 && op2[0] < 9 && op1[0] > 8) {
					d = op2[1].d;
					if (op1[0] === 9) {
						prevm = d.getMonth();
						if (op1[1].year !== 0) {
							d.setFullYear(d.getFullYear() + op1[1].sign * op1[1].year);
						}
						if (op1[1].month !== 0) {
							d.setMonth(d.getMonth() + op1[1].sign * op1[1].month);
						}
						if (d.getMonth() !== prevm + (op1[1].month !== 0 ? op1[1].sign * op1[1].month : 0)) {
							d.setDate(0);
						}
					} else {
						if (op1[1].day !== 0) {
							d.setDate(d.getDate() + op1[1].sign * op1[1].day);
						}
						if (op1[1].hour !== 0) {
							d.setHours(d.getHours() + op1[1].sign * op1[1].hour);
						}
						if (op1[1].minute !== 0) {
							d.setMinutes(d.getMinutes() + op1[1].sign * op1[1].minute);
						}
						if (op1[1].second !== 0) {
							d.setSeconds(d.getSeconds() + op1[1].sign * op1[1].second);
						}
					}
					a1.data = restype === 6 ? Fleur.dateToDate({d: d, tz: op2[1].tz}) : restype === 7 ? Fleur.dateToDateTime({d: d, tz: op2[1].tz}) : Fleur.dateToTime({d: d, tz: op2[1].tz});
				} else if (op1[0] === 9 && op2[0] === 9) {
					resvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) + op2[1].sign * (op2[1].year * 12 + op2[1].month);
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 || res.year === 0 ? String(res.month) + "M" : "");
				} else if (op1[0] === 10 && op2[0] === 10) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) + op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				}
				a1.schemaTypeInfo = Fleur.JSTypes[restype];
			} else {
				var casterr = n1.nodeType === Fleur.Node.ELEMENT_NODE || n2.nodeType === Fleur.Node.ELEMENT_NODE;
				a1 = new Fleur.Text();
				a1.schemaTypeInfo = Fleur.Type_error;
				a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", casterr ? "err:FORG0001" : "err:XPTY0004");
			}
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.andOp] = function(ctx, children, callback) {
	var op1;
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSBoolean(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(n);});
			return;
		}
		if (!op1[1]) {
			a1.data = "false";
			a1.schemaTypeInfo = Fleur.Type_boolean;
			Fleur.callback(function() {callback(a1);});
		} else {
			Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
				var op2;
				var a2 = Fleur.Atomize(n);
				op2 = Fleur.toJSBoolean(a2);
				if (op2[0] < 0) {
					Fleur.callback(function() {callback(n);});
					return;
				}
				a2.data = String(op2[1]);
				a2.schemaTypeInfo = Fleur.Type_boolean;
				Fleur.callback(function() {callback(a2);});
			});
		}
	});
};
Fleur.divOpTypes = [
	[		 0,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 1,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 2,		 2,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 3,		 3,		 3,		 3,		-1,		-1,		-1,		-1,		-1,		-1, 	-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 9,		 9,		 9,		 9,		-1,		-1,		-1,		-1,		-1,		 3,		-1],
	[		10,		10,		10,		10,		-1,		-1,		-1,		-1,		-1,		-1,		 3]
];
Fleur.XQueryEngine[Fleur.XQueryX.divOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSValue(a1, true, false, false, false, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var restype, res, resvalue;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSValue(a2, true, false, false, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			restype = Fleur.divOpTypes[op1[0]][op2[0]];
			if (restype !== -1) {
				if (op1[0] < 4 && op2[0] < 4) {
					if (isNaN(Number(op1[1]) / Number(op2[1]))) {
						a1.data = "NaN";
					} else if (Number(op1[1]) / Number(op2[1]) === -Infinity) {
						a1.data = "-INF";
					} else if (Number(op1[1]) / Number(op2[1]) === Infinity) {
						a1.data = "INF";
					} else if (Number(op2[1]) / Number(op1[1]) === -Infinity) {
						a1.data = "-0";
					} else if (Number(op2[1]) / Number(op1[1]) === Infinity) {
						a1.data = "0";
					} else {
						a1.data = restype > 1 ? Fleur.Type_double.canonicalize(String(Number(op1[1]) / Number(op2[1]))) : Fleur.NumberToDecimalString(Number(op1[1]) / Number(op2[1]));
						if (restype === 0) {
							var newv = parseFloat(a1.data);
							if (newv !== Math.floor(newv)) {
								restype = 1;
							}
						}
					}
				} else if (op1[0] === 9 && op2[0] < 4) {
					resvalue = op1[1].sign * Math.round((op1[1].year * 12 + op1[1].month) / op2[1]);
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 || res.year === 0 ? String(res.month) + "M" : "");
				} else if (op1[0] === 10 && op2[0] < 4) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) / op2[1];
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				} else if (op1[0] === 9 && op2[0] === 9) {
					resvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) / (op2[1].sign * (op2[1].year * 12 + op2[1].month));
					a1.data = Fleur.Type_double.canonicalize(String(resvalue));
				} else if (op1[0] === 10 && op2[0] === 10) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) / (op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second));
					a1.data = Fleur.Type_double.canonicalize(String(resvalue));
				}
				a1.schemaTypeInfo = Fleur.JSTypes[restype];
			} else {
				a1 = new Fleur.Text();
				a1.schemaTypeInfo = Fleur.Type_error;
				a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
			}
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.eqOp = function(op1, op2, c) {
	if (op1[0] < 4 && op2[0] < 4) {
		return isNaN(Number(op1[1])) && isNaN(Number(op2[1])) || Number(op1[1]) === Number(op2[1]);
	}
	if (op1[0] === 4 && op2[0] === 4) {
		return c.equals(op1[1], op2[1]);
	}
	if (op1[0] === 5 && op2[0] === 5) {
		return op1[1] === op2[1];
	}
	if (op1[0] > 5 && op1[0] < 9 && op2[0] > 5 && op2[0] < 9) {
		var d1 = new Date(op1[1].d.getTime());
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = new Date(op2[1].d.getTime());
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1.getTime() === d2.getTime();
	}
	if (op1[0] === 9 && op2[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) === op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10 && op2[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) === op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	if (op1[0] === 99 && op2[0] === 99) {
		return c.equals(op1[1], op2[1]);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.eqOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.eqOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.equalOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.eqOp, callback);
};
Fleur.geOp = function(op1, op2) {
	if (op1[0] < 4) {
		return op1[1] >= op2[1];
	}
	if (op1[0] === 4) {
		return op1[1] >= op2[1]
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") >= (op2[1] === "true");
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1 >= d2;
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) >= op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) >= op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.geOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.geOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.greaterThanOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.gtOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.greaterThanOrEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.geOp, callback);
};
Fleur.gtOp = function(op1, op2) {
	if (op1[0] < 4) {
		return op1[1] > op2[1];
	}
	if (op1[0] === 4) {
		return op1[1] > op2[1];
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") > (op2[1] === "true");
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1 > d2;
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) > op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) > op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.gtOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.gtOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.idivOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2, divres;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			divres = typeof op1[1] === typeof op2[1] ? op1[1] / op2[1] : Number(op2[1]) / Number(op1[1]);
			a1.data = String(typeof divres === "number" ? Math.floor(divres) + (divres >= 0 ? 0 : 1) : divres + Fleur.BigInt(divres >= 0 ? 0 : 1));
			a1.schemaTypeInfo = Fleur.Type_integer;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.leOp = function(op1, op2) {
	if (op1[0] < 4) {
		return op1[1] <= op2[1];
	}
	if (op1[0] === 4) {
		return op1[1] <= op2[1];
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") <= (op2[1] === "true");
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1 <= d2;
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) <= op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) <= op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.leOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.leOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.lessThanOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.ltOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.lessThanOrEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.leOp, callback);
};
Fleur.ltOp = function(op1, op2) {
	if (op1[0] < 4) {
		return op1[1] < op2[1];
	}
	if (op1[0] === 4) {
		return op1[1] < op2[1];
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") < (op2[1] === "true");
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1 < d2;
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) < op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) < op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.ltOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.ltOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.modOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSNumber(a1);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2, divres;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSNumber(a2);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (typeof op1[1] !== typeof op2[1]) {
				op1[1] = Number(op1[1]);
				op2[1] = Number(op2[1]);
			}
			divres = op1[1] / op2[1];
			a1.data = String(op1[1] - ((typeof divres === "number" ? Math.floor(divres) : divres) + Fleur.BigInt(divres >= 0 ? 0 : 1)) * op2[1]);
			a1.schemaTypeInfo = Fleur.numericTypes[Math.max(op1[0], op2[0])];
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.multiplyOpTypes = [
	[		 0,		 1,		 2,		 3,		 4,		-1,		-1,		-1,		-1,		 9,		10],
	[		 1,		 1,		 2,		 3,		 4,		-1,		-1,		-1,		-1,		 9,		10],
	[		 2,		 2,		 2,		 3,		 4,		-1,		-1,		-1,		-1,		 9,		10],
	[		 3,		 3,		 3,		 3,		 4,		-1,		-1,		-1,		-1,		 9, 	10],
	[		 4,		 4,		 4,		 4,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 9,		 9,		 9,		 9,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		10,		10,		10,		10,		-1,		-1,		-1,		-1,		-1,		-1,		-1]
];
Fleur.XQueryEngine[Fleur.XQueryX.multiplyOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSValue(a1, true, true, false, false, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var restype, res, resvalue;
			var a2 = Fleur.Atomize(n);
			op2 = Fleur.toJSValue(a2, true, true, false, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			restype = Fleur.multiplyOpTypes[op1[0]][op2[0]];
			if (restype !== -1) {
				if (op1[0] < 4 && op2[0] < 4) {
					if (isNaN(Number(op1[1]) * Number(op2[1]))) {
						a1.data = "NaN";
					} else if (Number(op1[1]) * Number(op2[1]) === -Infinity) {
						a1.data = "-INF";
					} else if (Number(op1[1]) * Number(op2[1]) === Infinity) {
						a1.data = "INF";
					} else if (1 / (Number(op2[1]) * Number(op1[1])) === -Infinity) {
						a1.data = "-0";
					} else if (1 / (Number(op2[1]) * Number(op1[1])) === Infinity) {
						a1.data = "0";
					} else {
						var val = typeof op1[1] === typeof op2[1] ? op1[1] * op2[1] : Number(op1[1]) * Number(op2[1]);
						if (restype > 1) {
							a1.data = Fleur.Type_double.canonicalize(String(val));
						} else {
							var precision1 = a1.data.indexOf(".") !== -1 ? a1.data.length - a1.data.indexOf(".") - 1 : 0;
							var precision2 = a2.data.indexOf(".") !== -1 ? a2.data.length - a2.data.indexOf(".") - 1 : 0;
							a1.data = Fleur.NumberToDecimalString(val, precision1 + precision2);
						}
					}
				} else if (op1[0] < 4 && op2[0] === 4) {
					a1.data = op2[1].repeat(op1[1]);
				} else if (op1[0] === 4 && op2[0] < 4) {
					a1.data = op1[1].repeat(op2[1]);
				} else if (op1[0] < 4 && op2[0] === 9) {
					resvalue = op2[1].sign * Math.round((op2[1].year * 12 + op2[1].month) * Number(op1[1]));
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 || res.year === 0 ? String(res.month) + "M" : "");
				} else if (op1[0] === 9 && op2[0] < 4) {
					resvalue = op1[1].sign * Math.round((op1[1].year * 12 + op1[1].month) * Number(op2[1]));
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0 || res.year === 0 ? String(res.month) + "M" : "");
				} else if (op1[0] < 4 && op2[0] === 10) {
					resvalue = Number(op1[1]) * op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				} else if (op1[0] === 10 && op2[0] < 4) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) * Number(op2[1]);
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				}
				a1.schemaTypeInfo = Fleur.JSTypes[restype];
			} else {
				a1 = new Fleur.Text();
				a1.schemaTypeInfo = Fleur.Type_error;
				a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
			}
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.neOp = function(op1, op2, c) {
	if (op1[0] < 4) {
		return op1[1] !== op2[1];
	}
	if (op1[0] === 4) {
		return !c.equals(op1[1], op2[1]);
	}
	if (op1[0] === 5) {
		return (op1[1] === "true") !== (op2[1] === "true");
	}
	if (op1[0] > 5 && op1[0] < 9) {
		var d1 = op1[1].d;
		d1.setMinutes(d1.getMinutes() - op1[1].tz);
		var d2 = op2[1].d;
		d2.setMinutes(d2.getMinutes() - op2[1].tz);
		return d1.getTime() !== d2.getTime();
	}
	if (op1[0] === 9) {
		return op1[1].sign * (op1[1].year * 12 + op1[1].month) !== op2[1].sign * (op2[1].year * 12 + op2[1].month);
	}
	if (op1[0] === 10) {
		return op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) !== op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
	}
	return false;
};
Fleur.XQueryEngine[Fleur.XQueryX.neOp] = function(ctx, children, callback) {
	Fleur.XPathTestOpFunction(ctx, children, Fleur.neOp, callback);
};
Fleur.XQueryEngine[Fleur.XQueryX.notEqualOp] = function(ctx, children, callback) {
	Fleur.XPathGenTestOpFunction(ctx, children, Fleur.neOp, callback);
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
 
Fleur.XQueryEngine[Fleur.XQueryX.stringConcatenateOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var a1 = Fleur.Atomize(n, true);
		if (a1.schemaTypeInfo === Fleur.Type_error) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		if (a1 === Fleur.EmptySequence) {
			a1 = new Fleur.Text();
			a1.data = "";
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var a2 = Fleur.Atomize(n, true);
			if (a2.schemaTypeInfo === Fleur.Type_error) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			if (a2.data) {
				a1.data += a2.data;
			}
			a1.schemaTypeInfo = Fleur.Type_string;
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.subtractOpTypes = [
	[		 0,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 1,		 1,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 2,		 2,		 2,		 3,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		 3,		 3,		 3,		 3,		-1,		-1,		-1,		-1,		-1,		-1, 	-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		 6,		 6],
	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		 7,		 7],
	[		-1,		-1,		-1,		-1,		-1,		-1,		10,		10,		10,		-1,		 8],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		 9,		-1],
	[		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		-1,		10]
];
Fleur.XQueryEngine[Fleur.XQueryX.subtractOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op1;
		var a1 = Fleur.Atomize(n);
		op1 = Fleur.toJSValue(a1, true, false, false, true, false, true);
		if (op1[0] < 0) {
			Fleur.callback(function() {callback(a1);});
			return;
		}
		Fleur.XQueryEngine[children[1][1][0][0]](ctx, children[1][1][0][1], function(n) {
			var op2;
			var restype, res, resvalue;
			var a2 = Fleur.Atomize(n);
			var prevm;
			op2 = Fleur.toJSValue(a2, true, false, false, true, false, true);
			if (op2[0] < 0) {
				Fleur.callback(function() {callback(a2);});
				return;
			}
			restype = Fleur.subtractOpTypes[op1[0]][op2[0]];
			if (restype !== -1) {
				if (op1[0] < 4 && op2[0] < 4) {
					var val = typeof op1[1] === typeof op2[1] ? op1[1] - op2[1] : Number(op1[1]) - Number(op2[1]);
					if (restype > 1) {
						a1.data = Fleur.Type_double.canonicalize(String(val));
					} else {
						var precision1 = a1.data.indexOf(".") !== -1 ? a1.data.length - a1.data.indexOf(".") - 1 : 0;
						var precision2 = a2.data.indexOf(".") !== -1 ? a2.data.length - a2.data.indexOf(".") - 1 : 0;
						a1.data = Fleur.NumberToDecimalString(val, Math.max(precision1, precision2));
					}
				} else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 5 && op2[0] < 9) {
					a1.data = Fleur.msToDayTimeDuration(op1[1].d - op1[1].tz * 60 * 1000 - op2[1].d + op2[1].tz * 60 * 1000);
				} else if (op1[0] > 5 && op1[0] < 9 && op2[0] > 8) {
					var d = op1[1].d;
					if (op2[0] === 9) {
						prevm = d.getMonth();
						if (op2[1].year !== 0) {
							d.setFullYear(d.getFullYear() - op2[1].sign * op2[1].year);
						}
						if (op2[1].month !== 0) {
							d.setMonth(d.getMonth() - op2[1].sign * op2[1].month);
						}
						if (d.getMonth() !== prevm - (op2[1].month !== 0 ? op2[1].sign * op2[1].month : 0)) {
							d.setDate(0);
						}
					} else {
						if (op2[1].day !== 0) {
							d.setDate(d.getDate() - op2[1].sign * op2[1].day);
						}
						if (op2[1].hour !== 0) {
							d.setHours(d.getHours() - op2[1].sign * op2[1].hour);
						}
						if (op2[1].minute !== 0) {
							d.setMinutes(d.getMinutes() - op2[1].sign * op2[1].minute);
						}
						if (op2[1].second !== 0) {
							d.setSeconds(d.getSeconds() - op2[1].sign * op2[1].second);
						}
					}
					op1[1].d = d;
					a1.data = restype === 6 ? Fleur.dateToDate(op1[1]) : restype === 7 ? Fleur.dateToDateTime(op1[1]) : Fleur.dateToTime(op1[1]);
				} else if (op1[0] === 9 && op2[0] === 9) {
					resvalue = op1[1].sign * (op1[1].year * 12 + op1[1].month) - op2[1].sign * (op2[1].year * 12 + op2[1].month);
					res = {
						sign: resvalue < 0 ? -1 : 1,
						year: Math.floor(Math.abs(resvalue) / 12),
						month: Math.abs(resvalue) % 12};
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.year !== 0 ? String(res.year) + "Y": "") + (res.month !== 0  || res.year === 0? String(res.month) + "M" : "");
				} else if (op1[0] === 10 && op2[0] === 10) {
					resvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) - op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
					res = {sign: resvalue < 0 ? -1 : 1};
					resvalue = Math.abs(resvalue);
					res.day = Math.floor(resvalue / 86400);
					resvalue = resvalue % 86400;
					res.hour = Math.floor(resvalue / 3600);
					resvalue = resvalue % 3600;
					res.minute = Math.floor(resvalue / 60);
					res.second = resvalue % 60;
					a1.data = (res.sign < 0 ? "-" : "") + "P" + (res.day !== 0 ? String(res.day) + "D": "") + (res.hour !== 0 || res.minute !== 0 || res.second !== 0 || res.day + res.hour + res.minute === 0 ? "T" : "") + (res.hour !== 0 ? String(res.hour) + "H" : "") + (res.minute !== 0 ? String(res.minute) + "M" : "") + (res.second !== 0 || res.day + res.hour + res.minute === 0 ? String(res.second) + "S" : "");
				}
				a1.schemaTypeInfo = Fleur.JSTypes[restype];
			} else {
				a1 = new Fleur.Text();
				a1.schemaTypeInfo = Fleur.Type_error;
				a1._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
			}
			Fleur.callback(function() {callback(a1);});
		});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.arithmeticOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.comparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.exceptOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.generalComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.intersectOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.isOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.logicalOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeAfterOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeBeforeOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.nodeComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.orderComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.setOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.stringOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unionOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.valueComparisonOp] = function(ctx, children) {};
Fleur.XQueryEngine[Fleur.XQueryX.unaryMinusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		if (op[0] < 0) {
			Fleur.callback(function() {callback(a);});
			return;
		}
		if (a.schemaTypeInfo !== Fleur.Type_integer && a.schemaTypeInfo !== Fleur.Type_decimal && a.schemaTypeInfo !== Fleur.Type_float && a.schemaTypeInfo !== Fleur.Type_double) {
			if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_integer;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_decimal;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_float;
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				a.schemaTypeInfo = Fleur.Type_double;
			}
		}
		a.data = a.schemaTypeInfo.canonicalize(String(-op[1]));
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.XQueryEngine[Fleur.XQueryX.unaryPlusOp] = function(ctx, children, callback) {
	Fleur.XQueryEngine[children[0][1][0][0]](ctx, children[0][1][0][1], function(n) {
		var op;
		var a = Fleur.Atomize(n);
		op = Fleur.toJSNumber(a);
		Fleur.callback(function() {callback(a);});
	});
};
Fleur.callback_period = 500;
Fleur.callback_counter = 0;
Fleur.callback = function(cb) {
	if (Fleur.callback_counter === 0) {
		Fleur.callback_counter = Fleur.callback_period;
		setImmediate(cb);
		return;
	}
	Fleur.callback_counter--;
	cb();
};
Fleur.error = function(ctx, ename, emessage) {
	var a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:" + ename);
	if (emessage) {
		a.data = emessage;
	}
	return a;
};
Fleur.locale = {};
Fleur.locale["ar"] = {
	weekdays:["\u0627\u0644\u0623\u062D\u062F","\u0627\u0644\u0627\u062B\u0646\u064A\u0646","\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621","\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621","\u0627\u0644\u062E\u0645\u064A\u0633","\u0627\u0644\u062C\u0645\u0639\u0629","\u0627\u0644\u0633\u0628\u062A"],
	months: ["\u0631\u0628\u064A\u0639 \u0627\u0644\u0622\u062E\u0631","\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0623\u0648\u0644\u0649","\u062C\u0645\u0627\u062F\u0649 \u0627\u0644\u0622\u062E\u0631\u0629","\u0631\u062C\u0628","\u0634\u0639\u0628\u0627\u0646","\u0631\u0645\u0636\u0627\u0646","\u0634\u0648\u0627\u0644","\u0630\u0648 \u0627\u0644\u0642\u0639\u062F\u0629","\u0630\u0648 \u0627\u0644\u062D\u062C\u0629","\u0645\u062D\u0631\u0645","\u0635\u0641\u0631","\u0631\u0628\u064A\u0639 \u0627\u0644\u0623\u0648\u0644"]};
Fleur.locale["as"] = {
	weekdays:["\u09A6\u09C7\u0993\u09AC\u09BE\u09F0","\u09B8\u09CB\u09AE\u09AC\u09BE\u09F0","\u09AE\u0999\u09CD\u0997\u09B2\u09AC\u09BE\u09F0","\u09AC\u09C1\u09A7\u09AC\u09BE\u09F0","\u09AC\u09C3\u09B9\u09B8\u09CD\u09AA\u09A4\u09BF\u09AC\u09BE\u09F0","\u09B6\u09C1\u0995\u09CD\u09F0\u09AC\u09BE\u09F0","\u09B6\u09A8\u09BF\u09AC\u09BE\u09F0"],
	months: ["\u099C\u09BE\u09A8\u09C1\u09F1\u09BE\u09F0\u09C0","\u09AB\u09C7\u09AC\u09CD\u09F0\u09C1\u09F1\u09BE\u09F0\u09C0","\u09AE\u09BE\u09F0\u09CD\u099A","\u098F\u09AA\u09CD\u09F0\u09BF\u09B2","\u09AE\u09C7\u2019","\u099C\u09C1\u09A8","\u099C\u09C1\u09B2\u09BE\u0987","\u0986\u0997\u09B7\u09CD\u099F","\u099B\u09C7\u09AA\u09CD\u09A4\u09C7\u09AE\u09CD\u09AC\u09F0","\u0985\u0995\u09CD\u099F\u09CB\u09AC\u09F0","\u09A8\u09F1\u09C7\u09AE\u09CD\u09AC\u09F0","\u09A1\u09BF\u099A\u09C7\u09AE\u09CD\u09AC\u09F0"]};
Fleur.locale["ast"] = {
	weekdays:["domingu","llunes","martes","mi\u00E9rcoles","xueves","vienres","s\u00E1badu"],
	months: ["xineru","febreru","marzu","abril","mayu","xunu","xunetu","agostu","setiembre","ochobre","payares","avientu"]};
Fleur.locale["bg"] = {
	weekdays:["\u043D\u0435\u0434\u0435\u043B\u044F","\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u043D\u0438\u043A","\u0432\u0442\u043E\u0440\u043D\u0438\u043A","\u0441\u0440\u044F\u0434\u0430","\u0447\u0435\u0442\u0432\u044A\u0440\u0442\u044A\u043A","\u043F\u0435\u0442\u044A\u043A","\u0441\u044A\u0431\u043E\u0442\u0430"],
	months: ["\u044F\u043D\u0443\u0430\u0440\u0438","\u0444\u0435\u0432\u0440\u0443\u0430\u0440\u0438","\u043C\u0430\u0440\u0442","\u0430\u043F\u0440\u0438\u043B","\u043C\u0430\u0439","\u044E\u043D\u0438","\u044E\u043B\u0438","\u0430\u0432\u0433\u0443\u0441\u0442","\u0441\u0435\u043F\u0442\u0435\u043C\u0432\u0440\u0438","\u043E\u043A\u0442\u043E\u043C\u0432\u0440\u0438","\u043D\u043E\u0435\u043C\u0432\u0440\u0438","\u0434\u0435\u043A\u0435\u043C\u0432\u0440\u0438"]};
Fleur.locale["bn"] = {
	weekdays:["\u09B0\u09AC\u09BF\u09AC\u09BE\u09B0","\u09B8\u09CB\u09AE\u09AC\u09BE\u09B0","\u09AE\u0999\u09CD\u0997\u09B2\u09AC\u09BE\u09B0","\u09AC\u09C1\u09A7\u09AC\u09BE\u09B0","\u09AC\u09C3\u09B9\u09B7\u09CD\u09AA\u09A4\u09BF\u09AC\u09BE\u09B0","\u09B6\u09C1\u0995\u09CD\u09B0\u09AC\u09BE\u09B0","\u09B6\u09A8\u09BF\u09AC\u09BE\u09B0"],
	months: ["\u099C\u09BE\u09A8\u09C1\u09AF\u09BC\u09BE\u09B0\u09C0","\u09AB\u09C7\u09AC\u09CD\u09B0\u09C1\u09AF\u09BC\u09BE\u09B0\u09C0","\u09AE\u09BE\u09B0\u09CD\u099A","\u098F\u09AA\u09CD\u09B0\u09BF\u09B2","\u09AE\u09C7","\u099C\u09C1\u09A8","\u099C\u09C1\u09B2\u09BE\u0987","\u0986\u0997\u09B8\u09CD\u099F","\u09B8\u09C7\u09AA\u09CD\u099F\u09C7\u09AE\u09CD\u09AC\u09B0","\u0985\u0995\u09CD\u099F\u09CB\u09AC\u09B0","\u09A8\u09AD\u09C7\u09AE\u09CD\u09AC\u09B0","\u09A1\u09BF\u09B8\u09C7\u09AE\u09CD\u09AC\u09B0"]};
Fleur.locale["bs"] = {
	weekdays:["nedjelja","ponedjeljak","utorak","srijeda","\u010Detvrtak","petak","subota"],
	months: ["januar","februar","mart","april","maj","juni","juli","avgust","septembar","oktobar","novembar","decembar"]};
Fleur.locale["ca"] = {
	weekdays:["diumenge","dilluns","dimarts","dimecres","dijous","divendres","dissabte"],
	months: ["gener","febrer","mar\u00E7","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre"]};
Fleur.locale["cs"] = {
	weekdays:["ned\u011Ble","pond\u011Bl\u00ED","\u00FAter\u00FD","st\u0159eda","\u010Dtvrtek","p\u00E1tek","sobota"],
	months: ["leden","\u00FAnor","b\u0159ezen","duben","kv\u011Bten","\u010Derven","\u010Dervenec","srpen","z\u00E1\u0159\u00ED","\u0159\u00EDjen","listopad","prosinec"]};
Fleur.locale["da"] = {
	weekdays:["s\u00F8ndag","mandag","tirsdag","onsdag","torsdag","fredag","l\u00F8rdag"],
	months: ["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"]};
Fleur.locale["de"] = {
	weekdays:["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],
	months: ["Januar","Februar","M\u00E4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]};
Fleur.locale["el"] = {
	weekdays:["\u039A\u03C5\u03C1\u03B9\u03B1\u03BA\u03AE","\u0394\u03B5\u03C5\u03C4\u03AD\u03C1\u03B1","\u03A4\u03C1\u03AF\u03C4\u03B7","\u03A4\u03B5\u03C4\u03AC\u03C1\u03C4\u03B7","\u03A0\u03AD\u03BC\u03C0\u03C4\u03B7","\u03A0\u03B1\u03C1\u03B1\u03C3\u03BA\u03B5\u03C5\u03AE","\u03A3\u03AC\u03B2\u03B2\u03B1\u03C4\u03BF"],
	months: ["\u0399\u03B1\u03BD\u03BF\u03C5\u03B1\u03C1\u03AF\u03BF\u03C5","\u03A6\u03B5\u03B2\u03C1\u03BF\u03C5\u03B1\u03C1\u03AF\u03BF\u03C5","\u039C\u03B1\u03C1\u03C4\u03AF\u03BF\u03C5","\u0391\u03C0\u03C1\u03B9\u03BB\u03AF\u03BF\u03C5","\u039C\u03B1\u0390\u03BF\u03C5","\u0399\u03BF\u03C5\u03BD\u03AF\u03BF\u03C5","\u0399\u03BF\u03C5\u03BB\u03AF\u03BF\u03C5","\u0391\u03C5\u03B3\u03BF\u03CD\u03C3\u03C4\u03BF\u03C5","\u03A3\u03B5\u03C0\u03C4\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5","\u039F\u03BA\u03C4\u03C9\u03B2\u03C1\u03AF\u03BF\u03C5","\u039D\u03BF\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5","\u0394\u03B5\u03BA\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5"]};
Fleur.locale["es"] = {
	weekdays:["domingo","lunes","martes","mi\u00E9rcoles","jueves","viernes","s\u00E1bado"],
	months: ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]};
Fleur.locale["fa"] = {
	weekdays:["\u06CC\u06A9\u0634\u0646\u0628\u0647","\u062F\u0648\u0634\u0646\u0628\u0647","\u0633\u0647\u200C\u0634\u0646\u0628\u0647","\u0686\u0647\u0627\u0631\u0634\u0646\u0628\u0647","\u067E\u0646\u062C\u0634\u0646\u0628\u0647","\u062C\u0645\u0639\u0647","\u0634\u0646\u0628\u0647"],
	months: ["\u062F\u06CC","\u0628\u0647\u0645\u0646","\u0627\u0633\u0641\u0646\u062F","\u0641\u0631\u0648\u0631\u062F\u06CC\u0646","\u0627\u0631\u062F\u06CC\u0628\u0647\u0634\u062A","\u062E\u0631\u062F\u0627\u062F","\u062A\u06CC\u0631","\u0645\u0631\u062F\u0627\u062F","\u0634\u0647\u0631\u06CC\u0648\u0631","\u0645\u0647\u0631","\u0622\u0628\u0627\u0646","\u0622\u0630\u0631"]};
Fleur.locale["fi"] = {
	weekdays:["sunnuntai","maanantai","tiistai","keskiviikko","torstai","perjantai","lauantai"],
	months: ["tammikuu","helmikuu","maaliskuu","huhtikuu","toukokuu","kes\u00E4kuu","hein\u00E4kuu","elokuu","syyskuu","lokakuu","marraskuu","joulukuu"]};
Fleur.locale["fr"] = {
	weekdays:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],
	months: ["janvier","f\u00E9vrier","mars","avril","mai","juin","juillet","ao\u00FBt","septembre","octobre","novembre","d\u00E9cembre"]};
Fleur.locale["gu"] = {
	weekdays:["\u0AB0\u0AB5\u0ABF\u0AB5\u0ABE\u0AB0","\u0AB8\u0ACB\u0AAE\u0AB5\u0ABE\u0AB0","\u0AAE\u0A82\u0A97\u0AB3\u0AB5\u0ABE\u0AB0","\u0AAC\u0AC1\u0AA7\u0AB5\u0ABE\u0AB0","\u0A97\u0AC1\u0AB0\u0AC1\u0AB5\u0ABE\u0AB0","\u0AB6\u0AC1\u0A95\u0ACD\u0AB0\u0AB5\u0ABE\u0AB0","\u0AB6\u0AA8\u0ABF\u0AB5\u0ABE\u0AB0"],
	months: ["\u0A9C\u0ABE\u0AA8\u0ACD\u0AAF\u0AC1\u0A86\u0AB0\u0AC0","\u0AAB\u0AC7\u0AAC\u0ACD\u0AB0\u0AC1\u0A86\u0AB0\u0AC0","\u0AAE\u0ABE\u0AB0\u0ACD\u0A9A","\u0A8F\u0AAA\u0ACD\u0AB0\u0ABF\u0AB2","\u0AAE\u0AC7","\u0A9C\u0AC2\u0AA8","\u0A9C\u0AC1\u0AB2\u0ABE\u0A88","\u0A91\u0A97\u0AB8\u0ACD\u0A9F","\u0AB8\u0AAA\u0ACD\u0A9F\u0AC7\u0AAE\u0ACD\u0AAC\u0AB0","\u0A91\u0A95\u0ACD\u0A9F\u0ACB\u0AAC\u0AB0","\u0AA8\u0AB5\u0AC7\u0AAE\u0ACD\u0AAC\u0AB0","\u0AA1\u0ABF\u0AB8\u0AC7\u0AAE\u0ACD\u0AAC\u0AB0"]};
Fleur.locale["he"] = {
	weekdays:["\u05D9\u05D5\u05DD \u05E8\u05D0\u05E9\u05D5\u05DF","\u05D9\u05D5\u05DD \u05E9\u05E0\u05D9","\u05D9\u05D5\u05DD \u05E9\u05DC\u05D9\u05E9\u05D9","\u05D9\u05D5\u05DD \u05E8\u05D1\u05D9\u05E2\u05D9","\u05D9\u05D5\u05DD \u05D7\u05DE\u05D9\u05E9\u05D9","\u05D9\u05D5\u05DD \u05E9\u05D9\u05E9\u05D9","\u05D9\u05D5\u05DD \u05E9\u05D1\u05EA"],
	months: ["\u05D9\u05E0\u05D5\u05D0\u05E8","\u05E4\u05D1\u05E8\u05D5\u05D0\u05E8","\u05DE\u05E8\u05E5","\u05D0\u05E4\u05E8\u05D9\u05DC","\u05DE\u05D0\u05D9","\u05D9\u05D5\u05E0\u05D9","\u05D9\u05D5\u05DC\u05D9","\u05D0\u05D5\u05D2\u05D5\u05E1\u05D8","\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8","\u05D0\u05D5\u05E7\u05D8\u05D5\u05D1\u05E8","\u05E0\u05D5\u05D1\u05DE\u05D1\u05E8","\u05D3\u05E6\u05DE\u05D1\u05E8"]};
Fleur.locale["hi"] = {
	weekdays:["\u0930\u0935\u093F\u0935\u093E\u0930","\u0938\u094B\u092E\u0935\u093E\u0930","\u092E\u0902\u0917\u0932\u0935\u093E\u0930","\u092C\u0941\u0927\u0935\u093E\u0930","\u0917\u0941\u0930\u0941\u0935\u093E\u0930","\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930","\u0936\u0928\u093F\u0935\u093E\u0930"],
	months: ["\u091C\u0928\u0935\u0930\u0940","\u092B\u093C\u0930\u0935\u0930\u0940","\u092E\u093E\u0930\u094D\u091A","\u0905\u092A\u094D\u0930\u0948\u0932","\u092E\u0908","\u091C\u0942\u0928","\u091C\u0941\u0932\u093E\u0908","\u0905\u0917\u0938\u094D\u0924","\u0938\u093F\u0924\u0902\u092C\u0930","\u0905\u0915\u094D\u0924\u0942\u092C\u0930","\u0928\u0935\u0902\u092C\u0930","\u0926\u093F\u0938\u0902\u092C\u0930"]};
Fleur.locale["hr"] = {
	weekdays:["nedjelja","ponedjeljak","utorak","srijeda","\u010Detvrtak","petak","subota"],
	months: ["sije\u010Danj","velja\u010Da","o\u017Eujak","travanj","svibanj","lipanj","srpanj","kolovoz","rujan","listopad","studeni","prosinac"]};
Fleur.locale["hu"] = {
	weekdays:["vas\u00E1rnap","h\u00E9tf\u0151","kedd","szerda","cs\u00FCt\u00F6rt\u00F6k","p\u00E9ntek","szombat"],
	months: ["janu\u00E1r","febru\u00E1r","m\u00E1rcius","\u00E1prilis","m\u00E1jus","j\u00FAnius","j\u00FAlius","augusztus","szeptember","okt\u00F3ber","november","december"]};
Fleur.locale["is"] = {
	weekdays:["sunnudagur","m\u00E1nudagur","\u00FEri\u00F0judagur","mi\u00F0vikudagur","fimmtudagur","f\u00F6studagur","laugardagur"],
	months: ["jan\u00FAar","febr\u00FAar","mars","apr\u00EDl","ma\u00ED","j\u00FAn\u00ED","j\u00FAl\u00ED","\u00E1g\u00FAst","september","okt\u00F3ber","n\u00F3vember","desember"]};
Fleur.locale["it"] = {
	weekdays:["domenica","luned\u00EC","marted\u00EC","mercoled\u00EC","gioved\u00EC","venerd\u00EC","sabato"],
	months: ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"]};
Fleur.locale["ja"] = {
	weekdays:["\u65E5\u66DC\u65E5","\u6708\u66DC\u65E5","\u706B\u66DC\u65E5","\u6C34\u66DC\u65E5","\u6728\u66DC\u65E5","\u91D1\u66DC\u65E5","\u571F\u66DC\u65E5"],
	months: ["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708","7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"]};
Fleur.locale["kn"] = {
	weekdays:["\u0CAD\u0CBE\u0CA8\u0CC1\u0CB5\u0CBE\u0CB0","\u0CB8\u0CCB\u0CAE\u0CB5\u0CBE\u0CB0","\u0CAE\u0C82\u0C97\u0CB3\u0CB5\u0CBE\u0CB0","\u0CAC\u0CC1\u0CA7\u0CB5\u0CBE\u0CB0","\u0C97\u0CC1\u0CB0\u0CC1\u0CB5\u0CBE\u0CB0","\u0CB6\u0CC1\u0C95\u0CCD\u0CB0\u0CB5\u0CBE\u0CB0","\u0CB6\u0CA8\u0CBF\u0CB5\u0CBE\u0CB0"],
	months: ["\u0C9C\u0CA8\u0CB5\u0CB0\u0CBF","\u0CAB\u0CC6\u0CAC\u0CCD\u0CB0\u0CB5\u0CB0\u0CBF","\u0CAE\u0CBE\u0CB0\u0CCD\u0C9A\u0CCD","\u0C8F\u0CAA\u0CCD\u0CB0\u0CBF\u0CB2\u0CCD","\u0CAE\u0CC7","\u0C9C\u0CC2\u0CA8\u0CCD","\u0C9C\u0CC1\u0CB2\u0CC8","\u0C86\u0C97\u0CB8\u0CCD\u0C9F\u0CCD","\u0CB8\u0CC6\u0CAA\u0CCD\u0C9F\u0CC6\u0C82\u0CAC\u0CB0\u0CCD","\u0C85\u0C95\u0CCD\u0C9F\u0CCB\u0CAC\u0CB0\u0CCD","\u0CA8\u0CB5\u0CC6\u0C82\u0CAC\u0CB0\u0CCD","\u0CA1\u0CBF\u0CB8\u0CC6\u0C82\u0CAC\u0CB0\u0CCD"]};
Fleur.locale["ko"] = {
	weekdays:["\uC77C\uC694\uC77C","\uC6D4\uC694\uC77C","\uD654\uC694\uC77C","\uC218\uC694\uC77C","\uBAA9\uC694\uC77C","\uAE08\uC694\uC77C","\uD1A0\uC694\uC77C"],
	months: ["1\uC6D4","2\uC6D4","3\uC6D4","4\uC6D4","5\uC6D4","6\uC6D4","7\uC6D4","8\uC6D4","9\uC6D4","10\uC6D4","11\uC6D4","12\uC6D4"]};
Fleur.locale["lv"] = {
	weekdays:["Sv\u0113tdiena","Pirmdiena","Otrdiena","Tre\u0161diena","Ceturtdiena","Piektdiena","Sestdiena"],
	months: ["janv\u0101ris","febru\u0101ris","marts","apr\u012Blis","maijs","j\u016Bnijs","j\u016Blijs","augusts","septembris","oktobris","novembris","decembris"]};
Fleur.locale["ml"] = {
	weekdays:["\u0D1E\u0D3E\u0D2F\u0D31\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D24\u0D3F\u0D19\u0D4D\u0D15\u0D33\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D1A\u0D4A\u0D35\u0D4D\u0D35\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D2C\u0D41\u0D27\u0D28\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D35\u0D4D\u0D2F\u0D3E\u0D34\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D35\u0D46\u0D33\u0D4D\u0D33\u0D3F\u0D2F\u0D3E\u0D34\u0D4D\u200C\u0D1A","\u0D36\u0D28\u0D3F\u0D2F\u0D3E\u0D34\u0D4D\u200C\u0D1A"],
	months: ["\u0D1C\u0D28\u0D41\u0D35\u0D30\u0D3F","\u0D2B\u0D46\u0D2C\u0D4D\u0D30\u0D41\u0D35\u0D30\u0D3F","\u0D2E\u0D3E\u0D7C\u0D1A\u0D4D\u0D1A\u0D4D","\u0D0F\u0D2A\u0D4D\u0D30\u0D3F\u0D7D","\u0D2E\u0D47\u0D2F\u0D4D","\u0D1C\u0D42\u0D7A","\u0D1C\u0D42\u0D32\u0D48","\u0D13\u0D17\u0D38\u0D4D\u0D31\u0D4D\u0D31\u0D4D","\u0D38\u0D46\u0D2A\u0D4D\u0D31\u0D4D\u0D31\u0D02\u0D2C\u0D7C","\u0D12\u0D15\u0D4D\u200C\u0D1F\u0D4B\u0D2C\u0D7C","\u0D28\u0D35\u0D02\u0D2C\u0D7C","\u0D21\u0D3F\u0D38\u0D02\u0D2C\u0D7C"]};
Fleur.locale["mr"] = {
	weekdays:["\u0930\u0935\u093F\u0935\u093E\u0930","\u0938\u094B\u092E\u0935\u093E\u0930","\u092E\u0902\u0917\u0933\u0935\u093E\u0930","\u092C\u0941\u0927\u0935\u093E\u0930","\u0917\u0941\u0930\u0941\u0935\u093E\u0930","\u0936\u0941\u0915\u094D\u0930\u0935\u093E\u0930","\u0936\u0928\u093F\u0935\u093E\u0930"],
	months: ["\u091C\u093E\u0928\u0947\u0935\u093E\u0930\u0940","\u092B\u0947\u092C\u094D\u0930\u0941\u0935\u093E\u0930\u0940","\u092E\u093E\u0930\u094D\u091A","\u090F\u092A\u094D\u0930\u093F\u0932","\u092E\u0947","\u091C\u0942\u0928","\u091C\u0941\u0932\u0948","\u0911\u0917\u0938\u094D\u091F","\u0938\u092A\u094D\u091F\u0947\u0902\u092C\u0930","\u0911\u0915\u094D\u091F\u094B\u092C\u0930","\u0928\u094B\u0935\u094D\u0939\u0947\u0902\u092C\u0930","\u0921\u093F\u0938\u0947\u0902\u092C\u0930"]};
Fleur.locale["nb"] = {
	weekdays:["s\u00F8ndag","mandag","tirsdag","onsdag","torsdag","fredag","l\u00F8rdag"],
	months: ["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember"]};
Fleur.locale["nl"] = {
	weekdays:["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],
	months: ["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"]};
Fleur.locale["or"] = {
	weekdays:["\u0B30\u0B2C\u0B3F\u0B2C\u0B3E\u0B30","\u0B38\u0B4B\u0B2E\u0B2C\u0B3E\u0B30","\u0B2E\u0B19\u0B4D\u0B17\u0B33\u0B2C\u0B3E\u0B30","\u0B2C\u0B41\u0B27\u0B2C\u0B3E\u0B30","\u0B17\u0B41\u0B30\u0B41\u0B2C\u0B3E\u0B30","\u0B36\u0B41\u0B15\u0B4D\u0B30\u0B2C\u0B3E\u0B30","\u0B36\u0B28\u0B3F\u0B2C\u0B3E\u0B30"],
	months: ["\u0B1C\u0B3E\u0B28\u0B41\u0B06\u0B30\u0B40","\u0B2B\u0B47\u0B2C\u0B43\u0B06\u0B30\u0B40","\u0B2E\u0B3E\u0B30\u0B4D\u0B1A\u0B4D\u0B1A","\u0B05\u0B2A\u0B4D\u0B30\u0B47\u0B32","\u0B2E\u0B07","\u0B1C\u0B41\u0B28","\u0B1C\u0B41\u0B32\u0B3E\u0B07","\u0B05\u0B17\u0B37\u0B4D\u0B1F","\u0B38\u0B47\u0B2A\u0B4D\u0B1F\u0B47\u0B2E\u0B4D\u0B2C\u0B30","\u0B05\u0B15\u0B4D\u0B1F\u0B4B\u0B2C\u0B30","\u0B28\u0B2D\u0B47\u0B2E\u0B4D\u0B2C\u0B30","\u0B21\u0B3F\u0B38\u0B47\u0B2E\u0B4D\u0B2C\u0B30"]};
Fleur.locale["pa"] = {
	weekdays:["\u0A10\u0A24\u0A35\u0A3E\u0A30","\u0A38\u0A4B\u0A2E\u0A35\u0A3E\u0A30","\u0A2E\u0A70\u0A17\u0A32\u0A35\u0A3E\u0A30","\u0A2C\u0A41\u0A71\u0A27\u0A35\u0A3E\u0A30","\u0A35\u0A40\u0A30\u0A35\u0A3E\u0A30","\u0A38\u0A3C\u0A41\u0A71\u0A15\u0A30\u0A35\u0A3E\u0A30","\u0A38\u0A3C\u0A28\u0A3F\u0A71\u0A1A\u0A30\u0A35\u0A3E\u0A30"],
	months: ["\u0A1C\u0A28\u0A35\u0A30\u0A40","\u0A2B\u0A3C\u0A30\u0A35\u0A30\u0A40","\u0A2E\u0A3E\u0A30\u0A1A","\u0A05\u0A2A\u0A4D\u0A30\u0A48\u0A32","\u0A2E\u0A08","\u0A1C\u0A42\u0A28","\u0A1C\u0A41\u0A32\u0A3E\u0A08","\u0A05\u0A17\u0A38\u0A24","\u0A38\u0A24\u0A70\u0A2C\u0A30","\u0A05\u0A15\u0A24\u0A42\u0A2C\u0A30","\u0A28\u0A35\u0A70\u0A2C\u0A30","\u0A26\u0A38\u0A70\u0A2C\u0A30"]};
Fleur.locale["pl"] = {
	weekdays:["niedziela","poniedzia\u0142ek","wtorek","\u015Broda","czwartek","pi\u0105tek","sobota"],
	months: ["stycze\u0144","luty","marzec","kwiecie\u0144","maj","czerwiec","lipiec","sierpie\u0144","wrzesie\u0144","pa\u017Adziernik","listopad","grudzie\u0144"]};
Fleur.locale["pt"] = {
	weekdays:["domingo","segunda-feira","ter\u00E7a-feira","quarta-feira","quinta-feira","sexta-feira","s\u00E1bado"],
	months: ["janeiro","fevereiro","mar\u00E7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]};
Fleur.locale["ru"] = {
	weekdays:["\u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435","\u043F\u043E\u043D\u0435\u0434\u0435\u043B\u044C\u043D\u0438\u043A","\u0432\u0442\u043E\u0440\u043D\u0438\u043A","\u0441\u0440\u0435\u0434\u0430","\u0447\u0435\u0442\u0432\u0435\u0440\u0433","\u043F\u044F\u0442\u043D\u0438\u0446\u0430","\u0441\u0443\u0431\u0431\u043E\u0442\u0430"],
	months: ["\u044F\u043D\u0432\u0430\u0440\u044C","\u0444\u0435\u0432\u0440\u0430\u043B\u044C","\u043C\u0430\u0440\u0442","\u0430\u043F\u0440\u0435\u043B\u044C","\u043C\u0430\u0439","\u0438\u044E\u043D\u044C","\u0438\u044E\u043B\u044C","\u0430\u0432\u0433\u0443\u0441\u0442","\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C","\u043E\u043A\u0442\u044F\u0431\u0440\u044C","\u043D\u043E\u044F\u0431\u0440\u044C","\u0434\u0435\u043A\u0430\u0431\u0440\u044C"]};
Fleur.locale["si"] = {
	weekdays:["\u0D89\u0DBB\u0DD2\u0DAF\u0DCF","\u0DC3\u0DB3\u0DD4\u0DAF\u0DCF","\u0D85\u0D9F\u0DC4\u0DBB\u0DD4\u0DC0\u0DCF\u0DAF\u0DCF","\u0DB6\u0DAF\u0DCF\u0DAF\u0DCF","\u0DB6\u0DCA\u200D\u0DBB\u0DC4\u0DC3\u0DCA\u0DB4\u0DAD\u0DD2\u0DB1\u0DCA\u0DAF\u0DCF","\u0DC3\u0DD2\u0D9A\u0DD4\u0DBB\u0DCF\u0DAF\u0DCF","\u0DC3\u0DD9\u0DB1\u0DC3\u0DD4\u0DBB\u0DCF\u0DAF\u0DCF"],
	months: ["\u0DA2\u0DB1\u0DC0\u0DCF\u0DBB\u0DD2","\u0DB4\u0DD9\u0DB6\u0DBB\u0DC0\u0DCF\u0DBB\u0DD2","\u0DB8\u0DCF\u0DBB\u0DCA\u0DAD\u0DD4","\u0D85\u0DB4\u0DCA\u200D\u0DBB\u0DDA\u0DBD\u0DCA","\u0DB8\u0DD0\u0DBA\u0DD2","\u0DA2\u0DD6\u0DB1\u0DD2","\u0DA2\u0DD6\u0DBD\u0DD2","\u0D85\u0D9C\u0DDD\u0DC3\u0DCA\u0DAD\u0DD4","\u0DC3\u0DD0\u0DB4\u0DCA\u0DAD\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA","\u0D94\u0D9A\u0DCA\u0DAD\u0DDD\u0DB6\u0DBB\u0DCA","\u0DB1\u0DDC\u0DC0\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA","\u0DAF\u0DD9\u0DC3\u0DD0\u0DB8\u0DCA\u0DB6\u0DBB\u0DCA"]};Fleur.locale["sk-SK"] = {
	weekdays:["nede\u013Ea","pondelok","utorok","streda","\u0161tvrtok","piatok","sobota"],
	months: ["janu\u00E1r","febru\u00E1r","marec","apr\u00EDl","m\u00E1j","j\u00FAn","j\u00FAl","august","september","okt\u00F3ber","november","december"]};
Fleur.locale["sr-Cyrl-RS"] = {
	weekdays:["\u043D\u0435\u0434\u0435\u0459\u0430","\u043F\u043E\u043D\u0435\u0434\u0435\u0459\u0430\u043A","\u0443\u0442\u043E\u0440\u0430\u043A","\u0441\u0440\u0435\u0434\u0430","\u0447\u0435\u0442\u0432\u0440\u0442\u0430\u043A","\u043F\u0435\u0442\u0430\u043A","\u0441\u0443\u0431\u043E\u0442\u0430"],
	months: ["\u0458\u0430\u043D\u0443\u0430\u0440","\u0444\u0435\u0431\u0440\u0443\u0430\u0440","\u043C\u0430\u0440\u0442","\u0430\u043F\u0440\u0438\u043B","\u043C\u0430\u0458","\u0458\u0443\u043D","\u0458\u0443\u043B","\u0430\u0432\u0433\u0443\u0441\u0442","\u0441\u0435\u043F\u0442\u0435\u043C\u0431\u0430\u0440","\u043E\u043A\u0442\u043E\u0431\u0430\u0440","\u043D\u043E\u0432\u0435\u043C\u0431\u0430\u0440","\u0434\u0435\u0446\u0435\u043C\u0431\u0430\u0440"]};
Fleur.locale["sr-Latn-RS"] = {
	weekdays:["nedelja","ponedeljak","utorak","sreda","\u010Detvrtak","petak","subota"],
	months: ["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar"]};
Fleur.locale["sv"] = {
	weekdays:["s\u00F6ndag","m\u00E5ndag","tisdag","onsdag","torsdag","fredag","l\u00F6rdag"],
	months: ["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december"]};
Fleur.locale["ta"] = {
	weekdays:["\u0B9E\u0BBE\u0BAF\u0BBF\u0BB1\u0BC1","\u0BA4\u0BBF\u0B99\u0BCD\u0B95\u0BB3\u0BCD","\u0B9A\u0BC6\u0BB5\u0BCD\u0BB5\u0BBE\u0BAF\u0BCD","\u0BAA\u0BC1\u0BA4\u0BA9\u0BCD","\u0BB5\u0BBF\u0BAF\u0BBE\u0BB4\u0BA9\u0BCD","\u0BB5\u0BC6\u0BB3\u0BCD\u0BB3\u0BBF","\u0B9A\u0BA9\u0BBF"],
	months: ["\u0B9C\u0BA9\u0BB5\u0BB0\u0BBF","\u0BAA\u0BBF\u0BAA\u0BCD\u0BB0\u0BB5\u0BB0\u0BBF","\u0BAE\u0BBE\u0BB0\u0BCD\u0B9A\u0BCD","\u0B8F\u0BAA\u0BCD\u0BB0\u0BB2\u0BCD","\u0BAE\u0BC7","\u0B9C\u0BC2\u0BA9\u0BCD","\u0B9C\u0BC2\u0BB2\u0BC8","\u0B86\u0B95\u0BB8\u0BCD\u0B9F\u0BCD","\u0B9A\u0BC6\u0BAA\u0BCD\u0B9F\u0BAE\u0BCD\u0BAA\u0BB0\u0BCD","\u0B85\u0B95\u0BCD\u0B9F\u0BCB\u0BAA\u0BB0\u0BCD","\u0BA8\u0BB5\u0BAE\u0BCD\u0BAA\u0BB0\u0BCD","\u0B9F\u0BBF\u0B9A\u0BAE\u0BCD\u0BAA\u0BB0\u0BCD"]};
Fleur.locale["te"] = {
	weekdays:["\u0C06\u0C26\u0C3F\u0C35\u0C3E\u0C30\u0C02","\u0C38\u0C4B\u0C2E\u0C35\u0C3E\u0C30\u0C02","\u0C2E\u0C02\u0C17\u0C33\u0C35\u0C3E\u0C30\u0C02","\u0C2C\u0C41\u0C27\u0C35\u0C3E\u0C30\u0C02","\u0C17\u0C41\u0C30\u0C41\u0C35\u0C3E\u0C30\u0C02","\u0C36\u0C41\u0C15\u0C4D\u0C30\u0C35\u0C3E\u0C30\u0C02","\u0C36\u0C28\u0C3F\u0C35\u0C3E\u0C30\u0C02"],
	months: ["\u0C1C\u0C28\u0C35\u0C30\u0C3F","\u0C2B\u0C3F\u0C2C\u0C4D\u0C30\u0C35\u0C30\u0C3F","\u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C3F","\u0C0F\u0C2A\u0C4D\u0C30\u0C3F\u0C32\u0C4D","\u0C2E\u0C47","\u0C1C\u0C42\u0C28\u0C4D","\u0C1C\u0C41\u0C32\u0C48","\u0C06\u0C17\u0C38\u0C4D\u0C1F\u0C41","\u0C38\u0C46\u0C2A\u0C4D\u0C1F\u0C46\u0C02\u0C2C\u0C30\u0C4D","\u0C05\u0C15\u0C4D\u0C1F\u0C4B\u0C2C\u0C30\u0C4D","\u0C28\u0C35\u0C02\u0C2C\u0C30\u0C4D","\u0C21\u0C3F\u0C38\u0C46\u0C02\u0C2C\u0C30\u0C4D"]};
Fleur.locale["th"] = {
	weekdays:["\u0E27\u0E31\u0E19\u0E2D\u0E32\u0E17\u0E34\u0E15\u0E22\u0E4C","\u0E27\u0E31\u0E19\u0E08\u0E31\u0E19\u0E17\u0E23\u0E4C","\u0E27\u0E31\u0E19\u0E2D\u0E31\u0E07\u0E04\u0E32\u0E23","\u0E27\u0E31\u0E19\u0E1E\u0E38\u0E18","\u0E27\u0E31\u0E19\u0E1E\u0E24\u0E2B\u0E31\u0E2A\u0E1A\u0E14\u0E35","\u0E27\u0E31\u0E19\u0E28\u0E38\u0E01\u0E23\u0E4C","\u0E27\u0E31\u0E19\u0E40\u0E2A\u0E32\u0E23\u0E4C"],
	months: ["\u0E21\u0E01\u0E23\u0E32\u0E04\u0E21","\u0E01\u0E38\u0E21\u0E20\u0E32\u0E1E\u0E31\u0E19\u0E18\u0E4C","\u0E21\u0E35\u0E19\u0E32\u0E04\u0E21","\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19","\u0E1E\u0E24\u0E29\u0E20\u0E32\u0E04\u0E21","\u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19","\u0E01\u0E23\u0E01\u0E0E\u0E32\u0E04\u0E21","\u0E2A\u0E34\u0E07\u0E2B\u0E32\u0E04\u0E21","\u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19","\u0E15\u0E38\u0E25\u0E32\u0E04\u0E21","\u0E1E\u0E24\u0E28\u0E08\u0E34\u0E01\u0E32\u0E22\u0E19","\u0E18\u0E31\u0E19\u0E27\u0E32\u0E04\u0E21"]};
Fleur.locale["uk"] = {
	weekdays:["\u043D\u0435\u0434\u0456\u043B\u044F","\u043F\u043E\u043D\u0435\u0434\u0456\u043B\u043E\u043A","\u0432\u0456\u0432\u0442\u043E\u0440\u043E\u043A","\u0441\u0435\u0440\u0435\u0434\u0430","\u0447\u0435\u0442\u0432\u0435\u0440","\u043F\u02BC\u044F\u0442\u043D\u0438\u0446\u044F","\u0441\u0443\u0431\u043E\u0442\u0430"],
	months: ["\u0441\u0456\u0447\u0435\u043D\u044C","\u043B\u044E\u0442\u0438\u0439","\u0431\u0435\u0440\u0435\u0437\u0435\u043D\u044C","\u043A\u0432\u0456\u0442\u0435\u043D\u044C","\u0442\u0440\u0430\u0432\u0435\u043D\u044C","\u0447\u0435\u0440\u0432\u0435\u043D\u044C","\u043B\u0438\u043F\u0435\u043D\u044C","\u0441\u0435\u0440\u043F\u0435\u043D\u044C","\u0432\u0435\u0440\u0435\u0441\u0435\u043D\u044C","\u0436\u043E\u0432\u0442\u0435\u043D\u044C","\u043B\u0438\u0441\u0442\u043E\u043F\u0430\u0434","\u0433\u0440\u0443\u0434\u0435\u043D\u044C"]};
Fleur.locale["zh-CN"] = {
	weekdays:["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"],
	months: ["\u4E00\u6708","\u4E8C\u6708","\u4E09\u6708","\u56DB\u6708","\u4E94\u6708","\u516D\u6708","\u4E03\u6708","\u516B\u6708","\u4E5D\u6708","\u5341\u6708","\u5341\u4E00\u6708","\u5341\u4E8C\u6708"]};
Fleur.locale["zh-TW"] = {
	weekdays:["\u661F\u671F\u65E5","\u661F\u671F\u4E00","\u661F\u671F\u4E8C","\u661F\u671F\u4E09","\u661F\u671F\u56DB","\u661F\u671F\u4E94","\u661F\u671F\u516D"],
	months: ["1\u6708","2\u6708","3\u6708","4\u6708","5\u6708","6\u6708","7\u6708","8\u6708","9\u6708","10\u6708","11\u6708","12\u6708"]};
Fleur.pad = function(number) {
	if (number < 10) {
		return '0' + String(number);
	}
 	return String(number);
};
Fleur.dateToDate = function(dtz) {
	return String(dtz.d.getFullYear()) + '-' + Fleur.pad(dtz.d.getMonth() + 1) + '-' + Fleur.pad(dtz.d.getDate()) + (dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "-" : "+") + Fleur.pad(Math.floor(Math.abs(dtz.tz) / 60)) + ":" + Fleur.pad(Math.abs(dtz.tz) % 60) : "");
};
Fleur.dateToDateTime = function(dtz) {
	return String(dtz.d.getFullYear()) + '-' + Fleur.pad(dtz.d.getMonth() + 1) + '-' + Fleur.pad(dtz.d.getDate()) + 'T' + Fleur.pad(dtz.d.getHours()) + ':' + Fleur.pad(dtz.d.getMinutes()) + ':' + Fleur.pad(dtz.d.getSeconds()) + (dtz.d.getMilliseconds() !== 0 ? '.' + (dtz.d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) : "") + (dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "-" : "+") + Fleur.pad(Math.floor(Math.abs(dtz.tz) / 60)) + ":" + Fleur.pad(Math.abs(dtz.tz) % 60) : "");
};
Fleur.dateToTime = function(dtz) {
	return Fleur.pad(dtz.d.getHours()) + ':' + Fleur.pad(dtz.d.getMinutes()) + ':' + Fleur.pad(dtz.d.getSeconds()) + (dtz.d.getMilliseconds() !== 0 ? '.' + (dtz.d.getMilliseconds() / 1000).toFixed(3).slice(2, 5) : "") + (dtz.tz !== null ? dtz.tz === 0 ? "Z" : (dtz.tz < 0 ? "-" : "+") + Fleur.pad(Math.floor(Math.abs(dtz.tz) / 60)) + ":" + Fleur.pad(Math.abs(dtz.tz) % 60) : "");
};
Fleur.toDate = function(s) {
	return {
		d: new Date(parseInt(s.substr(0, 4), 10), parseInt(s.substr(5, 2), 10) - 1, parseInt(s.substr(8, 2), 10)),
		tz: s.endsWith("Z") ? 0 :
			s.substr(s.length - 6, 1) === "+" ? parseInt(s.substr(s.length - 5, 2), 10) * 60 + parseInt(s.substr(s.length - 2, 2), 10) :
			s.substr(s.length - 6, 1) === "-" && s.substr(s.length - 3, 1) === ":"? -parseInt(s.substr(s.length - 5, 2), 10) * 60 - parseInt(s.substr(s.length - 2, 2), 10) :
			null
	};
};
Fleur.toDateTime = function(s) {
	return {
		d: new Date(parseInt(s.substr(0, 4), 10), parseInt(s.substr(5, 2), 10) - 1, parseInt(s.substr(8, 2), 10), parseInt(s.substr(11, 2), 10), parseInt(s.substr(14, 2), 10), parseInt(s.substr(17, 2), 10), s.charAt(19) === "." ? parseFloat("0." + s.substr(20).replace(/\+\-Z/, "Z").split("Z")[0]) * 1000 : 0),
		tz: s.endsWith("Z") ? 0 :
			s.substr(s.length - 6, 1) === "+" ? parseInt(s.substr(s.length - 5, 2), 10) * 60 + parseInt(s.substr(s.length - 2, 2), 10) :
			s.substr(s.length - 6, 1) === "-" && s.substr(s.length - 3, 1) === ":"? -parseInt(s.substr(s.length - 5, 2), 10) * 60 - parseInt(s.substr(s.length - 2, 2), 10) :
			null
	};
};
Fleur.toTime = function(s) {
	var d = new Date();
	var tpos = s.indexOf("T") + 1;
	d.setHours(parseInt(s.substr(tpos, 2), 10));
	d.setMinutes(parseInt(s.substr(tpos + 3, 2), 10));
	d.setSeconds(parseInt(s.substr(tpos + 6, 2), 10));
	d.setMilliseconds(s.charAt(tpos + 8) === "." ? parseFloat("0." + s.substr(tpos + 9).replace(/\+\-Z/, "Z").split("Z")[0]) * 1000 : 0);
	return {
		d: d,
		tz: s.endsWith("Z") ? 0 :
			s.substr(s.length - 6, 1) === "+" ? parseInt(s.substr(s.length - 5, 2), 10) * 60 + parseInt(s.substr(s.length - 2, 2), 10) :
			s.substr(s.length - 6, 1) === "-" && s.substr(s.length - 3, 1) === ":"? -parseInt(s.substr(s.length - 5, 2), 10) * 60 - parseInt(s.substr(s.length - 2, 2), 10) :
			null
	};
};
Fleur.toJSONDate = function(s) {
	return {
		year: parseInt(s.substr(0, 4), 10),
		month: parseInt(s.substr(5, 2), 10),
		day: parseInt(s.substr(8, 2), 10)
	};
};
Fleur.toJSONDateTime = function(s) {
	return {
		year: parseInt(s.substr(0, 4), 10),
		month: parseInt(s.substr(5, 2), 10),
		day: parseInt(s.substr(8, 2), 10),
		hour: parseInt(s.substr(11, 2), 10),
		minute: parseInt(s.substr(14, 2), 10),
		second: parseFloat(s.substr(17).replace(/\+\-Z/, "Z").split("Z")[0])
	};	
};
Fleur.toJSONTime = function(s) {
	return {
		hour: parseInt(s.substr(0, 2), 10),
		minute: parseInt(s.substr(3, 2), 10),
		second: parseFloat(s.substr(5).replace(/\+\-Z/, "Z").split("Z")[0])
	};	
};
Fleur.toJSONYearMonthDuration = function(s) {
	var m = s.match(/^-?P(?!$)(([0-9]+)Y)?(([0-9]+)M)?$/);
	var retvalue = (m[2] ? parseInt(m[2], 10) : 0) * 12 +(m[4] ? parseInt(m[4], 10) : 0);
	return {
		sign: s.startsWith("-") && retvalue !== 0 ? -1 : 1,
		year: Math.floor(retvalue / 12),
		month: retvalue % 12
	};
};
Fleur.toJSONDayTimeDuration = function(s) {
	var m = s.match(/^-?P(?!$)(([0-9]+)D)?(T(?!$)(([0-9]+)H)?(([0-9]+)M)?(([0-9]+(\.[0-9]+)?)S)?)?$/);
	var retvalue = (((m[2] ? parseInt(m[2], 10) : 0) * 24 + (m[5] ? parseInt(m[5], 10) : 0)) * 60 + (m[7] ? parseInt(m[7], 10) : 0)) * 60 + (m[9] ? parseFloat(m[9]) : 0);
	var ret = {sign: s.startsWith("-") && retvalue !== 0 ? -1 : 1};
	ret.day = Math.floor(retvalue / 86400);
	retvalue = retvalue % 86400;
	ret.hour = Math.floor(retvalue / 3600);
	retvalue = retvalue % 3600;
	ret.minute = Math.floor(retvalue / 60);
	ret.second = retvalue % 60;
	return ret;
};
Fleur.toJSONDuration= function(s) {
	var m = s.match(/^-?P(?!$)(([0-9]+)Y)?(([0-9]+)M)?(([0-9]+)D)?(T(?!$)(([0-9]+)H)?(([0-9]+)M)?(([0-9]+(\.[0-9]+)?)S)?)?$/);
	var retvalue = (m[2] ? parseInt(m[2], 10) : 0) * 12 +(m[4] ? parseInt(m[4], 10) : 0);
	var ret = {
		sign: s.startsWith("-") && retvalue !== 0 ? -1 : 1,
		year: Math.floor(retvalue / 12),
		month: retvalue % 12
	};
	retvalue = (((m[6] ? parseInt(m[6], 10) : 0) * 24 + (m[9] ? parseInt(m[9], 10) : 0)) * 60 + (m[11] ? parseInt(m[11], 10) : 0)) * 60 + (m[13] ? parseFloat(m[13]) : 0);
	ret.day = Math.floor(retvalue / 86400);
	retvalue = retvalue % 86400;
	ret.hour = Math.floor(retvalue / 3600);
	retvalue = retvalue % 3600;
	ret.minute = Math.floor(retvalue / 60);
	ret.second = retvalue % 60;
	return ret;
};
Fleur.NumberToDecimalString = function(n, precision) {
	var s = String(n);
	if (s.indexOf("e") !== -1) {
		s = s.split("e");
		var exp = parseInt(s[1], 10);
		s = s[0].split(".");
		s[1] = s[1] || "";
		if (exp >= 0) {
			if (exp < s[1].length) {
				return s[0] + s[1].substr(0, s[1].length - exp) + "." + s[1].substr(s[1].length - exp);
			}
			return s[0] + s[1] + "0".repeat(exp - s[1].length);
		}
		return "0." + "0".repeat(-1 - exp) + s[0] + s[1];
	}
	if (typeof n !== "number") {
		return s;
	}
	if (precision) {
		return String(Math.round(n * Math.pow(10, precision)) / Math.pow(10, precision));
	}
	return s;
};
Fleur.JSTypes = [Fleur.Type_integer, Fleur.Type_decimal, Fleur.Type_float, Fleur.Type_double, Fleur.Type_string, Fleur.Type_boolean, Fleur.Type_date, Fleur.Type_dateTime, Fleur.Type_time, Fleur.Type_yearMonthDuration, Fleur.Type_dayTimeDuration];
Fleur.toJSValue = function(a, asNumber, asString, asBoolean, asDate, asJSONDate, asJSONDuration, asOthers) {
	var value;
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		if (asNumber && /^\s*(([\-+]?([0-9]+(\.[0-9]*)?)|[\-+]?(\.[0-9]+))([eE][\-+]?[0-9]+)?|[\-+]?INF|NaN)\s*$/.test(a.data)) {
			if (a.schemaTypeInfo === Fleur.Type_integer) {
				return [0, Fleur.BigInt(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
				return [1, a.data.indexOf(".") === -1 ? Fleur.BigInt(a.data) : parseFloat(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_float) {
				return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_double || (a.schemaTypeInfo === Fleur.Type_untypedAtomic && (a.data === "INF" || a.data === "-INF" || !isNaN(parseFloat(a.data))))) {
				return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [0, Fleur.BigInt(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [1, parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
			}
		}
		if (asString) {
			if (a === Fleur.EmptySequence) {
				return [4];
			}
			if (!a.schemaTypeInfo || a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return [4, a.data];
			} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [4, a.data];
			}
		}
		if (asBoolean) {
			if (a.schemaTypeInfo === Fleur.Type_boolean) {
				return [5, a.data === "true"];
			} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
				return [5, a.data.length !== 0];
			} else if (a.schemaTypeInfo === Fleur.Type_integer) {
				value = parseInt(a.data, 10);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
				value = parseFloat(a.data);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [5, a.data === "true"];
			} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
				return [5, a.data.length !== 0];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				value = parseInt(a.data, 10);
				return [5, !isNaN(value) && value !== 0];
			} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
				value = parseFloat(a.data);
				return [5, !isNaN(value) && value !== 0];
			}
		}
		if (asDate || asJSONDate) {
			if (a.schemaTypeInfo === Fleur.Type_date) {
				return [6, asDate ? Fleur.toDate(a.data) : Fleur.toJSONDate(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_dateTime) {
				return [7, asDate ? Fleur.toDateTime(a.data) : Fleur.toJSONDateTime(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_time) {
				return [8, asDate ? Fleur.toTime(a.data) : Fleur.toJSONTime(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "date", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [6, asDate ? Fleur.toDate(a.data) : Fleur.toJSONDate(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dateTime", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [7, asDate ? Fleur.toDateTime(a.data) : Fleur.toJSONDateTime(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "time", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [8, asDate ? Fleur.toTime(a.data) : Fleur.toJSONTime(a.data)];
			}
		}
		if (asJSONDuration) {
			if (a.schemaTypeInfo === Fleur.Type_yearMonthDuration) {
				return [9, Fleur.toJSONYearMonthDuration(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_dayTimeDuration) {
				return [10, Fleur.toJSONDayTimeDuration(a.data)];
			} else if (a.schemaTypeInfo === Fleur.Type_duration) {
				return [11, Fleur.toJSONDuration(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "yearMonthDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [9, Fleur.toJSONYearMonthDuration(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dayTimeDuration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [10, Fleur.toJSONDayTimeDuration(a.data)];
			} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "duration", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
				return [11, Fleur.toJSONDuration(a.data)];
			}
		}
		if (asOthers) {
			return [99, a.data];
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		if (asBoolean) {
			return [0, a.childNodes.length !== 0];
		}
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSNumber = function(a, ignore) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		if (a.schemaTypeInfo === Fleur.Type_integer) {
			return [0, Fleur.BigInt(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_decimal) {
			return [1, a.data.indexOf(".") === -1 ? Fleur.BigInt(a.data) : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_float) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_double || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, Fleur.BigInt(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [3, a.data === "INF" ? Number.POSITIVE_INFINITY : a.data === "-INF" ? Number.NEGATIVE_INFINITY : parseFloat(a.data)];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		if (!ignore) {
			a.schemaTypeInfo = Fleur.Type_error;
			a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		}
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSDate = function(a, convert) {
	if (a.nodeType === Fleur.Node.TEXT_NODE) {
		var v;
		if (convert) {
			v = new Date(parseInt(a.data.substr(0, 4), 10), parseInt(a.data.substr(5, 2), 10) - 1, parseInt(a.data.substr(8, 2), 10));
		} else {
			v = a.data;
		}
		if (a.schemaTypeInfo === Fleur.Type_date) {
			return [0, v];
		} else if (a.schemaTypeInfo === Fleur.Type_dateTime) {
			return [1, v];
		} else if (a.schemaTypeInfo === Fleur.Type_time) {
			return [2, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "date", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [0, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "dateTime", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [1, v];
		} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "time", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
			return [2, v];
		} else if (a.schemaTypeInfo === Fleur.Type_error) {
			return [-1];
		}
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
		return [-1];
	} else if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		a.nodeType = Fleur.Node.TEXT_NODE;
		a.schemaTypeInfo = Fleur.Type_error;
		a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPST0005");
		return [-1];
	}
	a = new Fleur.Text();
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSString = function(a) {
	if (a === Fleur.EmptySequence) {
		return [0];
	}
	if (!a.schemaTypeInfo || a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data];
	} else if (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSBoolean = function(a) {
	var value;
	if (a.nodeType === Fleur.Node.SEQUENCE_NODE) {
		return [0, a.childNodes.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_boolean) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo === Fleur.Type_string || a.schemaTypeInfo === Fleur.Type_anyURI || a.schemaTypeInfo === Fleur.Type_untypedAtomic) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo === Fleur.Type_integer) {
		value = Fleur.BigInt(a.data);
		return [0, !isNaN(value) && value !== Fleur.BigInt(0)];
	} else if (a.schemaTypeInfo === Fleur.Type_decimal || a.schemaTypeInfo === Fleur.Type_float || a.schemaTypeInfo === Fleur.Type_double) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "boolean", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		return [0, a.data === "true"];
	} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "string", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "anyURI", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "untypedAtomic", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
		return [0, a.data.length !== 0];
	} else if (a.schemaTypeInfo && a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "integer", Fleur.TypeInfo.DERIVATION_RESTRICTION)) {
		value = Fleur.BigInt(a.data);
		return [0, !isNaN(value) && Fleur.BigInt(0)];
	} else if (a.schemaTypeInfo && (a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "decimal", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "float", Fleur.TypeInfo.DERIVATION_RESTRICTION) || a.schemaTypeInfo.isDerivedFrom("http://www.w3.org/2001/XMLSchema", "double", Fleur.TypeInfo.DERIVATION_RESTRICTION))) {
		value = parseFloat(a.data);
		return [0, !isNaN(value) && value !== 0];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toJSObject = function(a) {
	if (a.nodeType === Fleur.Node.MAP_NODE) {
		var o = {};
		var i = 0;
		var l = a.entries.length;
		while (i < l) {
			o[a.entries[i].nodeName] = a.entries[i].textContent;
			i++;
		}
		return [0, o];
	}
	a.nodeType = Fleur.Node.TEXT_NODE;
	a.schemaTypeInfo = Fleur.Type_error;
	a._setNodeNameLocalNamePrefix("http://www.w3.org/2005/xqt-errors", "err:XPTY0004");
	return [-1];
};
Fleur.toContentType = function(o, def) {
	var s;
	if (o["media-type"]) {
		s = o["media-type"];
	} else {
		switch (o.method) {
			case "html":
				s = "text/html";
				break;
			case "xml":
				s = "application/xml";
				break;
			case "json":
				s = "application/json";
				break;
			default:
				s = def;
		}
	}
	if (s) {
		if (o.encoding) {
			s += "; charset=\"" + o.encoding + "\"";
		}
		for (var p in o) {
			if (o.hasOwnProperty(p) && p !== "media-type" && p !== "encoding") {
				s += "; " + p + "=" + encodeURIComponent(o[p]);
			}
		}
	}
	return s;
};
Fleur.msToDayTimeDuration = function(ms) {
	var s = ms < 0 ? "-P" : "P";
    ms = ms / 1000;
    ms = Math.abs(Math.floor(ms));
    var days = Math.floor(ms / (24 * 60 * 60));
    var sec = ms - days * 24 * 60 * 60;
    var hours = Math.floor(sec / (60 * 60));
    sec = sec - hours * 60 * 60;
    var min = Math.floor(sec / 60);
    sec = sec - min * 60;
    if (sec === 0 && min === 0 && hours === 0 && days === 0) {
    	return "PT0S";
    }
    if (days !== 0) {
    	s += String(days) + "D";
    }
    if (hours !== 0 || min !== 0 || sec !== 0) {
    	s += "T";
    }
    if (hours !== 0) {
    	s += String(hours) + "H";
    }
    if (min !== 0) {
    	s += String(min) + "M";
    }
    if (sec !== 0) {
    	s += String(sec) + "S";
    }
    return s;
};
Fleur.getMonthName = function(language, d) {
	if (Fleur.inBrowser) {
		return d.toLocaleString(language, {month: "long"});
	}
	var month = d.getMonth();
	if (!Fleur.locale[language]) {
		language = language.split("-")[0];
		if (!Fleur.locale[language]) {
			language = 'en';
		}
	}
	return Fleur.locale[language].months[month];
};
Fleur.getDayName = function(language, d) {
	if (Fleur.inBrowser) {
		return d.toLocaleString(language, {weekday: "long"});
	}
	var day = d.getDay();
	if (!Fleur.locale[language]) {
		language = language.split("-")[0];
		if (!Fleur.locale[language]) {
			language = 'en';
		}
	}
	return Fleur.locale[language].weekdays[day];
};
Fleur.XsltEngine = Fleur.XQueryEngine.slice(0);
Fleur.XsltX = {};
Fleur.XsltX._pattern2xpath = function(xqueryx) {
	var i, step, newaxis, t;
	switch (xqueryx[0]) {
		case Fleur.XQueryX.pathExpr:
			i = xqueryx[1].length - 1;
			newaxis = "self";
			t = [];
			while (i >= 0) {
				step = xqueryx[1][i];
				switch (step[0]) {
					case Fleur.XQueryX.rootExpr:
						t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], [Fleur.XQueryX.documentTest, []]]]);
						break;
					case Fleur.XQueryX.stepExpr:
						if (step[1][0][0] === Fleur.XQueryX.xpathAxis &&
						    step[1][0][1][0] === "descendant-or-self" &&
							step[1][1][0] === Fleur.XQueryX.anyKindTest) {
							newaxis = "ancestor";
						} else {
							t.push([Fleur.XQueryX.stepExpr, [[Fleur.XQueryX.xpathAxis, [newaxis]], step[1][1]]]);
							newaxis = "parent";
						}
						break;
				}
				i--;
			}
			xqueryx[1] = t;
			break;
		case Fleur.XQueryX.unionOp:
			Fleur.XsltX._pattern2xpath(xqueryx[1][0][1][0]);
			Fleur.XsltX._pattern2xpath(xqueryx[1][1][1][0]);
			break;
	}
};
Fleur.XsltXNames = [["http://www.w3.org/2005/XQueryX", "http://www.w3.org/2000/xmlns/", "http://www.w3.org/2001/XMLSchema-instance", "http://www.w3.org/1999/XSL/Transform", "http://www.w3.org/1999/XSL/Transform/expression", "http://www.w3.org/1999/XSL/Transform/avt", "http://www.w3.org/1999/XSL/Transform/pattern"], Fleur.XQueryXNames[1]];
Fleur.XsltXNames[1][Fleur.XsltX.accept = Fleur.Xlength++] = [1, 3, "xsl:accept"];
Fleur.XsltXNames[1][Fleur.XsltX.accumulator = Fleur.Xlength++] = [1, 3, "xsl:accumulator"];
Fleur.XsltXNames[1][Fleur.XsltX.assert = Fleur.Xlength++] = [1, 3, "xsl:assert"];
Fleur.XsltXNames[1][Fleur.XsltX.attribute = Fleur.Xlength++] = [1, 3, "xsl:attribute"];
Fleur.XsltXNames[1][Fleur.XsltX["break"] = Fleur.Xlength++] = [1, 3, "xsl:break"];
Fleur.XsltXNames[1][Fleur.XsltX["catch"] = Fleur.Xlength++] = [1, 3, "xsl:catch"];
Fleur.XsltXNames[1][Fleur.XsltX.choose = Fleur.Xlength++] = [1, 3, "xsl:choose"];
Fleur.XsltXNames[1][Fleur.XsltX.comment = Fleur.Xlength++] = [1, 3, "xsl:comment"];
Fleur.XsltXNames[1][Fleur.XsltX.copy = Fleur.Xlength++] = [1, 3, "xsl:copy"];
Fleur.XsltXNames[1][Fleur.XsltX.document = Fleur.Xlength++] = [1, 3, "xsl:document"];
Fleur.XsltXNames[1][Fleur.XsltX.element = Fleur.Xlength++] = [1, 3, "xsl:element"];
Fleur.XsltXNames[1][Fleur.XsltX.evaluate = Fleur.Xlength++] = [1, 3, "xsl:evaluate"];
Fleur.XsltXNames[1][Fleur.XsltX.expose = Fleur.Xlength++] = [1, 3, "xsl:expose"];
Fleur.XsltXNames[1][Fleur.XsltX.fallback = Fleur.Xlength++] = [1, 3, "xsl:fallback"];
Fleur.XsltXNames[1][Fleur.XsltX.fork = Fleur.Xlength++] = [1, 3, "xsl:fork"];
Fleur.XsltXNames[1][Fleur.XsltX["function"] = Fleur.Xlength++] = [1, 3, "xsl:function"];
Fleur.XsltXNames[1][Fleur.XsltX["if"] = Fleur.Xlength++] = [1, 3, "xsl:if"];
Fleur.XsltXNames[1][Fleur.XsltX["import"] = Fleur.Xlength++] = [1, 3, "xsl:import"];
Fleur.XsltXNames[1][Fleur.XsltX.include = Fleur.Xlength++] = [1, 3, "xsl:include"];
Fleur.XsltXNames[1][Fleur.XsltX.iterate = Fleur.Xlength++] = [1, 3, "xsl:iterate"];
Fleur.XsltXNames[1][Fleur.XsltX.key = Fleur.Xlength++] = [1, 3, "xsl:key"];
Fleur.XsltXNames[1][Fleur.XsltX.map = Fleur.Xlength++] = [1, 3, "xsl:map"];
Fleur.XsltXNames[1][Fleur.XsltX.merge = Fleur.Xlength++] = [1, 3, "xsl:merge"];
Fleur.XsltXNames[1][Fleur.XsltX.message = Fleur.Xlength++] = [1, 3, "xsl:message"];
Fleur.XsltXNames[1][Fleur.XsltX.mode = Fleur.Xlength++] = [1, 3, "xsl:mode"];
Fleur.XsltXNames[1][Fleur.XsltX.namespace = Fleur.Xlength++] = [1, 3, "xsl:namespace"];
Fleur.XsltXNames[1][Fleur.XsltX.number = Fleur.Xlength++] = [1, 3, "xsl:number"];
Fleur.XsltXNames[1][Fleur.XsltX.otherwise = Fleur.Xlength++] = [1, 3, "xsl:otherwise"];
Fleur.XsltXNames[1][Fleur.XsltX.output = Fleur.Xlength++] = [1, 3, "xsl:output"];
Fleur.XsltXNames[1][Fleur.XsltX.override = Fleur.Xlength++] = [1, 3, "xsl:override"];
Fleur.XsltXNames[1][Fleur.XsltX["package"] = Fleur.Xlength++] = [1, 3, "xsl:package"];
Fleur.XsltXNames[1][Fleur.XsltX.param = Fleur.Xlength++] = [1, 3, "xsl:param"];
Fleur.XsltXNames[1][Fleur.XsltX.sequence = Fleur.Xlength++] = [1, 3, "xsl:sequence"];
Fleur.XsltXNames[1][Fleur.XsltX.sort = Fleur.Xlength++] = [1, 3, "xsl:sort"];
Fleur.XsltXNames[1][Fleur.XsltX.stream = Fleur.Xlength++] = [1, 3, "xsl:stream"];
Fleur.XsltX.transform = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltX.stylesheet = Fleur.Xlength++] = [1, 3, "xsl:stylesheet"];
Fleur.XsltXNames[1][Fleur.XsltX.template = Fleur.Xlength++] = [1, 3, "xsl:template"];
Fleur.XsltXNames[1][Fleur.XsltX.text = Fleur.Xlength++] = [1, 3, "xsl:text"];
Fleur.XsltXNames[1][Fleur.XsltX["try"] = Fleur.Xlength++] = [1, 3, "xsl:try"];
Fleur.XsltXNames[1][Fleur.XsltX.variable = Fleur.Xlength++] = [1, 3, "xsl:variable"];
Fleur.XsltXNames[1][Fleur.XsltX.when = Fleur.Xlength++] = [1, 3, "xsl:when"];
Fleur.XsltXNames[1][Fleur.XsltX["accumulator-rule"] = Fleur.Xlength++] = [1, 3, "xsl:accumulator-rule"];
Fleur.XsltXNames[1][Fleur.XsltX["analyze-string"] = Fleur.Xlength++] = [1, 3, "xsl:analyze-string"];
Fleur.XsltXNames[1][Fleur.XsltX["apply-imports"] = Fleur.Xlength++] = [1, 3, "xsl:apply-imports"];
Fleur.XsltXNames[1][Fleur.XsltX["apply-templates"] = Fleur.Xlength++] = [1, 3, "xsl:apply-templates"];
Fleur.XsltXNames[1][Fleur.XsltX["attribute-set"] = Fleur.Xlength++] = [1, 3, "xsl:attribute-set"];
Fleur.XsltXNames[1][Fleur.XsltX["call-template"] = Fleur.Xlength++] = [1, 3, "xsl:call-template"];
Fleur.XsltXNames[1][Fleur.XsltX["character-map"] = Fleur.Xlength++] = [1, 3, "xsl:character-map"];
Fleur.XsltXNames[1][Fleur.XsltX["context-item"] = Fleur.Xlength++] = [1, 3, "xsl:context-item"];
Fleur.XsltXNames[1][Fleur.XsltX["copy-of"] = Fleur.Xlength++] = [1, 3, "xsl:copy-of"];
Fleur.XsltXNames[1][Fleur.XsltX["decimal-format"] = Fleur.Xlength++] = [1, 3, "xsl:decimal-format"];
Fleur.XsltXNames[1][Fleur.XsltX["for-each"] = Fleur.Xlength++] = [1, 3, "xsl:for-each"];
Fleur.XsltXNames[1][Fleur.XsltX["for-each-group"] = Fleur.Xlength++] = [1, 3, "xsl:for-each-group"];
Fleur.XsltXNames[1][Fleur.XsltX["import-schema"] = Fleur.Xlength++] = [1, 3, "xsl:import-schema"];
Fleur.XsltXNames[1][Fleur.XsltX["map-entry"] = Fleur.Xlength++] = [1, 3, "xsl:map-entry"];
Fleur.XsltXNames[1][Fleur.XsltX["matching-substring"] = Fleur.Xlength++] = [1, 3, "xsl:matching-substring"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-action"] = Fleur.Xlength++] = [1, 3, "xsl:merge-action"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-key"] = Fleur.Xlength++] = [1, 3, "xsl:merge-key"];
Fleur.XsltXNames[1][Fleur.XsltX["merge-source"] = Fleur.Xlength++] = [1, 3, "xsl:merge-source"];
Fleur.XsltXNames[1][Fleur.XsltX["namespace-alias"] = Fleur.Xlength++] = [1, 3, "xsl:namespace-alias"];
Fleur.XsltXNames[1][Fleur.XsltX["next-iteration"] = Fleur.Xlength++] = [1, 3, "xsl:next-iteration"];
Fleur.XsltXNames[1][Fleur.XsltX["next-match"] = Fleur.Xlength++] = [1, 3, "xsl:next-match"];
Fleur.XsltXNames[1][Fleur.XsltX["non-matching-substring"] = Fleur.Xlength++] = [1, 3, "xsl:non-matching-substring"];
Fleur.XsltXNames[1][Fleur.XsltX["on-completion"] = Fleur.Xlength++] = [1, 3, "xsl:on-completion"];
Fleur.XsltXNames[1][Fleur.XsltX["output-character"] = Fleur.Xlength++] = [1, 3, "xsl:output-character"];
Fleur.XsltXNames[1][Fleur.XsltX["perform-sort"] = Fleur.Xlength++] = [1, 3, "xsl:perform-sort"];
Fleur.XsltXNames[1][Fleur.XsltX["post-descent"] = Fleur.Xlength++] = [1, 3, "xsl:post-descent"];
Fleur.XsltXNames[1][Fleur.XsltX["preserve-space"] = Fleur.Xlength++] = [1, 3, "xsl:preserve-space"];
Fleur.XsltXNames[1][Fleur.XsltX["processing-instruction"] = Fleur.Xlength++] = [1, 3, "xsl:processing-instruction"];
Fleur.XsltXNames[1][Fleur.XsltX["result-document"] = Fleur.Xlength++] = [1, 3, "xsl:result-document"];
Fleur.XsltXNames[1][Fleur.XsltX["strip-space"] = Fleur.Xlength++] = [1, 3, "xsl:strip-space"];
Fleur.XsltXNames[1][Fleur.XsltX["use-package"] = Fleur.Xlength++] = [1, 3, "xsl:use-package"];
Fleur.XsltXNames[1][Fleur.XsltX["value-of"] = Fleur.Xlength++] = [1, 3, "xsl:value-of"];
Fleur.XsltXNames[1][Fleur.XsltX["with-param"] = Fleur.Xlength++] = [1, 3, "xsl:with-param"];
Fleur.XsltXattr = {};
Fleur.XsltXNames[1][Fleur.XsltXattr["NaN decimal-format"] = Fleur.Xlength++] = [2, 3, "NaN"];
Fleur.XsltXNames[1][Fleur.XsltXattr["applies-to accumulator"] = Fleur.Xlength++] = [1, 6, "patternx:applies-to"];
Fleur.XsltXattr["as accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["as context-item"] = Fleur.Xlength;
Fleur.XsltXattr["as evaluate"] = Fleur.Xlength;
Fleur.XsltXattr["as function"] = Fleur.Xlength;
Fleur.XsltXattr["as param"] = Fleur.Xlength;
Fleur.XsltXattr["as template"] = Fleur.Xlength;
Fleur.XsltXattr["as variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["as with-param"] = Fleur.Xlength++] = [1, 4, "xsltx:as"];
Fleur.XsltXNames[1][Fleur.XsltXattr["base-uri evaluate"] = Fleur.Xlength++] = [1, 5, "avtx:base-uri"];
Fleur.XsltXattr["bind-group for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-group merge"] = Fleur.Xlength++] = [2, 3, "bind-group"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-grouping-key for-each-group"] = Fleur.Xlength++] = [2, 3, "bind-grouping-key"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-key merge"] = Fleur.Xlength++] = [2, 3, "bind-key"];
Fleur.XsltXNames[1][Fleur.XsltXattr["bind-source merge-source"] = Fleur.Xlength++] = [2, 3, "bind-source"];
Fleur.XsltXNames[1][Fleur.XsltXattr["byte-order-mark output"] = Fleur.Xlength++] = [2, 3, "byte-order-mark"];
Fleur.XsltXNames[1][Fleur.XsltXattr["byte-order-mark result-document"] = Fleur.Xlength++] = [1, 5, "avtx:byte-order-mark"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cache function"] = Fleur.Xlength++] = [2, 3, "cache"];
Fleur.XsltXattr["case-order merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["case-order sort"] = Fleur.Xlength++] = [1, 5, "avtx:case-order"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cdata-section-elements output"] = Fleur.Xlength++] = [2, 3, "cdata-section-elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["cdata-section-elements result-document"] = Fleur.Xlength++] = [1, 5, "avtx:cdata-section-elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["character output-character"] = Fleur.Xlength++] = [2, 3, "character"];
Fleur.XsltXattr["collation key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["collation merge-key"] = Fleur.Xlength++] = [2, 3, "collation"];
Fleur.XsltXattr["collation for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["collation sort"] = Fleur.Xlength++] = [1, 5, "avtx:collation"];
Fleur.XsltXattr["component accept"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["component expose"] = Fleur.Xlength++] = [2, 3, "component"];
Fleur.XsltXattr["composite for-each-group"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["composite key"] = Fleur.Xlength++] = [2, 3, "composite"];
Fleur.XsltXNames[1][Fleur.XsltXattr["context-item evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:context-item"];
Fleur.XsltXattr["copy-namespaces copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["copy-namespaces copy-of"] = Fleur.Xlength++] = [2, 3, "copy-namespaces"];
Fleur.XsltXNames[1][Fleur.XsltXattr["count number"] = Fleur.Xlength++] = [1, 6, "patternx:count"];
Fleur.XsltXattr["data-type merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["data-type sort"] = Fleur.Xlength++] = [1, 5, "avtx:data-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["decimal-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "decimal-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-collation *"] = Fleur.Xlength++] = [2, 3, "default-collation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-mode *"] = Fleur.Xlength++] = [2, 3, "default-mode"];
Fleur.XsltXNames[1][Fleur.XsltXattr["default-validation *"] = Fleur.Xlength++] = [2, 3, "default-validation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["digit decimal-format"] = Fleur.Xlength++] = [2, 3, "digit"];
Fleur.XsltXattr["disable-output-escaping text"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["disable-output-escaping value-of"] = Fleur.Xlength++] = [2, 3, "disable-output-escaping"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-public output"] = Fleur.Xlength++] = [2, 3, "doctype-public"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-public result-document"] = Fleur.Xlength++] = [1, 5, "avtx:doctype-public"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-system output"] = Fleur.Xlength++] = [2, 3, "doctype-system"];
Fleur.XsltXNames[1][Fleur.XsltXattr["doctype-system result-document"] = Fleur.Xlength++] = [1, 5, "avtx:doctype-system"];
Fleur.XsltXNames[1][Fleur.XsltXattr["elements strip-space"] = Fleur.Xlength++] = [1, 4, "xsltx:elements"];
Fleur.XsltXNames[1][Fleur.XsltXattr["encoding output"] = Fleur.Xlength++] = [2, 3, "encoding"];
Fleur.XsltXNames[1][Fleur.XsltXattr["encoding result-document"] = Fleur.Xlength++] = [1, 5, "avtx:encoding"];
Fleur.XsltXattr["error-code assert"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["error-code message"] = Fleur.Xlength++] = [1, 5, "avtx:error-code"];
Fleur.XsltXNames[1][Fleur.XsltXattr["errors catch"] = Fleur.Xlength++] = [2, 3, "errors"];
Fleur.XsltXNames[1][Fleur.XsltXattr["escape-uri-attributes output"] = Fleur.Xlength++] = [2, 3, "escape-uri-attributes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["escape-uri-attributes result-document"] = Fleur.Xlength++] = [1, 5, "avtx:escape-uri-attributes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["exclude-result-prefixes *"] = Fleur.Xlength++] = [2, 3, "exclude-result-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["expand-text *"] = Fleur.Xlength++] = [2, 3, "expand-text"];
Fleur.XsltXNames[1][Fleur.XsltXattr["extension-element-prefixes *"] = Fleur.Xlength++] = [2, 3, "extension-element-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["flags analyze-string"] = Fleur.Xlength++] = [1, 5, "avtx:flags"];
Fleur.XsltXNames[1][Fleur.XsltXattr["for-each merge-source"] = Fleur.Xlength++] = [1, 4, "xsltx:for-each"];
Fleur.XsltXattr["format number"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["format result-document"] = Fleur.Xlength++] = [1, 5, "avtx:format"];
Fleur.XsltXNames[1][Fleur.XsltXattr["from number"] = Fleur.Xlength++] = [1, 6, "patternx:from"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-adjacent for-each-group"] = Fleur.Xlength++] = [1, 4, "xsltx:group-adjacent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-by for-each-group"] = Fleur.Xlength++] = [1, 4, "xsltx:group-by"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-ending-with for-each-group"] = Fleur.Xlength++] = [1, 6, "patternx:group-ending-with"];
Fleur.XsltXNames[1][Fleur.XsltXattr["group-starting-with for-each-group"] = Fleur.Xlength++] = [1, 6, "patternx:group-starting-with"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "grouping-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-separator number"] = Fleur.Xlength++] = [1, 5, "avtx:grouping-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["grouping-size number"] = Fleur.Xlength++] = [1, 5, "avtx:grouping-size"];
Fleur.XsltXattr["href import"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["href include"] = Fleur.Xlength++] = [2, 3, "href"];
Fleur.XsltXattr["href result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["href stream"] = Fleur.Xlength++] = [1, 5, "avtx:href"];
Fleur.XsltXNames[1][Fleur.XsltXattr["html-version output"] = Fleur.Xlength++] = [2, 3, "html-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["html-version result-document"] = Fleur.Xlength++] = [1, 5, "avtx:html-version"];
Fleur.XsltXattr["id stylesheet"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["id transform"] = Fleur.Xlength++] = [2, 3, "id"];
Fleur.XsltXNames[1][Fleur.XsltXattr["identity-sensitive function"] = Fleur.Xlength++] = [2, 3, "identity-sensitive"];
Fleur.XsltXNames[1][Fleur.XsltXattr["include-content-type output"] = Fleur.Xlength++] = [2, 3, "include-content-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["include-content-type result-document"] = Fleur.Xlength++] = [1, 5, "avtx:include-content-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["indent output"] = Fleur.Xlength++] = [2, 3, "indent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["indent result-document"] = Fleur.Xlength++] = [1, 5, "avtx:indent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["infinity decimal-format"] = Fleur.Xlength++] = [2, 3, "infinity"];
Fleur.XsltXattr["inherit-namespaces copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["inherit-namespaces element"] = Fleur.Xlength++] = [2, 3, "inherit-namespaces"];
Fleur.XsltXNames[1][Fleur.XsltXattr["initial-value accumulator"] = Fleur.Xlength++] = [1, 4, "xsltx:initial-value"];
Fleur.XsltXattr["input-type-annotations package"] = Fleur.Xlength;
Fleur.XsltXattr["input-type-annotations stylesheet"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["input-type-annotations transform"] = Fleur.Xlength++] = [2, 3, "input-type-annotations"];
Fleur.XsltXNames[1][Fleur.XsltXattr["item-separator output"] = Fleur.Xlength++] = [2, 3, "item-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["item-separator result-document"] = Fleur.Xlength++] = [1, 5, "avtx:item-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["key map-entry"] = Fleur.Xlength++] = [1, 4, "xsltx:key"];
Fleur.XsltXattr["lang merge-key"] = Fleur.Xlength;
Fleur.XsltXattr["lang number"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["lang sort"] = Fleur.Xlength++] = [1, 5, "avtx:lang"];
Fleur.XsltXNames[1][Fleur.XsltXattr["letter-value number"] = Fleur.Xlength++] = [1, 5, "avtx:letter-value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["level number"] = Fleur.Xlength++] = [2, 3, "level"];
Fleur.XsltXattr["match accumulator-rule"] = Fleur.Xlength;
Fleur.XsltXattr["match key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["match template"] = Fleur.Xlength++] = [1, 6, "patternx:match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["media-type output"] = Fleur.Xlength++] = [2, 3, "media-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["media-type result-document"] = Fleur.Xlength++] = [1, 5, "avtx:media-type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["method output"] = Fleur.Xlength++] = [2, 3, "method"];
Fleur.XsltXNames[1][Fleur.XsltXattr["method result-document"] = Fleur.Xlength++] = [1, 5, "avtx:method"];
Fleur.XsltXNames[1][Fleur.XsltXattr["minus-sign decimal-format"] = Fleur.Xlength++] = [2, 3, "minus-sign"];
Fleur.XsltXattr["mode apply-templates"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["mode template"] = Fleur.Xlength++] = [2, 3, "mode"];
Fleur.XsltXattr["name accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["name attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["name call-template"] = Fleur.Xlength;
Fleur.XsltXattr["name character-map"] = Fleur.Xlength;
Fleur.XsltXattr["name decimal-format"] = Fleur.Xlength;
Fleur.XsltXattr["name function"] = Fleur.Xlength;
Fleur.XsltXattr["name key"] = Fleur.Xlength;
Fleur.XsltXattr["name mode"] = Fleur.Xlength;
Fleur.XsltXattr["name output"] = Fleur.Xlength;
Fleur.XsltXattr["name package"] = Fleur.Xlength;
Fleur.XsltXattr["name param"] = Fleur.Xlength;
Fleur.XsltXattr["name template"] = Fleur.Xlength;
Fleur.XsltXattr["name use-package"] = Fleur.Xlength;
Fleur.XsltXattr["name variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["name with-param"] = Fleur.Xlength++] = [2, 3, "name"];
Fleur.XsltXattr["name attribute"] = Fleur.Xlength;
Fleur.XsltXattr["name element"] = Fleur.Xlength;
Fleur.XsltXattr["name namespace"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["name processing-instruction"] = Fleur.Xlength++] = [1, 5, "avtx:name"];
Fleur.XsltXattr["names accept"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["names expose"] = Fleur.Xlength++] = [2, 3, "names"];
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace import-schema"] = Fleur.Xlength++] = [2, 3, "namespace"];
Fleur.XsltXattr["namespace attribute"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace element"] = Fleur.Xlength++] = [1, 5, "avtx:namespace"];
Fleur.XsltXNames[1][Fleur.XsltXattr["namespace-context evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:namespace-context"];
Fleur.XsltXNames[1][Fleur.XsltXattr["new-value accumulator-rule"] = Fleur.Xlength++] = [1, 4, "xsltx:new-value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["normalization-form output"] = Fleur.Xlength++] = [2, 3, "normalization-form"];
Fleur.XsltXNames[1][Fleur.XsltXattr["normalization-form result-document"] = Fleur.Xlength++] = [1, 5, "avtx:normalization-form"];
Fleur.XsltXNames[1][Fleur.XsltXattr["omit-xml-declaration output"] = Fleur.Xlength++] = [2, 3, "omit-xml-declaration"];
Fleur.XsltXNames[1][Fleur.XsltXattr["omit-xml-declaration result-document"] = Fleur.Xlength++] = [1, 5, "avtx:omit-xml-declaration"];
Fleur.XsltXattr["on-empty attribute"] = Fleur.Xlength;
Fleur.XsltXattr["on-empty copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["on-empty element"] = Fleur.Xlength++] = [1, 4, "xsltx:on-empty"];
Fleur.XsltXNames[1][Fleur.XsltXattr["on-multiple-match mode"] = Fleur.Xlength++] = [2, 3, "on-multiple-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["on-no-match mode"] = Fleur.Xlength++] = [2, 3, "on-no-match"];
Fleur.XsltXattr["order merge-key"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["order sort"] = Fleur.Xlength++] = [1, 5, "avtx:order"];
Fleur.XsltXNames[1][Fleur.XsltXattr["ordinal number"] = Fleur.Xlength++] = [1, 5, "avtx:ordinal"];
Fleur.XsltXNames[1][Fleur.XsltXattr["output-version result-document"] = Fleur.Xlength++] = [1, 5, "avtx:output-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["override function"] = Fleur.Xlength++] = [2, 3, "override"];
Fleur.XsltXNames[1][Fleur.XsltXattr["override-extension-function function"] = Fleur.Xlength++] = [2, 3, "override-extension-function"];
Fleur.XsltXattr["package-version package"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["package-version use-package"] = Fleur.Xlength++] = [2, 3, "package-version"];
Fleur.XsltXNames[1][Fleur.XsltXattr["parameter-document output"] = Fleur.Xlength++] = [2, 3, "parameter-document"];
Fleur.XsltXNames[1][Fleur.XsltXattr["parameter-document result-document"] = Fleur.Xlength++] = [1, 5, "avtx:parameter-document"];
Fleur.XsltXNames[1][Fleur.XsltXattr["pattern-separator decimal-format"] = Fleur.Xlength++] = [2, 3, "pattern-separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["per-mille decimal-format"] = Fleur.Xlength++] = [2, 3, "per-mille"];
Fleur.XsltXNames[1][Fleur.XsltXattr["percent decimal-format"] = Fleur.Xlength++] = [2, 3, "percent"];
Fleur.XsltXNames[1][Fleur.XsltXattr["phase accumulator-rule"] = Fleur.Xlength++] = [2, 3, "phase"];
Fleur.XsltXNames[1][Fleur.XsltXattr["priority template"] = Fleur.Xlength++] = [2, 3, "priority"];
Fleur.XsltXNames[1][Fleur.XsltXattr["regex analyze-string"] = Fleur.Xlength++] = [1, 5, "avtx:regex"];
Fleur.XsltXNames[1][Fleur.XsltXattr["required param"] = Fleur.Xlength++] = [2, 3, "required"];
Fleur.XsltXNames[1][Fleur.XsltXattr["result-prefix namespace-alias"] = Fleur.Xlength++] = [2, 3, "result-prefix"];
Fleur.XsltXNames[1][Fleur.XsltXattr["schema-aware evaluate"] = Fleur.Xlength++] = [1, 5, "avtx:schema-aware"];
Fleur.XsltXNames[1][Fleur.XsltXattr["schema-location import-schema"] = Fleur.Xlength++] = [2, 3, "schema-location"];
Fleur.XsltXattr["select analyze-string"] = Fleur.Xlength;
Fleur.XsltXattr["select apply-templates"] = Fleur.Xlength;
Fleur.XsltXattr["select assert"] = Fleur.Xlength;
Fleur.XsltXattr["select attribute"] = Fleur.Xlength;
Fleur.XsltXattr["select break"] = Fleur.Xlength;
Fleur.XsltXattr["select catch"] = Fleur.Xlength;
Fleur.XsltXattr["select comment"] = Fleur.Xlength;
Fleur.XsltXattr["select copy"] = Fleur.Xlength;
Fleur.XsltXattr["select copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["select for-each"] = Fleur.Xlength;
Fleur.XsltXattr["select for-each-group"] = Fleur.Xlength;
Fleur.XsltXattr["select iterate"] = Fleur.Xlength;
Fleur.XsltXattr["select map-entry"] = Fleur.Xlength;
Fleur.XsltXattr["select merge-key"] = Fleur.Xlength;
Fleur.XsltXattr["select merge-source"] = Fleur.Xlength;
Fleur.XsltXattr["select message"] = Fleur.Xlength;
Fleur.XsltXattr["select namespace"] = Fleur.Xlength;
Fleur.XsltXattr["select number"] = Fleur.Xlength;
Fleur.XsltXattr["select on-completion"] = Fleur.Xlength;
Fleur.XsltXattr["select param"] = Fleur.Xlength;
Fleur.XsltXattr["select perform-sort"] = Fleur.Xlength;
Fleur.XsltXattr["select processing-instruction"] = Fleur.Xlength;
Fleur.XsltXattr["select sequence"] = Fleur.Xlength;
Fleur.XsltXattr["select sort"] = Fleur.Xlength;
Fleur.XsltXattr["select try"] = Fleur.Xlength;
Fleur.XsltXattr["select value-of"] = Fleur.Xlength;
Fleur.XsltXattr["select variable"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["select with-param"] = Fleur.Xlength++] = [1, 4, "xsltx:select"];
Fleur.XsltXattr["separator attribute"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["separator value-of"] = Fleur.Xlength++] = [1, 5, "avtx:separator"];
Fleur.XsltXNames[1][Fleur.XsltXattr["sort-before-merge merge-source"] = Fleur.Xlength++] = [2, 3, "sort-before-merge"];
Fleur.XsltXNames[1][Fleur.XsltXattr["stable sort"] = Fleur.Xlength++] = [1, 5, "avtx:stable"];
Fleur.XsltXNames[1][Fleur.XsltXattr["standalone output"] = Fleur.Xlength++] = [2, 3, "standalone"];
Fleur.XsltXNames[1][Fleur.XsltXattr["standalone result-document"] = Fleur.Xlength++] = [1, 5, "avtx:standalone"];
Fleur.XsltXNames[1][Fleur.XsltXattr["start-at number"] = Fleur.Xlength++] = [1, 5, "avtx:start-at"];
Fleur.XsltXattr["static param"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["static variable"] = Fleur.Xlength++] = [2, 3, "static"];
Fleur.XsltXattr["streamable accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["streamable attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["streamable merge-source"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["streamable mode"] = Fleur.Xlength++] = [2, 3, "streamable"];
Fleur.XsltXNames[1][Fleur.XsltXattr["string output-character"] = Fleur.Xlength++] = [2, 3, "string"];
Fleur.XsltXNames[1][Fleur.XsltXattr["stylesheet-prefix namespace-alias"] = Fleur.Xlength++] = [2, 3, "stylesheet-prefix"];
Fleur.XsltXNames[1][Fleur.XsltXattr["suppress-indentation output"] = Fleur.Xlength++] = [2, 3, "suppress-indentation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["suppress-indentation result-document"] = Fleur.Xlength++] = [1, 5, "avtx:suppress-indentation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["terminate message"] = Fleur.Xlength++] = [1, 5, "avtx:terminate"];
Fleur.XsltXattr["test assert"] = Fleur.Xlength;
Fleur.XsltXattr["test if"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["test when"] = Fleur.Xlength++] = [1, 4, "xsltx:test"];
Fleur.XsltXattr["tunnel param"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["tunnel with-param"] = Fleur.Xlength++] = [2, 3, "tunnel"];
Fleur.XsltXattr["type attribute"] = Fleur.Xlength;
Fleur.XsltXattr["type copy"] = Fleur.Xlength;
Fleur.XsltXattr["type copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["type document"] = Fleur.Xlength;
Fleur.XsltXattr["type element"] = Fleur.Xlength;
Fleur.XsltXattr["type result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["type stream"] = Fleur.Xlength++] = [2, 3, "type"];
Fleur.XsltXNames[1][Fleur.XsltXattr["typed mode"] = Fleur.Xlength++] = [2, 3, "typed"];
Fleur.XsltXNames[1][Fleur.XsltXattr["undeclare-prefixes output"] = Fleur.Xlength++] = [2, 3, "undeclare-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["undeclare-prefixes result-document"] = Fleur.Xlength++] = [1, 5, "avtx:undeclare-prefixes"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use context-item"] = Fleur.Xlength++] = [2, 3, "use"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use key"] = Fleur.Xlength++] = [1, 4, "xsltx:use"];
Fleur.XsltXattr["use-attribute-sets attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["use-attribute-sets copy"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["use-attribute-sets element"] = Fleur.Xlength++] = [2, 3, "use-attribute-sets"];
Fleur.XsltXattr["use-character-maps character-map"] = Fleur.Xlength;
Fleur.XsltXattr["use-character-maps output"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["use-character-maps result-document"] = Fleur.Xlength++] = [2, 3, "use-character-maps"];
Fleur.XsltXNames[1][Fleur.XsltXattr["use-when *"] = Fleur.Xlength++] = [1, 4, "xsltx:use-when"];
Fleur.XsltXattr["validation attribute"] = Fleur.Xlength;
Fleur.XsltXattr["validation copy"] = Fleur.Xlength;
Fleur.XsltXattr["validation copy-of"] = Fleur.Xlength;
Fleur.XsltXattr["validation document"] = Fleur.Xlength;
Fleur.XsltXattr["validation element"] = Fleur.Xlength;
Fleur.XsltXattr["validation result-document"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["validation stream"] = Fleur.Xlength++] = [2, 3, "validation"];
Fleur.XsltXNames[1][Fleur.XsltXattr["value number"] = Fleur.Xlength++] = [1, 4, "xsltx:value"];
Fleur.XsltXNames[1][Fleur.XsltXattr["version *"] = Fleur.Xlength++] = [2, 3, "version"];
Fleur.XsltXattr["visibility accept"] = Fleur.Xlength;
Fleur.XsltXattr["visibility accumulator"] = Fleur.Xlength;
Fleur.XsltXattr["visibility attribute-set"] = Fleur.Xlength;
Fleur.XsltXattr["visibility expose"] = Fleur.Xlength;
Fleur.XsltXattr["visibility function"] = Fleur.Xlength;
Fleur.XsltXattr["visibility mode"] = Fleur.Xlength;
Fleur.XsltXattr["visibility param"] = Fleur.Xlength;
Fleur.XsltXattr["visibility template"] = Fleur.Xlength;
Fleur.XsltXNames[1][Fleur.XsltXattr["visibility variable"] = Fleur.Xlength++] = [2, 3, "visibility"];
Fleur.XsltXNames[1][Fleur.XsltXattr["warning-on-multiple-match mode"] = Fleur.Xlength++] = [2, 3, "warning-on-multiple-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["warning-on-no-match mode"] = Fleur.Xlength++] = [2, 3, "warning-on-no-match"];
Fleur.XsltXNames[1][Fleur.XsltXattr["with-params evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:with-params"];
Fleur.XsltXNames[1][Fleur.XsltXattr["xpath evaluate"] = Fleur.Xlength++] = [1, 4, "xsltx:xpath"];
Fleur.XsltXNames[1][Fleur.XsltXattr["xpath-default-namespace *"] = Fleur.Xlength++] = [2, 3, "xpath-default-namespace"];
Fleur.XsltXNames[1][Fleur.XsltXattr["zero-digit decimal-format"] = Fleur.Xlength++] = [2, 3, "zero-digit"];
Fleur.XsltXNames[1][Fleur.XsltX.xslt = Fleur.Xlength++] = [2, 1, "xmlns:xsl"];
Fleur.XsltXNames[1][Fleur.XsltX.xsltx = Fleur.Xlength++] = [2, 1, "xmlns:xsltx"];
Fleur.XsltXNames[1][Fleur.XsltX.avtx = Fleur.Xlength++] = [2, 1, "xmlns:avtx"];
Fleur.XsltXNames[1][Fleur.XsltX.patternx = Fleur.Xlength++] = [2, 1, "xmlns:patternx"];
Fleur.XsltStylesheet = function() {};
Fleur.XsltStylesheet.prototype = new Array();
Fleur.XsltEngine[Fleur.XsltXattr["match template"]] = function(ctx, children) {
	ctx.match = children[0];
};
Fleur.XsltEngine[Fleur.XsltXattr["mode template"]] = function(ctx, children) {
	ctx.mode = children[0];
};
Fleur.XsltEngine[Fleur.XsltXattr["priority template"]] = function(ctx, children) {
	ctx.priority = children[0];
};
Fleur.XsltEngine[Fleur.XsltX.stylesheet] = function(ctx, children) {
	var i = 0, l;
	l = children.length;
	while (i < l) {
		Fleur.XsltEngine[children[i][0]](ctx, children[i][1]);
		i++;
	}
};
Fleur.XsltEngine[Fleur.XsltX.template] = function(ctx, children) {
	var i = 0, l, template = {};
	l = children.length;
	while (i < l) {
		if (Fleur.XsltXNames[1][children[i][0]][0] !== 2 && Fleur.XsltXNames[1][children[i][0]][1] !== 4 && Fleur.XsltXNames[1][children[i][0]][1] !== 5) {
			break;
		}
		Fleur.XsltEngine[children[i][0]](template, children[i][1]);
		i++;
	}
	template.mode = template.mode || "#default";
	if (template.name) {
		ctx.template[1][template.name] = [template, children.slice(i)];
	}
	if (template.match) {
		if (ctx.template[0][template.mode]) {
			ctx.template[0][template.mode].push([template, children.slice(i)]);
		} else {
			ctx.template[0][template.mode] = [[template, children.slice(i)]];
		}
	}
};
Fleur.XsltEngine[Fleur.XsltX.accept] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.accumulator] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.assert] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.attribute] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["break"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["catch"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.choose] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.comment] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.copy] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.document] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.element] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.evaluate] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.expose] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.fallback] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.fork] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["if"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["import"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.include] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.iterate] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.key] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.map] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.merge] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.message] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.mode] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.namespace] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.number] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.otherwise] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.output] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.override] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.param] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.sequence] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.sort] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.stream] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.text] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["try"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.variable] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.when] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["apply-imports"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["apply-templates"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["attribute-set"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["call-template"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["character-map"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["context-item"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["copy-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["for-each"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["map-entry"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["matching-substring"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-action"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["next-iteration"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["next-match"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["non-matching-substring"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["on-completion"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["perform-sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["post-descent"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["preserve-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["processing-instruction"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["strip-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["use-package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX["with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.avtx] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.xslt] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltX.xsltx] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["NaN decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["as with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["base-uri evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-group merge"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-grouping-key for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-key merge"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["bind-source merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["byte-order-mark output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["byte-order-mark result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cache function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["case-order sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cdata-section-elements output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["cdata-section-elements result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["character output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["collation merge-key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["collation sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["component expose"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["composite key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["context-item evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["copy-namespaces copy-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["count number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["data-type sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["decimal-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-collation *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-mode *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["default-validation *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["digit decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["disable-output-escaping value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-public output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-public result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-system output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["doctype-system result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["elements strip-space"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["encoding output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["encoding result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["error-code message"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["errors catch"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["escape-uri-attributes output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["escape-uri-attributes result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["exclude-result-prefixes *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["expand-text *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["extension-element-prefixes *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["flags analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["for-each merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["format result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["from number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-adjacent for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-by for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-ending-with for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["group-starting-with for-each-group"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-separator number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["grouping-size number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["href include"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["href stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["html-version output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["html-version result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["id transform"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["identity-sensitive function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["include-content-type output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["include-content-type result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["indent output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["indent result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["infinity decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["inherit-namespaces element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["initial-value accumulator"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["input-type-annotations transform"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["item-separator output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["item-separator result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["key map-entry"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["lang sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["letter-value number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["level number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["media-type output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["media-type result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["method output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["method result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["minus-sign decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["name processing-instruction"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["name with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["names expose"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["namespace-context evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["new-value accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["normalization-form output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["normalization-form result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["omit-xml-declaration output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["omit-xml-declaration result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-empty element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-multiple-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["on-no-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["order sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["ordinal number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["output-version result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["override function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["override-extension-function function"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["package-version use-package"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["parameter-document output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["parameter-document result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["pattern-separator decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["per-mille decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["percent decimal-format"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["phase accumulator-rule"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["regex analyze-string"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["required param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["result-prefix namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["schema-aware evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["schema-location import-schema"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["select with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["separator value-of"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["sort-before-merge merge-source"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["stable sort"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["standalone output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["standalone result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["start-at number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["static variable"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["streamable mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["string output-character"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["stylesheet-prefix namespace-alias"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["suppress-indentation output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["suppress-indentation result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["terminate message"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["test when"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["tunnel with-param"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["type stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["typed mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["undeclare-prefixes output"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["undeclare-prefixes result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use context-item"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use key"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-attribute-sets element"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-character-maps result-document"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["use-when *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["validation stream"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["value number"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["version *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["visibility variable"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["warning-on-multiple-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["warning-on-no-match mode"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["with-params evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["xpath evaluate"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["xpath-default-namespace *"]] = function(ctx, children) {};
Fleur.XsltEngine[Fleur.XsltXattr["zero-digit decimal-format"]] = function(ctx, children) {};
Fleur.bin2utf8 = function(s) {
	var r = "";
	for (var i = 0, l = s.length; i < l;) {
		var c = s.charCodeAt(i);
		if (c < 128) {
			r += String.fromCharCode(c);
			i++;
		} else {
			if ((c > 191) && (c < 224)) {
				r += String.fromCharCode(((c & 31) << 6) | (s.charCodeAt(i + 1) & 63));
				i += 2;
			} else {
				r += String.fromCharCode(((c & 15) << 12) | ((s.charCodeAt(i + 1) & 63) << 6) | (s.charCodeAt(i + 2) & 63));
				i += 3;
			}
		}
	}
	return r;
};
Fleur.deflate = function(str, level) {
	return str;
};
Fleur.inflate = function(s) {
	var lbits = 9;
	var dbits = 6;
	var fixed_bl, fixed_tl = null, fixed_bd, fixed_td;
	var mask_bits = [0x0000, 0x0001, 0x0003, 0x0007, 0x000f, 0x001f, 0x003f, 0x007f, 0x00ff, 0x01ff, 0x03ff, 0x07ff, 0x0fff, 0x1fff, 0x3fff, 0x7fff, 0xffff];
	var cplens = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0];
	var cplext = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 99, 99];
	var cpdist = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
	var cpdext = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
	var border = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
	var arr = [], bin;
	var slide = new Array(0x10000);
	var wp = 0;
	var bit_buf = 0;
	var bit_len = 0;
	var method = -1;
	var eof = false;
	var copy_leng = 0;
	var copy_dist = 0;
	var td, tl = null;
	var data = s;
	var pos = 0;
	var bd, bl;
	var HuftBuild = function(b, n, s, d, e, mm) {
	    var hroot = null, tail = null;
		var a, el, f, g, h, i, j, k;
		var p, pidx, q, r = {e: 0, b: 0, n: 0, t: null};
		var w;
		var xp, y, z, o;
		var c = Array(17).fill(0);
		var lx = Array(17).fill(0);
		var u = Array(16).fill(null);
		var v = Array(288).fill(0);
		var x = Array(17).fill(0);
		el = n > 256 ? b[256] : 16;
		p = b;
		pidx = 0;
		i = n;
		do {
		    c[p[pidx]]++;
		    pidx++;
		} while (--i > 0);
		if (c[0] === n) {
		    return {status: 0, root: null, m: 0};
		}
		for (j = 1; j <= 16; j++) {
		    if (c[j] !== 0) {
				break;
			}
		}
		k = j;
		if (mm < j) {
		    mm = j;
		}
		for (i = 16; i !== 0; i--) {
		    if (c[i] !== 0) {
				break;
			}
		}
		g = i;
		if (mm > i) {
		    mm = i;
		}
		for (y = 1 << j; j < i; j++, y <<= 1) {
		    if ((y -= c[j]) < 0) {
				return {status: 2, root: null, m: mm};
		    }
		}
		if ((y -= c[i]) < 0) {
		    return {status: 2, root: null, m: mm};
		}
		c[i] += y;
		x[1] = j = 0;
		p = c;
		pidx = 1;
		xp = 2;
		while (--i > 0) {
		    x[xp++] = (j += p[pidx++]);
		}
		p = b;
		pidx = 0;
		i = 0;
		do {
		    if ((j = p[pidx++]) !== 0) {
				v[x[j]++] = i;
			}
		} while (++i < n);
		n = x[g];
		x[0] = i = 0;
		p = v;
		pidx = 0;
		h = -1;
		w = lx[0] = 0;
		q = null;
		z = 0;
		for (; k <= g; k++) {
		    a = c[k];
		    while (a-- > 0) {
				while (k > w + lx[1 + h]) {
				    w += lx[1 + h];
				    h++;
				    z = (z = g - w) > mm ? mm : z;
				    if ((f = 1 << (j = k - w)) > a + 1) {
						f -= a + 1;
						xp = k;
						while (++j < z) {
						    if ((f <<= 1) <= c[++xp]) {
								break;
							}
						    f -= c[xp];
						}
				    }
				    if (w + j > el && w < el) {
						j = el - w;
					}
				    z = 1 << j;
				    lx[1 + h] = j;
				    q = [];
				    for (o = 0; o < z; o++) {
						q.push({e: 0, b: 0, n: 0, t: null});
				    }
				    if (tail === null) {
						tail = hroot = {next: null, list: null};
				    } else {
						tail = tail.next = {next: null, list: null};
					}
				    tail.next = null;
				    tail.list = q;
				    u[h] = q;
				    if (h > 0) {
						x[h] = i;
						r.b = lx[h];
						r.e = 16 + j;
						r.t = q;
						j = (i & ((1 << w) - 1)) >> (w - lx[h]);
						u[h - 1][j].e = r.e;
						u[h - 1][j].b = r.b;
						u[h - 1][j].n = r.n;
						u[h - 1][j].t = r.t;
				    }
				}
				r.b = k - w;
				if (pidx >= n) {
				    r.e = 99;
				} else if (p[pidx] < s) {
				    r.e = p[pidx] < 256 ? 16 : 15;
				    r.n = p[pidx++];
				} else {
				    r.e = e[p[pidx] - s];
				    r.n = d[p[pidx++] - s];
				}
				f = 1 << (k - w);
				for (j = i >> w; j < z; j += f) {
				    q[j].e = r.e;
				    q[j].b = r.b;
				    q[j].n = r.n;
				    q[j].t = r.t;
				}
				for (j = 1 << (k - 1); (i & j) !== 0; j >>= 1) {
				    i ^= j;
				}
				i ^= j;
				while ((i & ((1 << w) - 1)) !== x[h]) {
				    w -= lx[h];
				    h--;
				}
		    }
		}
		return {status: y !== 0 && g !== 1 ? 1 : 0, root: hroot, m: lx[1]};
	};
	var needbits = function(n) {
		while (bit_len < n) {
			bit_buf |= (data.length === pos ? -1 : data.charCodeAt(pos++) & 0xff) << bit_len;
			bit_len += 8;
		}
	};
	var getbits = function(n) {
		while (bit_len < n) {
			bit_buf |= (data.length === pos ? -1 : data.charCodeAt(pos++) & 0xff) << bit_len;
			bit_len += 8;
		}
	    return bit_buf & mask_bits[n];
	};
	var dumpbits = function(n) {
	    bit_buf >>= n;
	    bit_len -= n;
	};
	var codes = function(buff, off, size) {
	    var e, t, n;
		if (size === 0) {
			return 0;
		}
	    n = 0;
	    for(;;) {
			t = tl.list[getbits(bl)];
			e = t.e;
			while (e > 16) {
				if (e === 99) {
					return -1;
				}
				dumpbits(t.b);
				e -= 16;
				t = t.t[getbits(e)];
				e = t.e;
			}
			dumpbits(t.b);
			if (e === 16) {
			    wp &= 0x7fff;
			    buff[off + n++] = slide[wp++] = t.n;
			    if (n === size) {
					return size;
				}
			    continue;
			}
			if (e === 15) {
			    break;
			}
			copy_leng = t.n + getbits(e);
			dumpbits(e);
			t = td.list[getbits(bd)];
			e = t.e;
			while (e > 16) {
			    if (e === 99) {
					return -1;
				}
			    dumpbits(t.b);
			    e -= 16;
			    t = t.t[getbits(e)];
			    e = t.e;
			}
			dumpbits(t.b);
			copy_dist = wp - t.n - getbits(e);
			dumpbits(e);
			while (copy_leng > 0 && n < size) {
			    copy_leng--;
			    copy_dist &= 0x7fff;
			    wp &= 0x7fff;
			    buff[off + n++] = slide[wp++] = slide[copy_dist++];
			}
			if (n === size) {
				return size;
			}
	    }
	    method = -1;
	    return n;
	};
	var stored = function(buff, off, size) {
	    var n;
	    n = bit_len & 7;
	    dumpbits(n);
	    n = getbits(16);
	    dumpbits(16);
	    needbits(16);
		if (n !== ((~bit_buf) & 0xffff)) {
			return -1;
		}
	    dumpbits(16);
	    copy_leng = n;
	    n = 0;
	    while (copy_leng > 0 && n < size) {
			copy_leng--;
			wp &= 0x7fff;
			buff[off + n++] = slide[wp++] = getbits(8);
			dumpbits(8);
	    }
	    if (copy_leng === 0) {
			method = -1;
		}
		return n;
	};
	var fixed = function(buff, off, size) {
		if (fixed_tl === null) {
			var l = Array(288).fill(8, 0, 144).fill(9, 144, 256).fill(7, 256, 280).fill(8, 280, 288);
			var h;
			fixed_bl = 7;
			h = HuftBuild(l, 288, 257, cplens, cplext, fixed_bl);
			if (h.status !== 0) {
			    return -1;
			}
			fixed_tl = h.root;
			fixed_bl = h.m;
			l.fill(5, 0, 30);
			fixed_bd = 5;
			h = HuftBuild(l, 30, 0, cpdist, cpdext, fixed_bd);
			if (h.status > 1) {
			    fixed_tl = null;
			    return -1;
			}
			fixed_td = h.root;
			fixed_bd = h.m;
	    }
	    tl = fixed_tl;
	    td = fixed_td;
	    bl = fixed_bl;
	    bd = fixed_bd;
	    return codes(buff, off, size);
	};
	var dynamic = function(buff, off, size) {
	    var i, j, h, l, n, t, nb, nl, nd, ll = Array(316).fill(0);
	    nl = 257 + getbits(5);
	    dumpbits(5);
	    nd = 1 + getbits(5);
	    dumpbits(5);
	    nb = 4 + getbits(4);
	    dumpbits(4);
	    if (nl > 286 || nd > 30) {
	    	return -1;
	    }
	    for (j = 0; j < nb; j++) {
			ll[border[j]] = getbits(3);
			dumpbits(3);
	    }
	    for (; j < 19; j++) {
			ll[border[j]] = 0;
		}
	    bl = 7;
	    h = HuftBuild(ll, 19, 19, null, null, bl);
	    if (h.status !== 0) {
			return -1;
		}
	    tl = h.root;
	    bl = h.m;
	    n = nl + nd;
	    i = l = 0;
	    while (i < n) {
			t = tl.list[getbits(bl)];
			j = t.b;
			dumpbits(j);
			j = t.n;
			if (j < 16) {
			    ll[i++] = l = j;
			} else if (j ===  16) {
			    j = 3 + getbits(2);
			    dumpbits(2);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = l;
				}
			} else if (j === 17) {
			    j = 3 + getbits(3);
			    dumpbits(3);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = 0;
				}
			    l = 0;
			} else {
			    j = 11 + getbits(7);
			    dumpbits(7);
			    if (i + j > n) {
					return -1;
				}
			    while (j-- > 0) {
					ll[i++] = 0;
				}
			    l = 0;
			}
	    }
	    bl = lbits;
	    h = HuftBuild(ll, nl, 257, cplens, cplext, bl);
	    if (bl === 0) {
			h.status = 1;
		}
	    if (h.status !== 0) {
			return -1;
	    }
	    tl = h.root;
	    bl = h.m;
	    for (i = 0; i < nd; i++) {
			ll[i] = ll[i + nl];
		}
	    bd = dbits;
	    h = HuftBuild(ll, nd, 0, cpdist, cpdext, bd);
	    td = h.root;
	    bd = h.m;
	    if (bd === 0 && nl > 257) {
			return -1;
	    }
	    if (h.status !== 0) {
			return -1;
		}
	    return codes(buff, off, size);
	};
	var internal = function(buff) {
	    var n, i, size = 1024;
	    n = 0;
	    while (n < size) {
			if (eof && method === -1) {
				return n;
			}
			if (copy_leng > 0) {
				if (method !== 0) {
					while (copy_leng > 0 && n < size) {
					    copy_leng--;
					    copy_dist &= 0x7fff;
					    wp &= 0x7fff;
					    buff[n++] = slide[wp++] = slide[copy_dist++];
					}
			    } else {
					while (copy_leng > 0 && n < size) {
					    copy_leng--;
					    wp &= 0x7fff;
					    buff[n++] = slide[wp++] = getbits(8);
					    dumpbits(8);
					}
					if (copy_leng === 0) {
					    method = -1;
					}
			    }
			    if (n === size) {
					return n;
				}
			}
			if (method === -1) {
			    if (eof) {
					break;
				}
			    if (getbits(1) !== 0) {
					eof = true;
				}
			    dumpbits(1);
			    method = getbits(2);
			    dumpbits(2);
			    tl = null;
			    copy_leng = 0;
			}
			switch (method) {
			  case 0:
			    i = stored(buff, n, size - n);
			    break;
			  case 1:
			    if (tl !== null) {
					i = codes(buff, n, size - n);
			    } else {
					i = fixed(buff, n, size - n);
				}
			    break;
			  case 2:
			    if (tl !== null) {
					i = codes(buff, n, size - n);
			    } else {
					i = dynamic(buff, n, size - n);
				}
			    break;
			  default:
			    i = -1;
			    break;
			}
			if (i === -1) {
			    if (eof) {
					return 0;
				}
			    return -1;
			}
			n += i;
	    }
	    return n;
	};
	do {
		bin = [];
		internal(bin);
		arr.push(bin.reduce(function(s, c) {return s + String.fromCharCode(c);}, ""));
	} while (bin.length > 0);
	return arr.join("");
};
Fleur.inBrowser = (new Function("try {return this === window;}catch(e){ return false;}"))();
Fleur.inNode = (new Function("try {return this === global;}catch(e){return false;}"))();
Fleur.defaultLanguage = typeof navigator !== "undefined" ? (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en' : 'en';
if (typeof BigInt === "undefined") {
	Fleur.BigInt = function(arg) {
		return parseInt(arg, 10);
	};
} else {
	Fleur.BigInt = BigInt;
}

})(typeof exports === 'undefined'? this.Fleur = {} : require.main === module ? global.Fleur = {} : exports);
if (typeof Object.assign !== 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
if (!String.prototype.normalize) {
  String.prototype.normalize = function (form) {
      return this;
  };
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}
if (!String.fromCodePoint) {
  (function() {
    var defineProperty = (function() {
      try {
        var object = {};
        var $defineProperty = Object.defineProperty;
        var result = $defineProperty(object, object, object) && $defineProperty;
      } catch(error) {}
      return result;
    }());
    var stringFromCharCode = String.fromCharCode;
    var floor = Math.floor;
    var fromCodePoint = function() {
      var MAX_SIZE = 0x4000;
      var codeUnits = [];
      var highSurrogate;
      var lowSurrogate;
      var index = -1;
      var length = arguments.length;
      if (!length) {
        return '';
      }
      var result = '';
      while (++index < length) {
        var codePoint = Number(arguments[index]);
        if (
          !isFinite(codePoint) ||       // `NaN`, `+Infinity`, or `-Infinity`
          codePoint < 0 ||              // not a valid Unicode code point
          codePoint > 0x10FFFF ||       // not a valid Unicode code point
          floor(codePoint) != codePoint // not an integer
        ) {
          throw RangeError('Invalid code point: ' + codePoint);
        }
        if (codePoint <= 0xFFFF) { // BMP code point
          codeUnits.push(codePoint);
        } else { // Astral code point; split in surrogate halves
          codePoint -= 0x10000;
          highSurrogate = (codePoint >> 10) + 0xD800;
          lowSurrogate = (codePoint % 0x400) + 0xDC00;
          codeUnits.push(highSurrogate, lowSurrogate);
        }
        if (index + 1 == length || codeUnits.length > MAX_SIZE) {
          result += stringFromCharCode.apply(null, codeUnits);
          codeUnits.length = 0;
        }
      }
      return result;
    };
    if (defineProperty) {
      defineProperty(String, 'fromCodePoint', {
        'value': fromCodePoint,
        'configurable': true,
        'writable': true
      });
    } else {
      String.fromCodePoint = fromCodePoint;
    }
  }());
}
if (!String.prototype.codePointAt) {
	(function() {
		'use strict';
		var codePointAt = function(position) {
			if (this == null) {
				throw TypeError();
			}
			var string = String(this);
			var size = string.length;
			var index = position ? Number(position) : 0;
			if (index != index) {
				index = 0;
			}
			if (index < 0 || index >= size) {
				return undefined;
			}
			var first = string.charCodeAt(index);
			var second;
			if (
				first >= 0xD800 && first <= 0xDBFF &&
				size > index + 1
			) {
				second = string.charCodeAt(index + 1);
				if (second >= 0xDC00 && second <= 0xDFFF) {
					return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
				}
			}
			return first;
		};
		if (Object.defineProperty) {
			Object.defineProperty(String.prototype, 'codePointAt', {
				'value': codePointAt,
				'configurable': true,
				'writable': true
			});
		} else {
			String.prototype.codePointAt = codePointAt;
		}
	}());
}
(function (global, undefined) {
    if (global.setImmediate) {
        return;
    }
    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var setImmediate;
    function addFromSetImmediateArguments(args) {
        tasksByHandle[nextHandle] = partiallyApplied.apply(undefined, args);
        return nextHandle++;
    }
    function partiallyApplied(handler) {
        var args = [].slice.call(arguments, 1);
        return function() {
            if (typeof handler === "function") {
                handler.apply(undefined, args);
            } else {
                (new Function("" + handler))();
            }
        };
    }
    function runIfPresent(handle) {
        if (currentlyRunningATask) {
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }
    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }
    function installNextTickImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            process.nextTick(partiallyApplied(runIfPresent, handle));
            return handle;
        };
    }
    function canUsePostMessage() {
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }
    function installPostMessageImplementation() {
        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };
        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            global.postMessage(messagePrefix + handle, "*");
            return handle;
        };
    }
    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            channel.port2.postMessage(handle);
            return handle;
        };
    }
    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
            return handle;
        };
    }
    function installSetTimeoutImplementation() {
        setImmediate = function() {
            var handle = addFromSetImmediateArguments(arguments);
            setTimeout(partiallyApplied(runIfPresent, handle), 0);
            return handle;
        };
    }
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
    if ({}.toString.call(global.process) === "[object process]") {
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        installReadyStateChangeImplementation();
    } else {
        installSetTimeoutImplementation();
    }
    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self)
);
if ((new Function("try {return this === window;} catch(e) {return false;}"))()) {
	document.addEventListener('DOMContentLoaded', function() {
		var scripts = Array.prototype.slice.call(document.getElementsByTagName("script"), 0).filter(function(sc) {
			return sc.getAttribute("type") === "application/xquery";
		});
		var parser = new Fleur.DOMParser();
		var xmldoc;
		var xqeval = function(xexpr) {
			try {
				xmldoc.evaluate(xexpr).then(
					function(res) {},
					function(err) {
						alert(err.toXQuery());
					}
				);
			} catch(e) {
				alert("Exception!\n" + e.stack);
			}
		};
		xmldoc = parser.parseFromString("<dummy/>", "application/xml");
		scripts.forEach(function(sc) {
			xqeval(sc.textContent);
		});
	}, false);
} else if (global) {
	global.fs = require('fs');
	global.http = require('http');
	global.path = require('path');
	global.url = require('url');
	global.os = require('os');
	global.dgram = require('dgram');
	global.child_process = require('child_process');
	var startparams = process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur') ? 2 : 3;
	var params = {argv: []};
	process.argv.forEach(function(val, i) {
		if (i >= startparams) {
			if (!params.q && !params.qs) {
				if (val.startsWith("-q:") && val.length > 3) {
					params.q = val.substr(3);
				} else if (val.startsWith("-qs:") && val.length > 4) {
					params.qs = val.substr(4);
				} else if (val.startsWith("-s:") && !params.s && val.length > 3) {
					params.s = val.substr(3);
				} else if (val.startsWith("-o:") && !params.o && val.length > 3) {
					params.o = val.substr(3);
				} else if (val.startsWith("-p:") && !params.p && val.length > 3) {
					params.p = parseInt(val.substr(3), 10);
				} else if (val.startsWith("-f:") && !params.f && val.length > 3) {
					params.f = val.substr(3);
				} else {
					params.usage = true;
				}
			} else if (params.q || params.qs) {
				params.argv.push(val);
			} else {
				params.usage = true;
			}
		}
	});
	if (params.usage || (!params.qs && !params.q && (params.s || params.o))) {
		process.stdout.write("Usage: node fleur ([-s:xmlfile] [-o:outfile] (-q:queryfile|-qs:querystring) [params]|[-p:port] [-f:folder])\n");
		process.stdout.write(" -s:     XML input file (optional)\n");
		process.stdout.write(" -o:     output file (optional)\n");
		process.stdout.write(" -q:     query file\n");
		process.stdout.write(" -qs:    query string\n");
		process.stdout.write(" -p:     http server port\n");
		process.stdout.write(" -f:     http server folder\n");
		process.stdout.write(" params  name=value as externals");
	} else if (params.qs || params.q) {
		var parseval = function(xml, xexpr, out) {
			var parser = new global.Fleur.DOMParser();
			var xmldoc = parser.parseFromString(xml, "application/xml");
			var env;
			if (params.argv.length > 0) {
				var args = {};
				params.argv.forEach(function(p) {
					var pp = p.split("=");
					args[pp[0]] = pp[1];
				});
				env = {
					args: args
				};
			}
			try {
       			var d1 = new Date();
				xmldoc.evaluate(xexpr, null, env).then(
					function(res) {
						if (out) {
	        				global.fs.writeFile(out, res.toXQuery(), function(err) {if (err) process.stdout.write(err);});
						} else {
							process.stdout.write(res.toXQuery());
							var d2 = new Date();
							console.log("\nExecution Time: " + ((d2 - d1) / 1000) + "s");
						}
					},
					function(err) {
						if (out) {
	        				global.fs.writeFile(out, err.toXQuery(), function(err) {if (err) process.stdout.write(err);});
						} else {
							process.stdout.write(err.toXQuery());
						}
					}
				);
			} catch(e) {
				process.stdout.write("Exception!\n" + e.stack);
			}
		};
		Fleur.baseDir = params.q ? global.path.dirname(params.q) : process.cwd();
		var sourceval = function(xml) {
			if (params.qs) {
				parseval(xml, params.qs, params.o);
			} else {
				global.fs.readFile(params.q, 'binary', function(err, file){
					if (err) {
						process.stdout.write(err);
					} else {
						parseval(xml, file, params.o);
					}
				});
			}
		};
		if (params.s) {
			global.fs.readFile(params.s, 'binary', function(err, file){
				if (err) {
					process.stdout.write(err);
				} else {
					sourceval(file);
				}
			});
		} else {
			sourceval("<dummy/>");
		}
	} else if (process.argv[1].endsWith('fleur.js') || process.argv[1].endsWith('fleur')) {
		Fleur.baseDir = global.path.resolve(params.f || process.cwd(), "public");
		var port = params.p;
		port = isNaN(port) || port > 65535 || port === 0 ? 80 : port;
		console.log("Fleur Web Server");
		console.log("Listening to port " + port);
		process.chdir(Fleur.baseDir);
		global.http.createServer(function(request, response) {
			var body, uri, method, newuri, headers, filename, filestats, contentType, ifmodifiedsince, lastmodified;
			body = "";
			var sendfile = function(err, file) {
				if (err) {        
					response.writeHead(err.errno === 34 ? 404 : 500, {"Content-Type": "text/plain"});
					response.end(err.errno === 34 ? "404 Not Found" : "500 Internal server error - " + err);
					return;
				}
				headers = {};
				contentType = Fleur.extension2contentType[global.path.extname(filename)];
				if (contentType) {
					headers["Content-Type"] = contentType;
				}
				if (lastmodified) {
					headers['Expires'] = lastmodified;
					headers["Last-Modified"] = lastmodified;
				}
				response.writeHead(200, headers);
				response.end(file, "binary");
			};
			var execfile = function(err, file) {
				if (err) {        
					response.writeHead(err.errno === 34 ? 404 : 500, {"Content-Type": "text/plain"});
					response.end(err.errno === 34 ? "404 Not Found" : "500 Internal server error - " + err);
					return;
				}
				headers = {};
				lastmodified = (new Date()).toUTCString();
				headers["Last-Modified"] = lastmodified;
    			var doc = new Fleur.Document();
				var reqeval = {request: {headers: request.headers, query: global.url.parse(request.url).query}};
    			if (body !== "") {
    				reqeval.request.body = body;
    			}
				doc.evaluate(file, null, reqeval).then(
					function(res) {
						headers["Content-Type"] = res.mediatype;
						response.writeHead(200, headers);
						response.end(res.serialize(), 'binary');
					},
					function(err) {
						contentType = Fleur.extension2contentType[".txt"];
						if (contentType) {
							headers["Content-Type"] = contentType;
						}
						response.writeHead(200, headers);
						response.end(err.toXQuery(), "binary");
					}
				);
			};
			request.on("data", function (chunk) {
				body += chunk;
			});
			request.on("end", function () {
				uri = global.url.parse(request.url).pathname;
				method = request.method;
				lastmodified = null;
				while (uri.endsWith("/")) {
					uri = uri.substr(0, uri.length - 1);
				}
				newuri = uri;
				while (newuri.startsWith("/")) {
					newuri = newuri.substr(1);
				}
				filename = global.path.resolve(process.cwd(), newuri);
				if (!filename.startsWith(process.cwd())) {
					response.writeHead(403, {'Content-Type': 'text/plain'});
					response.end('403 Forbidden');
					return;
				}
				if (global.fs.existsSync(filename)) {
					filestats = global.fs.statSync(filename);
					if (filestats.isDirectory()) {
						if (method === 'GET') {
							response.writeHead(301, {'Location': uri + '/index.' + (global.fs.existsSync(filename + global.path.sep + 'index.html') ? 'html' : global.fs.existsSync(filename + global.path.sep + '/index.htm') ? 'htm' : global.fs.existsSync(filename + global.path.sep + '/index.xqy') ? 'xqy' : 'xml')});
							response.end();
						} else {
							response.writeHead(403, {'Content-Type': 'text/plain'});
							response.end('403 Forbidden' + ' method:' + method);
						}
						return;
					}
					switch(method) {
						case 'GET':
							if (filename.endsWith('.xqy')) {
								global.fs.readFile(filename, 'binary', execfile);
							} else {
								ifmodifiedsince = request.headers['if-modified-since'];
								if (ifmodifiedsince && (new Date(ifmodifiedsince)).getTime() >= (new Date(filestats.mtime.toUTCString())).getTime()) {
									response.writeHead(304, {'Content-Type': 'text/plain'});
									response.end('304 Not Modified');
									return;
								}
								lastmodified = filestats.mtime.toUTCString();
								global.fs.readFile(filename, 'binary', sendfile);
							}
							break;
						case 'POST':
							if (filename.endsWith('.xqy')) {
								global.fs.readFile(filename, 'binary', execfile);
							} else {
								response.writeHead(405, {'Content-Type': 'text/plain'});
								response.end('405 Method Not Allowed');
							}
							break;
						default:
							response.writeHead(405, {'Content-Type': 'text/plain'});
							response.end('405 Method Not Allowed');
					}
					return;
				}
				response.writeHead(404, {'Content-Type': 'text/plain'});
				response.end('404 Not Found');
			});
		}).listen(port);
	}
}
