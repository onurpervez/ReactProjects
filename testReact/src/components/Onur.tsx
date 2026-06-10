import React from 'react'
import  { useState } from 'react';
import { basligiDegistir } from '../function/function';
function Onur() {
  
  
  
class Car {
  brand:string;
  years:number;
  constructor(name:string, year:number) {
    this.brand = name;
    this.years= year;
  }
  present(){
    return 'I have a '+ this.brand;
  }
}

class Model extends Car {
  model:string;
  constructor(name:string,years:number, mod:string){
  super(name,years); 
  this.model=mod;
  }
  show(){
    return this.present() + ' it is a '+this.model
  }
}

const mycar = new Model("Ford",2005,"mustang");
mycar.show();

  return (
    <>
    
    <div 
    onClick={()=>basligiDegistir("onura tıklandı")}>
        NE VAR NE YOK

        </div>
    <div>{mycar.brand} {mycar.years}
      
      
    </div>
      
      {mycar.show()}
    </>
    
  )
}

export default Onur