export interface User{
    id:number
    name:string
    email:string
    role:string
}
export const users : User[]=[
    { id: 1, name: 'Ahmet Yılmaz', email: 'ahmet@mail.com', role: 'Admin' },
    { id: 2, name: 'Ayşe Kara', email: 'ayse@mail.com', role: 'Kullanıcı' },
    { id: 3, name: 'Mehmet Demir', email: 'mehmet@mail.com', role: 'Editör' },
    { id: 4, name: 'Zeynep Çelik', email: 'zeynep@mail.com', role: 'Kullanıcı' },
    { id: 5, name: 'Can Öztürk', email: 'can@mail.com', role: 'Admin' },
    { id: 6, name: 'Elif Şahin', email: 'elif@mail.com', role: 'Editör' },
]