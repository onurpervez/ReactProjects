import type { User } from "../data/user";


interface Props{
    user: User
}

function UserCard({user}:Props) {
  return (
    <div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>{user.role}</p>
    </div>
  )
}

export default UserCard