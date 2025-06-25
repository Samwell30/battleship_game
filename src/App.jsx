import React from 'react';
import './App.css';

function App() {
    const [playerBoard, setPlayerBoard] = React.useState(
        Array(6).fill().map(() => Array(6).fill('water'))
    );

    const [enemyBoard, setEnemyBoard] = React.useState(
        Array(6).fill().map(() => Array(6).fill('water'))
    );

    // Ship types and their lengths
    const ships = [
        { name: 'Patrol Boat', length: 1, placed: false },
        { name: 'Destroyer', length: 2, placed: false },
        { name: 'Submarine', length: 3, placed: false }
    ];

    const [availableShips, setAvailableShips] = React.useState(ships);
    const [currentShip, setCurrentShip] = React.useState(0); // Index of ship being placed
    const [shipDirection, setShipDirection] = React.useState('horizontal'); // 'horizontal' or 'vertical'

    const canPlaceShip = (row, col, length, direction) => {
        // Check if ship fits on board
        if (direction === 'horizontal') {
            if (col + length > 6) return false;
            // Check if all cells are water
            for (let i = 0; i < length; i++) {
                if (playerBoard[row][col + i] !== 'water') return false;
            }
        } else {
            if (row + length > 6) return false;
            // Check if all cells are water
            for (let i = 0; i < length; i++) {
                if (playerBoard[row + i][col] !== 'water') return false;
            }
        }
        return true;
    };

    const placeShip = (row, col) => {
        const ship = availableShips[currentShip];
        if (!ship || ship.placed) return;

        if (canPlaceShip(row, col, ship.length, shipDirection)) {
            setPlayerBoard(prevBoard => {
                const newBoard = [...prevBoard];

                if (shipDirection === 'horizontal') {
                    for (let i = 0; i < ship.length; i++) {
                        newBoard[row][col + i] = 'ship';
                    }
                } else {
                    for (let i = 0; i < ship.length; i++) {
                        newBoard[row + i][col] = 'ship';
                    }
                }

                return newBoard;
            });

            // Mark ship as placed and move to next ship
            setAvailableShips(prev => {
                const updated = [...prev];
                updated[currentShip].placed = true;
                return updated;
            });

            // Move to next ship
            if (currentShip < availableShips.length - 1) {
                setCurrentShip(currentShip + 1);
            }
        }
    };

    const resetShips = () => {
        setPlayerBoard(Array(6).fill().map(() => Array(6).fill('water')));
        setAvailableShips(ships.map(ship => ({ ...ship, placed: false })));
        setCurrentShip(0);
    };

    const getCellColor = (cellState) => {
        switch (cellState) {
            case 'ship': return '#8B4513';
            case 'water': return '#87CEEB';
            default: return '#87CEEB';
        }
    };

    const createBoard = (board, isClickable = false) => {
        const cells = [];
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                cells.push(
                    <div
                        key={`${row}-${col}`}
                        className="cell"
                        data-row={row}
                        data-col={col}
                        style={{
                            backgroundColor: getCellColor(board[row][col]),
                            cursor: isClickable ? 'pointer' : 'default'
                        }}
                        onClick={isClickable ? () => placeShip(row, col) : undefined}
                    >
                        {row},{col}
                    </div>
                );
            }
        }
        return cells;
    };

    const allShipsPlaced = availableShips.every(ship => ship.placed);

    return (
        <div className="battleship-app">
            <h1>Battleship Game</h1>

            {!allShipsPlaced && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>Place your ships:</h3>
                    <p>Current: {availableShips[currentShip]?.name} (Length: {availableShips[currentShip]?.length})</p>
                    <button onClick={() => setShipDirection(shipDirection === 'horizontal' ? 'vertical' : 'horizontal')}>
                        Direction: {shipDirection}
                    </button>
                    <button onClick={resetShips} style={{ marginLeft: '10px' }}>
                        Reset Ships
                    </button>
                </div>
            )}

            {allShipsPlaced && (
                <div style={{ marginBottom: '20px' }}>
                    <h3>All ships placed! Ready to battle!</h3>
                </div>
            )}

            <div className="game-container">
                <div>
                    <h3>Your Board</h3>
                    <div className="game-board">
                        {createBoard(playerBoard, !allShipsPlaced)}
                    </div>
                </div>
                <div>
                    <h3>Enemy Board</h3>
                    <div className="game-board">
                        {createBoard(enemyBoard, false)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;