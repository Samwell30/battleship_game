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
    const [currentTurn, setCurrentTurn] = React.useState('player'); // 'player' or 'cpu'
    const [gameOver, setGameOver] = React.useState(false);
    const [winner, setWinner] = React.useState(null);

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

    // Check if all ships on a board are sunk
    const checkGameOver = (board, ships) => {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                if (ships[row][col] === 'ship' && board[row][col] !== 'hit') {
                    return false; // Found a ship that hasn't been hit
                }
            }
        }
        return true; // All ships have been hit
    };

    // CPU attack function
    const cpuAttack = React.useCallback(() => {
        if (currentTurn !== 'cpu' || gameOver) return;

        // Find all available cells to attack
        const availableCells = [];
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                if (playerBoard[row][col] === 'water' || playerBoard[row][col] === 'ship') {
                    availableCells.push({ row, col });
                }
            }
        }

        if (availableCells.length === 0) return;

        // Choose a random cell to attack
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const { row, col } = availableCells[randomIndex];

        setPlayerBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[row] = [...newBoard[row]];
            
            if (newBoard[row][col] === 'ship') {
                newBoard[row][col] = 'hit';
            } else {
                newBoard[row][col] = 'miss';
            }
            
            return newBoard;
        });

        // Check if CPU won
        setTimeout(() => {
            setPlayerBoard(currentPlayerBoard => {
                if (checkGameOver(currentPlayerBoard, currentPlayerBoard)) {
                    setGameOver(true);
                    setWinner('CPU');
                } else {
                    setCurrentTurn('player');
                }
                return currentPlayerBoard;
            });
        }, 1000);
    }, [currentTurn, gameOver, playerBoard]);

    // Trigger CPU attack when it's CPU's turn
    React.useEffect(() => {
        if (currentTurn === 'cpu' && gameMode === 'attack' && !gameOver) {
            const timer = setTimeout(() => {
                cpuAttack();
            }, 1500); // 1.5 second delay for CPU attack
            
            return () => clearTimeout(timer);
        }
    }, [currentTurn, gameMode, gameOver, cpuAttack]);

    const attackCell = (row, col) => {
        if (currentTurn !== 'player' || gameOver) return;
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

        // Check if player won, then switch turns
        setTimeout(() => {
            setEnemyBoard(currentEnemyBoard => {
                if (checkGameOver(currentEnemyBoard, enemyShips)) {
                    setGameOver(true);
                    setWinner('Player');
                } else {
                    setCurrentTurn('cpu');
                }
                return currentEnemyBoard;
            });
        }, 500);
    };

const resetShips = () => {
        setPlayerBoard(Array(6).fill().map(() => Array(6).fill('water')));
        setEnemyBoard(Array(6).fill().map(() => Array(6).fill('water'))); // Clear enemy board
        setAvailableShips(ships.map(ship => ({ ...ship, placed: false })));
        setCurrentShip(0);
        setGameMode('placement');
        setCurrentTurn('player');
        setGameOver(false);
        setWinner(null);
        
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
        setCurrentTurn('player');
        setGameOver(false);
        setWinner(null);
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
                <AttackMode 
                    resetShips={resetShips} 
                    currentTurn={currentTurn}
                    gameOver={gameOver}
                    winner={winner}
                />
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
                    isClickable={gameMode === 'attack' && currentTurn === 'player' && !gameOver}
                    isEnemyBoard={true}
                    onCellClick={attackCell}
                    title="Enemy Board"
                />
            </div>
        </div>
    );
}

export default App;