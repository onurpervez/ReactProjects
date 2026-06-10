import React, { useState } from 'react'; // Hook'lar 'react'tan gelir
import { createRoot } from 'react-dom/client'; // Render işlemleri buradan gelir

const vehicle =['onur','pervez','react'];

const [isim,soyisim,dil]=vehicle;

/* const person = {
  firstName: "John",
  lastName: "Doe",
  age: 50
}; */
interface Car {
  brand: string;
  model: string;
}

interface Person {
  firstName: string;
  lastName: string;
  age: number;
  car: Car;
}
/* const person: Person = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  car: {
    brand: 'Ford',
    model: 'Mustang',
  }
}; */

interface GreetingProps{
  name:string;
  age:number;

}

function Counter() {
  // useState ile tanımladığın değişken 'count' (küçük harf)
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Arttir
      </button>

      <h1>{count}</h1>

      <button onClick={() => {
        // Burada 'count' olarak kullanmalısın
        if (count > 0) {
          setCount(count - 1);
        }
      }}>
        Azalt
      </button>
    </div>
  );
}


function Greeting({ name, age }:GreetingProps) {
  return <h1>Hello, {name}! You are {age} years old.</h1>;
}


const numbersOne = [1, 2, 3];
const numbersTwo = [4, 5, 6];
const numbersCombined = [...numbersOne, ...numbersTwo];

interface Car {
  brand: string;
  model: string;
  color: string;
}

interface CarMore {
  type: string;
  year: number;
  color: string;
}
const car = {
  brand: 'Ford',
  model: 'Mustang',
  color: 'red'
}

const car_more = {
  type: 'car',
  year: 2021, 
  color: 'yellow'
}

const mycar = {...car, ...car_more}

// Destructuring
/* const { firstName, car: { brand, model } } = person;
const message = `My name is ${firstName}, and I drive a ${brand} ${model}.`; */


export const out = "Tobias";
export const outage = 18;


function Destruc() {
  return (
    <div>

        {/* {vehicle[0]}
        adi: {isim} soy adi : {soyisim}  dili:  {dil}
         */}

         {/* {message} */}
          {/* <Greeting name="onur" age={25}/> */}
        {/* <div>{person.firstName}</div> */}
          {/* <Counter/> */}
        {mycar.brand}

    </div>
  )
}








export default Destruc;