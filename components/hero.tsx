"use client";

import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const Hero = () => {

    const imageRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const imageElement = imageRef.current

        const handleScroll = () => {
            const scrollPosition = window.scrollY
            const scrollThreshold = 100

            if(scrollPosition > scrollThreshold) {
                imageElement?.classList.add("scrolled")
            } else {
                imageElement?.classList.remove("scrolled")
            }
        }
        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className='pb-20 px-4'>
            <div className='container mx-auto text-center'>
                <h1 className='text-5xl md:text-8xl lg:text-[105px] pb-6 gradient-title'>
                    Manage Your Finances <br /> with Intelligence
                </h1>
                <p className='text-xl text-gray-600 mb-5 max-w-2xl mx-auto'>
                    An AI-powered financial management platform that helps
                    you track, analyze, and optimize your spending with real-time insights.
                </p>
                <div className='flex justify-center space-x-4'>
                    <Link href={"/dashboard"}>
                        <Button size={"lg"} className='px-8'>
                            Get Started
                        </Button>
                    </Link>
                    <Link href={"/"}>
                        <Button variant={"outline"} size={"lg"} className='px-8'>
                            Watch Demo
                        </Button>
                    </Link>
                </div>
            </div>
            <div className='hero-image-wrapper'>
                <div ref={imageRef} className='hero-image'>
                    <Image
                        className='rounded-lg shadow-2xl border mx-auto'
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1611&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        width={1280}
                        height={720}
                        alt='Dashboard preview'/>
                </div>
            </div>
        </div>
    )
}

export default Hero
