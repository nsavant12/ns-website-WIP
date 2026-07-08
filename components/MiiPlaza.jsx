import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, MapPin, Shuffle, Trash2, UserPlus, X } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SKIN_TONES = ["#ffe2c8", "#f6c9a0", "#e2a76f", "#c9834d", "#96562c", "#5f3a20"];

const SHIRT_COLORS = [
  "#e8c520", "#d8433c", "#3a76c9", "#3fa24c",
  "#8a52b5", "#e88024", "#31b7c3", "#e668a7",
  "#4a4a52", "#f2f2f2",
];

const HAIR_COLORS = ["#26201d", "#4b3121", "#7a4a26", "#c19143", "#b8b8bc", "#8c3b22", "#3a5da8"];

const HEAD_SHAPES = {
  round: "M60 7 C77 7 85 16 85 31 C85 47 74 58 60 58 C46 58 35 47 35 31 C35 16 43 7 60 7 Z",
  oval: "M60 6 C75 6 83 16 83 32 C83 48 72 59 60 59 C48 59 37 48 37 32 C37 16 45 6 60 6 Z",
  square: "M60 7 C75 7 84 13 84 27 L84 40 C84 53 73 58 60 58 C47 58 36 53 36 40 L36 27 C36 13 45 7 60 7 Z",
  pointed: "M60 6 C76 6 84 15 83 30 C82 46 71 59 60 60 C49 59 38 46 37 30 C36 15 44 6 60 6 Z",
};

const HAIR_STYLES = {
  spiky: {
    front: "M32 40 C29 6 44 0 60 0 C76 0 91 6 88 40 L80 21 L75 38 L68 18 L61 36 L54 18 L47 36 L41 20 L36 39 Z",
  },
  bowl: {
    front: "M33 34 C33 6 45 1 60 1 C75 1 87 6 87 34 C87 37 84 38 81 36 C68 29 52 29 39 36 C36 38 33 37 33 34 Z",
  },
  part: {
    front: "M33 36 C33 6 45 1 60 1 C77 1 88 9 87 38 C83 32 81 25 74 20 C60 31 41 32 33 36 Z",
  },
  buzz: {
    front: "M36 28 C36 7 46 2 60 2 C74 2 84 7 84 28 C72 19 48 19 36 28 Z",
  },
  long: {
    back: "M31 76 C25 46 29 2 60 2 C91 2 95 46 89 76 C78 83 42 83 31 76 Z",
    front: "M33 34 C33 6 45 1 60 1 C75 1 87 6 87 34 C87 37 84 38 81 36 C68 29 52 29 39 36 C36 38 33 37 33 34 Z",
  },
  bald: {},
};

// Hair seen from behind: a cap covering the back of the head.
const HAIR_REAR = {
  default: "M35 44 C33 6 45 1 60 1 C75 1 87 6 85 44 C85 53 76 57 60 57 C44 57 35 53 35 44 Z",
  buzz: "M36 32 C36 6 46 2 60 2 C74 2 84 6 84 32 C84 42 74 46 60 46 C46 46 36 42 36 32 Z",
};

