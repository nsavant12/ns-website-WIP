import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap, MapPin, Shuffle, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const SKIN_TONES = ["#ffe2c8", "#f6c9a0", "#e2a76f", "#c9834d", "#96562c", "#5f3a20"];

const SHIRT_COLORS = [
  "#e8c520", "#d8433c", "#3a76c9", "#3fa24c",
  "#8a52b5", "#e88024", "#31b7c3", "#e668a7",
  "#4a4a52", "#f2f2f2",
];

const HAIR_COLORS = ["#26201d", "#4b3121", "#7a4a26", "#c19143", "#b8b8bc", "#8c3b22", "#3a5da8"];

const FACE_SHAPES = ["round", "oval", "square", "pointed"];
const HAIR_STYLE_IDS = ["spiky", "bowl", "part", "buzz", "long", "bald"];
const EYE_STYLES = ["dot", "wide", "sleepy", "happy"];
const MOUTH_STYLES = ["smile", "grin", "line", "frown"];

const FACE_LABELS = { round: "Round", oval: "Oval", square: "Square", pointed: "Pointed" };
const HAIR_LABELS = {
  spiky: "Spiky", bowl: "Bowl", part: "Side part", buzz: "Buzz", long: "Long", bald: "Bald",
};
const EYE_LABELS = { dot: "Classic", wide: "Wide", sleepy: "Sleepy", happy: "Happy" };
const MOUTH_LABELS = { smile: "Smile", grin: "Grin", line: "Neutral", frown: "Frown" };

/*
 * 8-bit sprite system. Each pose/view is a 16x18 grid of characters:
 *   . transparent   H hair   S skin   E eye   M mouth
 *   T shirt         L legs   F shoes
 * Colors are substituted per Mii at render time, so one template set
 * serves every combination the maker can produce.
 */

const GRID_W = 16;
const GRID_H = 18;

const HEAD_FRONT = [
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HSSSSSSSSH...",
  "...HSSSSSSSSH...",
  "...SSESSSSESS...",
  "...SSSSSSSSSS...",
  "...SSSSMMSSSS...",
  "....SSSSSSSS....",
];

const HEAD_REAR = [
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "....SSSSSSSS....",
];

const HEAD_SIDE = [
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HHHHSSSSSS...",
  "...HHHSSSSSSS...",
  "...HHHSSSSESS...",
  "...HHHSSSSSSS...",
  "...HHHSSSSMMS...",
  "....SSSSSSSS....",
];

const BODY_STAND = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..STTTTTTTTTTS..",
  "..STTTTTTTTTTS..",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  ".....LL..LL.....",
  "....FFF..FFF....",
];

const BODY_WALK_A = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..STTTTTTTTTT...",
  "...TTTTTTTTTTS..",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  "....LL....LL....",
  "...FFF....FFF...",
];

const BODY_WALK_B = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTTS..",
  "..STTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  ".....LL..LL.....",
  "....FFF..FFF....",
];

const BODY_SIDE_STAND = [
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  ".....TTTTTTS....",
  ".....TTTTTTS....",
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  "......LLLL......",
  "......LLLL......",
  "......FFFFF.....",
];

const BODY_SIDE_WALK_A = [
  ".....TTTTTT.....",
  ".....TTTTTT.S...",
  ".....TTTTTT.S...",
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  ".....LL.LL......",
  "....LL...LL.....",
  "...FF.....FF....",
];

const BODY_SIDE_WALK_B = [
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  ".....TTTTTTS....",
  ".....TTTTTTS....",
  ".....TTTTTT.....",
  ".....TTTTTT.....",
  "......LLLL......",
  "......LLLL......",
  "......FFFFF.....",
];

const BODY_DANCE_A = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTTS..",
  "...TTTTTTTTTTS..",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  "....LL....LL....",
  "....LL....LL....",
  "...FFF....FFF...",
];

const BODY_DANCE_B = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..STTTTTTTTTT...",
  "..STTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  "....LL....LL....",
  "....LL....LL....",
  "...FFF....FFF...",
];

const BODY_CHEER = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  ".....LL..LL.....",
  "....FFF..FFF....",
];

