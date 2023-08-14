import React from "react";
import './bouncyLoader.scss';

export default function BouncyLoader(props) {
    return(<div className='bouncy-container'>
            <div className='bouncy'></div>
            <div className='bouncy dark'></div>
            <div className='bouncy lightest'></div>
        </div>
    )
}