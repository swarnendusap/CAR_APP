sap.ui.controller("emalDubalAR.view.masterAR", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf emalDubalAR.masterAR
	 */
	onInit: function() {
		this.oRouter = new sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
		this.getView().setModel(this.getOwnerComponent().getModel("LocalMasterModel"), "LocalMasterModele");
		//this.getView().setModel(this.getOwnerComponent().getModel("onHoldVisibleModel"),"localOnHoldVisibleModel");
		jQuery.sap.require("emalDubalAR.util.formatter");
		this.flag = false;
		this.vOnSelChange = false;
		//debugger;
	},
	onSearch: function(oEvt) {
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
	
	onLoadFirstSelection: function(vInstanceID) {

		this.vOnSelChange = true;

		var b = " ";

		//var c = oEvent.oSource.oBindingContexts.LocalMasterModele.getProperty().InstanceID;
		var c = vInstanceID;
		//c = "000000169661";
		console.log("On First Selection: " + c);
		this.oRouter.navTo("detail", {
			arId: b,
			instanceID: c
		});
	},

	onSelectionChange: function(oEvent) {

		this.vOnSelChange = true;

		var b = " ";

		var c = oEvent.oSource.oBindingContexts.LocalMasterModele.getProperty().InstanceID;
		console.log("On Selection Change: " + c);
		this.oRouter.navTo("detail", {
			arId: b,
			instanceID: c
		});
	},

	onRouteMatched: function(oEvent) {
		var that = this;
		var oNameParameter = oEvent.getParameter("name");
		console.log("onRouteMatched_Master called with value: " + oNameParameter);
		console.log("On Select Change: "+!this.vOnSelChange);
		if (!this.vOnSelChange) {
			console.log("onRouteMatched_Master executed with OnSelection Value --> entered into if");

			if (oNameParameter === "AppStart" || oNameParameter === "master" || oNameParameter === "detail") {
				this.getView().setBusy(true);
				if (this.flag) {
					this.getOwnerComponent().getModel("masterModele").refresh();
					//this.getOwnerComponent().getModel("masterModeld").refresh();
				} else {
					this.flag = true;
				}

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

				//For CAR Approval TaskID
				var d = new sap.ui.model.Filter({
					path: "TaskDefinitionID",
					operator: sap.ui.model.FilterOperator.EQ,
					value1: "TS90000479"
				});
				var f = [];
				f.push(a);
				f.push(b);
				f.push(c);
				f.push(d);
				var initialLoadFirstInstanceID = "";
				this.oModele.read("/TaskCollection", {
					filters: f,
					success: $.proxy(function(oData) {
						//debugger;
						console.log("Master Task Collection OData: ");
						console.log(oData.results);

						for (var i = 0; i < oData.results.length; i++) {
							filterData_e.push(oData.results[i]);
						}

						localMasterModele.setProperty("/masterList_e", filterData_e);
						if (oData.results.length>0){
							initialLoadFirstInstanceID = oData.results[0].InstanceID;
							console.log(initialLoadFirstInstanceID);
							that.onLoadFirstSelection(initialLoadFirstInstanceID);
						}
						//localMasterModele.setProperty("/masterList_e",filterData_eTest);
						this.getView().setBusy(false);

					}, this),
					failure: $.proxy(function(oData) {
						this.getView().setBusy(false);
						//console.log(oData);                      
					}, this)

				});
			}
		}
	},
	onNavBack: function(oEvent) {
		this.oRouter.navTo("Home");
	}
});