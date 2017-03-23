/*eslint-env browser*/
/*globals Fleur XsltForms_globals XsltForms_upload XsltForms_domEngine XsltForms_idManager XsltForms_schema XsltForms_xmlevents ActiveXObject XSLTProcessor XsltForms_undefined XsltForms_fullDomEngine*/
"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module browser
 * @description  === "browser" class ===
 * XsltForms_browser class for browsers compatibility
 */

var XsltForms_browser = {
	jsFileName : "xsltforms.js",

		
/**
 * * '''isOpera''', '''isIE''' and '''isMozilla''' methods : return browser family
 */

	isOpera: navigator.userAgent.match(/\bOpera\b/) !== null,
	isIE: navigator.userAgent.match(/\bMSIE\b/) !== null && navigator.userAgent.match(/\bOpera\b/) === null,
	isIE9: navigator.userAgent.match(/\bMSIE\b/) !== null && navigator.userAgent.match(/\bOpera\b/) === null && window.addEventListener,
	isIE6: navigator.userAgent.match(/\bMSIE 6\.0/) !== null,
	isIE11: navigator.userAgent.match(/\bTrident\/7\.0/) !== null,
	isMozilla: navigator.userAgent.match(/\bGecko\b/) !== null,
	isSafari: navigator.userAgent.match(/\bAppleWebKit/) !== null && navigator.userAgent.match(/\bEdge/) === null && !window.FileReader,
	isChrome: navigator.userAgent.match(/\bAppleWebKit/) !== null && navigator.userAgent.match(/\bEdge/) === null,
	isEdge: navigator.userAgent.match(/\bEdge/) !== null,
	isFF2: navigator.userAgent.match(/\bFirefox[\/\s]2\.\b/) !== null,
	isXhtml: false, // document.documentElement.namespaceURI === "http://www.w3.org/1999/xhtml",
	setClass: function(element, className, value) {
		XsltForms_browser.assert(element && className);
		if (value) {
			if (!this.hasClass(element, className)) {
				if (typeof element.className === "string") {
					element.className += " " + className;
				} else {
					element.className.baseVal += " " + className;
				}
			}
		} else if (element.className) {
			if (typeof element.className === "string") {
				element.className = element.className.replace(className, "");
			} else {
				element.className.baseVal = element.className.baseVal.replace(className, "");
			}
		}
	},

		
/**
 * * '''hasClass''' method : tests if an element has a CSS class
 */

	hasClass : function(element, className) {
		var cn = element.className;
		var cn2 = typeof cn === "string" ? cn : cn.baseVal;
		return XsltForms_browser.inArray(className, (cn2 && cn2.split(" ")) || []);
	},
	initHover : function(element) {
		XsltForms_browser.events.attach(element, "mouseover", function(evt) {
			XsltForms_browser.setClass(XsltForms_browser.events.getTarget(evt), "hover", true);
		} );
		XsltForms_browser.events.attach(element, "mouseout", function(evt) {
			XsltForms_browser.setClass(XsltForms_browser.events.getTarget(evt), "hover", false);
		} );
	},
	getEventPos : function(ev) {
		ev = ev || window.event;
		return { x : ev.pageX || ev.clientX + window.document.body.scrollLeft || 0,
			y : ev.pageY || ev.clientY + window.document.body.scrollTop || 0 };
	},
	getAbsolutePos : function(e) {
		var r = XsltForms_browser.getPos(e);
		if (e.offsetParent) {
			var tmp = XsltForms_browser.getAbsolutePos(e.offsetParent);
			r.x += tmp.x;
			r.y += tmp.y;
		}
		return r;
	},
	getPos : function(e) {
		var is_div = /^div$/i.test(e.tagName);
		var r = {
			x: e.offsetLeft - (is_div && e.scrollLeft? e.scrollLeft : 0),
			y: e.offsetTop - (is_div && e.scrollTop? e.scrollTop : 0)
		};
		return r;
	},
	setPos : function(element, left, topy) {
		if (element.offsetParent) {
			var tmp = XsltForms_browser.getAbsolutePos(element.offsetParent);
			left -= tmp.x;
			topy -= tmp.y;
		}
		element.style.top = topy + "px";
		element.style.left = left + "px";
	},

		
/**
 * * '''loadProperties''' method : AJAX method to get I18N properties
 */

	loadProperties : function(fname, f) {
		var uri = this.ROOT + fname;
		var synchr = !f;
		var req = XsltForms_browser.openRequest("GET", uri, !synchr);
		var func = function() {
			if (!synchr && req.readyState !== 4) {
				return;
			}
			try {
				if (req.status === 1223) {
					req.status = 204;
					req.statusText = "No Content";
				}
				if (req.status !== 0 && (req.status < 200 || req.status >= 300)) {
					return;
				}
				var ndoc = XsltForms_browser.createXMLDocument(req.responseText);
				var n = ndoc.documentElement;
				while (n) {
					if (n.nodeName === "properties") {
						break;
					}
					if (n.firstChild) {
						n = n.firstChild;
					} else {
						while (n && !n.nextSibling) {
							n = n.parentNode;
						}
						if (n && n.nextSibling) {
							n = n.nextSibling;
						}
					}
				}
				var r = XsltForms_browser.config.ownerDocument.importNode(n, true);
				XsltForms_browser.config.parentNode.replaceChild(r, XsltForms_browser.config);
				var inst = document.getElementById(XsltForms_browser.idPf + "instance-config").xfElement;
				XsltForms_browser.config = inst.doc.documentElement;
				inst.srcDoc = XsltForms_browser.saveDoc(inst.doc, "application/xml");
				XsltForms_browser.setDocMeta(inst.doc, "instance", XsltForms_browser.idPf + "instance-config");
				XsltForms_browser.setDocMeta(inst.doc, "model", XsltForms_browser.idPf + "model-config");
				XsltForms_globals.language = XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
				//XMLEvents.dispatch(properties.model, "xforms-rebuild");
				//xforms.refresh();
			} catch (e) {
			}
			if (!synchr) {
				f();
			}
		};
		if (!synchr) {
			req.onreadystatechange = func;
		}
		if (req.overrideMimeType) {
			req.overrideMimeType("application/xml");
		}
		try {        
			req.send(null);
			if (synchr) {
				func();
			}
		} catch(e) {
			alert("File not found: " + uri);
		}
	},

		
/**
 * * '''constructURI''' method : construct URI according to current location
 */

	constructURI : function(uri) {
		if (uri.match(/^[a-zA-Z0-9+\.\-]+:\/\//)) {
			return uri;
		}
		if (uri.charAt(0) === '/') {
			return document.location.href.substr(0, document.location.href.replace(/:\/\//, ":\\\\").indexOf("/")) + uri;
		}
		var href = document.location.href;
		var idx = href.indexOf("?");
		href =  idx === -1 ? href : href.substr(0, idx);
		idx = href.replace(/:\/\//, ":\\\\").lastIndexOf("/");
		if (href.length > idx + 1) {
			return (idx === -1 ? href : href.substr(0, idx)) + "/" + uri;
		}
		return href + uri;
	},

		
/**
 * * '''createElement''' method : creates a DOM element and, optionnally, add a class, attach it to its parent and fill it with a text content
 */

	createElement : function(type, parentElt, content, className) {
		var el = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", type) : document.createElement(type);
		if (className) {
			el.className = className;
		}
		if (parentElt) {
			parentElt.appendChild(el);
		}
		if (content) {
			el.appendChild(document.createTextNode(content));
		}
		return el;
	},

		
/**
 * * '''getWindowSize''' method : obtains window size for various browsers
 */

	getWindowSize : function() {
		var myWidth = 0, myHeight = 0, myOffsetX = 0, myOffsetY = 0, myScrollX = 0, myScrollY = 0;
		if (!(XsltForms_browser.isIE || XsltForms_browser.isIE11)) {
			myWidth = document.body ? document.body.clientWidth : document.documentElement.clientWidth;
			//myHeight = document.body ? document.body.clientHeight : document.documentElement.clientHeight;
			myHeight = document.documentElement.clientHeight;
			myOffsetX = document.body ? Math.max(document.documentElement.clientWidth, document.body.clientWidth) : document.documentElement.clientWidth; // body margins ?
			myOffsetY = document.body ? Math.max(document.documentElement.clientHeight, document.body.clientHeight) : document.documentElement.clientHeight; // body margins ?
			myScrollX = window.scrollX;
			myScrollY = window.scrollY;
		} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
			myWidth = document.documentElement.clientWidth;
			myHeight = document.documentElement.clientHeight;
			myOffsetX = Math.max(document.documentElement.clientWidth, document.body.clientWidth); // body margins ?
			myOffsetY = Math.max(document.documentElement.clientHeight, document.body.clientHeight); // body margins ?
			myScrollX = document.body.parentNode.scrollLeft;
			myScrollY = document.body.parentNode.scrollTop;
		}
		return {
			height : myHeight,
			width : myWidth,
			offsetX : myOffsetX,
			offsetY : myOffsetY,
			scrollX : myScrollX,
			scrollY : myScrollY
		};
	}
};

		
/**
 * * '''openRequest''' method : opens an XMLHttpRequest
 */

if (XsltForms_browser.isIE || XsltForms_browser.isIE11) {
	try {
		var xmlDoc0 = new ActiveXObject("Msxml2.DOMDocument.6.0");
		if (xmlDoc0) {
			xmlDoc0 = null;
			XsltForms_browser.MSXMLver = "6.0";
		}
	} catch(e) {
		XsltForms_browser.MSXMLver = "3.0";
	}
    document.write("<script type='text/vbscript'>Function XsltForms_browser_BinaryToArray_ByteStr(Binary)\r\nXsltForms_browser_BinaryToArray_ByteStr = CStr(Binary)\r\nEnd Function\r\nFunction XsltForms_browser_BinaryToArray_ByteStr_Last(Binary)\r\nDim lastIndex\r\nlastIndex = LenB(Binary)\r\nif lastIndex mod 2 Then\r\nXsltForms_browser_BinaryToArray_ByteStr_Last = Chr(AscB(MidB(Binary,lastIndex,1)))\r\nElse\r\nXsltForms_browser_BinaryToArray_ByteStr_Last = "+'""'+"\r\nEnd If\r\nEnd Function\r\n</script>\r\n");
}
if (!XsltForms_browser.isIE) {
	XsltForms_browser.openRequest = function(method, uri, async) {
		// netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
		var req = new XMLHttpRequest();
		try {
			req.open(method, XsltForms_browser.constructURI(uri), async);
		} catch (e) {
			throw new Error("This browser does not support XHRs(Ajax)! \n Cause: " + (e.message || e.description || e) + " \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
		}
		if (XsltForms_browser.isMozilla) {
			req.overrideMimeType("text/xml");
		}
		return req;
	};
} else if (window.ActiveXObject) {
	XsltForms_browser.openRequest = function(method, uri, async) {
		var req;
		try {
			req = new XMLHttpRequest();
		} catch (e0) {
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP." + XsltForms_browser.MSXMLver); 
			} catch (e1) {
				try {
					req = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					throw new Error("This browser does not support XHRs(Ajax)! \n Cause: " + (e.message || e.description || e) + " \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
				}
			}
		}
		req.open(method, XsltForms_browser.constructURI(uri), async);
		return req;
	};
	XsltForms_browser.StringToBinary = function(s) {
		var b = function(v) {
			return String.fromCharCode(v > 9 ? v + 55 : v + 48); 
		};
		var s2 = "";
		for (var i = 0, l = s.length; i < l; i++) {
			s2 += b((s.charCodeAt(i) & 0xF0) >> 4) + b(s.charCodeAt(i) & 0xF);
		}
		var doc = new ActiveXObject("Msxml2.DOMDocument." + XsltForms_browser.MSXMLver);
		var elt = doc.createElement("dummy");
		elt.dataType = "bin.hex";
		elt.text = s2;
		return elt.nodeTypedValue;
	};
} else {
	throw new Error("This browser does not support XHRs(Ajax)! \n Enable Javascript or ActiveX controls (on IE) or lower security restrictions.");
}

		
/**
 * * '''transformText''' method : transforms text into text with a text stylesheet
 */

if (XsltForms_browser.isIE || XsltForms_browser.isIE11) {
	XsltForms_browser.transformText = function(xml, xslt, inline) {
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		xmlDoc.setProperty("AllowDocumentFunction", true);
		xmlDoc.preserveWhiteSpace = true;
		xmlDoc.validateOnParse = false;
		xmlDoc.setProperty("ProhibitDTD", false);
		xmlDoc.loadXML(xml);
		var xslDoc = new ActiveXObject("MSXML2.FreeThreadedDOMDocument." + XsltForms_browser.MSXMLver);
		xslDoc.setProperty("AllowDocumentFunction", true);
		xslDoc.preserveWhiteSpace = true;
		xslDoc.validateOnParse = false;
		xslDoc.setProperty("ProhibitDTD", false);
		if (inline) {
			xslDoc.loadXML(xslt);
		} else {
			xslDoc.async = false;
			xslDoc.load(xslt);
		}
		var xslTemplate = new ActiveXObject("MSXML2.XSLTemplate." + XsltForms_browser.MSXMLver);
		xslTemplate.stylesheet = xslDoc;
		var xslProc = xslTemplate.createProcessor();
		xslProc.input = xmlDoc;
		for (var i = 3, len = arguments.length-1; i < len ; i += 2) {
			xslProc.addParameter(arguments[i], arguments[i+1], "");
		}
		xslProc.transform();
		return xslProc.output;
    };
} else {
    XsltForms_browser.transformText = function(xml, xslt, inline) {
			var parser = new DOMParser();
			var serializer = new XMLSerializer();
			var xmlDoc = parser.parseFromString(xml, "text/xml");
			var xsltDoc;
			if (inline) {
				xsltDoc = parser.parseFromString(xslt, "text/xml");
			} else {
				/*
				xsltDoc = document.implementation.createDocument("","",null);
				if (xsltDoc.load) {
					xsltDoc.async = false;
					xsltDoc.load(xslt);
				} else {
				}
				*/
				var xhttp = new XMLHttpRequest();
				xhttp.open("GET", xslt, false);
				xhttp.send("");
				if ( xhttp.responseXML && xhttp.responseXML.xml !== "") {
					xsltDoc = xhttp.responseXML;
				} else {
					xslt = xhttp.responseText;
					xsltDoc = parser.parseFromString(xslt, "text/xml");
				}
			}
			var xsltProcessor = new XSLTProcessor();
			if (!XsltForms_browser.isMozilla && !XsltForms_browser.isOpera) {
				xsltProcessor.setParameter(null, "xsltforms_caller", "true");
			}
			try {
				xsltProcessor.setParameter(null, "xsltforms_config", document.getElementById(XsltForms_browser.idPf + "instance-config").xfElement.srcDoc);
				xsltProcessor.setParameter(null, "xsltforms_lang", XsltForms_globals.language);
				xsltProcessor.setParameter(null, "xsltforms_domengine", XsltForms_fullDomEngine);
			} catch (e) {
			}
			for (var i = 3, len = arguments.length-1; i < len ; i += 2) {
				xsltProcessor.setParameter(null, arguments[i], arguments[i+1]);
			}
			try {
				xsltProcessor.importStylesheet(xsltDoc);
				var resultDocument = xsltProcessor.transformToDocument(xmlDoc);
				if (!resultDocument) {
					alert("transformToDocument: null return value");
					return "";
				}
				var s = "";
				if ((XsltForms_browser.isMozilla && resultDocument.documentElement.nodeName === "transformiix:result") ||
				     (XsltForms_browser.isOpera && resultDocument.documentElement.nodeName === "result")) {
					s = resultDocument.documentElement.textContent;
				} else if ((XsltForms_browser.isChrome || XsltForms_browser.isEdge) && resultDocument.documentElement.nodeName === "html" && resultDocument.documentElement.children[1].children[0].nodeName === "pre") {
					s = resultDocument.documentElement.children[1].children[0].textContent;
				} else {
					s = serializer.serializeToString(resultDocument);
				}
				return s;
			} catch (e2) {
				alert(e2);
				return "";
			}
	};
}

		
/**
 * * '''loadapplet''' method : loads the Java applet
 */

XsltForms_browser.scripts = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "script") : document.getElementsByTagName("script");
for (var __i = 0, __len = XsltForms_browser.scripts.length; __i < __len; __i++) {
	var __src = XsltForms_browser.scripts[__i].src;
	if (__src.indexOf(XsltForms_browser.jsFileName) !== -1) {
		XsltForms_browser.ROOT = __src.replace(XsltForms_browser.jsFileName, "");
		if (XsltForms_browser.ROOT.indexOf("?") !== -1) {
			XsltForms_browser.ROOT = XsltForms_browser.ROOT.substring(0, XsltForms_browser.ROOT.indexOf("?"));
		}
		XsltForms_browser.imgROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../img/" : XsltForms_browser.ROOT;
		XsltForms_browser.xslROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../xsl/" : XsltForms_browser.ROOT;
		XsltForms_browser.debugROOT = XsltForms_browser.ROOT.substr(XsltForms_browser.ROOT.length - 3, 3) === "js/" ? XsltForms_browser.ROOT + "../debug/" : XsltForms_browser.ROOT;
		break;
	}
}
XsltForms_browser.loadapplet = function() {
	var appelt = XsltForms_browser.isXhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "applet") : document.createElement("applet");
	appelt.setAttribute("style", "position:absolute;left:-1px");
	appelt.setAttribute("name", "xsltforms");
	appelt.setAttribute("id", "xsltforms_applet");
	appelt.setAttribute("code", "xsltforms.class");
	appelt.setAttribute("archive", XsltForms_browser.ROOT + "xsltforms.jar");
	appelt.setAttribute("width", "1");
	appelt.setAttribute("height", "1");
	var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
	body.insertBefore(appelt, body.firstChild);
};

		
/**
 * * '''IEReadFile''' method : reads a local file using native IE features
 */

XsltForms_browser.IEReadFile = function(fname, encoding, xsdtype, title) {
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	return "";
};

		
/**
 * * '''javaReadFile''' method : reads a local file using a Java applet
 */

XsltForms_browser.javaReadFile = function(fname, encoding, xsdtype, title) {
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	if( document.getElementById("xsltforms_applet") ) {
		return document.getElementById("xsltforms_applet").readFile(fname, encoding, xsdtype, title) || "";
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		return document.applets.xsltforms.readFile(fname, encoding, xsdtype, title) || "";
	}
	if( document.getElementById("xsltforms_applet") ) {
		return document.getElementById("xsltforms_applet").readFile(fname, encoding, xsdtype, title) || "";
	}
	return "";
};

		
/**
 * * '''javaWriteFile''' method : writes a local file using a Java applet
 */

XsltForms_browser.javaWriteFile = function(fname, encoding, xsdtype, title, content) {
	if (document.applets.xsltforms) {
		if (fname === "") {
			fname = document.applets.xsltforms.lastChosenFileName;
		}
		return document.applets.xsltforms.writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	if( document.getElementById("xsltforms_applet") ) {
		if (fname === "") {
			fname = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
		}
		return document.getElementById("xsltforms_applet").writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	XsltForms_browser.loadapplet();
	if (document.applets.xsltforms) {
		if (fname === "") {
			fname = document.applets.xsltforms.lastChosenFileName;
		}
		return document.applets.xsltforms.writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	if( document.getElementById("xsltforms_applet") ) {
		if (fname === "") {
			fname = document.getElementById("xsltforms_applet").xsltforms.lastChosenFileName;
		}
		return document.getElementById("xsltforms_applet").writeFile(fname, encoding, xsdtype, title, content) === 1;
	}
	return false;
};

		
/**
 * * '''readFile''' method : reads a local file
 */

XsltForms_browser.readFile = function(fname, encoding, xsdtype, title) {
	return XsltForms_browser.javaReadFile(fname, encoding, xsdtype, title);
};

		
/**
 * * '''writeFile''' method : writes a local file
 */

XsltForms_browser.writeFile = function(fname, encoding, xsdtype, title, content) {
	return XsltForms_browser.javaWriteFile(fname, encoding, xsdtype, title, content);
};

XsltForms_browser.xsltsrc = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrc += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrc += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrc += '	<xsl:template match="@*|node()" priority="0">';
XsltForms_browser.xsltsrc += '		<xsl:copy>';
XsltForms_browser.xsltsrc += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrc += '		</xsl:copy>';
XsltForms_browser.xsltsrc += '	</xsl:template>';
XsltForms_browser.xsltsrc += '</xsl:stylesheet>';

XsltForms_browser.xsltsrcanyuri = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">';
XsltForms_browser.xsltsrcanyuri += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="*[(substring-after(@xsltforms_type,\':\') = \'anyURI\' or substring-after(@xsi:type,\':\') = \'anyURI\') and . != \'\']" priority="2">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="@*"/>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:choose>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_type\') and substring-after(.,\':\') = \'anyURI\'] and . != \'\'">';
XsltForms_browser.xsltsrcanyuri += '				<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcanyuri += '				</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			</xsl:when>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcanyuri += '				<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcanyuri += '				</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:choose>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcanyuri += '		<xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcanyuri += '		</xsl:copy>';
XsltForms_browser.xsltsrcanyuri += '	</xsl:template>';
XsltForms_browser.xsltsrcanyuri += '</xsl:stylesheet>';

XsltForms_browser.xsltsrcindent = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrcindent += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:copy/>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="text()" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:value-of select="normalize-space(.)"/>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '	<xsl:template match="*" priority="0">';
XsltForms_browser.xsltsrcindent += '		<xsl:param name="offset"/>';
XsltForms_browser.xsltsrcindent += '		<xsl:text>&#10;</xsl:text>';
XsltForms_browser.xsltsrcindent += '		<xsl:value-of select="$offset"/>';
XsltForms_browser.xsltsrcindent += '		<xsl:copy>';
XsltForms_browser.xsltsrcindent += '			<xsl:apply-templates select="@*|node()">';
XsltForms_browser.xsltsrcindent += '				<xsl:with-param name="offset" select="concat($offset,\'    \')"/>';
XsltForms_browser.xsltsrcindent += '			</xsl:apply-templates>';
XsltForms_browser.xsltsrcindent += '		</xsl:copy>';
XsltForms_browser.xsltsrcindent += '		<xsl:if test="not(following-sibling::*)">';
XsltForms_browser.xsltsrcindent += '			<xsl:text>&#10;</xsl:text>';
XsltForms_browser.xsltsrcindent += '			<xsl:value-of select="substring($offset,5)"/>';
XsltForms_browser.xsltsrcindent += '		</xsl:if>';
XsltForms_browser.xsltsrcindent += '	</xsl:template>';
XsltForms_browser.xsltsrcindent += '</xsl:stylesheet>';

XsltForms_browser.xsltsrcrelevant = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">';
XsltForms_browser.xsltsrcrelevant += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="*[@xsltforms_notrelevant = \'true\']" priority="1"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcrelevant += '		<xsl:choose>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_notrelevant\')] = \'true\'"/>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcrelevant += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevant += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcrelevant += '		</xsl:choose>';
XsltForms_browser.xsltsrcrelevant += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevant += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcrelevant += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcrelevant += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevant += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevant += '</xsl:stylesheet>';

XsltForms_browser.xsltsrcrelevany = '<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0">';
XsltForms_browser.xsltsrcrelevany += '	<xsl:output method="xml" omit-xml-declaration="yes"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="*[@xsltforms_notrelevant = \'true\']" priority="2"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="*[(substring-after(@xsltforms_type,\':\') = \'anyURI\' or substring-after(@xsi:type,\':\') = \'anyURI\') and . != \'\']" priority="2">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="@*"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="@*[starts-with(translate(name(),\'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\'),\'xsltforms_\')]" priority="1"/>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="@*" priority="0">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:choose>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_notrelevant\')] = \'true\'"/>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:when test="parent::*/attribute::*[local-name() = concat(\'xsltforms_\',local-name(current()),\'_type\') and substring-after(.,\':\') = \'anyURI\'] and . != \'\'">';
XsltForms_browser.xsltsrcrelevany += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:text>$!$!$!$!$!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:text>%!%!%!%!%!</xsl:text>';
XsltForms_browser.xsltsrcrelevany += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			</xsl:when>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:otherwise>';
XsltForms_browser.xsltsrcrelevany += '				<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '					<xsl:apply-templates select="node()"/>';
XsltForms_browser.xsltsrcrelevany += '				</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			</xsl:otherwise>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:choose>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '	<xsl:template match="node()" priority="0">';
XsltForms_browser.xsltsrcrelevany += '		<xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '			<xsl:apply-templates select="@*|node()"/>';
XsltForms_browser.xsltsrcrelevany += '		</xsl:copy>';
XsltForms_browser.xsltsrcrelevany += '	</xsl:template>';
XsltForms_browser.xsltsrcrelevany += '</xsl:stylesheet>';

XsltForms_browser.loadTextNode = function(dest, txt) {
	if (dest.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
		dest.value = txt;
	} else {
		while (dest.firstChild) {
			dest.removeChild(dest.firstChild);
		}
		dest.appendChild(dest.ownerDocument.createTextNode(txt));
	}
};

if (XsltForms_domEngine === "" && (XsltForms_browser.isIE || XsltForms_browser.isIE11)) {
	XsltForms_browser.createXMLDocument = function(xml) {
		var d = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		d.setProperty("SelectionLanguage", "XPath");
		d.validateOnParse = false;
		d.setProperty("ProhibitDTD", false);
		//d.setProperty("SelectionNamespaces", "xmlns:xml='http://www.w3.org/XML/1998/namespace'");
		d.loadXML(xml);
		return d;
	};
	XsltForms_browser.setAttributeNS = function(node, ns, attrname, value) {
		try {
			node.setAttributeNode(node.ownerDocument.createNode(Fleur.Node.ATTRIBUTE_NODE, attrname, ns));
			node.setAttribute(attrname, value);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not set @" + (ns !== "" ? "Q{" + ns + "}" : "") + attrname + " with value " + value + " on " + XsltForms_browser.name2string(node));
		}
	};
	XsltForms_browser.selectSingleNode = function(xpath, node) {
		try {
			return node.selectSingleNode(xpath);
		} catch (e) {
			return null;
		}
	};
	XsltForms_browser.selectSingleNodeText = function(xpath, node, defvalue) {
		try {
			return node.selectSingleNode(xpath).text;
		} catch (e) {
			return defvalue || "";
		}
	};
	XsltForms_browser.selectNodesLength = function(xpath, node) {
		try {
			return node.selectNodes(xpath).length;
		} catch (e) {
			return 0;
		}
	};
	XsltForms_browser.xsltDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDoc.loadXML(XsltForms_browser.xsltsrc);
	XsltForms_browser.xsltDocAnyURI = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocAnyURI.loadXML(XsltForms_browser.xsltsrcanyuri);
	XsltForms_browser.xsltDocRelevant = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocRelevant.loadXML(XsltForms_browser.xsltsrcrelevant);
	XsltForms_browser.xsltDocRelevantAnyURI = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocRelevantAnyURI.loadXML(XsltForms_browser.xsltsrcrelevany);
	XsltForms_browser.xsltDocIndent = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
	XsltForms_browser.xsltDocIndent.loadXML(XsltForms_browser.xsltsrcindent);
	XsltForms_browser.loadNode = function(dest, xml) {
		var result = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		result.setProperty("SelectionLanguage", "XPath");
		result.setProperty("ProhibitDTD", false);
		result.validateOnParse = false;
		if (result.loadXML(xml)) {
			var r = result.documentElement.cloneNode(true);
			dest.parentNode.replaceChild(r, dest);
		} else {
			XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse XML");
		}
	};
	XsltForms_browser.loadDoc = function(dest, xml) {
		XsltForms_browser.loadNode(dest.documentElement, xml);
	};
	/**
	 * @callback
	 */
	XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
		if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) { 
			return node.nodeValue;
		}
		if (node.nodeType === Fleur.Node.TEXT_NODE) {
			var s = "";
			while (node && node.nodeType === Fleur.Node.TEXT_NODE) {
				s += node.nodeValue;
				node = node.nextSibling;
			}
			return s;
		}
		var xmlDoc = new ActiveXObject("MSXML2.DOMDocument." + XsltForms_browser.MSXMLver);
		xmlDoc.setProperty("SelectionLanguage", "XPath"); 
		xmlDoc.appendChild(node.documentElement ? node.documentElement.cloneNode(true) : node.cloneNode(true));
		if (cdataSectionElements) {
			if (relevant) {
				var ns = xmlDoc.documentElement.selectNodes("descendant::*[@xsltforms_notrelevant = 'true']");
				for( var i = 0, l = ns.length; i < l ; i++) {
					var n = ns[i];
					try {
						n.parentNode.removeChild(n);
					} catch (e) {
					}
				}
			}
			var ns2 = xmlDoc.documentElement.selectNodes("descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]");
			for( var j = 0, l2 = ns2.length; j < l2 ; j++) {
				var n2 = ns2[j];
				var k = 0;
				while (k < n2.attributes.length) {
					if (n2.attributes[k].name.substring(0, 10) === "xsltforms_") {
						n2.removeAttribute(n2.attributes[k].name);
					} else {
						k++;
					}
				}
			}
			var ser = new Fleur.XMLSerializer();
			return ser.serializeToString(xmlDoc, indent, cdataSectionElements);
		}
		if (indent) {
			return xmlDoc.transformNode(XsltForms_browser.xsltDocIndent);
		}
		if (related) {
			var z = relevant ? xmlDoc.transformNode(XsltForms_browser.xsltDocRelevantAnyURI) : xmlDoc.transformNode(XsltForms_browser.xsltDocAnyURI);
			var cids = [];
			var m1 = z.indexOf("$!$!$!$!$!");
			while (m1 !== -1) {
				var m2 = z.indexOf("%!%!%!%!%!", m1 + 10);
				var fvalue = z.substring(m1 + 10, m2);
				if (fvalue !== "") {
					fvalue = fvalue.substr(fvalue.indexOf("?id=") + 4);
					cids.push(fvalue);
					fvalue = "cid:" + fvalue;
				}
				z = z.substr(0, m1) + fvalue + z.substr(m2 + 10);
				m1 = z.indexOf("$!$!$!$!$!");
			}
			var boundary = "xsltformsrev" + XsltForms_globals.fileVersionNumber;
			z = "--" + boundary + "\r\nContent-Type: application/xml; charset=UTF-8\r\nContent-ID: <xsltforms_main>\r\n\r\n" + z + "\r\n--" + boundary + "\r\n";
			for (var icid = 0, lcid = cids.length; icid < lcid; icid++) {
				z += "Content-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nContent-ID: <" + cids[icid] + ">\r\n\r\n";
				if (XsltForms_upload.contents[cids[icid]] instanceof ArrayBuffer) {
					var zc0 = new Uint8Array(XsltForms_upload.contents[cids[icid]]);
					for (var zci = 0, zcl = zc0.length; zci < zcl; zci++) {
						z += String.fromCharCode(zc0[zci]);
					}
				} else {
					z += XsltForms_upload.contents[cids[icid]];
				}
				z += "\r\n--" + boundary + (icid === lcid-1 ? "--\r\n" : "\r\n");
			}
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
		}
		return relevant ? xmlDoc.transformNode(XsltForms_browser.xsltDocRelevant) : xmlDoc.transformNode(XsltForms_browser.xsltDoc);
	};
	XsltForms_browser.saveDoc = XsltForms_browser.saveNode;
} else {
	XsltForms_browser.createXMLDocument = function(xml) {
		return XsltForms_browser.parser.parseFromString(xml, "text/xml");
	};
	XsltForms_browser.setAttributeNS = function(node, ns, attrname, value) {
		try {
			node.setAttributeNS(ns, attrname, value);
		} catch (e) {
			XsltForms_browser.debugConsole.write("ERROR: Could not set " + (ns !== "" ? "Q{" + ns + "}" : "") + attrname + " with value " + value + " on " + XsltForms_browser.name2string(node));
		}
	};
	XsltForms_browser.selectSingleNode = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.ANY_TYPE, null).iterateNext();
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.ANY_TYPE, null).iterateNext();
		} catch (e) {
			return null;
		}
	};
	XsltForms_browser.selectSingleNodeText = function(xpath, node, defvalue) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.ANY_TYPE, null).iterateNext().textContent;
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.ANY_TYPE, null).iterateNext().textContent;
		} catch (e) {
			if (node.nodeName === "properties") {
				for (var i = 0, l = node.childNodes.length; i < l; i++ ) {
					if (node.childNodes[i].nodeName === xpath) {
						return node.childNodes[i].textContent;
					}
				}
			}
			return defvalue || "";
		}
	};
	XsltForms_browser.selectNodesLength = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
		} catch (e) {
			var res = 0;
			switch (xpath) {
				case "preceding::* | ancestor::*":
					while (node) {
						if (node.previousSibling) {
							res += node.nodeType === Fleur.Node.ELEMENT_NODE ? 1 : 0;
							node = node.previousSibling;
						} else {
							if (node.parentNode) {
								res++;
								node = node.parentNode;
							} else {
								node = null;
							}
						}
					}
					break;
				case "descendant::node() | descendant::*/@*[not(starts-with(local-name(),'xsltforms_'))]":
					var n = node.firstChild;
					if (n) {
						while (n !== node) {
							res++;
							if (n.attributes) {
								for( var i = 0, l = n.attributes.length; i < l; i++) {
									res += n.attributes[i].name.substring(0, 10) !== "xsltforms_" ? 1 : 0;
								}
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
			}
			return res;
		}
	};
	XsltForms_browser.selectNodes = function(xpath, node) {
		try {
			if (node.evaluate) {
				return node.evaluate(xpath, node, node.createNSResolver(node.documentElement), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			}
			return node.ownerDocument.evaluate(xpath, node, node.ownerDocument.createNSResolver(node), XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		} catch (e) {
		}
	};
	try {
		XsltForms_browser.parser = XsltForms_domEngine === "http://www.agencexml.com/Fleur" ? new Fleur.DOMParser() : new DOMParser();
		/*
		XsltForms_browser.xsltDoc = XsltForms_browser.parser.parseFromString(XsltForms_browser.xsltsrc, "text/xml");
		XsltForms_browser.xsltProcessor = new XSLTProcessor();
		XsltForms_browser.xsltProcessor.importStylesheet(XsltForms_browser.xsltDoc);
		XsltForms_browser.xsltDocAnyURI = XsltForms_browser.parser.parseFromString(XsltForms_browser.xsltsrcanyuri, "text/xml");
		XsltForms_browser.xsltProcessorAnyURI = new XSLTProcessor();
		XsltForms_browser.xsltProcessorAnyURI.importStylesheet(XsltForms_browser.xsltDocAnyURI);
		XsltForms_browser.xsltDocRelevant = XsltForms_browser.parser.parseFromString(XsltForms_browser.xsltsrcrelevant, "text/xml");
		XsltForms_browser.xsltProcessorRelevant = new XSLTProcessor();
		XsltForms_browser.xsltProcessorRelevant.importStylesheet(XsltForms_browser.xsltDocRelevant);
		XsltForms_browser.xsltDocRelevantAnyURI = XsltForms_browser.parser.parseFromString(XsltForms_browser.xsltsrcrelevany, "text/xml");
		XsltForms_browser.xsltProcessorRelevantAnyURI = new XSLTProcessor();
		XsltForms_browser.xsltProcessorRelevantAnyURI.importStylesheet(XsltForms_browser.xsltDocRelevantAnyURI);
		XsltForms_browser.xsltDocIndent = XsltForms_browser.parser.parseFromString(XsltForms_browser.xsltsrcindent, "text/xml");
		XsltForms_browser.xsltProcessorIndent = new XSLTProcessor();
		XsltForms_browser.xsltProcessorIndent.importStylesheet(XsltForms_browser.xsltDocIndent);
		*/
	} catch (xsltforms_e) {
	}
	if (XsltForms_domEngine === "") {
		XsltForms_browser.serializer = new XMLSerializer();
		XsltForms_browser.loadNode = function(dest, srcNode) {
			var result = XsltForms_browser.parser.parseFromString(srcNode, "text/xml");
			if (result.documentElement.localName !== "parsererror" && (!result.documentElement.textContent || result.documentElement.textContent.substring(0,40) !== "This page contains the following errors:")) {
				var r = dest.ownerDocument.importNode(result.documentElement, true);
				dest.parentNode.replaceChild(r, dest);
			} else {
				XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse XML");
			}
		};
		XsltForms_browser.loadDoc = function(dest, srcDoc) {
			XsltForms_browser.loadNode(dest.documentElement, srcDoc);
		};
		/**
		 * @callback
		 */
		XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
			if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE) { 
				return node.nodeValue;
			}
			if (node.nodeType === Fleur.Node.TEXT_NODE) {
				var s = "";
				while (node && node.nodeType === Fleur.Node.TEXT_NODE) {
					s += node.nodeValue;
					node = node.nextSibling;
				}
				return s;
			}
			var resultDocument = XsltForms_browser.createXMLDocument(XsltForms_browser.serializer.serializeToString(node));
			if (relevant) {
				if (resultDocument.selectNodes) {
					var ns = resultDocument.selectNodes("descendant::*[@xsltforms_notrelevant = 'true']", false, resultDocument.documentElement);
					for( var i = 0, l = ns.length; i < l ; i++) {
						var n = ns[i];
						try {
							n.parentNode.removeChild(n);
						} catch (e) {
						}
					}
				}
			}
			if (related) {
				var ns3 = resultDocument.selectNodes("descendant::*[(substring-after(@xsltforms_type,':') = 'anyURI' or substring-after(@*[local-name() = 'type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance'],':') = 'anyURI') and . != '']", false, resultDocument.documentElement);
				for( var i3 = 0, l3 = ns3.length; i3 < l3 ; i3++) {
					var n3 = ns3[i3];
					try {
						n3.insertBefore(n3.ownerDocument.createTextNode("$!$!$!$!$!"), n3.firstChild);
						n3.appendChild(n3.ownerDocument.createTextNode("%!%!%!%!%!"));
					} catch (e3) {
					}
				}
				var ns4 = resultDocument.selectNodes("descendant::*[@*[starts-with(local-name(), 'xsltforms_') and substring(local-name(), string-length(local-name()) - 5, 5) = '_type' and local-name() != 'xsltforms_type' and substring-after(.,':') = 'anyURI']]", false, resultDocument.documentElement);
				for( var i4 = 0, l4 = ns4.length; i4 < l4 ; i4++) {
					var n4 = ns4[i4];
					var k4 = 0;
					while (k4 < n4.attributes.length) {
						var nn4 = n4.attributes[k4].name;
						var nn4v = n4.getAttribute(nn4);
						if (nn4.substring(0, 10) === "xsltforms_" && nn4.substr(nn4.length - 5, 5) === "_type" && nn4 !== "xsltforms_type" && nn4v.substr(nn4v.indexOf(':') + 1) === "anyURI") {
							try {
								var nn42 = nn4.substr(10, nn4.length - 15);
								if (n4.getAttribute(nn42) !== '') {
									n4.setAttribute(nn42, "$!$!$!$!$!" + n4.getAttribute(nn42) + "%!%!%!%!%!");
								}
							} catch (e4) {
							}
						} else {
							k4++;
						}
					}
				}
			}
			var ns2;
			if (resultDocument.selectNodes) {
				ns2 = resultDocument.selectNodes("descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]", false, resultDocument.documentElement);
			} else {
				ns2 = XsltForms_browser.selectMeta(resultDocument.documentElement, []);
			}
			for (var j = 0, l2 = ns2.length; j < l2 ; j++) {
				var n2 = ns2[j];
				var k = 0;
				while (k < n2.attributes.length) {
					if (n2.attributes[k].name.substring(0, 10) === "xsltforms_") {
						n2.removeAttribute(n2.attributes[k].name);
					} else {
						k++;
					}
				}
			}
			if (related) {
				var z = XsltForms_browser.serializer.serializeToString(resultDocument);
				var cids = [];
				var m1 = z.indexOf("$!$!$!$!$!");
				while (m1 !== -1) {
					var m2 = z.indexOf("%!%!%!%!%!", m1 + 10);
					var fvalue = z.substring(m1 + 10, m2);
					if (fvalue !== "") {
						fvalue = fvalue.substr(fvalue.indexOf("?id=") + 4);
						cids.push(fvalue);
						fvalue = "cid:" + fvalue;
					}
					z = z.substr(0, m1) + fvalue + z.substr(m2 + 10);
					m1 = z.indexOf("$!$!$!$!$!");
				}
				var boundary = "xsltformsrev" + XsltForms_globals.fileVersionNumber;
				z = "--" + boundary + "\r\nContent-Type: application/xml; charset=UTF-8\r\nContent-ID: <xsltforms_main>\r\n\r\n" + z + "\r\n--" + boundary + "\r\n";
				for (var icid = 0, lcid = cids.length; icid < lcid; icid++) {
					var zc = "";
					if (XsltForms_browser.isSafari) {
						var zc0 = XsltForms_upload.contents[cids[icid]];
						for (var zci = 0, zcl = zc0.length; zci < zcl; zci++) {
							var zcc = zc0.charCodeAt(zci);
							if (zcc < 128) {
								zc += String.fromCharCode(zcc);
							} else {
								if ((zcc > 191) && (zcc < 224)) {
									zc += String.fromCharCode(((zcc & 31) << 6) | (zc0.charCodeAt(++zci) & 63));
								} else {
									zc += String.fromCharCode(((zcc & 15) << 12) | ((zc0.charCodeAt(++zci) & 63) << 6) | (zc0.charCodeAt(++zci) & 63));
								}
							}
						}
					} else {
						var zc0b = new Uint8Array(XsltForms_upload.contents[cids[icid]]);
						for (var zcib = 0, zclb = zc0b.length; zcib < zclb; zcib++) {
							zc += String.fromCharCode(zc0b[zcib]);
						}
					}
					z += "Content-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\nContent-ID: <" + cids[icid] + ">\r\n\r\n" + zc + "\r\n--" + boundary +  (icid === lcid-1 ? "--\r\n" : "\r\n");
				}
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
			} else if (indent || cdataSectionElements) {
				var ser = new Fleur.XMLSerializer();
				return ser.serializeToString(resultDocument, indent, cdataSectionElements);
			}
			return XsltForms_browser.serializer.serializeToString(resultDocument);
		};
		XsltForms_browser.saveDoc = function(doc, mediatype, relevant, indent, related, cdataSectionElements) {
			return XsltForms_browser.saveNode(doc.documentElement, mediatype, relevant, indent, related, cdataSectionElements);
		};
		XsltForms_browser.selectMeta = function(node, selection) {
			var i, li;
			i = 0;
			li = node.attributes.length;
			while (i < li) {
				if (node.attributes[i].nodeName.indexOf("xsltforms_") === 0) {
					selection.push(node);
					break;
				}
				i++;
			}
			i = 0;
			li = node.children.length;
			while (i < li) {
				XsltForms_browser.selectMeta(node.children[i++], selection);
			}
			return selection;
		};
	} else {
		XsltForms_browser.serializer = new Fleur.Serializer();
		XsltForms_browser.loadNode = function(dest, srcNode, mediatype) {
			var i, l, r;
			try {
				var result = XsltForms_browser.parser.parseFromString(srcNode, mediatype);
				switch (dest.nodeType) {
					case Fleur.Node.ELEMENT_NODE:
						for (i = 0, l = result.childNodes.length; i < l; i++) {
							r = dest.ownerDocument.importNode(result.childNodes[i], true);
							dest.parentNode.insertBefore(r, dest);
						}
						dest.parentNode.removeChild(dest);
						break;
					case Fleur.Node.DOCUMENT_NODE:
						for (i = 0, l = dest.childNodes.length; i < l; i++) {
							dest.removeChild(dest.childNodes[0]);
						}
						for (i = 0, l = result.childNodes.length; i < l; i++) {
							r = dest.importNode(result.childNodes[i], true);
							dest.appendChild(r);
						}
						break;
				}
			} catch(e) {
				XsltForms_globals.error(document.getElementById(XsltForms_browser.getDocMeta(dest.ownerDocument, "model")).xfElement, "xforms-link-exception", "Unable to parse source");
			}
		};
		XsltForms_browser.loadDoc = XsltForms_browser.loadNode;
		/**
		 * @callback
		 */
		XsltForms_browser.saveNode = function(node, mediatype, relevant, indent, related, cdataSectionElements) {
			return XsltForms_browser.serializer.serializeToString(node, mediatype, indent === "yes");
		};
		XsltForms_browser.saveDoc = XsltForms_browser.saveNode;
		/**
		 * @callback
		 */
		XsltForms_browser.selectMeta = function(node, selection) {
			return selection;
		};
	}
}
XsltForms_browser.unescape = function(xml) {
	if (!xml) {
		return "";
	}
	var regex_escapepb = /^\s*</;
	if (!xml.match(regex_escapepb)) {
		xml = xml.replace(/&lt;/g, "<");
		xml = xml.replace(/&gt;/g, ">");
		xml = xml.replace(/&amp;/g, "&");
	}
	return xml;
};
XsltForms_browser.escape = function(text) {
	if (!text) {
		return "";
	}
	if (typeof(text) === "string") {
		text = text.replace(/&/g, "&amp;");
		text = text.replace(/</g, "&lt;");
		text = text.replace(/>/g, "&gt;");
	}
	return text;
};
XsltForms_browser.escapeJS = function(text) {
	if (!text) {
		return "";
	}
	if (typeof(text) === "string") {
		text = text.replace(/\\/gm, "\\\\");
		text = text.replace(/\t/gm, "\\t");
		text = text.replace(/\n/gm, "\\n");
		text = text.replace(/\r/gm, "\\r");
		text = text.replace(/\"/gm, "\\\"");
	}
	return text;
};

XsltForms_browser.utf8decode = function (s) {
	var r = "";
	for (var i = 0, l = s.length; i < l;) {
		var c = s.charCodeAt(i);
		if (c < 128) {
			r += String.fromCharCode(c);
			i++;
		} else {
			if((c > 191) && (c < 224)) {
				r += String.fromCharCode(((c & 31) << 6) | (s.charCodeAt(i+1) & 63));
				i += 2;
			} else {
				r += String.fromCharCode(((c & 15) << 12) | ((s.charCodeAt(i+1) & 63) << 6) | (s.charCodeAt(i+2) & 63));
				i += 3;
			}
		}
	}
	return r;
};

XsltForms_browser.utf8encode = function (s) {
	s = s.replace(/\r\n/g,"\n");
	var r = "";
	for (var i = 0, l = s.length; i < l; i++) {
		var c = s.charCodeAt(i);
		r += c < 128 ? String.fromCharCode(c) : c > 127 && c < 2048 ? String.fromCharCode((c >> 6) | 192) + String.fromCharCode((c & 63) | 128) : String.fromCharCode((c >> 12) | 224) + String.fromCharCode(((c >> 6) & 63) | 128) + String.fromCharCode((c & 63) | 128);
	}
	return r;
};

XsltForms_browser.crc32_arr = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];

