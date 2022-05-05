const CharArrayWriter = require('../../lib/CharArrayWriter')
const buffer = require('buffer');

//console.log('Max size of the buffer ', buffer.constants.MAX_LENGTH);
//console.log('MAX String Length ', buffer.constants.MAX_STRING_LENGTH)

let charArrayWriter = new CharArrayWriter(3);
charArrayWriter.append('a');
charArrayWriter.append('b');
charArrayWriter.append('c');
charArrayWriter.append('word');
console.log(charArrayWriter);
console.log(charArrayWriter.toString())
console.log('------------------------------')


