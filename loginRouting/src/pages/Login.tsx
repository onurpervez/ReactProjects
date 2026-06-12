import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email: string
  password: string
}

interface Props {
  onLogin: () => void
}


function Login({ onLogin }: Props) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<FormErrors>({
    email: '',
    password: ''
  })

  function validate(): boolean {
    const yeniHatalar: FormErrors = { email: '', password: '' }
    let gecerli = true

    if (formData.email.trim() === '') {
      yeniHatalar.email = 'Email zorunludur'
      gecerli = false
    } else if (!formData.email.includes('@')) {
      yeniHatalar.email = 'Geçerli bir email girin'
      gecerli = false
    }

    if (formData.password.trim() === '') {
      yeniHatalar.password = 'Şifre zorunludur'
      gecerli = false
    } else if (formData.password.length < 6) {
      yeniHatalar.password = 'Şifre en az 6 karakter olmalı'
      gecerli = false
    }

    setErrors(yeniHatalar)
    return gecerli
  }

  function handleSubmit() {
    if (!validate()) return
    onLogin()
    navigate('/dashboard')
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div>
      <h1>Giriş Yap</h1>
      <div>
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p>{errors.email}</p>}
      </div>
      <div>
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Şifre"
        />
        {errors.password && <p>{errors.password}</p>}
      </div>
      <button onClick={handleSubmit}>Giriş Yap</button>
    </div>
  )
}

export default Login