const BODY_CHEER_JUMP = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  "....LL....LL....",
  "...FFF....FFF...",
];

const BODY_THINK = [
  "....TTTTTTTT....",
  "...TTTTTTTTTT...",
  "..STTTTTTTTTT...",
  "..STTTTTTTTTT...",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  ".....LL..LL.....",
  "....FFF..FFF....",
];

const CROUCH_ROWS = [
  "................",
  "................",
  "................",
  "....HHHHHHHH....",
  "...HHHHHHHHHH...",
  "...HHHHHHHHHH...",
  "...HSSSSSSSSH...",
  "...HSSSSSSSSH...",
  "...SSESSSSESS...",
  "...SSSSSSSSSS...",
  "...SSSSMMSSSS...",
  "....SSSSSSSS....",
  "..STTTTTTTTTTS..",
  "..STTTTTTTTTTS..",
  "...TTTTTTTTTT...",
  "....TTTTTTTT....",
  ".....LL..LL.....",
  "....FFF..FFF....",
];

const frameOf = (rows, headOffset = 0, pixels = []) => ({ rows, headOffset, pixels });
const standard = (head, body, pixels = []) => frameOf([...head, ...body], 0, pixels);

const SPRITES = {
  idle: {
    front: [standard(HEAD_FRONT, BODY_STAND)],
    side: [standard(HEAD_SIDE, BODY_SIDE_STAND)],
    back: [standard(HEAD_REAR, BODY_STAND)],
  },
  walk: {
    front: [standard(HEAD_FRONT, BODY_WALK_A), standard(HEAD_FRONT, BODY_WALK_B)],
    side: [standard(HEAD_SIDE, BODY_SIDE_WALK_A), standard(HEAD_SIDE, BODY_SIDE_WALK_B)],
    back: [standard(HEAD_REAR, BODY_WALK_A), standard(HEAD_REAR, BODY_WALK_B)],
  },
  crouch: {
    front: [frameOf(CROUCH_ROWS, 3)],
  },
  dance: {
    front: [
      standard(HEAD_FRONT, BODY_DANCE_A, [[4, 1, "S"], [5, 1, "S"]]),
      standard(HEAD_FRONT, BODY_DANCE_B, [[4, 14, "S"], [5, 14, "S"]]),
    ],
  },
  cheer: {
    front: [
      standard(HEAD_FRONT, BODY_CHEER, [[3, 1, "S"], [4, 1, "S"], [3, 14, "S"], [4, 14, "S"]]),
      standard(HEAD_FRONT, BODY_CHEER_JUMP, [[2, 1, "S"], [3, 1, "S"], [2, 14, "S"], [3, 14, "S"]]),
    ],
  },
  think: {
    front: [standard(HEAD_FRONT, BODY_THINK, [[8, 12, "S"], [9, 12, "S"]])],
  },
};
SPRITES.run = SPRITES.walk;

const setCell = (grid, row, col, char) => {
  if (row >= 0 && row < grid.length && col >= 0 && col < GRID_W) grid[row][col] = char;
};

function applyHairStyle(grid, style, view, offset) {
  if (style === "bowl") return;

  if (style === "bald") {
    grid.forEach((row, r) => {
      row.forEach((char, c) => {
        if (char === "H") row[c] = r === offset ? "." : "S";
      });
    });
    return;
  }
  if (style === "buzz") {
    grid.forEach((row, r) => {
      if (r <= offset + 2) return;
      row.forEach((char, c) => {
        if (char === "H") row[c] = "S";
      });
    });
    return;
  }
  if (style === "spiky") {
    const top = grid[offset];
    if (top) top.forEach((char, c) => {
      if (char === "H" && c % 2 === 1) top[c] = ".";
    });
    return;
  }
  if (style === "part") {
    const top = grid[offset];
    if (top) {
      let cleared = 0;
      for (let c = 0; c < GRID_W && cleared < 2; c += 1) {
        if (top[c] === "H") {
          top[c] = ".";
          cleared += 1;
        }
      }
    }
    return;
  }
  if (style === "long") {
    for (let r = offset + 9; r <= offset + 12; r += 1) {
      if (view === "back") {
        for (let c = 4; c <= 11; c += 1) setCell(grid, r, c, "H");
      } else if (view === "side") {
        setCell(grid, r, 3, "H");
        setCell(grid, r, 4, "H");
      } else {
        setCell(grid, r, 3, "H");
        setCell(grid, r, 12, "H");
      }
    }
  }
}

