'use strict'
const { HashMap } = require('dsa.js');

let _numericalCode;
let _label;
 

class Severity {
     /**
     * Emergency: System is unusable, numerical code 0
     */
      static EMERGENCY = new Severity(0, "EMEGECY");
      /**
       * Alert: Action must be taken immediately
       */
      static ALERT = new Severity(1, "ALERT");
       /**
       * Critical: Critical conditions, numerical code 2
       */
      static CRITICAL = new Severity(2, "CRITICAL");
      /**
       * Error: Error conditions, numerical code 3
       */
      static ERROR = new Severity(3, "ERROR");
       /**
       * Warning: Warning conditions, numerical code 4
       */
      static WARNING = new Severity(4, "WARNING");
      /**
       * Notice: Normal but significant conditions, numerical code 5
       */
      static NOTICE = new Severity(5, "NOTICE");
       /**
       * Informational: Informational messages, numerical code 6
       */
      static INFORMATIONAL = new Severity(6, "INFORMATIONAL");
      /**
       * Debug: Debug level messages, numerical code 7
       */
      static DEBUG = new Severity(7, "DEBUG");
      
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

    static severityFromLabel = new HashMap();
    static severityFromNumericalCode = new HashMap();

    getNumericalCode(){
        return this._numericalCode;
    }

    getLabel(){
        return this._label;
    }

    /**
     * 
     * @param {number} numericalCode 
     * @returns {} severity 
     */
    static fromNumericalCode(numericalCode){
        let severity = this.severityFromNumericalCode.get(numericalCode);
        if(severity == null){
            throw new Error("Invalid Severity "+ numericalCode);
        }
        return severity;
    }


    /**
     * 
     * @param {string} label 
     * @returns 
     */
    static fromLabel(label){

        if((label == null || label == undefined)){
            return null;
        }
        let severity = this.severityFromLabel.get(label);
        if(severity == null){
            throw new Error("Invalid severity "+ label);
        }
        return severity;
    }

    //Mapping
 
    static setByseverityNumericalCode(){
        let numericalCodeArray = [];
        let severity = Object.values(Severity);
        for(let numericalCode in Object.keys(Severity)){
            numericalCodeArray.push(parseInt(numericalCode));
        }    
       
        for(let i = 0; i < severity.length; i++){
            if((numericalCodeArray[i]  != undefined) && (severity[i] != undefined)){
               // console.log(numericalCodeArray[i], facility[i]);
                this.severityFromNumericalCode.set(numericalCodeArray[i], severity[i]);
            }
        }
    }

   
    static setByseverityLabel(){
        let labels = Object.keys(Severity) // Key is the label
        let severity = Object.values(Severity);
        //console.log(labels)
        //console.log(severity)
        for(let i = 0; i < labels.length; i++){
            //console.log(labels[i], severity[i]);
            this.severityFromLabel.set(labels[i], severity[i]);   
        }
    }

    //Fill the hashmap 
    static fillEnum(){
        this.setByseverityLabel();
        this.setByseverityNumericalCode();
    }

    /**
     * 
     * @param {*} severity1 
     * @param {*} severity2 
     */
     static compare(severity1, severity2){
        if(severity1 instanceof Severity && severity2 instanceof Severity){
            if(severity1._numericalCode === severity2._numericalCode){
                return 0;
            }
            else if(severity1._numericalCode > severity2._numericalCode){
                return 1;
            }
            else if(severity1._numericalCode < severity2._numericalCode){
                return -1;
            }
            else {
                throw new Error("There might be exceptional situation");
            }
        }
    }
}
Object.defineProperty(Severity, 'severityFromLabel', {
    enumerable: false
});

Object.defineProperty(Severity, 'severityFromNumericalCode',{
    enumerable: false
});
module.exports = Severity;
