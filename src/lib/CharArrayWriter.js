
class CharArrayWriter{

    constructor(initialSize){

        if(arguments.length == 0){
            this.charArray = [];
        }

        if(arguments.length === 1) {
            //this.buf = Buffer.alloc(initialSize);
            this.typedArray = new Int8Array(initialSize); // UTF-8
            this.charArray = [];
        }
    }


    isEmpty(){
        if(this.charArray.length == 0){
            return true
        }
        else{
            return false;
        }

    }

    /**
     * This method handles single char & char sequence 
     * @param {char/chars} char 
     */
    append(char){
        if(char.length === 1 ){
            this.charArray.push(char)
        }
        if(char.length > 1){

            for(let i = 0; i < char.length; i++){
                this.charArray.push(char[i]);
            }
        }
    }

    write(char, off, len){
        if(arguments.length === 1) {
            if(char.length == 1){
                this.charArray.push(char);
            }
            else{
                throw new Error('Check Char length')
            }
            
        }

        else {
            let str = char;
            for(let i=0; i < len; i++){
                this.charArray.push(str[off])
                off++;
            }
            //console.log('CharArrayWriter write str ', char)
        }

    }

    writeTo(des){
        if( des instanceof Buffer){
            let pos = des.byteLength;
            let bufSize = (pos + this.size() + 1);
            let buffer = Buffer.alloc(bufSize);
            des.copy(buffer, 0);
            buffer.write(' ', pos++);
            buffer.write(this.toJoin(), pos);
            return buffer;
        }
    }

    size(){
        return this.charArray.length;
    }

    toJoin(){
        if(this.charArray.length > 1){
            return this.charArray.join('');
        }
        
    }
}
module.exports = CharArrayWriter;