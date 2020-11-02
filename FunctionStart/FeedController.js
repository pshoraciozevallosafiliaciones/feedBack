const ServiceBus = require('../support/ServiceBus.js').ServiceBus;
const constants = require('../support/Constants.js');
const EnvironmentUtil = require('../support/EnvironmentUtil.js').EnvironmentUtil;
const EncryptUtil = require('../support/EncryptUtil.js').EncryptUtil;
const axios = require('axios');
const Service = require('../support/Service.js').Service;
const SlackController = require('../support/SlackSend.js').SlackController;
const moment = require("moment");
const appInsightsLog = require('../support/AppInsightsLog.js').AppInsightsLog;
class FeedController {
    constructor(context) {
      
        this.environmentUtil = EnvironmentUtil;
        this.EncryptUtil = EncryptUtil;
        this.context = context;
        this.serviceBus = new ServiceBus(context);
        this.service = new Service(context);
        this.appInsightsLog = new appInsightsLog(context);
    }

    async ExecuteFeedBackHTML(){
       

        const visibility = this.environmentUtil.getAppSettings(constants.TOPIC_SEND_BULK_EMAILS_SEND_MAIL_VISIBILITY);

        const email = this.environmentUtil.getAppSettings(constants.EMAIL);
        const tip_Doc = this.environmentUtil.getAppSettings(constants.TIP_DOC);
        const cod_Doc = this.environmentUtil.getAppSettings(constants.COD_DOC);
        const start_Date = moment().format('MM/DD/YY h:mm:ss');
        const end_Date = moment().add(1, 'days').format('MM/DD/YY h:mm:ss');




        this.appInsightsLog.log("### 1. GENERACIÓN DE FEEDBACK HTML");
        try {
            let responseOAuth = await this.service.GetToken();
            let accessToken = responseOAuth.data.access_token;
            if (accessToken == undefined || responseOAuth.status != 200) {
                this.appInsightsLog.log("Error getting accessToken - Acoustic Campaign")
                return false;
            }
            
            /*
            <Envelope>
   <Body>
      <RawRecipientDataExport>
         <EVENT_DATE_START>10/13/2020 05:00:00</EVENT_DATE_START>
         <EVENT_DATE_END>10/14/2020 04:59:59</EVENT_DATE_END>
         <MOVE_TO_FTP />
         <EXPORT_FORMAT>1</EXPORT_FORMAT>
         <EMAIL>cocaresh@intercorp.com.pe</EMAIL>
         <ALL_EVENT_TYPES/>
         <RETURN_MAILING_NAME />
         <RETURN_SUBJECT />
         <REPORT_ID />
         <EXPORT_FILE_NAME>feedback_html_acp</EXPORT_FILE_NAME>
         <COLUMNS>
            <COLUMN>
               <NAME>CODDOC</NAME>
            </COLUMN>
            <COLUMN>
               <NAME>TIPDOC</NAME>
            </COLUMN>
         </COLUMNS>
      </RawRecipientDataExport>
   </Body>
</Envelope>
PROBANDO SI SE ENVIAN LOS DATOS A GIT           
*/
            const request = '<Envelope>\n' +
            '\t<Body>\n' +
            '\t<RawRecipientDataExport>\n' +

         
             '\t<EVENT_DATE_START>' + start_Date + '</EVENT_DATE_START>\n' +
            '\t<EVENT_DATE_END>' + end_Date  + '</EVENT_DATE_END>\n' +
            '\t<MOVE_TO_FTP</>\n' +
            
            '\t<EXPORT_FORMAT>' +1+'</EXPORT_FORMAT>\n' +
            '\n<EMAIL>' + email+ '</EMAIL>\n' +
            '\t</ALL_EVENT_TYPES/>\n' +

            '\t<RETURN_MAILING_NAME />\n' +
         '\t<RETURN_SUBJECT />\n' +
       '\t  <REPORT_ID />\n' +
      '\t   <EXPORT_FILE_NAME>' +feedback_html_acp +'</EXPORT_FILE_NAME>\n' +
         '\t<COLUMNS>\n' +
            '\t<COLUMN>\n' +
              '\t <NAME>'  + cod_Doc + '</NAME>\n' +
            '\t</COLUMN>\n' +
            '\t<COLUMN>\n' +
               '\t<NAME>' + tip_Doc +'</NAME>\n' +
           '\t </COLUMN>\n' +
         '\t</COLUMNS>' +
            '\t</RawRecipientDataExport>\n' +
            '\t</Body>\n' +
            '</Envelope>';

            this.appInsightsLog.log("Invocando API XML - ImportTable");

            let responseBulkImport = await this.service.XMLApi(accessToken, request);

            let response = "";
            xml2js.parseString(responseBulkImport.data, function (err, result) {
                response = result;
            });
            if (response.Envelope.Body[0].RESULT[0].SUCCESS[0] == "false") {
                this.appInsightsLog.log("Error - " + response.Envelope.Body[0].Fault[0].FaultString)
                //RE-INTENTO
                return false;
            }
            let jobId = response.Envelope.Body[0].RESULT[0].JOB_ID[0];

            this.appInsightsLog.log("ID Job generado : " + jobId);

         

        } catch (err) {
            this.appInsightsLog.log("Error" + err);
        }


    }
    
}

exports.FeedController = FeedController;