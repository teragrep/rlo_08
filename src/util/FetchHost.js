const os = require('os');

/**
 * 
 * @returns 
 */

module.exports = function fetchHost(){
    try {
        //console.log('This is from fetchHost '+os.hostname());
        return new Promise((resolve, reject) => {
            resolve(os.hostname());
        }) ;
    } catch(e){ 
        let NILVALUE = new String('-');
        return NILVALUE.valueOf();    
    }
}