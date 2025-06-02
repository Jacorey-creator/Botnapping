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

// Define the connections for each pipe type
const PIPE_CONNECTIONS: Record<PipeType, PipePiece['connections']> = {
  straight: { top: true, right: false, bottom: true, left: false },
  elbow: { top: true, right: true, bottom: false, left: false },
  cross: { top: true, right: true, bottom: true, left: true },
  start: { top: false, right: false, bottom: true, left: false },
  end: { top: true, right: false, bottom: false, left: false }
};

// Helper function to rotate connections
const rotateConnections = (connections: PipePiece['connections'], rotation: Rotation): PipePiece['connections'] => {
  const { top, right, bottom, left } = connections;
  switch (rotation) {
    case 90:
      return { top: left, right: top, bottom: right, left: bottom };
    case 180:
      return { top: bottom, right: left, bottom: top, left: right };
    case 270:
      return { top: right, right: bottom, bottom: left, left: top };
    default:
      return connections;
  }
};

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
  const [puzzle, setPuzzle] = useState<PipePiece[][]>(() => {
    // Create a 5x5 grid with different pipe types
    return Array(5).fill(null).map((_, rowIndex) => 
      Array(5).fill(null).map((_, colIndex) => {
        // Place start at top, end at bottom
        if (rowIndex === 0 && colIndex === 2) {
          return {
            type: 'start',
            rotation: 0,
            connections: PIPE_CONNECTIONS.start
          };
        }
        if (rowIndex === 4 && colIndex === 2) {
          return {
            type: 'end',
            rotation: 0,
            connections: PIPE_CONNECTIONS.end
          };
        }
        // Randomly place other pipe types
        const types: PipeType[] = ['straight', 'elbow', 'cross'];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
          type,
          rotation: 0,
          connections: PIPE_CONNECTIONS[type]
        };
      })
    );
  });

  const rotatePiece = (row: number, col: number) => {
    setPuzzle(prev => {
      // Create a deep copy of the puzzle
      const newPuzzle = prev.map(row => [...row]);
      const piece = { ...newPuzzle[row][col] };
      
      // Calculate new rotation
      const newRotation = ((piece.rotation + 90) % 360) as Rotation;
      piece.rotation = newRotation;
      
      // Update connections based on rotation
      piece.connections = rotateConnections(piece.connections, 90);
      
      // Update the piece in the new puzzle
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