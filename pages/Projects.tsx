import React from "react";
import {motion} from "framer-motion";

type Props = {};

const Projects = ({}: Props) => {
  const projects = [1, 2, 3, 4, 5];
  const i = 0;
  return (
    <motion.div
    initial={{opacity:0}}
    whileInView={{opacity:1}}
    transition={{duration:1.5}}
    className="h-screen relative flex overflow-hidden flex-col text-left md:flex-row max-w-full justify-evenly mx-auto items-center z-0">
      <div className="relative w-full flex overflow-x-scroll overflow-y-hidden snap-x snap-mandatory z-20 ">
        {projects.map((project) => (
          <div
            key={project}
            className="w-screen flex-shrink-0 snap-center  flex flex-col space-y-5
          items-center justify-center p-20 md:p-44 h-screen"
          >
            <motion.img
              initial={{
                y: -300,
                opacity: 0
              }}
              transition={{ duration: 1.2 }}
              whileInView={{ opacity:1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl"
              src="https://nakedsecurity.sophos.com/wp-content/uploads/sites/2/2021/11/fr-1200.png"
            />

            <div className="space-y-10 px-0 md:px-10 max-w-6xl">
              <h4 className="text-white font-semibold text-center">
                <span>Case Study {i+1} of {projects.length}:</span> Attendance Project
              </h4>
              <div className="flex-col text-white pb-40 text-center">
              <p>This application takes webcam input to detect any recognized faces. By uploading reference photos to the program, it will then be able to detect whether or not its the person in the reference photo, it then documents the name on file and the time they were detected present.</p>
              <p className="pt-5">Skills used: Python, OpenCV, Face Recognition, Tkinter</p>
              </div>
            </div>
          </div>
        ))}
        {/* projects */}
        {/* projects */}
      </div>
    </motion.div>
  );
};

export default Projects;