XsltForms_browser.crc32 = function (s) {
	var crc = -1;
	for (var i = 0, l = s.length; i < l; i++) {
		crc = (crc >>> 8) ^ XsltForms_browser.crc32_arr[(crc ^ s.charCodeAt(i)) & 0xFF];
	}
	return crc ^ (-1);
};

if (XsltForms_domEngine === "") {
	XsltForms_browser.getMeta = function(node, meta) {
		return node.nodeType && (node.nodeType === Fleur.Node.ELEMENT_NODE || node.nodeType === Fleur.Node.ATTRIBUTE_NODE) ? node.nodeType === Fleur.Node.ELEMENT_NODE ? node.getAttribute("xsltforms_"+meta) : node.ownerElement ? node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : node.oldOwnerElement ? node.oldOwnerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : null;
	};

	XsltForms_browser.getDocMeta = function(doc, meta) {
		return XsltForms_browser.getMeta(doc.documentElement, meta);
	};

	XsltForms_browser.getBoolMeta = function(node, meta) {
		return Boolean(node.nodeType === Fleur.Node.ELEMENT_NODE ? node.getAttribute("xsltforms_"+meta) : node.nodeType === Fleur.Node.ATTRIBUTE_NODE ? node.ownerElement ? node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) :  node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta) : false);
	};

	XsltForms_browser.getType = function(node) {
		if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
			var t = node.getAttribute("xsltforms_type");
			if (t && t !== "") {
				return t;
			}
			if (node.getAttributeNS) {
				return node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type");
			}
			var att = node.selectSingleNode("@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
			if (att && att.value !== "") {
				return att.value;
			}
			return null;
		} else if (!node.nodeType || node.nodeType === Fleur.Node.DOCUMENT_NODE) {
			return null;
		}
		if (node.ownerElement) {
			return node.ownerElement.getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type");
		}
		try {
			return node.selectSingleNode("..").getAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type");
		} catch (e) {
			return null;
		}
	};

	XsltForms_browser.setMeta = function(node, meta, value) {
		if (node && node.nodeType && (node.nodeType === Fleur.Node.ELEMENT_NODE || node.nodeType === Fleur.Node.ATTRIBUTE_NODE)) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_"+meta, value);
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				} else if (node.oldOwnerElement) {
					node.oldOwnerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, value);
				}
			}
		}
	};

	XsltForms_browser.setDocMeta = function(doc, meta, value) {
		XsltForms_browser.setMeta(doc.documentElement, meta, value);
	};

	XsltForms_browser.clearMeta = function(node) {
		var i = 0, n;
		if (node && node.nodeType && node.nodeType === Fleur.Node.ELEMENT_NODE) {
			if (node.attributes) {
				while (node.attributes[i]) {
					n = node.attributes[i].localName ? node.attributes[i].localName : node.attributes[i].baseName;
					if (n.substr(0, 10) === "xsltforms_") {
						node.removeAttribute(n);
					} else {
						i++;
					}
				}
			}
			if (node.children) {
				for (var j = 0, l2 = node.children.length; j < l2; j++) {
					XsltForms_browser.clearMeta(node.children[j]);
				}
			}
		/*
		} else if (node && node.nodeType && node.nodeType === Fleur.Node.ATTRIBUTE_NODE) {
			var ownerElement = node.ownerElement? node.ownerElement: node.selectSingleNode("..");
			if (ownerElement) {
				var metaprefix = "xsltforms_" + (node.localName ? node.localName : node.baseName) + "_";
				while (ownerElement.attributes[i]) {
					n = ownerElement.attributes[i].localName ? ownerElement.attributes[i].localName : ownerElement.attributes[i].baseName;
					if (n.substr(0, metaprefix.length) === metaprefix) {
						ownerElement.removeAttribute(n);
					} else {
						i++;
					}
				}
			}
		*/
		}
	};

	XsltForms_browser.setBoolMeta = function(node, meta, value) {
		if (node) {
			if (value) {
				if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
					node.setAttribute("xsltforms_"+meta, "true");
				} else {
					if (node.ownerElement) {
						node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
					} else {
						node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
					}
				}
			} else {
				if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
					node.removeAttribute("xsltforms_"+meta);
				} else {
					if (node.ownerElement) {
						node.ownerElement.removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
					} else {
						node.selectSingleNode("..").removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
					}
				}
			}
		}
	};

	XsltForms_browser.setTrueBoolMeta = function(node, meta) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_"+meta, "true");
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta, "true");
				}
			}
		}
	};

	XsltForms_browser.setFalseBoolMeta = function(node, meta) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.removeAttribute("xsltforms_"+meta);
			} else {
				if (node.ownerElement) {
					node.ownerElement.removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
				} else {
					node.selectSingleNode("..").removeAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_"+meta);
				}
			}
		}
	};
	
	XsltForms_browser.setType = function(node, value) {
		if (node) {
			if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
				node.setAttribute("xsltforms_type", value);
			} else {
				if (node.ownerElement) {
					node.ownerElement.setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type", value);
				} else {
					node.selectSingleNode("..").setAttribute("xsltforms_"+(node.localName ? node.localName : node.baseName)+"_type", value);
				}
			}
		}
	};
} else {
	XsltForms_browser.getMeta = function(node, meta) {
		return node.getUserData(meta);
	};

	XsltForms_browser.getDocMeta = XsltForms_browser.getMeta;

	XsltForms_browser.getBoolMeta = function(node, meta) {
		return Boolean(node.getUserData(meta));
	};

	XsltForms_browser.getType = function(node) {
		var t = node.getUserData("type");
		if (t && t !== "") {
			return t;
		}
		return node.getAttributeNS ? node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "type") : null;
	};

	XsltForms_browser.setMeta = function(node, meta, value) {
		node.setUserData(meta, value);
	};

	XsltForms_browser.setDocMeta = XsltForms_browser.setMeta;

	XsltForms_browser.clearMeta = function(node) {
		node.clearUserData();
		if (node.attributes) {
			for (var i = 0, n = node.attributes.length; i < n; i++) {
				XsltForms_browser.clearMeta(node.attributes[i]);
			}
		}
		if (node.childNodes) {
			for (var i2 = 0, n2 = node.childNodes.length; i2 < n2; i2++) {
				XsltForms_browser.clearMeta(node.childNodes[i2]);
			}
		}
	};

	XsltForms_browser.setBoolMeta = function(node, meta, value) {
		if (node) {
			node.setUserData(meta, value);
		}
	};

	XsltForms_browser.setTrueBoolMeta = function(node, meta) {
		if (node) {
			node.setUserData(meta, true);
		}
	};

	XsltForms_browser.setFalseBoolMeta = function(node, meta) {
		if (node) {
			node.setUserData(meta, false);
		}
	};

	XsltForms_browser.setType = function(node, value) {
		if (node) {
			node.setUserData("type", value);
		}
	};
}

