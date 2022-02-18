'use strict'

const Enumify = require('../../lib/Enumify')

const internal = {};

let _numericalCode;
let _label;

class AbstractFacility extends Enumify.Enumify {
     /**
     * Kernal messages, numerical code 0
     */
      static KERN = new AbstractFacility(0, "KERN");
      /**
       * user-level messages, numerical code 1
       */
      static USER = new AbstractFacility(1, "USER");
       /**
       * Mail system messages, numerical code 2
       */
      static MAIL = new AbstractFacility(2, "MAIL");
      /**
       * system daemon messages, numerical code 3
       */
      static DAEMON = new AbstractFacility(3, "DAEMON");
       /**
       * security/authorization messages, numerical code 4
       */
      static AUTH = new AbstractFacility(4, "AUTH");
      /**
       * syslog messages, numerical code 5
       */
      static SYSLOG = new AbstractFacility(5, "SYSLOG");
       /**
       * Line Printer Subsystem messages, numerical code 6
       */
      static LPR = new AbstractFacility(6, "LPR");
      /**
       * Ntowrk News Subsystem messages, numerical code 7
       */
      static NEWS = new AbstractFacility(7, "NEWS");
       /**
       * Unix-to-Unix Copy messages, numerical code 8
       */
      static UUCP = new AbstractFacility(8, "UUCP");
      /**
       * Clock Daemon messages, numerical code 9
       */
      static CRON = new AbstractFacility(9, "CRON");
       /*
       * non-system security/authorization messages, numerical code 10
       */
      static AUTHPRIV = new AbstractFacility(10, "AUTHPRIV");
      /**
       * FTP daemon messages, numerical code 11
       */
      static FTP = new AbstractFacility(11, "FTP");
       /**
       * NTP messages, numerical code 12
       */
      static NTP = new AbstractFacility(12, "NTP");
      /**
       * Log audit messages, numerical code 13
       */
      static AUDIT = new AbstractFacility(13, "AUDIT");
       /**
       *  Log alert messages, numerical code 14
       */
      static ALERT = new AbstractFacility(14, "ALERT");
      /**
       * clock daemon messages, numerical code 15
       */
      static CLOCK = new AbstractFacility(15, "CLOCK");
       /**
        *  reserved for local use, numerical code 16
        */
      static LOCAL0 = new AbstractFacility(16, "LOCAL0")
       /**
        *  reserved for local use, numerical code 17
        */
      static LOCAL1 = new AbstractFacility(17, "LOCAL1")
        /**
        *  reserved for local use, numerical code 18
        */
      static LOCAL2 = new AbstractFacility(18, "LOCAL2")
       /**
        *  reserved for local use, numerical code 19
        */
      static LOCAL3 = new AbstractFacility(19, "LOCAL3")
        /**
        *  reserved for local use, numerical code 20
        */
      static LOCAL4 = new AbstractFacility(20, "LOCAL4")
       /**
        *  reserved for local use, numerical code 21
        */   
      static LOCAL5 = new AbstractFacility(21, "LOCAL5")
       /**
        *  reserved for local use, numerical code 22
        */
      static LOCAL6 = new AbstractFacility(22, "LOCAL6")
        /**
        *  reserved for local use, numerical code 23
        */
      static LOCAL7 = new AbstractFacility(16, "LOCAL7")
    

      /**
       * @param {number} numericalCode 
       * @param {enum} label 
       */
    constructor(numericalCode, label) {
        if((label != null) && (label != undefined)){
            super();
            this._numericalCode = numericalCode;
            this._label = label;
       } else {
           throw new Error("Should be NONNULL but Null detected");
       }
    }

    static _ = this.closeEnum(); // TypeScript: Color.closeEnum()
    //Mapping
    static facilityValues(){
        for(const facility in AbstractFacility){
            if(facility !== undefined){
               console.log(facility)
            }
        
        }
    }
}
module.exports = AbstractFacility;
console.log(AbstractFacility.facilityValues());