"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_min_1 = function() {
  this.notyet();
};
Fleur.Context.prototype.fn_min_2 = function() {
  this.notyet();
};

Fleur.XPathFunctions_fn["min#1"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:min", Fleur.Context.prototype.fn_min_1,
  [Fleur.SequenceType_anyAtomicType_0n], Fleur.SequenceType_anyAtomicType_01);

Fleur.XPathFunctions_fn["min#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:min", Fleur.Context.prototype.fn_min_2,
  [Fleur.SequenceType_anyAtomicType_0n, Fleur.SequenceType_string_1], Fleur.SequenceType_anyAtomicType_01);
/*
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
*/