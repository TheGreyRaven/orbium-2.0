'use client';

import React, { useEffect, useState } from 'react';
import TextTransition, { presets } from 'react-text-transition';

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

    useEffect(() => {
        const interval = setInterval(() => setIndex((index) => index + 1), 3000)

        return () => clearTimeout(interval)
    }, [])

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-extrabold text-white sm:text-6xl">A better way to</h2>
            <TextTransition springConfig={presets.wobbly}>
                <h2 className="text-2xl font-extrabold text-white sm:text-6xl">{SWITCHABLE_TEXT[index % SWITCHABLE_TEXT.length]}</h2>
            </TextTransition>
            <h2 className="text-2xl font-extrabold text-white sm:text-6xl">Using <span className="text-orange-500">Orbium</span></h2>
        </div>
    )
}

export { LoopingText };