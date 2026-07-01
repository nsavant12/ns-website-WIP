import Head from "next/head";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  ChevronLeft,
  CircleUserRound,
  Code2,
  FileText,
  Github,
  GraduationCap,
  Instagram,
  LineChart,
  Linkedin,
  Link2,
  Mail,
  MapPin,
  Printer,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import WiiCursor from "@/components/WiiCursor";
import Skills2048 from "@/components/Skills2048";
import PhotoWorld from "@/components/PhotoWorld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const WORK_EXPERIENCES = [
  {
    company: "Cisco",
    role: "Software Engineering Intern",
    dates: "May – Aug 2026",
    technologies: ["TypeScript", "Python", "Lit"],
    points: [
      "Designed and implemented scalable, user-focused features for Cisco Intersight.",
      "Built AI-assisted automation for generating web UI components and streamlining test and deployment cycles.",
    ],
  },
  {
    company: "Algo Analytics",
    role: "Full Stack Engineer Intern",
    dates: "Jun – Oct 2025",
    technologies: ["TypeScript", "React Native", "Node.js"],
    points: [
      "Built a backend integration layer for high-throughput financial data and reduced client-side parsing time.",
      "Implemented secure session management with JWT authentication and resilient token refresh flows.",
    ],
  },
  {
    company: "StellarPay",
    role: "Software Engineering Intern",
    dates: "Jun – Aug 2025",
    technologies: ["TypeScript", "Node.js", "AWS"],
    points: [
      "Built a GPT-powered financial assistant using retrieval-augmented generation.",
      "Improved retrieval quality with Textract, embeddings, Pinecone, and secure AWS infrastructure.",
    ],
  },
  {
    company: "UIUC Startup",
    role: "Technical Backend Lead",
    dates: "Mar – Nov 2025",
    technologies: ["Python", "Docker", "TensorFlow", "Node.js"],
    points: [
      "Led backend development for a behavior-driven shopping recommendation system.",
      "Deployed containerized ML services and improved recommendation quality with implicit-feedback modeling.",
    ],
  },
];

const CHANNELS = [
  {
    id: "profile",
    number: "01",
    title: "Mii Channel",
    eyebrow: "Profile",
    description: "A quick introduction",
    icon: CircleUserRound,
  },
  {
    id: "experience",
    number: "02",
    title: "News Channel",
    eyebrow: "Experience",
    description: "The latest from my career",
    icon: BriefcaseBusiness,
  },
  {
    id: "photos",
    number: "03",
    title: "Photo Channel",
    eyebrow: "Photography",
    description: "Scenes worth keeping",
    icon: Camera,
  },
  {
    id: "skills",
    number: "04",
    title: "Skills Channel",
    eyebrow: "Toolkit",
    description: "Play skill-stack 2048",
    icon: Wrench,
  },
  {
    id: "projects",
    number: "05",
    title: "Project Channel",
    eyebrow: "Selected work",
    description: "One project, in focus",
    icon: Code2,
  },
  {
    id: "market",
    number: "06",
    title: "Forecast Channel",
    eyebrow: "Markets",
    description: "A small personal watchlist",
    icon: LineChart,
  },
  {
    id: "links",
    number: "07",
    title: "Internet Channel",
    eyebrow: "Find me",
    description: "A few useful links",
    icon: Link2,
  },
  {
    id: "resume",
    number: "08",
    title: "Resume Channel",
    eyebrow: "Resume",
    description: "The condensed version",
    icon: FileText,
  },
];

const VALID_CHANNEL_IDS = new Set(CHANNELS.map((channel) => channel.id));

function BootScreen({ onContinue, onResume }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <motion.main
      key="boot"
      className="boot-screen"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: reduceMotion ? 0.1 : 0.45 }}
      onClick={onContinue}
    >
      <div className="boot-scanlines" aria-hidden="true" />
      <motion.section
        className="boot-copy"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.22, duration: 0.5 }}
        aria-labelledby="boot-title"
      >
        <div className="boot-heading">
          <TriangleAlert aria-hidden="true" />
          <h1 id="boot-title">Warning</h1>
        </div>

        <p className="boot-primary">
          Before playing, read my resume
          <br />
          for important information.
        </p>

        <p className="boot-online">Also online at</p>
        <a
          href="#resume"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onResume();
          }}
        >
          nikhilsav.xyz/#resume
        </a>

        <button
          type="button"
          className="boot-continue"
          onClick={(event) => {
            event.stopPropagation();
            onContinue();
          }}
        >
          Press <kbd>SPACE</kbd> to continue.
          <span>Tap anywhere on touch screens</span>
        </button>
      </motion.section>
    </motion.main>
  );
}

