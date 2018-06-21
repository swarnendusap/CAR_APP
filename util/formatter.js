sap.ui.define([
  "sap/ui/core/Element",
  "sap/ui/core/format/DateFormat"
], function(Element, DateFormat) {
  "use strict";
  var Formatter = Element.extend("emalDubalAR.util.formatter");
  Formatter.concateTwoValue_roundVal = function(sValue, sDesc) {
    if (!sValue) {
      return "";
    } else {
      // var s = "(" + sValue + ") " + Math.round(sDesc);
      var s = "(" + sValue + ") " + sDesc;
      return s;
    }
  };
  Formatter.concateTwoValue = function(sValue, sDesc) {
    if (!sValue) {
      return "";
    } else {
      var s = "(" + sValue + ") " + sDesc;
      return s;
    }
  };
  Formatter.concateOneValue = function(sValue) {
    if (!sValue) {
      return "";
    } else {
      var s = "(" + sValue + ")";
      return s;
    }
  };
  Formatter.concateNameAndEmployeeNumber = function(employeeName, employeeNumber) {
    if ($.isEmptyObject(employeeNumber)) {
      return employeeName;
    } else {
      return employeeName + " ( " + employeeNumber + " )";
    }
  };
  Formatter.concateARRequestorCreator = function(arRequestorCreatorName, arRequestorCreatorNumber) {
    if ($.isEmptyObject(arRequestorCreatorNumber)) {
      return arRequestorCreatorName;
    } else {
      return arRequestorCreatorName + " ( " + arRequestorCreatorNumber + " )";
    }
  };
});