function applyFace(grid, config, view, offset, forceCheer) {
  const eyeRow = offset + 5;
  const mouthRow = offset + 7;
  const chinRow = offset + 8;
  const eyes = forceCheer ? "happy" : config.eyes;
  const mouth = forceCheer ? "grin" : config.mouth;

  if (config.face === "square") {
    setCell(grid, chinRow, 3, "S");
    setCell(grid, chinRow, 12, "S");
  } else if (config.face === "pointed") {
    setCell(grid, chinRow, 4, ".");
    setCell(grid, chinRow, 11, ".");
  }

  if (view === "back") return;

  const eyeCols = view === "side" ? [10] : [5, 10];
  eyeCols.forEach((col) => {
    if (eyes === "wide") {
      setCell(grid, eyeRow - 1, col, "E");
    } else if (eyes === "sleepy") {
      setCell(grid, eyeRow, col - 1, "E");
    } else if (eyes === "happy") {
      setCell(grid, eyeRow - 1, col, "E");
      setCell(grid, eyeRow, col, "S");
      setCell(grid, eyeRow, col - 1, "E");
      setCell(grid, eyeRow, col + 1, "E");
    }
  });

  if (view === "side") return;

  if (mouth === "smile") {
    setCell(grid, mouthRow, 6, "M");
    setCell(grid, mouthRow, 9, "M");
    setCell(grid, mouthRow - 1, 5, "M");
    setCell(grid, mouthRow - 1, 10, "M");
  } else if (mouth === "grin") {
    for (let c = 6; c <= 9; c += 1) setCell(grid, mouthRow, c, "M");
    setCell(grid, mouthRow - 1, 7, "M");
    setCell(grid, mouthRow - 1, 8, "M");
  } else if (mouth === "frown") {
    setCell(grid, mouthRow, 7, "S");
    setCell(grid, mouthRow, 8, "S");
    for (let c = 6; c <= 9; c += 1) setCell(grid, mouthRow - 1, c, "M");
    setCell(grid, mouthRow, 5, "M");
    setCell(grid, mouthRow, 10, "M");
  }
  // "line" keeps the template's flat two-pixel mouth.
}

const gridCache = new Map();

function buildGrid(config, pose, view, frame) {
  const pack = SPRITES[pose] || SPRITES.idle;
  const frames = pack[view] || pack.front || SPRITES.idle.front;
  const template = frames[frame % frames.length];
  const activeView = pack[view] ? view : "front";

  const key = [
    pose, activeView, frame % frames.length,
    config.hair, config.face, config.eyes, config.mouth,
  ].join("|");
  const cached = gridCache.get(key);
  if (cached) return cached;

  const grid = template.rows.map((row) => row.split(""));
  template.pixels.forEach(([row, col, char]) => setCell(grid, row, col, char));
  applyHairStyle(grid, config.hair, activeView, template.headOffset);
  applyFace(grid, config, activeView, template.headOffset, pose === "cheer");

  const rows = grid.map((row) => row.join(""));
  gridCache.set(key, rows);
  return rows;
}

const SPRITE_FIXED_COLORS = {
  E: "#20242b",
  M: "#8a4a42",
  L: "#4a4b55",
  F: "#7a7b85",
};

// Collapses a grid of characters into horizontal runs so each pose can be
// drawn as a handful of <rect>s instead of one per pixel.
function rowsToRects(rows, gridWidth) {
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < gridWidth) {
      const char = row[x];
      if (char === ".") {
        x += 1;
        continue;
      }
      let end = x;
      while (end + 1 < gridWidth && row[end + 1] === char) end += 1;
      rects.push({ x, y, width: end - x + 1, char });
      x = end + 1;
    }
  });
  return rects;
}