XsltForms_browser.getNil = function(node) {
	if (node.nodeType === Fleur.Node.ELEMENT_NODE) {
		if (node.getAttributeNS) {
			return node.getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "nil") === "true";
		}
		var att = node.selectSingleNode("@*[local-name()='nil' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']");
		return att && att.value === "true";
	}
	return false;
};

XsltForms_browser.rmValueMeta = function(node, meta, value) {
	if (node) {
		var prev = XsltForms_browser.getMeta(node, meta);
		if (!prev) {
			prev = "";
		}
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		if (pos !== -1) {
			XsltForms_browser.setMeta(node, meta, prev.substring(0, pos) + prev.substring(pos + v.length));
		}
	}
};

XsltForms_browser.addValueMeta = function(node, meta, value) {
	if (node) {
		var prev = XsltForms_browser.getMeta(node, meta);
		if (!prev) {
			prev = "";
		}
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		if (pos === -1) {
			XsltForms_browser.setMeta(node, meta, prev + v);
		}
	}
};

XsltForms_browser.inValueMeta = function(node, meta, value) {
	if (node) {
		var prev = String(XsltForms_browser.getMeta(node, meta));
		var v = " " + value + " ";
		var pos = prev.indexOf(v);
		return pos !== -1;
	}
};

XsltForms_browser.name2string = function(node) {
	var s = "";
	if (!node.nodeType) {
		return "#notanode (" + node + ")";
	}
	switch (node.nodeType) {
		case Fleur.Node.ATTRIBUTE_NODE:
			s = "@";
		//$FALLTHROUGH$
		case Fleur.Node.ELEMENT_NODE:
			if (node.namespaceURI && node.namespaceURI !== "") {
				s += "Q{" + node.namespaceURI + "}";
			}
			return s + (node.baseName || node.localName);
		case Fleur.Node.ENTRY_NODE:
			return "?" + (node.baseName || node.localName);
		case Fleur.Node.TEXT_NODE:
			return "#text";
		case Fleur.Node.CDATA_NODE:
			return "#cdata";
		case Fleur.Node.PROCESSING_INSTRUCTION_NODE:
			return "#processing-instruction";
		case Fleur.Node.COMMENT_NODE:
			return "#comment";
		case Fleur.Node.DOCUMENT_NODE:
			return "#document";
		case Fleur.Node.MAP_NODE:
			return "#map";
		case Fleur.Node.ARRAY_NODE:
			return "#array";
		case Fleur.Node.SEQUENCE_NODE:
			return "#sequence";
	}
};

