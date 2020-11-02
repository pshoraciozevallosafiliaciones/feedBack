const { Service } = require("./Service");
const EnvironmentUtil = require('../support/EnvironmentUtil.js').EnvironmentUtil;
const constants = require('../support/Constants.js');
class ReadUtil {

    static getParseContentHub(response) {
        this.environmentUtil = EnvironmentUtil;
        var itemsJSon = [];
        let imgUrl = this.environmentUtil.getAppSettings(constants.URL_IMG_CH);
        response.data.documents.forEach(function (item) {
            itemsJSon.push({
                nombre: item.document.name,
                titulo: item.document.elements.tituloPromo.value,
                descripcion: item.document.elements.descuentoPromo.value,
                imagen: imgUrl + item.document.elements.imagenDeLaPromo.url,
                legal: item.document.elements.legalDeLaPromo.value
            })
        });

        return itemsJSon;
    }

    static getHeaderRules(id, content) {

        let promo = "PROMO";

        return "" + 
        "<Envelope>" +
            "<Body>" +
                "<ReplaceDCRuleset>" +
                    "<RULESET_ID>" + id + "</RULESET_ID>" +
                    "<CONTENT_AREAS>" +
                        "<CONTENT_AREA name=\"PROMO\" type=\"BODY-HTML\">" +
                            "<DEFAULT_CONTENT name=\"Default.PROMO\">" +
                                "<![CDATA[]]>" +
                            "</DEFAULT_CONTENT>" +
                        "</CONTENT_AREA>" +
                    "</CONTENT_AREAS>" +
                    "<RULES>" +
                        content +
                    "</RULES>" +
                "</ReplaceDCRuleset>" +
            "</Body>" +
        "</Envelope>";
        // return "" +
        // "<Envelope>" + 
        //     "<Body>" +
        //         "<ReplaceDCRuleset>" +
        //             "<RULESET_ID>" + id + "</RULESET_ID>" +
        //             "<CONTENT_AREAS>" +
        //                 "<CONTENT_AREA name=\"PROMO\" type=\"BODY-HTML\">" +
        //                     "<DEFAULT_CONTENT name=\"Default.PROMO\">" +
        //                         <![CDATA[OFERTA1 TITULO]]>
        //                     </DEFAULT_CONTENT>
        //                 </CONTENT_AREA>
        //             </CONTENT_AREAS>
        //             <RULES></RULES>
        //         </ReplaceDCRuleset>
        //     </Body>
        // </Envelope>

    }

    static getXmlRules(columns, JsonContentHub, campo) {
        var rules = "";
        columns.forEach(function (column) {
            JsonContentHub.forEach(function (itemContentHub) {
                var num = Math.floor(Math.random() * 90000) + 10000;
                var rule =
                    '<RULE>' +
                        '<RULE_NAME>' + itemContentHub.nombre + num + '</RULE_NAME>' +
                        '<PRIORITY>' + num + '</PRIORITY>' +
                        '<CRITERIA>' +
                            '<EXPRESSION criteria_type="relational_table">' +
                                '<OPERATOR>match</OPERATOR>' +
                                '<ID>10924678</ID>' +
                                '<RT_EXPRESSIONS>' +
                                    '<EXPRESSION criteria_type="rt_profile">' +
                                        '<OPERATOR>is equal to</OPERATOR>' +
                                        '<COLUMN>' + column + '</COLUMN>' +
                                        '<VALUE><![CDATA[' + itemContentHub.nombre + ']]></VALUE>' +
                                    '</EXPRESSION>' +
                                '</RT_EXPRESSIONS>' +
                            '</EXPRESSION>' +
                        '</CRITERIA>' +
                        '<CONTENTS>' +
                            '<CONTENT name="Area1.PROMO" content_area="PROMO"><![CDATA[' + itemContentHub[campo] + ']]></CONTENT>' +
                        '</CONTENTS>' +
                    '</RULE>';
                rules = rules + rule;
            });
        })
        return rules
    }

    // static getRequest(/*service = new Service(), */ids = [], columns, jsonContentHub, campo/*, token*/) {
    //     ids.forEach(id => {
    //         var xmlRules = this.getXmlRules(columns, jsonContentHub, campo);
    //         var request = this.getHeaderRules(id, xmlRules);
    //         console.log(request);
    //         // service.XMLApi(token, request);
    //         return request;
    //     });
    // }
}

exports.ReadUtil = ReadUtil;