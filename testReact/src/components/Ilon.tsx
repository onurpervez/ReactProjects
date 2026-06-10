import React, { useState } from 'react';
import './css/ilon.css';
import { basligiDegistir } from '../function/function';
import Onur from './Onur';
import { DateInfo } from './Date'; // Dosya yolunu doğru verdiğinizden emin olun

  

 

interface IlonProps {
  baslangicMetni: string;
}

interface Kullanici {
  isim: string;
  yas: number;
  ehliyetiVarMi: boolean;
}

const hello= (name:string):string=>{
  return "hello world"+name;
}
const bugun = new Date();
const [gun, ay, yil] = DateInfo(bugun);
const Ilon: React.FC<IlonProps> = ({ baslangicMetni }) => {
const ahmet:Kullanici={
  isim:"Ahmet",
  yas:25,
  ehliyetiVarMi:true
}

  const [metin, setMetin] = useState<string>(baslangicMetni);

  return (
    
    <div className="ilonCls">
      {hello(" onur")}
      <p>Şu anki metin: {metin}</p>

      <button onClick={() => setMetin("Yeni Metin Geldi!")}>
        Metni Değiştir
      </button>
      <div>{ahmet.isim}</div>
      <div>Ilon</div>

      <div>
        <p>Bugünün tarihi: {gun}.{ay}.{yil}</p>
      </div>


      <div>
        <input
          onClick={() => basligiDegistir("ilona tıklandı")}
          type="text"
          placeholder="bana metin giriniz"
        />
        <button>Gönder</button>
      </div>
    </div>
  );
};

export default Ilon;