export function MiiFigure({ config, size = 96, crop, view = "front", pose = "idle", frame = 0 }) {
  const rows = buildGrid(config, crop === "head" ? "idle" : pose, crop === "head" ? "front" : view, frame);

  const colors = {
    ...SPRITE_FIXED_COLORS,
    H: config.hairColor,
    S: config.skin,
    T: config.shirt,
  };

  const rects = rowsToRects(rows, GRID_W);

  const weightScale = 0.85 + (config.weight / 100) * 0.3;
  const isHead = crop === "head";
  const viewBox = isHead ? "2 0 12 11" : `0 0 ${GRID_W} ${GRID_H}`;
  const width = isHead ? size : size * (GRID_W / GRID_H) * weightScale;

  return (
    <svg
      className="mii-figure-svg"
      viewBox={viewBox}
      width={width}
      height={size}
      shapeRendering="crispEdges"
      role="presentation"
      aria-hidden="true"
    >
      {rects.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height="1"
          fill={colors[rect.char]}
        />
      ))}
    </svg>
  );
}

// 12x9 pixel thought bubble: rounded shell (B outline, W fill) plus a
// two-pixel trailing tail pointing down toward the Mii's head.
const BUBBLE_ROWS = [
  "..BBBBBBBB..",
  ".BBWWWWWWBB.",
  "BWWWWWWWWWWB",
  "BWWWWWWWWWWB",
  "BWWWWWWWWWWB",
  ".BBWWWWWWBB.",
  "..BBBBBBBB..",
  "...B........",
  "..B.........",
];
const BUBBLE_W = 12;
const BUBBLE_RECTS = rowsToRects(BUBBLE_ROWS, BUBBLE_W);
const BUBBLE_DOTS = [
  { x: 2, y: 3, width: 2, height: 2 },
  { x: 5, y: 3, width: 2, height: 2 },
  { x: 8, y: 3, width: 2, height: 2 },
];

function PixelThoughtBubble({ dotStage }) {
  return (
    <svg
      className="mii-bubble-svg"
      viewBox={`0 0 ${BUBBLE_W} 9`}
      shapeRendering="crispEdges"
      role="presentation"
      aria-hidden="true"
    >
      {BUBBLE_RECTS.map((rect, index) => (
        <rect
          key={index}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height="1"
          fill={rect.char === "B" ? "#8fa2ad" : "#ffffff"}
        />
      ))}
      {BUBBLE_DOTS.map((dot, index) => (
        <rect
          key={index}
          x={dot.x}
          y={dot.y}
          width={dot.width}
          height={dot.height}
          fill="#4b565c"
          opacity={dotStage > index ? 1 : 0}
        />
      ))}
    </svg>
  );
}

// Cycles 0 (blank) -> 1 dot -> 2 dots -> 3 dots -> blank, like a typing
// indicator, for as long as the bubble stays mounted.
function ThinkingBubble({ reduceMotion }) {
  const [dotStage, setDotStage] = useState(reduceMotion ? 3 : 0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = window.setInterval(() => {
      setDotStage((stage) => (stage + 1) % 4);
    }, 380);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <span className="mii-thought-bubble" aria-hidden="true">
      <PixelThoughtBubble dotStage={dotStage} />
    </span>
  );
}

