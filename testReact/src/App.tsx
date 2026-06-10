import { useState } from 'react'

import './App.css'
import Onur from './components/Onur';
import Map from './components/Map';
import Ilon from './components/Ilon';
import Destruc,{out,outage} from './components/Destruc';




function App() {
  

  return (
    <div>
      <h1>kullanici: {out}</h1>
      <h1>kullanici: {outage}</h1>
      
      <Destruc/>
      {/* <Map/> */}
      {/* <Onur/> */}
      
{/*       <Ilon baslangicMetni="bu metin ana sayfadan gelir"/>
 */}    </div>
  )
}

export default App


