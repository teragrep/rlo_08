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

'use strict'

const { HashSet } = require("dsa.js");
const CachingReference = require("../../util/CachingReference");
const { RFC_3164, RFC_5424, RFC_5425 } = require("./MessageFormat");
const MessageFormat = require("./MessageFormat");
const FetchHost = require('../../util/FetchHost');
const RFC3339DateFormat = require("../../util/RFC3339DateFormat");
const StringBuilder = require('../../lib/StringBuilder');
const CharArrayWriter = require("../../lib/CharArrayWriter");
const SDSerializer = require("../../lib/SDSerializer");
const SDElement = require("./SDElement");

let _facility;
let _severity;
let _timestamp;
let _hostname;
let _appName;
let _procId;
let _msgId;
let _sdElements; //Set datastructure
let _msg; //charArrayWriter
let _debug;

/**
 * Syslog message as defined in <a href="https://tools.ietf.org/html/rfc5424">RFC 5424 - The Syslog Protocol</a>.
 * Also compatible with <a href="http://tools.ietf.org/html/rfc3164">RFC-3164: The BSD syslog Protocol</a>,
 * @link https://tools.ietf.org/html/rfc5424    
 * 
 * ಠ_ಠ 
 * 1 - Clean up, patch ups & doc
 * 2 - Performance test, RLP:02 integration test - Readme / how to 
 * 3 - TLS: Use the standard out. Make the How-to article,  RFC5425
 *  
 */
class SyslogMessage {

    static SP = ' ';
    static NILVALUE = '-';
    static rfc3339DateFormat = RFC3339DateFormat;
    static rfc3164DateFormat; // TODO: later
    static localhostNameReference = new CachingReference(FetchHost);  //  get the host name and refresh every 10ms
  
    
   

    /**
     * Builder pattern handler
     * 
     */
    constructor(build){
        this._facility = build._facility;
        this._severity = build._severity;
        this._timestamp = build._timestamp;
        this._hostname = build._hostname;
        this._appName = build._appName;
        this._procId = build._procId;
        this._msg = build._msg;
        this._msgId = build._msgId;
        this._sdElements = build._sdElements;
        this._debug = build._debug;
    }

    getFacility(){
        return this._facility;
    }

    setFacility(facility){
        this._facility = facility;
    }

    getSeverity(){
        return this._severity;
    }

    setSeverity(severity){
        this._severity = severity;
    }

    /**
     * 
     * @returns {Date} timestamp the Date object created using the timestamp (milliseconds)
     */
    getTimestamp(){
        return this_timestamp == null ? null : new Date(this._timestamp);
        
    }

    /**
     * @param {Date} 
     */
    setTimestamp(timestamp){
        if(timestamp instanceof Date){
            this._timestamp = timestamp == null ? null : timestamp.getTime();
        }
    }

    getHostname(){
        return this._hostname;
    }

    setHostname(hostname){
        this._hostname = hostname;
    }

    getAppName(){
        return _appName;
    }

    getPorcId(){
        return this._procId
    }

    setProcId(procId){
        this._procId = procId;
        return this;
    }

    getMsg(){
        return this._msg;
    }

    setMsg(msg){
        this._msg = msg;
    }

    getMsgId(){
        return this._msgId;
    }

    setMsgId(msgId){
        this._msgId = msgId;
    }

    getSDElements(){
        let ssde = this._sdElements;
        if(ssde == null){
            ssde = new HashSet(); 
        }
        return ssde;
    }

    setSDElements(ssde){
        this._sdElements = ssde; 
    }

    getDebug(){
        return this._debug;
    }

    setDebug(flag){
        this._debug = flag;
    }

