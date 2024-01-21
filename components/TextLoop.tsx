'use client';

import React, { useState } from 'react';
import { useTransition, animated } from '@react-spring/web'

const SWITCHABLE_TEXT = [
    'license your software',
    'authenticate customers',
    'load remote DLLs',
    'improve security',
    'connect your forum',
    'make life easier'
];

const LoopingText = () => {
    const [index, setIndex] = useState(0)   
    const transitions = useTransition(index, {
        key: index,
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 2000 },
        onRest: (_a, _b, item) => {
          if (index === item) {
            setIndex(state => (state + 1) % SWITCHABLE_TEXT.length)
          }
        },
        exitBeforeEnter: true,
    })

    return (
        <div className="flex flex-col">
            <h2 className="text-3xl font-extrabold text-white sm:text-6xl">A better way to</h2>
                {transitions((style, i) => (
                    <animated.div style={style}>
                        <h2 className="text-3xl font-extrabold text-white sm:text-6xl">{SWITCHABLE_TEXT[i]}</h2>
                    </animated.div>
                ))}
            <h2 className="text-3xl font-extrabold text-white sm:text-6xl">Using <span className="text-custom-orange">Orbium</span></h2>
        </div>
    )
}

export { LoopingText };