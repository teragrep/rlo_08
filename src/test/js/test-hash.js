const { HashMap } = require("dsa.js");

const hashMap = new HashMap();
hashMap.set('cat', 2);
hashMap.set('pet', 8);
hashMap.set('rat', 7);
hashMap.set('dog', 1);

console.log(hashMap.get('rat'))