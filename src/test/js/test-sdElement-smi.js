const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam');
const os = require('os')
const crypto = require('crypto')


let events_id_48577 = new SDElement("event_id@48577")
events_id_48577.addSDParam("hostname", "relp.teragrep.com")
const dateTimestamp = '2014-07-24T17:57:36+03:00';
const dateTimestamp2 = '2020-07-30T17:57:36+03:00'; // Supply the timestamp with valid date format
const dateFormat = new Date(dateTimestamp2);
const timestamp = (new Date(dateTimestamp)).getTime();

let event_id_48577, origin_48577;
    
      event_id_48577 = new SDElement("event_id@48577")
      event_id_48577.addSDParam("hostname",os.hostname())
      event_id_48577.addSDParam("uuid",crypto.randomUUID().toString())    
      event_id_48577.addSDParam("source", "source")
      event_id_48577.addSDParam("unixtime",Math.floor(Date.now() / 1000).toString())  

      origin_48577 = new SDElement("origin@48577")
    


    let message = new SyslogMessage.Builder()
       .withAppName('bulk-data-sorted') //validation
       .withTimestamp(timestamp) // 
       .withHostname(os.hostname())   
       .withFacility(Facility.USER) // user-defined 
       .withSeverity(Severity.WARNING) // Warining 
       .withProcId('8740') 
       .withMsg('Todays lucky number is 17649276 🤓') // 
       .withMsgId('ID47')
       .withSDElement(event_id_48577) 
       .withSDElement(origin_48577) 
       //.withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "HyväApplication")))  
       .withDebug(false) // Note this line set enable all the console log messages🤓
       .build()
      // return resolve (await message.toRfc5424SyslogMessage());
       //return rfc5424message;
  

/*    
let rfc5424message = (async ()=> {
    console.log('2')
    console.log('3')
    x = await message.toRfc5424SyslogMessage();
    console.log('3')
})();
*/
load()
async function load() {
    console.log('Loading...')
    rfc5424message = await message.toRfc5424SyslogMessage();
    console.log(rfc5424message.toString())
    console.log('Loading...END')
    return rfc5424message.toString()
}
       
