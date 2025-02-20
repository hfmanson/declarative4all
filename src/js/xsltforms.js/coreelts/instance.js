"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module instance
 * @description  === "XFInstance" class ===
 * Instance Class
 * * constructor function : stores the properties of this instance and attaches it to a model
 */
    
new XsltForms_class("XsltForms_instance", "HTMLElement", "xforms-instance");

function XsltForms_instance(subform, elt) {
  let srcDoc = "";
  if (elt.children[0]) {
    srcDoc = elt.children[0].innerHTML;
    if (srcDoc.trim() === "") {
      srcDoc = elt.children[0].outerHTML;
      srcDoc = srcDoc.substring(srcDoc.indexOf(">") + 1);
      srcDoc = srcDoc.substring(0, srcDoc.length - 9);
    }
  }
  if (XsltForms_globals.formSource) {
    this.instanceSource = elt.outerHTML;
    if (subform.instances.length === 0) {
      this.sourceStart = XsltForms_globals.formSource.indexOf(this.instanceSource);
    } else {
      this.sourceStart = XsltForms_globals.formSource.indexOf(this.instanceSource, subform.instances[subform.instances.length - 1].sourceStart + subform.instances[subform.instances.length - 1].instanceSource.length);
    }
    this.dataSource = srcDoc;
  }
  if (!elt.id && !document.getElementById(subform.id + "-instance-default")) {
    elt.id = subform.id + "-instance-default";
  }
  var model = elt.parentNode.xfElement;
  srcDoc = srcDoc.replace(/(<|&lt;)\\\/script(>|&gt;)/g, "<\/script>");
  if (srcDoc === "") {
    elt.innerHTML = "";
  }
  this.modified = false;
  if (!Fleur.DOMParse) {
    this.init(subform, elt);
    this.readonly = elt.getAttribute("xf-readonly");
    var mediatype = elt.getAttribute("xf-mediatype") || "application/xml";
    var lines = mediatype.split(";");
    this.mediatype = lines[0];
    for (var i = 1, len = lines.length; i < len; i++) {
      var vals = lines[i].split("=");
      switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
        case "header":
          this.header = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'') === "present";
          break;
        case "separator":
          this.separator = (decodeURI ? decodeURI : unescape)(vals[1].replace(/^\s+/g,'').replace(/\s+$/g,''));
          break;
        case "charset":
          this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
          break;
      }
    }
    this.src = XsltForms_browser.unescape(elt.getAttribute("xf-src") || (elt.children.length !== 0 ? null : elt.getAttribute("xf-resource")));
    var newmediatype = this.mediatype;
    if (newmediatype.substr(newmediatype.length - 4) === "/xml" || newmediatype.substr(newmediatype.length - 4) === "/xsl" || newmediatype.substr(newmediatype.length - 4) === "+xml") {
      newmediatype = "application/xml";
    }
    switch(newmediatype) {
      case "application/xml":
        this.srcDoc = srcDoc.trim();
        if (this.srcDoc.substring(0, 1) === "&") {
          this.srcDoc = XsltForms_browser.unescape(this.srcDoc);
        }
        break;
      case "text/json":
      case "application/json":
      case "application/javascript":
        if (srcDoc) {
          var json = eval(srcDoc);
          this.srcDoc = XsltForms_browser.json2xml("", json, true, false);
        } else {
          this.srcDoc = "";
        }
        break;
      case "text/csv":
        this.srcDoc = XsltForms_browser.csv2xml(srcDoc, this.separator, this.header);
        break;
      case "text/vcard":
        this.srcDoc = XsltForms_browser.vcard2xcard(srcDoc);
        break;
      case "application/zip":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        this.srcDoc = "<dummy/>";
        break;
      default:
        alert("Unsupported mediatype '" + elt.getAttribute("mediatype") + "' for instance #" + elt.id);
        return;
    }
    this.model = model;
    this.doc = XsltForms_browser.createXMLDocument("<dummy/>");
    XsltForms_browser.setDocMeta(this.doc, "instance", elt.id);
    XsltForms_browser.setDocMeta(this.doc, "model", model.element.id);
    model.addInstance(this);
    subform.instances.push(this);
  } else {
    this.init(subform, elt);
    this.readonly = elt.getAttribute("xf-readonly");
    this.mediatype = elt.getAttribute("xf-mediatype");
    this.src = XsltForms_browser.unescape(elt.getAttribute("xf-src"));
    this.srcDoc = srcDoc.replace(/^\s+|\s+$/gm,'');
    this.model = model;
    this.doc = XsltForms_browser.createXMLDocument("<dummy/>");
    XsltForms_browser.setDocMeta(this.doc, "instance", elt.id);
    XsltForms_browser.setDocMeta(this.doc, "model", model.element.id);
    model.addInstance(this);
    subform.instances.push(this);
  }
}

XsltForms_instance.prototype = new XsltForms_coreElement();
 

    
/**
 * * '''create''' method : checks if this instance has not already been created
 */

XsltForms_instance.create = function(subform, id, model, readonly, mediatype, src, srcDoc) {
  var instelt = document.getElementById(id);
  if (instelt && instelt.xfElement) {
    instelt.xfElement.subforms[subform] = true;
    instelt.xfElement.nbsubforms++;
    subform.instances.push(instelt.xfElement);
    return instelt.xfElement;
  }
  return new XsltForms_instance(subform, id, model, readonly, mediatype, src, srcDoc);
};

    
/**
 * * '''dispose''' method : clears the properties and recycles the associated nodes
 */

XsltForms_instance.prototype.dispose = function(subform) {
  if (subform && this.nbsubforms !== 1) {
    this.subforms[subform] = null;
    this.nbsubforms--;
    return;
  }
  XsltForms_coreElement.prototype.dispose.call(this);
};


    
/**
 * * '''construct''' method : loads the source of this instance locally or remotely
 */

