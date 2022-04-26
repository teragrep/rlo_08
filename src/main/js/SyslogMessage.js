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
const SDParam = require("./SDParam");
const SDElement = require("./SDElement");
const StringBuilder = require('../../lib/StringBuilder');
const CharArrayWriter = require("../../lib/CharArrayWriter");

let _facility;
let _severity;
let _timestamp;
let _hostname;
let _appName;
let _procId;
let _msgId;
let _sdElements; //Set datastructure
let _msg; //charArrayWriter

/**
 * @todo enhance the implementation with similar CharArrayWriter, handling null of the hostname, 
 * ಠ_ಠ concurrency might not take much fluence this time, but keep the place for the consideration.
 * ⚠️ check for the potential security flaws.☢️☢️
 * Serialization **** Multiple connection thread, separation of concern 
 *  
 * @Done Builder design pattern, handling writeSDElement, paramvalue.
 * 
 */
class SyslogMessage {

    static SP = ' ';
    static NILVALUE = '-';
    static rfc3339DateFormat = RFC3339DateFormat;
    static rfc3164DateFormat; // TODO: later
    static localhostNameReference = new CachingReference(FetchHost);  //  get the host name and refresh every 10
  
    
    /*
    * According to <a href="http://tools.ietf.org/html/rfc3164#section-4.1.2">RFC31614- 4.1.2 HEADER Part of a syslog Packet</a>,
    * we should use local time and not GMT.
    * <quote>
    *     The TIMESTAMP field is the local time and is in the format of "Mmm dd hh:mm:ss" (without the quote marks)
    * </quote>
    */


    /**
     * Builder pattern handler
     * @returns 
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
     * @todo
     * @returns the Date object created using the timestamp (milliseconds)
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
            ssde = new HashSet(); // TODO
        }
        return ssde;
    }

    setSDElements(ssde){
        this._sdElements = ssde; // TODO
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
             * @todo
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
     * @todo 
     *  1 - Buffer is useful, but dangerous Track it carefully.... fill(0), in case if really big buffer, might be impact on the performance
     *  2 - Make functions private &  Code clean up & refinement 
     *  3 - Flexible, reallocation // toRfc5424SyslogMessgae // TLS: Use the standard out. Make the article
     *      Ok, resizing the buffer we can obtain, like copy the previous buffer content size with new arrival of the size 
     * 
     * Comment: create similar classes that for example Facility has for each of the message components so that they could do the serialization and validation
     *           for their part i.e. hostname has length requirements and appName has too and both have as well allowed character range
     *   
     * Generates an <a href="http://tools.ietf.org/html/rfc5424">RFC-5424</a> message.
     * 
     * 
     */
     async toRfc5424SyslogMessage(){

        try {
            let buffer =  await toPromiseAll.call(this);
           return buffer.toString();

        }
        catch(err){
            throw new Error()

        }
    }
    
}
module.exports = SyslogMessage;
    

function priVerFirstPromise(){
    return new Promise(async(resolve, reject) => {
        let pri = this._facility.getNumericalCode() * 8 + this._severity.getNumericalCode();
        let firstBufferLength = pri.toString().length + 4;
        var firstBuffer = Buffer.alloc(firstBufferLength);
        firstBuffer.fill(0);
        let pos = 0;
        firstBuffer.write('<', pos++);
        firstBuffer.write(pri.toString(), pos++);
        pos += pri.toString().length;
        firstBuffer.write('>', pos++);
        firstBuffer.write('1', pos++);
        resolve(firstBuffer);
    })       
}


function dateSecondPromise(){
    return new Promise(async(resolve, reject) => {
        
        let rfc3339timeStamp = (this._timestamp == null ? RFC3339DateFormat(new Date()) : RFC3339DateFormat(new Date(this._timestamp)));
        let bufferLength = rfc3339timeStamp.toString().length + 1;
        let pos = 0;
        let secondBuffer = Buffer.alloc(bufferLength);
        secondBuffer.fill(0);
        secondBuffer.write(SyslogMessage.SP, pos++);
        secondBuffer.write(rfc3339timeStamp.toString(), pos++);
        resolve(secondBuffer)
    })
}

