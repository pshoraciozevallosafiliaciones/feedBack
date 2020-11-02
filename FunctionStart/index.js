
const constants = require('../support/Constants.js');
const moment = require("moment");
const Service = require('../support/Service.js').Service;
const EnvironmentUtil = require('../support/EnvironmentUtil.js').EnvironmentUtil;
const xml2js = require('xml2js');
const ServiceBus = require('../support/ServiceBus.js').ServiceBus;
const SlackController = require('../support/SlackSend.js').SlackController;
const FeedController = require('./FeedController.js').FeedController;

const uuid = require("uuid/v4");
let appInsights = require('applicationinsights');

module.exports = async function (context, myTimer) {
    
    const controller = new FeedController(context);
    let result = await controller.ExecuteFeedBackHTML(); 
    context.done();

};