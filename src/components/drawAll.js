import React from 'react';

function DrawAll(props) {
    function toggleDrawAll() {
        props.bunch.drawOnAll = !props.bunch.drawOnAll;
    }

    return (
        <div>
            <button onClick={toggleDrawAll}>Draw All</button>
        </div>);
}

export default DrawAll;