    /**
     * Builder pattern implementation
     */
    static get Builder(){
        class Builder{
            constructor(){

            } //Init

            withFacility(facility){
                this._facility = facility;
                return this;
            }

            withSeverity(severity){
                this._severity = severity;
                return this;
            }

            /**
             * 
             * @param {Number} timestamp 
            */
            withTimestamp(timestamp){
                if(isNaN(timestamp)){
                    throw new Error('Not a Number. Unsupported Format');
                }
                else {
                    this._timestamp = timestamp;
                    return this;
                }
            }

            /**
             * 
             * @param {Date} timestamp 
             */
            withDateTimestamp(timestamp){
                if(timestamp instanceof Date){
                    if(timestamp == null){
                        this._timestamp = null;
                        return this;
                    }
                    else {
                        timestamp = new Date(timestamp);
                        this._timestamp = timestamp == null ? null : timestamp.getTime();
                        return this;
                    }
                }
                return this;
            }

            withHostname(hostname){
                this._hostname = hostname;
                return this;
            }

            withAppName(appName){
                this._appName = appName;
                return this;
            }

            withProcId(procId){
                this._procId = procId;
                return this;
            }

            /**
             * 
             * @param {*} msg 
             * @returns 
             */
            withMsg(msg){
                this._msg = msg;
                return this;
            }

            withMsgId(msgId){
                this._msgId = msgId;
                return this;
            }
            
            withSDElement(sde){
                if(this._sdElements == null){
                    this._sdElements = new HashSet();
                }
                this._sdElements.add(sde) //TODO
                return this;
            }

            // Setting the log messages visibility mode
            withDebug(flag){
                if(flag == true){
                    this._debug = true;
                }
                else if(flag == false){
                    this._debug = false;
                    console.log('Disable the log messages  by setting debug flag 👀')
                    console.log = () => {};
                }
                return this;
            }

            build(){
                return new SyslogMessage(this);
            }
        }
        return Builder;
    }

    toSyslogMessage(messageFormat){
        if(messageFormat instanceof MessageFormat) {
            switch(messageFormat) {
                case RFC_3164:
                    break; //TODO: Fututre implementation
                case RFC_5424:
                    return toRfc5424SyslogMessage();
                case RFC_5425:
                    break; // TODO: Future implementation
                default:
                    throw new Error("Unsupported Message Format "+ messageFormat );
            }
        }
    }

    /**
     * @description 
     * 
     * Generates an <a href="http://tools.ietf.org/html/rfc5424">RFC-5424</a> message.
     * 
     * 
     */
     async toRfc5424SyslogMessage(){
         const startTime = Date.now(); // Benchmarking
         const used = process.memoryUsage().heapUsed / 1024 / 1024; //measuring the memory usage
         console.log(`The script uses before the promise call approx ${Math.round(used * 100) / 100} MB`);

        try {
            let buffer =  await toPromiseAll.call(this);
            console.log('---------------------Benchmarking on toRfc5424SyslogMessage------------------------%ss', (Date.now() - startTime)/1000); 
            const promiseUsed = process.memoryUsage().heapUsed / 1024 / 1024; //measuring the memory usage
            console.log(`The script uses after the promise call approx ${Math.round(promiseUsed * 100) / 100} MB`);      
     
           return buffer; //🔬 Returning the buffer would place the right format for RelpRequest constructor, instead of the string. Possibly adjust the rlp_02 RelpRequest constructor.

        }
        catch(err){
            throw new Error()

        }
    }
    
}
module.exports = SyslogMessage;

/**
 * 
 * @returns 
 */

function performMatrixStart() {
    const startTime = Date.now(); // Benchmarking
    const used = process.memoryUsage().heapUsed / 1024 / 1024; //measuring the memory usage
    console.log(`The script uses before the  call approx ${Math.round(used * 100) / 100} MB`); 
    return startTime;   
}

function performMatrixStop(startTime) {
    console.log('---------------------Benchmarking on ------------------------%ss', (Date.now() - startTime)/1000); 
            const promiseUsed = process.memoryUsage().heapUsed / 1024 / 1024; //measuring the memory usage
            console.log(`The script uses after the call approx ${Math.round(promiseUsed * 100) / 100} MB`);         
}
    
/**
 * @description 
 * This promise returns the buffer with PRI value and version number
 * @returns {Promise} 
 */
