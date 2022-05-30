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
/**
 * According to  the RFC5424 defines  max length and ASCII (33 - 126) for appName, hostname, procId, msgId 
 */
let invalideMessage = new SyslogMessage.Builder()
                .withAppName('bulk-data-sorted ') //invalid because it has the SP char which is not applicable for the appname and tested for the NULL value
                .withTimestamp(timestamp) 
                .withHostname('My.home.servers.are.all.Icelandic.volcanoes.Finnish.Forests.Norway.Lakes.Artic.Circles') //invalid
                .withFacility(Facility.KERN)
                .withSeverity(Severity.INFORMATIONAL)
                .withProcId('8740') //validatied for the PRINTUSASCII format
                .withMsgId('ID47')
                .withMsg('Todays lucky number is 17649276') // Fixed
                //.withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"))) // Fix the space before the previous 
                //.withDateTimestamp(dateFormat)
                .build()



let rfc5424message;

 async function load() {
    rfc5424message = await message.toRfc5424SyslogMessage();
    console.log(rfc5424message.toString());
}

load(); 

// disable for the build

let invalidRFCMessage;
/*
async function invalidMessageLoad() {
        invalidRFCMessage = await invalideMessage.toRfc5424SyslogMessage();  
        console.log(invalidRFCMessage)    
}

invalidMessageLoad();
*/