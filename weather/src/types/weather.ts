export interface Weather{
    name:string
    main:{
        temp:number
        fells_like:number
        humidity:number
    }
    weather:{
        description:string
        icon:string
    }[]
    wind:{
        speed:number
    }
}