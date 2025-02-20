"use strict";
/**
 * @author Alain Couthures <alain.couthures@agencexml.com>
 * @license LGPL - See file 'LICENSE.md' in this project.
 * @module Calendar
 * @description  === "Calendar" class ===
 * Calendar Class for Date/DateTime Control
 * * constructor function : dynamically creates a table element
 */
    
function XsltForms_calendar() {
  var body = XsltForms_browser.isXhtml ? document.getElementsByTagNameNS("http://www.w3.org/1999/xhtml", "body")[0] : document.getElementsByTagName("body")[0];
  this.element = XsltForms_browser.createElement("table", body, null, "xsltforms-calendar");
  var tHead = XsltForms_browser.createElement("thead", this.element);
  var trTitle = XsltForms_browser.createElement("tr", tHead);
  var title = XsltForms_browser.createElement("td", trTitle, null, "xsltforms-calendar-title");
  title.colSpan = 7;
  this.selectMonth = XsltForms_browser.createElement("select", title);
  XsltForms_browser.events.attach(this.selectMonth, "change", function() {
    XsltForms_calendar.INSTANCE.refresh();
  } );
  for (var i = 0; i < 12; i++) {
    var o = XsltForms_browser.createElement("option", this.selectMonth, XsltForms_browser.i18n.get("calendar.month" + i));
    o.setAttribute("value", i);
  }
  this.inputYear = XsltForms_browser.createElement("input", title);
  this.inputYear.readOnly = true;
  XsltForms_browser.events.attach(this.inputYear, "mouseup", function() {
    var cal = XsltForms_calendar.INSTANCE;
    cal.yearList.show();
  } );
  XsltForms_browser.events.attach(this.inputYear, "change", function() {
    XsltForms_calendar.INSTANCE.refresh();
  } );
  var closeElt = XsltForms_browser.createElement("button", title, "X");
  closeElt.setAttribute("type", "button");
  closeElt.setAttribute("title", XsltForms_browser.i18n.get("calendar.close", "Close"));
  XsltForms_browser.events.attach(closeElt, "click", function() {
    XsltForms_calendar.close();
  } );
  var trDays = XsltForms_browser.createElement("tr", tHead, null, "xsltforms-calendar-names");
  var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
  for (var j = 0; j < 7; j++) {
    var ind = (j + ini) % 7;
    this.createElement(trDays, "xsltforms-calendar-name", XsltForms_browser.i18n.get("calendar.day" + ind));
  }
  this.tBody = XsltForms_browser.createElement("tbody", this.element);
  var handler = function(evt) {
    var value = XsltForms_browser.events.getTarget(evt).childNodes[0].nodeValue;
    var cal = XsltForms_calendar.INSTANCE;
    if (value !== "") {
      cal.day = value;
      var date = new Date(cal.inputYear.value,cal.selectMonth.value,cal.day);
      if (cal.isTimestamp) {
        date.setSeconds(cal.inputSec.value);
        date.setMinutes(cal.inputMin.value);
        date.setHours(cal.inputHour.value);
        cal.input.value = XsltForms_browser.i18n.format(date, null, true);
      } else {
        cal.input.value = XsltForms_browser.i18n.formatDate(date);
      }
      XsltForms_calendar.close();
      XsltForms_browser.events.dispatch(cal.input, "keyup");
      cal.input.focus();
    }
  };
  for (var dtr = 0; dtr < 6; dtr++) {
    var trLine = XsltForms_browser.createElement("tr", this.tBody);
    for (var day = 0; day < 7; day++) {
      this.createElement(trLine, "xsltforms-calendar-day", " ", 1, handler);
    }
  }
  var tFoot = XsltForms_browser.createElement("tfoot", this.element);
  var trFoot = XsltForms_browser.createElement("tr", tFoot);
  var tdFoot = XsltForms_browser.createElement("td", trFoot);
  tdFoot.colSpan = 7;
  this.inputHour = XsltForms_browser.createElement("input", tdFoot);
  this.inputHour.readOnly = true;
  XsltForms_browser.events.attach(this.inputHour, "mouseup", function() {
    XsltForms_calendar.INSTANCE.hourList.show();
  } );
  tdFoot.appendChild(document.createTextNode(":"));
  this.inputMin = XsltForms_browser.createElement("input", tdFoot);
  this.inputMin.readOnly = true;
  XsltForms_browser.events.attach(this.inputMin, "mouseup", function() {
    XsltForms_calendar.INSTANCE.minList.show();
  } );
  tdFoot.appendChild(document.createTextNode(":"));
  this.inputSec = XsltForms_browser.createElement("input", tdFoot);
  this.inputSec.readOnly = true;
  XsltForms_browser.events.attach(this.inputSec, "mouseup", function() {
    if (XsltForms_calendar.INSTANCE.type >= XsltForms_calendar.SECONDS) {
      XsltForms_calendar.INSTANCE.secList.show();
    }
  } );
  this.yearList = new XsltForms_numberList(title, "xsltforms-calendarList", this.inputYear, 1900, 2050);
  this.hourList = new XsltForms_numberList(tdFoot, "xsltforms-calendarList", this.inputHour, 0, 23, 2);
  this.minList = new XsltForms_numberList(tdFoot, "xsltforms-calendarList", this.inputMin, 0, 59, 2);
  this.secList = new XsltForms_numberList(tdFoot, "xsltforms-calendarList", this.inputSec, 0, 59, 2);
}


    
/**
 * * '''today''' method : sets the value of this Calendar object to the current date
 */

