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
/**
 * Perf ensure the compnonet speed, stability & scalability under the workload.
 * Time duration take to 
 * 
 */
let msg = 'Syslog messages are used to report levels of Emergency and Warnings with regards to software or hardware issues. To illustrate, a system restart will be sent through the Notice level. A system reload will be sent through the Informational level. If debug commands are outputted, it is conveyed through the Debug level'
let message = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted') 
        .withTimestamp(timestamp) 
        .withHostname('iris.teragrep.com') 
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740') 
        .withMsgId('ID47')
        .withMsg('Todays lucky number is 17649276') 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) 
        .build()

let message1 = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted') 
        .withTimestamp(timestamp) 
        .withHostname('iris.teragrep.com') 
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740') 
        .withMsgId('ID47')
        .withMsg('Todays lucky number is 17649276') 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) 
        .build()

let message2 = new SyslogMessage.Builder()
        .withAppName('bulk-data-sorted') 
        .withTimestamp(timestamp) 
        .withHostname('iris.teragrep.com') 
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withProcId('8740') 
        .withMsgId('ID47')
        .withMsg(msg) 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
        .build()





let rfc5424message, rfc5424message1, rfc5424message2;


 async function load() {
    rfc5424message = await message.toRfc5424SyslogMessage();
    rfc5424message1 = await message1.toRfc5424SyslogMessage();
    rfc5424message2 = await message2.toRfc5424SyslogMessage()

    console.log(rfc5424message);
    console.log('-----------------1---------------');
   // console.log(rfc5424message1);
    console.log('-----------------2---------------');
    //console.log(rfc5424message2);
}

load(); 
