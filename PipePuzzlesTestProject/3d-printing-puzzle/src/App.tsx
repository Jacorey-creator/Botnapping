import React, { useState } from 'react';
import styled from 'styled-components';

// Types for our pipe pieces
type PipeType = 'straight' | 'elbow' | 'cross' | 'start' | 'end';
type Rotation = 0 | 90 | 180 | 270;

interface PipePiece {
  type: PipeType;
  rotation: Rotation;
  connections: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
}

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
  // Example initial state - you'll want to create a proper puzzle layout
  const [puzzle, setPuzzle] = useState<PipePiece[][]>([
    // This is just a placeholder - you'll want to create a proper puzzle layout
    Array(5).fill({
      type: 'straight' as PipeType,
      rotation: 0 as Rotation,
      connections: { top: true, right: false, bottom: true, left: false }
    })
  ]);

  const rotatePiece = (row: number, col: number) => {
    setPuzzle(prev => {
      const newPuzzle = [...prev];
      const piece = { ...newPuzzle[row][col] };
      piece.rotation = ((piece.rotation + 90) % 360) as Rotation;
      newPuzzle[row][col] = piece;
      return newPuzzle;
    });
  };

  return (
    <GameContainer>
      <h1>3D Printing Pipe Puzzle</h1>
      <p>Connect the filament from the printer nozzle to the print bed!</p>
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