"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module XPathCoreFunctions
 * @description  === XsltForms_xpathCoreFunctions Associative Array ===
 * XsltForms_browser XPath Functions
 */
    
var XsltForms_mathConstants = {
  "PI":      "3.14159265358979323846264338327950288419716939937510582",
  "E":       "2.71828182845904523536028747135266249775724709369995958",
  "SQRT2":   "1.41421356237309504880168872420969807856967187537694807",
  "LN2":     "0.693147180559945309417232121458176568075500134360255254",
  "LN10":    "2.30258509299404568401799145468436420760110148862877298",
  "LOG2E":   "1.44269504088896340735992468100189213742664595415298594",
  "SQRT1_2": "0.707106781186547524400844362104849039284835937688474038"
};

var XsltForms_xpathFunctionExceptions = {
  lastInvalidArgumentsNumber: {
    name: "last(): Invalid number of arguments",
    message: "last() function has no argument"
  },
  positionInvalidArgumentsNumber: {
    name: "position(): Invalid number of arguments",
    message: "position() function has no argument"
  },
  countInvalidArgumentsNumber: {
    name: "count(): Invalid number of arguments",
    message: "count() function must have one argument exactly"
  },
  countInvalidArgumentType: {
    name: "count(): Invalid type of argument",
    message: "count() function must have a nodeset argument"
  },
  idInvalidArgumentsNumber: {
    name: "id(): Invalid number of arguments",
    message: "id() function must have one argument exactly"
  },
  idInvalidArgumentType: {
    name: "id(): Invalid type of argument",
    message: "id() function must have a nodeset or string argument"
  },
  localNameInvalidArgumentsNumber: {
    name: "local-name(): Invalid number of arguments",
    message: "local-name() function must have one argument at most"
  },
  localNameInvalidArgumentType: {
    name: "local-name(): Invalid type of argument",
    message: "local-name() function must have a nodeset argument"
  },
  localNameNoContext: {
    name: "local-name(): no context node",
    message: "local-name() function must have a nodeset argument"
  },
  namespaceUriInvalidArgumentsNumber: {
    name: "namespace-uri(): Invalid number of arguments",
    message: "namespace-uri() function must have one argument at most"
  },
  namespaceUriInvalidArgumentType: {
    name: "namespace-uri(): Invalid type of argument",
    message: "namespace-uri() function must have a nodeset argument"
  },
  nameInvalidArgumentsNumber: {
    name: "name(): Invalid number of arguments",
    message: "name() function must have one argument at most"
  },
  nameInvalidArgumentType: {
    name: "name(): Invalid type of argument",
    message: "name() function must have a nodeset argument"
  },
  stringInvalidArgumentsNumber: {
    name: "string(): Invalid number of arguments",
    message: "string() function must have one argument at most"
  },
  concatInvalidArgumentsNumber: {
    name: "concat(): Invalid number of arguments",
    message: "concat() function must have at least two arguments"
  },
  startsWithInvalidArgumentsNumber: {
    name: "starts-with(): Invalid number of arguments",
    message: "starts-with() function must have two arguments exactly"
  },
  endsWithInvalidArgumentsNumber: {
    name: "ends-with(): Invalid number of arguments",
    message: "ends-with() function must have two arguments exactly"
  },
  containsInvalidArgumentsNumber: {
    name: "contains(): Invalid number of arguments",
    message: "contains() function must have two arguments exactly"
  },
  substringBeforeInvalidArgumentsNumber: {
    name: "substring-before(): Invalid number of arguments",
    message: "substring-before() function must have two arguments exactly"
  },
  replaceInvalidArgumentsNumber: {
    name: "replace(): Invalid number of arguments",
    message: "replace() function must have three arguments exactly"
  },
  substringAfterInvalidArgumentsNumber: {
    name: "substring-after(): Invalid number of arguments",
    message: "substring-after() function must have two arguments exactly"
  },
  substringInvalidArgumentsNumber: {
    name: "substring(): Invalid number of arguments",
    message: "substring() function must have two or three arguments"
  },
  compareInvalidArgumentsNumber: {
    name: "compare(): Invalid number of arguments",
    message: "compare() function must have two arguments exactly"
  },
  stringLengthInvalidArgumentsNumber: {
    name: "string-length(): Invalid number of arguments",
    message: "string-length() function must have one argument at most"
  },
  normalizeSpaceInvalidArgumentsNumber: {
    name: "normalize-space(): Invalid number of arguments",
    message: "normalize-space() function must have one argument at most"
  },
  translateInvalidArgumentsNumber: {
    name: "translate(): Invalid number of arguments",
    message: "translate() function must have three argument exactly"
  },
  booleanInvalidArgumentsNumber: {
    name: "boolean(): Invalid number of arguments",
    message: "boolean() function must have one argument exactly"
  },
  notInvalidArgumentsNumber: {
    name: "not(): Invalid number of arguments",
    message: "not() function must have one argument exactly"
  },
  trueInvalidArgumentsNumber: {
    name: "true(): Invalid number of arguments",
    message: "true() function must have no argument"
  },
  falseInvalidArgumentsNumber: {
    name: "false(): Invalid number of arguments",
    message: "false() function must have no argument"
  },
  langInvalidArgumentsNumber: {
    name: "lang(): Invalid number of arguments",
    message: "lang() function must have one argument exactly"
  },
  numberInvalidArgumentsNumber: {
    name: "number(): Invalid number of arguments",
    message: "number() function must have one argument exactly"
  },
  sumInvalidArgumentsNumber: {
    name: "sum(): Invalid number of arguments",
    message: "sum() function must have one argument exactly"
  },
  sumInvalidArgumentType: {
    name: "sum(): Invalid type of argument",
    message: "sum() function must have a nodeset argument"
  },
  floorInvalidArgumentsNumber: {
    name: "floor(): Invalid number of arguments",
    message: "floor() function must have one argument exactly"
  },
  ceilingInvalidArgumentsNumber: {
    name: "ceiling(): Invalid number of arguments",
    message: "ceiling() function must have one argument exactly"
  },
  roundInvalidArgumentsNumber: {
    name: "round(): Invalid number of arguments",
    message: "round() function must have one argument exactly"
  },
  powerInvalidArgumentsNumber: {
    name: "power(): Invalid number of arguments",
    message: "power() function must have one argument exactly"
  },
  randomInvalidArgumentsNumber: {
    name: "random(): Invalid number of arguments",
    message: "random() function must have no argument"
  },
  booleanFromStringInvalidArgumentsNumber: {
    name: "boolean-from-string(): Invalid number of arguments",
    message: "boolean-from-string() function must have one argument exactly"
  },
  ifInvalidArgumentsNumber: {
    name: "if(): Invalid number of arguments",
    message: "if() function must have three argument exactly"
  },
  chooseInvalidArgumentsNumber: {
    name: "choose(): Invalid number of arguments",
    message: "choose() function must have three argument exactly"
  },
  digestInvalidArgumentsNumber: {
    name: "digest(): Invalid number of arguments",
    message: "digest() function must have two or three arguments"
  },
  hmacInvalidArgumentsNumber: {
    name: "choose(): Invalid number of arguments",
    message: "choose() function must have three or four arguments"
  },
  avgInvalidArgumentsNumber: {
    name: "avg(): Invalid number of arguments",
    message: "avg() function must have one argument exactly"
  },
  avgInvalidArgumentType: {
    name: "avg(): Invalid type of argument",
    message: "avg() function must have a nodeset argument"
  },
  minInvalidArgumentsNumber: {
    name: "min(): Invalid number of arguments",
    message: "min() function must have one argument exactly"
  },
  minInvalidArgumentType: {
    name: "min(): Invalid type of argument",
    message: "min() function must have a nodeset argument"
  },
  maxInvalidArgumentsNumber: {
    name: "max(): Invalid number of arguments",
    message: "max() function must have one argument exactly"
  },
  maxInvalidArgumentType: {
    name: "max(): Invalid type of argument",
    message: "max() function must have a nodeset argument"
  },
  serializeInvalidArgumentType: {
    name: "serialize(): Invalid type of argument",
    message: "serialize() function must have a nodeset argument"
  },
  countNonEmptyInvalidArgumentsNumber: {
    name: "count-non-empty(): Invalid number of arguments",
    message: "count-non-empty() function must have one argument exactly"
  },
  countNonEmptyInvalidArgumentType: {
    name: "count-non-empty(): Invalid type of argument",
    message: "count-non-empty() function must have a nodeset argument"
  },
  indexInvalidArgumentsNumber: {
    name: "index(): Invalid number of arguments",
    message: "index() function must have one argument exactly"
  },
  nodeIndexInvalidArgumentsNumber: {
    name: "nodeIndex(): Invalid number of arguments",
    message: "nodeIndex() function must have one argument exactly"
  },
  propertyInvalidArgumentsNumber: {
    name: "property(): Invalid number of arguments",
    message: "property() function must have one argument exactly"
  },
  propertyInvalidArgument: {
    name: "property(): Invalid argument",
    message: "Invalid property name"
  },
  secondsInvalidArgumentsNumber: {
    name: "seconds(): Invalid number of arguments",
    message: "seconds() function must have one argument exactly"
  },
  monthsInvalidArgumentsNumber: {
    name: "months(): Invalid number of arguments",
    message: "months() function must have one argument exactly"
  },
  instanceInvalidArgumentsNumber: {
    name: "instance(): Invalid number of arguments",
    message: "instance() function must have zero or one argument"
  },
  subformInstanceInvalidArgumentsNumber: {
    name: "subform-instance(): Invalid number of arguments",
    message: "subform-instance() function must have no argument"
  },
  subformContextInvalidArgumentsNumber: {
    name: "subform-context(): Invalid number of arguments",
    message: "subform-context() function must have no argument"
  },
  nowInvalidArgumentsNumber: {
    name: "now(): Invalid number of arguments",
    message: "now() function must have no argument"
  },
  localDateInvalidArgumentsNumber: {
    name: "local-date(): Invalid number of arguments",
    message: "local-date() function must have no argument"
  },
  localDateTimeInvalidArgumentsNumber: {
    name: "local-dateTime(): Invalid number of arguments",
    message: "local-dateTime() function must have no argument"
  },
  adjustDateTimeToTimezoneInvalidArgumentsNumber: {
    name: "adjust-dateTime-to-timezone(): Invalid number of arguments",
    message: "adjust-dateTime-to-timezone() function must have zero or one argument"
  },
  daysFromDateInvalidArgumentsNumber: {
    name: "days-from-date(): Invalid number of arguments",
    message: "days-from-date() function must have one argument exactly"
  },
  daysToDateInvalidArgumentsNumber: {
    name: "days-to-date(): Invalid number of arguments",
    message: "days-to-date() function must have one argument exactly"
  },
  secondsToDateTimeInvalidArgumentsNumber: {
    name: "seconds-to-dateTime(): Invalid number of arguments",
    message: "seconds-to-dateTime() function must have one argument exactly"
  },
  secondsFromDateTimeInvalidArgumentsNumber: {
    name: "seconds-from-dateTime(): Invalid number of arguments",
    message: "seconds-from-dateTime() function must have one argument exactly"
  },
  currentInvalidArgumentsNumber: {
    name: "current(): Invalid number of arguments",
    message: "current() function must have no argument"
  },
  validInvalidArgumentsNumber: {
    name: "valid(): Invalid number of arguments",
    message: "valid() function must have one argument exactly"
  },
  validInvalidArgumentType: {
    name: "valid(): Invalid type of argument",
    message: "valid() function must have a nodeset argument"
  },
  isNonEmptyArrayArgumentsNumber: {
    name: "is-non-empty-array(): Invalid number of arguments",
    message: "is-non-empty-array() function must have zero or one argument"
  },
  isNonEmptyArrayInvalidArgumentType: {
    name: "is-non-empty-array(): Invalid type of argument",
    message: "is-non-empty-array() function must have a node argument"
  },
  isCardNumberInvalidArgumentsNumber: {
    name: "is-card-number(): Invalid number of arguments",
    message: "is-card-number() function must have one argument exactly"
  },
  upperCaseInvalidArgumentsNumber: {
    name: "upper-case(): Invalid number of arguments",
    message: "upper-case() function must have one argument exactly"
  },
  lowerCaseInvalidArgumentsNumber: {
    name: "lower-case(): Invalid number of arguments",
    message: "lower-case() function must have one argument exactly"
  },
  formatNumberInvalidArgumentsNumber: {
    name: "format-number(): Invalid number of arguments",
    message: "format-number() function must have two arguments exactly"
  },
  formatDateTimeInvalidArgumentsNumber: {
    name: "format-dateTime(): Invalid number of arguments",
    message: "format-dateTime() function must have two arguments exactly"
  },
  distinctValuesInvalidArgumentsNumber: {
    name: "distinct-values(): Invalid number of arguments",
    message: "distinct-values() function must have one argument exactly"
  },
  sortInvalidArgumentsNumber: {
    name: "sort(): Invalid number of arguments",
    message: "sort function must have one argument exactly"
  },
  transformInvalidArgumentsNumber: {
    name: "transform(): Invalid number of arguments",
    message: "transform() function must have two arguments exactly"
  },
  serializeNoContext: {
    name: "serialize(): no context node",
    message: "serialize() function must have a node argument"
  },
  serializeInvalidArgumentsNumber: {
    name: "serialize(): Invalid number of arguments",
    message: "serialize() function must have one argument exactly"
  },
  eventInvalidArgumentsNumber: {
    name: "event(): Invalid number of arguments",
    message: "event() function must have one argument exactly"
  },
  bindInvalidArgumentsNumber: {
    name: "bind(): Invalid number of arguments",
    message: "bind() function must have one argument exactly"
  },
  alertInvalidArgumentsNumber: {
    name: "alert(): Invalid number of arguments",
    message: "alert() function must have one argument exactly"
  },
  jsevalInvalidArgumentsNumber: {
    name: "js-eval(): Invalid number of arguments",
    message: "js-eval() function must have one argument exactly"
  },
  stringJoinInvalidArgumentsNumber: {
    name: "string-join(): Invalid number of arguments",
    message: "string-join() function must have one or two arguments"
  },
  stringJoinInvalidArgumentType: {
    name: "string-join(): Invalid type of argument",
    message: "string-join() function must have a nodeset argument"
  },
  itextInvalidArgumentsNumber: {
    name: "itext(): Invalid number of arguments",
    message: "itext() function must have one argument"
  },
  selectionInvalidArgumentsNumber: {
    name: "selection(): Invalid number of arguments",
    message: "selection() function must have one argument exactly"
  },
  controlPropertyInvalidArgumentsNumber: {
    name: "control-property(): Invalid number of arguments",
    message: "control-property() function must have two arguments exactly"
  },
  encodeForUriInvalidArgumentsNumber: {
    name: "encode-for-uri(): Invalid number of arguments",
    message: "encode-for-uri() function must have one argument exactly"
  },
  matchInvalidArgumentsNumber: {
    name: "match(): Invalid number of arguments",
    message: "match() function must have two or three arguments"
  },
  uuidInvalidArgumentsNumber: {
    name: "uuid(): Invalid number of arguments",
    message: "uuid() function must have no argument"
  },
  metaInvalidArgumentsNumber: {
    name: "meta(): Invalid number of arguments",
    message: "meta() function must have one or two arguments"
  },
  formSourceInvalidArgumentsNumber: {
    name: "form-source(): Invalid number of arguments",
    message: "form-source() function has no argument"
  }
};
    
