const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam');
const CharArrayWriter = require('../../lib/CharArrayWriter');



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
        .withMsg('Don’t test it as NÀSÀ Àpplication') // 
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Àpplication"))) //Updated support for UTF-8 
        .build()


let rfc5424message;

 async function load() {
    console.log('Loading...')
    rfc5424message = await message.toRfc5424SyslogMessage();
    console.log(rfc5424message.toString())
    return rfc5424message
}

let mes = load(); 
