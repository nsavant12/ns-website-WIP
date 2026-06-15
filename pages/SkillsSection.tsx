import React, { CSSProperties } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  SiPython, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiHtml5, SiCss3,
  SiGo, SiCplusplus, SiSwift, SiNodedotjs, SiAngular, SiDocker, SiAmazonaws,
  SiGit, SiMongodb, SiTensorflow, SiLit,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import { IconType } from "react-icons";

const settings = {
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  speed: 6000,
  draggable: false,
  pauseOnHover: false,
  variableWidth: true,
  cssEase: "linear",
};

type Language = {
  title: string;
  icon: IconType;
  color: string;
};

function SkillsSection() {
  const languages: Language[] = [
    { title: "Python",     icon: SiPython,     color: "#3776AB" },
    { title: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    { title: "Java",       icon: FaJava,       color: "#ED8B00" },
    { title: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { title: "NextJS",     icon: SiNextdotjs,  color: "#ffffff" },
    { title: "React",      icon: SiReact,      color: "#61DAFB" },
    { title: "HTML",       icon: SiHtml5,      color: "#E34F26" },
    { title: "CSS",        icon: SiCss3,       color: "#1572B6" },
    { title: "Go",         icon: SiGo,         color: "#00ADD8" },
    { title: "C++",        icon: SiCplusplus,  color: "#00599C" },
    { title: "Swift",      icon: SiSwift,      color: "#FA7343" },
    { title: "Node.js",    icon: SiNodedotjs,  color: "#339933" },
    { title: "Angular",    icon: SiAngular,    color: "#DD0031" },
    { title: "Docker",     icon: SiDocker,     color: "#2496ED" },
    { title: "AWS",        icon: SiAmazonaws,  color: "#FF9900" },
    { title: "Git",        icon: SiGit,        color: "#F05032" },
    { title: "MongoDB",    icon: SiMongodb,    color: "#47A248" },
    { title: "TensorFlow", icon: SiTensorflow, color: "#FF6F00" },
    { title: "Lit",        icon: SiLit,        color: "#324FFF" },
  ];

  const bannerStyle: CSSProperties = {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    color: "#fff",
    position: "relative" as "relative",
  };

  return (
    <div style={bannerStyle}>
      <Slider {...settings}>
        {languages.map((lang, index) => (
          <div key={lang.title}>
            <div
              className="flex justify-center items-center w-48 px-5"
              key={index}
            >
              <lang.icon size={56} style={{ color: lang.color }} className="mr-3 flex-shrink-0" />
              <h1>{lang.title}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SkillsSection;
