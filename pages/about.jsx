import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {Cursor, useTypewriter} from "react-simple-typewriter";
import { AiFillGithub, AiFillInstagram, AiFillTwitterCircle } from 'react-icons/ai';

// CSS styles
const wavyStyles = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  animation: 'wavy 5s linear infinite'
};

const keyframes = `
  @keyframes wavy {
    0% { transform: rotate(0deg); }
    50% { transform: rotate(180deg); }
    100% { transform: rotate(360deg); }
  }
`;

function about({ text, me }) {
  return (
    <div className="h-screen mx-auto mt-16 relative overflow-hidden">
      <style>
        {keyframes}
      </style>

      <div className="absolute top-0 left-0 right-0 bottom-0 z-[-1]">
        <div className="h-full w-full rounded-full" style={wavyStyles}></div>
      </div>

      <h2 className="italic tracking-[20px] animate-pulse text-5xl py-2 bg-gradient-to-r from-sky-400 to-sky-600 font-medium inline-block text-transparent bg-clip-text">
        Nikhil Savant
      </h2>

      <h3 className="bottom-10 font-mono z-0 text-4xl pb-10 py-2 bg-gradient-to-r from-pink-400 to-sky-400 font-medium text-transparent bg-clip-text">
        <span>{text}</span>
        <Cursor cursorColor="#FFFFFF" />
      </h3>

      <Image src={me} className="rounded-full w-64 h-64 mx-auto z-40" />
      <motion.div initial={{opacity:0}}
              whileInView={{opacity:1}}
              transition={{ duration:6 }} className='text-5xl flex justify-center gap-16 py-3 pb-16 pt-10'>
                <motion>
                 
                <a href='https://github.com/nsavant12' target="_blank">
                
                <AiFillGithub className='hover:animate-bounce text-white'/>
                </a>
                </motion>
                <a href='https://www.instagram.com/nikhilsavant1/' target="_blank">
                <AiFillInstagram className='hover:animate-bounce text-white'/>
                </a>
                <a href='https://twitter.com/nikhil_savant14' target="_blank">
                <AiFillTwitterCircle className='hover:animate-bounce text-white' id='photos'/>
                </a>
                </motion.div>

    </div>
  );
}

export default about;
