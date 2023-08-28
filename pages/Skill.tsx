import React from 'react'
import {motion} from "framer-motion";


type Props = {
    directionLeft?: boolean;
};

const Skill = ({directionLeft}: Props) => {
  return (
    <div className='group relative flex cursor-pointer'>
        <motion.img 
        initial={{
            y: directionLeft ? -150 : 150, 
            opacity: 0,
        }}
        transition={{duration:1}}
        whileInView={{opacity:1, y:0}}
        viewport={{once: true}}
        src='https://cdn.worldvectorlogo.com/logos/html-1.svg'
        className='rounded-full border border-gray-500 object-cover w-16 h-16 md:w-24 md:h-24  xl:w-32 xl:h-32 
        filter group-hover:grayscale transition duration-300 ease-in-out'
        />
        <div className='absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-16 w-16 md:h-24 md:w-24 xl:w-32 xl:h-32 rounded-full z-0'>
            <div className='flex items-center justify-center h-full'>
                <p className='text-3xl font-bold text-black opacity-100'>90%</p>
            </div>
        </div>
    </div>
  )
}

export default Skill