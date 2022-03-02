const SDParam = require('../../main/js/SDParam');


let SDParamtimZoneValid= new SDParam('timeZone', '0');

//Note value contains SPACE, invalid SDParam
//let SDParamTimeZoneInvalid = new SDParam('timeZone ', '0') 

let SDParamTimeZoneValidDup = new SDParam('timeZone', '1')
console.log(SDParamtimZoneValid.hashCode());
console.log(SDParamTimeZoneValidDup.hashCode());
console.log(SDParamTimeZoneValidDup.getClass());
console.log(SDParamtimZoneValid.toString());

