const SyslogMessage = require('../../main/js/SyslogMessage');
const Severity = require('../../main/js/Severity')
const Facility = require('../../main/js/Facility')
const SDElement = require('../../main/js/SDElement')
const SDParam = require('../../main/js/SDParam')
const RFC3339DateFormat = require('../../util/RFC3339DateFormat');
const CachingReference = require('../../util/CachingReference');

let message = new SyslogMessage.Builder()
        .withSeverity(Severity.INFORMATIONAL)
        .withAppName('bulk-data-sorted')
        .withHostname('iris.teragrep.com')
        .withFacility(Facility.LOCAL0)
        .withSeverity(Severity.INFORMATIONAL)
        .withMsg('Todays lucky number is 17649276 Todays lucky number is 17649276') // Something probs for now with short message????
        //.withSDElement()
        .build()

let rfc5424message = message.toRfc5424SyslogMessage();
console.log(rfc5424message.toString());

        