function hostThirdPromise(){
    return new Promise(async(resolve, reject) =>{
        if(this._hostname == null){
            this._hostname = await SyslogMessage.localhostNameReference.getData();
        }
        let bufferLength = this._hostname.toString().length + 1;
        let pos = 0;
        let thirdBuffer = Buffer.alloc(bufferLength);
        thirdBuffer.fill(0);
        thirdBuffer.write(SyslogMessage.SP, pos++);
        thirdBuffer.write(this._hostname.toString(),pos);
        resolve(thirdBuffer);
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

function  getSdParamLength(sdp){
    let length = sdp.getParamName().toString().length + sdp.getParamValue().toString().length + 5;
    return length;
}

/**
 * This methods returns the length which set buffer size 
 * @param {SDElement} sde 
 * @returns {Number} 
*/
function getSdLength(sde){
    let length = sde.getSdID().toString().length + 2;
    let sdpRes = 0;
    for(const sdp of sde.getSdParams()){
        sdpRes = getSdParamLength.call(this,sdp);
        length += sdpRes;
    }
    return length;
}
/**
    * 
    * @param {SDParam} sdp 
    * @param {Buffer} buffer 
    * @param {Number} pos 
    * @returns 
*/
function writeSDParam(sdp, buffer, pos){
    buffer.write(SyslogMessage.SP, pos++);
    buffer.write(sdp.getParamName().toString("ascii"), pos); // ensure the Paramname accepts only ASCII
    pos += sdp.getParamName().toString().length;
    buffer.write('=', pos++);
    buffer.write('"', pos++);
    buffer.write(getEscapedParamValue.call(this,sdp.getParamValue()), pos)
    pos+= sdp.getParamValue().toString().length;
    buffer.write('"', pos++); 
    return {out: buffer, pos: pos};
}

/**
* 
* @param {SDElement} sde 
* @returns 
*/
function  writeSDElement(sde){      
   let sdLength = getSdLength.call(this,sde);
   let buffer = Buffer.alloc(sdLength);
   let pos = 0;
   buffer.write(SyslogMessage.SP, pos++);
   buffer.write('[', pos++);
   buffer.write(sde.getSdID(), pos)
   pos += sde.getSdID().toString().length;
   for(const sdp of sde.getSdParams()){
       let sdpTemp = writeSDParam.call(this,sdp, buffer, pos);
       pos =  sdpTemp.pos;
   }
   buffer.write(']',pos++);
   return buffer;
}




 /**
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


function appFourthPromise(){
    return new Promise(async(resolve, reject) => {
        let appName = writeNillableValue.call(this, this._appName);
        resolve(appName);
    })
}

function pidFifthPromise(){
    return new Promise(async(resolve, reject) => {
        let pId = writeNillableValue.call(this, this._procId);
        resolve(pId);
    })
}

function msgIdSixthPromise(){
    return new Promise(async(resolve, reject) => {
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

function toPromiseAll(){
    return new Promise(async(resolve, reject) => {
       let firstBuffer;
       let secondBuffer;
       let thirdBuffer;
       let fourthBuffer;
       let fifthBuffer;
       let sixthBuffer;
       let seventhBuffer;


       firstBuffer = await priVerFirstPromise.call(this); //await this.priVerFirstPromise();
       secondBuffer = await dateSecondPromise.call(this);
       thirdBuffer = await hostThirdPromise.call(this);
       fourthBuffer = await appFourthPromise.call(this);
       fifthBuffer = await pidFifthPromise.call(this);
       sixthBuffer = await msgIdSixthPromise.call(this);
       seventhBuffer = await sdSeventhPromise.call(this);

       let len = firstBuffer.toString().length + secondBuffer.toString().length + thirdBuffer.toString().length
                   + fourthBuffer.toString().length + fifthBuffer.toString().length + sixthBuffer.toString().length + seventhBuffer.toString().length;
       let tempBuffer = Buffer.concat([firstBuffer, secondBuffer, thirdBuffer, fourthBuffer, fifthBuffer, sixthBuffer, seventhBuffer],len)

       if(this._msg != null){
           let msgWriter = new CharArrayWriter();
           msgWriter.write(this._msg, 0, this._msg.length);
           tempBuffer =  msgWriter.writeTo(tempBuffer);      
       }

       resolve(tempBuffer)
    })
}