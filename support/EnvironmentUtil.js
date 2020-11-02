class EnvironmentUtil{
    
    static getAppSettings(name){
        return process.env[name];
    }
}

exports.EnvironmentUtil = EnvironmentUtil;