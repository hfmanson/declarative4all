"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.multiplyOpTypes = [
          /*  integer decimal   float  double  string boolean    date  dateT.    time yearMD.  dayTD. */
/*integer   0*/  [     0,     1,     2,     3,     4,    -1,    -1,    -1,    -1,     9,    10],
/*decimal   1*/  [     1,     1,     2,     3,     4,    -1,    -1,    -1,    -1,     9,    10],
/*float     2*/  [     2,     2,     2,     3,     4,    -1,    -1,    -1,    -1,     9,    10],
/*double   3*/  [     3,     3,     3,     3,     4,    -1,    -1,    -1,    -1,     9,   10],
/*string   4*/  [     4,     4,     4,     4,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*boolean   5*/  [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*date     6*/  [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*dateTime   7*/  [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*time     8*/  [    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*yearMonthD.9*/  [     9,     9,     9,     9,    -1,    -1,    -1,    -1,    -1,    -1,    -1],
/*dayTimeD.  10*/  [    10,    10,    10,    10,    -1,    -1,    -1,    -1,    -1,    -1,    -1]
];

Fleur.Transpiler.prototype.xqx_multiplyOp = function(children) {
  const arg1 = this.gen(children[0][1][0], Fleur.SequenceType_numeric_1);
  const arg2 = this.gen(children[1][1][0], Fleur.SequenceType_numeric_1);
  if (arg1.value && arg2.value) {
    return this.staticargs([arg1, arg2]).xqx_multiplyOp().staticinst(this);
  }
  return this.inst("xqx_multiplyOp()", false, Fleur.SequenceType_numeric_1, arg1.inst + arg2.inst);
};

Fleur.Context.prototype.xqx_multiplyOp = function() {
  const arg1 = this.itemstack.pop();
  const arg2 = this.item;
  const op1 = Fleur.toJSValue(arg1, true, true, false, false, false, true);
  if (op1[0] < 0) {
    this.item = arg1;
    return this;
  }
  const op2 = Fleur.toJSValue(arg2, true, true, false, true, false, true);
  if (op2[0] < 0) {
    return this;
  }
  const res = new Fleur.Text();
  const restype = Fleur.multiplyOpTypes[op1[0]][op2[0]];
  if (restype !== -1) {
    let dres, dresvalue;
    if (op1[0] < 4 && op2[0] < 4) {
      if (isNaN(Number(op1[1]) * Number(op2[1]))) {
        res.data = "NaN";
      } else if (Number(op1[1]) * Number(op2[1]) === -Infinity) {
        res.data = "-INF";
      } else if (Number(op1[1]) * Number(op2[1]) === Infinity) {
        res.data = "INF";
      } else if (1 / (Number(op2[1]) * Number(op1[1])) === -Infinity) {
        res.data = "-0";
      } else if (1 / (Number(op2[1]) * Number(op1[1])) === Infinity) {
        res.data = "0";
      } else {
        const val = typeof op1[1] === typeof op2[1] ? op1[1] * op2[1] : Number(op1[1]) * Number(op2[1]);
        if (restype > 1) {
          res.data = Fleur.Type_double.canonicalize(String(val));
        } else {
          const precision1 = arg1.data.indexOf(".") !== -1 ? arg1.data.length - arg1.data.indexOf(".") - 1 : 0;
          const precision2 = arg2.data.indexOf(".") !== -1 ? arg2.data.length - arg2.data.indexOf(".") - 1 : 0;
          res.data = Fleur.NumberToDecimalString(val, precision1 + precision2);
        }
      }
    } else if (op1[0] < 4 && op2[0] === 4) {
      res.data = op2[1].repeat(op1[1]);
    } else if (op1[0] === 4 && op2[0] < 4) {
      res.data = op1[1].repeat(op2[1]);
    } else if (op1[0] < 4 && op2[0] === 9) {
      dresvalue = op2[1].sign * Math.round((op2[1].year * 12 + op2[1].month) * Number(op1[1]));
      dres = {
        sign: dresvalue < 0 ? -1 : 1,
        year: Math.floor(Math.abs(dresvalue) / 12),
        month: Math.abs(dresvalue) % 12};
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.year !== 0 ? String(dres.year) + "Y": "") + (dres.month !== 0 || dres.year === 0 ? String(dres.month) + "M" : "");
    } else if (op1[0] === 9 && op2[0] < 4) {
      dresvalue = op1[1].sign * Math.round((op1[1].year * 12 + op1[1].month) * Number(op2[1]));
      dres = {
        sign: dresvalue < 0 ? -1 : 1,
        year: Math.floor(Math.abs(dresvalue) / 12),
        month: Math.abs(dresvalue) % 12};
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.year !== 0 ? String(dres.year) + "Y": "") + (dres.month !== 0 || dres.year === 0 ? String(dres.month) + "M" : "");
    } else if (op1[0] < 4 && op2[0] === 10) {
      dresvalue = Number(op1[1]) * op2[1].sign * (((op2[1].day * 24 + op2[1].hour) * 60 + op2[1].minute) * 60 + op2[1].second);
      dres = {sign: dresvalue < 0 ? -1 : 1};
      dresvalue = Math.abs(dresvalue);
      dres.day = Math.floor(dresvalue / 86400);
      dresvalue = dresvalue % 86400;
      dres.hour = Math.floor(dresvalue / 3600);
      dresvalue = dresvalue % 3600;
      dres.minute = Math.floor(dresvalue / 60);
      dres.second = dresvalue % 60;
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.day !== 0 ? String(dres.day) + "D": "") + (dres.hour !== 0 || dres.minute !== 0 || dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? "T" : "") + (dres.hour !== 0 ? String(dres.hour) + "H" : "") + (dres.minute !== 0 ? String(dres.minute) + "M" : "") + (dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? String(dres.second) + "S" : "");
    } else if (op1[0] === 10 && op2[0] < 4) {
      dresvalue = op1[1].sign * (((op1[1].day * 24 + op1[1].hour) * 60 + op1[1].minute) * 60 + op1[1].second) * Number(op2[1]);
      dres = {sign: dresvalue < 0 ? -1 : 1};
      dresvalue = Math.abs(dresvalue);
      dres.day = Math.floor(dresvalue / 86400);
      dresvalue = dresvalue % 86400;
      dres.hour = Math.floor(dresvalue / 3600);
      dresvalue = dresvalue % 3600;
      dres.minute = Math.floor(dresvalue / 60);
      dres.second = dresvalue % 60;
      res.data = (dres.sign < 0 ? "-" : "") + "P" + (dres.day !== 0 ? String(dres.day) + "D": "") + (dres.hour !== 0 || dres.minute !== 0 || dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? "T" : "") + (dres.hour !== 0 ? String(dres.hour) + "H" : "") + (dres.minute !== 0 ? String(dres.minute) + "M" : "") + (dres.second !== 0 || dres.day + dres.hour + dres.minute === 0 ? String(dres.second) + "S" : "");
    }
    res.schemaTypeInfo = Fleur.JSTypes[restype];
  } else {
    Fleur.XQueryError_xqt(arg1.nodeType === Fleur.Node.ELEMENT_NODE || arg2.nodeType === Fleur.Node.ELEMENT_NODE ? "FORG0001" : "XPTY0004");
  }
  this.item = res;
  return this;
};
/*
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
*/