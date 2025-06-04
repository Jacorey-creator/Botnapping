import React, { useState } from 'react';
import styles from './PipePuzzle.module.css';

// Types for our pipe pieces
type PipeType = 'straight' | 'elbow' | 'cross' | 'start' | 'end';
type Rotation = 0 | 90 | 180 | 270;

type PipeConnections = {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

interface PipePiece {
  type: PipeType;
  rotation: Rotation;
}

// Define the connections for each pipe type
const PIPE_CONNECTIONS: Record<PipeType, PipeConnections> = {
  straight: { top: true, right: false, bottom: true, left: false },
  elbow: { top: true, right: true, bottom: false, left: false },
  cross: { top: true, right: true, bottom: true, left: true },
  start: { top: false, right: false, bottom: true, left: false },
  end: { top: true, right: false, bottom: false, left: false }
};

// Helper function to rotate connections
const rotateConnections = (connections: PipeConnections, rotation: Rotation): PipeConnections => {
  const dirs = ['top', 'right', 'bottom', 'left'] as const;
  const arr = dirs.map(dir => connections[dir]);
  const steps = (rotation / 90) % 4;
  const rotated = arr.map((_, i) => arr[(i - steps + 4) % 4]);
  return {
    top: rotated[0],
    right: rotated[1],
    bottom: rotated[2],
    left: rotated[3]
  };
};

const getConnections = (type: PipeType, rotation: Rotation): PipeConnections => {
  return rotateConnections(PIPE_CONNECTIONS[type], rotation);
};

const INTENDED_PATH: [number, number][] = [
  [0, 2], // start
  [1, 2],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 4],
  [4, 4], // end
];

const checkWin = (grid: PipePiece[][]) => {
  for (let i = 0; i < INTENDED_PATH.length - 1; i++) {
    const [r1, c1] = INTENDED_PATH[i];
    const [r2, c2] = INTENDED_PATH[i + 1];
    const pieceA = grid[r1][c1];
    const pieceB = grid[r2][c2];
    const dr = r2 - r1;
    const dc = c2 - c1;
    let dirA: keyof PipeConnections, dirB: keyof PipeConnections;
    if (dr === 1 && dc === 0) { dirA = 'bottom'; dirB = 'top'; }
    else if (dr === -1 && dc === 0) { dirA = 'top'; dirB = 'bottom'; }
    else if (dr === 0 && dc === 1) { dirA = 'right'; dirB = 'left'; }
    else if (dr === 0 && dc === -1) { dirA = 'left'; dirB = 'right'; }
    else { return false; }
    const connsA = getConnections(pieceA.type, pieceA.rotation);
    const connsB = getConnections(pieceB.type, pieceB.rotation);
    if (!connsA[dirA] || !connsB[dirB]) return false;
  }
  const [startR, startC] = INTENDED_PATH[0];
  const [endR, endC] = INTENDED_PATH[INTENDED_PATH.length - 1];
  if (grid[startR][startC].type !== 'start' || grid[endR][endC].type !== 'end') return false;
  return true;
};

const FIXED_BOARD: PipePiece[][] = [
  [
    { type: 'elbow', rotation: 180 },
    { type: 'straight', rotation: 90 },
    { type: 'start', rotation: 0 },
    { type: 'elbow', rotation: 270 },
    { type: 'elbow', rotation: 180 },
  ],
  [
    { type: 'elbow', rotation: 0 },
    { type: 'elbow', rotation: 0 },
    { type: 'straight', rotation: 0 },
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 90 },
  ],
  [
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 90 },
    { type: 'straight', rotation: 90 },
    { type: 'elbow', rotation: 180 },
  ],
  [
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'straight', rotation: 0 },
  ],
  [
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 0 },
    { type: 'elbow', rotation: 0 },
    { type: 'end', rotation: 0 },
  ],
];

const PipePuzzle: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PipePiece[][]>(() => 
    FIXED_BOARD.map(row => row.map(cell => ({ ...cell })))
  );
  const [hasWon, setHasWon] = useState(false);

  const rotatePiece = (row: number, col: number) => {
    setPuzzle(prev => {
      const newPuzzle = prev.map(row => [...row]);
      const piece = { ...newPuzzle[row][col] };
      const newRotation = ((piece.rotation + 90) % 360) as Rotation;
      piece.rotation = newRotation;
      newPuzzle[row][col] = piece;
      setTimeout(() => {
        setHasWon(checkWin(newPuzzle));
      }, 0);
      return newPuzzle;
    });
  };

  return (
    <div className={styles.pipePuzzleContainer}>
      <h2>3D Printing Pipe Puzzle</h2>
      <p>Connect the filament from the printer nozzle to the print bed!</p>
      {hasWon && <h3 className={styles.winMessage}>🎉 You win! The printer is connected to the bed! 🎉</h3>}
      <div className={styles.grid}>
        {puzzle.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.pipePiece}
              style={{ transform: `rotate(${piece.rotation}deg)` }}
              onClick={() => rotatePiece(rowIndex, colIndex)}
            >
              {piece.type === 'start' ? '🖨️' : 
               piece.type === 'end' ? '🛏️' : 
               piece.type === 'straight' ? '|' :
               piece.type === 'elbow' ? '└' :
               piece.type === 'cross' ? '+' : '?'}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PipePuzzle; 