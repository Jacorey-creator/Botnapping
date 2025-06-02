import { useParams, useNavigate } from 'react-router-dom'
import Quiz, { Question } from './Quiz'
import styles from '../styles/CluePage.module.css'

type MediaItem = {
  type: 'image' | 'video'
  content: string
  title: string
}

type MediaClue = {
  type: 'media'
  items: MediaItem[]
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
    type: 'media',
    title: 'First Clue',
    items: [
      { type: 'video', content: '/clues/2025-04-14 13-28-42 - Copy.mp4', title: 'Video Clue' },
    ],
  },
  '2': { 
    type: 'media',
    title: 'Second Clue',
    items: [
      { type: 'image', content: '/clues/20250522_174016.jpg', title: 'Image Clue' },
    ]
  },
  '3': { 
    type: 'quiz', 
    title: 'Pop Quiz',
    questions: [
      {
        question: `So, after we summon these plastic masterpieces from the printer gods… 
        where do the drama llamas go to film their magic?`,
        options: ["The Snack Hall of Eternal Grazing", "The Casting Room of Twitching Chaos","The Closet of Forgotten Props"],
        correctAnswer: 1
      }
    ],
    finalClue: () => `NullByte's  voice echoes… through old Twitch broadcasts`
  },
  '4': { 
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
  },
  '5': {
    type: 'media',
    title: 'Third Clue',
    items: [
      { type: 'video', content: '', title: 'Video Clue' },
      { type: 'image', content: '/clues/20250522_173022.jpg', title: `Cybert was last seen… coaching.\n He's smarter than he looks` },
    ]
  },
  '6': {
    type: 'quiz',
    title: 'Pop Quiz',
    questions: [
      {
        question: `You're ready to put your studying to the test, but it’s not here you'll show it. 
        Head out the door and find a place where silence is golden`,
        options: ["Commons", "Study Room", "Neumont Market", "Testing Center", "Neumont South"],
        correctAnswer: 3
      }
    ],
    finalClue: () => `Cybert always tested his systems in this room.`
  },
  '7': {
    type: 'media',
    title: 'Fourth Clue',
    items: [
      { type: 'image', content: '/clues/20250522_173625.jpg', title: 'He left “paw” prints… on the lounge rug.' },
    ]
  },
  '8': {
    type: 'media',
    title: 'Pipes Clue',
    items: [
      { type: 'video', content: '', title: 'Video Clue' },
    ]
  },
  '9': {
    type: 'media',
    title: ' Clue',
    items: [
      { type: 'video', content: '', title: '3rd Video' },
    ]
  },
  '10': {
    type: 'media',
    title: ' Clue',
    items: [
      { type: 'image', content: '/clues/20250522_180058.jpg', title: 'Hiding in plain sight' },
      { type: 'image', content: '/clues/20250522_180326.jpg', title: 'Teaching' },
    ]
  },
  '11': {
    type: 'media',
    title: 'Clue',
    items: [
      { type: 'image', content: '/clues/20250522_175450.jpg', title: 'Who did it better? ' },
      { type: 'image', content: '/clues/20250522_180712.jpg', title: ' He just cant escape!' },
    ]
  },
  '12': {
    type: 'media',
    title: 'Clue',
    items: [
      { type: 'video', content: '', title: '4th Video' },
    ]
  },
  '13': {
    type: 'media',
    title: 'Clue',
    items: [
      { type: 'video', content: '', title: 'Study Room 5th Video' },
    ]
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
          console.log(`Quiz completed with score: ${score}`)
        }}
      />
    )
  }

  return (
    <div className={styles.cluePage}>
      <h1>{clue.title}</h1>
      <div className={styles.mediaContainer}>
        {clue.items.map((item, index) => (
          <div key={index} className={styles.mediaItem}>
            <h3>{item.title}</h3>
            {item.type === 'image' ? (
              <img src={item.content} alt={item.title} />
            ) : (
              <video 
                controls
                playsInline
                preload="metadata"
                className={styles.video}
              >
                <source src={item.content} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/')}>Back to Password Entry</button>
    </div>
  )
}

export default CluePage 