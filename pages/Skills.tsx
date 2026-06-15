import React from 'react'
import { motion } from 'framer-motion';
import {
  SiPython, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiHtml5, SiCss3,
  SiGo, SiCplusplus, SiSwift, SiNodedotjs, SiAngular, SiDocker, SiAmazonaws,
  SiGit, SiMongodb, SiTensorflow,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import Skill from "./Skill";

type Props = {}

const skillsData = [
  { icon: SiHtml5,      color: "#E34F26", proficiency: "90%" },
  { icon: SiCss3,       color: "#1572B6", proficiency: "95%" },
  { icon: SiPython,     color: "#3776AB", proficiency: "65%" },
  { icon: FaJava,       color: "#ED8B00", proficiency: "70%" },
  { icon: SiJavascript, color: "#F7DF1E", proficiency: "50%" },
  { icon: SiTypescript, color: "#3178C6", proficiency: "50%" },
  { icon: SiNextdotjs,  color: "#ffffff", proficiency: "60%" },
  { icon: SiReact,      color: "#61DAFB", proficiency: "65%" },
  { icon: SiGo,         color: "#00ADD8", proficiency: "50%" },
  { icon: SiCplusplus,  color: "#00599C", proficiency: "55%" },
  { icon: SiSwift,      color: "#FA7343", proficiency: "40%" },
  { icon: SiNodedotjs,  color: "#339933", proficiency: "65%" },
  { icon: SiAngular,    color: "#DD0031", proficiency: "45%" },
  { icon: SiDocker,     color: "#2496ED", proficiency: "60%" },
  { icon: SiAmazonaws,  color: "#FF9900", proficiency: "50%" },
  { icon: SiGit,        color: "#F05032", proficiency: "85%" },
  { icon: SiMongodb,    color: "#47A248", proficiency: "55%" },
  { icon: SiTensorflow, color: "#FF6F00", proficiency: "50%" },
];

function renderSkill(skill: typeof skillsData[0], index: number, directionLeft: boolean) {
  return (
    <Skill
      key={index}
      icon={skill.icon}
      color={skill.color}
      proficiency={skill.proficiency}
      directionLeft={directionLeft}
    />
  );
}

function Skills({}: Props) {
  const COLS = 4;
  const fullCount = Math.floor(skillsData.length / COLS) * COLS;
  const mainSkills = skillsData.slice(0, fullCount);
  const remaining = skillsData.slice(fullCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className='text-center text-white visible'
    >
      <h3 className='tracking-[3px] uppercase text-xl top-36 pt-10'>Hover over a skill for current proficiency</h3>
      <div className='flex pt-10'>
        <div className='grid grid-cols-4 gap-5 mx-auto'>
          {/* Full rows */}
          {mainSkills.map((skill, index) =>
            renderSkill(skill, index, index % 2 !== 0)
          )}

          {/* Partial last row — centered in cols 2 & 3 */}
          {remaining.length === 1 && (
            <>
              <div />
              <div className="col-span-2 flex justify-center">
                {renderSkill(remaining[0], fullCount, false)}
              </div>
              <div />
            </>
          )}

          {remaining.length === 2 && (
            <>
              <div />
              <div className="flex justify-center">
                {renderSkill(remaining[0], fullCount, false)}
              </div>
              <div className="flex justify-center">
                {renderSkill(remaining[1], fullCount + 1, true)}
              </div>
              <div />
            </>
          )}

          {remaining.length === 3 && (
            <>
              <div />
              <div className="flex justify-center">
                {renderSkill(remaining[0], fullCount, false)}
              </div>
              <div className="flex justify-center">
                {renderSkill(remaining[1], fullCount + 1, true)}
              </div>
              <div />
              <div />
              <div className="col-span-2 flex justify-center">
                {renderSkill(remaining[2], fullCount + 2, false)}
              </div>
              <div />
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Skills
