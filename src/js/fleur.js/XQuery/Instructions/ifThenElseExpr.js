"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Transpiler.prototype.xqx_ifThenElseExpr = function(children, expectedType) {
  let result = this.gen(children[0][1][0]).inst + "\n" + this.indent + "if (" + this.ctxvarname + ".fn_boolean_1().isTrue()) {";
  const previndent = this.indent;
  this.indent += this.step;
  const thenexpr = this.gen(children[1][1][0], expectedType);
  if ((thenexpr.sequenceType.occurrence === "0" && (expectedType.occurrence === "1" || expectedType.occurrence === "+")) || (thenexpr.sequenceType.schemaTypeInfo && expectedType.schemaTypeInfo && !thenexpr.sequenceType.schemaTypeInfo.as(expectedType.schemaTypeInfo))) {
    Fleur.XQueryError_xqt("XPST0017", null, "Invalid type");
  }
  result += thenexpr.inst;
  this.indent = previndent;
  result += "\n" + previndent + "} else {";
  this.indent += this.step;
  const elseexpr = this.gen(children[2][1][0], expectedType);
  if ((elseexpr.sequenceType.occurrence === "0" && (expectedType.occurrence === "1" || expectedType.occurrence === "+")) || (elseexpr.sequenceType.schemaTypeInfo && expectedType.schemaTypeInfo && !elseexpr.sequenceType.schemaTypeInfo.as(expectedType.schemaTypeInfo))) {
    Fleur.XQueryError_xqt("XPST0017", null, "Invalid type");
  }
  result += elseexpr.inst;
  this.indent = previndent;
  return {
    inst: result + "\n" + previndent + "}",
    sequenceType: thenexpr.sequenceType
  };
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