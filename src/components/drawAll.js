import React from 'react';

function DrawAll(props) {
    function toggleDrawAll() {
        props.flock.drawOnAll = !props.flock.drawOnAll;
    }

    return (
        <div>
            <button onClick={toggleDrawAll}>Draw All</button>
        </div>);
}

export default DrawAll;