import React from 'react';

const GameBoard = ({ board, isClickable, isEnemyBoard, onCellClick, title }) => {
    const getCellColor = (cellState) => {
        switch (cellState) {
            case 'ship': return '#8B4513';
            case 'hit': return '#FF0000';
            case 'miss': return '#333333';
            case 'water': return '#87CEEB';
            default: return '#87CEEB';
        }
    };

    const createBoard = () => {
        const cells = [];
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
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
                        onClick={isClickable ? () => onCellClick(row, col) : undefined}
                    >
                        {row},{col}
                    </div>
                );
            }
        }
        return cells;
    };

    return (
        <div>
            <h3>{title}</h3>
            <div className="game-board">
                {createBoard()}
            </div>
        </div>
    );
};

export default GameBoard;