const constants = require('../support/Constants.js');
const EnvironmentUtil = require('../support/EnvironmentUtil.js').EnvironmentUtil;
const axios = require('axios');
const EncryptUtil = require('../support/EncryptUtil.js').EncryptUtil;
this.EncryptUtil = EncryptUtil;
class SlackController {
    constructor(context) {
        
        this.environmentUtil = EnvironmentUtil;
        this.context = context;
        this.EncryptUtil = EncryptUtil;
      
    }

    async SendSlackMessage(message){
        const topicName = message.topicName
        const topicLabel = message.topicLabel
        const object = message.data

        //notify slack
        const key = this.environmentUtil.getAppSettings(constants.ACP_KEY_AUTH_CODE);
      
        const request = this.EncryptUtil.encryptUUID(key, JSON.stringify(message.data));
        const body = {
            text: "*traceId*: `"+ message.traceId +"`\n" + 
                "*component*: `"+ message.functionName +"`\n" + 
                "*functionException*: `"+ JSON.stringify(message.error) +"` \n" +
                "*request/messageTopic*: `"+ request +"`\n" + 
                "*aplication*: `acp-function`\n" + 
                "*errorDate*: `"+(new Date()).getTime()+"`"
        };

        const url = this.environmentUtil.getAppSettings(constants.ACP_URL_SLACK);
        await axios.post(url,JSON.stringify(body))
        .then((r) => {
            this.context.log("Send message to slack: ", r.statusText);
        })
        .catch((r) => {
            this.context.log("Error send message to slack: ", r.message);
        });   
    }
    
}

exports.SlackController = SlackController;