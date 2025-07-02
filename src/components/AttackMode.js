import React from 'react';

const AttackMode = ({ resetShips, currentTurn, gameOver, winner }) => {
    const getTurnMessage = () => {
        if (gameOver) {
            return `🎉 Game Over! ${winner} wins! 🎉`;
        }
        return currentTurn === 'player' ? "🎯 Your turn - Click on enemy board to attack!" : "🤖 CPU is thinking...";
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <h3>{getTurnMessage()}</h3>
            <p>Red = Hit, Dark Gray = Miss</p>
            <button onClick={resetShips} style={{ marginLeft: '10px' }}>
                New Game
            </button>
        </div>
    );
};

export default AttackMode;