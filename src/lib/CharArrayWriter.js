
var charArray;
var typedArray;
let count;

class CharArrayWriter{

    constructor(initialSize){

        if(arguments.length == 0){
            console.log('0 Argument')
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

    isFull(){


        
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


    flush(){

    }

    reset(){

    }

    toCharArray(){

    }

    write(){

    }

    size(){

        return this.charArray.length;

    }

    toString(){
        if(this.charArray.length > 1){
            return this.charArray.join('');
        }
        
    }

    printInfo(){
        console.log('Bytes size ', this.charArray.toString().length);
        console.log('Buffer size ', this.typedArray.toString().length);

    }


}
module.exports = CharArrayWriter;