var XsltForms_xpathCoreFunctions = {

    
/**
 * * '''node()'''
 */

  "http://www.w3.org/2005/xpath-functions node": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.nodeInvalidArgumentsNumber;
      }
      return ctx.current.childNodes;
    } ),

    
/**
 * * '''comment()'''
 */

  "http://www.w3.org/2005/xpath-functions comment": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.commentInvalidArgumentsNumber;
      }
      var result = [];
      if (ctx.current.childNodes) {
        for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
          if (ctx.current.childNodes[i].nodeType === Fleur.Node.COMMENT_NODE) {
            result.push(ctx.current.childNodes[i]);
          }
        }
      }
      return result;
    } ),

    
/**
 * * '''text()'''
 */

  "http://www.w3.org/2005/xpath-functions text": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
      }
      var result = [];
      if (ctx.current.childNodes) {
        for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
          if (ctx.current.childNodes[i].nodeType === Fleur.Node.TEXT_NODE) {
            result.push(ctx.current.childNodes[i]);
          }
        }
      }
      return result;
    } ),

    
/**
 * * '''array()'''
 */

  "http://www.w3.org/2005/xpath-functions array": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
      }
      var result = [];
      if (ctx.current.childNodes) {
        for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
          if (ctx.current.childNodes[i].nodeType === Fleur.Node.ARRAY_NODE) {
            result.push(ctx.current.childNodes[i]);
          }
        }
      }
      return result;
    } ),

    
