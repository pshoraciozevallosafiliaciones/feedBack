
const constants = require('./Constants.js');
const moment = require("moment");
const Service = require('./Service.js').Service;
const EnvironmentUtil = require('./EnvironmentUtil.js').EnvironmentUtil;
const xml2js = require('xml2js');
const uuid = require("uuid/v4");
let appInsights = require('applicationinsights');

class AppInsightsLog {

    constructor(context) {
        this.context = context;
        this.environmentUtil = EnvironmentUtil;
        appInsights.setup(this.environmentUtil.getAppSettings(constants.APPLICATIONINSIGHTKEY))
        .setAutoDependencyCorrelation(true)
        .setAutoCollectRequests(true)
        .setAutoCollectPerformance(true, true)
        .setAutoCollectExceptions(true)
        .setAutoCollectDependencies(true)
        .setAutoCollectConsole(true)
        .setUseDiskRetryCaching(true)
        .setSendLiveMetrics(true)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
        .start();
    }

 

    log(msj){
        try{
            let client = appInsights.defaultClient;
            msj = JSON.stringify(msj);
            client.trackTrace({message: msj});
            this.context.log(msj);
        }
        catch(err){
            this.context.log(err);
            client.trackException({exception: err});
        }
        
    }
   

}

exports.AppInsightsLog = AppInsightsLog;