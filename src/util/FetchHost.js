const os = require('os');

/**
 * 
 * @returns 
 */

module.exports = function fetchHost(){
    try {
        return new Promise((resolve, reject) => {
            resolve(os.hostname());
        }) ;
    } catch(e){ 
        let NILVALUE = new String('-');
        return NILVALUE.valueOf();    
    }
}
