import React, { CSSProperties } from "react";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

function SkillsSection() {
  const languages = [
    
    {
      title: "Python",
      image: "https://cdn.worldvectorlogo.com/logos/python-5.svg",
    },
    {
      title: "JavaScript",
      image: "https://cdn.worldvectorlogo.com/logos/logo-javascript.svg",
    },
    {
      title: "Java",
      image: "https://cdn.worldvectorlogo.com/logos/java-14.svg",
    },
    {
      title: "TypeScript",
      image: "https://cdn.worldvectorlogo.com/logos/typescript.svg",
    },
    {
      title: "NextJS",
      image: "https://cdn.worldvectorlogo.com/logos/next-js.svg",
    },
    {
      title: "React",
      image: "https://cdn.worldvectorlogo.com/logos/react-2.svg",
    },
    {
      title: "HTML",
      image: "https://cdn.worldvectorlogo.com/logos/html-1.svg",
    },
    {
      title: "CSS",
      image: "https://cdn.worldvectorlogo.com/logos/css-3.svg",
    },
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
              <img className="w-14 h-14 mr-3" src={lang.image} alt="Language" />
              <h1>{lang.title}</h1>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SkillsSection;