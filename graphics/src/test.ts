import { TBuffer} from '@tuval/core';
import * as loader from "@assemblyscript/loader";
const myImports = { }
/* class Marshall {
    public static PtrToStructure()
} */
export class Struct extends TBuffer {
   }

   export class POINT extends Struct {
    public get X(): number {
        this.seek(0);
        return this.readFloat64();
    }
    public set X(value: number) {
        this.seek(0);
        this.writeFloat64(value);
    }
    public get Y(): number {
        this.seek(8);
        return this.readFloat64();
    }
    public set Y(value: number) {
        this.seek(8);
        this.writeFloat64(value);
    }
}

/*`loader.instantiate` will use `WebAssembly.instantiateStreaming`
   if possible. Overwise fallback to `WebAssembly.instantiate`. */

/* const fs = require("fs");
const buffer = fs.readFileSync("./assembly/optimized.wasm"); */
console.log('zzxv');

const buffer_sen = require("../assembly/build/untouched.wasm");
//const charTable = require("arraybuffer-loader!../assembly/build/charinfo.wasm");
//const array = new Uint8Array(charTable)

console.log(buffer_sen);
const blob = new Blob([buffer_sen], { type: "application/wasm" });
console.log(blob);
const url = URL.createObjectURL(blob);
console.log('cvxc' + url);
loader.instantiate( fetch(url),myImports).then( (myModule: any) =>{
    const buffer = myModule.getBuffer();
    var data = new Float64Array(myModule.memory.buffer, myModule.getPointBuffer(), 2);
    const buf : POINT = new POINT(data);
    console.log(buf.X);
    console.log(buf.Y);
    //buffer._writeZero(44);
    console.log(data);
    console.log(myModule.createPoint());
   /*  const a = new myModule.Vec2d(10,1);
    const b = new myModule.Vec2d(1,1);
    const c = a.add(b);
    console.log(c);
    console.log(myModule);
    console.log(myModule.memory);
    const buffer :TBuffer = new TBuffer(myModule.memory.buffer);
    buffer.seek(c);
    console.log(buffer.readInt32());
    console.log(buffer.readInt32()); */
});

/* const importObj = {
    module: {},
    env: {
      memory: new WebAssembly.Memory({ initial: 256 }),
      table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
      Math: Math
    }
  }; */

/* WebAssembly.instantiateStreaming(fetch(url), importObj as any)
.then(results => {import { getBuffer } from './../assembly/assembly/index';

  console.log(results);
}); */


/* const calc = new Calculator().exports;
const add = calc.add(44, 8832);
const subtract = calc.subtract(100, 20);
const multiply = calc.multiply(13, 4);
const divide = calc.divide(20, 4);

console.log(add);
console.log(subtract);
console.log(multiply);
console.log(divide); */