XsltForms_instance.prototype.construct = function(subform) {
  var ser;
  if (!XsltForms_globals.ready || (subform && !subform.ready && this.nbsubforms === 1)) {
    if (this.src) {
      if (this.src.substring(0, 8) === "local://") {
        try {
          if (typeof(localStorage) === 'undefined') {
            throw new Error({ message: "local:// not supported" });
          }
          this.setDoc(window.localStorage.getItem(this.src.substr(8)));
        } catch(e) {
          XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
        }
      } else if (this.src.substr(0, 9) === "opener://") {
        try {
          ser = window.opener.XsltForms_globals.xmlrequest('get', this.src.substr(9));
          this.setDoc(ser);
        } catch (e) {
          XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
        } 
      } else {
        if (this.src.substr(0, 11) === "javascript:") {
          try {
            ser = eval(this.src.substr(11));
            this.setDoc(ser);
          } catch (e) {
            XsltForms_globals.error(this.element, "xforms-link-exception", "Error evaluating the following Javascript expression: "+this.src.substr(11));
          }
        } else {
          var cross = false;
          if (this.src.match(/^[a-zA-Z0-9+\.\-]+:\/\//)) {
            var domain = /^([a-zA-Z0-9+\.\-]+:\/\/[^\/]*)/;
            var sdom = domain.exec(this.src);
            var ldom = domain.exec(document.location.href);
            cross = sdom[0] !== ldom[0];
          }
          if (cross && this.mediatype === "application/javascript") {
            this.setDoc('<dummy xmlns=""/>');
            XsltForms_browser.jsoninstobj = this;
            var scriptelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "script") : document.createElement("script");
            scriptelt.setAttribute("src", this.src+((this.src.indexOf("?") === -1) ? "?" : "&")+"callback=XsltForms_browser.jsoninst");
            scriptelt.setAttribute("id", "jsoninst");
            scriptelt.setAttribute("type", "text/javascript");
            var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
            body.insertBefore(scriptelt, body.firstChild);
          } else {
            try {
              var req = XsltForms_browser.openRequest("GET", this.src, false);
              XsltForms_browser.debugConsole.write("Loading " + this.src);
              if ((this.mediatype === "application/zip" || this.mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" )&& req.overrideMimeType) {
                req.overrideMimeType('text/plain; charset=x-user-defined');
              } else if (this.mediatype === "text/csv") {
                req.overrideMimeType('text/csv');
              } else if (this.mediatype === "text/json" || this.mediatype === "application/json") {
                req.overrideMimeType('application/json; charset=x-user-defined');
              }
              req.send(null);
              if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
                throw new Error({ message: "Request error: " + req.status });
              }
              this.setDocFromReq(req);
            } catch(e) {
              XsltForms_globals.error(this.element, "xforms-link-exception", "Fatal error loading " + this.src, e.toString());
            }
          }
        }
      }
    } else {
      this.setDoc(this.srcDoc);
    }
  }
};


    
/**
 * * '''reset''' method : simply restores the initial copy of this instance
 */

XsltForms_instance.prototype.reset = function() {
  this.setDoc(this.oldDoc, true);
};
 

    
/**
 * * '''store''' method : clones the document of this instance
 */

XsltForms_instance.prototype.store = function(isReset) {
  if (this.oldDoc && !isReset) {
    this.oldDoc = null;
  }
  this.oldDoc = XsltForms_browser.saveDoc(this.doc, this.mediatype);
};


    
/**
 * * '''setDoc''' method : sets a document for this instance
 */

if (!Fleur.DOMParser) {
  XsltForms_instance.prototype.setDoc = function(xml, isReset, preserveOld) {
    var instid = XsltForms_browser.getDocMeta(this.doc, "instance");
    var modid = XsltForms_browser.getDocMeta(this.doc, "model");
    XsltForms_browser.loadDoc(this.doc, xml);
    this.modified = false;
    XsltForms_browser.setDocMeta(this.doc, "instance", instid);
    XsltForms_browser.setDocMeta(this.doc, "model", modid);
    if (!preserveOld) {
      this.store(isReset);
    }
    if (instid === XsltForms_browser.idPf + "instance-config") {
      XsltForms_browser.config = this.doc.documentElement;
      XsltForms_globals.htmlversion = XsltForms_browser.i18n.get("html");
    }
  };
} else {
  XsltForms_instance.prototype.setDoc = function(srcDoc, isReset, preserveOld) {
    var instid = XsltForms_browser.getDocMeta(this.doc, "instance");
    var modid = XsltForms_browser.getDocMeta(this.doc, "model");
    XsltForms_browser.loadDoc(this.doc, srcDoc, this.mediatype);
    this.modified = false;
    XsltForms_browser.setDocMeta(this.doc, "instance", instid);
    XsltForms_browser.setDocMeta(this.doc, "model", modid);
    if (!preserveOld) {
      this.store(isReset);
    }
    if (instid === XsltForms_browser.idPf + "instance-config") {
      XsltForms_browser.config = this.doc.documentElement;
      XsltForms_globals.htmlversion = XsltForms_browser.i18n.get("html");
    }
  };
}
        

    
/**
 * * '''setDocFromReq''' method : sets a document for this instance from a request
 */

