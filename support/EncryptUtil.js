
let Aes256 = require('aes256');
let Base64url  = require('base64url');
class EncryptUtil{
    
    static encryptUUID(key, text){
        return Aes256.encrypt(key, text);
    }
    static decryptUUID(key, encrypted){
        return Aes256.decrypt(key, encrypted);
    }

    static encodeBase64URL(value){
        return Base64url(value);
    }

    static decodeBase64URL(value){
        return Base64url.decode(value);
    }

}

exports.EncryptUtil = EncryptUtil;