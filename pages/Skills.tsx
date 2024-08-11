import React from 'react'
import {motion} from 'framer-motion';
import Skill from "./Skill";
type Props = {}

function Skills({}: Props) {
  const skillsData = [
    { name: 'HTML', proficiency: '90%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/html-1.svg' },
    { name: 'CSS', proficiency: '95%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/css-3.svg' },
    { name: 'Python', proficiency: '65%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/python-5.svg' },
    { name: 'Java', proficiency: '70%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/java-14.svg' },
    { name: 'JavaScript', proficiency: '50%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/logo-javascript.svg' },
    { name: 'TypeScript', proficiency: '50%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/typescript.svg' },
    { name: 'Next.js', proficiency: '60%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/next-js.svg' },
    { name: 'React', proficiency: '65%', iconUrl: 'https://cdn.worldvectorlogo.com/logos/react-2.svg' },
  ];
  return (
    
    <motion.div 
    initial={{opacity:0}}
    whileInView={{opacity:1}}
    transition={{duration:1.5}}
    className='text-center text-white visible'>
        <h3 className='tracking-[3px] uppercase text-xl top-36 pt-10'>Hover over a skill for current proficiency</h3>
        <div className='flex pt-10'>
        <div className='grid grid-cols-4 gap-5 mx-auto'>
          {skillsData.map((skill, index) => (
            <Skill
              key={index}
              iconUrl={skill.iconUrl}
              proficiency={skill.proficiency}
              directionLeft={index % 2 !== 0}
            />
          ))}
        </div>
        </div>
    </motion.div>
  )
}

export default Skills