/**
 * * '''map()'''
 */

  "http://www.w3.org/2005/xpath-functions map": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
      }
      var result = [];
      if (ctx.current.childNodes) {
        for (var i = 0, len = ctx.current.childNodes.length; i < len; i++) {
          if (ctx.current.childNodes[i].nodeType === Fleur.Node.MAP_NODE) {
            result.push(ctx.current.childNodes[i]);
          }
        }
      }
      return result;
    } ),

    
/**
 * * '''entry()'''
 */

  "http://www.w3.org/2005/xpath-functions entry": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.textInvalidArgumentsNumber;
      }
      var result = [];
      if (ctx.current.entries) {
        for (var i = 0, len = ctx.current.entries.length; i < len; i++) {
          result.push(ctx.current.entries[i]);
        }
      }
      return result;
    } ),

    
/**
 * * '''last()'''
 */

  "http://www.w3.org/2005/xpath-functions last": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.lastInvalidArgumentsNumber;
      }
      return ctx.nodelist.length;
    } ),

    
/**
 * * '''position()'''
 */

  "http://www.w3.org/2005/xpath-functions position": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.positionInvalidArgumentsNumber;
      }
      return ctx.position;
    } ),

    
/**
 * * '''context()'''
 */

  "http://www.w3.org/2002/xforms context": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.positionInvalidArgumentsNumber;
      }
      return [ctx.current];
    } ),

    
/**
 * * '''count(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions count": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet) { 
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.countInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.countInvalidArgumentType;
      }
      return nodeSet.length;
    } ),

    
/**
 * * '''id(node?)'''
 */

  "http://www.w3.org/2005/xpath-functions id": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NODE, false,
    function(context, object, ref) {
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.idInvalidArgumentsNumber;
      }
      if (typeof object !== "object" && typeof object !== "string") {
        throw XsltForms_xpathFunctionExceptions.idInvalidArgumentType;
      }
      var result = [];
      if (!ref) {
        ref = context.node.ownerDocument ? [context.node.ownerDocument]: [context.node];
      }
      if (typeof object !== "string" && typeof(object.length) !== "undefined") {
        for (var i = 0, len = object.length; i < len; ++i) {
          var res = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions id'].evaluate(context, object[i], ref);
          for (var j = 0, len1 = res.length; j < len1; j++) {
            result.push(res[j]);
          }
        }
      } else if (context.node) {
        var ids = XsltForms_globals.stringValue(object).split(/\s+/);
        var idattr = XsltForms_globals.IDstr ? XsltForms_globals.IDstr: "@xml:id";
        for (var k = 0, len2 = ids.length; k < len2; k++) {
          var n = XsltForms_browser.selectSingleNode("descendant-or-self::*[" + idattr + "='" + ids[k] + "']", ref[0]);
          if (n) {
            result.push(n);
          }
          n = XsltForms_browser.selectSingleNode("descendant-or-self::*[@*[local-name() = 'type'] = 'xsd:ID' and . = '" + ids[k] + "']", ref[0]);
          if (n) {
            result.push(n);
          }
        }
      }
      return result;
    } ),

    
/**
 * * '''local-name(nodeset?)'''
 */

  "http://www.w3.org/2005/xpath-functions local-name": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(nodeSet) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.localNameInvalidArgumentsNumber;
      }
      if (arguments.length === 1 && typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.localNameInvalidArgumentType;
      }
      if (arguments.length === 0) {
        throw XsltForms_xpathFunctionExceptions.localNameNoContext;
      }
      return nodeSet.length === 0 ? "": nodeSet[0].nodeName.replace(/^.*:/, "");
    } ),

    
/**
 * * '''namespace-uri(nodeset?)'''
 */

  "http://www.w3.org/2005/xpath-functions namespace-uri": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(nodeSet) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.namespaceUriInvalidArgumentsNumber;
      }
      if (arguments.length === 1 && typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.namespaceUriInvalidArgumentType;
      }
      return nodeSet.length === 0? "": nodeSet[0].namespaceURI || "";
    } ),

    
/**
 * * '''name(nodeset?)'''
 */

  "http://www.w3.org/2005/xpath-functions name": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(nodeSet) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.nameInvalidArgumentsNumber;
      }
      if (arguments.length === 1 && typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.nameInvalidArgumentType;
      }
      return nodeSet.length === 0? "": nodeSet[0].nodeName;
    } ),

    
/**
 * * '''string(nodeset?)'''
 */

  "http://www.w3.org/2005/xpath-functions string": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(object) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.stringInvalidArgumentsNumber;
      }
      return XsltForms_globals.stringValue(object);
    } ),

    
/**
 * * '''concat(string, string, string*)'''
 */

  "http://www.w3.org/2005/xpath-functions concat": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length <2) {
        throw XsltForms_xpathFunctionExceptions.concatInvalidArgumentsNumber;
      }
      var string = "";
      for (var i = 0, len = arguments.length; i < len; ++i) {
        string += XsltForms_globals.stringValue(arguments[i]);
      }
      return string;
    } ),

    
/**
 * * '''starts-with(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions starts-with": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, prefix) {   
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.startsWithInvalidArgumentsNumber;
      }
      return XsltForms_globals.stringValue(string).indexOf(XsltForms_globals.stringValue(prefix)) === 0;
    } ),

    
/**
 * * '''ends-with(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions ends-with": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, postfix) {   
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.endsWithInvalidArgumentsNumber;
      }
      var s = XsltForms_globals.stringValue(string);
      var p = XsltForms_globals.stringValue(postfix);
      return s.substr(s.length - p.length, p.length) === p;
    } ),

    
/**
 * * '''contains(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions contains": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, substring) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.containsInvalidArgumentsNumber;
      }
      return XsltForms_globals.stringValue(string).indexOf(XsltForms_globals.stringValue(substring)) !== -1;
    } ),

    
/**
 * * '''substring-before(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions substring-before": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, substring) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.substringBeforeInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      return string.substring(0, string.indexOf(XsltForms_globals.stringValue(substring)));
    } ),

    
/**
 * * '''substring-after(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions substring-after": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, substring) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.substringAfterInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      substring = XsltForms_globals.stringValue(substring);
      var index = string.indexOf(substring);
      return index === -1 ? "": string.substring(index + substring.length);
    } ),

    
/**
 * * '''substring(string, number)''' and '''substring(string?, number?, number?)'''
 */

  "http://www.w3.org/2005/xpath-functions substring": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, index, len) {
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.substringInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      index  = Math.round(XsltForms_globals.numberValue(index));
      if (isNaN(index)) {
        return "";
      }
      if (len) {
        len = Math.round(XsltForms_globals.numberValue(len));
        if (index <= 0) {
          return string.substr(0, index + len - 1);
        }
        return string.substr(index - 1, len);
      }
      return string.substr(Math.max(index - 1, 0));
    } ),

    
/**
 * * '''compare(string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions compare": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string1, string2) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.compareInvalidArgumentsNumber;
      }
      string1 = XsltForms_globals.stringValue(string1);
      string2 = XsltForms_globals.stringValue(string2);
      return (string1 === string2 ? 0: (string1 > string2 ? 1: -1));
    } ),

    
/**
 * * '''string-length(string?)'''
 */

  "http://www.w3.org/2005/xpath-functions string-length": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_STRING, false,
    function(string) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.stringLengthInvalidArgumentsNumber;
      }
      return XsltForms_globals.stringValue(string).length;
    } ),

    
/**
 * * '''normalize-space(string?)'''
 */

  "http://www.w3.org/2005/xpath-functions normalize-space": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_STRING, false,
    function(string) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.normalizeSpaceLengthInvalidArgumentsNumber;
      }
      return XsltForms_globals.stringValue(string).replace(/^\s+|\s+$/g, "")
        .replace(/\s+/, " ");
    } ),

    
/**
 * * '''translate(string, string, string)'''
 */

  "http://www.w3.org/2005/xpath-functions translate": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, from, to) {
      if (arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.translateInvalidArgumentsNumber;
      }
      string =  XsltForms_globals.stringValue(string);
      from = XsltForms_globals.stringValue(from);
      to = XsltForms_globals.stringValue(to);
      var result = "";
      for (var i = 0, len = string.length; i < len; ++i) {
        var index = from.indexOf(string.charAt(i));
        result += index === -1? string.charAt(i): to.charAt(index);
      }
      return result;
    } ),

    
