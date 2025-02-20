"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module in_script
 * @description /**'''XSLTForms Javascript for insertion in script elements'''
 */


/**
 * String.startsWith
 */

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

/**
 * String.endsWith
 */

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

/**
 * Array.find
 */

// https://tc39.github.io/ecma262/#sec-array.prototype.find
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
      if (this == null) {
        throw TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
      }
      var thisArg = arguments[1];
      var k = 0;
      while (k < len) {
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        k++;
      }
      return undefined;
    },
    configurable: true,
    writable: true
  });
}

/**
 * Array.prototype.head
 */

if (!Array.prototype.head) {
  Object.defineProperty(Array.prototype, 'head', {
    value() {
      return this.find(Boolean);
    }
  });
}

/**
 * Array.prototype.isSingle
 */

if (!Array.prototype.isSingle) {
  Object.defineProperty(Array.prototype, 'isSingle', {
    value() {
      return false;
    }
  });
}

/**
 * Array.prototype.childNodes
 */

if (!Array.prototype.childNodes) {
  Object.defineProperty(Array.prototype, 'childNodes', {
    get: function() { return this;}
  });
}

/**
 * Array.prototype.toArray
 */

if (!Array.prototype.toArray) {
  Object.defineProperty(Array.prototype, 'toArray', {
    value() { return this;}
  });
}

/**
 * Object.entries
 */

if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i);
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];
    
    return resArray;
  };
}

