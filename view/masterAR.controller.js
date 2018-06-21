sap.ui.controller("emalDubalAR.view.masterAR", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf emalDubalAR.masterAR
*/
  onInit: function() {
    this.oRouter = new sap.ui.core.UIComponent.getRouterFor(this);
      this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
      this.getView().setModel(this.getOwnerComponent().getModel("LocalMasterModel"),"LocalMasterModele");
      //this.getView().setModel(this.getOwnerComponent().getModel("onHoldVisibleModel"),"localOnHoldVisibleModel");
      jQuery.sap.require("emalDubalAR.util.formatter");
      this.flag=false;
    //debugger;
  },
  onSearch: function (oEvt) {
    //debugger;
    var aFilters = [];
    var sQuery = oEvt.getSource().getValue();
    if (sQuery && sQuery.length > 0) {
      var filter = new sap.ui.model.Filter("TaskTitle", sap.ui.model.FilterOperator.Contains, sQuery);
      aFilters.push(filter);
    }
    // update list binding
    var list = this.getView().byId("inBoxValues_e");
    var binding = list.getBinding("items");
    binding.filter(aFilters, "Application");
  },
  getGroupHeader: function (oGroup){
    return new sap.m.GroupHeaderListItem( {
      title: oGroup.key==="ECC_EMAL_PGW"? "Al Taweelah Appropriation  Request" : "Jebal Ali Appropriation  Request",
      //title: oGroup.key,
      upperCase: false
    } );

  },
  onSelectionChange: function (oEvent) {
    //debugger;
    //var b = oEvent.oSource.mProperties.title;
    var b = " ";
    //b=b.replace("/", "");
    var system = oEvent.oSource.oBindingContexts.LocalMasterModele.getProperty().SAP__Origin;
    //var localOnHoldVisibleModel=this.getView().getModel("localOnHoldVisibleModel");
    var localOnHoldVisibleModel = this.getOwnerComponent().getModel("onHoldVisibleModel");
    if(system==='ECC_EMAL_PGW'){
      localOnHoldVisibleModel.setProperty("/isVisibleOnHold",true);
      //b = b.substr(b.length-6);
    }else if(system==='ECC_DUBAL_PGW'){
      localOnHoldVisibleModel.setProperty("/isVisibleOnHold",false);
      //b = b.substr(b.length-8);
    }
    //debugger;
    var c = oEvent.oSource.oBindingContexts.LocalMasterModele.getProperty().InstanceID;
    console.log(c);
    this.oRouter.navTo("detail",{
      arId: b,
      instanceID: c
    });
    //debugger;
  },

  onRouteMatched: function(oEvent) {

    var oNameParameter = oEvent.getParameter("name");
    if(oNameParameter==="AppStart" || oNameParameter==="master"){
    this.getView().setBusy(true);
    if(this.flag){
    this.getOwnerComponent().getModel("masterModele").refresh();
    //this.getOwnerComponent().getModel("masterModeld").refresh();
    }else{
      this.flag=true;
    }
    //alert("hi");
    var localMasterModele = this.getView().getModel("LocalMasterModele");
    this.oModele = this.getOwnerComponent().getModel("masterModele");
    var filterData_e = new Array(); 
    var filterData_eTest = new Array(); 
    //this.listLoadDeferred= $.Deferred();
    var a = new sap.ui.model.Filter({
                 path: "Status",
                 operator: sap.ui.model.FilterOperator.EQ,
                 value1: "IN_PROGRESS"

          });
           var b = new sap.ui.model.Filter({
                 path: "Status",
                 operator: sap.ui.model.FilterOperator.EQ,
                 value1: "READY"
          });
          var c = new sap.ui.model.Filter({
                 path: "Status",
                 operator: sap.ui.model.FilterOperator.EQ,
                 value1: "RESERVED"
          });
          var d = new sap.ui.model.Filter({
                 path: "TaskDefinitionID",
                 operator: sap.ui.model.FilterOperator.EQ,
                 value1: "TS00300052"
          });
          var e = new sap.ui.model.Filter({
                 path: "TaskDefinitionID",
                 operator: sap.ui.model.FilterOperator.EQ,
                 value1: "TS90000204"
          });
        var f = [];
        f.push(a);
        f.push(b);
        f.push(c);
        f.push(d);
        f.push(e);
    this.oModele.read("/TaskCollection", {
      filters : f,
      success:$.proxy(function(oData){ 
        //debugger;
        for(var i=0;i<oData.results.length;i++){
          //if(oData.results[i].TaskDefinitionID == "TS00300052" || oData.results[i].TaskDefinitionID == "TS90000204"){
         /* if(oData.results[i].TaskDefinitionID.indexOf("TS00300052") != -1
              || oData.results[i].TaskDefinitionID.indexOf("TS90000204") != -1 ){
            if(oData.results[i].Status == "READY" || oData.results[i].Status == "IN_PROGRESS"){*/
              filterData_e.push(oData.results[i]);
              /*
              var tskTitle = oData.results[i].TaskTitle;
              var system = oData.results[i].SAP__Origin;
              var lastSpace = tskTitle.lastIndexOf(" ");
              var taskStr = tskTitle.substr(0,lastSpace);
              var arNummber = tskTitle.substr(lastSpace+1);

              filterData_eTest.push({
                "TaskDefinitionID":oData.results[i].TaskDefinitionID,
                "InstanceID":oData.results[i].InstanceID,
                "SAP__Origin":oData.results[i].SAP__Origin,
                "TaskTitle":oData.results[i].TaskTitle,
                "TaskTitleStr":taskStr,
                "ArNum":arNummber
                });
              */
           // }
          //}
        }
        /*
        for(var i=0;i<oData.results.length;i++){
          if(oData.results[i].TaskDefinitionID == "TS90000204"){
            if(oData.results[i].Status == "READY" || oData.results[i].Status == "IN_PROGRESS"){
              filterData_e.push(oData.results[i]);
            }
          }
        }
        */
        //debugger;
        localMasterModele.setProperty("/masterList_e",filterData_e);
        //localMasterModele.setProperty("/masterList_e",filterData_eTest);
        this.getView().setBusy(false);

      },this),
      failure:$.proxy(function(oData){ 
        this.getView().setBusy(false);
        //console.log(oData);                      
      },this)

    }); 
    }
  },
  onNavBack: function(oEvent){
    this.oRouter.navTo("Home");
  },
});