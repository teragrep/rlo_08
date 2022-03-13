/**
 *  @todo: Please note that mvn build still showing SyntaxError: Unexpected token '{'
 *     at wrapSafe (internal/modules/cjs/loader.js:1001:16), however running the test cases
 *     in the node engine produce the right output. 8->
 *  @comment due to the above mentioned reason, this test is commented. Same apply for the Severity class as well.
 *  :|
 * 
 * 
 */

/*
const Facility = require('../../main/js/Facility')

let kern = Facility.ALERT;

console.log(kern.getNumericalCode());
console.log(kern.getLabel())

//console.log(Facility.facilityNumericalCode());
let numericalCode = 10;
let invalidnumericalCode1 = 30;
let invalidnumericalCode2 = '10'; // does not accept the string 
let facility = Facility.fromNumericalCode(numericalCode);
let invalidLabel = "clock";
let label = "CLOCK";

console.log(facility);

//let facilityInvalidLabel = AbstractFacility.fromLabel(invalidLabel);
let facilityLabel = Facility.fromLabel(label);
console.log(facilityLabel);
//console.log(facilityInvalidLabel);
*/