if (!XsltForms_browser.isIE && !XsltForms_browser.isIE11) {
	if (typeof XMLDocument === "undefined") {
		var XMLDocument = Document;
	}
	XMLDocument.prototype.selectNodes = function(xpath, single, node) {
		var n;
		try {
			var r = this.evaluate(xpath, (node ? node : this), this.createNSResolver(this.documentElement), (single ? XPathResult.FIRST_ORDERED_NODE_TYPE : XPathResult.ORDERED_NODE_SNAPSHOT_TYPE), null);
			if (single) {
				return r.singleNodeValue ? r.singleNodeValue : null;
			}
			for (var i = 0, len = r.snapshotLength, r2 = []; i < len; i++) {
				r2.push(r.snapshotItem(i));
			}
			return r2;
		} catch (e) {
			var rx = [];
			switch (xpath) {
				case "@*[local-name()='type' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']":
					for (var i2 = 0, l2 = node.attributes.length; i2 < l2; i2++ ) {
						if (node.attributes[i2].name === "type" && node.attributes[i2].namespaceURI === "http://www.w3.org/2001/XMLSchema-instance") {
							rx.push(node.attributes[i2]);
							break;
						}
					}
					break;
				case "@*[local-name()='nil' and namespace-uri()='http://www.w3.org/2001/XMLSchema-instance']":
					for (var i3 = 0, l3 = node.attributes.length; i3 < l3; i3++ ) {
						if (node.attributes[i3].name === "nil" && node.attributes[i3].namespaceURI === "http://www.w3.org/2001/XMLSchema-instance") {
							rx.push(node.attributes[i3]);
							break;
						}
					}
					break;
				case "descendant::*[@xsltforms_notrelevant = 'true']":
					n = node.firstChild;
					if (n) {
						while (n !== node) {
							if (n.nodeType === Fleur.Node.ELEMENT_NODE && n.getAttribute("xsltforms_notrelevant") === "true") {
								rx.push(n);
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
				case "descendant-or-self::*[@*[starts-with(name(),'xsltforms_')]]":
					node = node.parentNode;
					n = node.firstChild;
					if (n) {
						while (n !== node) {
							if (n.nodeType === Fleur.Node.ELEMENT_NODE) {
								for (var i4 = 0, l4 = n.attributes.length; i4 < l4; i4++ ) {
									if (n.attributes[i4].name.substring(0,10) === "xsltforms_") {
										rx.push(n);
										break;
									}
								}
							}
							if (n.firstChild) {
								n = n.firstChild;
							} else {
								while (!n.nextSibling && n !== node) {
									n = n.parentNode;
								}
								if (n !== node) {
									n = n.nextSibling;
								}
							}
						}
					}
					break;
			}
			return rx;
		}
	};
	XMLDocument.prototype.selectSingleNode = function(xpath) {
		return this.selectNodes(xpath, true)[0];
	};
	XMLDocument.prototype.createNode = function(t, nodename, ns) {
		switch(t) {
			case Fleur.Node.ELEMENT_NODE:
				return this.createElementNS(ns, nodename);
			case Fleur.Node.ATTRIBUTE_NODE:
				return this.createAttributeNS(ns, nodename);
			default:
				return null;
		}
	};
	Node.prototype.selectNodes = function(xpath) {
		return this.ownerDocument.selectNodes(xpath, false, this);
	};
	Node.prototype.selectSingleNode = function(xpath) {	
		return this.ownerDocument.selectNodes(xpath, true, this);
	};
}

		
/**
 * === "debugConsole" class ===
 * Debug Console Management
 */

XsltForms_browser.debugConsole = {
	element_ : null,
	doc_ : null,
	isInit_ : false,
	time_ : 0,
	init_ : function() {
		this.element_ = document.getElementById("xsltforms_console");
		this.isInit_ = true;
		this.time_ = new Date().getTime();
    },

		
/**
 * * '''write''' method : adds a text to the Debug Console
 */

    write : function(text) {
		try {
			if (this.isOpen()) {
				var time = new Date().getTime();
				this.element_.appendChild(document.createTextNode(time - this.time_ + " -> " + text));
				XsltForms_browser.createElement("br", this.element_);
				this.time_ = time;
			}
			if (XsltForms_globals.debugMode) {
				if (!this.doc_) {
					this.doc_ = XsltForms_browser.createXMLDocument('<tracelog xmlns=""/>');
				}
				var elt = this.doc_.createElement("event");
				elt.appendChild(this.doc_.createTextNode(XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true) + " -> " + text));
				this.doc_.documentElement.appendChild(elt);
			}
		} catch(e) {
		}
    },

		
/**
 * * '''clear''' method : clears the Debug Console
 */

	clear : function() {
		if (this.isOpen()) {
			while (this.element_.firstChild) {
				this.element_.removeChild(this.element_.firstChild);
			}
			this.time_ = new Date().getTime();
		}
	},

		
/**
 * * '''isOpen''' method : checks if the Debug Console is opened
 */

	isOpen : function() {
		if (!this.isInit_) {
			this.init_();
		}
		return this.element_;
	}
};


		
/**
 * === "Dialog" class ===
 * Dialog Panel Management
 */

XsltForms_browser.dialog = {
	openPosition: {},
	dialogs : [],
	init : false,
	initzindex : 50,
	zindex: 0,
	selectstack : [],

		
/**
 * * '''dialogDiv''' method: a utility that fetches the Dialog Panel's page-element
 */

	dialogDiv : function(id) {
		var div = null;
		if (typeof id !== "string") {
			var divid = id.getAttribute("id");
			if (divid && divid !== "") {
				div = XsltForms_idManager.find(divid);
			} else {
				div = id;
			}
		} else {
			div = XsltForms_idManager.find(id);
		}
		if (!div) {
			XsltForms_browser.debugConsole.write("Unknown dialog("+id+")!");
		}
		return div;
		},

		
/**
 * * '''show''' method : displays the Dialog Panel
 */

	show : function(div, parentElt, modal) {
			if (!(div = this.dialogDiv(div))) {
				return;
			}
			// Don't reopen the top-dialog.
			if (this.dialogs[this.dialogs.length - 1] === div) {
				return;
			}
			// Maintain dialogs-array ordered.
			this.dialogs = XsltForms_browser.removeArrayItem(this.dialogs, div);
			this.dialogs.push(div);
			var size;
			if (modal) {
				var surround = document.getElementById("xforms-dialog-surround");
				surround.style.display = "block";
				surround.style.zIndex = (this.zindex + this.initzindex)*2;
				this.zindex++;
				size = XsltForms_browser.getWindowSize();
				surround.style.height = size.height+"px";
				surround.style.width = size.width+"px";
				surround.style.top = size.scrollY+"px";
				surround.style.left = size.scrollX+"px";
				var surroundresize = function () {
					var surround2 = document.getElementById("xforms-dialog-surround");
					var size2 = XsltForms_browser.getWindowSize();
					surround2.style.height = size2.height+"px";
					surround2.style.width = size2.width+"px";
					surround2.style.top = size2.scrollY+"px";
					surround2.style.left = size2.scrollX+"px";
				};
				window.onscroll = surroundresize;
				window.onresize = surroundresize;
			}
			div.style.display = "block";
			div.style.zIndex = (this.zindex + this.initzindex)*2-1;
			this.showSelects(div, false, modal);
			if (parentElt) {
				var absPos = XsltForms_browser.getAbsolutePos(parentElt);
				XsltForms_browser.setPos(div, absPos.x, (absPos.y + parentElt.offsetHeight));
			} else {
				size = XsltForms_browser.getWindowSize();
				var h = size.scrollY + (size.height - div.offsetHeight) / 2;
				XsltForms_browser.setPos(div, (size.width - div.offsetWidth) / 2, h > 0 ? h : 100);
			}
		},

		
/**
 * * '''hide''' method : hides the Dialog Panel
 */

	hide : function(div, modal) {
		if (!(div = this.dialogDiv(div))) {
			return;
		}
		var oldlen = this.dialogs.length;
		this.dialogs = XsltForms_browser.removeArrayItem(this.dialogs, div);
		if (this.dialogs.length === oldlen) {
			return;
		}
		this.showSelects(div, true, modal);
		div.style.display = "none";
		if (modal) {
			if (!this.dialogs.length) {
				this.zindex = 0;
				document.getElementById('xforms-dialog-surround').style.display = "none";
				window.onscroll = null;
				window.onresize = null;
			} else {
				this.zindex--;
				document.getElementById('xforms-dialog-surround').style.zIndex = (this.zindex + this.initzindex)*2-2;
				// Ensure new top-dialog over modal-surround.
				if (this.dialogs.length) {
					this.dialogs[this.dialogs.length - 1].style.zIndex = (this.zindex + this.initzindex)*2-1;
				}
			}
		}
	},

		
/**
 * * '''knownSelect''' method : determines whether a select control is already known by Dialog management (IE6 workaround)
 */

	knownSelect : function(s) {
		if (XsltForms_browser.isIE6) {
			for (var i = 0, len = this.zindex; i < len; i++) {
				for (var j = 0, len1 = this.selectstack[i].length; j < len1; j++) {
					if (this.selectstack[i][j].select === s) {
						return true;
					}
				}
			}
		}
		return false;
	},

		
/**
 * * '''showSelects''' method : shows/hides the selects controls under the Dialog Panel (IE6 workaround)
 */

	showSelects : function(div, value, modal) {
		if (XsltForms_browser.isIE6) {
			var selects = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "select") : document.getElementsByTagName("select");
			var pos = XsltForms_browser.getAbsolutePos(div);
			var w = div.offsetWidth;
			var h = div.offsetHeight;
			var dis = [];
			for (var i = 0, len = selects.length; i < len; i++) {
				var s = selects[i];
				var p = s.parentNode;
				while (p && p !== div) {
					p = p.parentNode;
				}
				if (p !== div) {
					var ps = XsltForms_browser.getAbsolutePos(s);
					var ws = s.offsetWidth;
					var hs = s.offsetHeight;
					var under = ps.x + ws > pos.x && ps.x < pos.x + w && ps.y + hs > pos.y && ps.y < pos.y + h;
					if (modal) {
						if (value) {
							dis = this.selectstack[this.zindex];
							for (var j = 0, len1 = dis.length; j < len1; j++) {
								if (dis[j].select === s) {
									s.disabled = dis[j].disabled;
									s.style.visibility = dis[j].visibility;
									break;
								}
							}
						} else {
							var d = {"select": s, "disabled": s.disabled, "visibility": s.style.visibility};
							dis[dis.length] = d;
							if (under) {
								s.style.visibility = "hidden";
							} else {
								s.disabled = true;
							}
						}
					} else {
							if (under) {
								s.style.visibility = value? "" : "hidden";
							}
					}
				}
			}
			if (modal && !value) {
				this.selectstack[this.zindex - 1] = dis;
			}
		}
	}
};


		
/**
 * === "Event" class ===
 * Event Management
 */

XsltForms_browser.events = {};

if (XsltForms_browser.isIE && !XsltForms_browser.isIE9) {
	/**
	 * @callback
	 */
	XsltForms_browser.events.attach = function(target, evtname, handler, phase) {
		var func = function(evt) { 
			handler.call(window.event.srcElement, evt);
		};
		target.attachEvent("on" + evtname, func);
	};

	/**
	 * @callback
	 */
	XsltForms_browser.events.detach = function(target, evtname, handler, phase) {
		target.detachEvent("on" + evtname, handler);
	};

	XsltForms_browser.events.getTarget = function() {
		return window.event.srcElement;
	};
    
	XsltForms_browser.events.dispatch = function(target, evtname) {
		target.fireEvent("on" + evtname, document.createEventObject());
	};
} else {
	XsltForms_browser.events.attach = function(target, evtname, handler, phase) {
		if (target === window && !window.addEventListener) {
			target = document;
		}
		target.addEventListener(evtname, handler, phase);
	};
    
	XsltForms_browser.events.detach = function(target, evtname, handler, phase) {
		if (target === window && !window.addEventListener) {
			target = document;
		}
		target.removeEventListener(evtname, handler, phase);
	};

	XsltForms_browser.events.getTarget = function(ev) {
		return ev.target;
	};
    
	XsltForms_browser.events.dispatch = function(target, evtname) {
		var evt = document.createEvent("Event");
		evt.initEvent(evtname, true, true);
		target.dispatchEvent(evt);
	};
}


		
/**
 * === "I18N" class ===
 * Internationalization Management
 */

XsltForms_browser.i18n = {
	messages : null,
	lang : null,
	langs : ["cz", "de", "el", "en", "en_us", "es", "fr" , "gl", "ko", "it", "ja", "nb_no", "nl", "nn_no", "pl", "pt", "ro", "ru", "si", "sk", "zh", "zh_cn", "zh_tw"],

		
/**
 * * '''asyncinit''' method : get a property value for the current language
 */

	asyncinit : function(f) {
		if (XsltForms_globals.language === "navigator" || XsltForms_globals.language !== XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config)) {
			var lan = XsltForms_globals.language === "navigator" ? (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || "undefined")) : XsltForms_globals.language;
			lan = lan.replace("-", "_").toLowerCase();
			var found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			if (!found) {
				var ind = lan.indexOf("_");
				if (ind !== -1) {
					lan = lan.substring(0, ind);
				}
				found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			}
			XsltForms_globals.language = "default";
			if (found) {
				XsltForms_browser.loadProperties("config_" + lan + ".xsl", f);
				return;
			}
		}
		f();
    },

		
