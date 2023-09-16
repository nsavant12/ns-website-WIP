import React from 'react'
import {motion} from "framer-motion";


type Props = {
    directionLeft?: boolean;
    iconUrl: string;
    proficiency: string;
  };
  



  const Skill = ({ directionLeft, iconUrl, proficiency }: Props) => {
    const skillsData = [
        { name: 'HTML', proficiency: '90%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/html-1.svg' },
        { name: 'CSS', proficiency: '95%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/css-3.svg' },
        { name: 'Python', proficiency: '80%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
        { name: 'Java', proficiency: '70%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/java-14.svg' },
        { name: 'JavaScript', proficiency: '60%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/logo-javascript.svg' },
        { name: 'TypeScript', proficiency: '55%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/typescript.svg' },
        { name: 'Next.js', proficiency: '75%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/next-js.svg' },
        { name: 'React', proficiency: '75%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/react-2.svg' },
      ];
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
        src={iconUrl}
        className='rounded-full border border-gray-500 object-cover w-16 h-16 md:w-24 md:h-24  xl:w-32 xl:h-32 
        filter group-hover:grayscale transition duration-300 ease-in-out'
        />
        <div className='absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-16 w-16 md:h-24 md:w-24 xl:w-32 xl:h-32 rounded-full z-0'>
            <div className='flex items-center justify-center h-full'>
                <p className='text-3xl font-bold text-black opacity-100'>{proficiency}</p>
            </div>
        </div>
    </div>
  )
}

export default Skill
