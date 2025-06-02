import { useEffect, useRef } from 'react';
import styles from '../styles/VictoryPage.module.css';

const VictoryPage = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play victory sound when component mounts
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio playback failed:', error);
      });
    }
  }, []);

  return (
    <div className={styles.victoryContainer}>
      <div className={styles.videoSection}>
        <video 
          controls
          playsInline
          className={styles.victoryVideo}
          autoPlay
        >
          <source src="/victory/victory-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={styles.textSection}>
        <h1>Congratulations!</h1>
        <p>You've successfully rescued Cybert from the clutches of NullByte!</p>
        <p>Your journey through the digital realm has proven your worth as a true Neumont warrior.</p>
        <p>Cybert is now free to continue his adventures in the world of code and coffee.</p>
        <audio ref={audioRef} src="/victory/goodresult-82807.mp3" />
      </div>
    </div>
  );
};

export default VictoryPage; 