function priVerFirstPromise(){
    return new Promise(async(resolve, reject) => {
        console.log('Pri+Version perfomance Matrix start')
        let startTime= performMatrixStart.call(this);
        console.log('Facility CODE: ',Number.isInteger(this._facility.getNumericalCode() * 8))
        let pri = (this._facility.getNumericalCode() * 8 + this._severity.getNumericalCode()).toString();
       // pri = pri.split("").filter(char => char.codePointAt(0)).join("");
        console.log("PRI Length after filtering",pri.length)
        console.log('priVerFirstPromise ', pri, ' LENGTH: ', pri.length);
        let firstBufferLength = pri.length + 4;
        var firstBuffer = Buffer.alloc(firstBufferLength);
        firstBuffer.fill(0); 
        let pos = 0;
        firstBuffer.write('<', pos++,'ascii');   
        firstBuffer.write(pri.toString(), pos++);
        pos += pri.toString().length;
        firstBuffer.write('>', pos++,'ascii');
        firstBuffer.write('1', pos++,'ascii');
        console.log('First buffer length ', firstBufferLength, ' bytesread Buffer ', firstBuffer.byteLength);
        let firstBufferStr = firstBuffer.toString().split("").filter(char => char.codePointAt(0)).join("") // ⚠️ This is to tackle to the null char , if place 0 it place the null char but ⚠️ Check for the possible abnormal behaviour and/or security flaw. 
        let finalFirstBuffer = Buffer.from(firstBufferStr)
        performMatrixStop.call(this, startTime);
        resolve(finalFirstBuffer);
    })       
}

/**
 * @description 
 * This promise returns buffer with RFC3339 Timestamp, if timestamp is missing it will apply the current system timestamp.
 * @returns {Promise}
 */
function dateSecondPromise(){
    return new Promise(async(resolve, reject) => {
        console.log('Date perfomance Matrix start')
        let startTime= performMatrixStart.call(this);
        
        let rfc3339timeStamp = (this._timestamp == null ? RFC3339DateFormat(new Date()) : RFC3339DateFormat(new Date(this._timestamp)));
        let bufferLength = rfc3339timeStamp.toString().length + 1;
        let pos = 0;
        let secondBuffer = Buffer.alloc(bufferLength);
        secondBuffer.fill(0);
        secondBuffer.write(SyslogMessage.SP, pos++);
        secondBuffer.write(rfc3339timeStamp.toString(), pos++);
        performMatrixStop.call(this, startTime);
        resolve(secondBuffer)
    })
}
/**
 * @description 
 * This promise returns the buffer with hostname.  
 * @returns {Promise}
 */
function hostThirdPromise(){
    return new Promise(async(resolve, reject) =>{
        console.log('Hostname perfomance Matrix start')
        let startTime= performMatrixStart.call(this);
        if(this._hostname == null){
            this._hostname = await SyslogMessage.localhostNameReference.getData(); //
        }
        if(validateHostname.call(this, this._hostname)){
            let bufferLength = this._hostname.toString().length + 1;
            let pos = 0;
            let thirdBuffer = Buffer.alloc(bufferLength);
            thirdBuffer.fill(0);
            thirdBuffer.write(SyslogMessage.SP, pos++);
            thirdBuffer.write(this._hostname.toString(),pos);
            performMatrixStop.call(this, startTime);
            resolve(thirdBuffer);
        }
        
    })
}

/**
 * 
 * @returns 
 */
 function appFourthPromise(){
    return new Promise(async(resolve, reject) => {
        validateappName.call(this, this._appName);
        let appName = writeNillableValue.call(this, this._appName);      
        resolve(appName);
    })
}
/**
 * 
 * @returns 
 */
function procIdFifthPromise(){
    return new Promise(async(resolve, reject) => {
        validateProcId.call(this, this._procId);
        let procId = writeNillableValue.call(this, this._procId);
        resolve(procId);
    })
}

function msgIdSixthPromise(){
    return new Promise(async(resolve, reject) => {
        validateMsgId.call(this, this._msgId);
        let msgID = writeNillableValue.call(this, this._msgId);
        resolve(msgID);
    })
}

function sdSeventhPromise(){
    return new Promise(async(resolve, reject) => {
        //write SD
        let ssde = writeStructureDataOrNillableValue.call(this,this._sdElements);
        resolve(ssde);
    })
}

