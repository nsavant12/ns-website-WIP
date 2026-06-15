import React from 'react'
import { motion } from "framer-motion";
import { IconType } from "react-icons";

type Props = {
  directionLeft?: boolean;
  icon: IconType;
  color: string;
  proficiency: string;
};

const Skill = ({ directionLeft, icon: Icon, color, proficiency }: Props) => {
  return (
    <div className='group relative flex cursor-pointer'>
      <motion.div
        initial={{ y: directionLeft ? -150 : 150, opacity: 0 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='rounded-full border border-gray-500 w-14 h-14 md:w-20 md:h-20 xl:w-28 xl:h-28
        filter group-hover:grayscale transition duration-300 ease-in-out
        flex items-center justify-center'
      >
        <Icon className="text-3xl md:text-4xl xl:text-5xl" style={{ color }} />
      </motion.div>
      <div className='absolute opacity-0 group-hover:opacity-80 transition duration-300 ease-in-out group-hover:bg-white h-14 w-14 md:h-20 md:w-20 xl:w-28 xl:h-28 rounded-full z-0'>
        <div className='flex items-center justify-center h-full'>
          <p className='text-lg md:text-xl xl:text-2xl font-bold text-black opacity-100'>{proficiency}</p>
        </div>
      </div>
    </div>
  )
}

export default Skill