function ChannelArtwork({ channelId }) {
  if (channelId === "profile") {
    return (
      <div className="channel-art channel-art-profile">
        <Image src="/me_2.jpg" alt="" fill sizes="(max-width: 700px) 50vw, 260px" priority />
        <div className="profile-tile-copy">
          <strong>Nikhil</strong>
          <span>Player 01</span>
        </div>
      </div>
    );
  }

  if (channelId === "experience") {
    return (
      <div className="channel-art channel-art-news">
        <div className="news-map" aria-hidden="true" />
        <span className="news-kicker">CAREER DESK</span>
        <strong>Four stops.<br />Still building.</strong>
        <span className="news-ticker">CISCO · ALGO ANALYTICS · STELLARPAY · UIUC</span>
      </div>
    );
  }

  if (channelId === "photos") {
    return (
      <div className="channel-art channel-art-photos">
        <div className="photo-slice">
          <Image src="/desert.jpg" alt="" fill sizes="140px" />
        </div>
        <div className="photo-slice">
          <Image src="/summer.jpg" alt="" fill sizes="140px" />
        </div>
        <div className="photo-badge"><Camera size={18} /> Photo</div>
      </div>
    );
  }

  if (channelId === "skills") {
    return (
      <div className="channel-art channel-art-skills">
        <div className="skill-cube">TS</div>
        <div className="skill-cube">PY</div>
        <div className="skill-cube">GO</div>
        <div className="skill-cube">JS</div>
        <span>2048</span>
      </div>
    );
  }

  if (channelId === "projects") {
    return (
      <div className="channel-art channel-art-project">
        <div className="project-reticle" aria-hidden="true" />
        <Code2 size={34} />
        <strong>ATTENDANCE_01</strong>
        <span>Python · OpenCV</span>
      </div>
    );
  }

  if (channelId === "market") {
    return (
      <div className="channel-art channel-art-market">
        <span className="market-sun" aria-hidden="true" />
        <svg viewBox="0 0 260 90" aria-hidden="true">
          <path d="M0 78 C34 74, 42 56, 72 61 S120 24, 148 37 S192 17, 220 21 S245 9, 260 4" />
        </svg>
        <div><strong>S</strong><strong>AMZN</strong><strong>AAPL</strong></div>
      </div>
    );
  }

  if (channelId === "links") {
    return (
      <div className="channel-art channel-art-links">
        <div className="link-orbit link-orbit-one" />
        <div className="link-orbit link-orbit-two" />
        <div className="link-globe"><Link2 size={31} /></div>
        <span>WWW</span>
      </div>
    );
  }

  return (
    <div className="channel-art channel-art-resume">
      <div className="resume-disc" aria-hidden="true">
        <span />
      </div>
      <div className="resume-label">
        <FileText size={19} />
        <span>RESUME</span>
      </div>
    </div>
  );
}

function ChannelTile({ channel, index, onOpen, buttonRef, onGridKeyDown }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="channel-tile-wrap"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : 0.1 + index * 0.035, duration: 0.32 }}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
    >
      <Card className="channel-tile">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => onOpen(channel.id)}
          onKeyDown={(event) => onGridKeyDown(event, index)}
          aria-label={"Open " + channel.eyebrow + " channel"}
        >
          <ChannelArtwork channelId={channel.id} />
          <span className="channel-tile-label">
            <span>{channel.eyebrow}</span>
            <small>{channel.description}</small>
          </span>
        </button>
      </Card>
    </motion.div>
  );
}

function EmptyChannel({ index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="empty-channel"
      aria-hidden="true"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: reduceMotion ? 0 : 0.36 + index * 0.025 }}
    >
      <span />
    </motion.div>
  );
}

