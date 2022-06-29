// Disable the log messages 

require('dotenv').config();

const env = process.env.NODE_ENV;
let log = console.log;

log = (function (env) {
    if(env == "RELP_DEBUG"){ // 
        console.log('Disable the log messages  on the 👀', env);
        return console.log = () => {};
        //return () => {}
    }
    return (...args) => {
        console.log(process.env.NODE_ENV)
        console.log(...args)
    }
})(process.env.NODE_ENV)

module.exports =  log

