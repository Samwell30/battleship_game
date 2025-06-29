import React from 'react';
import './App.css';
import GameBoard from './components/Gameboard';
import ShipPlacement from './components/ShipPlacement';
import AttackMode from './components/AttackMode';

function App() {
    const [playerBoard, setPlayerBoard] = React.useState(
        Array(6).fill().map(() => Array(6).fill('water'))
    );

    const [enemyBoard, setEnemyBoard] = React.useState(
        Array(6).fill().map(() => Array(6).fill('water'))
    );

    const [enemyShips, setEnemyShips] = React.useState(
        Array(6).fill().map((_, row) => Array(6).fill().map((_, col) => {
            if ((row === 1 && col === 1) || 
                (row === 3 && (col === 2 || col === 3)) || 
                (row === 5 && (col === 0 || col === 1 || col === 2))) {
                return 'ship';
            }
            return 'water';
        }))
    );

    const [gameMode, setGameMode] = React.useState('placement');

    const ships = [
        { name: 'Patrol Boat', length: 1, placed: false },
        { name: 'Destroyer', length: 2, placed: false },
        { name: 'Submarine', length: 3, placed: false }
    ];

    const [availableShips, setAvailableShips] = React.useState(ships);
    const [currentShip, setCurrentShip] = React.useState(0);
    const [shipDirection, setShipDirection] = React.useState('horizontal');

    const canPlaceShip = (row, col, length, direction) => {
        if (direction === 'horizontal') {
            if (col + length > 6) return false;
            for (let i = 0; i < length; i++) {
                if (playerBoard[row][col + i] !== 'water') return false;
            }
        } else {
            if (row + length > 6) return false;
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

            setAvailableShips(prev => {
                const updated = [...prev];
                updated[currentShip].placed = true;
                return updated;
            });

            if (currentShip < availableShips.length - 1) {
                setCurrentShip(currentShip + 1);
            }
        }
    };

    const attackCell = (row, col) => {
        if (enemyBoard[row][col] !== 'water' && enemyBoard[row][col] !== 'ship') {
            return;
        }

        setEnemyBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[row] = [...newBoard[row]];
            
            if (enemyShips[row][col] === 'ship') {
                newBoard[row][col] = 'hit';
            } else {
                newBoard[row][col] = 'miss';
            }
            
            return newBoard;
        });
    };

const resetShips = () => {
        setPlayerBoard(Array(6).fill().map(() => Array(6).fill('water')));
        setEnemyBoard(Array(6).fill().map(() => Array(6).fill('water'))); // Clear enemy board
        setAvailableShips(ships.map(ship => ({ ...ship, placed: false })));
        setCurrentShip(0);
        setGameMode('placement');
        
        // Reset enemy ships to their original positions
        setEnemyShips(
            Array(6).fill().map((_, row) => Array(6).fill().map((_, col) => {
                if ((row === 1 && col === 1) || 
                    (row === 3 && (col === 2 || col === 3)) || 
                    (row === 5 && (col === 0 || col === 1 || col === 2))) {
                    return 'ship';
                }
                return 'water';
            }))
        );
    };
    
    const startBattle = () => {
        setGameMode('attack');
    };

    const allShipsPlaced = availableShips.every(ship => ship.placed);

    return (
        <div className="battleship-app">
            <h1>Battleship Game</h1>

            {gameMode === 'placement' && (
                <ShipPlacement
                    currentShip={currentShip}
                    availableShips={availableShips}
                    shipDirection={shipDirection}
                    setShipDirection={setShipDirection}
                    resetShips={resetShips}
                    allShipsPlaced={allShipsPlaced}
                    startBattle={startBattle}
                />
            )}

            {gameMode === 'attack' && (
                <AttackMode resetShips={resetShips} />
            )}

            <div className="game-container">
                <GameBoard
                    board={playerBoard}
                    isClickable={gameMode === 'placement'}
                    isEnemyBoard={false}
                    onCellClick={placeShip}
                    title="Your Board"
                />
                <GameBoard
                    board={enemyBoard}
                    isClickable={gameMode === 'attack'}
                    isEnemyBoard={true}
                    onCellClick={attackCell}
                    title="Enemy Board"
                />
            </div>
        </div>
    );
}

export default App;