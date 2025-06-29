import React from 'react';

const ShipPlacement = ({ 
    currentShip, 
    availableShips, 
    shipDirection, 
    setShipDirection, 
    resetShips, 
    allShipsPlaced, 
    startBattle 
}) => {
    if (allShipsPlaced) {
        return (
            <div style={{ marginBottom: '20px' }}>
                <h3>All ships placed!</h3>
                <button onClick={startBattle}>Start Battle!</button>
            </div>
        );
    }

    return (
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
    );
};

export default ShipPlacement;