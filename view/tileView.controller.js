sap.ui.controller("emalDubalAR.view.tileView", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf emalDubalAR.tileView
*/
	onInit: function() {
		this.oRouter = new sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
		//this.getView().setModel(this.getOwnerComponent().getModel("apvPenModel"));
		this.getView().setModel(this.getOwnerComponent().getModel("LocalApvPenModel"),"LocalApvPenModel");
		
		
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf emalDubalAR.tileView
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf emalDubalAR.tileView
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf emalDubalAR.tileView
*/
//	onExit: function() {
//
//	}
	onRouteMatched : function(oEvent) {
    	var oNameParameter = oEvent.getParameter("name");
    	 this.hostName = window.location.hostname;
    	 if (oNameParameter === "Home") {
			var localApvPenModel = this.getView().getModel("LocalApvPenModel");
			this.oModele = this.getOwnerComponent().getModel("apvPenModele");
			//debugger;
			this.oModele.read("/ZWORKLIST_COUNTSet", {
				success:function(oData, oResponse){ 
					//debugger;
					var pendApproval=0;
					for(var i=0;i<oData.results.length;i++){
						if(oData.results[i].TaskId=="TS00300052"){
							//localApvPenModel.setProperty("/apvPenCount",Number(oData.results[i].Counter).toString());
							pendApproval = pendApproval+Number(oData.results[i].Counter);
						}
					}
					for(var i=0;i<oData.results.length;i++){
						if(oData.results[i].TaskId=="TS90000204"){
							//localApvPenModel.setProperty("/apvPenCount",Number(oData.results[i].Counter).toString());
							pendApproval = pendApproval+Number(oData.results[i].Counter);
						}
					}
					
					localApvPenModel.setProperty("/apvPenCount",Number(pendApproval).toString());
				},
				failure:function(oData, oResponse){ 
					//console.log(oData); 		                 
				}
			}); 
		}		
	 },
	 
	 onPress:function(oEvent){
		 
		 this.oRouter.navTo("master");
		 
	 }
});