import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Cursor art from the cursors-4u.com "Wii Set" by allewun
// (https://www.cursors-4u.com/cursor/wii-set).
const CURSOR_MODES = {
  point: { src: "/cursors/wii-pointer-tilt.webp", offsetClass: "wii-cursor-img-point" },
  hover: { src: "/cursors/wii-pointer-tilt-glow.webp", offsetClass: "wii-cursor-img-point" },
  grab: { src: "/cursors/wii-grab.webp", offsetClass: "wii-cursor-img-grab" },
};

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "select",
  "textarea",
  "label",
  "summary",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");

const GRAB_SELECTOR = ".photo-world-gallery, .pixel-globe-control";

export default function WiiCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 950, damping: 54, mass: 0.18 });
  const smoothY = useSpring(y, { stiffness: 950, damping: 54, mass: 0.18 });
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("point");
  const isPressed = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateMode = () => setEnabled(query.matches);
    updateMode();
    query.addEventListener?.("change", updateMode);

    return () => query.removeEventListener?.("change", updateMode);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    document.documentElement.classList.add("has-wii-pointer");

    const resolveMode = (target) => {
      const element = target instanceof Element ? target : null;
      if (isPressed.current && element?.closest(GRAB_SELECTOR)) {
        setMode("grab");
        return;
      }
      setMode(element?.closest(INTERACTIVE_SELECTOR) ? "hover" : "point");
    };

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      resolveMode(event.target);
    };
    const press = (event) => {
      isPressed.current = true;
      resolveMode(event.target);
    };
    const release = (event) => {
      isPressed.current = false;
      resolveMode(event.target);
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      document.documentElement.classList.remove("has-wii-pointer");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      document.documentElement.removeEventListener("mouseleave", hide);
      document.documentElement.removeEventListener("mouseenter", show);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="wii-cursor"
      style={{ x: reduceMotion ? x : smoothX, y: reduceMotion ? y : smoothY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.08 }}
    >
      {Object.entries(CURSOR_MODES).map(([key, config]) => (
        <img
          key={key}
          src={config.src}
          alt=""
          draggable={false}
          className={
            "wii-cursor-img "
            + config.offsetClass
            + (mode === key ? " is-active" : "")
          }
        />
      ))}
    </motion.div>
  );
}