// Blend a hex color toward white (positive amount) or black (negative).
function shadeHex(hex, amount) {
  const target = amount >= 0 ? 255 : 0;
  const strength = Math.abs(amount);
  const value = parseInt(hex.slice(1), 16);
  const channels = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => Math.round(channel + (target - channel) * strength),
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

const EYE_STYLES = ["dot", "wide", "sleepy", "happy"];
const MOUTH_STYLES = ["smile", "grin", "line", "frown"];

const FACE_LABELS = { round: "Round", oval: "Oval", square: "Square", pointed: "Pointed" };
const HAIR_LABELS = {
  spiky: "Spiky", bowl: "Bowl", part: "Side part", buzz: "Buzz", long: "Long", bald: "Bald",
};
const EYE_LABELS = { dot: "Classic", wide: "Wide", sleepy: "Sleepy", happy: "Happy" };
const MOUTH_LABELS = { smile: "Smile", grin: "Grin", line: "Neutral", frown: "Frown" };

const NIKHIL_MII = {
  id: "nikhil",
  name: "Nikhil",
  isHost: true,
  skin: SKIN_TONES[2],
  shirt: SHIRT_COLORS[0],
  hair: "spiky",
  hairColor: HAIR_COLORS[1],
  face: "oval",
  eyes: "dot",
  mouth: "line",
  height: 62,
  weight: 46,
};

const GUEST_STORAGE_KEY = "mii-plaza-guests";

const INTERESTS = ["Finance", "News", "Tech", "Cars", "Photography"];

const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

function randomGuestConfig() {
  return {
    name: "",
    skin: randomItem(SKIN_TONES),
    shirt: randomItem(SHIRT_COLORS.slice(1)),
    hair: randomItem(Object.keys(HAIR_STYLES)),
    hairColor: randomItem(HAIR_COLORS),
    face: randomItem(Object.keys(HEAD_SHAPES)),
    eyes: randomItem(EYE_STYLES),
    mouth: randomItem(MOUTH_STYLES),
    height: 20 + Math.floor(Math.random() * 60),
    weight: 20 + Math.floor(Math.random() * 60),
  };
}

function MiiEyes({ style, positions = [49, 71] }) {
  if (style === "happy") {
    return positions.map((x) => (
      <path
        key={x}
        d={`M${x - 5} 39.5 Q${x} 33.5 ${x + 5} 39.5`}
        fill="none"
        stroke="#1d1d1f"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    ));
  }
  if (style === "sleepy") {
    return positions.map((x) => (
      <rect key={x} x={x - 5} y={36} width="10" height="2.8" rx="1.4" fill="#1d1d1f" />
    ));
  }
  if (style === "wide") {
    return positions.map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={37.5} rx="4.6" ry="6.6" fill="#ffffff" stroke="rgba(29,29,31,.16)" strokeWidth="1" />
        <ellipse cx={x} cy={38.5} rx="2.4" ry="4.2" fill="#1d1d1f" />
      </g>
    ));
  }
  return positions.map((x) => (
    <ellipse key={x} cx={x} cy={37.5} rx="3.1" ry="5.8" fill="#1d1d1f" />
  ));
}

function MiiBrows({ eyes, color, positions = [49, 71] }) {
  const y = eyes === "wide" ? 25 : 26.5;
  return positions.map((x) => (
    <rect key={x} x={x - 5} y={y} width="10" height="3" rx="1.5" fill={color} />
  ));
}

function MiiMouth({ style, offsetX = 0 }) {
  let mouth;
  if (style === "grin") {
    mouth = (
      <g>
        <path d="M51 50 Q60 60 69 50 Z" fill="#7c2f28" />
        <path d="M53.5 50.6 Q60 54 66.5 50.6 Z" fill="#ffffff" />
      </g>
    );
  } else if (style === "line") {
    mouth = <rect x="53.5" y="50.4" width="13" height="2.6" rx="1.3" fill="#6b4f45" />;
  } else if (style === "frown") {
    mouth = (
      <path d="M52 54.5 Q60 48.5 68 54.5" fill="none" stroke="#6b4f45" strokeWidth="2.7" strokeLinecap="round" />
    );
  } else {
    mouth = (
      <path d="M52 50.5 Q60 56.5 68 50.5" fill="none" stroke="#6b4f45" strokeWidth="2.7" strokeLinecap="round" />
    );
  }
  return offsetX ? <g transform={`translate(${offsetX} 0)`}>{mouth}</g> : mouth;
}

