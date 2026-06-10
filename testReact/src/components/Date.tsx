import React from 'react'


export function DateInfo(dat:Date) {
  const d = dat.getDate();
  const m = dat.getMonth() + 1;
  const y = dat.getFullYear();
  

  return [d, m, y];
  
}