function writeNillableValue(value){
    let pos = 0;
    let buffer;
    if(value == null){
        buffer = Buffer.alloc(2)
        buffer.write(SyslogMessage.SP, pos++);
        buffer.write(SyslogMessage.NILVALUE, pos++);
        return buffer;
    }
    else {
        let bufferLength = value.length + 1;
        buffer = Buffer.alloc(bufferLength);
        buffer.fill(0);
        buffer.write(SyslogMessage.SP, pos++);
        buffer.write(value, pos++);
        return buffer;
    }
}

/**
* 
* @param {Set} sdElementSet 
* @returns {Buffer}
*/

function writeStructureDataOrNillableValue(sdElementSet){
   let pos = 0;
   let buffer;
   if(sdElementSet == null || sdElementSet.size == 0){
       buffer = Buffer.alloc(2)
       buffer.write(SyslogMessage.SP, pos++);
       buffer.write(SyslogMessage.NILVALUE, pos++);
       return buffer;
   } else{
       for(const sde of sdElementSet){
        buffer =  writeSDElement.call(this,sde)
        }
        return buffer;
   }
}

// tag::writeSDElement[]
/**
 * @description
 * Writes SD elements in the allocated buffers & concat them.
 * This method accepts the SDElement. 
 * Buffer Array which keeps the ID, SDElement, Tail buffers.
 * 
 * It starts to extract the SdID of the SDElement and holds in the idBuffer. 
 * Looping the available  SDParams in the SDElement and serialzing using the SDSerializer.
 * 
 * 
 * @param {SDElement} sde 
 * @returns {Buffer} complete concatenated buffer
 */
function  writeSDElement(sde){   
    //ID Buffer 
    let bufferArray = [];  // keeps the buffers for the concatenation
    let bufsize = sde.getSdID().toString().length + 2;
    let idBuffer = Buffer.alloc(bufsize);
    let pos = 0;
    idBuffer.write(SyslogMessage.SP, pos++);
    idBuffer.write('[', pos++);
    idBuffer.write(sde.getSdID(), pos)

    bufferArray.push(idBuffer); //Add SdID buffer

    pos += sde.getSdID().toString().length;// Locate the writeable position for the next byte 
    for(const sdp of sde.getSdParams()){
        let sdSerializer = new SDSerializer(sdp, idBuffer, pos);
        let sdpTemp = writeSDParam.call(this,sdSerializer); // returns the SDParam buffer     
        bufferArray.push(sdpTemp); // Add SDParam  buffer
    }
    //Tail Buffer
    let buf = Buffer.alloc(1)
    buf.write(']',0);
    bufferArray.push(buf) // Add Tail buffer
    let concatBuffer = Buffer.concat(bufferArray); // concatenate buffer
    return concatBuffer;
 }

 /**
  * 
  * @param {SDSerializer} sdSerializer 
  * @returns 
  */
 function writeSDParam(sdSerializer){
    let pos = 0;
    let sdp = sdSerializer.getSdp();
    let nSize = pos +  sdp.getParamValue().toString().length + sdp.getParamName().toString().length + 4;
    let nBuffer = Buffer.alloc(nSize); // Transforming to the new Buffer  
    nBuffer.write(SyslogMessage.SP, pos++);
    nBuffer.write(sdp.getParamName().toString("ascii"), pos); // ensure the Paramname accepts only ASCII
    pos += sdp.getParamName().toString().length;
    nBuffer.write('=', pos++);
    nBuffer.write('"', pos++);
    nBuffer.write(getEscapedParamValue.call(this,sdp.getParamValue()), pos)
    pos+= sdp.getParamValue().toString().length;
    nBuffer.write('"', pos++); 
    return nBuffer;
}
 

 /**
  * 
  * 
  * @param {string} paramValue 
  * @returns {string} sb
*/
  function  getEscapedParamValue(paramValue){ 
        let sb = new StringBuilder();
        for(let i = 0; i < paramValue.length; i++){
            let c = paramValue.charAt(i);
            switch(c){
                case '"' : 
                case '\\':
                case ']':
                    sb.append('\\');
                    break;
                default:
                    break;
            }
        sb.append(c);
    }
    return sb.toString();
   }



/**
 * @todo 
 * 1 - Hostnames can be 255 Bytes, Some systems may limit to 64, in order to check>> HOST_NAME_MAX specifies 64
 * 2 - Hostnames used in DNS can be 253 Byes as FQDN
 * 3 - 
 * 
 * @param {String} hostname 
 */