export function MiiFigure({ config, size = 96, crop, view = "front" }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const hair = HAIR_STYLES[config.hair] || {};
  const bodyWidth = 0.8 + (config.weight / 100) * 0.5;
  const viewBox = crop === "head" ? "26 0 68 68" : "8 0 104 126";
  const aspect = crop === "head" ? 1 : 104 / 126;
  const activeView = crop === "head" ? "front" : view;
  const ids = {
    skin: `mii-${uid}-skin`,
    shirt: `mii-${uid}-shirt`,
    hand: `mii-${uid}-hand`,
    hair: `mii-${uid}-hair`,
    leg: `mii-${uid}-leg`,
    shoe: `mii-${uid}-shoe`,
  };

  return (
    <svg
      className="mii-figure-svg"
      viewBox={viewBox}
      width={size * aspect}
      height={size}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={ids.skin} cx="42%" cy="28%" r="78%">
          <stop offset="0%" stopColor={shadeHex(config.skin, 0.2)} />
          <stop offset="55%" stopColor={config.skin} />
          <stop offset="100%" stopColor={shadeHex(config.skin, -0.16)} />
        </radialGradient>
        <radialGradient id={ids.shirt} cx="50%" cy="18%" r="92%">
          <stop offset="0%" stopColor={shadeHex(config.shirt, 0.28)} />
          <stop offset="55%" stopColor={config.shirt} />
          <stop offset="100%" stopColor={shadeHex(config.shirt, -0.22)} />
        </radialGradient>
        <radialGradient id={ids.hand} cx="34%" cy="28%" r="80%">
          <stop offset="0%" stopColor={shadeHex(config.shirt, 0.34)} />
          <stop offset="60%" stopColor={config.shirt} />
          <stop offset="100%" stopColor={shadeHex(config.shirt, -0.24)} />
        </radialGradient>
        <linearGradient id={ids.hair} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={shadeHex(config.hairColor, 0.3)} />
          <stop offset="45%" stopColor={config.hairColor} />
          <stop offset="100%" stopColor={shadeHex(config.hairColor, -0.24)} />
        </linearGradient>
        <linearGradient id={ids.leg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4c4d58" />
          <stop offset="100%" stopColor="#33343c" />
        </linearGradient>
        <linearGradient id={ids.shoe} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6a6b76" />
          <stop offset="100%" stopColor="#464751" />
        </linearGradient>
      </defs>

      {crop !== "head" ? (
        activeView === "side" ? (
          <g>
            <rect x="50" y="101" width="9.4" height="14" rx="3.6" fill={`url(#${ids.leg})`} />
            <rect x="61" y="101" width="9.4" height="14" rx="3.6" fill={`url(#${ids.leg})`} />
            <ellipse cx="58" cy="119.4" rx="10" ry="4.6" fill={`url(#${ids.shoe})`} />
            <ellipse cx="69.5" cy="119.4" rx="10" ry="4.6" fill={`url(#${ids.shoe})`} />
            <g transform={`translate(60 0) scale(${0.68 * bodyWidth} 1) translate(-60 0)`}>
              <path
                d="M60 54 C72 54 80 60 82 71 C84 84 85 94 86 103 L34 103 C35 94 36 84 38 71 C40 60 48 54 60 54 Z"
                fill={`url(#${ids.shirt})`}
              />
              <ellipse cx="60" cy="58.5" rx="13.5" ry="4" fill="rgba(0, 0, 0, 0.12)" />
            </g>
            <circle cx="71" cy="96.5" r="6.6" fill={`url(#${ids.hand})`} />
          </g>
        ) : (
          <g transform={`translate(60 0) scale(${bodyWidth} 1) translate(-60 0)`}>
            <rect x="45" y="101" width="9.4" height="14" rx="3.6" fill={`url(#${ids.leg})`} />
            <rect x="65.6" y="101" width="9.4" height="14" rx="3.6" fill={`url(#${ids.leg})`} />
            <ellipse cx="49" cy="119.4" rx="9.6" ry="4.6" fill={`url(#${ids.shoe})`} />
            <ellipse cx="71" cy="119.4" rx="9.6" ry="4.6" fill={`url(#${ids.shoe})`} />
            <path
              d="M60 54 C72 54 80 60 82 71 C84 84 85 94 86 103 L34 103 C35 94 36 84 38 71 C40 60 48 54 60 54 Z"
              fill={`url(#${ids.shirt})`}
            />
            <ellipse cx="60" cy="58.5" rx="13.5" ry="4" fill="rgba(0, 0, 0, 0.12)" />
            <circle cx="29.5" cy="96.5" r="6.6" fill={`url(#${ids.hand})`} />
            <circle cx="90.5" cy="96.5" r="6.6" fill={`url(#${ids.hand})`} />
          </g>
        )
      ) : null}

      {activeView === "back" ? (
        <g>
          {hair.back ? <path d={hair.back} fill={`url(#${ids.hair})`} /> : null}
          <circle cx="34.5" cy="35" r="4.5" fill={shadeHex(config.skin, -0.08)} />
          <circle cx="85.5" cy="35" r="4.5" fill={shadeHex(config.skin, -0.08)} />
          <path d={HEAD_SHAPES[config.face]} fill={`url(#${ids.skin})`} />
          {config.hair !== "bald" ? (
            <path
              d={HAIR_REAR[config.hair] || HAIR_REAR.default}
              fill={`url(#${ids.hair})`}
            />
          ) : null}
        </g>
      ) : activeView === "side" ? (
        <g>
          {hair.back ? <path d={hair.back} fill={`url(#${ids.hair})`} /> : null}
          <path d={HEAD_SHAPES[config.face]} fill={`url(#${ids.skin})`} />
          <path
            d="M82.5 40 C87.5 41 89 44.5 86.5 48.5 C85 50.6 82.5 50 81.5 48.8 Z"
            fill={shadeHex(config.skin, 0.04)}
          />
          {hair.front ? <path d={hair.front} fill={`url(#${ids.hair})`} /> : null}
          <ellipse cx="56" cy="38" rx="4.6" ry="6.4" fill={shadeHex(config.skin, -0.1)} />
          <ellipse cx="56.5" cy="38" rx="2.1" ry="3.4" fill={shadeHex(config.skin, -0.22)} />
          <MiiBrows eyes={config.eyes} color={shadeHex(config.hairColor, -0.12)} positions={[72]} />
          <MiiEyes style={config.eyes} positions={[72]} />
          <MiiMouth style={config.mouth} offsetX={12} />
        </g>
      ) : (
        <g>
          {hair.back ? <path d={hair.back} fill={`url(#${ids.hair})`} /> : null}
          <circle cx="34.5" cy="35" r="4.5" fill={shadeHex(config.skin, -0.08)} />
          <circle cx="85.5" cy="35" r="4.5" fill={shadeHex(config.skin, -0.08)} />
          <path d={HEAD_SHAPES[config.face]} fill={`url(#${ids.skin})`} />
          {hair.front ? <path d={hair.front} fill={`url(#${ids.hair})`} /> : null}
          <MiiBrows eyes={config.eyes} color={shadeHex(config.hairColor, -0.12)} />
          <MiiEyes style={config.eyes} />
          <ellipse cx="60" cy="45.5" rx="2.2" ry="2.8" fill={shadeHex(config.skin, -0.22)} />
          <MiiMouth style={config.mouth} />
        </g>
      )}
    </svg>
  );
}

function WanderingMii({ mii, onSelect, paused, reduceMotion, initial }) {
  const [target, setTarget] = useState(initial);
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState(1);
  const [view, setView] = useState("front");
  const positionRef = useRef(initial);
  const timerRef = useRef(null);
  const restingRef = useRef(true);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const scheduleNext = useCallback(() => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (pausedRef.current) return;
      const next = {
        x: 6 + Math.random() * 84,
        y: 14 + Math.random() * 66,
      };
      const deltaX = next.x - positionRef.current.x;
      const deltaY = next.y - positionRef.current.y;
      // Mostly-horizontal walks show the side profile; walking up the plaza
      // shows the Mii's back, walking down faces the camera.
      if (Math.abs(deltaX) >= Math.abs(deltaY) * 1.15) {
        setView("side");
        setFacing(deltaX >= 0 ? 1 : -1);
      } else {
        setView(deltaY < 0 ? "back" : "front");
        setFacing(1);
      }
      restingRef.current = false;
      setWalking(true);
      setTarget(next);
    }, 700 + Math.random() * 3000);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) {
      window.clearTimeout(timerRef.current);
      setWalking(false);
      return undefined;
    }

    scheduleNext();
    return () => window.clearTimeout(timerRef.current);
  }, [paused, reduceMotion, scheduleNext]);

  const walkDuration = reduceMotion
    ? 0
    : Math.hypot(target.x - positionRef.current.x, target.y - positionRef.current.y) * 0.13;
  const depthScale = 0.62 + (target.y / 80) * 0.5;
  const size = 66 + (mii.height / 100) * 52;

  return (
    <motion.button
      type="button"
      className={"mii-actor" + (walking ? " mii-actor-walking" : "")}
      style={{ zIndex: Math.round(target.y) + 2 }}
      initial={{ left: initial.x + "%", top: initial.y + "%" }}
      animate={{ left: target.x + "%", top: target.y + "%" }}
      transition={{ duration: walkDuration, ease: "linear" }}
      onAnimationComplete={() => {
        positionRef.current = target;
        if (!restingRef.current) {
          restingRef.current = true;
          setWalking(false);
          setView("front");
          setFacing(1);
          if (!pausedRef.current && !reduceMotion) scheduleNext();
        }
      }}
      onClick={() => onSelect(mii)}
      aria-label={mii.isHost
        ? "Nikhil's Mii. Select to read about him."
        : `${mii.name || "Guest"}'s Mii`}
    >
      <motion.span
        className="mii-actor-depth"
        initial={{ scale: 0.62 + (initial.y / 80) * 0.5 }}
        animate={{ scale: depthScale }}
        transition={{ duration: walkDuration, ease: "linear" }}
      >
        <span className="mii-actor-inner" style={{ transform: `scaleX(${facing})` }}>
          <MiiFigure config={mii} size={size} view={view} />
        </span>
        <span className="mii-actor-shadow" aria-hidden="true" />
        {mii.isHost ? <span className="mii-actor-tag">Nikhil</span> : null}
      </motion.span>
    </motion.button>
  );
}

