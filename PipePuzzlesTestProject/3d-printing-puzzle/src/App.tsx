import React, { useState } from 'react';
import styled from 'styled-components';

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
  // Convert connections to array: [top, right, bottom, left]
  const dirs = ['top', 'right', 'bottom', 'left'] as const;
  const arr = dirs.map(dir => connections[dir]);
  const steps = (rotation / 90) % 4;
  // Rotate array right by 'steps'
  const rotated = arr.map((_, i) => arr[(i - steps + 4) % 4]);
  // Map back to object
  return {
    top: rotated[0],
    right: rotated[1],
    bottom: rotated[2],
    left: rotated[3]
  };
};

// Helper function to get current connections for a piece
const getConnections = (type: PipeType, rotation: Rotation): PipeConnections => {
  return rotateConnections(PIPE_CONNECTIONS[type], rotation);
};

// Intended path for the puzzle (row, col)
const INTENDED_PATH: [number, number][] = [
  [0, 2], // start
  [1, 2],
  [2, 2],
  [2, 3],
  [2, 4],
  [3, 4],
  [4, 4], // end
];

// Pathfinding to check if there's a path from start to end
const checkWin = (grid: PipePiece[][]) => {
  // Check that the intended path is connected in order
  for (let i = 0; i < INTENDED_PATH.length - 1; i++) {
    const [r1, c1] = INTENDED_PATH[i];
    const [r2, c2] = INTENDED_PATH[i + 1];
    const pieceA = grid[r1][c1];
    const pieceB = grid[r2][c2];
    // Determine direction from A to B
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
  // Also ensure that the start and end are correct types
  const [startR, startC] = INTENDED_PATH[0];
  const [endR, endC] = INTENDED_PATH[INTENDED_PATH.length - 1];
  if (grid[startR][startC].type !== 'start' || grid[endR][endC].type !== 'end') return false;
  return true;
};

// Fixed, hand-designed 5x5 board with a single correct path and distractors
const FIXED_BOARD: PipePiece[][] = [
  // Row 0
  [
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'straight', rotation: 90 }, // distractor
    { type: 'start', rotation: 0 }, // start (down)
    { type: 'elbow', rotation: 270 }, // distractor
    { type: 'elbow', rotation: 180 }, // distractor
  ],
  // Row 1
  [
    { type: 'elbow', rotation: 0 }, // distractor
    { type: 'elbow', rotation: 0 }, // distractor
    { type: 'straight', rotation: 0 }, // path (vertical)
    { type: 'elbow', rotation: 90 }, // distractor
    { type: 'elbow', rotation: 90 }, // distractor
  ],
  // Row 2
  [
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'elbow', rotation: 90 }, // path (up to right)
    { type: 'straight', rotation: 90 }, // path (horizontal)
    { type: 'elbow', rotation: 180 }, // path (left to down)
  ],
  // Row 3
  [
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'elbow', rotation: 180 }, // distractor
    { type: 'straight', rotation: 0 }, // path (vertical)
  ],
  // Row 4
  [
    { type: 'elbow', rotation: 90 }, // distractor
    { type: 'elbow', rotation: 90 }, // distractor
    { type: 'elbow', rotation: 0 }, // distractor
    { type: 'elbow', rotation: 0 }, // distractor
    { type: 'end', rotation: 0 }, // end (up)
  ],
];

// Styled components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  background: #2a2a2a;
  padding: 16px;
  border-radius: 4px;
`;

const PipePiece = styled.div<{ rotation: number }>`
  width: 60px;
  height: 60px;
  background: #3a3a3a;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: rotate(${props => props.rotation}deg);
  transition: transform 0.2s ease;

  &:hover {
    background: #4a4a4a;
  }
`;

const App: React.FC = () => {
  // Create a proper 5x5 grid with different pipe types
  const [puzzle, setPuzzle] = useState<PipePiece[][]>(() => FIXED_BOARD.map(row => row.map(cell => ({ ...cell }))));

  // Win state
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
    <GameContainer>
      <h1>3D Printing Pipe Puzzle</h1>
      <p>Connect the filament from the printer nozzle to the print bed!</p>
      {hasWon && <h2 style={{ color: '#4caf50' }}>🎉 You win! The printer is connected to the bed! 🎉</h2>}
      <Grid>
        {puzzle.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <PipePiece
              key={`${rowIndex}-${colIndex}`}
              rotation={piece.rotation}
              onClick={() => rotatePiece(rowIndex, colIndex)}
            >
              {/* We'll add proper pipe piece rendering here */}
              {piece.type === 'start' ? '🖨️' : 
               piece.type === 'end' ? '🛏️' : 
               piece.type === 'straight' ? '|' :
               piece.type === 'elbow' ? '└' :
               piece.type === 'cross' ? '+' : '?'}
            </PipePiece>
          ))
        )}
      </Grid>
    </GameContainer>
  );
};

export default App; 