import React from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { motion } from "framer-motion";

type Props = {
  companyName: string;
  jobTitle: string;
  dates: string;
  responsibilities: string[];
  technologies?: string;
}

function ExperienceCards({ companyName, jobTitle, dates, responsibilities, technologies }: Props) {
  return (
    <article className='opacity-80 hover:opacity-100 cursor-pointer transition-opacity duration-200 snap-center flex flex-col flex-shrink-0 w-[330px] md:w-[420px] xl:w-[580px] overflow-hidden my-4'>
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 h-full flex flex-col">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          transition={{ duration: 1.0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
        </motion.div>

        <div className="flex-grow text-center md:text-left">
          <h5 className="mb-1 text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{companyName}</h5>
          <h1 className='dark:text-white text-lg md:text-xl opacity-80'>{jobTitle}</h1>
          <h2 className='uppercase text-xs md:text-sm dark:text-white opacity-60 pb-3'>{dates}</h2>
          
          {technologies && (
            <p className="text-xs md:text-sm text-gray-700 dark:text-gray-400 mb-3 italic text-center md:text-left">
              Technologies: {technologies}
            </p>
          )}
          
          {/* Check if responsibilities is an array and has items before mapping */}
          {Array.isArray(responsibilities) && responsibilities.length > 0 && (
            <ul className="space-y-2 ml-5 list-disc mb-3 font-normal text-sm md:text-base dark:text-gray-300 opacity-90 text-left">
              {responsibilities.map((point, index) => (
                <li key={index} className='pb-1'>{point}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}

export default ExperienceCards;
