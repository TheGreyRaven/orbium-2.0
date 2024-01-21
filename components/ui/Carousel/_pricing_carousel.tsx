'use client';

import React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "./carousel"

const PricingCarousel = ({ children } : { children: any }) => {
    
    return (
        <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
                {React.Children.map(children, child => (
                    <CarouselItem>
                        {React.cloneElement(child, {style: {...child.props.style}})}
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}

export { PricingCarousel }