/**
 * * '''replace(string, pattern, replacement)'''
 */

  "http://www.w3.org/2005/xpath-functions replace": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, pattern, replacement) {
      if (arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.replaceInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      return string.replace(new RegExp(XsltForms_globals.stringValue(pattern), "g"), XsltForms_globals.stringValue(replacement));
    } ),

    
/**
 * * '''boolean(object)'''
 */

  "http://www.w3.org/2005/xpath-functions boolean": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(object) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.booleanInvalidArgumentsNumber;
      }
      return XsltForms_globals.booleanValue(object);
    } ),

    
/**
 * * '''not(boolean)'''
 */

  "http://www.w3.org/2005/xpath-functions not": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(condition) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.notInvalidArgumentsNumber;
      }
      return !XsltForms_globals.booleanValue(condition);
    } ),

    
/**
 * * '''true()'''
 */

  "http://www.w3.org/2005/xpath-functions true": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.trueInvalidArgumentsNumber;
      }
      return true;
    } ),

    
/**
 * * '''false()'''
 */

  "http://www.w3.org/2005/xpath-functions false": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.falseInvalidArgumentsNumber;
      }
      return false;
    } ),

    
/**
 * * '''lang(string)'''
 */

  "http://www.w3.org/2005/xpath-functions lang": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(context, language) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.langInvalidArgumentsNumber;
      }
      language = XsltForms_globals.stringValue(language);
      for (var node = context.node; node; node = node.parentNode) {
        if (typeof(node.attributes) === "undefined") {
          continue;
        }
        var xmlLang = node.attributes.getNamedItemNS("http://www.w3.org/XML/1998/namespace", "lang");
        if (xmlLang) {
          xmlLang  = xmlLang.value.toLowerCase();
          language = language.toLowerCase();
          return xmlLang.indexOf(language) === 0 && (language.length === xmlLang.length || language.charAt(xmlLang.length) === '-');
        }
      }
      return false;
    } ),

    
/**
 * * '''number(object)'''
 */

  "http://www.w3.org/2005/xpath-functions number": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(object) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.numberInvalidArgumentsNumber;
      }
      return XsltForms_globals.numberValue(object);
    } ),

    
/**
 * * '''sum(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions sum": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.sumInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.sumInvalidArgumentType;
      }
      var sum = 0;
      for (var i = 0, len = nodeSet.length; i < len; ++i) {
        sum += XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
      }
      return sum;
    } ),

    
/**
 * * '''floor(number)'''
 */

  "http://www.w3.org/2005/xpath-functions floor": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.floorInvalidArgumentsNumber;
      }
      return Math.floor(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''ceiling(number)'''
 */

  "http://www.w3.org/2005/xpath-functions ceiling": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.ceilingInvalidArgumentsNumber;
      }
      return Math.ceil(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''round(number)'''
 */

  "http://www.w3.org/2005/xpath-functions round": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.roundInvalidArgumentsNumber;
      }
      return Math.round(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''power(number, number)'''
 */

  "http://www.w3.org/2002/xforms power": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(x, y) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.powerInvalidArgumentsNumber;
      }
      return Math.pow(XsltForms_globals.numberValue(x), XsltForms_globals.numberValue(y));
    } ),

    
/**
 * * '''random()'''
 */

  "http://www.w3.org/2002/xforms random": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.randomInvalidArgumentsNumber;
      }
      return Math.random();
    } ),

    
/**
 * * '''boolean-from-string(string)'''
 */

  "http://www.w3.org/2002/xforms boolean-from-string": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.booleanFromStringInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      switch (string.toLowerCase()) {
        case "true":  case "1": return true;
        case "false": case "0": return false;
        default: return false;
      }
    } ),

    
/**
 * * '''if(boolean, object, object)'''
 */

  "http://www.w3.org/2002/xforms if": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, true,
    function(condition, onTrue, onFalse) {
      if (arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.ifInvalidArgumentsNumber;
      }
      return XsltForms_globals.booleanValue(condition)? onTrue: onFalse;
    } ),

    
/**
 * * '''choose(boolean, object, object)'''
 */

  "http://www.w3.org/2002/xforms choose": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, true,
    function(condition, onTrue, onFalse) {
      if (arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.chooseInvalidArgumentsNumber;
      }
      return XsltForms_globals.booleanValue(condition)? onTrue: onFalse;
    } ),

    
/**
 * * '''avg(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions avg": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.avgInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.avgInvalidArgumentType;
      }
      var sum = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions sum'].evaluate(nodeSet);
      var quant = XsltForms_xpathCoreFunctions['http://www.w3.org/2005/xpath-functions count'].evaluate(nodeSet);
      return sum / quant;
    } ),

    
/**
 * * '''min(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions min": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function (nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.minInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.minInvalidArgumentType;
      }
      if (nodeSet.length === 0) {
        return NaN;
      }
      var minimum = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[0]));
      for (var i = 1, len = nodeSet.length; i < len; ++i) {
        var value = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
        if (isNaN(value)) {
          return NaN;
        }
        if (value < minimum) {
          minimum = value;
        }
      }
      return minimum;
    } ),

    
/**
 * * '''max(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions max": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function (nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.maxInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.maxInvalidArgumentType;
      }
      if (nodeSet.length === 0) {
        return NaN;
      }
      var maximum = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[0]));
      for (var i = 1, len = nodeSet.length; i < len; ++i) {
        var value = XsltForms_globals.numberValue(XsltForms_globals.xmlValue(nodeSet[i]));
        if (isNaN(value)) {
          return NaN;
        }
        if (value > maximum) {
          maximum = value;
        }
      }
      return maximum;
    } ),

    
/**
 * * '''count-non-empty(nodeset)'''
 */

  "http://www.w3.org/2002/xforms count-non-empty": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.countNonEmptyInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.countNonEmptyInvalidArgumentType;
      }
      var count = 0;
      for (var i = 0, len = nodeSet.length; i < len; ++i) {
        if (XsltForms_globals.xmlValue(nodeSet[i]).length > 0) {
          count++;
        }
      }
      return count;
    } ),

    
/**
 * * '''index(string)'''
 */

  "http://www.w3.org/2002/xforms index": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx, id) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.indexInvalidArgumentsNumber;
      }
      var elt = XsltForms_idManager.find(XsltForms_globals.stringValue(id));
      if (!elt) {
        return NaN;
      }
      var xf = elt.xfElement;
      ctx.addDepElement(xf);
      return xf.index;
    } ),

    
/**
 * * '''nodeindex(string)'''
 */

  "http://www.w3.org/2002/xforms nodeindex": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx, id) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.nodeIndexInvalidArgumentsNumber;
      }
      var control = XsltForms_idManager.find(XsltForms_globals.stringValue(id));
      var node = control.node;
      ctx.addDepElement(control.xfElement);
      if (node) {
        ctx.addDepNode(node);
        ctx.addDepElement(document.getElementById(XsltForms_browser.getDocMeta(node.nodeType === Fleur.Node.DOCUMENT_NODE ? node: node.ownerDocument, "model")).xfElement);
      }
      return node? [ node ]: [];
    } ),

    