if (typeof xsltforms_d0 === "undefined") {
  (function () {
    var initelts = document.getElementsByTagName("script");
    var elts = [];
    var i, l;
    for (i = 0, l = initelts.length; i < l; i++) {
      elts[i] = initelts[i];
    }
    initelts = null;
    var root = null;
    for (i = 0, l = elts.length; i < l; i++) {
      if (elts[i].src.indexOf("xsltforms.js") !== -1) {
        root = elts[i].src.replace("xsltforms.js", "");
      }
    }
    XsltForms_globals.standalone = root === null;
    if (!XsltForms_globals.standalone) {
      if (root.substring(root.length - 4) === "/js/") {
        root = root.substring(0, root.length - 4) + "/css/";
      }
      var link = Array.prototype.slice.call(document.querySelectorAll("link[href][type = 'text/css'][rel = 'stylesheet']")).reduce(function(v, l) { return v || l.getAttribute("href").endsWith("xsltforms.css"); }, false);
      if (!link) {
        var newelt;
        newelt = document.createElement("link");
        newelt.setAttribute("rel", "stylesheet");
        newelt.setAttribute("type", "text/css");
        newelt.setAttribute("href", root + "xsltforms.css");
        document.getElementsByTagName("head")[0].appendChild(newelt);
      }
    }
    var xftrans = function () {
      if (XsltForms_globals.standalone) {
        let formSource = "";
        for (let i = 0, l = document.childNodes.length; i < l ; i++) {
          const node = document.childNodes[i];
          switch (node.nodeType) {
            case Fleur.Node.ELEMENT_NODE:
              formSource += node.outerHTML;
              break;
            case Fleur.Node.DOCUMENT_TYPE_NODE:
              formSource += "<!DOCTYPE " + node.name + ">\n";
              break;
            case Fleur.Node.TEXT_NODE:
              formSource += node.textContent;
              break;
            case Fleur.Node.COMMENT_NODE:
              formSource += "<!--" + node.data + "-->";
              break;
          }
        }
        XsltForms_globals.formSource = formSource;
      }
      const mxfelt = document.querySelector("xforms-form");
      if (!mxfelt) {
        const prtelt = document.querySelector("xforms-model").parentElement;
        const newmxfelt = document.createElement("xforms-form");
        Array.prototype.slice.call(prtelt.children).forEach(n => newmxfelt.appendChild(n));
        prtelt.appendChild(newmxfelt);
      }
//      var conselt = document.createElement("xforms-console");
//      document.getElementsByTagName("xforms-form")[0].appendChild(conselt);
//      conselt = document.createElement("xforms-status-panel");
//      conselt.setAttribute("style", "display: none; z-index: 99; top: 294.5px; left: 490px;");
//      conselt.innerHTML = "... Loading ...";
//      document.getElementsByTagName("xforms-form")[0].appendChild(conselt);
      XsltForms_browser.dialog.show('xsltforms-status-panel');
      if (!(document.documentElement.childNodes[0].nodeType === 8 || (XsltForms_browser.isIE && document.documentElement.childNodes[0].childNodes[1] && document.documentElement.childNodes[0].childNodes[1].nodeType === 8))) {
        var comment = document.createComment("HTML elements and Javascript instructions generated by XSLTForms $$$VersionName$$$ ($$$VersionNumber$$$) - Copyright (C) $$$VersionYear$$$ <agenceXML> - Alain Couthures - http://www.agencexml.com");
        document.documentElement.insertBefore(comment, document.documentElement.firstChild);
      }
      var initelts2 = document.getElementsByTagName("script");
      var elts2 = [];
      var i2, l2;
      for (i2 = 0, l2 = initelts2.length; i2 < l2; i2++) {
        elts2[i2] = initelts2[i2];
      }
      initelts2 = null;
      var res;
      for (i2 = 0, l2 = elts2.length; i2 < l2; i2++) {
        if (elts2[i2].type === "text/xforms") {
          var dbefore = new Date();
          res = XsltForms_browser.transformText('<html xmlns="http://www.w3.org/1999/xhtml"><body>' + elts2[i2].text + '</body></html>', root + "xsltforms.xsl", false);
          var dafter = new Date();
          XsltForms_globals.transformtime = dafter - dbefore;
          var sp = XsltForms_globals.stringSplit(res, "XsltForms_MagicSeparator");
          var mainjs = "xsltforms_d0 = new Date(); /* xsltforms-mainform " + sp[1] + sp[2] + " xsltforms-mainform */ }";
          newelt = document.createElement("script");
          newelt.setAttribute("id", "xsltforms-generated-script");
          newelt.setAttribute("type", "text/javascript");
          if (XsltForms_browser.isIE) {
            newelt.text = mainjs;
          } else {
            var scripttxt = document.createTextNode(mainjs);
            newelt.appendChild(scripttxt);
          }
          //var panel = document.getElementById("xsltforms-status-panel");
          //panel.parentNode.removeChild(panel);
          document.getElementsByTagName("body")[0].appendChild(newelt);
          var subbody = "<!-- xsltforms-mainform " + sp[4] + " xsltforms-mainform -->";
          elts2[i2].outerHTML = subbody;
        }
      }
    };
    var xsltforms_init = function () {
      try {
        xftrans();
        if (typeof xsltforms_initImpl !== "undefined") {
          xsltforms_initImpl();
        } else {
          var xsltforms_model_config = document.createElement("xforms-model");
          xsltforms_model_config.setAttribute("id", "xsltforms_model_config");
          XsltForms_browser.configElt = document.createElement("xforms-instance");
          XsltForms_browser.configElt.setAttribute("id", "xsltforms_instance_config");
          var config_script = document.createElement("script");
          config_script.setAttribute("type", "application/xml");
          config_script.textContent = '<properties xmlns=""><html>4</html><language>navigator</language><calendar.label>...</calendar.label><calendar.day0>Mon</calendar.day0><calendar.day1>Tue</calendar.day1><calendar.day2>Wed</calendar.day2><calendar.day3>Thu</calendar.day3><calendar.day4>Fri</calendar.day4><calendar.day5>Sat</calendar.day5><calendar.day6>Sun</calendar.day6><calendar.initDay>6</calendar.initDay><calendar.month0>January</calendar.month0><calendar.month1>February</calendar.month1><calendar.month2>March</calendar.month2><calendar.month3>April</calendar.month3><calendar.month4>May</calendar.month4><calendar.month5>June</calendar.month5><calendar.month6>July</calendar.month6><calendar.month7>August</calendar.month7><calendar.month8>September</calendar.month8><calendar.month9>October</calendar.month9><calendar.month10>November</calendar.month10><calendar.month11>December</calendar.month11><calendar.close>Close</calendar.close><format.date>MM/dd/yyyy</format.date><format.datetime>MM/dd/yyyy hh:mm:ss</format.datetime><format.decimal>.</format.decimal><format-number.decimal-separator-sign>.</format-number.decimal-separator-sign><format-number.exponent-separator-sign>e</format-number.exponent-separator-sign><format-number.grouping-separator-sign>,</format-number.grouping-separator-sign><format-number.infinity>Infinity</format-number.infinity><format-number.minus-sign>-</format-number.minus-sign><format-number.NaN>NaN</format-number.NaN><format-number.percent-sign>%</format-number.percent-sign><format-number.per-mille-sign>&#8240;</format-number.per-mille-sign><status>... Loading ...</status></properties>';
          XsltForms_browser.configElt.appendChild(config_script);
          xsltforms_model_config.appendChild(XsltForms_browser.configElt);
          document.getElementsByTagName("xforms-form")[0].appendChild(xsltforms_model_config);
          /*
var xsltforms_model_config = new XsltForms_model(xsltforms_subform,xsltforms_subform.id + "-model-config",null);
var xsltforms_instance_config = new XsltForms_instance(xsltforms_subform,xsltforms_subform.id + "-instance-config",xsltforms_model_config,true,'application/xml',null,'<properties\x20xmlns=""><!--\x20\x20accessible\x20at\x20run\x20time\x20--><html>4</html><language>navigator</language><!--\x20navigator\x20or\x20default\x20--><calendar.label>...</calendar.label><calendar.day0>Mon</calendar.day0><calendar.day1>Tue</calendar.day1><calendar.day2>Wed</calendar.day2><calendar.day3>Thu</calendar.day3><calendar.day4>Fri</calendar.day4><calendar.day5>Sat</calendar.day5><calendar.day6>Sun</calendar.day6><calendar.initDay>6</calendar.initDay><calendar.month0>January</calendar.month0><calendar.month1>February</calendar.month1><calendar.month2>March</calendar.month2><calendar.month3>April</calendar.month3><calendar.month4>May</calendar.month4><calendar.month5>June</calendar.month5><calendar.month6>July</calendar.month6><calendar.month7>August</calendar.month7><calendar.month8>September</calendar.month8><calendar.month9>October</calendar.month9><calendar.month10>November</calendar.month10><calendar.month11>December</calendar.month11><calendar.close>Close</calendar.close><format.date>MM/dd/yyyy</format.date><format.datetime>MM/dd/yyyy\x20hh:mm:ss</format.datetime><format.decimal>.</format.decimal><format-number.decimal-separator-sign>.</format-number.decimal-separator-sign><format-number.exponent-separator-sign>e</format-number.exponent-separator-sign><format-number.grouping-separator-sign>,</format-number.grouping-separator-sign><format-number.infinity>Infinity</format-number.infinity><format-number.minus-sign>-</format-number.minus-sign><format-number.NaN>NaN</format-number.NaN><format-number.percent-sign>%</format-number.percent-sign><format-number.per-mille-sign>&#8240;</format-number.per-mille-sign><status>...\x20Loading\x20...</status></properties>');
XsltForms_browser.config = xsltforms_instance_config.doc.documentElement;
*/
          XsltForms_class.activateAll(XsltForms_subform.subforms["xsltforms-mainform"], document, function() {XsltForms_browser.i18n.asyncinit(XsltForms_globals.init);});
        }
      } catch(e) {
        alert("XSLTForms Exception\n--------------------------\n\nIncorrect Javascript code generation:\n\n"+(typeof(e.stack)==="undefined"?"":e.stack)+"\n\n"+(e.name?e.name+(e.message?"\n\n"+e.message:""):e));
      }
    };
//    XsltForms_browser.events.attach(document, "unload", XsltForms_globals.close);
    window.addEventListener("beforeunload", (event) => {
      /*
      let ismodified = false;
      XsltForms_globals.models.forEach(m => {
        for (var id in m.instances) {
          if (m.instances.hasOwnProperty(id)) {
            ismodified |= m.instances[id].modified;
          }
        }   
      });
      if (ismodified) {
        //event.preventDefault();
        //event.returnValue = "Unsaved data";
        //return "Unsaved data";
      }
      */
      if (XsltForms_globals.hasusername && XsltForms_globals.haspassword && PasswordCredential) {
        const credential = new PasswordCredential(XsltForms_globals.formelt);
        navigator.credentials.store(credential);
        navigator.credentials.preventSilentAccess();
      }
      //XsltForms_globals.close();
    });
    if (document.readyState === "complete") {
      xsltforms_init();
    } else {
      XsltForms_browser.addLoadListener(xsltforms_init);
    }
  })();
}