if (!Fleur.DOMParser) {
  XsltForms_instance.prototype.setDocFromReq = function(req, isReset, preserveOld) {
    var srcDoc = req.responseText;
    var mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : this.mediatype;
    var lines = mediatype.split(";");
    var i0, len;
    this.mediatype = lines[0];
    for (i0 = 1, len = lines.length; i0 < len; i0++) {
      var vals = lines[i0].split("=");
      switch (vals[0].replace(/^\s+/g,'').replace(/\s+$/g,'')) {
        case "header":
          this.header = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'') === "present";
          break;
        case "separator":
          this.separator = (decodeURI ? decodeURI : unescape)(vals[1].replace(/^\s+/g,'').replace(/\s+$/g,''));
          break;
        case "charset":
          this.charset = vals[1].replace(/^\s+/g,'').replace(/\s+$/g,'');
          break;
      }
    }
    if (XsltForms_browser.isChrome && this.mediatype === "text/plain") {
      switch(this.src.substr(this.src.indexOf("."))) {
        case ".xlsx":
          this.mediatype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case ".docx":
          this.mediatype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case ".csv":
          this.mediatype = "text/csv";
          break;
      }
    }
    var newmediatype = this.mediatype;
    if (newmediatype.substr(newmediatype.length - 4) === "/xml" || newmediatype.substr(newmediatype.length - 4) === "/xsl" || newmediatype.substr(newmediatype.length - 4) === "+xml") {
      newmediatype = "application/xml";
    }
    switch(newmediatype) {
      case "text/json":
      case "application/json":
        var json = eval(srcDoc);
        srcDoc = XsltForms_browser.json2xml("", json, true, false);
        break;
      case "text/csv":
        if (XsltForms_browser.isIE) {
          var convertResponseBodyToText = function (binary) {
            if (!XsltForms_browser.byteMapping) {
              var byteMapping = {};
              for (var i = 0; i < 256; i++) {
                for (var j = 0; j < 256; j++) {
                  byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
                }
              }
              XsltForms_browser.byteMapping = byteMapping;
            }
            var rawBytes = XsltForms_browser_BinaryToArray_ByteStr(binary);
            var lastChr = XsltForms_browser_BinaryToArray_ByteStr_Last(binary);
            return rawBytes.replace(/[\s\S]/g, function (match) { return XsltForms_browser.byteMapping[match]; }) + lastChr;
          };
          srcDoc = XsltForms_browser.csv2xml(convertResponseBodyToText(req.responseBody), this.separator, this.header);
        } else {
          srcDoc = XsltForms_browser.csv2xml(srcDoc, this.separator, this.header);
        }
        break;
      case "text/vcard":
        srcDoc = XsltForms_browser.vcard2xcard(srcDoc);
        break;
      case "application/x-zip-compressed":
      case "application/zip":
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        var arch;
        if (XsltForms_browser.isIE) {
          var convertResponseBodyToTextb = function (binary) {
            if (!XsltForms_browser.byteMapping) {
              var byteMapping = {};
              for (var i = 0; i < 256; i++) {
                for (var j = 0; j < 256; j++) {
                  byteMapping[String.fromCharCode(i + j * 256)] = String.fromCharCode(i) + String.fromCharCode(j);
                }
              }
              XsltForms_browser.byteMapping = byteMapping;
            }
            var rawBytes = XsltForms_browser_BinaryToArray_ByteStr(binary);
            var lastChr = XsltForms_browser_BinaryToArray_ByteStr_Last(binary);
            return rawBytes.replace(/[\s\S]/g, function (match) { return XsltForms_browser.byteMapping[match]; }) + lastChr;
          };
          arch = XsltForms_browser.zip2xml(convertResponseBodyToTextb(req.responseBody), this.mediatype, this.element.id, this.model.element.id);
        } else {
          arch = XsltForms_browser.zip2xml(srcDoc, this.mediatype, this.element.id, this.model.element.id);
        }
        srcDoc = arch.srcDoc;
        delete arch.srcDoc;
        this.archive = arch;
        break;
      case "application/xml":
        break;
      default:
        alert("Unsupported mediatype '" + this.mediatype + "' for instance #" + this.element.id);
        return;
    }
    this.setDoc(srcDoc, isReset, preserveOld);
  };
} else {
  XsltForms_instance.prototype.setDocFromReq = function(req, isReset, preserveOld) {
    var srcDoc = req.responseText;
    if (XsltForms_browser.isChrome && this.mediatype === "text/plain") {
      switch(this.src.substr(this.src.indexOf("."))) {
        case ".xlsx":
          this.mediatype = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
          break;
        case ".docx":
          this.mediatype = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        case ".csv":
          this.mediatype = "text/csv";
          break;
      }
    }
    this.mediatype = req.getResponseHeader('Content-Type') ? req.getResponseHeader('Content-Type') : this.mediatype;
    this.setDoc(srcDoc, isReset, preserveOld);
  };
}

    
/**
 * * '''revalidate''' method : recursively revalidates each node of this instance according to readonly and relevant attributes
 */

XsltForms_instance.prototype.revalidate = function() {
  if (!this.readonly && this.doc.documentElement) {
    this.validation_(this.doc.documentElement);
  }
};

XsltForms_instance.prototype.validation_ = function(node, readonly, notrelevant) {
  if (!readonly) {
    readonly = false;
  }
  if (!notrelevant) {
    notrelevant = false;
  }
  this.validate_(node, readonly, notrelevant);
  readonly = XsltForms_browser.getBoolMeta(node, "readonly");
  notrelevant = XsltForms_browser.getBoolMeta(node, "notrelevant");
  var atts = node.attributes || [];
  if (atts) {
    var atts2 = [];
    for (var i = 0, len = atts.length; i < len; i++) {
      if (atts[i].nodeName.substr(0,10) !== "xsltforms_" && atts[i].nodeName.substr(0,5) !== "xmlns") {
        atts2[atts2.length] = atts[i];
      }
    }
    for (var i2 = 0, len2 = atts2.length; i2 < len2; i2++) {
      this.validation_(atts2[i2], readonly, notrelevant);
    }
  }
  if (node.childNodes) {
    for (var j = 0, len1 = node.childNodes.length; j < len1; j++) {
      var child = node.childNodes[j];
      if (child.nodeType === Fleur.Node.ELEMENT_NODE) {
        this.validation_(child, readonly, notrelevant);
      }
    }
  }
};

