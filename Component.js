sap.ui.define([
  "sap/ui/core/UIComponent",
  "sap/ui/model/odata/ODataModel",
  "sap/ui/model/json/JSONModel",
  "sap/ui/Device",
  "sap/ui/model/resource/ResourceModel"
], function(UIComponent, ODataModel, JSONModel, Device, ResourceModel) {
  "use strict";
  return UIComponent.extend("emalDubalAR.Component", {
    metadata: {
      name: "AR",
      version: "1.0",
      includes: ["util/formatter.js", "css/style.css"],
      dependencies: {
        libs: ["sap.m", "sap.ui.layout"]
      },
      rootView: "emalDubalAR.view.App",
      config: {
        resourceBundle: "i18n/i18n.properties",
        serviceConfig: {
          name: "localData",
          //for server emal
          serviceUrle: "/sap/opu/odata/IWPGW/TASKPROCESSING;mo/",
          detailUrle: "/sap/opu/odata/sap/ZGW_APP_REQ2_SRV;mo/",
          detailUrleNew: "/sap/opu/odata/sap/ZGW_APP_REQ2_SRV/",
          wiLogUrle: "/sap/opu/odata/sap/ZGW_WF_LOG_SRV;mo/",
          wiLogUrleNew: "/sap/opu/odata/sap/ZGW_WF_LOG_SRV/",
          apvPenUrle: "/sap/opu/odata/sap/ZGW_COUNT_SRV;mo/",
          docListUrle: "/sap/opu/odata/sap/ZGW_ATTACH_SRV;mo/",
          /*
          //for server dubal
          serviceUrle: "http://172.17.64.230:8000/sap/opu/odata/IWPGW/TASKPROCESSING;mo/",//$format=json
          detailUrle: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_APP_REQ2_SRV;mo/",//new
          detailUrleNew: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_APP_REQ2_SRV/",
          wiLogUrle: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_WF_LOG_SRV;mo/",
          wiLogUrleNew: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_WF_LOG_SRV/",
          apvPenUrle: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_COUNT_SRV;mo/",
          docListUrle: "http://172.17.64.230:8000/sap/opu/odata/sap/ZGW_ATTACH_SRV;mo/",
          */
          local: true
        }
      },

      routing: {
        config: {
          viewType: "XML",
          viewPath: "emalDubalAR.view",
          targetAggregation: "pages",
          clearTarget: false
        },
        routes: [{
          pattern: "",
          name: "AppStart",
          view: "masterAR",
          targetControl: "idAppControl"
        }, {
          pattern: "splitApp",
          name: "splitApp",
          view: "splitApp",
          targetControl: "idAppControl",
          subroutes: [{
            pattern: "Master",
            name: "master",
            view: "masterAR",
            targetControl: "splitAppControl",
            targetAggregation: "masterPages",
            subroutes: [{
              pattern: "Detail/{arId}/{instanceID}",
              name: "detail",
              view: "detailAR",
              targetAggregation: "detailPages"
            }]
          }]
        }]
      }
    },

    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
     * @public
     * @override
     */
    init: function() {
      // call the base component's init function
      UIComponent.prototype.init.apply(this, arguments);
      var mConfig = this.getMetadata().getConfig();
      var serviceConfig = mConfig.serviceConfig;
      var oRootPath = $.sap.getModulePath("emalDubalAR");

      var sServiceUrle = serviceConfig.serviceUrle;
      var sdetailUrle = serviceConfig.detailUrle;
      var sdetailUrleNew = serviceConfig.detailUrleNew;
      var swiLogUrle = serviceConfig.wiLogUrle;
      var swiLogUrleNew = serviceConfig.wiLogUrleNew;
      var sApvPenUrle = serviceConfig.apvPenUrle;
      var sDocListUrle = serviceConfig.docListUrle;

      var oModele = new ODataModel(sServiceUrle, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });
      var oDtlModele = new ODataModel(sdetailUrle, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });

      var oDtlModeleNew = new ODataModel(sdetailUrleNew, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });

      var oWiLogModele = new ODataModel(swiLogUrle, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });

      var oWiLogModeleNew = new ODataModel(swiLogUrleNew, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });

      var oApvPenModele = new ODataModel(sApvPenUrle, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });
      var oDocListModele = new ODataModel(sDocListUrle, {
        useBatch: true,
        defaultUpdateMethod: 'PATCH',
        json: true,
        countSupported: true
      });

      var deviceModel = false;
      if (sap.ui.Device.system.desktop) {
        deviceModel = false;
      } else if (sap.ui.Device.system.phone || sap.ui.Device.system.tablet) {
        deviceModel = true;
      }

      var deviceModelJSON = new JSONModel({
        "deviceModel": deviceModel
      });
      this.setModel(deviceModelJSON, "deviceModel");

      var oJsonModel = new JSONModel();
      //master model
      this.setModel(oModele, "masterModele");
      this.setModel(oJsonModel, "LocalMasterModel");
      //detail model
      this.setModel(oDtlModele, "detailModele");
      this.setModel(oDtlModeleNew, "detailModeleNew");
      this.setModel(oJsonModel, "LocalDetailModel");
      //Workflow log model
      this.setModel(oWiLogModele, "detailWiLogModele");
      this.setModel(oWiLogModeleNew, "detailWiLogModeleNew");
      this.setModel(oJsonModel, "LocalDetailWiLogModel");
      //Approval pending number model
      this.setModel(oApvPenModele, "apvPenModele");
      this.setModel(oJsonModel, "LocalApvPenModel");
      //Attached doc list
      this.setModel(oDocListModele, "docListModele");
      this.setModel(oJsonModel, "LocalDocListModel");
      //Ar Text Model
      this.setModel(oJsonModel, "LocalArTextModel");
      //isVisible onHold button
      this.setModel(oJsonModel, "onHoldVisibleModel");
      var i18nModel = new ResourceModel({
        bundleUrl: [oRootPath, mConfig.resourceBundle].join("/"),
        async: true
      });
      this.setModel(i18nModel, "i18n");
      var router = this.getRouter();

      this.routerHandler = new sap.m.routing.RouteMatchedHandler(router);
      router.register();
      router.initialize();
    },

    destroy: function() {
      if (this.routerHandler) {
        this.routerHandler.destroy();
      }
      UIComponent.prototype.destroy.apply(this, arguments);
    }
  });
});