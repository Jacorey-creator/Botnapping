import { useParams, useNavigate } from 'react-router-dom'
import Quiz, { Question } from './Quiz'
import styles from '../styles/CluePage.module.css'

type MediaClue = {
  type: 'image' | 'video'
  content: string
  title: string
}

type QuizClue = {
  type: 'quiz'
  title: string
  questions: Question[]
  finalClue: (score: number) => string
}

type Clue = MediaClue | QuizClue

const clues: Record<string, Clue> = {
  '1': { 
    type: 'image', 
    content: '/clues/BossRushClicker_002.png', 
    title: 'First Clue' 
  },
  '2': { 
    type: 'quiz', 
    title: 'Math Challenge',
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 1
      },
      {
        question: "What is 5 × 5?",
        options: ["20", "25", "30", "35"],
        correctAnswer: 1
      },
      {
        question: "What is 10 ÷ 2?",
        options: ["3", "4", "5", "6"],
        correctAnswer: 2
      }
    ],
    finalClue: (score) => `Look for the yellow door with the number ${score + 1}`
  },
  '3': { 
    type: 'quiz',
    title: 'Pop Quiz',
    questions: [
      {
        question: `You stumble into the Casting Room, only to find a broken mouse, a floppy disk wearing sunglasses, 
        and someone yelling "ACTION!" into a USB port. 
        What role were you clearly meant to play?`,
        options: ["The RAM-bunctious Hero", "The Floppy Prophet of Outdated Storage", "Professor Java, Compiler of Truths", "A Suspiciously Hot GPU"],
        correctAnswer: 2
      },
      {
        question: `Your audition triggers a segmentation fault in reality. 
        your sidekick Co-Pilot appears and whispers, "Looks like you're trying to find a faculty member. 
        Need help?" Where do you go?`,
        options: ["The WiFi Dead Zone of Doom", "The Faculty Mainframe Lounge", "The Server Closet of Eternal Whirring", "The Printer Queue Dimension"],
        correctAnswer: 1
      },
      {
        question: `As you enter the suspected location, you spot signs of intelligent 
        (and caffeinated) life. What proves you've found the legendary Faculty Area?`,
        options: ["A keyboard with the keys: Ctrl, Alt, and Regret", "A whiteboard containing an equation that just says \"try turning it off and on again\"", "A coffee machine running Linux", "All of the above, obviously"],
        correctAnswer: 3
      }
    ],
    finalClue: () => `A professor might know who NullByte is…`
  }
}

const CluePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const clue = clues[id as keyof typeof clues]

  if (!clue) {
    navigate('/')
    return null
  }

  if (clue.type === 'quiz') {
    return (
      <Quiz 
        questions={clue.questions}
        title={clue.title}
        finalClue={clue.finalClue}
        onComplete={(score) => {
          // You could store the score or do something with it here
          console.log(`Quiz completed with score: ${score}`)
        }}
      />
    )
  }

  return (
    <div className={styles.cluePage}>
      <h1>{clue.title}</h1>
      <div className={styles.mediaContainer}>
        {clue.type === 'image' ? (
          <img src={clue.content} alt={clue.title} />
        ) : (
          <video controls>
            <source src={clue.content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <button onClick={() => navigate('/')}>Back to Password Entry</button>
    </div>
  )
}

export default CluePage 