XsltForms_instance.prototype.validate_ = function(node, readonly, notrelevant) {
  var bindids = XsltForms_browser.getMeta(node, "bind");
  var value = XsltForms_globals.xmlValue(node);
  var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
  if (bindids) {
    var binds = bindids.split(" ");
    var relevantfound = false;
    var readonlyfound = false;
    for (var i = 0, len = binds.length; i < len; i++) {
      var bind = XsltForms_collection[binds[i]].xfElement;
      var nodes = bind.nodes;
      var i2 = 0;
      for (var len2 = nodes.length; i2 < len2; i2++) {
        if (nodes[i2] === node) {
          break;
        }
      }
      for (var j = 0, len3 = bind.depsNodes.length; j < len3; j++) {
        XsltForms_browser.rmValueMeta(bind.depsNodes[j], "depfor", bind.depsId);
      }
      bind.depsNodes.length = 0;
      var ctx = new XsltForms_exprContext(this.subform, node, i2, nodes, null, null, null, [], bind.depsId);
      if (bind.required) {
        this.setProperty_(node, "required", bind.required.evaluate(ctx, node));
      }
      if (notrelevant || !relevantfound || bind.relevant) {
        this.setProperty_(node, "notrelevant", notrelevant || !(bind.relevant? bind.relevant.evaluate(ctx, node) : true));
        relevantfound = relevantfound || bind.relevant;
      }
      if (readonly || !readonlyfound || bind.readonly) {
        this.setProperty_(node, "readonly", readonly || (bind.readonly? bind.readonly.evaluate(ctx, node) : bind.calculate ? true : false));
        readonlyfound = readonlyfound || bind.readonly;
      }
      this.setProperty_(node, "invalid",
        !XsltForms_browser.getBoolMeta(node, "notrelevant") && !(!(XsltForms_browser.getBoolMeta(node, "required") && (!value || value === "")) &&
        (XsltForms_browser.getNil(node) ? value === "" : !schtyp || schtyp.validate(value) && !XsltForms_browser.getBoolMeta(node, "unsafe")) &&
        (!bind.constraint || bind.constraint.evaluate(ctx, node))));
      var inst = this;
      Object.entries(bind.meta).forEach(function(m) {
        var valueb = String(m[1].evaluate(ctx, node));
        if (XsltForms_browser.getMeta(node, "meta-" + m[0]) !== valueb) {
          XsltForms_browser.setMeta(node, "meta-" + m[0], valueb);
          inst.model.addChange(node);   
        }
      });
      XsltForms_browser.copyArray(ctx.depsNodes, bind.depsNodes);
    }
  } else {
    this.setProperty_(node, "notrelevant", notrelevant);
    this.setProperty_(node, "readonly", readonly);
    this.setProperty_(node, "invalid", schtyp && (!schtyp.validate(value) || XsltForms_browser.getBoolMeta(node, "unsafe")));
  }
};

XsltForms_instance.prototype.setProperty_ = function (node, property, value) {
  if (XsltForms_browser.getBoolMeta(node, property) !== value) {
    XsltForms_browser.setBoolMeta(node, property, value);
    this.model.addChange(node);   
  }
};

    
/**
 * * '''json2xml''' function : converts json to xml notation
 */

XsltForms_browser.json2xmlreg = new RegExp("^[A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\xFF][A-Za-z_\xC0-\xD6\xD8-\xF6\xF8-\xFF\-\.0-9\xB7]*$");
XsltForms_browser.json2xml = function(eltname, json, root, inarray) {
  var fullname = "";
  if (eltname === "________" || !(json instanceof Array) && eltname !== "" && !XsltForms_browser.json2xmlreg.test(eltname)) {
    fullname = " exml:fullname=\"" + XsltForms_browser.escape(eltname) + "\"";
    eltname = "________";
  }
  var ret = root ? "<exml:anonymous xmlns:exml=\"http://www.agencexml.com/exml\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:exsi=\"http://www.agencexml.com/exi\" xmlns=\"\">" : "";
  if (json instanceof Array) {
    if (inarray) {
      ret += "<exml:anonymous exsi:maxOccurs=\"unbounded\">";
    }
    if (json.length === 0) {
      ret += "<" + (eltname === "" ? "exml:anonymous" : eltname) + fullname + " exsi:maxOccurs=\"unbounded\" xsi:nil=\"true\"/>";
    } else {
      for (var i = 0, len = json.length; i < len; i++) {
        ret += XsltForms_browser.json2xml(eltname === "" ? "exml:anonymous" : eltname, json[i], false, true);
      }
    }
    if (inarray) {
      ret += "</exml:anonymous>";
    }
  } else {
    var xsdtype = "";
    switch(typeof(json)) {
      case "string":
        xsdtype = " xsi:type=\"xsd:string\"";
        break;
      case "number":
        xsdtype = " xsi:type=\"xsd:double\"";
        break;
      case "boolean":
        xsdtype = " xsi:type=\"xsd:boolean\"";
        break;
      case "object":
        if (json instanceof Date) {
          xsdtype = " xsi:type=\"xsd:dateTime\"";
        }
        break;
    }
    if (eltname === "") {
      if (root && xsdtype !== "") {
        ret = ret.substr(0, ret.length - 1) + xsdtype + ">";
      }
    } else {
      ret += "<"+eltname+fullname+(inarray?" exsi:maxOccurs=\"unbounded\"":"")+xsdtype+">";
    }
    if (typeof(json) === "object" && !(json instanceof Date)) {
      for (var m in json) {
        if (json.hasOwnProperty(m)) {
          ret += XsltForms_browser.json2xml(m, json[m], false, false);
        }
      }
    } else {
      if (json instanceof Date) {
        ret += json.getFullYear() + "-";
        ret += (json.getMonth() < 9 ? "0" : "") + (json.getMonth()+1) + "-";
        ret += (json.getDate() < 10 ? "0" : "") + json.getDate() + "T";
        ret += (json.getHours() < 10 ? "0" : "") + json.getHours() + ":";
        ret += (json.getMinutes() < 10 ? "0" : "") + json.getMinutes() + ":";
        ret += (json.getSeconds() < 10 ? "0" : "") + json.getSeconds() + "Z";
      } else {
        ret += XsltForms_browser.escape(json);
      }
    }
    ret += eltname === "" ? "" : "</"+eltname+">";
  }
  ret += root ? "</exml:anonymous>" : "";
  return ret;
};

    
/**
 * * '''xml2json''' function : converts xml to json notation
 */

