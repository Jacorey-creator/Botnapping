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

// Add this new function after the checkWin function
const findConnectedPipes = (grid: PipePiece[][], startRow: number, startCol: number): boolean[][] => {
  const rows = grid.length;
  const cols = grid[0].length;
  const connected = Array(rows).fill(0).map(() => Array(cols).fill(false));
  
  // Helper function to check if two pieces are connected in a given direction
  const areConnected = (r1: number, c1: number, r2: number, c2: number): boolean => {
    if (r2 < 0 || r2 >= rows || c2 < 0 || c2 >= cols) return false;
    
    const piece1 = grid[r1][c1];
    const piece2 = grid[r2][c2];
    const conns1 = getConnections(piece1.type, piece1.rotation);
    const conns2 = getConnections(piece2.type, piece2.rotation);
    
    if (r2 === r1 + 1) return conns1.bottom && conns2.top;
    if (r2 === r1 - 1) return conns1.top && conns2.bottom;
    if (c2 === c1 + 1) return conns1.right && conns2.left;
    if (c2 === c1 - 1) return conns1.left && conns2.right;
    return false;
  };

  // DFS to find all connected pipes
  const dfs = (row: number, col: number) => {
    if (connected[row][col]) return;
    connected[row][col] = true;
    
    // Check all four directions
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;
      if (areConnected(row, col, newRow, newCol)) {
        dfs(newRow, newCol);
      }
    }
  };

  // Start DFS from the printer (start point)
  dfs(startRow, startCol);
  return connected;
};

// Fixed, hand-designed 5x5 board with a single correct path and distractors
const FIXED_BOARD: PipePiece[][] = [
  // Row 0
  [
    { type: 'elbow', rotation: 180 },
    { type: 'straight', rotation: 90 },
    { type: 'start', rotation: 0 },
    { type: 'elbow', rotation: 270 },
    { type: 'elbow', rotation: 180 },
  ],
  // Row 1
  [
    { type: 'elbow', rotation: 0 },
    { type: 'elbow', rotation: 0 },
    { type: 'straight', rotation: 0 },
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 90 },
  ],
  // Row 2
  [
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 90 },
    { type: 'straight', rotation: 90 },
    { type: 'elbow', rotation: 180 },
  ],
  // Row 3
  [
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'elbow', rotation: 180 },
    { type: 'straight', rotation: 0 },
  ],
  // Row 4
  [
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 90 },
    { type: 'elbow', rotation: 0 },
    { type: 'elbow', rotation: 0 },
    { type: 'end', rotation: 0 },
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
  margin: 2rem auto;
  max-width: 800px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  background: #2a2a2a;
  padding: 16px;
  border-radius: 4px;
`;

const PipePiece = styled.div<{ rotation: number; isConnected: boolean }>`
  width: 60px;
  height: 60px;
  background: ${props => props.isConnected ? '#ffd700' : '#3a3a3a'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: rotate(${props => props.rotation}deg);
  transition: all 0.2s ease;
  font-size: 24px;

  &:hover {
    background: ${props => props.isConnected ? '#ffed4a' : '#4a4a4a'};
  }
`;

const PipePuzzle: React.FC = () => {
  const [puzzle, setPuzzle] = useState<PipePiece[][]>(() => FIXED_BOARD.map(row => row.map(cell => ({ ...cell }))));
  const [hasWon, setHasWon] = useState(false);
  const [connectedPipes, setConnectedPipes] = useState<boolean[][]>(() => {
    // Initialize connected pipes from the start point
    const [startRow, startCol] = INTENDED_PATH[0];
    return findConnectedPipes(FIXED_BOARD, startRow, startCol);
  });

  const rotatePiece = (row: number, col: number) => {
    setPuzzle(prev => {
      const newPuzzle = prev.map(row => [...row]);
      const piece = { ...newPuzzle[row][col] };
      const newRotation = ((piece.rotation + 90) % 360) as Rotation;
      piece.rotation = newRotation;
      newPuzzle[row][col] = piece;
      
      // Update connected pipes after rotation
      const [startRow, startCol] = INTENDED_PATH[0];
      setConnectedPipes(findConnectedPipes(newPuzzle, startRow, startCol));
      
      setTimeout(() => {
        setHasWon(checkWin(newPuzzle));
      }, 0);
      return newPuzzle;
    });
  };

  return (
    <GameContainer>
      <h1 style={{ color: 'white' }}>3D Printing Pipe Puzzle</h1>
      <p style={{ color: 'white' }}>Connect the filament from the printer nozzle to the print bed!</p>
      {hasWon && <h2 style={{ color: '#4caf50' }}>🎉 You win! The printer is connected to the bed! 🎉</h2>}
      <Grid>
        {puzzle.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <PipePiece
              key={`${rowIndex}-${colIndex}`}
              rotation={piece.rotation}
              isConnected={connectedPipes[rowIndex][colIndex]}
              onClick={() => rotatePiece(rowIndex, colIndex)}
            >
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

export default PipePuzzle; 