XsltForms_calendar.prototype.today = function() {
  this.refreshControls(new Date());
};


    
/**
 * * '''refreshControls''' method : refreshes this Calendar object according to a given date
 */

XsltForms_calendar.prototype.refreshControls = function(date) {
  this.day = date.getDate();
  this.selectMonth.value = date.getMonth();
  this.inputYear.value = date.getYear() < 1000 ? 1900 + date.getYear() : date.getYear();
  if (this.isTimestamp) {
    this.inputHour.value = XsltForms_browser.zeros(date.getHours(), 2);
    this.inputMin.value = this.type >= XsltForms_calendar.MINUTES ? XsltForms_browser.zeros(date.getMinutes(), 2) : "00";
    this.inputSec.value = this.type >= XsltForms_calendar.SECONDS ? XsltForms_browser.zeros(date.getSeconds(), 2) : "00";
  }
  this.refresh();
};


    
/**
 * * '''refresh''' method : refreshes this Calendar object
 */

XsltForms_calendar.prototype.refresh = function() {
  var firstDay = this.getFirstDay();
  var daysOfMonth = this.getDaysOfMonth();
  var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
  var cont = 0;
  var day = 1;
  var currentMonthYear = this.selectMonth.value === this.currentMonth && this.inputYear.value === this.currentYear;
  for (var i = 0; i < 6; i++) {
    var trLine = this.tBody.childNodes[i];
    for (var j = 0; j < 7; j++, cont++) {
      var cell = trLine.childNodes[j];
      var dayInMonth = (cont >= firstDay && cont < firstDay + daysOfMonth);
      XsltForms_browser.setClass(cell, "xsltforms-listHover", false);
      XsltForms_browser.setClass(cell, "xsltforms-calendar-today", currentMonthYear && day === this.currentDay);
      XsltForms_browser.setClass(cell, "xsltforms-calendar-selected", dayInMonth && day === this.day);
      XsltForms_browser.setClass(cell, "xsltforms-calendar-weekend", (j+ini)%7 > 4);
      cell.firstChild.nodeValue = dayInMonth ? day++ : "";
    }
  }
};


    
/**
 * * '''getFirstDay''' method : gets the first day of the selected month
 */

XsltForms_calendar.prototype.getFirstDay = function() {
  var date = new Date();
  date.setDate(1);
  date.setMonth(this.selectMonth.value);
  date.setYear(this.inputYear.value);
  var ini = parseInt(XsltForms_browser.i18n.get("calendar.initDay"), 10);
  var d = date.getDay();
  return (d + (6 - ini)) % 7;
};


    
/**
 * * '''getDaysOfMonth''' method : gets the number of days of the selected month
 */

XsltForms_calendar.prototype.getDaysOfMonth = function() {
  var year = parseInt(this.inputYear.value, 10);
  var month = parseInt(this.selectMonth.value, 10);
  if (month === 1 && ((0 === (year % 4)) && ((0 !== (year % 100)) || (0 === (year % 400))))) {
    return 29;
  }
  return XsltForms_calendar.daysOfMonth[this.selectMonth.value];
};


    
/**
 * * '''createElement''' method : creates a new clickable day within this Calendar object
 */

XsltForms_calendar.prototype.createElement = function(parent, className, text, colspan, handler) {
  var element = XsltForms_browser.createElement("td", parent, text, className);
  if (colspan > 1) {
    element.colSpan = colspan;
  }
  if (handler) {
    XsltForms_browser.events.attach(element, "click", handler);
    XsltForms_browser.initHover(element);
  }
  return element;
};

XsltForms_calendar.daysOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

XsltForms_calendar.ONLY_DATE = 0;
XsltForms_calendar.HOURS = 1;
XsltForms_calendar.MINUTES = 2;
XsltForms_calendar.SECONDS = 3;


    
/**
 * * '''show''' function : shows a Calendar object of a given type for a given input
 */

XsltForms_calendar.show = function(input, type) {
  var cal = XsltForms_calendar.INSTANCE;
  if (!cal) {
    cal = new XsltForms_calendar();
    XsltForms_calendar.INSTANCE = cal;
  }
  if (!type) {
    type = XsltForms_calendar.ONLY_DATE;
  }
  cal.input = input;
  cal.type = type;
  cal.isTimestamp = type !== XsltForms_calendar.ONLY_DATE;
  XsltForms_browser.setClass(cal.element, "xsltforms-calendar-date", !cal.isTimestamp);
  var date;
  try {
    date = cal.isTimestamp? XsltForms_browser.i18n.parse(input.value) : XsltForms_browser.i18n.parseDate(input.value);
  } catch (e) {
    date = new Date();
  }
  if (date) {
    cal.refreshControls(date);
  } else {
    cal.today();
  }
  XsltForms_browser.dialog.show(cal.element, input, false);
};


    
/**
 * * '''close''' function : hides the current Calendar object
 */

XsltForms_calendar.close = function() {
  var cal = XsltForms_calendar.INSTANCE;
  cal.yearList.close();
  XsltForms_browser.dialog.hide(cal.element, false);
};