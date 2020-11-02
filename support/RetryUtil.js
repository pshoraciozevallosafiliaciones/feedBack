const EnvironmentUtil = require('../support/EnvironmentUtil.js').EnvironmentUtil;
const constants = require('../support/Constants.js');
const ServiceBus = require('../support/ServiceBus.js').ServiceBus;
const EncryptUtil = require('../support/EncryptUtil.js').EncryptUtil;
const Service = require('../support/Service.js').Service;

class RetryUtil {
    constructor(context) {
        this.serviceBus = new ServiceBus(context);
        this.service = new Service(context);
        this.environmentUtil = EnvironmentUtil;
        this.encryptUtil =EncryptUtil;
    }

    async PrepareMessageRetry(err, message, request, topicName, topicLabel, functionName){
        if (request == undefined || JSON.stringify(request).length == 0){
            request = message;
        }
        const key = this.environmentUtil.getAppSettings(constants.ACP_KEY_AUTH_CODE);
        let requestEncrypt = this.encryptUtil.encryptUUID(key,JSON.stringify(request));
        /*const msg = {
            data: message,
            error: err,
            topicName: this.environmentUtil.getAppSettings(topicName),
            topicLabel: this.environmentUtil.getAppSettings(topicLabel),
            functionName: functionName,
            request: requestEncrypt
        }*/
        message.data.error = err;
        message.data.topicName = this.environmentUtil.getAppSettings(topicName);
        message.data.topicLabel = this.environmentUtil.getAppSettings(topicLabel);
        message.data.functionName = functionName;
        message.data.request = requestEncrypt;
        

        await this.SendTopicRetry(message);
    }

    async SendTopicRetry(message){
        const topicName = this.environmentUtil.getAppSettings(constants.TOPIC_SEND_EMAIL_RETRY_NAME);
        const topicLabel = this.environmentUtil.getAppSettings(constants.TOPIC_SEND_EMAIL_RETRY_LABEL);
        if(message.data.retryCount == null){
            message.data.retryCount = 0;
        }
        message.data.retryCount += 1;
        //await this.AcptopicUtil.sendMesage(message, topicName, topicLabel);

        await this.serviceBus.sendMesage(message, topicName, topicLabel);
    }
}
exports.RetryUtil = RetryUtil;