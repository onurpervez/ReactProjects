import type { GithubUser } from "../types/github";

interface Props{
  user:GithubUser
}

function ProfileCard({user}:Props) {
  return (
    <div>
      <img src={user.avatar_url} alt={user.login} width={100} />
      <h2>{user.name ?? user.login}</h2>
      <p>{user.bio ?? 'Bio yok'}</p>
      <p>Repo: {user.public_repos}</p>
      <p>Takipçi: {user.followers}</p>
      <p>Takip: {user.following}</p>
      <a href={user.html_url} target="_blank" rel="noreferrer">
        GitHub'da Gör
      </a>
    </div>
  )
}

export default ProfileCard