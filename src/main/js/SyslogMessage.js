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
const StringBuilder = require('../../lib/StringBuilder')

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
        this._msg = build._msg;
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
            /**
             * @todo investigate for the need of simila java implementation of the charArrayWriter vs final String 
             * @param {*} msg 
             * @returns 
             */
            withMsg(msg){
                this._msg = msg;
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
     * 
     * 
     * Generates an <a href="http://tools.ietf.org/html/rfc5424">RFC-5424</
     * ,a> message.
     * 
     * 
     */
    toRfc5424SyslogMessage(){

        let stringWriter = Buffer.alloc(this._msg == null ? 32 : this._msg.length + 32);
        try {
            this.toRfc5424SyslogMessagewithWriter(stringWriter);
        }
        catch(err){
            throw new Error()

        }
        return stringWriter; // Lets return the buffer, so we can adjust the content 

    }

    async getHost(){
        let hostname = SyslogMessage.localhostNameReference.getData();
        this._hostname = hostname;
        return this._hostname
    }

    /**
     * 
     * @param {Buffer} out  
     * uses UTF-8 by default. @todo SD must be ASCII, however, PARAM-VALUE in UTF-8
     * Keep in mind that some characters may occupy more than one byte in the buffer like é
     * @todo possible enhancement
     * Performance??? Serialization???
     */
    toRfc5424SyslogMessagewithWriter(out) {
        return new Promise(async(resolve, reject) =>{
            let offset = 0; // Marker to locate the position to write
            let pri = this._facility.getNumericalCode() * 8 + this._severity.getNumericalCode();
            out.write('<', offset++); // write the 1st char and move the marker to the next writeable location
            out.write(pri.toString(), offset);
            offset += pri.toString().length; // Move the marker after number of chars in the PRI value
            out.write('>', offset++);
            out.write('1', offset++); // Version
            out.write(SyslogMessage.SP, offset++);
            // RFC3339DateFormat
            let rfc3339timeStamp = (this._timestamp == null ? RFC3339DateFormat(new Date()) : RFC3339DateFormat(new Date(this._timestamp)));
            out.write(rfc3339timeStamp, offset);
            offset += rfc3339timeStamp.toString().length;
            out.write(SyslogMessage.SP, offset++);
            // set the hostname
            if(this._hostname == null){
                    // console.log(SyslogMessage.localhostNameReference.getData())
                    this._hostname = await SyslogMessage.localhostNameReference.getData(); //TODO: Flaw on the control flow
                   // resolve(this._hostname);
            }
            console.log(this._hostname);
            //this._hostname == null ? await SyslogMessage.localhostNameReference.getData() : this._hostname; // 
            //console.log(this._hostname.length);
            out.write(this._hostname, offset);
            offset += this._hostname.length;
            out.write(SyslogMessage.SP, offset++);
            //appname
            let appTemp = this.writeNillableValue(this._appName, out, offset);
            offset = appTemp.offset;
            out.write(SyslogMessage.SP, offset++);
         //   console.log(out.toString())
            //PID
            let proTemp = this.writeNillableValue(this._procId, out, offset);
            offset = proTemp.offset;
            out.write(SyslogMessage.SP, offset++);
            //msgID
            let msgTemp = this.writeNillableValue(this._msgId, out, offset);
            offset = msgTemp.offset;
            out.write(SyslogMessage.SP, offset++);
           
            //write SD
            let ssdeTemp = this.writeStructureDataOrNillableValue(this._sdElements, out, offset);
           // console.log(out.toString())
            resolve(out);
        })
    }

    /**
     * @todo transform to private method
     * @param {string} value 
     * @param {Buffer} out 
     * @param {Number} offset 
     * @returns {Buffer, Number} { out, offset }
     */
    writeNillableValue(value, out, offset){
        if(value == null){
            out.write(SyslogMessage.NILVALUE, offset);
            offset++;
            return {out: out, offset: offset};
        }
        else {
            out.write(value, offset);
            offset += value.length;
            return {out, offset};
        }
    }

    /**
     * 
     * @param {Set<SDElement>} sdElement 
     * @param {Buffer} out 
     */
     writeStructureDataOrNillableValue(sdElementSet, out, offset){
         if(sdElementSet == null || sdElementSet.size == 0){
             out.write(SyslogMessage.NILVALUE, offset);
             offset++;
             return{out, offset};
         } else{
             for(const sde of sdElementSet){
                this.writeSDElement(sde, out, offset)
              }
            }
        }

     /**
      * 
      * @param {SDElement} sdElement 
      * @param {Buffer} out 
      */
      writeSDElement(sde, out, offset){
          out.write('[', offset++);
          out.write(sde.getSdID(), offset)
          offset += sde.getSdID().toString().length;
          for(const sdp of sde.getSdParams()){
              let sdpTemp = this.writeSDParam(sdp, out, offset);
              offset +=  sdpTemp.offset;
            }
          out.write(']',offset++);
        //return {offset}; // TODO: This might helpful for more than SDELlement 
    }
     
     /**
      * 
      * @param {SDParam} sdParam 
      * @param {Buffer} out 
      * @param {Number} offset
      */
      writeSDParam(sdp, out, offset){
          out.write(SyslogMessage.SP, offset++);
          out.write(sdp.getParamName(), offset);
          offset += sdp.getParamName().toString().length;
          out.write('=', offset++);
          out.write('"', offset++);
          out.write(this.getEscapedParamValue(sdp.getParamValue()), offset)
          offset+= sdp.getParamValue().toString().length;
          out.write('"', offset++); 
        return {offset};
      }

     /**
      * 
      * @param {string} paramValue 
      * @returns {string} sb
      */
    getEscapedParamValue(paramValue){ 
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

}
module.exports = SyslogMessage;
    

