/**
 *  @todo: Please note that mvn build still showing SyntaxError: Unexpected token '{'
 *     at wrapSafe (internal/modules/cjs/loader.js:1001:16), however running the test cases
 *     in the node engine produce the right output. 8->
 *  @comment due to the above mentioned reason, this test is commented. Same apply for the Facility class as well.
 *  :|
 * 
 * 
 */

const Severity = require('../../main/js/Severity')

let Emergency = Severity.EMERGENCY;

console.log(Emergency.getNumericalCode());
console.log(Emergency.getLabel())
