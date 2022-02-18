/**
 * @description 
 * Syslog facility as defined in <a href="https://tools.ietf.org/html/rfc5424">RFC 5424 - The Syslog Protocol</a>.
 * @see 
 * Reference: https://tools.ietf.org/html/rfc5424
 * 
 */


'use strict'

const { Enumify } = require("../../lib/Enumify");

const internal = {};

/**
* syslog facility numerical code
*/
let _numericalCode;

/**
 * Syslog facility label aka textual code.
 * @check for the nonnull and undefined
 */
let _label;


class Facility extends Enumify {
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
    static LOCAL7 = new Facility(16, "LOCAL7")

    
   /**
     * @todo The constructor similar to Java for an enum type would be packae-private or
     * private access. it automatically creates the constants that are set at the starting of the enum body, 
     * However, this might need some workaround for the NodeJS World.
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

    static _ = this.closeEnum(); 

    //Mapping

    static facilityFromLabel = new HashMap();
    static facilityFromNumericalCode = new HashMap();

    
    

    /**
     * 
     * @returns syslog facility numerical code
     */
    getNumbericalCode(){
          return this._numericalCode;
    }

    /**
     * 
     * @returns syslog facility textual code aka label
     */
    getLabel(){
        return this._label;
    }

    /**
     * 
     * @param {number} numericalCode syslog facility numerical code
     * @returns Syslog facility, not
     * @throws Throw error the given numericalCode is not a valid Syslog facility numerical code 
     */
    fromNumericalCode(numericalCode){
        

    }

    /**
     * @param {enum} label syslog facility label
     * @returns 
     */
    fromLabel(label){

    }

    /**
     * @todo implement the similar to Java comparator 
     * @returns compare on {Faciltiy#numericalCode()}
     */
    comparator(){

    }

    toString() {
        return `Facility.${this._numericalCode},   Facility.${this._label}`;
      }

}
module.exports = Facility;
