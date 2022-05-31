/**
 * @todo:
 * 1- Load
 * Speed, RT, stability, resource usage like memory utilization, data transfer velocity, network bandwidith usage. 
 * There are some possible performance boolenecks. related to #ISS-10,  incosistencies or like  memory utilization issue.
 * Matrix of the Memory allocation, CPU, network 
 * 
 * 
 * Build test case around to potential data transfer rate & network bandwidith RELP Server
 * Objective: Obtain the average speed of data being sent to the RELP Server on the other end over the last few seconds, is this possible??
 * data transfer rate, 
 * 🔬 Possible integration of the NodeJS Inbuilt mechanism - PerfHooks 
 *  1 - Env config include HW, SW, Network
 *  2 - Processor & Memory Usage - Done
 *    - Applicalbe Disk time, bandwidth, private bytes, 
 * 
 * 
 */

/*
 const SyslogMessage = require('../../main/js/SyslogMessage');
 const Severity = require('../../main/js/Severity')
 const Facility = require('../../main/js/Facility')
 const SDElement = require('../../main/js/SDElement')
 const SDParam = require('../../main/js/SDParam');
 
 
 
 const dateTimestamp = '2014-07-24T17:57:36+03:00';
 const dateTimestamp2 = '2020-07-30T17:57:36+03:00'; // Supply the timestamp with valid date format
 const dateFormat = new Date(dateTimestamp2);
 const timestamp = (new Date(dateTimestamp)).getTime();
 
 let message = new SyslogMessage.Builder()
         .withAppName('bulk-data-sorted') //valid
         .withTimestamp(timestamp) // In case if the timestamp disabled, it will go with system timestamp.
         .withHostname('iris.teragrep.com') //valid
        
         .withFacility(Facility.LOCAL0)
         .withSeverity(Severity.INFORMATIONAL)
         .withProcId('8740') //validatied for the PRINTUSASCII format
         .withMsgId('ID47')
         .withMsg('Todays lucky number is 17649276') // Fixed
         .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
         .build()
 
  
 
 let rfc5424message;
 
  async function load() {
     rfc5424message = await message.toRfc5424SyslogMessage();
     console.log(rfc5424message.toString());
 }
 
 load(); 
 
*/

var config = require('dotenv');
const RelpConnection = require('@teragrep/rlp_02/src/main/js/RelpConnection')
const RelpBatch = require('@teragrep/rlp_02/src/main/js/RelpBatch');
const async = require('async')
const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam');
const { PerformanceObserver, performance } = require('node:perf_hooks')

const observer = new PerformanceObserver((items) => {
        console.log(items.getEntries()[0].duration);
        performance.clearMarks();
});

observer.observe({ type: 'measure' });
performance.measure('Performance measure start NOW.....');

let relpConnection = new RelpConnection();
let host = '127.0.0.1';
let port = 1337; 
let cfePort = 1601;

performance.mark('A')
async.waterfall(
    [


	function init(setConnect) {
              
                setConnect(null, cfePort, host);
        },
	connect,
       // performance.measure('connect', 'A'), // Disable for the execution, but should . 
        load,
       // performance.mark('B'),
       // performance.measure('Load', 'A', 'B'),
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
/**
 * @todo Evaluate the response time 
 * @returns 
 */
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


 