function validateHostname(hostname) {
    if(hostname.toString().length > 255){
        throw new Error('hostname MAX length should not exceed 255 characters: ', hostname.length)
    }
    else {
        validatePrintAscii.call(this, hostname);
        return true;
    }   
}

/**
 * @description
 * This method ensures that received appName has  less than 48 characters and,  that ASCII values ranges between 33 to 126.
 * @param {String} appName 
 */
function validateappName(appName) {
    if(appName != undefined && appName.length > 48){
        throw new Error('appName MAX length should not exceed 48 characters: ', appName.length)
    }
    else {
        if(appName === undefined || appName == null ){
            return;
        }
        else{
            validatePrintAscii.call(this, appName);
        }
    }    
}
/**
 * 
 * @param {String} procId 
 * @returns 
 */
function validateProcId(procId) {
    if(procId != undefined && procId.length > 128){
        throw new Error('procId MAX length should not exceed 128 characters: ',procId.length )
    }
    else {
        if(procId === undefined || procId == null ){
            return;
        }
        else{
            validatePrintAscii.call(this, procId);
        }
    }       
}

function validateMsgId(msgId) {
    if(msgId != undefined && msgId.length > 32){
        throw new Error('msgId MAX length should not exceed 128 characters: ',msgId.length )
    }
    else {
        if(msgId === undefined || msgId == null ){
            return;
        }
        else{
            validatePrintAscii.call(this, msgId);
        }
    }   

    
}
/**
 * This check the characters in the passing string, that ASCII value range between 33 and 126.
 * @param {String} str 
 */
function validatePrintAscii(str) {
    for(let i = 0; i < str.length; i++){
        let char = str.charCodeAt(i);
        if((char < 33) ||  (char > 126)){
            throw new Error('Check for including the applicable ASCII : ', char)
        }   
    }    
}

/**
 * @todo naming convention, comments, check for validation according to RFC 5424, 
 * @returns 
 * 
 */
function toPromiseAll(){
    return new Promise(async(resolve, reject) => {
       let priVerBuffer;
       let dateBuffer;
       let hostnameBuffer;
       let appNameBuffer;
       let procIdBuffer;
       let msgIdBuffer;
       let sdElementsBuffer;
       let nLineBuffer;


       priVerBuffer = await priVerFirstPromise.call(this); 
       dateBuffer = await dateSecondPromise.call(this);
       hostnameBuffer = await hostThirdPromise.call(this);
       appNameBuffer = await appFourthPromise.call(this);
       procIdBuffer = await procIdFifthPromise.call(this);
       msgIdBuffer = await msgIdSixthPromise.call(this);
       sdElementsBuffer = await sdSeventhPromise.call(this);
       nLineBuffer = await insertLine.call(this); // Test case experiment


       
       let bufferArray = [priVerBuffer, dateBuffer, hostnameBuffer, appNameBuffer, procIdBuffer, msgIdBuffer, sdElementsBuffer];
       let completeBuffer = Buffer.concat(bufferArray);

       /*
       let len = priVerBuffer.toString().length + dateBuffer.toString().length + hostnameBuffer.toString().length
                   + appNameBuffer.toString().length + procIdBuffer.toString().length + msgIdBuffer.toString().length + sdElementsBuffer.toString().length;
       let tempBuffer = Buffer.concat([priVerBuffer, dateBuffer, hostnameBuffer, appNameBuffer, procIdBuffer, msgIdBuffer, sdElementsBuffer],len)
        */
       if(this._msg != null){
           let msgWriter = new CharArrayWriter();
           msgWriter.write(this._msg, 0, this._msg.length);
           completeBuffer =  msgWriter.writeTo(completeBuffer);      
       }
       let resultBuffer = [completeBuffer, nLineBuffer]
       resultBuffer = Buffer.concat(resultBuffer);


       resolve(resultBuffer)
    })
}

function  insertLine() {
    return new Promise(async(resolve, reject) => {
        let nLineBuffer = Buffer.from('\n','ascii');
        resolve(nLineBuffer);

    })
    
}