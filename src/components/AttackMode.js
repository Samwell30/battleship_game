import React from 'react';

const AttackMode = ({ resetShips }) => {
    return (
        <div style={{ marginBottom: '20px' }}>
            <h3>Attack Mode - Click on enemy board to attack!</h3>
            <p>Red = Hit, Dark Gray = Miss</p>
            <button onClick={resetShips} style={{ marginLeft: '10px' }}>
                New Game
            </button>
        </div>
    );
};

export default AttackMode;