const MAKER_TABS = [
  { id: "body", label: "Body" },
  { id: "skin", label: "Skin" },
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "eyes", label: "Eyes" },
  { id: "mouth", label: "Mouth" },
  { id: "shirt", label: "Shirt" },
];

function SwatchGrid({ label, colors, value, onChange }) {
  return (
    <div className="mii-swatch-group" role="group" aria-label={label}>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={"mii-swatch" + (value === color ? " is-selected" : "")}
          style={{ background: color }}
          onClick={() => onChange(color)}
          aria-label={`${label}: ${color}`}
          aria-pressed={value === color}
        />
      ))}
    </div>
  );
}

function PartPicker({ label, options, labels, value, onChange, renderOption }) {
  return (
    <div className="mii-part-grid" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          className={"mii-part-option" + (value === option ? " is-selected" : "")}
          onClick={() => onChange(option)}
          aria-pressed={value === option}
        >
          {renderOption(option)}
          <span>{labels[option]}</span>
        </button>
      ))}
    </div>
  );
}

function MiiMaker({ onSave, onClose }) {
  const [config, setConfig] = useState(randomGuestConfig);
  const [tab, setTab] = useState("body");
  const nameInputRef = useRef(null);

  const update = (patch) => setConfig((current) => ({ ...current, ...patch }));

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  return (
    <div className="mii-maker" role="dialog" aria-modal="true" aria-label="Mii maker">
      <div className="mii-maker-tabs" role="tablist" aria-label="Mii features">
        {MAKER_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={"mii-maker-tab" + (tab === item.id ? " is-active" : "")}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          className="mii-maker-tab mii-maker-shuffle"
          onClick={() => setConfig({ ...randomGuestConfig(), name: config.name })}
          aria-label="Randomize this Mii"
        >
          <Shuffle size={15} />
        </button>
      </div>

      <div className="mii-maker-body">
        <div className="mii-maker-preview">
          <div className="mii-maker-stage">
            <MiiFigure config={config} size={150 + config.height * 0.9} />
          </div>
          <label className="mii-maker-name">
            <span>Mii name</span>
            <input
              ref={nameInputRef}
              type="text"
              maxLength={12}
              placeholder="Type a name"
              value={config.name}
              onChange={(event) => update({ name: event.target.value })}
            />
          </label>
          <div className="mii-maker-actions">
            <Button variant="outline" onClick={onClose}>Quit</Button>
            <Button
              className="mii-maker-save"
              onClick={() => onSave({
                ...config,
                name: config.name.trim() || "Guest Mii",
                id: `guest-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
              })}
            >
              Save Mii
            </Button>
          </div>
        </div>

        <div className="mii-maker-options">
          {tab === "body" ? (
            <div className="mii-slider-stack">
              <label>
                <span>Height</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.height}
                  onChange={(event) => update({ height: Number(event.target.value) })}
                />
              </label>
              <label>
                <span>Weight</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.weight}
                  onChange={(event) => update({ weight: Number(event.target.value) })}
                />
              </label>
            </div>
          ) : null}

          {tab === "skin" ? (
            <SwatchGrid
              label="Skin color"
              colors={SKIN_TONES}
              value={config.skin}
              onChange={(skin) => update({ skin })}
            />
          ) : null}

          {tab === "face" ? (
            <PartPicker
              label="Face shape"
              options={Object.keys(HEAD_SHAPES)}
              labels={FACE_LABELS}
              value={config.face}
              onChange={(face) => update({ face })}
              renderOption={(face) => (
                <MiiFigure config={{ ...config, face, hair: "bald" }} size={54} crop="head" />
              )}
            />
          ) : null}

          {tab === "hair" ? (
            <>
              <PartPicker
                label="Hair style"
                options={Object.keys(HAIR_STYLES)}
                labels={HAIR_LABELS}
                value={config.hair}
                onChange={(hair) => update({ hair })}
                renderOption={(hair) => (
                  <MiiFigure config={{ ...config, hair }} size={54} crop="head" />
                )}
              />
              <SwatchGrid
                label="Hair color"
                colors={HAIR_COLORS}
                value={config.hairColor}
                onChange={(hairColor) => update({ hairColor })}
              />
            </>
          ) : null}

          {tab === "eyes" ? (
            <PartPicker
              label="Eyes"
              options={EYE_STYLES}
              labels={EYE_LABELS}
              value={config.eyes}
              onChange={(eyes) => update({ eyes })}
              renderOption={(eyes) => (
                <MiiFigure config={{ ...config, eyes }} size={54} crop="head" />
              )}
            />
          ) : null}

          {tab === "mouth" ? (
            <PartPicker
              label="Mouth"
              options={MOUTH_STYLES}
              labels={MOUTH_LABELS}
              value={config.mouth}
              onChange={(mouth) => update({ mouth })}
              renderOption={(mouth) => (
                <MiiFigure config={{ ...config, mouth }} size={54} crop="head" />
              )}
            />
          ) : null}

          {tab === "shirt" ? (
            <SwatchGrid
              label="Shirt color"
              colors={SHIRT_COLORS}
              value={config.shirt}
              onChange={(shirt) => update({ shirt })}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function MiiPlaza() {
  const reduceMotion = useReducedMotion();
  const [guests, setGuests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [makerOpen, setMakerOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(GUEST_STORAGE_KEY);
      if (stored) setGuests(JSON.parse(stored));
    } catch {
      // Ignore unreadable storage; the plaza just starts empty.
    }
  }, []);

  const persistGuests = useCallback((next) => {
    setGuests(next);
    try {
      window.localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage full or blocked; keep the in-memory plaza working.
    }
  }, []);

  const miis = useMemo(() => [NIKHIL_MII, ...guests], [guests]);

  const initialSpots = useMemo(() => {
    const spots = { nikhil: { x: 46, y: 52 } };
    guests.forEach((guest, index) => {
      spots[guest.id] = {
        x: 12 + ((index * 37) % 76),
        y: 18 + ((index * 23) % 58),
      };
    });
    return spots;
  }, [guests]);

  const removeGuest = (id) => {
    persistGuests(guests.filter((guest) => guest.id !== id));
    setSelected(null);
  };

  return (
    <div className="mii-plaza-shell">
      <div className="mii-plaza-heading">
        <Badge variant="outline">Mii Channel · Plaza</Badge>
        <h2>Welcome to the plaza.</h2>
        <p>Select Nikhil&apos;s Mii to meet him — or make a Mii of your own and let it wander.</p>
      </div>

      <div className="mii-plaza">
        {miis.map((mii) => (
          <WanderingMii
            key={mii.id}
            mii={mii}
            initial={initialSpots[mii.id] || { x: 50, y: 50 }}
            paused={makerOpen || selected?.id === mii.id}
            reduceMotion={reduceMotion}
            onSelect={(next) => setSelected((current) => (
              current?.id === next.id ? null : next
            ))}
          />
        ))}

        <button
          type="button"
          className="mii-plaza-make"
          onClick={() => {
            setSelected(null);
            setMakerOpen(true);
          }}
        >
          <span className="mii-plaza-make-icon"><UserPlus /></span>
          Make a Mii
        </button>

        <span className="mii-plaza-count">{miis.length} {miis.length === 1 ? "Mii" : "Miis"} in the plaza</span>

        {selected?.isHost ? (
          <aside className="mii-about" aria-label="About Nikhil">
            <div className="mii-about-plate">
              <strong>Nikhil</strong>
              <span>PLAYER 01</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close about panel"
              >
                <X size={15} />
              </button>
            </div>
            <p>
              Hi, I&apos;m Nikhil — a sophomore at UIUC majoring in Computer Science and
              Economics. I enjoy finding practical solutions where software meets the
              things I care about.
            </p>
            <div className="mii-about-meta">
              <span><GraduationCap size={16} /> Computer Science + Economics</span>
              <span><MapPin size={16} /> University of Illinois Urbana-Champaign</span>
            </div>
            <p className="mii-about-label">OFF THE CLOCK</p>
            <div className="mii-about-interests">
              {INTERESTS.map((interest) => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </aside>
        ) : null}

        {selected && !selected.isHost ? (
          <aside className="mii-about mii-about-guest" aria-label={`About ${selected.name}`}>
            <div className="mii-about-plate">
              <strong>{selected.name}</strong>
              <span>GUEST</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close panel"
              >
                <X size={15} />
              </button>
            </div>
            <p>A Mii made by a visitor. It lives in the plaza now.</p>
            <Button
              variant="outline"
              className="mii-about-remove"
              onClick={() => removeGuest(selected.id)}
            >
              <Trash2 size={15} />
              Send home
            </Button>
          </aside>
        ) : null}

        {makerOpen ? (
          <MiiMaker
            onClose={() => setMakerOpen(false)}
            onSave={(guest) => {
              persistGuests([...guests, guest]);
              setMakerOpen(false);
            }}
          />
        ) : null}
      </div>
    </div>
  );
}
