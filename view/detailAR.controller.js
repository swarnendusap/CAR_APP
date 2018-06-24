sap.ui.controller("emalDubalAR.view.detailAR", {
	onInit: function() {
		this.getView().setModel(this.getOwnerComponent().getModel("LocalDetailModel"), "dtlModelValue");
		this.getView().setModel(this.getOwnerComponent().getModel("LocalDetailWiLogModel"), "detailWiLogModelValue");
		this.getView().setModel(this.getOwnerComponent().getModel("LocalDocListModel"), "docListModelValue");
		this.getView().setModel(this.getOwnerComponent().getModel("LocalArTextModel"), "LocalArTextModel");
		this.getView().setModel(this.getOwnerComponent().getModel("onHoldVisibleModel"), "localOnHoldVisibleModel");
		this.getView().setModel(this.getOwnerComponent().getModel("deviceModel"), "deviceModel");
		this.oRouter = new sap.ui.core.UIComponent.getRouterFor(this);
		this.oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
	},

	onRouteMatched: function(oEvent) {
		this.oNameParameter = oEvent.getParameter("arguments").arId;
		this.oNameParam_instanceID = oEvent.getParameter("arguments").instanceID;
		console.log(" onRouteMatched_Detail called with value 1: " + this.oNameParameter + "and 2: " + this.oNameParam_instanceID);
		//Disable or Enable Accept and Reject Button
		if ($.isEmptyObject(this.oNameParam_instanceID)) {
			this.getView().byId("bAccept").setVisible(false);
			this.getView().byId("bReject").setVisible(false);
		} else {
			this.getView().byId("bAccept").setVisible(true);
			this.getView().byId("bReject").setVisible(true);
		}
		var oViewName = oEvent.getParameter("name");
		if (oViewName !== "detail") {
			console.log("onRouteMatched_Detail call aborted");
			return;
		} else if (this.oNameParam_instanceID != null && !undefined) {
			console.log("onRouteMatched_Detail call Successful");
			/*      var localOnHoldVisibleModel = this.getView().getModel("localOnHoldVisibleModel");
			      this.systAlis = "";
			      if (localOnHoldVisibleModel.oData.isVisibleOnHold) {
			        this.systAlis = "ECC_EMAL_PGW";
			      } else if (!localOnHoldVisibleModel.oData.isVisibleOnHold) {
			        this.systAlis = "ECC_DUBAL_PGW";
			      }
			      this.syst = "";
			      var localOnHoldVisibleModel = this.getView().getModel("localOnHoldVisibleModel");
			      if (localOnHoldVisibleModel.oData.isVisibleOnHold) {
			        this.syst = "ECC_EMAL";
			      } else if (!localOnHoldVisibleModel.oData.isVisibleOnHold) {
			        this.syst = "ECC_DUBAL";
			      }*/

			this.loadDetail(this.oNameParam_instanceID);
			//this.loadWiLogDetail();
			//this.loadAttachedDocDetail(this.oNameParam_instanceID);
			//this.loadArText(this.oNameParam_instanceID);
		}
	},

	onNavBackDetail: function(oEvent) {
		this.oRouter.navTo("master");
	},
	onPressAccept: function(oEvent) {
		this.aFn(oEvent);
	},
	/*  onPressOnHold: function(oEvent) {
	    this.aFnH(oEvent);
	  },*/
	onPressReject: function(oEvent) {
		/*		var localOnHoldVisibleModel = this.getView().getModel("localOnHoldVisibleModel");
				if (localOnHoldVisibleModel.oData.isVisibleOnHold) {
					this.aFnR(oEvent);
				} else if (!localOnHoldVisibleModel.oData.isVisibleOnHold) {
					this.aFnR_dubal(oEvent);
				}*/
		this.aFnR(oEvent);
	},

	suceesActivateFn: function(oSuccess) {
		this.oRouter.navTo("master");
	},

	fnErrorFunction: function(oError) {
		console.log("in failed");
	},

	aFn: function(oEvent) {
		var that = this;
		var dialog = new sap.m.Dialog({
			title: 'Enter Comment',
			type: 'Message',
			content: new sap.m.TextArea({
				id: "acptCmnt",
				type: sap.m.InputType.Text,
				width: '100%',
				placeholder: "Enter Comments...(Mandatory)"
			}),

			beginButton: new sap.m.Button({
				text: 'Submit',
				type: 'Accept',
				press: function(oEvent) {
					console.log('Submit pressed!');
					var sComments = sap.ui.getCore().byId("acptCmnt").getValue();
					console.log("Comments Entered: " + sComments);
					if (!$.isEmptyObject(sComments)) {
						dialog.close();
						that.callAcceptAction(oEvent, sComments);
					}

				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				type: 'Reject',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	/*aFnH: function(oEvent) {
	  var that = this;
	  var dialog = new sap.m.Dialog({
	    title: 'Emter Comment',
	    type: 'Message',
	    content: new sap.m.TextArea({
	      id: "holdCmnt",
	      type: sap.m.InputType.Text,
	      width: '100%',
	      placeholder: "Enter Comments...(Optional)"
	    }),

	    beginButton: new sap.m.Button({
	      text: 'Submit',
	      type: 'Accept',
	      press: function(oEvent) {
	        console.log('Submit pressed!');
	        var sComments = sap.ui.getCore().byId("holdCmnt").getValue();
	        console.log(sComments);
	        dialog.close();
	        that.callHoldAction(oEvent, sComments);
	      }
	    }),
	    endButton: new sap.m.Button({
	      text: 'Cancel',
	      type: 'Reject',
	      press: function() {
	        dialog.close();
	      }
	    }),
	    afterClose: function() {
	      dialog.destroy();
	    }
	  });

	  dialog.open();
	},*/
	aFnR: function(oEvent) {
		var that = this;
		var dialog = new sap.m.Dialog({
			title: 'Emter Comment',
			type: 'Message',
			content: new sap.m.TextArea({
				id: "rejCmnt",
				type: sap.m.InputType.Text,
				width: '100%',
				placeholder: "Enter Comments...(Mandatory)"
			}),
			beginButton: new sap.m.Button({
				text: 'Submit',
				type: 'Accept',
				press: function(oEvent) {
					console.log('Submit pressed!');
					var sComments = sap.ui.getCore().byId("rejCmnt").getValue();
					if (!$.isEmptyObject(sComments)) {
						dialog.close();
						that.callRejectAction(oEvent, sComments);						
					}
					console.log(sComments);
				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				type: 'Reject',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	aFnR_dubal: function(oEvent) {
		var that = this;
		var dialog = new sap.m.Dialog({
			title: 'Emter Comment',
			type: 'Message',
			content: new sap.m.TextArea({
				id: "rejCmnt",
				type: sap.m.InputType.Text,
				width: '100%',
				placeholder: "Enter Comments...(required)",
				liveChange: function(oEvent) {
					var sText = oEvent.getParameter('value');
					var parent = oEvent.getSource().getParent();
					parent.getBeginButton().setEnabled((sText.trim()).length > 0);
				}
			}),
			beginButton: new sap.m.Button({
				text: 'Submit',
				enabled: false,
				type: 'Accept',
				press: function(oEvent) {
					console.log('Submit pressed!');
					var sComments = sap.ui.getCore().byId("rejCmnt").getValue();
					dialog.close();
					that.callRejectAction_dubal(oEvent, sComments);
				}
			}),
			endButton: new sap.m.Button({
				text: 'Cancel',
				type: 'Reject',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
	},
	callAcceptAction: function(oEvent, cmnt) {
		var oModel = this.getOwnerComponent().getModel("masterModele");
		var oURLParameters = {
			InstanceID: this.oNameParam_instanceID,
			DecisionKey: '0001',
			Comments: cmnt

		};
		/*SAP__Origin: this.systAlis*/
		var that = this;
		oModel.callFunction("Decision", "POST", oURLParameters, null,
			$.proxy(function(oData, oResponse) {
				var dialog = new sap.m.Dialog({
					title: "Success",
					type: "Message",
					state: "Success",
					content: new sap.m.Text({
						text: "Request has been Approved successfully."
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
							that.oRouter.navTo("master");
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this),
			$.proxy(function(errorResponse) {
				var errorMessage = JSON.parse(errorResponse.response.body).error.message.value;
				var dialog = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: errorMessage
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this)
		);
	},
	/*	callHoldAction: function(oEvent, cmnt) {
			var oModel = this.getOwnerComponent().getModel("masterModele");
			var oURLParameters = {
				InstanceID: this.oNameParam_instanceID,
				DecisionKey: '0002',
				Comments: cmnt,
				SAP__Origin: this.systAlis
			};
			var that = this;
			oModel.callFunction("Decision", "POST", oURLParameters, null,
				$.proxy(function(oData, oResponse) {
					var dialog = new sap.m.Dialog({
						title: "Success",
						type: "Message",
						state: "Success",
						content: new sap.m.Text({
							text: "Request has been Hold successfully."
						}),
						beginButton: new sap.m.Button({
							text: "OK",
							press: $.proxy(function() {
								dialog.close();
								that.oRouter.navTo("master");
							}, this)
						}),
						afterClose: $.proxy(function() {
							dialog.destroy();
						}, this)
					});
					dialog.open();
				}, this),
				$.proxy(function(errorResponse) {
					var errorMessage = JSON.parse(errorResponse.response.body).error.message.value;
					var dialog = new sap.m.Dialog({
						title: "Error",
						type: "Message",
						state: "Error",
						content: new sap.m.Text({
							text: errorMessage
						}),
						beginButton: new sap.m.Button({
							text: "OK",
							press: $.proxy(function() {
								dialog.close();
							}, this)
						}),
						afterClose: $.proxy(function() {
							dialog.destroy();
						}, this)
					});
					dialog.open();
				}, this)
			);
		},*/
	callRejectAction: function(oEvent, cmnt) {
		var oModel = this.getOwnerComponent().getModel("masterModele");
		var oURLParameters = {
			InstanceID: this.oNameParam_instanceID,
			DecisionKey: '0003',
			Comments: cmnt

		};
		/*SAP__Origin: this.systAlis*/
		var that = this;
		oModel.callFunction("Decision", "POST", oURLParameters, null,
			$.proxy(function(oData, oResponse) {
				var dialog = new sap.m.Dialog({
					title: "Success",
					type: "Message",
					state: "Success",
					content: new sap.m.Text({
						text: "Request has been Rejected successfully."
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
							that.oRouter.navTo("master");
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this),
			$.proxy(function(errorResponse) {
				var errorMessage = JSON.parse(errorResponse.response.body).error.message.value;
				var dialog = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: errorMessage
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this)
		);
	},
	callRejectAction_dubal: function(oEvent, cmnt) {
		var oModel = this.getOwnerComponent().getModel("masterModele");
		var oURLParameters = {
			InstanceID: this.oNameParam_instanceID,
			DecisionKey: '0002',
			Comments: cmnt,
			SAP__Origin: this.systAlis
		};
		var that = this;
		oModel.callFunction("Decision", "POST", oURLParameters, null,
			$.proxy(function(oData, oResponse) {
				var dialog = new sap.m.Dialog({
					title: "Success",
					type: "Message",
					state: "Success",
					content: new sap.m.Text({
						text: "Request has been Rejected successfully."
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
							that.oRouter.navTo("master");
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this),
			$.proxy(function(errorResponse) {
				var errorMessage = JSON.parse(errorResponse.response.body).error.message.value;
				var dialog = new sap.m.Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new sap.m.Text({
						text: errorMessage
					}),
					beginButton: new sap.m.Button({
						text: "OK",
						press: $.proxy(function() {
							dialog.close();
						}, this)
					}),
					afterClose: $.proxy(function() {
						dialog.destroy();
					}, this)
				});
				dialog.open();
			}, this)
		);
	},
	loadArText: function(oNameParam_instanceID) {
		var model = this.getOwnerComponent().getModel("detailModele");
		//var model = this.getOwnerComponent().getModel("detailModeleNew");
		var localModel = this.getView().getModel("LocalArTextModel");

		var filters = new Array();
		var filterVal = new sap.ui.model.Filter("WiId", sap.ui.model.FilterOperator.EQ, oNameParam_instanceID);
		filters.push(filterVal);

		model.read("/ZAR_TEXTSet", { //new data set with description text
			filters: filters,
			success: function(oData, response) {
				var completeString = "";
				for (var ctr = 0; ctr < oData.results.length; ctr++) {
					completeString += oData.results[ctr].Tdline + "\n";
				}
				// localModel.setProperty("/arText", oData.results[0]);
				localModel.setProperty("/arText", completeString);
			},
			failed: function(oData, response) {
				console.log("Failed to get Input Values from service!");
			}
		});
	},

	loadDetail: function(oNameParam_instanceID) {
		console.log("loadDetail Function called");
		var model = this.getOwnerComponent().getModel("detailModele");
		var localModel = this.getView().getModel("dtlModelValue");

		var filters = new Array();
		var filterVal = new sap.ui.model.Filter("Wiid", sap.ui.model.FilterOperator.EQ, oNameParam_instanceID);
		filters.push(filterVal);

		model.read("/GetCustomerDetailsSet", { //new data set with description text
			filters: filters,
			success: function(oData, response) {
				localModel.setProperty("/Customer", oData.results[0]);
				console.log("GetCustomerDetail OData");
				console.log(oData);
			},
			failed: function(oData, response) {
				console.log("Failed to get Customer Details Data Set from Data service!");
			}
		});

		model.read("/GetCreditDetailsSet", { //new data set with description text
			filters: filters,
			success: function(oData, response) {
				localModel.setProperty("/Credit", oData.results[0]);
				console.log("GetCreditDetail OData");
				console.log(oData);
			},
			failed: function(oData, response) {
				console.log("Failed to get Credit Details Data Set from Data service!");
			}
		});

		model.read("/GetWfLogSet", {
			filters: filters,
			success: function(oData, response) {
				console.log(oData);
				var logTemp = new Array();
				for (var i = 0; i < oData.results.length; i++) {
					logTemp.push(oData.results[i]);
				}
				localModel.setProperty("/wiLogItems", logTemp);
				console.log("Get Wf Details OData");
				console.log(logTemp);
			},
			failed: function(oData, response) {
				console.log("Failed to get Workflow Log Set from Data service!");
			}
		});

		model.read("/GetRecommendationSet", {
			filters: filters,
			success: function(oData, response) {
				/*        var logTemp = new Array();
				        for (var i = 0; i < oData.results.length; i++) {
				          logTemp.push(oData.results[i]);
				        }
				        localModel.setProperty("/wiLogItems", logTemp);*/

				var completeString = "";
				for (var ctr = 0; ctr < oData.results.length; ctr++) {
					completeString += oData.results[ctr].Tline + "\n";
				}
				// localModel.setProperty("/arText", oData.results[0]);
				localModel.setProperty("/Recom", completeString);
				console.log("Get Recommendation OData: ");
				console.log(oData);
			},
			failed: function(oData, response) {
				console.log("Failed to get Workflow Log Set from Data service!");
			}
		});
	},
	loadAttachedDocDetail: function(oNameParam_instanceID) {
		var model = this.getOwnerComponent().getModel("docListModele");
		var localModel = this.getView().getModel("docListModelValue");
		var filters = new Array();
		var filterVal = new sap.ui.model.Filter("WiId", sap.ui.model.FilterOperator.EQ, oNameParam_instanceID);
		filters.push(filterVal);

		model.read("/zar_attach_filenameSet", { //new data set with description text
			filters: filters,
			success: function(oData, response) {
				localModel.setProperty("/attachments", oData.results);
			},

			failed: function(oData, response) {
				console.log("Failed to get Input Values from service!");
			}
		});
	},

	onDocSelect: function(evt) {
		var fileName = evt.getSource().getTitle();
		var WiId = this.oNameParam_instanceID;
		this.oModel = this.getOwnerComponent().getModel("docListModele");
		this.oModel.setUseBatch(false);
		var oHTML = new sap.ui.core.HTML();
		var oPanel = new sap.m.Panel();

		var sRead = "/ZAR_ATTACH_FILEDATASet(WiId='" + WiId + "',FileName='" + fileName + "')" + "\/\$value";
		//window.open("http://172.17.70.67:8000/sap/opu/odata/sap/ZGW_ATTACH_SRV;o=ECC_EMAL/ZAR_ATTACH_FILEDATASet(ArNo='900037',FileName='light-bulb-with-globe-seisiri-silapasuwanchai.JPG')/$value");
		//debugger;
		//
		var sOrigin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
		//var pdfURL = "http://dc1dgrcdv.emal.domain:8000/sap/opu/odata/sap/ZGW_ATTACH_SRV\;o="+this.syst+"/ZAR_ATTACH_FILEDATASet(WiId='"+WiId+"',FileName='"+fileName+"')" + "\/\$value";
		var pdfURL = sOrigin + "/sap/opu/odata/sap/ZGW_ATTACH_SRV\;o=" + this.syst + "/ZAR_ATTACH_FILEDATASet(WiId='" + WiId + "',FileName='" +
			fileName + "')" + "\/\$value";
		//debugger;
		// oHTML.setContent("<iframe src=" + pdfURL + " style='border-style: none;margin-bottom: 0;padding: 0rem;width: 0px; height: 0px;'></iframe>");
		//oPanel.addContent(oHTML);
		parent.window.open(pdfURL, '_blank');
		//oPanel.placeAt("content");
		var dialog = new sap.m.Dialog({
			title: 'Attached Files Download',
			type: 'Message',
			content: [
				oPanel,
				new sap.m.Text({
					text: 'Selected file downloaded. Please check it from your download folder.'
				})
			],

			beginButton: new sap.m.Button({
				text: 'OK',
				press: function() {
					dialog.close();
				}
			}),
			afterClose: function() {
				dialog.destroy();
			}
		});
		dialog.open();
		/*
		     this.oModel.read( sRead, null, null, true, function(oData, oResponse){
		          var pdfURL = oResponse.requestUri;
		          oHTML.setContent("<iframe src=" + pdfURL + " width='100%' height='100%'></iframe>");
		          oPanel.addContent(oHTML);
		          //oPanel.placeAt("content");
		                   var dialog = new sap.m.Dialog({
		                     title: 'Attached Files Download',
		            type: 'Message',
		            content:[
		                     oPanel,
		                     new sap.m.Text({
		              text: 'Selected file downloaded. Please check it from your download folder.'
		            })],

		            beginButton: new sap.m.Button({
		              text: 'OK',
		              press: function () {
		                dialog.close();
		              }
		            }),
		                afterClose: function() {
		                  dialog.destroy();
		                }
		                     });
		                   dialog.open();
		        },function(){
		        console.log("Read failed");});
		      */
	}
});