XsltForms_browser.node2json = function(node, comma) {
  var xsdtype, inarray, att, lname, s = "", i, l, lc, t;
  if (node.nodeType !== Fleur.Node.ELEMENT_NODE) {
    return "";
  }
  lname = node.localName ? node.localName : node.baseName;
  if (node.getAttributeNS) {
    xsdtype = node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type");
    inarray = node.getAttributeNS("http://www.agencexml.com/exi", "maxOccurs") === "unbounded";
    if (lname === "________") {
      lname = node.getAttributeNS("http://www.agencexml.com/exml", "fullname");
    }
  } else {
    att = node.selectSingleNode("@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
    xsdtype = att ? att.value : "";
    att = node.selectSingleNode("@*[local-name()='maxOccurs' and namespace-uri()='http://www.agencexml.com/exi']");
    inarray = att ? att.value === "unbounded" : false;
    if (lname === "________") {
      att = node.selectSingleNode("@*[local-name()='fullname' and namespace-uri()='http://www.agencexml.com/exml']");
      lname = att ? att.value : "";
    }
  }
  s = "";
  if (lname !== "anonymous" || node.namespaceURI !== "http://www.agencexml.com/exml") {
    s += lname + ":";
  }
  if (inarray) {
    s = "[";
    lc = 0;
    for (i = 0, l = node.childNodes.length; i < l; i++) {
      if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
        lc = i;
      }
    }
    for (i = 0; i <= lc; i++) {
      s += XsltForms_browser.node2json(node.childNodes[i], (i === lc ? "" : ","));
    }
    return s + "]" + comma;
  }
  t = node.text || node.textContent;
  switch (xsdtype) {
    case "xsd:string":
      return s + '"' + XsltForms_browser.escapeJS(t) + '"' + comma;
    case "xsd:double":
    case "xsd:boolean":
      return s + t + comma;
    case "xsd:dateTime":
      return s + 'new Date("' + t + '")' + comma;
    default:
      s += "{";
      lc = 0;
      for (i = 0, l = node.childNodes.length; i < l; i++) {
        if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
          lc = i;
        }
      }
      for (i = 0; i <= lc; i++) {
        s += XsltForms_browser.node2json(node.childNodes[i], (i === lc ? "" : ","));
      }
      return s + "}" + comma;
  }
};
XsltForms_browser.xml2json = function(s) {
  var d = XsltForms_browser.createXMLDocument(s);
  return XsltForms_browser.node2json(d.documentElement, "");
};

    
/**
 * * '''jsoninst''' function : replaces instance data from json content
 */

var jsoninst = function(json) {
  XsltForms_browser.jsoninstobj.submission.pending = false;
  XsltForms_browser.dialog.hide("xsltforms-status-panel", false);
  XsltForms_browser.jsoninstobj.instance.setDoc(XsltForms_browser.json2xml("", json, true, false));
  XsltForms_globals.addChange(XsltForms_browser.jsoninstobj.instance.model);
  XsltForms_xmlevents.dispatch(XsltForms_browser.jsoninstobj.instance.model, "xforms-rebuild");
  XsltForms_globals.refresh();
  document.body.removeChild(document.getElementById("jsoninst"));
};
    
    
/**
 * * '''vcard2xcard''' function : converts vcard to xcard notation
 */