/**
 * * '''get''' method : get a property value for the current language
 */

	get : function(key, defvalue) {
		if (!XsltForms_browser.config || XsltForms_browser.config.nodeName === "dummy") {
			return "Initializing";
		}
		if (XsltForms_globals.language === "navigator" || XsltForms_globals.language !== XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config)) {
			var lan = XsltForms_globals.language === "navigator" ? (navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage || "undefined")) : XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
			lan = lan.replace("-", "_").toLowerCase();
			var found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			if (!found) {
				var ind = lan.indexOf("_");
				if (ind !== -1) {
					lan = lan.substring(0, ind);
				}
				found = XsltForms_browser.inArray(lan, XsltForms_browser.i18n.langs);
			}
			if (found) {
				XsltForms_browser.loadProperties("config_" + lan + ".xsl");
				XsltForms_globals.language = XsltForms_browser.selectSingleNodeText('language', XsltForms_browser.config);
			} else {
				XsltForms_globals.language = "default";
			}
		}
		return XsltForms_browser.selectSingleNodeText(key, XsltForms_browser.config, defvalue);
    },

		
/**
 * * '''parse''' method : data parsing according to a pattern and the current language
 */

	parse : function(str, pattern, timeonly) {
		var ret = true;
		if (!str || str.match("^\\s*$")) {
			return null;
		}
		var pattern0 = pattern;
		if (!pattern) {
			if (!timeonly) {
				pattern = XsltForms_browser.i18n.get("format.datetime");
			} else {
				pattern = "hh:mm:ss";
			}
		}
		var d = new Date(2000, 0, 1);
		if (!timeonly) {
			ret &= XsltForms_browser.i18n._parse(d, "Year", str, pattern, "yyyy");
			ret &= XsltForms_browser.i18n._parse(d, "Month", str, pattern, "MM");
			ret &= XsltForms_browser.i18n._parse(d, "Date", str, pattern, "dd");
		}
		XsltForms_browser.i18n._parse(d, "Hours", str, pattern, "hh");
		XsltForms_browser.i18n._parse(d, "Minutes", str, pattern, "mm");
		XsltForms_browser.i18n._parse(d, "Seconds", str, pattern, "ss");
		if (!pattern0 && XsltForms_globals.AMPM) {
			var postfix = XsltForms_browser.i18n.get("format.time.AM").toLowerCase();
			if (str.substr(str.length - postfix.length).toLowerCase() === postfix) {
				if (d.getHours() === 12) {
					d.setHours(0);
				}
			} else {
				if (d.getHours() !== 12) {
					d.setHours(d.getHours() + 12);
				}
			}
		}
		return ret ? d : str;
	},

		
