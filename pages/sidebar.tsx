import React, { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";
import { AiOutlineMenu } from "react-icons/ai";
import {
  SlSocialGithub,
  SlSocialInstagram,
  SlSocialLinkedin,
} from "react-icons/sl";

function sidebar({ isOpen, setIsOpen }) {
  const variants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: "-100%" },
  };

  return (
    <div>
      <motion.div whileHover={{ scale: 1.25 }} className="text-center">
        <button className="invisible text-white py-2.5" type="button">
          <AiOutlineMenu />
        </button>
      </motion.div>

      <motion.div
        id="drawer-navigation"
        className="md:rounded-br-3xl md:rounded-tr-3xl text-center text-white visible fixed top-0 left-0 z-40 w-full md:w-96 h-screen p-4 overflow-y-hidden  -translate-x-full bg-gradient-to-r from-red-200 to-orange-300 "
        aria-labelledby="drawer-navigation-label"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.5, ease: "easeOut" }}
        variants={variants}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <h5
            id="drawer-navigation-label"
            className="text-3xl font-bold text-white uppercase "
          >
            Menu
          </h5>
        </motion.div>
        <button
          type="button"
          className="text-red-500 text-2xl bg-transparent rounded-lg  p-1.5 absolute top-2.5 left-5 inline-flex items-center"
          onClick={() => setIsOpen(false)}
        >
          <i className="bi bi-x-lg pt-1"></i>
          <span className="sr-only">Close menu</span>
        </button>
        <motion.div className="py-4 overflow-y-auto md:overflow-y-hidden flex flex-col justify-between h-full">
          <ul className=" flex flex-col justify-between h-full space-y-2 font-medium">
            <li>
              <button className="pt-10" type="button">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="home"
                  offset={0}
                  className="text-2xl flex items-center p-2 rounded-lg text-white"
                >
                  <i className="bi bi-house "></i>
                  <span className="ml-3">Home</span>
                  <span className="sr-only">Close menu</span>
                </Link>
              </button>
            </li>
            <li>
              <button className="pt-10" type="button">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="about"
                  offset={-150}
                  className="text-2xl flex items-center p-2 rounded-lg text-white"
                >
                  <i className="bi bi-person "></i>
                  <span className="ml-3">About Me</span>
                  <span className="sr-only">Close menu</span>
                </Link>
              </button>
            </li>
            <li>
              <button className="pt-10" type="button">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="photo"
                  offset={-150}
                  className="text-2xl flex items-center p-2 rounded-lg text-white"
                >
                  <i className="bi bi-camera "></i>
                  <span className="ml-3">Photos</span>
                  <span className="sr-only">Close menu</span>
                </Link>
              </button>
            </li>
            <li>
              <button className="pt-10" type="button">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="skills"
                  offset={0}
                  className="text-2xl flex items-center p-2 rounded-lg text-white"
                >
                  <i className="bi bi-code-square "></i>
                  <span className="ml-3">Skills</span>
                  <span className="sr-only">Close menu</span>
                </Link>
              </button>
            </li>
            <li>
              <button className="pt-10" type="button">
                <Link
                  onClick={() => setIsOpen(false)}
                  to="experience"
                  offset={0}
                  className="text-2xl flex items-center p-2 rounded-lg text-white"
                >
                  <i className="bi bi-briefcase "></i>
                  <span className="ml-3">Experience</span>
                  <span className="sr-only">Close menu</span>
                </Link>
              </button>
            </li>
            </ul>
            <div
                
                className="visible lg:invisible text-4xl flex flex-row justify-center gap-16 py-3 pb-16 pt-10"
              >
                  <a href="https://github.com/nsavant12" target="_blank">
                    <SlSocialGithub className="hover:animate-bounce text-white" />
                  </a>
                <a
                  href="https://www.instagram.com/nikhilsavant1/"
                  target="_blank"
                >
                  <SlSocialInstagram className="hover:animate-bounce text-white" />
                </a>
                <a href="https://linkedin.com/in/nikhil-savant" target="_blank">
                  <SlSocialLinkedin
                    className="hover:animate-bounce text-white"
                    id="photos"
                  />
                </a>
              </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default sidebar;