XsltForms_browser.vcard2xcard_data = {
  state: 0,
  version: "4.0",
  reg_date: /^(\d{8}|\d{4}-\d\d|--\d\d(\d\d)?|---\d\d)$/,
  reg_time: /^(\d\d(\d\d(\d\d)?)?|-\d\d(\d\d?)|--\d\d)(Z|[+\-]\d\d(\d\d)?)?$/,
  reg_date_time: /^(\d{8}|--\d{4}|---\d\d)T\d\d(\d\d(\d\d)?)?(Z|[+\-]\d\d(\d\d)?)?$/,
  reg_uri: /^(([^:\/?#]+):)?(\/\/([^\/\?#]*))?([^\?#]*)(\?([^#]*))?(#([^\:#\[\]\@\!\$\&\\'\(\)\*\+\,\;\=]*))?$/,
  reg_utc_offset: /^[+\-]\d\d(\d\d)?$/
};

XsltForms_browser.vcard2xcard_escape = function(s) {
  return s.replace(/&/gm,"&amp;").replace(/</gm,"&lt;").replace(/>/gm,"&gt;").replace(/\\;/gm,";");
};

XsltForms_browser.vcard2xcard_param = {
  "PREF":        {fparam: function(value) {return "<integer>" + value + "</integer>";}},
  "TYPE":        {fparam: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}}
};

XsltForms_browser.vcard2xcard_prop = {
  "BEGIN":       {state: 0, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.state = 1; return value.toUpperCase() === "VCARD" ? "<vcard>" : "<'Invalid directive: BEGIN:" + value + "'>";}},
  "END":         {state: 1, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.state = 0; return value.toUpperCase() === "VCARD" ? "</vcard>" : "<'Invalid directive: END:" + value + "'>";}},
  "SOURCE":      {state: 1, tag: "source", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "KIND":        {state: 1, tag: "kind", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "XML":         {state: 1, fvalue: function(value) {return value;}},
  "FN":          {state: 1, tag: "fn", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "N":           {state: 1, tag: "n", fvalue: function(value) {var n = value.split(";"); return "<surname>" + XsltForms_browser.vcard2xcard_escape(n[0]) + "</surname><given>" + XsltForms_browser.vcard2xcard_escape(n[1]) + "</given><additional>" + XsltForms_browser.vcard2xcard_escape(n[2]) + "</additional><prefix>" + XsltForms_browser.vcard2xcard_escape(n[3]) + "</prefix><suffix>" + XsltForms_browser.vcard2xcard_escape(n[4]) + "</suffix>";}},
  "NICKNAME":    {state: 1, tag: "nickname", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "PHOTO":       {state: 1, tag: "photo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "BDAY":        {state: 1, tag: "bday", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_date_time.test(value) ? "<date-time>" + value + "</date-time>" : XsltForms_browser.vcard2xcard_data.reg_date.test(value) ? "<date>" + value + "</date>" : XsltForms_browser.vcard2xcard_data.reg_time.test(value) ? "<time>" + value + "</time>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
  "ANNIVERSARY": {state: 1, tag: "anniversary", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_date_time.test(value) ? "<date-time>" + value + "</date-time>" : XsltForms_browser.vcard2xcard_data.reg_date.test(value) ? "<date>" + value + "</date>" : XsltForms_browser.vcard2xcard_data.reg_time.test(value) ? "<time>" + value + "</time>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
  "GENDER":      {state: 1, tag: "gender", fvalue: function(value) {var gender = value.split(";"); return "<sex>" + gender[0] + "</sex>" + (value.indexOf(";") !== -1 ? "<identity>" + XsltForms_browser.vcard2xcard_escape(gender[1]) + "</identity>": "");}},
  "ADR":         {state: 1, tag: "adr", fvalue: function(value) {var adr = value.split(";"); return "<pobox>" + XsltForms_browser.vcard2xcard_escape(adr[0]) + "</pobox><ext>" + XsltForms_browser.vcard2xcard_escape(adr[1]) + "</ext><street>" + XsltForms_browser.vcard2xcard_escape(adr[2]) + "</street><locality>" + XsltForms_browser.vcard2xcard_escape(adr[3]) + "</locality><region>" + XsltForms_browser.vcard2xcard_escape(adr[4]) + "</region><code>" + XsltForms_browser.vcard2xcard_escape(adr[5]) + "</code><country>" + XsltForms_browser.vcard2xcard_escape(adr[6]) + "</country>";}},
  "TEL":         {state: 1, tag: "tel", fvalue: function(value) {return (XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>");}},
  "EMAIL":       {state: 1, tag: "email", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "IMPP":        {state: 1, tag: "impp", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "LANG":        {state: 1, tag: "lang", fvalue: function(value) {return "<language-tag>" + value + "</language-tag>";}},
  "TZ":          {state: 1, tag: "tz", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : XsltForms_browser.vcard2xcard_data.reg_utc_offset.test(value) ? "<utc-offset>" + value + "</utc-offset>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "GEO":         {state: 1, tag: "geo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "TITLE":       {state: 1, tag: "title", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "ROLE":        {state: 1, tag: "role", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "LOGO":        {state: 1, tag: "logo", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "ORG":         {state: 1, tag: "org", fvalue: function(value) {var orgs = value.split(";"); var s = ""; for (var i = 0, len = orgs.length; i < len; i++) { s += "<text>" + XsltForms_browser.vcard2xcard_escape(orgs[i]) + "</text>";} return s;}},
  "MEMBER":      {state: 1, tag: "member", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "RELATED":     {state: 1, tag: "related", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "CATEGORIES":  {state: 1, tag: "categories", fvalue: function(value) {var cats = value.split(";"); var s = ""; for (var i = 0, len = cats.length; i < len; i++) { s += "<text>" + XsltForms_browser.vcard2xcard_escape(cats[i]) + "</text>";} return s;}},
  "NOTE":        {state: 1, tag: "note", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "X-LOTUS-BRIEFCASE":        {state: 1, tag: "x-lotus-briefcase", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "PRODID":      {state: 1, tag: "prodid", fvalue: function(value) {return "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "REV":         {state: 1, tag: "rev", fvalue: function(value) {return "<timestamp>" + value + "</timestamp>";}},
  "SOUND":       {state: 1, tag: "sound", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "UID":         {state: 1, tag: "uid", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "CLIENTPIDMAP":{state: 1, tag: "clientpidmap", fvalue: function(value) {var cmap = value.split(";"); return "<sourceid>" + cmap[0] + "</sourceid><value-uri>" + cmap[1] + "</value-uri>";}},
  "URL":         {state: 1, tag: "url", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "VERSION":     {state: 1, fvalue: function(value) {XsltForms_browser.vcard2xcard_data.version = value; return "";}},
  "KEY":         {state: 1, tag: "key", fvalue: function(value) {return XsltForms_browser.vcard2xcard_data.reg_uri.test(value) ? "<uri>" + value + "</uri>" : "<text>" + XsltForms_browser.vcard2xcard_escape(value) + "</text>";}},
  "FBURL":       {state: 1, tag: "fburl", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "CALADRURI":   {state: 1, tag: "caladruri", fvalue: function(value) {return "<uri>" + value + "</uri>";}},
  "CALURI":      {state: 1, tag: "caluri", fvalue: function(value) {return "<uri>" + value + "</uri>";}}
};

XsltForms_browser.vcard2xcard = function(v) {
  var s = '<vcards xmlns="urn:ietf:params:xml:ns:vcard-4.0">';
  var vcards = v.replace(/(\r\n|\n|\r) /gm,"").replace(/^\s+/,"").replace(/\s+$/,"").split("\n");
  for (var i = 0, len = vcards.length; i < len; i++) {
    var sep = vcards[i].indexOf(":");
    var before = vcards[i].substring(0, sep);
    var after = vcards[i].substring(sep + 1);
    var propnames = before.split(";");
    var p = XsltForms_browser.vcard2xcard_prop[propnames[0]];
    if (p && p.state === XsltForms_browser.vcard2xcard_data.state) {
      var val = after.replace(/\\n/gm,"\n").replace(/\\,/gm,",");
      if (p.tag) {
        s += "<" + p.tag + ">";
      }
      if (propnames.length > 1) {
        s += "<parameters>";
        propnames.shift();
        for (var j = 0, len2 = propnames.length; j < len2;) {
          var par = propnames[j].split("=");
          var parname = par[0];
          var parobj = XsltForms_browser.vcard2xcard_param[parname];
          if (parobj) {
            s += "<" + parname.toLowerCase() + ">";
            while (par[0] === parname) {
              s += parobj.fparam(par[1]);
              j++;
              if (j < len2) {
                par = propnames[j].split("=");
              } else {
                break;
              }
            }
            s += "</" + parname.toLowerCase() + ">";
          } else {
            j++;
          }
        }
        s += "</parameters>";
      }
      s += p.fvalue(val);
      if (p.tag) {
        s += "</" + p.tag + ">";
      }
    }
  }
  return s + "</vcards>";
};

XsltForms_browser.xml2csv = function(s, sep) {
  var d = XsltForms_browser.createXMLDocument(s);
  var n0 = d.documentElement.firstChild;
  while (n0 && n0.nodeType !== Fleur.Node.ELEMENT_NODE) {
    n0 = n0.nextSibling;
  }
  var h = n0.cloneNode(true);
  d.documentElement.insertBefore(h, n0);
  var n = h;
  var r = "";
  sep = sep || ",";
  var seps = sep.split(" ");
  var fsep = seps[0];
  var decsep = seps[1];
  while (n) {
    if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
      var m = n.firstChild;
      var l = "";
      while (m) {
        if (m.nodeType === Fleur.Node.ELEMENT_NODE) {
          var v = n === h ? m.getAttribute("fullname") || m.localName : m.text !== undefined ? m.text : m.textContent;
          if (v.indexOf("\n") !== -1 || v.indexOf(fsep) !== -1) {
            v = '"' + v.replace(/"/gm, '""') + '"';
          } else if (decsep && v.match(/^[\-+]?([0-9]+(\.[0-9]*)?|\.[0-9]+)$/)) {
            v = v.replace(/\./, decsep);
          }
          l += fsep + v;
        }
        m = m.nextSibling;
      }
      r += l.substr(1) + "\n";
    }
    n = n.nextSibling;
  }
  return r;
};

XsltForms_browser.csv2xml = function(s, sep, head) {
  var r = "<exml:anonymous xmlns:exml=\"http://www.agencexml.com/exml\" xmlns:xsi=\"http://www.w3.org/1999/XMLSchema-instance\" xmlns:exsi=\"http://www.agencexml.com/exi\" xmlns=\"\">";
  s = s.replace(/\r\n/g,"\n").replace(/\r/g,"\n");
  if (s.substr(s.length - 1, 1) !== "\n") {
    s += "\n";
  }
  var headers = [];
  var first = head;
  var col = 0;
  var rowcat = "";
  var row = "";
  for (var i = 0, l = s.length; i < l; ) {
    var v = "";
    if (s.substr(i, 1) === '"') {
      i++;
      do {
        if (s.substr(i, 1) !== '"') {
          v += s.substr(i, 1);
          i++;
        } else {
          if (s.substr(i, 2) === '""') {
            v += '"';
            i += 2;
          } else {
            i++;
            break;
          }
        }
      } while (i < l);
    } else {
      while (s.substr(i, sep.length) !== sep && s.substr(i, 1) !== "\n") {
        v += s.substr(i, 1);
        i++;
      }
    }
    if (first) {
      headers.push(v);
    } else {
      rowcat += v;
      row += "<" + (head ? headers[col] : "exml:anonymous") + ">" + XsltForms_browser.escape(v) + "</" + (head ? headers[col] : "exml:anonymous") + ">";
    }
    if (s.substr(i, 1) === "\n") {
      if (!first && rowcat !== "") {
        r += "<exml:anonymous>" + row + "</exml:anonymous>";
      }
      first = false;
      col = 0;
      row = "";
      rowcat = "";
    } else {
      col++;
    }
    i++;
  }
  return r + "</exml:anonymous>";
};

XsltForms_browser.xsltsharedsrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ss="http://schemas.openxmlformats.org/spreadsheetml/2006/main" version="1.0">';
XsltForms_browser.xsltsharedsrc += '  <xsl:output method="text"/>';
XsltForms_browser.xsltsharedsrc += '  <xsl:template match="ss:si">';
XsltForms_browser.xsltsharedsrc += '    <xsl:value-of select="concat(\'|\',position() - 1,\':\',ss:t)"/>';
XsltForms_browser.xsltsharedsrc += '  </xsl:template>';
XsltForms_browser.xsltsharedsrc += '</xsl:stylesheet>';

XsltForms_browser.xsltinlinesrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ss="http://schemas.openxmlformats.org/spreadsheetml/2006/main" version="1.0">';
XsltForms_browser.xsltinlinesrc += '  <xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltinlinesrc += '  <xsl:param name="shared"/>';
XsltForms_browser.xsltinlinesrc += '  <xsl:template match="ss:c[@t=\'s\']" priority="1">';
XsltForms_browser.xsltinlinesrc += '    <xsl:copy>';
XsltForms_browser.xsltinlinesrc += '      <xsl:attribute name="t">inlineStr</xsl:attribute>';
XsltForms_browser.xsltinlinesrc += '      <xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltinlinesrc += '      <ss:is><ss:t><xsl:value-of select="substring-before(substring-after($shared,concat(\'|\',ss:v,\':\')),\'|\')"/></ss:t></ss:is>';
XsltForms_browser.xsltinlinesrc += '    </xsl:copy>';
XsltForms_browser.xsltinlinesrc += '  </xsl:template>';
XsltForms_browser.xsltinlinesrc += '  <xsl:template match="@t[parent::ss:c and . = \'s\']" priority="1"/>';
XsltForms_browser.xsltinlinesrc += '  <xsl:template match="ss:v[parent::ss:c/@t = \'s\']" priority="1"/>';
XsltForms_browser.xsltinlinesrc += '  <xsl:template match="@*|node()" priority="0">';
XsltForms_browser.xsltinlinesrc += '    <xsl:copy>';
XsltForms_browser.xsltinlinesrc += '      <xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltinlinesrc += '    </xsl:copy>';
XsltForms_browser.xsltinlinesrc += '  </xsl:template>';
XsltForms_browser.xsltinlinesrc += '</xsl:stylesheet>';

XsltForms_browser.zip2xml = function(z, mediatype, instid, modid) {
  var arch = {};
  var f;
  var r = "<exml:archive xmlns:exml=\"http://www.agencexml.com/exml\">";
  var offset = z.lastIndexOf("PK\x05\x06")+16;
  var r2 = function(z, offset) {
    return ((z.charCodeAt(offset+1) & 0xFF)<< 8) | z.charCodeAt(offset) & 0xFF;
  };
  var r4 = function(z, offset) {
    return ((((((z.charCodeAt(offset+3) & 0xFF)<< 8) | z.charCodeAt(offset+2) & 0xFF)<< 8) | z.charCodeAt(offset+1) & 0xFF)<< 8) | z.charCodeAt(offset) & 0xFF;
  };
  offset = r4(z, offset);
  while (z.charCodeAt(offset) === 80 && z.charCodeAt(offset+1) === 75 && z.charCodeAt(offset+2) === 1 && z.charCodeAt(offset+3) === 2) {
    f = {};
    offset += 4;
    f.versionMadeBy = r2(z, offset);
    offset += 2;
    f.versionNeeded = r2(z, offset);
    offset += 2;
    f.bitFlag = r2(z, offset);
    offset += 2;
    f.compressionMethod = r2(z, offset);
    offset += 2;
    f.date = r4(z, offset);
    offset += 4;
    f.crc32 = r4(z, offset);
    offset += 4;
    f.compressedSize = r4(z, offset);
    offset += 4;
    f.uncompressedSize = r4(z, offset);
    offset += 4;
    f.fileNameLength = r2(z, offset);
    offset += 2;
    f.extraFieldsLength = r2(z, offset);
    offset += 2;
    f.fileCommentLength = r2(z, offset);
    offset += 2;
    f.diskNumber = r2(z, offset);
    offset += 2;
    f.internalFileAttributes = r2(z, offset);
    offset += 2;
    f.externalFileAttributes = r4(z, offset);
    offset += 4;
    f.localHeaderOffset = r4(z, offset);
    offset += 4;
    var fileName = z.substr(offset, f.fileNameLength);
    offset += f.fileNameLength;
    f.extraFields = z.substr(offset, f.extraFieldsLength);
    offset += f.extraFieldsLength;
    f.fileComment = z.substr(offset, f.fileCommentLength);
    offset += f.fileCommentLength;
    //f.dir = f.externalFileAttributes & 0x00000010 ? true : false;
    var loffset = f.localHeaderOffset + 28;
    f.lextraFieldsLength = r2(z, loffset);
    loffset += 2 + f.fileNameLength;
    f.lextraFields = z.substr(loffset, f.lextraFieldsLength);
    loffset += f.lextraFieldsLength;
    f.compressedFileData = z.substr(loffset, f.compressedSize);
    if (mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && (fileName.substr(fileName.length - 4) === ".xml" || fileName.substr(fileName.length - 5) === ".rels")) {
      f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
      XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
      XsltForms_browser.setDocMeta(f.doc, "instance", instid);
      XsltForms_browser.setDocMeta(f.doc, "model", modid);
    }
    r += '<exml:file name="' + fileName + '"/>';
    arch[fileName] = f;
  }
  r += "</exml:archive>";
  if (mediatype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && arch.hasOwnProperty("xl/sharedStrings.xml")) {
    var shared = XsltForms_browser.transformText(XsltForms_browser.saveDoc(arch["xl/sharedStrings.xml"].doc, "application/xml"), XsltForms_browser.xsltsharedsrc, true) + "|";
    for (var fn in arch) {
      if (arch.hasOwnProperty(fn)) {
        f = arch[fn];
        if (f.doc && (f.doc.documentElement.localName ? f.doc.documentElement.localName : f.doc.documentElement.baseName) === "worksheet") {
          var inlineStr = XsltForms_browser.transformText(XsltForms_browser.saveDoc(f.doc, "application/xml"), XsltForms_browser.xsltinlinesrc, true, "shared", shared);
          XsltForms_browser.loadDoc(f.doc, inlineStr);
          XsltForms_browser.setDocMeta(f.doc, "instance", instid);
          XsltForms_browser.setDocMeta(f.doc, "model", modid);
        }
      }
    }
  }
  arch.srcDoc = r;
  return arch;
};

XsltForms_browser.xml2zip = function(arch, mediatype) {
  var z = "";
  var fn, f;
  var fcount = 0;
  var w2 = function(v) {
    return String.fromCharCode(v & 0xFF) + String.fromCharCode((v >>> 8) & 0xFF);
  };
  var w4 = function(v) {
    return String.fromCharCode(v & 0xFF) + String.fromCharCode((v >>> 8) & 0xFF) + String.fromCharCode((v >>> 16) & 0xFF) + String.fromCharCode((v >>> 24) & 0xFF);
  };
  for (fn in arch) {
    if (arch.hasOwnProperty(fn)) {
      f = arch[fn];
      f.localHeaderOffset = z.length;
      if (f.doc) {
        var ser = XsltForms_browser.utf8encode(XsltForms_browser.saveDoc(f.doc, "application/xml"));
        if (mediatype.indexOf("application/vnd.openxmlformats-officedocument.") === 0) {
          var x14ac = ser.indexOf(' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"');
          var rattr = f.doc.documentElement.attributes;
          for (var ri = 0, li = rattr.length; ri < li; ri++) {
            if (rattr[ri].localName === "Ignorable" && rattr[ri].namespaceURI === "http://schemas.openxmlformats.org/markup-compatibility/2006") {
              if (x14ac === -1 || x14ac > ser.indexOf("Ignorable")) {
                ser = ser.substr(0, ser.indexOf(" ")) + ' xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"' + ser.substr(ser.indexOf(" "));
                break;
              }
            }
          }
        }
        ser = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n' + ser;
        f.crc32 = XsltForms_browser.crc32(ser);
        f.uncompressedSize = ser.length;
        f.compressedFileData = zip_deflate(ser);
        f.compressedSize = f.compressedFileData.length;
      }
      z += "PK\x03\x04";
      z += w2(f.versionNeeded);
      z += w2(f.bitFlag);
      z += w2(f.compressionMethod);
      z += w4(f.date);
      z += w4(f.crc32);
      z += w4(f.compressedSize);
      z += w4(f.uncompressedSize);
      z += w2(f.fileNameLength);
      z += w2(f.lextraFieldsLength);
      z += fn;
      z += f.lextraFields;
      z += f.compressedFileData;
      fcount++;
    }
  }
  var diroffset = z.length;
  for (fn in arch) {
    if (arch.hasOwnProperty(fn)) {
      f = arch[fn];
      z += "PK\x01\x02";
      z += w2(f.versionMadeBy);
      z += w2(f.versionNeeded);
      z += w2(f.bitFlag);
      z += w2(f.compressionMethod);
      z += w4(f.date);
      z += w4(f.crc32);
      z += w4(f.compressedSize);
      z += w4(f.uncompressedSize);
      z += w2(f.fileNameLength);
      z += w2(f.extraFieldsLength);
      z += w2(f.fileCommentLength);
      z += w2(f.diskNumber);
      z += w2(f.internalFileAttributes);
      z += w4(f.externalFileAttributes);
      z += w4(f.localHeaderOffset);
      z += fn;
      z += f.extraFields;
      z += f.fileComment;
    }
  }
  var endoffset = z.length;
  z += "PK\x05\x06";
  z += w2(0);
  z += w2(0);
  z += w2(fcount);
  z += w2(fcount);
  z += w4(endoffset - diroffset);
  z += w4(diroffset);
  var comment = "generated by XSLTForms - http://www.agencexml.com";
  z += w2(comment.length);
  z += comment;
  var data = [];
  for( var di = 0, dl = z.length; di < dl; di++) {
    data.push(z.charCodeAt(di) & 0xff);
  }
  try {
    var z2 = new Uint8Array(data);
    return z2.buffer;
  } catch (e) {
    return XsltForms_browser.StringToBinary(z);
  }
};