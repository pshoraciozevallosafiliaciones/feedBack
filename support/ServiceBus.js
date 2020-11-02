const constants = require('./Constants.js');
const EnvironmentUtil = require('./EnvironmentUtil.js').EnvironmentUtil;
const { ServiceBusClient } = require("@azure/service-bus");

class ServiceBus {
    constructor() {
        this.environmentUtil = EnvironmentUtil;
    }

    async sendMesage(data, topicName, topicLabel) {
        console.log("Sending message to topic: " + topicName + ", label: " + topicLabel);
        const connectionString = this.environmentUtil.getAppSettings(constants.SERVICEBUS_CONNECTION);
        let sbClient = ServiceBusClient.createFromConnectionString(connectionString);
        let queueClient = sbClient.createQueueClient(topicName);
        let sender = queueClient.createSender();

        try {
            const message = {
                body: data,
                label: topicLabel
            };
            await sender.send(message);
            await queueClient.close();
        } catch (error) {
            
        } finally {
            await sbClient.close();
        }
    }
}

exports.ServiceBus = ServiceBus;