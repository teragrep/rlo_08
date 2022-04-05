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
        .withTimestamp(timestamp) // TODO: Handling the DateTimestamp 
        //.withHostname('iris.teragrep.com') //null for the hostname does not produce the expected message, however, getData() get the hostname????
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withMsg('Todaysé lucky number is 17649276 Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas ') // Something probs for now with short message????
        .withSDElement(new SDElement("exampleSDID@32473", new SDParam("iut", "3"), new SDParam("eventSource", "Application"), new SDParam("eventID", "1011")))
        .withDateTimestamp(dateFormat)
        .build()


 async function load() {
    let rfc5424message = await   message.toRfc5424SyslogMessage();
}
//let x = load();
let rfc5424message = message.toRfc5424SyslogMessage();
console.log('This is a rfc5424 message: ',rfc5424message.toString());
//console.log(message.getFacility())
//console.log(RFC3339DateFormat(dateTimestamp));

        