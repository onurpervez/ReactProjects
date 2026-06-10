import React from 'react'


const Mylist= ['elma','armut','ananas']

const users = [
  { id: 1, name: 'John', age: 30 },
  { id: 2, name: 'Jane', age: 25 },
  { id: 3, name: 'Bob', age: 35 }
];
    
function Map() {
    
  return (
    <div>
       {/*  <ul>
            {Mylist.map(fruit=>
                <li key={fruit}>{fruit}</li>
            )}
        </ul>

        <ul>
            {users.map(user=>
                <li key={user.id}>{user.name} is {user.age} years old</li>
            )}
        </ul> */}
        
        <ul>
      {Mylist.map((fruit, index, array) => {
        return (
          <li key={fruit}>
            Name: {fruit}, Index: {index}, Array: {array}
          </li>
        );
      })}
    </ul>

        
    
    </div>
  )
}

export default Map