/**
 * * '''format''' method : data formatting according to a pattern and the current language
 */

	format : function(date, pattern, loc, timeonly) {
		var hh, ss;
		if (!date) {
			return "";
		}
		if (typeof date === "string") {
			return date;
		}
		var str = pattern;
		if (!str) {
			if (!timeonly) {
				str = XsltForms_browser.i18n.get("format.datetime");
			} else {
				str = "hh:mm:ss";
			}
		}
		var str0 = str;
		if (!timeonly) {
			str = XsltForms_browser.i18n._format(str, (loc ? date.getDate() : date.getUTCDate()), "dd");
			str = XsltForms_browser.i18n._format(str, (loc ? date.getMonth() : date.getUTCMonth()) + 1, "MM");
			var y = (loc ? date.getFullYear() : date.getUTCFullYear());
			str = XsltForms_browser.i18n._format(str, y < 100 ? (y < (new Date().getFullYear()) % 100 + 20 ? 2000 : 1900) + y : y, "yyyy");
		}
		str = XsltForms_browser.i18n._format(str, ss = (loc ? date.getSeconds() : date.getUTCSeconds()), "ss");
		str = XsltForms_browser.i18n._format(str, (loc ? date.getMinutes() : date.getUTCMinutes()), "mm");
		str = XsltForms_browser.i18n._format(str, hh = (loc ? date.getHours() : date.getUTCHours()), "hh", !pattern);
		var o = date.getTimezoneOffset();
		str = XsltForms_browser.i18n._format(str, (loc ? (o < 0 ? "+" : "-") + XsltForms_browser.zeros(Math.floor(Math.abs(o)/60),2) + ":" + XsltForms_browser.zeros(Math.abs(o) % 60,2) : "Z"), "z");
		if (!pattern && XsltForms_globals.AMPM) {
			if (ss === 0 && str0.substr(str0.length - 3) === ":ss") {
				str = str.substr(0, str.length - 3);
			}
			str += " " + XsltForms_browser.i18n.get(hh < 12 ? "format.time.AM" : "format.time.PM");
		}
		return str;
	},

		
