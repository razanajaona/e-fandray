import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import logo from '../assets/icon.png'
import { validateEmail, validateTextField } from '../utilities/validation'
import { TextField } from '../components/TextField'
import { login } from '../store/auth.slice'

export interface FormFields {
  email: string
  username: string
}

export interface FormErrors {
  email?: string
  username?: string
}

export const Login: React.FC = () => {
  const [user, setUser] = useState<FormFields>({ email: '', username: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const dispatch = useDispatch()

  const validate = (name: string, value: string) => {
    switch (name) {
      case 'email':
        setErrors({ ...errors, [name]: validateEmail(value) })
        break
      case 'username':
        setErrors({ ...errors, [name]: validateTextField(value) })
        break
    }
  }

  const isLoginButtonDisabled = () => {
    if (!user.email || !user.username) {
      return true
    }
    if (!!errors.email || !!errors.username) {
      return true
    }

    return false
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    setUser({
      ...user,
      [name]: value,
    })

    if (errors[name as keyof FormErrors]) {
      validate(name, value)
    }
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    validate(name, value)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    dispatch(login(user))
    localStorage.setItem('user', JSON.stringify(user))
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="container bg-white m-4 p-12 w-500 text-center rounded-md shadow-lg max-w-full mx-auto">
        <img src={logo} className="block mx-auto mb-3 text-center w-24" alt="Doge" />

        <h1 className="text-3xl mb-8 font-bold text-gray-700">e-fandray</h1>
     

        <form onSubmit={handleSubmit}>
          <TextField
            label="mailaka"
            name="email"
            value={user.email}
            placeholder="ataovy eto ny mailaka"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <TextField
            label="Anarana"
            name="username"
            value={user.username}
            placeholder="ataovy eto ny anarana"
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
          />
          <div className="mb-3">
            <button
              className="w-full px-3 py-4 text-white bouton font-medium rounded-md shadow-md  disabled:opacity-50 focus:outline-none"
              disabled={isLoginButtonDisabled()}
            >
              Hiditra
            </button>
          </div>
          <p className="text-left text-gray-400 text-sm"></p>
        <p>Razanajaona Tojonirina Finaritra IMTICIA3 n:21</p>

        </form>
      </div>
    </div>
  )
}
