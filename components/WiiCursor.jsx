import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function WiiCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const smoothX = useSpring(x, { stiffness: 950, damping: 54, mass: 0.18 });
  const smoothY = useSpring(y, { stiffness: 950, damping: 54, mass: 0.18 });
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

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

    const move = (event) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
    };
    const hide = () => setVisible(false);
    const show = () => setVisible(true);

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", hide);
    document.documentElement.addEventListener("mouseenter", show);

    return () => {
      document.documentElement.classList.remove("has-wii-pointer");
      window.removeEventListener("pointermove", move);
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
      <svg viewBox="0 0 48 64" role="presentation">
        <path
          className="wii-cursor-hand"
          d="M15.7 35.6V9.2c0-4.1 2.4-6.7 5.7-6.7 3.4 0 5.7 2.7 5.7 6.7v16.3-6.6c0-3.6 2.1-5.8 5-5.8 3 0 5.1 2.3 5.1 5.8v7.7-4.1c0-3.3 2-5.4 4.7-5.4 2.8 0 4.8 2.2 4.8 5.4v15.1c0 13.9-8 23.2-20.5 23.2h-3.4c-7.4 0-12.1-4.3-14.9-10.4L2.4 38.2c-1.4-3.2-.3-6.3 2.4-7.5 2.5-1.1 5.1-.2 6.8 2.2l4.1 5.8v-3.1Z"
        />
        <text x="28" y="45" textAnchor="middle">1</text>
      </svg>
    </motion.div>
  );
}
