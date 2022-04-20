const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam');
const RFC3339DateFormat = require('../../util/RFC3339DateFormat');


const dateTimestamp = '2014-07-24T17:57:36+03:00';
const dateTimestamp2 = '2020-07-30T17:57:36+03:00'; // Supply the timestamp with valid date format
const dateFormat = new Date(dateTimestamp2);
const timestamp = (new Date(dateTimestamp)).getTime();

let message = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted')
        //.withTimestamp(timestamp) 
        .withHostname('iris.teragrep.com') //null for the hostname does not produce the expected message, however, getData() get the hostname????
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        //.withProcId('8740')
       // .withMsgId('ID47')
        .withMsg('Todays lucky number is 17649276') // Fixed
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"), new SDParam("eventID", "1011"))) // Fix the space before the previous 
        .withDateTimestamp(dateFormat)
        .build()


let rfc5424message;
 async function load() {
    rfc5424message = await message.toRfc5424SyslogMessage();
    console.log(rfc5424message);
}

load();


//let rfc5424promiseMessage = message.toPromiseAll();
//console.log('This is a rfc5424 message: ',rfc5424message.toString()); // this should 
//console.log(message.getFacility())
//console.log(RFC3339DateFormat(dateTimestamp));

        