/**
 * * '''parseDate''' method : direct method for date parsing
 */

	parseDate : function(str) {
		return XsltForms_browser.i18n.parse(str, XsltForms_browser.i18n.get("format.date"));
	},

		
/**
 * * '''formatDate''' method : direct method for date formatting
 */

	formatDate : function(str) {
		return XsltForms_browser.i18n.format(str, XsltForms_browser.i18n.get("format.date"), true);
	},
 
		
/**
 * * '''formatDateTime''' method : direct method for dateandtime formatting
 */

	formatDateTime : function(str) {
		return XsltForms_browser.i18n.format(str, XsltForms_browser.i18n.get("format.datetime"), true);
	},
 
		
/**
 * * '''formatNumber''' method : direct method for number formatting
 */

	formatNumber : function(number, decimals) {
		if (isNaN(number)) {
			return number;
		}
		var value = String(Math.abs(number));
		var index = value.indexOf(".");
		var integer = parseInt(index !== -1? value.substring(0, index) : value, 10);
		var decimal = index !== -1? value.substring(index + 1) : "";
		var decsep = XsltForms_browser.i18n.get("format.decimal");
		return (number < 0 ? "-":"") + integer + (decimals > 0? decsep + XsltForms_browser.zeros(decimal, decimals, true) : (decimal? decsep + decimal : ""));
	},

		
/**
 * * '''parseNumber''' method : direct method for number parsing
 */

	parseNumber : function(value) {
		var decsep = XsltForms_browser.i18n.get("format.decimal");
		if(!value.match("^[\\-+]?([0-9]+(\\" + decsep + "[0-9]*)?|\\" + decsep + "[0-9]+)$")) {
			throw "Invalid number " + value;
		}
		var index = value.indexOf(decsep);
		var integer = Math.abs(parseInt(index !== -1? value.substring(0, index) : value, 10));
		var decimal = index !== -1? value.substring(index + 1) : null;
		return (value.substring(0,1) === "-" ? "-":"") + integer + (decimal? "." + decimal : "");
	},
	_format : function(returnValue, value, el, pattern) {
		var l = el.length;
		if (pattern && el === "hh" && XsltForms_globals.AMPM) {
			value %= 12;
			if (value === 0) {
				value = 12;
			}
			l = 1;
		}
		return returnValue.replace(el, XsltForms_browser.zeros(value, l));
	},
	_parse : function(date, prop, str, format, el) {
		var ret = false;
		var index = format.indexOf(el);
		if (index !== -1) {
			format = format.replace(new RegExp("\\.", "g"), "\\.");
			format = format.replace(new RegExp("\\(", "g"), "\\(");
			format = format.replace(new RegExp("\\)", "g"), "\\)");
			format = format.replace(new RegExp(el), "(" + el + ")!!!");
			format = format.replace(new RegExp("yyyy"), "[12][0-9]{3}");
			format = format.replace(new RegExp("MM"), "(?:0?[1-9](?![0-9])|1[0-2])");
			format = format.replace(new RegExp("dd"), "(?:0?[1-9](?![0-9])|[1-2][0-9]|30|31)");
			format = format.replace(new RegExp("hh"), "(?:0?[0-9](?![0-9])|1[0-9]|20|21|22|23)");
			format = format.replace(new RegExp("mm"), "[0-5][0-9]");
			format = format.replace(new RegExp("ss"), "[0-5][0-9]");
			format = "^" + format.substring(0, format.indexOf(")!!!") + 1) + "[^0-9]*.*";
			var r = new RegExp(format);
			var val = '00';
			if (r.test(str)) {
				val = str.replace(r, "$1");
				ret = true;
			}
			if (val.charAt(0) === '0') {
				val = val.substring(1);
			}
			val = parseInt(val, 10);
			if (isNaN(val)) {
				return false;
			}
			var n = new Date();
			n = n.getFullYear() - 2000;
			date["set" + prop](prop === "Month"? val - 1 : (prop === "Year" && val <= n+10 ? val+2000 : val));
			return ret;
		}
	}
};

