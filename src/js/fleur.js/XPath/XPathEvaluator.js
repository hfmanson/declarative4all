"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @licence LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.XPathEvaluator = function() {};
Fleur.XPathEvaluator._precedence = "././/.:.as.&0.!.!!.&1.~+.~-.&2.cast as.&3.castable as.&4.treat as.&5.instance of.&6.intersect.except.&7.|.union.&8.div.mod.*.idiv.&9.+.-.&10.to.&11.||.&12.eq.ne.lt.le.gt.ge.<.>.<=.>=.is.<<.>>.=.!=.&13.and.&14.or.&15.allowing.&16.at.&17.:=.in.&18.after.before.into.with.value.&19.node.nodes.&20.~~ascending.~~descending.empty.&28.~,.&29.~~for.for.~~let.let.group by.order by.stable order by.count.where.some.every.&30.then.catch.&31.return.else.satisfies.&32.,.&50.;.&51.";
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
  var ntest = n3 === "*" || nsp === "*" ? "[Fleur.XQueryX.Wildcard,[" + (n3 !== "*" && nsp === "*" ? "[Fleur.XQueryX.star,[]],[Fleur.XQueryX.NCName,['" + n3 + "']]" : "") + (nsp !== "*" && nsp !== "" && n3 === "*"? "[Fleur.XQueryX." + (eq ? "uri" : "NCName") + ",['" + nsp + "']],[Fleur.XQueryX.star,[]]" : "") + "]]" : "[Fleur.XQueryX.nameTest,['" + n3 + "'" + (eq || sind !== -1 ? ",[" + (eq ? "Fleur.XQueryX.URI" : "Fleur.XQueryX.prefix") + ",['" + nsp + "']]" : "") + "]]";
  return (n.length + attr) + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['" + axis + "']]," + ntest + "]]]]";
};
Fleur.XPathEvaluator._pathExprFormat = function(s, p) {
  if (s.substr(0, 25) === "[Fleur.XQueryX.pathExpr,[") {
    return s.substr(25, s.length - 29) + p + "]]";
  }
  return "[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.filterExpr,[" + s + "]]" + p + "]]";
};
Fleur.XPathEvaluator._calc = function(args, ops, opprec, prevop) {
  //console.log("_calc()");
  //console.log("args = " + args);
  //console.log("ops = " + ops);
  //console.log("prevop = " + prevop);
  var op0 = ops.substr(ops.indexOf(".") + 1, parseInt(ops.split(".")[0], 10));
  var op = op0.substr(op0.indexOf(".") + 1);
  var curop = parseInt(ops.split(".")[1], 10);
  var prectest = ops === "" || curop > opprec || ((prevop === op || op === "then") && prevop === "return") || prevop === "then";
  //console.log("Consider \"" + prevop + "\"[" + opprec + "] vs. \"" + op + "\"[" + curop + "]" + " => " + (prectest ? "Do nothing" : "Evaluate \"" + op + "\""));
  if (prectest) {
    return args.length + "." + args + ops.length + "." + ops;
  }
  var arg2len = args.substr(0, args.indexOf("."));
  var arg2val = args.substr(args.indexOf(".") + 1).substr(0, parseInt(arg2len, 10));
  var arg2val2, arg2val3;
  var args3, arg1len, arg1val, arg1val2;
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
        arg = "[Fleur.XQueryX.ifClause,[" + arg1val.substr(0, arg1val.length - 4).substr(arg1val.indexOf(",[Fleur.XQueryX.arguments,[") + 27) + "]]";
        var argsthen = arg2val.length + "." + arg2val + arg.length + "." + arg + args3.substr(arg1len.length + 1 + parseInt(arg1len, 10));
        opprec = -1;
        return Fleur.XPathEvaluator._calc(argsthen, ops.substr(ops.indexOf(".") + 1).substr(parseInt(ops.substr(0, ops.indexOf(".")), 10)), opprec, prevop);
      }
      break;
    case "else":
      var args4 = args3.substr(arg1len.length + 1 + parseInt(arg1len, 10));
      var arg0len = args4.substr(0, args4.indexOf("."));
      var arg0val = args4.substr(args4.indexOf(".") + 1).substr(0, parseInt(arg0len, 10));
      if (arg0val.substr(0, 24) === "[Fleur.XQueryX.ifClause,") {
        arg = "[Fleur.XQueryX.ifThenElseExpr,[" + arg0val + ",[Fleur.XQueryX.thenClause,[" + arg1val + "]]" + ",[Fleur.XQueryX.elseClause,[" + arg2val + "]]]]";
        var argselse = arg.length + "." + arg + args4.substr(arg0len.length + 1 + parseInt(arg0len, 10));
        return Fleur.XPathEvaluator._calc(argselse, ops.substr(ops.indexOf(".") + 1).substr(parseInt(ops.substr(0, ops.indexOf(".")), 10)), opprec, prevop);
      }
      break;
    case "catch":
      if (arg1val.substr(0, 28) === "[Fleur.XQueryX.tryCatchExpr,") {
        arg = arg1val.substr(0, arg1val.length - 2) + ",[Fleur.XQueryX.catchClause,[" + arg2val + "]]]]";
      }
      break;
    case "~~let":
    case "~~for":
      arg = "[Fleur.XQueryX.flworExpr,[" + arg2val  + "]]";
      opprec = -1;
      break;
    case "let":
    case "for":
      arg = arg1val.substr(0, arg1val.length - 2) + "," + arg2val + "]]";
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
  return Fleur.XPathEvaluator._calc(args2, ops.substr(ops.indexOf(".") + 1).substr(parseInt(ops.substr(0, ops.indexOf(".")), 10)), opprec, prevop);
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
          //namespaces = {};
          //for (prefix in newnamespaces) {
          //  if (newnamespaces.hasOwnProperty(prefix)) {
          //    namespaces[prefix] = newnamespaces[prefix];
          //  }
          //}
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
  //console.log("_getPredParam: c = " + c + " s = " + s + " ops = " + ops);
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
//    } else if (arg === "[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[]]]]") {
//      fargs = t.substr(t.indexOf(".") + 1);
//      fargs2 = fargs.substr(0, 26) === "[Fleur.XQueryX.arguments,[" ? fargs.substr(26, fargs.length - 28) : fargs;
//      p = plen + ".[Fleur.XQueryX.flworExpr,[[Fleur.XQueryX.forClause,[" + fargs2 + "]]]]";
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
    //predicates
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
      //console.log("_getPredParam: cnext = " + cnext);
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
  //console.log("_xp2js()");
  //console.log("xp = " + xp);
  //console.log("args = " + args);
  //console.log("ops = " + ops);
  var i = Fleur.XPathEvaluator._skipSpaces(xp, 0);
  var c = xp.charAt(i);
  var d = xp.substr(i + 1);
  var d2;
  var r = "";
  if (c === "." && (d === "" || "0123456789".indexOf(d.charAt(0)) === -1)) {
    if (d.charAt(0) === ".") {
      //stepExpr
      r = "2.[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['parent']],[Fleur.XQueryX.anyKindTest,[]]]]]]";
    } else {
      //contextItemExpr
      r = "1.[Fleur.XQueryX.contextItemExpr,[]]";
    }
  } else if (c === ")" || c === "}") {
    r = "0.";
  } else if (c === "/") {
    //rootExpr
    var ir = Fleur.XPathEvaluator._skipSpaces(d, 0);
    r = (d.charAt(0) === "" || "/@*.(_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(d.charAt(ir)) === -1 ? "1" : "0") + ".[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.rootExpr,[]]]]";
  } else if (c === "@") {
    r = Fleur.XPathEvaluator._getNameStep(d, 1);
  } else if (c === "'") {
    //stringConstantExpr
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
    //if (d !== "" && ".0123456789".indexOf(d.charAt(0)) !== -1) {
    //  var t4 = Fleur.XPathEvaluator._getNumber(d, c);
    //  r = t4.length + ".[" + (t4.indexOf("e") !== -1 ? "Fleur.XQueryX.doubleConstantExpr" : t4.indexOf(".") !== -1 ? "Fleur.XQueryX.decimalConstantExpr" : "Fleur.XQueryX.integerConstantExpr") + ",[[Fleur.XQueryX.value,['" + t4.replace(/e\+/, "e") + "']]]]";
    //} else {
      c = "~" + c;
      r = "0.";
    //}
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
    var poststacks = Fleur.XPathEvaluator._calc(args2, ops, parseInt(postprec, 10), o === "a" ? "ascending" : "descending");
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
    var stacks = Fleur.XPathEvaluator._calc(args2, ops, 9999999, "");
    var reslen0 = stacks.substr(stacks.indexOf(".") + 1);
    var reslen = reslen0.substr(0, reslen0.indexOf("."));
    var ret0 = stacks.substr(stacks.indexOf(".") + 1);
    return ret0.substr(ret0.indexOf(".") + 1).substr(0, parseInt(reslen, 10));
  }
  if (o === "]" || o === ")" || o === "}") { // || (p.substr(0, 6) === "return" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) || (p.substr(0, 9) === "satisfies" && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(9)) === -1)) {
    var stacks2 = Fleur.XPathEvaluator._calc(args2, ops, 998, o);
    var reslen20 = stacks2.substr(stacks2.indexOf(".") + 1);
    var reslen2 = reslen20.substr(0, reslen20.indexOf("."));
    var ret20 = stacks2.substr(stacks2.indexOf(".") + 1);
    return (f.substr(f.indexOf(o) + 1).length - (o === "r" ? 5 : o === "s" ? 8 : 0)) + "." + ret20.substr(ret20.indexOf(".") + 1).substr(0, parseInt(reslen2, 10));
  }
  if (o === "$") {
    //alert(o);
    switch(rval) {
      case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['for']]]]]]":
        rval = "[Fleur.XQueryX.flworExpr,[]]";
        op = "~~for";
        break;
      case "[Fleur.XQueryX.pathExpr,[[Fleur.XQueryX.stepExpr,[[Fleur.XQueryX.xpathAxis,['child']],[Fleur.XQueryX.nameTest,['let']]]]]]":
        rval = "[Fleur.XQueryX.flworExpr,[]]";
        op = "~~let";
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
    /*
    if (op !== "null") {
      r = Fleur.XPathEvaluator._getPredParams("(" + f, rlen, rval);
      rlen = parseInt(r.substr(0, r.indexOf(".")), 10);
      rval = r.substr(r.indexOf(".") + 1);
      args2 = rval.length + "." + rval + args;
      op = op === "for" || op === "let" ? "return" : "satisfies";
      f = d.substr(rlen - 2 - op.length);
      p = f.substr(1);
    }
    */
    args2 = args;
    var opprec0 = Fleur.XPathEvaluator._precedence.substr(Fleur.XPathEvaluator._precedence.indexOf("." + (op2 !== "null" ? op2 : op) + ".") + (op2 !== "null" ? op2 : op).length + 2);
    var opprec00 = opprec0.substr(opprec0.indexOf("&") + 1);
    var opprec = opprec00.substr(0, opprec00.indexOf("."));
    var stacks3 = Fleur.XPathEvaluator._calc(args2, ops, parseInt(opprec, 10), op2 !== "null" ? op2 : op);
    var args3len = stacks3.substr(0, stacks3.indexOf("."));
    var args3 = stacks3.substr(stacks3.indexOf(".") + 1).substr(0, parseInt(args3len, 10));
    var nextstack = stacks3.substr(args3len.length + 1 + parseInt(args3len, 10));
    var ops3len = nextstack.substr(0, nextstack.indexOf("."));
    var ops3 = nextstack.substr(nextstack.indexOf(".") + 1).substr(0, parseInt(ops3len, 10));
    var xp3 = p;
    return Fleur.XPathEvaluator._xp2js(xp3, args3, (opprec.length + 1 + (op2 !== "null" ? op2 : op).length) + "." + opprec + "." + (op2 !== "null" ? op2 : op) + ops3);
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
  } else if ((p.substr(0, 6) === "except" || p.substr(0, 6) === "before" || p.substr(0, 6) === "return") && "_.-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz:".indexOf(p.charAt(6)) === -1) {
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
    var stacks3 = Fleur.XPathEvaluator._calc(args2, ops, parseInt(opprec, 10), op2 !== "null" ? op2 : op);
    var args3len = stacks3.substr(0, stacks3.indexOf("."));
    var args3 = stacks3.substr(stacks3.indexOf(".") + 1).substr(0, parseInt(args3len, 10));
    var nextstack = stacks3.substr(args3len.length + 1 + parseInt(args3len, 10));
    var ops3len = nextstack.substr(0, nextstack.indexOf("."));
    var ops3 = nextstack.substr(nextstack.indexOf(".") + 1).substr(0, parseInt(ops3len, 10));
    var xp3 = p.substr(op.length);
    return Fleur.XPathEvaluator._xp2js(xp3, args3, (opprec.length + 1 + (op2 !== "null" ? op2 : op).length) + "." + opprec + "." + (op2 !== "null" ? op2 : op) + ops3);
  }
  throw Error("~~~~Unknown operator at '" + f + "'~#~#");
  //return "~~~~Unknown operator at '" + f + "'~#~#";
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
/*                      if ("abcdefghijklmnopqrstuvwxyz".indexOf(c) !== -1) {
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
                      }*/
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
  //console.log("\n*********\nParse \"" + xq + "\"");
  //xq = xq.replace(/^\s+|\s+$/gm, " ");
  var v = Fleur.XPathEvaluator._getVersion(xq);
  var vl = v.substr(0, v.indexOf("."));
  var prolog = "", p, pc, pl = parseInt(vl, 10);
  do {
    p = Fleur.XPathEvaluator._getProlog(xq, pl);
    pl = parseInt(p.substr(0, p.indexOf(".")), 10);
    pc = p.substr(p.indexOf(".") + 1);
    prolog += pc;
  } while (pc !== "");
  var ret = "[Fleur.XQueryX.module,[" + v.substr(v.indexOf(".") + 1) + "[Fleur.XQueryX.mainModule,[" + (prolog === "" ? "" : "[Fleur.XQueryX.prolog,[" + prolog.substr(0, prolog.length - 1) + "]],") + "[Fleur.XQueryX.queryBody,[" + Fleur.XPathEvaluator._xp2js(xq.substr(pl), "", "") + ']]]],[Fleur.XQueryX.xqx,["http://www.w3.org/2005/XQueryX"]],[Fleur.XQueryX.xqxuf,["http://www.w3.org/2007/xquery-update-10"]],[Fleur.XQueryX.schemaLocation,["http://www.w3.org/2007/xquery-update-10 http://www.w3.org/2007/xquery-update-10/xquery-update-10-xqueryx.xsd http://www.w3.org/2005/XQueryX http://www.w3.org/2005/XQueryX/xqueryx.xsd"]],[Fleur.XQueryX.xsi,["http://www.w3.org/2001/XMLSchema-instance"]]]]';
  //console.log("*********\n");
  return ret;
};