/**
 * * '''property(string)'''
 */

  "http://www.w3.org/2002/xforms property": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(pname) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.propertyInvalidArgumentsNumber;
      }
      pname = XsltForms_globals.stringValue(pname);
      switch (pname) {
        case "version": return "1.1";
        case "conformance-level": return "full";
        case "xsltforms:debug-mode": return XsltForms_globals.debugMode ? "on": "off";
        case "xsltforms:version": return XsltForms_globals.fileVersion;
        case "xsltforms:version-number": return ""+XsltForms_globals.fileVersionNumber;
        default:
          if (pname.substring(0,4) === "xsl:") {
            var xslname = pname.substring(4);
            var xsltsrc = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:msxsl="urn:schemas-microsoft-com:xslt">' +
            '  <xsl:output method="xml"/>' +
            '  <xsl:template match="/">' +
            '    <xsl:variable name="version">' +
            '      <xsl:if test="system-property(\'xsl:vendor\')=\'Microsoft\'">' +
            '        <xsl:value-of select="system-property(\'msxsl:version\')"/>' +
            '      </xsl:if>' +
            '    </xsl:variable>' +
            '    <properties><xsl:value-of select="concat(\'|vendor=\',system-property(\'xsl:vendor\'),\'|vendor-url=\',system-property(\'xsl:vendor-url\'),\'|vendor-version=\',$version,\'|\')"/></properties>' +
            '  </xsl:template>' +
            '</xsl:stylesheet>';
            var res = XsltForms_browser.transformText("<dummy/>", xsltsrc, true);
            var spres = res.split("|");
            for (var i = 1, len = spres.length; i < len; i++) {
              var spprop = spres[i].split("=", 2);
              if (spprop[0] === xslname) {
                return spprop[1];
              }
            }
          }
          if (pname.match("^[" + XsltForms_typeDefs.ctes.i + "][" + XsltForms_typeDefs.ctes.c + "]*$")) {
            XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-binding-exception", "Invalid NCNAME");
          }
      }
      return "";
    } ),

    
/**
 * * '''seconds(string)'''
 */

  "http://www.w3.org/2002/xforms seconds": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(duration) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.secondsInvalidArgumentsNumber;
      }
      duration = XsltForms_globals.stringValue(duration);
      var durarr = duration.match("^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$");
      if (durarr) {
        return (duration.charAt(0) === '-'? -1: 1)*(((parseFloat(durarr[3] || 0)*24 + parseFloat(durarr[5] || 0))*60 + parseFloat(durarr[6] || 0))*60 + parseFloat(durarr[7] || 0));
      }
      return NaN;
    } ),

    
/**
 * * '''months(string)'''
 */

  "http://www.w3.org/2002/xforms months": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(duration) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.monthsInvalidArgumentsNumber;
      }
      duration = XsltForms_globals.stringValue(duration);
      var durarr = duration.match("^-?P(?!$)([0-9]+Y)?([0-9]+M)?([0-9]+D)?(T(?!$)([0-9]+H)?([0-9]+M)?([0-9]+(\\.[0-9]+)?S)?)?$");
      if (durarr) {
        return (duration.charAt(0) === '-'? -1: 1)*(parseFloat(durarr[1] || 0)*12 + parseFloat(durarr[2] || 0));
      }
      return NaN;
    } ),

    
/**
 * * '''instance(string?)'''
 */

  "http://www.w3.org/2002/xforms instance": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
    /* @callback */ function(ctx, idRef, filename, mediatype) {
      if (arguments.length > 4) {
        throw XsltForms_xpathFunctionExceptions.instanceInvalidArgumentsNumber;
      }
      var iname = idRef ? XsltForms_globals.stringValue(idRef): "";
      var res;
      if (iname !== "") {
        var instance = document.getElementById(iname);
        if (!instance) {
          throw new Error({name: "instance " + iname + " not found"});
        }
        if (filename && instance.xfElement.archive) {
          filename = XsltForms_globals.stringValue(filename);
          var f = instance.xfElement.archive[filename];
          if (!f) {
            throw new Error({name: "file " + filename + " not found in instance " + iname});
          }
          if (!f.doc) {
            f.doc = XsltForms_browser.createXMLDocument("<dummy/>");
            var modid = XsltForms_browser.getDocMeta(instance.xfElement.doc, "model");
            XsltForms_browser.loadDoc(f.doc, XsltForms_browser.utf8decode(zip_inflate(f.compressedFileData)));
            XsltForms_browser.setDocMeta(f.doc, "instance", idRef);
            XsltForms_browser.setDocMeta(f.doc, "model", modid);
          }
          res = f.doc.documentElement;
        }
        res = instance.xfElement.doc.documentElement;
      } else {
        res = ctx.node.ownerDocument.documentElement;
      }
      ctx.addDepNode(res);
      return [res];
    } ),

    
/**
 * * '''subform-instance()'''
 */

  "http://www.w3.org/2005/xpath-functions subform-instance": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
    function(ctx) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.subformInstanceInvalidArgumentsNumber;
      }
      return [ctx.subform.instances[0].doc.documentElement];
    } ),

    
/**
 * * '''subform-context()'''
 */

  "http://www.w3.org/2005/xpath-functions subform-context": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
    function(ctx) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.subformContextInvalidArgumentsNumber;
      }
      var b = document.getElementById(ctx.subform.eltid).xfElement.boundnodes;
      return b ? [b[0]]: [];
    } ),

    
/**
 * * '''now()'''
 */

  "http://www.w3.org/2002/xforms now": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.nowInvalidArgumentsNumber;
      }
      return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", false);
    } ),

    
/**
 * * '''local-date()'''
 */

  "http://www.w3.org/2002/xforms local-date": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.localDateInvalidArgumentsNumber;
      }
      return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddz", true);
    } ),

    
/**
 * * '''local-dateTime()'''
 */

  "http://www.w3.org/2002/xforms local-dateTime": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.localDateTimeInvalidArgumentsNumber;
      }
      return XsltForms_browser.i18n.format(new Date(), "yyyy-MM-ddThh:mm:ssz", true);
    } ),

    
/**
 * * '''adjust-dateTime-to-timezone(string)'''
 */

  "http://www.w3.org/2002/xforms adjust-dateTime-to-timezone": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string) {
      if (arguments.length === 0) {
        return "";
      }
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.adjustDateTimeToTimezoneInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      if( !XsltForms_schema.getType("xsd_:date").validate(string) && !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
        return "";
      }
      var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+\-])?([01][0-9]|2[0-3])?:?([0-5][0-9])?/;
      var c = p.exec(string);
      var d;
      if (c[8]) {
        d = new Date(Date.UTC(c[1], c[2]-1, c[3], c[4], c[5], c[6]));
        if (c[8] !== "Z") {
          d.setUTCMinutes(d.getUTCMinutes() + (c[8] === "+" ? -1: 1)*(c[9]*60 + Number(c[10])));
        }
      } else {
        d = new Date(c[1], c[2]-1, c[3], c[4], c[5], c[6]);
      }
      return XsltForms_browser.i18n.format(d, "yyyy-MM-ddThh:mm:ssz", true);
    } ),

    
/**
 * * '''days-from-date(string)'''
 */

  "http://www.w3.org/2002/xforms days-from-date": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.daysFromDateInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      if( !XsltForms_schema.getType("xsd_:date").validate(string) && !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
        return "NaN";
      }
      var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/;
      var c = p.exec(string);
      var d = new Date(Date.UTC(c[1], c[2]-1, c[3]));
      return Math.floor(d.getTime()/ 86400000 + 0.000001);
    } ),

    
/**
 * * '''days-to-date(number)'''
 */

  "http://www.w3.org/2002/xforms days-to-date": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.daysToDateInvalidArgumentsNumber;
      }
      number = XsltForms_globals.numberValue(number);
      if( isNaN(number) ) {
        return "";
      }
      var d = new Date();
      d.setTime(Math.floor(number + 0.000001) * 86400000);
      return XsltForms_browser.i18n.format(d, "yyyy-MM-dd", false);
    } ),

    
/**
 * * '''seconds-from-dateTime(string)'''
 */

  "http://www.w3.org/2002/xforms seconds-from-dateTime": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.secondsFromDateTimeInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string);
      if( !XsltForms_schema.getType("xsd_:dateTime").validate(string)) {
        return "NaN";
      }
      var p = /^([12][0-9]{3})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+\-])?([01][0-9]|2[0-3])?:?([0-5][0-9])?/;
      var c = p.exec(string);
      var d = new Date(Date.UTC(c[1], c[2]-1, c[3], c[4], c[5], c[6]));
      if (c[8] && c[8] !== "Z") {
        d.setUTCMinutes(d.getUTCMinutes() + (c[8] === "+" ? -1: 1)*(c[9]*60 + Number(c[10])));
      }
      return Math.floor(d.getTime() / 1000 + 0.000001) + (c[7]?Number(c[7]):0);
    } ),

    
/**
 * * '''seconds-to-dateTime(number)'''
 */

  "http://www.w3.org/2002/xforms seconds-to-dateTime": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.secondsToDateTimeInvalidArgumentsNumber;
      }
      number = XsltForms_globals.numberValue(number);
      if( isNaN(number) ) {
        return "";
      }
      var d = new Date();
      d.setTime(Math.floor(number + 0.000001) * 1000);
      return XsltForms_browser.i18n.format(d, "yyyy-MM-ddThh:mm:ssz", false);
    } ),

    
