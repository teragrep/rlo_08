/**
 * 
 * Relp Output component RLO_08  
 * Copyright (C) 2021, 2022  Suomen Kanuuna Oy
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.  
 */

/**
 * 
 * @description 
 * Syslog facility as defined in <a href="https://tools.ietf.org/html/rfc5424">RFC 5424 - The Syslog Protocol</a>.
 * @see 
 * Reference: https://tools.ietf.org/html/rfc5424
 * 
 */

 'use strict'
 const { HashMap } = require('dsa.js');
 
 let _numericalCode;
 let _label;
  
 
 class Facility {
      /**
      * Kernal messages, numerical code 0
      */
       static KERN = new Facility(0, "KERN");
       /**
        * user-level messages, numerical code 1
        */
       static USER = new Facility(1, "USER");
        /**
        * Mail system messages, numerical code 2
        */
       static MAIL = new Facility(2, "MAIL");
       /**
        * system daemon messages, numerical code 3
        */
       static DAEMON = new Facility(3, "DAEMON");
        /**
        * security/authorization messages, numerical code 4
        */
       static AUTH = new Facility(4, "AUTH");
       /**
        * syslog messages, numerical code 5
        */
       static SYSLOG = new Facility(5, "SYSLOG");
        /**
        * Line Printer Subsystem messages, numerical code 6
        */
       static LPR = new Facility(6, "LPR");
       /**
        * Ntowrk News Subsystem messages, numerical code 7
        */
       static NEWS = new Facility(7, "NEWS");
        /**
        * Unix-to-Unix Copy messages, numerical code 8
        */
       static UUCP = new Facility(8, "UUCP");
       /**
        * Clock Daemon messages, numerical code 9
        */
       static CRON = new Facility(9, "CRON");
        /*
        * non-system security/authorization messages, numerical code 10
        */
       static AUTHPRIV = new Facility(10, "AUTHPRIV");
       /**
        * FTP daemon messages, numerical code 11
        */
       static FTP = new Facility(11, "FTP");
        /**
        * NTP messages, numerical code 12
        */
       static NTP = new Facility(12, "NTP");
       /**
        * Log audit messages, numerical code 13
        */
       static AUDIT = new Facility(13, "AUDIT");
        /**
        *  Log alert messages, numerical code 14
        */
       static ALERT = new Facility(14, "ALERT");
       /**
        * clock daemon messages, numerical code 15
        */
       static CLOCK = new Facility(15, "CLOCK");
        /**
         *  reserved for local use, numerical code 16
         */
       static LOCAL0 = new Facility(16, "LOCAL0")
        /**
         *  reserved for local use, numerical code 17
         */
       static LOCAL1 = new Facility(17, "LOCAL1")
         /**
         *  reserved for local use, numerical code 18
         */
       static LOCAL2 = new Facility(18, "LOCAL2")
        /**
         *  reserved for local use, numerical code 19
         */
       static LOCAL3 = new Facility(19, "LOCAL3")
         /**
         *  reserved for local use, numerical code 20
         */
       static LOCAL4 = new Facility(20, "LOCAL4")
        /**
         *  reserved for local use, numerical code 21
         */   
       static LOCAL5 = new Facility(21, "LOCAL5")
        /**
         *  reserved for local use, numerical code 22
         */
       static LOCAL6 = new Facility(22, "LOCAL6")
         /**
         *  reserved for local use, numerical code 23
         */
       static LOCAL7 = new Facility(23, "LOCAL7")
     
 
       /**
        * @param {number} numericalCode 
        * @param {enum} label 
        */
     constructor(numericalCode, label) {
         if((label != null) && (label != undefined)){
             this._numericalCode = numericalCode;
             this._label = label;
        } else {
            throw new Error("Should be NONNULL but Null detected");
        }
     }
 
     static facilityFromLabel = new HashMap();
     static facilityFromNumericalCode = new HashMap();
 
     getNumericalCode(){
         return this._numericalCode;
     }
 
     getLabel(){
         return this._label;
     }
 
     toString() {
         return `Facility.${this._numericalCode},   Facility.${this._label}`;
       }
 
     /**
      * 
      * @param {number} numericalCode 
      * @returns {Facility} facility 
      */
     static fromNumericalCode(numericalCode){
        if(numericalCode > 0 && numericalCode <= 23){ // Check to avoid the HashMap conflicts
            //console.log(this.facilityFromNumericalCode)
            let facility = this.facilityFromNumericalCode.get(numericalCode);
            if(facility == null || facility == undefined){
                throw new Error("Invalid Facility "+ numericalCode);
            }
            return facility;
        }
        else{
            throw new Error("Invalid Facility "+ numericalCode);
        }
    }
 
 
     /**
      * 
      * @param {string} label 
      * @returns {Facility} facility 
      */
     static fromLabel(label){
 
         if((label == null || label == undefined)){
             return null;
         }
         let facility = this.facilityFromLabel.get(label);
         if(facility == null){
             throw new Error("Invalid facility "+ label);
         }
         return facility;
     }
 
     //Mapping
  
     static setByfacilityNumericalCode(){
         let numericalCodeArray = [];
         let facility = Object.values(Facility);
         for(let numericalCode in Object.keys(Facility)){
             numericalCodeArray.push(parseInt(numericalCode));
         }    
        
         for(let i = 0; i < facility.length; i++){
             if((numericalCodeArray[i]  != undefined) && (facility[i] != undefined)){
                // console.log(numericalCodeArray[i], facility[i]);
                 this.facilityFromNumericalCode.set(numericalCodeArray[i], facility[i]);
             }
         }
         return this.facilityFromNumericalCode;
     }
 
    
     static setByfacilityLabel(){
         let labels = Object.keys(Facility) // Key is the label
         let facility = Object.values(Facility);
         //console.log(labels)
         //console.log(facility)
         for(let i = 0; i < labels.length; i++){
             //console.log(labels[i], facility[i]);
             this.facilityFromLabel.set(labels[i], facility[i]);   
         }
     }
 
     /**
      * @version Tested with the node version v16.14.0 LTS Gallium, which supports to 
      * class static initialization block, this is a special feature of a class enable
      * more flexible initialization of static attributes.
      */
     //Fill the hashmap 
     static {
         this.facilityFromLabel = this.setByfacilityLabel();
         this.facilityFromNumericalCode = this.setByfacilityNumericalCode();
     }
 
     /**
      * 
      * @param {Facility} facility1 
      * @param {Facility} facility2 
      * @returns 
      */
      static compare(facility1, facility2){
         if(facility1 instanceof Facility && facility2 instanceof Facility){
             if(facility1._numericalCode === facility2._numericalCode){
                 return 0;
             }
             else if(facility1._numericalCode > facility2._numericalCode){
                 return 1;
             }
             else if(facility1._numericalCode < facility2._numericalCode){
                 return -1;
             }
             else {
                 throw new Error("There might be exceptional situation");
             }
         }
     }
 }
 Object.defineProperty(Facility, 'facilityFromLabel', {
     enumerable: false
 });
 
 Object.defineProperty(Facility, 'facilityFromNumericalCode',{
     enumerable: false
 });
 module.exports = Facility; 
