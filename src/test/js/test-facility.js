const Facility = require('../../main/js/Facility')

let kern = Facility.ALERT;

console.log(kern.getNumericalCode());
console.log(kern.getLabel())
//console.log(Facility.facilityNumericalCode());
console.log(Facility.fillEnum());
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