/**
 * * '''current()'''
 */

  "http://www.w3.org/2002/xforms current": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, true,
    function(ctx) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.currentInvalidArgumentsNumber;
      }
      ctx.addDepNode(ctx.node);
      ctx.addDepElement(document.getElementById(XsltForms_browser.getDocMeta(ctx.node.nodeType === Fleur.Node.DOCUMENT_NODE ? ctx.node: ctx.node.ownerDocument, "model")).xfElement);
      return [ctx.current];
    } ),

    
/**
 * * '''valid(nodeset?)'''
 */

  "http://www.w3.org/2002/xforms valid": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.validInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.validInvalidArgumentType;
      }
      var valid = true;
      for (var i = 0, len = nodeSet.length; valid && i < len; i++) {
        valid = valid && XsltForms_globals.validate_(nodeSet[i]);
      }
      return valid;
    } ),

    
/**
 * * '''is-card-number(nodeset?)'''
 */

  "http://www.w3.org/2002/xforms is-card-number": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(string) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.isCardNumberInvalidArgumentsNumber;
      }
      string = XsltForms_globals.stringValue(string).trim();
      var sum = 0;
      var tab = new Array(string.length);
      for (var i = 0, l = string.length; i < l; i++) {
        tab[i] = string.charAt(i) - '0';
        if( tab[i] < 0 || tab[i] > 9 ) {
          return false;
        }
      }
      for (var j = tab.length-2; j >= 0; j -= 2) {
        tab[j] *= 2;
        if( tab[j] > 9 ) {
          tab[j] -= 9;
        }
      }
      for (var k = 0, l2 = tab.length; k < l2; k++) {
        sum += tab[k];
      }
      return sum % 10 === 0;
    } ),

    
/**
 * * '''digest(string, string, string?)'''
 */

  "http://www.w3.org/2002/xforms digest": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(str, algo, enco) {
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.digestInvalidArgumentsNumber;
      }
      algo = XsltForms_globals.stringValue(algo);
      if (algo !== "SHA-1" && algo !== "MD5" && algo !== "SHA-256" && algo !== "BASE64") {
        XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid crypting method");
        return "unsupported";
      }
      enco = enco ? XsltForms_globals.stringValue(enco): "base64";
      if (enco !== "hex" && enco !== "base64") {
        XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid encoding method");
        return "unsupported";
      }
      str = XsltForms_globals.stringValue(str);
      return XsltForms_globals.encode(XsltForms_globals.crypto(XsltForms_globals.str2msg(str), algo), enco);
    } ),

    
/**
 * * '''hmac(string, string, string?)'''
 */

/*eslint bitwise:false */
  "http://www.w3.org/2002/xforms hmac": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(key, str, algo, enco) {
      if (arguments.length !== 3 && arguments.length !== 4) {
        throw XsltForms_xpathFunctionExceptions.hmacInvalidArgumentsNumber;
      }
      algo = XsltForms_globals.stringValue(algo);
      if (algo !== "SHA-1" && algo !== "MD5" && algo !== "SHA-256" && algo !== "BASE64") {
        XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid crypting method");
        return "unsupported";
      }
      enco = enco ? XsltForms_globals.stringValue(enco): "base64";
      if (enco !== "hex" && enco !== "base64") {
        XsltForms_globals.error(XsltForms_globals.defaultModel, "xforms-compute-exception", "Invalid encoding method");
        return "unsupported";
      }
      key = XsltForms_globals.stringValue(key);
      str = XsltForms_globals.stringValue(str);
      var i, ik = [], ok = [];
      var k = XsltForms_globals.str2msg(key);
      if (k.length > 64) {
        k = XsltForms_globals.crypto(k, algo);
      }
      for (i = (k.length + 3) >> 2; i < 16; i++) {
        k.arr[i] = 0;
      }
      for (i = 0; i < 16; i++) {
        ik[i] = k.arr[i] ^ 0x36363636;
        ok[i] = k.arr[i] ^ 0x5c5c5c5c;
      }
      var a1 = XsltForms_globals.str2msg(str);
      a1.length += 64;
      a1.arr = ik.concat(a1.arr);
      var a2 = XsltForms_globals.crypto(a1, algo);
      a2.length += 64;
      a2.arr = ok.concat(a2.arr);
      return XsltForms_globals.encode(XsltForms_globals.crypto(a2, algo), enco);
    } ),
/*eslint bitwise:true */

    
/**
 * * '''upper-case(string)'''
 */

  "http://www.w3.org/2005/xpath-functions upper-case": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(str) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.upperCaseInvalidArgumentsNumber;
      }
      str = XsltForms_globals.stringValue(str);
      return str.toUpperCase();
    } ),

    
/**
 * * '''lower-case(string)'''
 */

  "http://www.w3.org/2005/xpath-functions lower-case": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(str) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.lowerCaseInvalidArgumentsNumber;
      }
      str = XsltForms_globals.stringValue(str);
      return str.toLowerCase();
    } ),

    
/**
 * * '''distinct-values(nodeset)'''
 */

  "http://www.w3.org/2005/xpath-functions distinct-values": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.distinctValuesInvalidArgumentsNumber;
      }
      var nodeSet2 = [];
      var values = {};
      for (var i = 0, len = nodeSet.length; i < len; ++i) {
        var xvalue = XsltForms_globals.xmlValue(nodeSet[i]);
        if (!values[xvalue]) {
          nodeSet2.push(nodeSet[i]);
          values[xvalue] = true;
        }
      }
      return nodeSet2;
    } ),

    
/**
 * * '''sort(nodeset)'''
 */

"http://www.w3.org/2005/xpath-functions sort": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
function(nodeSet) {
  if (arguments.length !== 1) {
    throw XsltForms_xpathFunctionExceptions.sortInvalidArgumentsNumber;
  }
  var nodeSet2 = nodeSet.sort(function(a, b) {
    var va = XsltForms_globals.xmlValue(a);
    var vb = XsltForms_globals.xmlValue(b);
    if (va < vb) {
      return -1;
    }
    if (va > vb) {
      return 1;
    }
    return 0;
  });
  return nodeSet2;
} ),

    
/**
 * * '''format-dateTime(value, picture)'''
 */

  "http://www.w3.org/2005/xpath-functions format-dateTime": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(value, picture) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.formatNumberInvalidArgumentsNumber;
      }
      value = XsltForms_globals.stringValue(value);
      var s = "";
      var i = 0, l = picture.length;
      var format = "";
      var pdate = false;
      var ptime = false;
      var valueDate = null; //notime ? Fleur.toDate(value): nodate ? Fleur.toTime(value): Fleur.toDateTime(value);
      var nodate = false;
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
                    stringvalue = Fleur.getMonthName(language, valueDate);
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
                  stringvalue = Fleur.getDayName(language, valueDate);
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
                  intvalue = parseInt(value.substr(nodate ? 0: 11, 2), 10);
                  break;
                case "P":
                  break;
                case "m":
                  ptime = true;
                  intvalue = parseInt(value.substr(nodate ? 3: 14, 2), 10);
                  break;
                case "s":
                  ptime = true;
                  intvalue = parseInt(value.substr(nodate ? 6: 17, 2), 10);
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
              if (intvalue !== null || stringvalue !== null) {
                format = format.split(',');
                var maxw, minw;
                if (format[1]) {
                  var ws = format[1].split('-');
                  minw = ws[0] === "*" ? 1: parseInt(ws[0], 10);
                  maxw = !ws[1] || ws[1] === "*" ? Infinity: parseInt(ws[1], 10);
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
    } ),

    
