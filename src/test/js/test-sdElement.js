const SDParam = require('../../main/js/SDParam');
const SDElement = require('../../main/js/SDElement')

let sdParam1 = new SDParam('iut', '3');

let sdName = 'myId@private';
let SDElement1 = new SDElement(sdName, sdParam1);;
SDElement1.addSDParam('eventSource','Application');
SDElement1.addSDParam('eventID','1011');

