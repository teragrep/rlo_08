/**
 * Instructions:
 * 
 * install the RLP_02 package - Configuration might need more tune up in the RLP_02 or RLO_08 component 
 * 
 * @todo Ok the current fix, which is returning the buffer instead of string, works with relp server, however there is some patchy needed,
 * 1 -  Fix the import of rlp_02 scoped package in a clean way, "cannot find module @teragrep/rlp_02"  
 * 
 * 
 */

var config = require('dotenv');
//const {RelpBatch, RelpConnection, RelpRequest, RelpWindow} = require("@teragrep/rlp_02"); //import of rlp_02 scoped package in a clean way
const RelpConnection = require('@teragrep/rlp_02/src/main/js/RelpConnection')
const RelpBatch = require('@teragrep/rlp_02/src/main/js/RelpBatch');
const async = require('async')
const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam');



let relpConnection = new RelpConnection();
let host = '127.0.0.1';
let port = 1337; 
let cfePort = 1601;


async.waterfall(
    [
		function init(setConnect) {
            setConnect(null, cfePort, host)
        },
		connect,
        load,
        commit,
        disconnect

    ],
    function (err) {
        if(err) {
            console.log(err);
        }
        else {
            console.log('No Error')
        }
    }
);

async function connect() {
    let conn = await relpConnection.connect(cfePort, host);	
    return conn;
}

async function disconnect(state) {
if(state){
     await relpConnection.disconnect();
}
else {
    console.log('Check the connection...')
}

}

let data = Buffer.from('<164>1 2022-05-03T07:58:30+03:00 iris.teragrep.com bulk-data-sorted 8740 ID47 [exampleSDID@32473 iut="3" eventSource="Application"] Todays lucky number is 17649276\n', 'ascii');

let message = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted') 
        //.withTimestamp(timestamp) // In case if the timestamp disabled, it will go with system timestamp.
        .withHostname('iris.teragrep.com') 
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740') 
        .withMsgId('ID47')
        .withMsg('Todays lucky number is 17649276') // '\n' should be placed 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
        .build()


const dateTimestamp = '2003-10-11T22:57:36+03:00';
const timestamp = (new Date(dateTimestamp)).getTime();
let message2 = new SyslogMessage.Builder()
        .withAppName('su')
        .withTimestamp(timestamp)
        .withHostname('mymachine.example.com')
        .withFacility(Facility.AUTH)
        .withSeverity(Severity.CRITICAL)
        .withProcId('ID47')
        .withMsg('su root failed for lonvick on /dev/pts/8')
        .build()

let dataPacket1, dataPacket2; 

async function load() {
    dataPacket1 = await message.toRfc5424SyslogMessage(); // return the buffer fits but not string becuase our RLP_02 >>> RelpRequest constructor 
    dataPacket2 = await message2.toRfc5424SyslogMessage();
}





function commit(){
    return new Promise(async(resolve, reject) => {
        let relpBatch = new RelpBatch();
        relpBatch.insert(dataPacket1);
        relpBatch.insert(data);
        relpBatch.insert(dataPacket1);
        relpBatch.insert(dataPacket1);
        
        let resWindow = await relpConnection.commit(relpBatch);
        console.log('After Batch-1 Completion....', resWindow)
            
            
        let notSent = (resWindow === true) ? true : false; //Test purpose 
        
        while(notSent){           
                        
            let res = await relpBatch.verifyTransactionAllPromise();  //                             
            if(res){
                notSent = false;
                console.log('VerifyTransactionAllPromise......', res);
                resolve(true);
                }
                else{
                    reject(false);
                }                              
        }    
        
        let relpBatch2 = new RelpBatch();
        relpBatch2.insert(dataPacket2);
        relpBatch2.insert(dataPacket2);        
        relpConnection.commit(relpBatch2);

        return resolve(true);
    })  
}