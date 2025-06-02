/// <reference types="vite/client" />
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Home.module.css'

const validPasswords = {
  'clue1': '1',
  'clue2': '2',
  'clue3': '3',
  'clue4': '4',
  'clue5': '5',
}

const Home = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const clueId = validPasswords[password as keyof typeof validPasswords]
    if (clueId) {
      navigate(`/clue/${clueId}`)
    } else {
      alert('Invalid password!')
    }
  }

  return (
    <div className={styles.home}>
      <h1>Scavenger Hunt</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Unlock Clue</button>
      </form>
    </div>
  )
}

export default Home 