/**
 * * '''format-number(value, picture)'''
 */

  "http://www.w3.org/2005/xpath-functions format-number": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(value, picture) {
      var i, j, l, l2, pictures, dss, ess, ps, pms, ms, msbefore, psafter, pmsafter, signs, esigns, iipgp, ipgp, mips, prefix, fstart, fpgp, minfps, maxfps, mes, suffix, dsspos, evalue, esign, s0, s;
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.formatNumberInvalidArgumentsNumber;
      }
      value = XsltForms_globals.numberValue(value);
      if( isNaN(value) ) {
        return XsltForms_browser.i18n.get("format-number.NaN", "NaN");
      }
      pictures = picture.split(XsltForms_browser.i18n.get("format-number.pattern-separator-sign", ";"));
      picture = value < 0 && pictures[1] ? pictures[1]: pictures[0];
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
      if (value === Number.POSITIVE_INFINITY) {
        return prefix + XsltForms_browser.i18n.get("format-number.infinity", "Infinity") + suffix;
      } else if (value === Number.NEGATIVE_INFINITY) {
        return XsltForms_browser.i18n.get("format-number.minus-sign", "-") + prefix + XsltForms_browser.i18n.get("format-number.infinity", "Infinity") + suffix;
      }
      if (value < 0 && pictures.length === 1) {
        prefix = XsltForms_browser.i18n.get("format-number.minus-sign", "-") + prefix;
      }
      if (ess) {
        evalue = Math.floor(Math.log(value) / Math.LN10) + 1 - mips;
        value /= Math.pow(10, evalue);
        esign = evalue < 0 ? XsltForms_browser.i18n.get("format-number.minus-sign", "-"): "";
        evalue = "" + Math.abs(evalue);
        evalue = esign + ("000000000000000000000000000000").substr(0, Math.max(0, mes - evalue.length)) + evalue;
      }
      s0 = Math.abs(value).toFixed(maxfps);
      if (maxfps === 0 && dss) {
        s0 += ".";
      }
      dsspos = s0.indexOf(".") === -1 ? s0.length: s0.indexOf(".");
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
          s = XsltForms_browser.i18n.get("format-number.grouping-separator-sign", ",") + s;
          i++;
        }
        j--;
      }
      if (dss) {
        s += XsltForms_browser.i18n.get("format-number.decimal-separator-sign", ".");
        j = dsspos + 1;
        i = 0;
        while (j < l2) {
          s += s0.charAt(j);
          if (j !== l2 - 1 && fpgp[i] === j - dsspos) {
            s += XsltForms_browser.i18n.get("format-number.grouping-separator-sign", ",");
            i++;
          }
          j++;
        }
      }
      if (ps) {
        if (psafter) {
          s += XsltForms_browser.i18n.get("format-number.percent-sign", "%");
        } else {
          s = XsltForms_browser.i18n.get("format-number.percent-sign", "%") + s;
        }
      }
      if (pms) {
        if (pmsafter) {
          s += XsltForms_browser.i18n.get("format-number.per-mille-sign", "\u2030");
        } else {
          s = XsltForms_browser.i18n.get("format-number.per-mille-sign", "\u2030") + s;
        }
      }
      if (ess) {
        s += XsltForms_browser.i18n.get("format-number.exponent-separator-sign", "e") + evalue;
      }
      return prefix + s + suffix;
    } ),

    
/**
 * * '''transform(node, stylesheet, inline?, param?, value?, ...)'''
 */

  "http://www.w3.org/2002/xforms transform": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet, xslhref, inline) {
      if (arguments.length < 3) {
        throw XsltForms_xpathFunctionExceptions.transformInvalidArgumentsNumber;
      }
      if (nodeSet.length === 0) {
        return "";
      }
      var args = [];
      args.push(XsltForms_browser.saveNode(nodeSet[0], "application/xml"));
      args.push(XsltForms_globals.stringValue(xslhref));
      args.push(XsltForms_globals.booleanValue(inline));
      for (var i = 3, len = arguments.length; i < len; i++) {
        args.push(XsltForms_globals.stringValue(arguments[i]));
      }
      return XsltForms_browser.transformText.apply(null, args);
    } ),

    
/**
 * * '''serialize(node?)'''
 */

  "http://www.w3.org/2002/xforms serialize": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODE, false,
    function(nodeSet, mediatype, indent) {
      if (arguments.length >= 1 && typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.serializeInvalidArgumentType;
      }
      if (arguments.length === 0) {
        throw XsltForms_xpathFunctionExceptions.serializeNoContext;
      }
      return nodeSet.length === 0 ? "": XsltForms_browser.saveNode(nodeSet[0], mediatype ? XsltForms_globals.stringValue(mediatype): "application/xml", null, indent === "yes" ? indent: null);
    } ),

    
/**
 * * '''event(string)'''
 */

  "http://www.w3.org/2002/xforms event": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(attribute) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.eventInvalidArgumentsNumber;
      }
      for (var i = XsltForms_xmlevents.EventContexts.length - 1; i >= 0 ; i--) {
        var context = XsltForms_xmlevents.EventContexts[i];
        if (context[attribute]) {
          return context[attribute];
        }
      }
      return null;
    } ),

    
/**
 * * '''bind(string)'''
 */

  "http://www.w3.org/2005/xpath-functions bind": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx, bindid) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.bindInvalidArgumentsNumber;
      }
      var elt = XsltForms_idManager.find(XsltForms_globals.stringValue(bindid));
      if (!elt) {
        return null;
      }
      var xf = elt.xfElement;
      ctx.addDepElement(xf);
      return xf.nodes;
    } ),

    
/**
 * * '''is-non-empty-array(nodeset?)'''
 */

  "http://www.w3.org/2005/xpath-functions is-non-empty-array": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(nodeset) {
      if (arguments.length > 1) {
        throw XsltForms_xpathFunctionExceptions.isNonEmptyArrayInvalidArgumentsNumber;
      }
      if (typeof nodeset[0] !== "object") {
        throw XsltForms_xpathFunctionExceptions.isNonEmptyArrayInvalidArgumentType;
      }
      return nodeset[0].getAttribute("exsi:maxOccurs") && nodeset[0].getAttribute("xsi:nil") !== "true";
    } ),

    
/**
 * * '''math:abs(number)'''
 */

  "http://exslt.org/math abs": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.abs(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:acos(number)'''
 */

  "http://exslt.org/math acos": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.acos(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:asin(number)'''
 */

  "http://exslt.org/math asin": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.asin(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:atan(number)'''
 */

  "http://exslt.org/math atan": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.atan(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:atan2(number, number)'''
 */

  "http://exslt.org/math atan2": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number1, number2) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
      }
      return Math.atan2(XsltForms_globals.numberValue(number1), XsltForms_globals.numberValue(number2));
    } ),

    
/**
 * * '''math:constant(string, number)'''
 */

  "http://exslt.org/math constant": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(string, number) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
      }
      var val = XsltForms_mathConstants[XsltForms_globals.stringValue(string)] || "0";
      return parseFloat(val.substr(0, XsltForms_globals.numberValue(number)+2));
    } ),

    
