"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module 
 * @description 
 */
Fleur.Context.prototype.fn_format$_date_2 = function() {
  return this.emptySequence().emptySequence().emptySequence().fn_format$_dateTime_5(false, true);
};
Fleur.Context.prototype.fn_format$_date_5 = function() {
  return this.fn_format$_dateTime_5(false, true);
};

Fleur.XPathFunctions_fn["format-date#2"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date", Fleur.Context.prototype.fn_format$_date_2,
  [Fleur.SequenceType_date_01, Fleur.SequenceType_string_1], Fleur.SequenceType_string_01);

Fleur.XPathFunctions_fn["format-date#5"] = new Fleur.Function("http://www.w3.org/2005/xpath-functions", "fn:format-date", Fleur.Context.prototype.fn_format$_date_5,
  [Fleur.SequenceType_date_01, Fleur.SequenceType_string_1, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01, Fleur.SequenceType_string_01], Fleur.SequenceType_string_01);
/*
  function(value, picture, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, null, null, null, ctx, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/
/*
  function(value, picture, language, calendar, place, ctx) {
    return Fleur.XPathFunctions_fn["format-dateTime#5"].jsfunc(value, picture, language, calendar, place, ctx, true, false);
  },
  null, [{type: Fleur.Type_date, occurence: "?"}, {type: Fleur.Type_string}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}, {type: Fleur.Type_string, occurence: "?"}], true, false, {type: Fleur.Type_string, occurence: "?"});
*/