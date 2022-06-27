// Disable the log messages 

require('dotenv').config();

const env = process.env.NODE_ENV;

const log = (function (env) {
    if(env == "RELP_DEBUG"){
        return console.log = () => {};
        //return () => {}
    }
    return (...args) => {
        console.log(process.env.NODE_ENV)
        console.log(...args)
    }
})(process.env.NODE_ENV)

module.exports =  log

/*
console.log(process.env.NODE_ENV);
console.log = function() {};
*/