function XsltForms_numberList(parentElt, className, input, min, max, minlengh) {
	this.element = XsltForms_browser.createElement("ul", parentElt, null, className);
	this.move = 0;
	this.input = input;
	this.min = min;
	this.max = max;
	this.minlength = minlengh || 1;
	var list = this;
	this.createChild("+", function() { list.start(1); }, function() { list.stop(); } );
	for (var i = 0; i < 7; i++) {
		this.createChild(" ", function(evt) {
			list.input.value = XsltForms_browser.events.getTarget(evt).childNodes[0].nodeValue;
			list.close();
			XsltForms_browser.events.dispatch(list.input, "change");
		} );
	}
	this.createChild("-", function() { list.start(-1); }, function() { list.stop(); } );
}

XsltForms_numberList.prototype.show = function() {
	var input = this.input;
	this.current = parseInt(input.value, 10);
	this.refresh();
	XsltForms_browser.dialog.show(this.element, input, false);
};

XsltForms_numberList.prototype.close = function() {
	XsltForms_browser.dialog.hide(this.element, false);
}; 

XsltForms_numberList.prototype.createChild = function(content, handler, handler2) {
	var child = XsltForms_browser.createElement("li", this.element, content);
	XsltForms_browser.initHover(child);
	if (handler2) {
		XsltForms_browser.events.attach(child, "mousedown", handler);
		XsltForms_browser.events.attach(child, "mouseup", handler2);
	} else {
		XsltForms_browser.events.attach(child, "click", handler);
	}
};

XsltForms_numberList.prototype.refresh = function()  {
	var childs = this.element.childNodes;
	var cur = this.current;
	if (cur >= this.max - 3) {
		cur = this.max - 3;
	} else if (cur <= this.min + 3) {
		cur = this.min + 3;
	}
	var topn = cur + 4;
	for (var i = 1; i < 8; i++) {
		XsltForms_browser.setClass(childs[i], "hover", false);
		var str = String(topn - i);
		while (str.length < this.minlength) {
			str = '0' + str;
		}
		childs[i].firstChild.nodeValue = str;
	}
};

XsltForms_numberList.prototype.start = function(value) {
	this.move = value;
	XsltForms_numberList.current = this;
	this.run();
};
    
XsltForms_numberList.prototype.stop = function() {
	this.move = 0;
};

XsltForms_numberList.prototype.run = function() {
	if ((this.move > 0 && this.current + 3 < this.max) || (this.move < 0 && this.current - 3> this.min)) {
		this.current += this.move;
		this.refresh();
		setTimeout(XsltForms_numberList.current.run, 60);
	}
};

XsltForms_numberList.current = null;


		
/**
 * === Miscalleanous functions ===
 * * '''forEach''' function : Convenient way to the same method with the same arguments to a collect of objects
 */

XsltForms_browser.forEach = function(object, block) {
	var args = [];
	for (var i = 0, len = arguments.length - 2; i < len; i++) {
		args[i] = arguments[i + 2];
	}
	if (object) {
		if (typeof object.length === "number") {
			for (var j = 0, len1 = object.length; j < len1; j++) {
				var obj = object[j];
				var func = typeof block === "string" ? obj[block] : block;
				func.apply(obj, args);
			}
		} else {
			for (var key in object) {
				if (object.hasOwnProperty(key)) {
					var obj2 = object[key];
					var func2 = typeof block === "string" ? obj2[block] : block;
					func2.apply(obj2, args);
				}
			}   
		}
	}
};


		
/**
 * * '''assert''' function : Conditional Debug Console message adding
 */

XsltForms_browser.assert = function(condition, message) {
	if (!condition && XsltForms_browser.debugConsole.isOpen()) {
		if (!XsltForms_globals.debugMode) {
			XsltForms_globals.debugMode = true;
			XsltForms_globals.debugging();
		}
		XsltForms_browser.debugConsole.write("Assertion failed: " + message);
		if (XsltForms_browser.isIE) { // Internet Explorer
			this.callstack = [];
			for (var caller = arguments.caller; caller; caller = caller.caller) {
				this.callstack.push(caller.name ? caller.name : "<anonymous>");
			}
		} else {
			try {
				XsltForms_undefined();
			} catch (e) {
				if (e.stack) {
					this.callstack = e.stack.split("\n");
					this.callstack.shift();
					this.callstack.shift();
				}
			}
		}
		if (this.callstack) {
			for (var i = 0, len = this.callstack.length; i < len; i++) {
				XsltForms_browser.debugConsole.write("> " + this.callstack[i]);
			}
		}
		throw new Error(message || "Assertion failed");
	}
};


		
/**
 * * '''inArray''' function : Tests if a value is present in an array
 */

XsltForms_browser.inArray = function(value, array) {
	for (var i = 0, len = array.length; i < len; i++) {
		if (value === array[i]) {
			return true;
		}
	}
	return false;
};


		
/**
 * * '''zeros''' function : left or right zero-padding
 */

XsltForms_browser.zeros = function(value, len, right) {
	var res = String(value);
	if (right) {
		while (res.length < len) {
			res = res + "0";
		}
	} else {
		while (res.length < len) {
			res = "0" + res;
		}
	}
	return res;
};

		
/**
 * * '''getValue''' function : gets a node value
 */
		
XsltForms_browser.getValue = function(node, format, serialize) {
	XsltForms_browser.assert(node);
	if (serialize) {
		return node.nodeType === Fleur.Node.ATTRIBUTE_NODE ? node.nodeValue : XsltForms_browser.saveNode(node, "application/xml");
	}
	var value = node.text !== undefined ? node.text : node.textContent;
	if (value && format) {
		var schtyp = XsltForms_schema.getType(XsltForms_browser.getType(node) || "xsd_:string");
		if (schtyp.format && schtyp.validate(value)) {
			try { value = schtyp.format(value); } catch(e) { }
		}
	}
	return value;
};


		
/**
 * * '''splitNode''' function : splits a node value
 */
		
XsltForms_browser.splitNode = function(node, separator, leftTrim, rightTrim) {
	XsltForms_browser.assert(node);
	var value = node.text !== undefined ? node.text : node.textContent;
	var values = value.split(separator);
	var arr = node.ownerDocument.createArray();
	for (var i = 0, l = values.length; i < l; i++) {
		if (leftTrim && rightTrim) {
			var m = values[i].replace(leftTrim, "").replace(rightTrim, "");
			if (m !== '') {
				arr.appendChild(node.ownerDocument.createTextNode(m));
			}
		} else {
			arr.appendChild(node.ownerDocument.createTextNode(values[i]));
		}
	}
	if (node.nodeType === Fleur.Node.TEXT_NODE) {
		node.parentNode.replaceChild(arr, node);
	} else {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		node.appendChild(arr);
	}
};


		
/**
 * * '''getValueItemsetCopy''' function : gets a node value for itemset/copy
 */
		
XsltForms_browser.getValueItemsetCopy = function(node) {
	XsltForms_browser.assert(node);
	var value = [];
	if (node.childNodes) {
		for (var i = 0, l = node.childNodes.length; i < l ; i++) {
			if (node.childNodes[i].nodeType === Fleur.Node.ELEMENT_NODE) {
				value.push(XsltForms_browser.saveNode(node.childNodes[i], "application/xml"));
			}
		}
	}
	return value;
};


		
/**
 * * '''setValue''' function : sets the value of a node
 */

XsltForms_browser.setValue = function(node, value) {
	XsltForms_browser.assert(node);
	if (node.nodeType === Fleur.Node.ATTRIBUTE_NODE || node.nodeType === Fleur.Node.TEXT_NODE) {
		node.nodeValue = value;
	} else if (XsltForms_browser.isIE && node.innerHTML && !(value instanceof Array)) {
		node.innerHTML = XsltForms_browser.escape(value);
	} else {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		if (value) {
			if (value instanceof Array) {
				for (var i = 0, l = value.length; i < l; i++) {
					var dummy = node.ownerDocument.createElement("dummy");
					node.appendChild(dummy);
					XsltForms_browser.loadNode(dummy, value[i], "application/xml");
				}
			} else {
				for (var j = 0, l2 = value.length; j < l2; j += 4096) {
					try {
						node.appendChild(node.ownerDocument.createTextNode(value.substr(j, 4096)));
					} catch (e) {
						XsltForms_browser.debugConsole.write("ERROR: Cannot set value " + value + " on " + XsltForms_browser.name2string(node) + "; " + e.message);
					}
				}
			}
		}
	}
};


		
/**
 * * '''run''' function : executes an action (called by generated Javascript instructions)
 */

XsltForms_browser.run = function(action, element, evt, synch, propagate) {
	XsltForms_xmlevents.EventContexts.push(evt);
	if (synch) {
		XsltForms_browser.dialog.show("statusPanel", null, false);
		setTimeout(function() { 
			XsltForms_globals.openAction("XsltForms_browser.run#1");
			action.execute(XsltForms_idManager.find(element), null, evt);
			XsltForms_browser.dialog.hide("statusPanel", false);
			if (!propagate) {
				evt.stopPropagation();
			}
			XsltForms_globals.closeAction("XsltForms_browser.run#1");
		}, 1 );
	} else {
		XsltForms_globals.openAction("XsltForms_browser.run#2");
		action.execute(XsltForms_idManager.find(element), null, evt);
		if (!propagate) {
			evt.stopPropagation();
		}
		XsltForms_globals.closeAction("XsltForms_browser.run#2");
	}
};


		
/**
 * * '''getId''' function : gets the id of the xf element concerned by an event (FF2 compatibility problem)
 */

XsltForms_browser.getId = function(element) {
	if(element.id) {
		return element.id;
	}
	return element.parentNode.parentNode.parentNode.parentNode.id;
};


		
/**
 * * '''show''' function : show/hide an element (called by generated Javascript instructions, typically used for hints or input errors)
 * @callback
 */

XsltForms_browser.show = function(el, type, value) {
	el.parentNode.lastChild.style.display = value? 'inline' : 'none';
};


		
/**
 * * '''copyArray''' function : copy every element in a source array into a dest array
 */

XsltForms_browser.copyArray = function(source, dest) {
	if( dest ) {
		for (var i = 0, len = source.length; i < len; i++) {
			dest[i] = source[i];
		}
	}
};


		
/**
 * * '''removeArrayItem''' function : returns a new array without the specified item
 */

XsltForms_browser.removeArrayItem = function(array, item) {
	var narr = [];
	for (var i = 0, len = array.length; i < len; i++) {
		if (array[i] !== item ) {
			narr.push(array[i]);
		}
	}
	return narr;
};


		
/**
 * * '''trim''' method : left and right trim method for String class
 */

String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/, '');
};


		
/**
 * * '''addslashes''' method : Javascript escape method for String class
 */

String.prototype.addslashes = function() {
	return this.replace(/\\/g,"\\\\").replace(/\'/g,"\\'").replace(/\"/g,"\\\"");
};