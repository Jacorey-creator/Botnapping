import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../styles/Quiz.module.css'

export interface Question {
  question: string
  options: string[]
  correctAnswer: number
}

interface QuizProps {
  questions: Question[]
  title: string
  finalClue: (score: number) => string
  onComplete?: (score: number) => void
}

const Quiz = ({ questions, title, finalClue, onComplete }: QuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showFinalClue, setShowFinalClue] = useState(false)
  const navigate = useNavigate()

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowFinalClue(true)
      onComplete?.(score + (selectedOption === questions[currentQuestion].correctAnswer ? 1 : 0))
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowFinalClue(false)
  }

  if (showFinalClue) {
    const perfectScore = score === questions.length
    return (
      <div className={styles.quiz}>
        <h1>Quiz Complete!</h1>
        <p>You scored {score} out of {questions.length}</p>
        {perfectScore ? (
          <div className={styles['final-clue']}>
            <h2>Your Next Clue</h2>
            <p>{finalClue(score)}</p>
          </div>
        ) : (
          <button 
            onClick={resetQuiz} 
            className={styles['retry-button']}
          >
            Take the quiz again?
          </button>
        )}
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }

  return (
    <div className={styles.quiz}>
      <h1>{title}</h1>
      <h2>Question {currentQuestion + 1} of {questions.length}</h2>
      <div className={styles['question-container']}>
        <h2>{questions[currentQuestion].question}</h2>
        <div className={styles.options}>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={styles.option}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Quiz 