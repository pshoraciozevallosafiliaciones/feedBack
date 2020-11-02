const axios = require('axios');
const qs = require("querystring");
const constants = require('./Constants.js');
const EnvironmentUtil = require('./EnvironmentUtil.js').EnvironmentUtil;
const moment = require("moment");
const DOMParser = require('xmldom').DOMParser;

class Service {
    constructor(context) {
        this.environmentUtil = EnvironmentUtil;
        this.context = context;
    }

    async GetToken() {
        this.context.log("Getting accessToken - Acoustic Campaign")
        let response = await axios({
            method: 'post',
            responseType: 'json',
            url: this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_URL),
            data: qs.stringify({
                grant_type: this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_GRANT_TYPE),
                client_id: this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_CLIENT_ID),
                client_secret: this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_CLIENT_SECRET),
                refresh_token: this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_REFRESH_TOKEN)
            }),
            // data: {
            //     'grant_type': this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_GRANT_TYPE),
            //     'client_id': this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_CLIENT_ID),
            //     'client_secret': this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_CLIENT_SECRET),
            //     'refresh_token': this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_REFRESH_TOKEN)
            // },
            // headers: {
            //     'Content-Type': this.environmentUtil.getAppSettings(constants.API_ACP_OAUTH_CONTENT_TYPE)
            // }
        }).catch(function (err) {
            return err;
        });
        return response;
    }

    async XMLApi(accessToken, request) {
        // let parser = new DOMParser();
        // let xml = parser.parseFromString(request,"text/xml");

        // // const xml = builder.create(request);
        // let archivo = new Blob([request], {type: 'text/xml'});
        // archivo = new File(archivo, 'prueba.xml');

        let response;
        this.context.log("Invoking XMLAPI - Acoustic Campaign")
        response = await axios({
            method: 'post',
            url: this.environmentUtil.getAppSettings(constants.API_ACP_URL_APIXML),
            data: request, //archivo, //xml, //request,
            headers: {
                'Content-Type': this.environmentUtil.getAppSettings(constants.API_ACP_CONTENT_TYPE),
                'Authorization': "Bearer " + accessToken
            }
        }).catch(function (err) {
            return err;
        });
        if (response.status == 401) {
            let responseOAuth = await this.GetToken();
            response = await this.XMLApi(responseOAuth.data.access_token, request);
        }
        return response;
    }

    async contentHubApi() {
        this.context.log("Content-hub api")
        let response = await axios({
            method: 'get',
            url: 'https://content-us-2.content-cms.com/api/9b3f67ef-5a9f-4acc-8ce8-bcc27fa681c7/delivery/v1/search?q=type:"ct_mkt_ctx_promos"&fl=document:[json]',
            auth: { username: 'apikey', password: 'TLVMs4Tm0ne-_r007dN52ckR0xP0tMDJRXQZ3YJYbKWH' }
        }).catch(function (err) {
            return err;
        });
        return response;
    }
}

exports.Service = Service;