/**
 * * '''math:cos(number)'''
 */

  "http://exslt.org/math cos": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.cos(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:exp(number)'''
 */

  "http://exslt.org/math exp": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.exp(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:log(number)'''
 */

  "http://exslt.org/math log": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.log(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:power(number, number)'''
 */

  "http://exslt.org/math power": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number1, number2) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.math2InvalidArgumentsNumber;
      }
      return Math.pow(XsltForms_globals.numberValue(number1), XsltForms_globals.numberValue(number2));
    } ),

    
/**
 * * '''math:sin(number)'''
 */

  "http://exslt.org/math sin": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.sin(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:sqrt(number)'''
 */

  "http://exslt.org/math sqrt": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.sqrt(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''math:tan(number)'''
 */

  "http://exslt.org/math tan": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(number) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.math1InvalidArgumentsNumber;
      }
      return Math.tan(XsltForms_globals.numberValue(number));
    } ),

    
/**
 * * '''regexp:match(string, string, string?)'''
 */

  "http://exslt.org/regular-expressions match": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(str, pattern, flags) {
      if (arguments.length !== 2 && arguments.length !== 3) {
        throw XsltForms_xpathFunctionExceptions.matchInvalidArgumentsNumber;
      }
      str = XsltForms_globals.stringValue(str);
      pattern = XsltForms_globals.stringValue(pattern);
      if (flags) {
        flags = XsltForms_globals.stringValue(flags);
      } else {
        flags = "";
      }
      try {
        var re = new RegExp(pattern, flags);
        var mres = str.match(re);
        if (!mres) {
          return [];
        }
        var melts = "";
        for (var i = 0, l = mres.length; i < l; i++) {
          melts += "<match>" + mres[i] + "</match>";
        }
        var mdoc = XsltForms_browser.createXMLDocument("<matches>" + melts + "</matches>");
        var marr = [];
        for(i = 0, l = mdoc.documentElement.children.length; i <l; i++) {
          marr.push(mdoc.documentElement.children[i]);
        }
        return marr;
      } catch (e) {
        return [];
      }
    } ),

    
/**
 * * '''alert(string)'''
 */

  "http://www.w3.org/2005/xpath-functions alert": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(arg) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.alertInvalidArgumentsNumber;
      }
      alert(XsltForms_globals.stringValue(arg));
      return arg;
    } ),

    
/**
 * * '''itext(string)'''
 */

  "http://www.w3.org/2005/xpath-functions itext": new XsltForms_xpathFunction(true, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctx, id) {
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.itextInvalidArgumentsNumber;
      }
      var itext = document.getElementById(XsltForms_browser.getDocMeta(ctx.node.ownerDocument, "model")).xfElement.itext;
      var translation = itext[XsltForms_globals.language] || itext[itext.defaultlang];
      return translation[id];
    } ),

    
/**
 * * '''js-eval(string)'''
 */

  "http://www.w3.org/2005/xpath-functions js-eval": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(arg) {
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.jsevalInvalidArgumentsNumber;
      }
      return eval(XsltForms_globals.stringValue(arg));
    } ),

    
/**
 * * '''string-join(nodeset, string?)'''
 */

  "http://www.w3.org/2005/xpath-functions string-join": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(nodeSet, joinString) { 
      if (arguments.length !== 1 && arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.stringJoinInvalidArgumentsNumber;
      }
      if (typeof nodeSet !== "object") {
        throw XsltForms_xpathFunctionExceptions.stringJoinInvalidArgumentType;
      }
      var strings = [];
      joinString = joinString || "";
      for (var i = 0, len = nodeSet.length; i < len; i++) {
        strings.push(XsltForms_globals.xmlValue(nodeSet[i]));
      }
      return strings.join(joinString);
    } ),

    
/**
 * * '''selection(ctrlid)'''
 */

  "http://www.w3.org/2005/xpath-functions selection": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctrlid) { 
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.selectionInvalidArgumentsNumber;
      }
      var controlid = XsltForms_globals.stringValue(ctrlid);
      var control = XsltForms_idManager.find(controlid);
      if (control && control.xfElement) {
        control = control.xfElement;
        var input = control.input;
        return input.value.substring(input.selectionStart, input.selectionEnd);
      }
      return "";
    }),

    
/**
 * * '''control-property(crtlid, property)'''
 */

  "http://www.w3.org/2005/xpath-functions control-property": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(ctrlid, property) { 
      if (arguments.length !== 2) {
        throw XsltForms_xpathFunctionExceptions.controlPropertyJoinInvalidArgumentsNumber;
      }
      var controlid = XsltForms_globals.stringValue(ctrlid);
      var control = XsltForms_idManager.find(controlid);
      if (control && control.xfElement) {
        control = control.xfElement;
        var input = control.input;
        property = XsltForms_globals.stringValue(property);
        if (input[property]) {
          return input[property];
        }
      }
      return "";
    }),

    
/**
 * * '''encode-for-uri(string?)'''
 */

  "http://www.w3.org/2005/xpath-functions encode-for-uri": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(rawString) { 
      if (arguments.length !== 1) {
        throw XsltForms_xpathFunctionExceptions.encodeForUriInvalidArgumentsNumber;
      }
      return encodeURIComponent(XsltForms_globals.stringValue(rawString));
    }),

    
/**
 * * '''fromtostep(from, to, step)'''
 */

  "http://www.w3.org/2005/xpath-functions fromtostep": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(from, to, step) {
      var res = [];
      for (var i = from; i <= to; i += step) {
        res.push({nodeType:Fleur.Node.DOCUMENT_NODE,localName:"repeatitem",text:i+"",documentElement:"dummy",getUserData:function(){return "";}});
      }
      return res;
    }),

    
/**
 * * '''tokenize(input, pattern)'''
 */

  "http://www.w3.org/2005/xpath-functions tokenize": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function(input, pattern) {
      var tokens = [];
      input = XsltForms_globals.stringValue(input);
      pattern = new RegExp(XsltForms_globals.stringValue(pattern.replace(/\\/g, "\\")));
      var res = input.split(pattern);
      for (var i = 0, l = res.length; i < l; i++) {
        tokens.push({localName:"#text",text:res[i],documentElement:"dummy"});
      }
      return tokens;
    }),

    
/**
 * * '''uuid()'''
 */

  "http://www.w3.org/2005/xpath-functions uuid": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      if (arguments.length !== 0) {
        throw XsltForms_xpathFunctionExceptions.uuidInvalidArgumentsNumber;
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r: (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }),

    
/**
 * * '''meta(node?, name)'''
 */

  "http://www.w3.org/2005/xpath-functions meta": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NODESET, false,
    function(arg1, arg2) {
      if (arguments.length < 1 || arguments.length > 2) {
        throw XsltForms_xpathFunctionExceptions.metaInvalidArgumentsNumber;
      }
      if (arguments.length === 2 && typeof arg1 !== "object") {
        throw XsltForms_xpathFunctionExceptions.metaInvalidArgumentType;
      }
      var node, meta;
      if (arguments.length === 1) {
        node = arg1;
        meta = XsltForms_globals.stringValue(arg1);
      } else {
        node = arg1[0];
        meta = XsltForms_globals.stringValue(arg2);
      }
      return XsltForms_browser.getMeta(node, "meta-" + meta);
    }),

    
/**
 * * '''form-source()'''
 */

"http://www.w3.org/2005/xpath-functions form-source": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
function() {
    if (arguments.length !== 0) {
  	  throw XsltForms_xpathFunctionExceptions.formSourceInvalidArgumentsNumber;
    }
    let formSource = "";
    const instances = XsltForms_subform.subforms["xsltforms-mainform"].instances;
    for (let i = 0, l = instances.length - 1; i < l; i++) {
      if (i === 0) {
        formSource = XsltForms_globals.formSource.substring(0, instances[0].sourceStart);
      } else {
        formSource += XsltForms_globals.formSource.substring(instances[i - 1].sourceStart + instances[i - 1].instanceSource.length, instances[i].sourceStart);
      }
      formSource += instances[i].instanceSource.substring(0, instances[i].instanceSource.indexOf(instances[i].dataSource));
      formSource += XsltForms_browser.saveDoc(instances[i].doc, instances[i].mediatype);
      formSource += instances[i].instanceSource.substring(instances[i].instanceSource.indexOf(instances[i].dataSource) + instances[i].dataSource.length);
    }
    formSource += XsltForms_globals.formSource.substring(instances[instances.length - 2].sourceStart + instances[instances.length - 2].instanceSource.length);
    return formSource;
}),

    
/**
 * * '''invalid-id()'''
 */

  "http://www.w3.org/2005/xpath-functions invalid-id": new XsltForms_xpathFunction(false, XsltForms_xpathFunction.DEFAULT_NONE, false,
    function() {
      return XsltForms_globals.invalid_id_(XsltForms_globals.body);
    })
};
XsltForms_xpathCoreFunctions["http://www.w3.org/2002/xforms is-valid"] = XsltForms_xpathCoreFunctions["http://www.w3.org/2002/xforms valid"];

XsltForms_globals.invalid_id_ = function(element) {
  if (element.nodeType !== Fleur.Node.ELEMENT_NODE || element.id === "xsltforms-console" || element.hasXFElement === false) {
    return "";
  }
  var xf = element.xfElement;
  if (xf && xf.controlName !== "group" && !(xf instanceof Array) && !xf.isRepeat) {
    return xf.invalid && !xf.isOutput ? element.id: "";
  }
  var childs = element.children || element.childNodes;
  for (var i = 0, l = childs.length; i < l; i++) {
    var id = XsltForms_globals.invalid_id_(childs[i]);
    if (id !== "") {
      return id;
    }
  }
  return "";
};
XsltForms_globals.validate_ = function(node) {
  if (XsltForms_browser.getBoolMeta(node, "invalid") || XsltForms_browser.getBoolMeta(node, "unsafe")) {
    return false;
  }
  var atts = node.attributes || [];
  for (var i = 0, len = atts.length; i < len; i++) {
    if (atts[i].nodeName.substr(0,10) !== "xsltforms_" && atts[i].nodeName.substr(0,5) !== "xmlns" && !XsltForms_globals.validate_(atts[i])) {
      return false;
    }
  }
  var childs = node.childNodes || [];
  for (var j = 0, len2 = childs.length; j < len2; j++) {
    if (!XsltForms_globals.validate_(childs[j])) {
      return false;
    }
  }
  return true;
};