function ProfileContent() {
  return (
    <div className="profile-layout">
      <Card className="profile-card">
        <div className="profile-image">
          <Image
            src="/me_2.jpg"
            alt="Nikhil Savant smiling in a suit."
            fill
            sizes="(max-width: 800px) 86vw, 360px"
            priority
          />
        </div>
        <CardContent>
          <p>PLAYER 01</p>
          <strong>Nikhil Savant</strong>
        </CardContent>
      </Card>

      <div className="profile-copy">
        <Badge variant="outline">Student · Programmer · Engineer</Badge>
        <h2>Hi, I&apos;m Nikhil.</h2>
        <p className="channel-lead">
          I&apos;m a sophomore at UIUC majoring in Computer Science and Economics.
          I enjoy finding practical solutions where software meets the things I care about.
        </p>
        <div className="profile-meta">
          <span><GraduationCap size={18} /> Computer Science + Economics</span>
          <span><MapPin size={18} /> University of Illinois Urbana-Champaign</span>
        </div>
        <Separator />
        <div>
          <p className="mini-label">OFF THE CLOCK</p>
          <div className="interest-list">
            {["Finance", "News", "Tech", "Cars", "Photography"].map((interest) => (
              <Badge key={interest} variant="secondary">{interest}</Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceContent() {
  return (
    <div>
      <div className="content-heading">
        <Badge variant="outline">Career desk</Badge>
        <h2>Work experience, without the corporate wallpaper.</h2>
        <p>Four roles across infrastructure, financial software, AI, and recommendation systems.</p>
      </div>

      <div className="experience-list">
        {WORK_EXPERIENCES.map((experience, index) => (
          <Card key={experience.company} className="experience-card">
            <CardHeader>
              <div className="experience-number">0{index + 1}</div>
              <div>
                <CardTitle>{experience.company}</CardTitle>
                <CardDescription>{experience.role}</CardDescription>
              </div>
              <Badge variant="secondary">{experience.dates}</Badge>
            </CardHeader>
            <CardContent>
              <ul>
                {experience.points.map((point) => <li key={point}>{point}</li>)}
              </ul>
              <div className="tech-list">
                {experience.technologies.map((technology) => (
                  <Badge key={technology} variant="outline">{technology}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PhotosContent() {
  return <PhotoWorld />;
}

function SkillsContent() {
  return <Skills2048 />;
}

function ProjectsContent() {
  return (
    <div>
      <div className="content-heading">
        <Badge variant="outline">Selected work · 01</Badge>
        <h2>Attendance, recognized automatically.</h2>
        <p>One focused computer-vision project from the current archive.</p>
      </div>

      <Card className="project-feature">
        <div className="project-visual">
          <div className="project-window">
            <div className="project-window-bar"><span /><span /><span /></div>
            <div className="face-frame">
              <div className="face-bracket face-bracket-one" />
              <div className="face-bracket face-bracket-two" />
              <CircleUserRound size={82} />
              <span>FACE MATCH · FOUND</span>
            </div>
          </div>
        </div>
        <div className="project-copy">
          <p className="mini-label">ATTENDANCE PROJECT</p>
          <h3>A webcam-based check-in system.</h3>
          <p>
            The application accepts reference photos, recognizes matching faces from a webcam
            feed, and records the identified person with the time they were present.
          </p>
          <div className="tech-list">
            {["Python", "OpenCV", "Face Recognition", "Tkinter"].map((technology) => (
              <Badge key={technology} variant="outline">{technology}</Badge>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function MarketContent() {
  const watchlist = [
    { symbol: "S", name: "SentinelOne", exchange: "NYSE" },
    { symbol: "AMZN", name: "Amazon", exchange: "NASDAQ" },
    { symbol: "AAPL", name: "Apple", exchange: "NASDAQ" },
  ];

  return (
    <div>
      <div className="content-heading">
        <Badge variant="outline">Personal watchlist</Badge>
        <h2>Three names on my radar.</h2>
        <p>Markets are one of the things I follow outside of building software. This is a watchlist, not live pricing.</p>
      </div>

      <div className="market-grid">
        {watchlist.map((stock, index) => (
          <Card key={stock.symbol} className="market-card">
            <CardHeader>
              <div>
                <p>{stock.exchange}</p>
                <CardTitle>{stock.symbol}</CardTitle>
                <CardDescription>{stock.name}</CardDescription>
              </div>
              <LineChart aria-hidden="true" />
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 240 72" aria-hidden="true">
                <path d={index === 0
                  ? "M0 57 C30 54, 37 33, 70 42 S113 19, 143 31 S181 12, 240 18"
                  : index === 1
                    ? "M0 47 C35 57, 54 28, 86 35 S126 50, 157 23 S200 30, 240 10"
                    : "M0 58 C26 41, 53 52, 79 37 S124 42, 153 24 S200 17, 240 7"} />
              </svg>
              <span>WATCHING</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function LinksContent() {
  const links = [
    {
      title: "GitHub",
      handle: "@nsavant12",
      href: "https://github.com/nsavant12",
      icon: Github,
    },
    {
      title: "LinkedIn",
      handle: "nikhil-savant",
      href: "https://linkedin.com/in/nikhil-savant",
      icon: Linkedin,
    },
    {
      title: "Instagram",
      handle: "@nikhilsavant1",
      href: "https://www.instagram.com/nikhilsavant1/",
      icon: Instagram,
    },
  ];

  return (
    <div>
      <div className="content-heading">
        <Badge variant="outline">Internet settings</Badge>
        <h2>Three good ways to find me.</h2>
        <p>Code, career, and photographs—each has its own corner.</p>
      </div>

      <div className="link-grid">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Card key={link.title} className="link-card">
              <a href={link.href} target="_blank" rel="noreferrer">
                <div className="link-icon"><Icon /></div>
                <div>
                  <strong>{link.title}</strong>
                  <span>{link.handle}</span>
                </div>
                <ArrowUpRight aria-hidden="true" />
              </a>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ResumeContent() {
  return (
    <article className="resume-sheet" id="resume-document">
      <div className="resume-header">
        <div>
          <Badge variant="outline">Web resume</Badge>
          <h2>Nikhil Savant</h2>
          <p>Software engineer studying Computer Science + Economics at UIUC.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} />
          Print / save
        </Button>
      </div>

      <Separator />

      <div className="resume-columns">
        <aside>
          <section>
            <p className="mini-label">EDUCATION</p>
            <h3>University of Illinois Urbana-Champaign</h3>
            <p>Computer Science + Economics</p>
          </section>
          <section>
            <p className="mini-label">FOCUS</p>
            <div className="interest-list">
              {["Software engineering", "AI systems", "Financial technology", "Product interfaces"].map((item) => (
                <Badge key={item} variant="secondary">{item}</Badge>
              ))}
            </div>
          </section>
          <section>
            <p className="mini-label">ONLINE</p>
            <a href="https://github.com/nsavant12" target="_blank" rel="noreferrer">github.com/nsavant12</a>
            <a href="https://linkedin.com/in/nikhil-savant" target="_blank" rel="noreferrer">linkedin.com/in/nikhil-savant</a>
          </section>
        </aside>

        <div className="resume-experience">
          <p className="mini-label">EXPERIENCE</p>
          {WORK_EXPERIENCES.map((experience) => (
            <section key={experience.company}>
              <div>
                <h3>{experience.company}</h3>
                <span>{experience.dates}</span>
              </div>
              <h4>{experience.role}</h4>
              <p>{experience.points[0]}</p>
              <div className="tech-list">
                {experience.technologies.map((technology) => (
                  <Badge key={technology} variant="outline">{technology}</Badge>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function ChannelContent({ channelId }) {
  if (channelId === "profile") return <ProfileContent />;
  if (channelId === "experience") return <ExperienceContent />;
  if (channelId === "photos") return <PhotosContent />;
  if (channelId === "skills") return <SkillsContent />;
  if (channelId === "projects") return <ProjectsContent />;
  if (channelId === "market") return <MarketContent />;
  if (channelId === "links") return <LinksContent />;
  return <ResumeContent />;
}

function ChannelWindow({ channel, onClose }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const focusableElements = Array.from(
          dialogRef.current?.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ) || [],
        );
        if (!focusableElements.length) return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.section
      ref={dialogRef}
      className="channel-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="channel-window-title"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="channel-window">
        <header className="channel-window-header">
          <Button ref={closeButtonRef} variant="outline" onClick={onClose}>
            <ChevronLeft size={18} />
            Wii Menu
          </Button>
          <div>
            <Badge variant="secondary">CHANNEL {channel.number}</Badge>
            <h1 id="channel-window-title">{channel.eyebrow}</h1>
          </div>
          <span>{channel.title}</span>
        </header>
        <Separator />
        <div className="channel-window-scroll">
          <motion.div
            key={channel.id}
            className="channel-content"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.3 }}
          >
            <ChannelContent channelId={channel.id} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function HomeMenu({ activeChannel, onOpen, onClose }) {
  const reduceMotion = useReducedMotion();
  const buttonRefs = useRef([]);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const timeParts = useMemo(() => {
    const parts = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).formatToParts(now);
    return {
      time: parts
        .filter((part) => part.type === "hour" || part.type === "minute" || part.type === "literal")
        .map((part) => part.value)
        .join(""),
      period: parts.find((part) => part.type === "dayPeriod")?.value || "",
      date: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "numeric",
        day: "numeric",
      }).format(now),
    };
  }, [now]);

  const handleGridKeyDown = (event, index) => {
    const columns = window.innerWidth <= 760 ? 2 : 4;
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = Math.min(CHANNELS.length - 1, index + 1);
    if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
    if (event.key === "ArrowDown") nextIndex = Math.min(CHANNELS.length - 1, index + columns);
    if (event.key === "ArrowUp") nextIndex = Math.max(0, index - columns);
    if (nextIndex !== index) {
      event.preventDefault();
      buttonRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <motion.main
      key="home"
      className="wii-home"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduceMotion ? 0.1 : 0.5 }}
    >
      <div className="wii-grain" aria-hidden="true" />
      <h1 className="sr-only">Nikhil Savant portfolio channels</h1>
      <header className="wii-topbar" aria-hidden={activeChannel ? "true" : undefined}>
        <div className="wii-brand">
          <span>NS</span>
          <div>
            <strong>Nikhil Savant</strong>
            <small>Portfolio system</small>
          </div>
        </div>
        <div className="wii-online"><span /> ONLINE</div>
      </header>

      <section
        className="channel-stage"
        aria-label="Portfolio channels"
        aria-hidden={activeChannel ? "true" : undefined}
      >
        <div className="channel-grid">
          {CHANNELS.map((channel, index) => (
            <ChannelTile
              key={channel.id}
              channel={channel}
              index={index}
              onOpen={onOpen}
              buttonRef={(node) => {
                buttonRefs.current[index] = node;
              }}
              onGridKeyDown={handleGridKeyDown}
            />
          ))}
          {[0, 1, 2, 3].map((index) => <EmptyChannel key={index} index={index} />)}
        </div>
        <p className="channel-help">Point and click a channel · Arrow keys also work</p>
      </section>

      <footer className="wii-dock" aria-hidden={activeChannel ? "true" : undefined}>
        <Button
          variant="outline"
          className="dock-round dock-profile"
          onClick={() => onOpen("profile")}
          aria-label="Open profile"
        >
          NS
        </Button>

        <div className="dock-clock" aria-label={timeParts.time + " " + timeParts.period + ", " + timeParts.date}>
          <div><strong>{timeParts.time}</strong><span>{timeParts.period}</span></div>
          <p>{timeParts.date}</p>
        </div>

        <Button
          variant="outline"
          className="dock-round dock-links"
          onClick={() => onOpen("links")}
          aria-label="Open links"
        >
          <Mail />
        </Button>
      </footer>

      <WiiCursor />

      <AnimatePresence>
        {activeChannel ? (
          <ChannelWindow channel={activeChannel} onClose={onClose} />
        ) : null}
      </AnimatePresence>
    </motion.main>
  );
}

export default function WiiPortfolio() {
  const [booted, setBooted] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const pendingChannelRef = useRef(null);

  useEffect(() => {
    const syncChannelFromUrl = () => {
      const hash = window.location.hash.replace("#", "");
      const nextChannel = VALID_CHANNEL_IDS.has(hash) ? hash : null;
      if (!booted) {
        pendingChannelRef.current = nextChannel;
        return;
      }
      setActiveChannelId(nextChannel);
    };

    syncChannelFromUrl();
    window.addEventListener("popstate", syncChannelFromUrl);
    window.addEventListener("hashchange", syncChannelFromUrl);
    return () => {
      window.removeEventListener("popstate", syncChannelFromUrl);
      window.removeEventListener("hashchange", syncChannelFromUrl);
    };
  }, [booted]);

  const openChannel = useCallback((channelId) => {
    if (!VALID_CHANNEL_IDS.has(channelId)) return;
    setActiveChannelId(channelId);
    const nextHash = "#" + channelId;
    if (window.location.hash !== nextHash) {
      window.history.pushState({ portfolioChannel: true }, "", nextHash);
    }
  }, []);

  const continueBoot = useCallback(() => {
    setBooted(true);
    if (pendingChannelRef.current) {
      openChannel(pendingChannelRef.current);
      pendingChannelRef.current = null;
    }
  }, [openChannel]);

  const openResumeFromBoot = useCallback(() => {
    pendingChannelRef.current = "resume";
    setBooted(true);
    openChannel("resume");
    pendingChannelRef.current = null;
  }, [openChannel]);

  const closeChannel = useCallback(() => {
    setActiveChannelId(null);
    if (window.location.hash) {
      if (window.history.state?.portfolioChannel) {
        window.history.back();
      } else {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
    }
  }, []);

  const activeChannel = CHANNELS.find((channel) => channel.id === activeChannelId) || null;

  return (
    <>
      <Head>
        <title>Nikhil Savant · Portfolio</title>
        <meta
          name="description"
          content="The portfolio of Nikhil Savant—software engineer, UIUC student, and photographer."
        />
        <meta name="theme-color" content="#f2f4f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AnimatePresence mode="wait">
        {!booted ? (
          <BootScreen
            key="boot"
            onContinue={continueBoot}
            onResume={openResumeFromBoot}
          />
        ) : (
          <HomeMenu
            key="home"
            activeChannel={activeChannel}
            onOpen={openChannel}
            onClose={closeChannel}
          />
        )}
      </AnimatePresence>
    </>
  );
}
