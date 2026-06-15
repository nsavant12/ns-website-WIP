import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { BsFillMoonStarsFill } from "react-icons/bs";
import {
  SlSocialGithub,
  SlSocialInstagram,
  SlSocialLinkedin,
  SlMenu,
} from "react-icons/sl";
import Image from "next/image";
import image from "../public/IMG_20210620_203444.jpg";
import image2 from "../public/IMG_20210707_170928.jpg";
import image3 from "../public/IMG_20210629_202206.jpg";
import image4 from "../public/project.png";
import image5 from "../public/sunset.jpg";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import image7 from "../public/desert.jpg";
import { Link } from "react-scroll";
import image8 from "../public/summer.jpg";
import ExperienceCards from "./ExperienceCards"; 
import Sidebar from "./sidebar";
import Projects from "./Projects";
import { motion, useScroll } from "framer-motion";
import me_2 from "../public/me_2.jpg";
import SkillsSection from "./SkillsSection";
import Skills from "./Skills";
import Stock from "./Stocks";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const workExperiences = [
  {
    companyName: "Cisco",
    jobTitle: "Software Engineering Intern",
    dates: "May - Aug 2026",
    technologies: ["TypeScript", "Python", "LitJS"],
    responsibilities: [
      "Designed and implemented scalable, user-focused features for Cisco's infrastructure management platform, Intersight.",
      "Developed AI automation tools for the auto-generation of web UI components based on user prompts and to streamline testing and deployment cycles.",
    ],
  },
  {
    companyName: "Algo Analytics",
    jobTitle: "Full Stack Engineer Intern",
    dates: "Jun - Oct 2025",
    technologies: ["TypeScript", "React Native", "Node.js"],
    responsibilities: [
      "Developed a TypeScript based backend integration layer to connect the React Native client with financial API's, aggregating real-time stock data and reducing client-side parsing times by 30%.",
      "Implemented RESTful API controllers to serialize and sanitize high-throughput financial data streams, successfully processing 100,000+ data points daily while achieving a 300ms API response time.",
      "Developed scalable backend services that utilized JWT authentication and Axios interceptors for secure session management, optimizing JSON payload sizes by 20% and ensuring zero-downtime token refresh cycles.",
    ],
  },
  {
    companyName: "StellarPay",
    jobTitle: "Software Engineering Intern",
    dates: "Jun - Aug 2025",
    technologies: ["TypeScript", "Node.js", "AWS"],
    responsibilities: [
      "Built a GPT-powered financial assistant in TypeScript/Node.js, leveraging a Retrieval-Augmented Generation (RAG) system with engineered prompts to deliver precise, context-aware insights.",
      "Refactored front-end codebase and components improving component reusability and load times, reducing code duplication by 25% and load times by 20%.",
      "Enhanced retrieval precision by 40% using AWS Textract for document ingestion and OpenAI Embeddings with Pinecone for high-performance semantic search.",
      "Implemented end-to-end security protocols across AWS services, including IAM role-based access control, encrypted data storage with AWS KMS (AES-256), and API Gateway authorization layers using JWTs.",
    ],
  },
  {
    companyName: "UIUC Startup",
    jobTitle: "Technical Backend Lead",
    dates: "Mar - Nov 2025",
    technologies: ["Python", "Docker", "TensorFlow", "Node.js"],
    responsibilities: [
      "Led backend development for the recommendation system for our startup's new approach to online shopping, through a focus on shoppers behaviors.",
      "Developed and deployed containerized microservices using Docker for our ML inference API, integrating with CI/CD pipelines to ensure robust and automated model updates.",
      "Optimized the ALS matrix factorization algorithm using clickstream data for implicit feedback, boosting model convergence and achieving a 0.04 improvement in NDCG@10.",
    ],
  },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const expScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = expScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollExp = (dir) => {
    if (!expScrollRef.current) return;
    expScrollRef.current.scrollBy({ left: dir * 620, behavior: "smooth" });
  };
  const [text, count] = useTypewriter({
    words: ["<Student>", "<Programmer>", "<Engineer>"],
    loop: true,
    delaySpeed: 2500,
  });

  return (
    <div>
      <Head>
        <title>NS Portfolio</title>
        <meta name="description" content="Nikhil's Portfolio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.6/flowbite.min.css"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
        ></link>
      </Head>

      <main className="text-gray-300 sm:w-screen overflow-hidden md:w-full px-10 bg-gradient-to-r from-red-200 to-orange-300 font-victor-mono ">
        <section className="relative min-h-screen ">
          <div className="animated absolute w-4/5 h-4/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute top-0 left-1/2 translate-x-[-50%] w-3/5 h-3/5 bg-blue-400 rounded-full mix-blend-multiply filter blur-[30px] opacity-25" />
            <div className="absolute top-1/2 left-0 translate-y-[-50%] w-3/5 h-3/5 bg-sky-300  rounded-full mix-blend-multiply filter blur-[30px] opacity-25" />
            <div className="absolute top-1/2 right-0 translate-y-[-50%] w-3/5 h-3/5 bg-pink-400 rounded-full mix-blend-multiply filter blur-[30px] opacity-25" />
            <div className="absolute bottom-0 left-1/2 translate-x-[-50%] w-3/5 h-3/5  bg-rose-400 rounded-full mix-blend-multiply filter blur-[30px] opacity-25 " />
          </div>
          <nav className=" border-black backdrop-blur-xl pt-5 pb-5 mb-12 flex justify-between navbar navbar-expand-md items-center w-full fixed top-0 right-0 left-0 opacity-[.98] z-40">
            <div className="flex items-center justify-center w-full text-black text-2xl pl-8">
              <motion.div
                whileHover={{ scale: 1.25 }}
                className="text-center absolute left-0"
              >
                <button
                  className="visible text-red-500 pl-5 py-2.5"
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  data-drawer-target="drawer-navigation"
                  data-drawer-show="drawer-navigation"
                  aria-controls="drawer-navigation"
                >
                  <SlMenu />
                </button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer text-2xl font-victor-mono italic font-bold text-white"
              >
                <Link to="home" offset={0} className="cursor-pointer">
                  builtbyNS
                </Link>
              </motion.div>
            </div>
          </nav>
          <div className="z-40 fixed bottom-0 right-0 left-0 justify-center flex flex-row items-center gap-10 backdrop-blur-xl ">
            <div className=" h-[90px] overflow-hidden ">
              <Stock
                settings={{
                  symbol: "NYSE:S",
                  width: "100%",
                  colorTheme: "light",
                  isTransparent: true,
                  locale: "en",
                }}
              />
            </div>
            <div className="h-[90px]  overflow-hidden">
              <Stock
                settings={{
                  symbol: "NASDAQ:AMZN",
                  width: "100%",
                  colorTheme: "light",
                  isTransparent: true,
                  locale: "en",
                }}
              />
            </div>
            <div className="h-[90px] overflow-hidden">
              <Stock
                settings={{
                  symbol: "NASDAQ:AAPL",
                  width: "100%",
                  colorTheme: "light",
                  isTransparent: true,
                  locale: "en",
                }}
              />
            </div>
          </div>
          <div className="invisible lg:visible z-40 fixed top-52 right-5 text-4xl flex flex-col justify-center gap-16 py-3 pb-16 pt-10">
            <motion>
              <a href="https://github.com/nsavant12" target="_blank">
                <SlSocialGithub className="hover:animate-bounce text-white" />
              </a>
            </motion>
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
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 6 }}
            className="text-center pt-16 "
            id="home"
          >
            <div className="min-h-screen mb-20 xl:mb-0 mx-auto mt-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 z-[-1]">
                <div className="h-full w-full rounded-full animate-wavy"></div>
              </div>

              <div className="glitch-wrapper pb-5">
                <div className="glitch" data-glitch="Nikhil Savant">
                  Nikhil Savant {/* [cite: 1] */}
                </div>
              </div>

              <h3 className="bottom-10 font-victor-mono z-0 text-4xl pb-10 py-2 bg-white font-medium text-transparent bg-clip-text">
                <span>{text}</span>
                <Cursor cursorColor="#FFFFFF" />
              </h3>

              <Image
                src={me_2}
                alt="me"
                className="rounded-full w-64 h-64 mx-auto z-40"
              />
            </div>

            <section id="about">
              <h2 className="tracking-[20px] animate-pulse text-4xl md:text-5xl py-2 bg-gradient-to-r from-red-400 to-red-500 font-medium inline-block text-transparent bg-clip-text ">
                About Me
              </h2>
            </section>
            <div className="flex items-center justify-center px-16 pt-10">
              <motion.div className=" relative w-full max-w-2xl bg-contain">
                <p className=" text-md py-5 leading-8 text-white font-extrabold font-victor-mono z-10 opacity-100 ">
                  I am a Sophomore at UIUC majoring in Computer Science and
                  Economics. I enjoy finance, news, tech, cars, and
                  photography and love finding solutions to issues that
                  intersect with my passions
                </p>
              </motion.div>
            </div>

            <motion.img
              initial={{
                x: -200,
                opacity: 0,
              }}
              transition={{
                duration: 3,
              }}
              whileInView={{
                x: 0,
                opacity: 1,
              }}
              viewport={{ once: true }}
              src=" https://graphics.thomsonreuters.com/data/f1/images/cars2021/7c1o39kusorg4ljjlzb40asx5.png"
              className=" mix-blend-saturation top-28 md:top-10"
            />
          </motion.div>
        </section>
        <section className="pt-40">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 4 }}
          >
            <div className="text-center">
              <h2
                id="photo"
                className="tracking-[10px] md:tracking-[20px] text-4xl md:text-5xl py-10 pt-12 bg-gradient-to-r from-red-400 to-red-500 font-medium inline-block text-transparent bg-clip-text animate-pulse"
              >
                My Photos
              </h2>
            </div>
            <div className="gap-2 flex flex-col lg:flex-row">
              <a
                href="https://www.nikhilsav.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FIMG_20210707_170928.aa45ae01.jpg&w=3840&q=75"
                target="_blank"
              >
                <Image
                  className="box-border hover:opacity-40"
                  src={image2}
                  alt="descr"
                />
              </a>

              <a
                href="https://www.nikhilsav.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FIMG_20210629_202206.0baf3be0.jpg&w=3840&q=75"
                target="_blank"
              >
                <Image
                  className="hover:opacity-40 box-border "
                  src={image3}
                  alt="desc"
                />
              </a>
            </div>
            <div className="flex pt-2 gap-2 flex-col lg:flex-row">
              <div className="flex-col gap-2">
                <a
                  href="https://www.nikhilsav.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdesert.cdfa47ce.jpg&w=3840&q=75"
                  target="_blank"
                >
                  <Image
                    className="hover:opacity-40 box-border h-"
                    src={image7}
                    alt="desc"
                  />
                </a>
                <a
                  href="https://www.nikhilsav.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsunset.8ac33900.jpg&w=3840&q=75"
                  target="_blank"
                >
                  <Image
                    className="pt-2 hover:opacity-40 box-border lg:max-w-s"
                    src={image5}
                    alt="desc"
                  />
                </a>
              </div>
              <a
                href="https://www.nikhilsav.xyz/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsummer.aec7ac1d.jpg&w=3840&q=75"
                target="_blank"
              >
                <Image
                  className=" hover:opacity-40 box-border h-full"
                  src={image8}
                  alt="desc"
                />
              </a>
            </div>
            <div className="flex pt-2 gap-2 flex-col lg:flex-row"></div>
          </motion.div>
        </section>
        <section>
          <div className="text-center">
            <h3
              id="skills"
              className="pt-40 pb-12 tracking-[10px] text-4xl md:text-5xl md:tracking-[20px] bg-gradient-to-r from-red-400 to-red-500 font-medium inline-block text-transparent bg-clip-text animate-pulse"
            >
              Skills
            </h3>
          </div>

          <SkillsSection />

          <div className="visible">
            <Skills />
          </div>
        </section>

        {/* WORK EXPERIENCE SECTION */}
        <section>
          <div className="text-center">
            <h3
              id="experience"
              className="pt-40 pb-12 tracking-[10px] text-4xl md:text-5xl md:tracking-[20px] bg-gradient-to-r from-red-400 to-red-500 font-medium inline-block text-transparent bg-clip-text animate-pulse"
            >
              Work Experience
            </h3>
          </div>

          <div className="relative">
            {/* Left arrow */}
            {canScrollLeft && (
              <button
                onClick={() => scrollExp(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <HiChevronLeft size={22} />
              </button>
            )}

            {/* Scrollable cards */}
            <div
              ref={expScrollRef}
              onScroll={updateScrollState}
              className="flex w-full space-x-5 overflow-x-scroll px-16 pt-10 pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {workExperiences.map((exp, index) => (
                <ExperienceCards
                  key={index}
                  companyName={exp.companyName}
                  jobTitle={exp.jobTitle}
                  dates={exp.dates}
                  responsibilities={exp.responsibilities}
                  technologies={exp.technologies}
                />
              ))}
            </div>

            {/* Right arrow */}
            {canScrollRight && (
              <button
                onClick={() => scrollExp(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200 hover:scale-110 active:scale-95"
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <HiChevronRight size={22} />
              </button>
            )}
          </div>
        </section>
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>
    </div>
  );
}
