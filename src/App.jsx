import React from 'react';
import './App.css';

function App() {

    const [playerBoard, setPlayerBoard] = React.useState(
        Array(6).fill().map(() => Array(6).fill('water'))
    );
    
    const handleCellClick = (row, col) => {
        setPlayerBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[row] = [...newBoard[row]];
            
            // Toggle between water and ship
            if (newBoard[row][col] === 'water') {
                newBoard[row][col] = 'ship';
            } else {
                newBoard[row][col] = 'water';
            }
            
            return newBoard;
        });
    };

    const getCellColor = (cellState) => {
        switch(cellState) {
            case 'ship': return '#8B4513'; 
            case 'water': return '#87CEEB'; 
            default: return '#87CEEB';
        }
    };
    const createBoard = () => {
        const cells = [];
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                cells.push(
                    <div
                        key={`${row}-${col}`}
                        className="cell"
                        data-row={row}
                        data-col={col}
                    >
                        {row},{col}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <div className="battleship-app">
            <h1>Battleship Game</h1>
            <div className="game-container">
                <div className="game-board">
                    {createBoard()}
                </div>
                <div className="game-board">
                    {createBoard()}
                </div>
            </div>
        </div>
    );
}

export default App;