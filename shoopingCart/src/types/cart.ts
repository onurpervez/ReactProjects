export interface Product{
    id:number
    name:string
    price:number
}

export interface CartItem{
    product:Product
    quantity:number
}

export type CartAction=
|{type:'EKLE'; product:Product}
|{type:'CIKAR'; id:number}
|{type:'ARTIR'; id:number}
|{type:'AZALT'; id:number}
|{type:'TEMIZLE'}

