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
  'clue6': '6',
  'clue7': '7',
  'clue8': '8',
  'clue9': '9',
  'clue10': '10',
  'clue11': '11',
  'clue12': '12',
  'clue13': '13',
  'win': 'victory'
}

const Home = () => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const destination = validPasswords[password as keyof typeof validPasswords]
    if (destination) {
      if (destination === 'victory') {
        navigate('/victory')
      } else {
        navigate(`/clue/${destination}`)
      }
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