// Solid eighth-note glyph: a round head, a straight attached stem, and a
// hooked flag with a couple of gloss strokes, drawn as one silhouette.
function NoteSvg({ extraClassName = "" }) {
  return (
    <svg
      className={extraClassName}
      viewBox="0 0 110 140"
      role="presentation"
      aria-hidden="true"
    >
      <g fill="#212327">
        <ellipse cx="34" cy="112" rx="30" ry="27" />
        <path d="M53,122 L69,122 L69,16 L53,16 Z" />
        <path d="M69,16 C96,18 110,42 102,64 C97,82 82,94 70,90 C84,80 90,60 84,42 C80,30 74,22 69,16 Z" />
      </g>
      <path d="M18,96 C14,104 14,116 20,124" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M78,28 C88,30 96,38 98,46" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function PixelMusicNote({ onDone, dx }) {
  return (
    <span
      className="mii-note-spawn"
      style={{ "--note-dx": dx + "px" }}
      onAnimationEnd={onDone}
    >
      <NoteSvg />
    </span>
  );
}

// Keeps exactly one note rising/shaking/fading at a time; the instant one
// finishes its trip, a fresh one spawns in its place with new jitter.
function DancingNotes({ reduceMotion }) {
  const [spawnId, setSpawnId] = useState(0);

  if (reduceMotion) {
    return (
      <span className="mii-note-spawn mii-note-static" aria-hidden="true">
        <NoteSvg />
      </span>
    );
  }

  return (
    <PixelMusicNote
      key={spawnId}
      dx={Math.round((Math.random() - 0.5) * 10)}
      onDone={() => setSpawnId((id) => id + 1)}
    />
  );
}

// Pixel "add person" glyph for the Make a Mii button: a small blocky
// head-and-shoulders silhouette with a badge notched into its bottom-right
// corner, like a standard "add" avatar affordance.
const PERSON_RECTS = [
  { x: 4, y: 1, width: 4, height: 4 },
  { x: 3, y: 6, width: 6, height: 1 },
  { x: 2, y: 7, width: 8, height: 1 },
  { x: 1, y: 8, width: 10, height: 1 },
];
const BADGE_BACKDROP = { x: 8, y: 6, width: 6, height: 6 };
const PLUS_RECTS = [
  { x: 10, y: 7, width: 2, height: 4 },
  { x: 9, y: 8, width: 4, height: 2 },
];

function PixelAddPersonIcon() {
  return (
    <svg
      className="mii-add-icon"
      viewBox="0 0 16 14"
      shapeRendering="crispEdges"
      role="presentation"
      aria-hidden="true"
    >
      {PERSON_RECTS.map((rect, index) => (
        <rect key={"p" + index} x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill="#55666d" />
      ))}
      <rect
        x={BADGE_BACKDROP.x}
        y={BADGE_BACKDROP.y}
        width={BADGE_BACKDROP.width}
        height={BADGE_BACKDROP.height}
        fill="#f2f6f6"
      />
      {PLUS_RECTS.map((rect, index) => (
        <rect key={"b" + index} x={rect.x} y={rect.y} width={rect.width} height={rect.height} fill="#18b7ed" />
      ))}
    </svg>
  );
}

const FRAME_INTERVALS = { walk: 210, run: 125, dance: 300, cheer: 250 };
const MOVE_SPEED = { walk: 0.13, run: 0.055 };

function WanderingMii({ mii, onSelect, paused, reduceMotion, initial }) {
  const [target, setTarget] = useState(initial);
  const [activity, setActivity] = useState("idle");
  const [view, setView] = useState("front");
  const [facing, setFacing] = useState(1);
  const [frame, setFrame] = useState(0);
  const positionRef = useRef(initial);
  const timerRef = useRef(null);
  const cheerTimerRef = useRef(null);
  const movingRef = useRef(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Two-frame animation ticker for the active pose.
  useEffect(() => {
    const interval = FRAME_INTERVALS[activity];
    if (!interval || reduceMotion) {
      setFrame(0);
      return undefined;
    }
    const id = window.setInterval(() => setFrame((current) => (current + 1) % 2), interval);
    return () => window.clearInterval(id);
  }, [activity, reduceMotion]);

  const scheduleNext = useCallback((delay) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      if (pausedRef.current) return;
      const roll = Math.random();

      if (roll < 0.55) {
        // Head somewhere new: mostly walking, sometimes running.
        const run = roll < 0.15;
        const next = {
          x: 6 + Math.random() * 84,
          y: 14 + Math.random() * 66,
        };
        const deltaX = next.x - positionRef.current.x;
        const deltaY = next.y - positionRef.current.y;
        if (Math.abs(deltaX) >= Math.abs(deltaY) * 1.15) {
          setView("side");
          setFacing(deltaX >= 0 ? 1 : -1);
        } else {
          setView(deltaY < 0 ? "back" : "front");
          setFacing(1);
        }
        movingRef.current = true;
        setActivity(run ? "run" : "walk");
        setTarget(next);
        return;
      }

      // Stationary business: loiter, crouch, bust a move, or chat.
      const act = roll < 0.7 ? "idle" : roll < 0.8 ? "crouch" : roll < 0.9 ? "dance" : "think";
      setView("front");
      setFacing(1);
      setActivity(act);
      scheduleNext(act === "idle" ? 1200 + Math.random() * 1800 : 1900 + Math.random() * 2100);
    }, delay ?? (500 + Math.random() * 2100));
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) {
      window.clearTimeout(timerRef.current);
      if (!movingRef.current) {
        setActivity((current) => (current === "cheer" ? current : "idle"));
      }
      return undefined;
    }

    scheduleNext();
    return () => window.clearTimeout(timerRef.current);
  }, [paused, reduceMotion, scheduleNext]);

  useEffect(() => () => {
    window.clearTimeout(timerRef.current);
    window.clearTimeout(cheerTimerRef.current);
  }, []);

  const handleClick = (event) => {
    onSelect(mii);
    if (reduceMotion) return;

    // If mid-walk, stop right where the Mii currently is.
    if (movingRef.current) {
      const element = event.currentTarget;
      const parent = element.offsetParent;
      if (parent && parent.clientWidth) {
        const here = {
          x: (element.offsetLeft / parent.clientWidth) * 100,
          y: (element.offsetTop / parent.clientHeight) * 100,
        };
        positionRef.current = here;
        setTarget(here);
      }
      movingRef.current = false;
    }

    // A little celebration, like the Mii Channel cheer.
    window.clearTimeout(timerRef.current);
    window.clearTimeout(cheerTimerRef.current);
    setView("front");
    setFacing(1);
    setActivity("cheer");
    cheerTimerRef.current = window.setTimeout(() => {
      setActivity("idle");
      if (!pausedRef.current) scheduleNext();
    }, 1700);
  };

  const moveSpeed = MOVE_SPEED[activity] ?? 0.13;
  const walkDuration = reduceMotion
    ? 0
    : Math.hypot(target.x - positionRef.current.x, target.y - positionRef.current.y) * moveSpeed;
  const depthScale = 0.62 + (target.y / 80) * 0.5;
  const size = 66 + (mii.height / 100) * 52;

  return (
    <motion.button
      type="button"
      className="mii-actor"
      style={{ zIndex: Math.round(target.y) + 2 }}
      initial={{ left: initial.x + "%", top: initial.y + "%" }}
      animate={{ left: target.x + "%", top: target.y + "%" }}
      transition={{ duration: walkDuration, ease: "linear" }}
      onAnimationComplete={() => {
        positionRef.current = target;
        if (movingRef.current) {
          movingRef.current = false;
          setActivity("idle");
          setView("front");
          setFacing(1);
          if (!pausedRef.current && !reduceMotion) scheduleNext();
        }
      }}
      onClick={handleClick}
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
        {activity === "cheer" ? <span className="mii-cheer-burst" aria-hidden="true" /> : null}
        {activity === "think" ? <ThinkingBubble reduceMotion={reduceMotion} /> : null}
        {activity === "dance" ? <DancingNotes reduceMotion={reduceMotion} /> : null}
        <span className="mii-actor-inner" style={{ transform: `scaleX(${facing})` }}>
          <MiiFigure config={mii} size={size} view={view} pose={activity} frame={frame} />
        </span>
        <span className="mii-actor-shadow" aria-hidden="true" />
        {mii.isHost ? <span className="mii-actor-tag">Nikhil</span> : null}
      </motion.span>
    </motion.button>
  );
}

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
    hair: randomItem(HAIR_STYLE_IDS),
    hairColor: randomItem(HAIR_COLORS),
    face: randomItem(FACE_SHAPES),
    eyes: randomItem(EYE_STYLES),
    mouth: randomItem(MOUTH_STYLES),
    height: 20 + Math.floor(Math.random() * 60),
    weight: 20 + Math.floor(Math.random() * 60),
  };
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
              options={FACE_SHAPES}
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
                options={HAIR_STYLE_IDS}
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
          aria-label="Make a Mii"
        >
          <span className="mii-plaza-make-icon"><PixelAddPersonIcon /></span>
          <span className="mii-plaza-make-label">Make a Mii</span>
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
