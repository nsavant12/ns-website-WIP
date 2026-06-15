import React from 'react';
import {
  SiPython,
  SiTypescript,
  SiReact,
  SiDocker,
  SiTensorflow,
  SiNodedotjs,
  SiAmazonaws,
  SiLit,
} from "react-icons/si";
import { IconType } from "react-icons";
import { motion } from "framer-motion";

type TechEntry = {
  icon: IconType;
  color: string;
  label: string;
};

const techIconMap: Record<string, TechEntry> = {
  "Python":       { icon: SiPython,     color: "#3776AB", label: "Python" },
  "TypeScript":   { icon: SiTypescript, color: "#3178C6", label: "TypeScript" },
  "React":        { icon: SiReact,      color: "#61DAFB", label: "React" },
  "React Native": { icon: SiReact,      color: "#61DAFB", label: "React Native" },
  "Docker":       { icon: SiDocker,     color: "#2496ED", label: "Docker" },
  "TensorFlow":   { icon: SiTensorflow, color: "#FF6F00", label: "TensorFlow" },
  "Node.js":      { icon: SiNodedotjs,  color: "#339933", label: "Node.js" },
  "AWS":          { icon: SiAmazonaws,  color: "#FF9900", label: "AWS" },
  "LitJS":        { icon: SiLit,        color: "#324FFF", label: "Lit" },
};

type Props = {
  companyName: string;
  jobTitle: string;
  dates: string;
  responsibilities: string[];
  technologies?: string[];
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

          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3 justify-center md:justify-start">
              {technologies.map((tech) => {
                const entry = techIconMap[tech];
                if (!entry) return null;
                const Icon = entry.icon;
                return (
                  <div key={tech} title={entry.label}>
                    <Icon size={28} style={{ color: entry.color }} />
                  </div>
                );
              })}
            </div>
          )}

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
