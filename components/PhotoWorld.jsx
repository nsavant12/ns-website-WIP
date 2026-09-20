import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  BatteryFull,
  Camera,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Pause,
  Play,
} from "lucide-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PHOTOS = [
  {
    src: "/desert.jpg",
    title: "Nevada",
    alt: "Desert",
  },
  {
    src: "/summer.jpg",
    title: "Belmont Redline Station",
    alt: "The Chicago Redline",
  },
  {
    src: "/IMG_20210707_170928.jpg",
    title: "Nobu, Miami",
    alt: "Hotel in Miami",
  },
  {
    src: "/IMG_20210629_202206.jpg",
    title: "View from room pt. 2, 2020",
    alt: "City view",
  },
  {
    src: "/sunset.jpg",
    title: "View from my room, 2020",
    alt: "Shoutout to this pandemic apartment",
  },
  {
    src: "/chicagoSkyline.jpg",
    title: "A tourist's view of Chicago",
    alt: "Chicago skyline",
  },
  {
    src: "/Miami.jpg",
    title: "Miami",
    alt: "Miami skyline",
  },
  {
    src: "/chicago.jpg",
    title: "Lakefront",
    alt: "Chicago lakefront",
  },
  {
    src: "/southLoopSunset.jpg",
    title: "South Loop",
    alt: "Sunset over Chicago's South Loop.",
  },
  {
    src: "/IMG_5660.jpeg",
    title: "Salesforce Tower",
    alt: "Above the escalators in Salesforce Tower",
  },
  {
    src: "/IMG_5903.jpeg",
    title: "Falcon admiring architecture",
    alt: "The Transamerica pyramid",
  },
  {
    src: "/IMG_5731.jpeg",
    title: "Sakura - Chris Stussy",
    alt: "Nob Hill",
  },
  {
    src: "/IMG_5970.jpeg",
    title: "4th of July @ Lake Tahoe",
    alt: "Lake Tahoe",
  },
  {
    src: "/IMG_6200.JPG",
    title: "The shot of the shot of the shot",
    alt: "Golden Gate Bridge",
  },
  {
    src: "/IMG_6202.JPG",
    title: "The result",
    alt: "Cool looking Golden Gate Bridge",
  },
];

const ROOM_WALLS = ["back", "left", "right", "front"];

// Used for the very first paint (server-rendered, before the client has had
// a chance to roll a fresh layout) so hydration always starts from the same
// markup on both sides.
const DEFAULT_PHOTO_PLACEMENTS = [
  { wall: "back", x: 21, y: 53, tilt: -2.5, scale: 1.04 },
  { wall: "front", x: 50, y: 46, tilt: 1.5, scale: 0.92 },
  { wall: "back", x: 79, y: 53, tilt: 2, scale: 1 },
  { wall: "left", x: 32, y: 42, tilt: 2.5, scale: 0.78 },
  { wall: "left", x: 62, y: 68, tilt: -1.5, scale: 0.83 },
  { wall: "front", x: 24, y: 52, tilt: 1.5, scale: 0.9 },
  { wall: "right", x: 38, y: 68, tilt: -2, scale: 0.8 },
  { wall: "right", x: 68, y: 42, tilt: -1.5, scale: 0.76 },
  { wall: "front", x: 76, y: 52, tilt: -2, scale: 0.94 },
  { wall: "left", x: 50, y: 20, tilt: 1, scale: 0.7 },
  { wall: "back", x: 15, y: 26, tilt: -2, scale: 0.72 },
  { wall: "back", x: 85, y: 26, tilt: 2.2, scale: 0.72 },
  { wall: "front", x: 50, y: 20, tilt: -1, scale: 0.95 },
  { wall: "left", x: 15, y: 58, tilt: -2.5, scale: 0.68 },
  { wall: "right", x: 85, y: 58, tilt: 2.5, scale: 0.68 },
];

const VINYL_LIBRARY = [
  {
    title: "Utility",
    artist: "Barker",
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/58/17/c6/5817c6c7-d5ba-bec6-f98d-2910748c17f5/4250101407932_cover.jpg/600x600bb.jpg",
    track: "Utility",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/b9/6c/43/b96c43d6-99b0-5717-6e32-62faab3d7fd5/mzaf_1706470681253136801.plus.aac.p.m4a",
  },
  {
    title: "Walking Wounded",
    artist: "Everything But the Girl",
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bb/26/57/bb265719-c6c7-d4bd-16ca-08946eff894d/5060516091058.png/600x600bb.jpg",
    track: "Walking Wounded",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/35/87/51/3587516a-27de-5508-521c-9a05ee0b1939/mzaf_9878866461840107767.plus.aac.p.m4a",
  },
  {
    title: "Producer 01",
    artist: "LTJ Bukem",
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d1/57/13/d15713db-09fd-d905-a7ed-9abc248bb85e/7640152970504_Cover.jpg/600x600bb.jpg",
    track: "Demons Theme",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/21/e4/f8/21e4f8f3-a637-2a5c-6a59-4d4b6385f8a0/mzaf_16202025237066280301.plus.aac.p.m4a",
  },
  {
    title: "The Best of Sade",
    artist: "Sade",
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/ad/2a/5fad2aca-d998-701d-7b27-c074339d5fd0/886972262628.jpg/600x600bb.jpg",
    track: "Smooth Operator",
    previewUrl: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/7d/9a/50/7d9a50b9-75bd-c4c8-5c72-ac200a333474/mzaf_10550216675185697487.plus.aac.p.m4a",
  },
];

// Poster art hotlinked from Wikipedia's film pages.
const MOVIE_POSTERS = [
  {
    title: "Memento",
    year: "2000",
    src: "https://upload.wikimedia.org/wikipedia/en/c/c7/Memento_poster.jpg",
  },
  {
    title: "Memories of Murder",
    year: "2003",
    src: "https://upload.wikimedia.org/wikipedia/en/0/01/Salinui-chueok-south-korean-movie-poster-md.jpg",
  },
  {
    title: "Nausicaä of the Valley of the Wind",
    year: "1984",
    src: "https://upload.wikimedia.org/wikipedia/en/b/bc/Nausicaaposter.jpg",
  },
];

// The server-rendered default placement for each poster, indexed to match
// MOVIE_POSTERS above.
const DEFAULT_MOVIE_PLACEMENTS = [
  { wall: "back", x: 50, y: 16 },
  { wall: "left", x: 84, y: 14 },
  { wall: "right", x: 16, y: 15 },
];

const ROOM_PITCH_LIMIT = 14;

const ROOM_ZOOM_LEVELS = [1, 1.4, 1.9, 2.5];

const clamp = (value, minimum, maximum) => (
  Math.min(maximum, Math.max(minimum, value))
);

// Pixel footprint of each wall (back/front use the room's width; left/right
// are slightly wider since they run the depth-plus-front span instead).
const WALL_DIMENSIONS = {
  back: { width: 1200, height: 720 },
  front: { width: 1200, height: 720 },
  left: { width: 1230, height: 720 },
  right: { width: 1230, height: 720 },
};

const PHOTO_BASE_WIDTH = 300;
const PHOTO_ASPECT_RATIO = 3 / 4;
const PHOTO_SCALE_RANGE = [0.7, 1.05];
const PHOTO_TILT_RANGE = [-3, 3];
const POSTER_WIDTH = 118;
const POSTER_HEIGHT = 175;
const POSTER_CAPTION_HEIGHT = 46;

// Five non-overlapping slots per wall (a row of three up top, two below),
// each with a size budget (in percent of the wall) that an item is placed
// within — so overlap is impossible by construction, no rejection sampling
// or retry limit required. When a wall draws fewer than five items, a
// random subset of its slots is used, so which slot goes empty varies too.
// The back wall's lower two slots are pushed to the far sides and narrowed
// so they clear the TV mounted at its center (x 30-70%, y 46-100%).
const SLOT_LAYOUTS = {
  open: [
    { x: 17, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 50, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 83, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 25, y: 68, halfW: 20, aboveH: 20, belowH: 22 },
    { x: 75, y: 68, halfW: 20, aboveH: 20, belowH: 22 },
  ],
  back: [
    { x: 17, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 50, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 83, y: 24, halfW: 15, aboveH: 17, belowH: 20 },
    { x: 15, y: 68, halfW: 13, aboveH: 20, belowH: 22 },
    { x: 85, y: 68, halfW: 13, aboveH: 20, belowH: 22 },
  ],
};

const WALL_SLOT_LAYOUT = { back: "back", front: "open", left: "open", right: "open" };

const randomBetween = (min, max) => min + Math.random() * (max - min);

function shuffle(list) {
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Rolls a fresh layout for every framed photo and movie poster: items are
// dealt across the four walls as evenly as their count allows, then each
// wall's items are dropped into a random subset of its five fixed slots.
// Because slots never overlap each other or the back wall's TV, and every
// item is shrunk (if needed) to fit inside whichever slot it lands in,
// nothing can ever collide — the room just looks different every visit.
function generateRoomLayout() {
  const photoItems = PHOTOS.map((_, index) => ({
    kind: "photo",
    index,
    scale: randomBetween(...PHOTO_SCALE_RANGE),
    tilt: randomBetween(...PHOTO_TILT_RANGE),
  }));

  const posterItems = MOVIE_POSTERS.map((_, index) => ({
    kind: "poster",
    index,
  }));

  const items = shuffle([...photoItems, ...posterItems]);

  // Deal off a shuffled wall order so any remainder (the counts rarely
  // divide evenly by four) lands on a different wall each time instead of
  // always favoring the same one.
  const wallOrder = shuffle(ROOM_WALLS);
  const itemsByWall = { back: [], left: [], right: [], front: [] };
  items.forEach((item, i) => {
    itemsByWall[wallOrder[i % wallOrder.length]].push(item);
  });

  const photoPlacements = new Array(PHOTOS.length);
  const moviePlacements = new Array(MOVIE_POSTERS.length);

  ROOM_WALLS.forEach((wall) => {
    const { width, height } = WALL_DIMENSIONS[wall];
    const slots = shuffle(SLOT_LAYOUTS[WALL_SLOT_LAYOUT[wall]]);

    itemsByWall[wall].forEach((item, slotIndex) => {
      const slot = slots[slotIndex];

      const naturalWidthPx = item.kind === "photo"
        ? PHOTO_BASE_WIDTH * item.scale
        : POSTER_WIDTH;
      const naturalHeightPx = item.kind === "photo"
        ? naturalWidthPx * PHOTO_ASPECT_RATIO
        : POSTER_HEIGHT;
      const naturalHalfW = (naturalWidthPx / width) * 50;
      const naturalAbove = (naturalHeightPx / height) * 50;
      const naturalBelow = item.kind === "photo"
        ? naturalAbove
        : naturalAbove + (POSTER_CAPTION_HEIGHT / height) * 100;

      // Shrink (never grow) the item so it fits inside the slot's budget.
      const fitFactor = Math.min(
        1,
        slot.halfW / naturalHalfW,
        slot.aboveH / naturalAbove,
        slot.belowH / naturalBelow,
      );
      const halfW = naturalHalfW * fitFactor;
      const above = naturalAbove * fitFactor;
      const below = naturalBelow * fitFactor;

      // Jitter within whatever slack the shrunk item leaves in its slot.
      const x = randomBetween(slot.x - (slot.halfW - halfW), slot.x + (slot.halfW - halfW));
      const y = randomBetween(slot.y - (slot.aboveH - above), slot.y + (slot.belowH - below));

      if (item.kind === "photo") {
        photoPlacements[item.index] = {
          wall,
          slotX: slot.x,
          slotY: slot.y,
          x,
          y,
          tilt: item.tilt,
          scale: item.scale * fitFactor,
        };
      } else {
        moviePlacements[item.index] = { wall, x, y, slotX: slot.x, slotY: slot.y };
      }
    });
  });

  return { photoPlacements, moviePlacements };
}

function playShutterSound(audioContextRef) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = audioContextRef.current || new AudioContext();
  audioContextRef.current = context;
  if (context.state === "suspended") context.resume();

  const duration = 0.085;
  const buffer = context.createBuffer(
    1,
    Math.floor(context.sampleRate * duration),
    context.sampleRate,
  );
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) {
    const envelope = 1 - index / samples.length;
    samples[index] = (Math.random() * 2 - 1) * envelope;
  }

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();
  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = 1450;
  filter.Q.value = 0.8;
  gain.gain.setValueAtTime(0.2, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
  source.connect(filter).connect(gain).connect(context.destination);
  source.start();
}

function CaptureEffect({ phase, reduceMotion }) {
  return (
    <motion.div
      className="photo-capture-effect"
      aria-hidden="true"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="photo-shutter-panel photo-shutter-panel-top"
        initial={{ y: "-100%" }}
        animate={{ y: phase === "shutter" ? "0%" : "-100%" }}
        transition={{ duration: reduceMotion ? 0 : 0.1, ease: "easeIn" }}
      />
      <motion.div
        className="photo-shutter-panel photo-shutter-panel-bottom"
        initial={{ y: "100%" }}
        animate={{ y: phase === "shutter" ? "0%" : "100%" }}
        transition={{ duration: reduceMotion ? 0 : 0.1, ease: "easeIn" }}
      />
      {phase === "flash" ? (
        <motion.div
          className="photo-flash"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.92, 0] }}
          transition={{ duration: reduceMotion ? 0.1 : 0.28, times: [0, 0.12, 0.35, 1] }}
        />
      ) : null}
    </motion.div>
  );
}

function DigitalCameraView({
  photo,
  index,
  onPrevious,
  onNext,
  onClose,
  backButtonRef,
  reduceMotion,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      event.stopPropagation();
      onPrevious();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      onNext();
    }
  };

  return (
    <motion.section
      className="photo-camera-view"
      role="region"
      aria-labelledby="camera-photo-title"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      onKeyDownCapture={handleKeyDown}
    >
      <div className="digital-camera">
        <div className="digital-camera-brand" aria-hidden="true">
          <Camera />
          <strong>NS-CAM</strong>
          <span>9.0 MP</span>
        </div>

        <div className="digital-camera-screen">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={photo.src}
              className="digital-camera-photo"
              initial={reduceMotion ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
              transition={{ duration: reduceMotion ? 0 : 0.16 }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 760px) 90vw, 720px"
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="digital-camera-status" aria-hidden="true">
            <span>PLAY</span>
            <span>{String(index + 1).padStart(2, "0")} / {String(PHOTOS.length).padStart(2, "0")}</span>
            <BatteryFull />
          </div>

          <div className="digital-camera-caption" aria-live="polite">
            <span>PHOTO MEMORY</span>
            <strong id="camera-photo-title">{photo.title}</strong>
          </div>
        </div>

        <aside className="digital-camera-controls" aria-label="Camera playback controls">
          <div className="camera-grip-dots" aria-hidden="true" />
          <div className="camera-zoom-rocker" aria-hidden="true">
            <span>W</span>
            <i />
            <span>T</span>
          </div>

          <div className="camera-dpad">
            <span className="camera-dpad-up" aria-hidden="true">+</span>
            <Button
              variant="ghost"
              size="icon"
              className="camera-dpad-left"
              onClick={onPrevious}
              aria-label="Previous photo"
            >
              <ChevronLeft />
            </Button>
            <span className="camera-dpad-ok" aria-hidden="true">OK</span>
            <Button
              variant="ghost"
              size="icon"
              className="camera-dpad-right"
              onClick={onNext}
              aria-label="Next photo"
            >
              <ChevronRight />
            </Button>
            <span className="camera-dpad-down" aria-hidden="true">
              <Grid2X2 />
            </span>
          </div>

          <Button
            ref={backButtonRef}
            variant="outline"
            className="camera-gallery-button"
            onClick={onClose}
          >
            <ChevronLeft />
            Gallery
          </Button>
          <span className="camera-model" aria-hidden="true">NIKHIL · 01</span>
        </aside>
      </div>
    </motion.section>
  );
}

const VINYL_RING_STEP = 360 / VINYL_LIBRARY.length;
// Pointer travel before a press on a record counts as a swipe of the ring
// rather than a tap on that record.
const VINYL_SWIPE_SLOP = 6;
// A flick shorter than half a record still swaps, as long as it travels this
// far; otherwise the ring springs back to the record it started on.
const VINYL_FLICK_DISTANCE = 34;

// One record floating on the crate's carousel. Its slot on the ellipse, its
// size and how far back it sits all fall out of the shared rotation value, so
// the whole ring orbits together when a new song is picked.
function OrbitVinyl({ album, index, angleSource, isSelected, isPlaying, onPick }) {
  const angle = useTransform(
    angleSource,
    (spin) => ((index * VINYL_RING_STEP + spin) * Math.PI) / 180,
  );
  const left = useTransform(angle, (a) => (50 + Math.sin(a) * 50) + "%");
  const top = useTransform(angle, (a) => (50 + Math.cos(a) * 50) + "%");
  const depth = useTransform(angle, (a) => (Math.cos(a) + 1) / 2);
  const scale = useTransform(depth, (d) => 0.52 + d * 0.6);
  const opacity = useTransform(depth, (d) => 0.58 + d * 0.42);
  const zIndex = useTransform(depth, (d) => Math.round(d * 100));
  const filter = useTransform(depth, (d) => "blur(" + ((1 - d) * 2.2).toFixed(2) + "px)");

  return (
    <motion.div className="vinyl-orbit-slot" style={{ left, top, zIndex }}>
      <motion.div className="vinyl-orbit-depth" style={{ scale, opacity, filter }}>
        <div className="vinyl-orbit-float" style={{ animationDelay: index * -1.7 + "s" }}>
          <button
            type="button"
            className={"vinyl-orbit-disc"
              + (isSelected ? " is-front" : "")
              + (isPlaying ? " is-playing" : "")}
            onClick={() => onPick(index, album)}
            aria-pressed={isPlaying}
            aria-label={(isSelected
              ? (isPlaying ? "Pause the preview of " : "Play a preview of ")
              : "Bring to the front and play ")
              + album.track + " by " + album.artist}
          >
            <span className="vinyl-disc" aria-hidden="true">
              <img src={album.src} alt="" loading="lazy" draggable={false} />
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VinylCrateView({
  playingAlbum,
  onToggle,
  onClose,
  backButtonRef,
  reduceMotion,
}) {
  const startIndex = Math.max(
    0,
    VINYL_LIBRARY.findIndex((album) => album.title === playingAlbum),
  );
  const [selectedIndex, setSelectedIndex] = useState(startIndex);
  const spin = useMotionValue(-startIndex * VINYL_RING_STEP);
  const smoothSpin = useSpring(spin, { stiffness: 68, damping: 17, mass: 0.9 });
  const angleSource = reduceMotion ? spin : smoothSpin;

  // Records can also be flicked through: a horizontal drag spins the crate
  // under the finger, then settles on whichever record ends up in front.
  const swipe = useRef(null);
  const swipeEndedHere = useRef(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };

  // Spin to the picked record along the shorter way around the circle.
  const pickRecord = (index, album) => {
    const current = spin.get();
    const target = -index * VINYL_RING_STEP;
    const delta = ((((target - current + 180) % 360) + 360) % 360) - 180;

    spin.set(current + delta);
    setSelectedIndex(index);
    onToggle(album);
  };

  const startSwipe = (event) => {
    if (VINYL_LIBRARY.length < 2 || event.button > 0) return;

    // One record per ~40% of the stage, so the gesture feels the same on a
    // phone as it does across a desktop crate.
    const span = Math.max(event.currentTarget.clientWidth * 0.4, 90);
    swipe.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startSpin: spin.get(),
      startIndex: selectedIndex,
      degreesPerPixel: VINYL_RING_STEP / span,
      moved: false,
    };
    swipeEndedHere.current = false;
    setIsSwiping(true);
  };

  useEffect(() => {
    if (!isSwiping) return undefined;

    const move = (event) => {
      const drag = swipe.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      const distance = event.clientX - drag.startX;
      if (!drag.moved && Math.abs(distance) < VINYL_SWIPE_SLOP) return;
      drag.moved = true;
      spin.set(drag.startSpin + distance * drag.degreesPerPixel);
    };

    const end = (event) => {
      const drag = swipe.current;
      if (!drag || event.pointerId !== drag.pointerId) return;

      swipe.current = null;
      setIsSwiping(false);
      if (!drag.moved) return;

      const distance = event.clientX - drag.startX;
      const startSlot = Math.round(drag.startSpin / VINYL_RING_STEP);
      let slot = Math.round(spin.get() / VINYL_RING_STEP);
      if (slot === startSlot && Math.abs(distance) >= VINYL_FLICK_DISTANCE) {
        slot = startSlot + (distance < 0 ? -1 : 1);
      }

      const count = VINYL_LIBRARY.length;
      const index = (((-slot % count) + count) % count);
      spin.set(slot * VINYL_RING_STEP);
      setSelectedIndex(index);
      // The release lands on a record, not on the disc the drag began on, so
      // swallow the click that follows.
      swipeEndedHere.current = true;
      // A swipe swaps the song mid-preview; with the needle up it only picks
      // the record, and the front disc drops the needle.
      if (index !== drag.startIndex && playingAlbum) onToggle(VINYL_LIBRARY[index]);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, [isSwiping, onToggle, playingAlbum, spin]);

  const swallowSwipeClick = (event) => {
    if (!swipeEndedHere.current) return;
    swipeEndedHere.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const selectedAlbum = VINYL_LIBRARY[selectedIndex];

  return (
    <motion.section
      className="vinyl-crate-view"
      role="region"
      aria-labelledby="vinyl-crate-title"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
      onKeyDownCapture={handleKeyDown}
    >
      <header className="vinyl-crate-header">
        <Button
          ref={backButtonRef}
          variant="outline"
          className="vinyl-close-button"
          onClick={onClose}
        >
          <ChevronLeft />
          Room
        </Button>
        <div className="vinyl-crate-heading">
          <span>RECORD CRATE</span>
          <strong id="vinyl-crate-title">Pick a record, drop the needle</strong>
        </div>
      </header>

      <div className="vinyl-crate-body">
        <nav className="vinyl-sidebar" aria-label="Record crate track list">
          <div className="vinyl-sidebar-top">
            <span>TRACK LIST</span>
            <strong>{VINYL_LIBRARY.length} records</strong>
          </div>
          <ul className="vinyl-sidebar-list">
            {VINYL_LIBRARY.map((album, index) => {
              const isPlaying = playingAlbum === album.title;
              const isSelected = selectedIndex === index;

              return (
                <li key={album.title}>
                  <button
                    type="button"
                    className={"vinyl-sidebar-item"
                      + (isSelected ? " is-selected" : "")
                      + (isPlaying ? " is-playing" : "")}
                    onClick={() => pickRecord(index, album)}
                    aria-current={isSelected ? "true" : undefined}
                    aria-pressed={isPlaying}
                    aria-label={(isPlaying ? "Pause the preview of " : "Play a preview of ")
                      + album.track + " by " + album.artist}
                  >
                    <span className="vinyl-sidebar-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="vinyl-sidebar-text">
                      <strong>{album.track}</strong>
                      <span>{album.artist}</span>
                    </span>
                    <span className="vinyl-sidebar-state" aria-hidden="true">
                      {isPlaying ? <Pause /> : <Play />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="vinyl-hint">Swipe the records to browse. 30-second previews spin on the turntable back in the room.</p>
        </nav>

        <div className="vinyl-ring-stage">
          <div
            className={"vinyl-ring-area" + (isSwiping ? " is-swiping" : "")}
            onPointerDown={startSwipe}
            onClickCapture={swallowSwipeClick}
          >
            <div className="vinyl-ring-orbit">
              {VINYL_LIBRARY.map((album, index) => (
                <OrbitVinyl
                  key={album.title}
                  album={album}
                  index={index}
                  angleSource={angleSource}
                  isSelected={selectedIndex === index}
                  isPlaying={playingAlbum === album.title}
                  onPick={pickRecord}
                />
              ))}
            </div>
          </div>
          <div className="vinyl-ring-caption" aria-live="polite">
            <strong>{selectedAlbum.track}</strong>
            <span>{selectedAlbum.artist}</span>
            <small>
              {playingAlbum === selectedAlbum.title ? "Now playing" : "Ready to spin"}
            </small>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function PhotoWorld() {
  const reduceMotion = useReducedMotion();
  const yaw = useMotionValue(0);
  const pitch = useMotionValue(-1);
  const smoothYaw = useSpring(yaw, {
    stiffness: 92,
    damping: 22,
    mass: 0.78,
  });
  const smoothPitch = useSpring(pitch, {
    stiffness: 105,
    damping: 24,
    mass: 0.72,
  });
  const [roomLayout, setRoomLayout] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [capturePhase, setCapturePhase] = useState(null);
  const [playingAlbum, setPlayingAlbum] = useState(null);
  const [isCrateOpen, setIsCrateOpen] = useState(false);
  const previewAudio = useRef(null);
  const pointerStart = useRef(null);
  const didDrag = useRef(false);
  const captureTimers = useRef([]);
  const audioContext = useRef(null);
  const photoButtonRefs = useRef([]);
  const cameraBackButtonRef = useRef(null);
  const crateButtonRef = useRef(null);
  const vinylBackButtonRef = useRef(null);
  const openingPhotoIndex = useRef(null);
  const restorePhotoFocus = useRef(null);
  const isCameraOpen = selectedIndex !== null;

  // Rolled once per mount, client-side only, so the room starts from the
  // same server-rendered layout on both sides and then settles into a fresh
  // shuffle right after hydration.
  useEffect(() => {
    setRoomLayout(generateRoomLayout());
  }, []);

  const photoPlacements = roomLayout ? roomLayout.photoPlacements : DEFAULT_PHOTO_PLACEMENTS;
  const moviePlacements = roomLayout ? roomLayout.moviePlacements : DEFAULT_MOVIE_PLACEMENTS;
  const peachSlot = ROOM_WALLS.flatMap(wall =>
    SLOT_LAYOUTS[WALL_SLOT_LAYOUT[wall]].map(slot => ({ ...slot, wall }))
  ).find(slot => ![...photoPlacements, ...moviePlacements].some(item => item.wall === slot.wall &&
    (item.slotX !== undefined ? item.slotX === slot.x && item.slotY === slot.y :
      Math.abs(item.x - slot.x) < slot.halfW && Math.abs(item.y - slot.y) < Math.max(slot.aboveH, slot.belowH))));

  const clearCaptureTimers = useCallback(() => {
    captureTimers.current.forEach((timer) => window.clearTimeout(timer));
    captureTimers.current = [];
  }, []);

  useEffect(() => () => {
    clearCaptureTimers();
    audioContext.current?.close?.();
    previewAudio.current?.pause();
  }, [clearCaptureTimers]);

  const toggleAlbumPreview = useCallback((album) => {
    if (didDrag.current) return;

    if (!previewAudio.current) {
      previewAudio.current = new Audio();
      previewAudio.current.preload = "none";
    }
    const audio = previewAudio.current;

    if (playingAlbum === album.title) {
      audio.pause();
      setPlayingAlbum(null);
      return;
    }

    audio.onended = () => setPlayingAlbum(null);
    audio.onerror = () => setPlayingAlbum(null);
    audio.src = album.previewUrl;
    audio.currentTime = 0;
    audio.play().then(
      () => setPlayingAlbum(album.title),
      () => setPlayingAlbum(null),
    );
  }, [playingAlbum]);

  const showPhoto = useCallback((index) => {
    if (didDrag.current || capturePhase) return;

    clearCaptureTimers();
    openingPhotoIndex.current = index;
    playShutterSound(audioContext);

    if (reduceMotion) {
      setSelectedIndex(index);
      setCapturePhase("flash");
      captureTimers.current.push(
        window.setTimeout(() => setCapturePhase(null), 120),
      );
      return;
    }

    setCapturePhase("shutter");
    captureTimers.current.push(
      window.setTimeout(() => setCapturePhase("flash"), 115),
      window.setTimeout(() => setSelectedIndex(index), 170),
      window.setTimeout(() => setCapturePhase(null), 390),
    );
  }, [capturePhase, clearCaptureTimers, reduceMotion]);

  const closePhoto = useCallback(() => {
    clearCaptureTimers();
    setCapturePhase(null);
    restorePhotoFocus.current = openingPhotoIndex.current;
    setSelectedIndex(null);
  }, [clearCaptureTimers]);

  const showPreviousPhoto = useCallback(() => {
    setSelectedIndex((current) => (
      current === null ? 0 : (current - 1 + PHOTOS.length) % PHOTOS.length
    ));
  }, []);

  const showNextPhoto = useCallback(() => {
    setSelectedIndex((current) => (
      current === null ? 0 : (current + 1) % PHOTOS.length
    ));
  }, []);

  useEffect(() => {
    if (isCameraOpen) cameraBackButtonRef.current?.focus();
  }, [isCameraOpen]);

  const handlePointerDown = (event) => {
    if (event.button !== 0) return;
    pointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      yaw: yaw.get(),
      pitch: pitch.get(),
    };
    didDrag.current = false;
  };

  const handlePointerMove = (event) => {
    if (!pointerStart.current || pointerStart.current.id !== event.pointerId) return;
    const distanceX = event.clientX - pointerStart.current.x;
    const distanceY = event.clientY - pointerStart.current.y;
    if (Math.hypot(distanceX, distanceY) > 6) {
      didDrag.current = true;
      if (!event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.setPointerCapture?.(event.pointerId);
      }
    }
    yaw.set(pointerStart.current.yaw + distanceX * 0.13);
    pitch.set(clamp(
      pointerStart.current.pitch - distanceY * 0.08,
      -ROOM_PITCH_LIMIT,
      ROOM_PITCH_LIMIT,
    ));
  };

  const handlePointerUp = (event) => {
    if (!pointerStart.current || pointerStart.current.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerStart.current = null;
    window.setTimeout(() => {
      didDrag.current = false;
    }, 0);
  };

  const handlePointerLeave = (event) => {
    if (
      !pointerStart.current
      || event.currentTarget.hasPointerCapture?.(pointerStart.current.id)
    ) return;

    pointerStart.current = null;
    didDrag.current = false;
  };

  const rotateRoom = (direction) => {
    yaw.set(yaw.get() + direction * 24);
  };

  const focusRoomWall = (wall) => {
    const wallYaw = { back: 0, left: -90, right: 90, front: 180 }[wall] ?? 0;
    // Snap to the nearest equivalent angle so the room doesn't unwind
    // through a full revolution when it has already been spun around.
    yaw.set(wallYaw + Math.round((yaw.get() - wallYaw) / 360) * 360);
    pitch.set(0);
  };

  const zoomRoom = (direction) => {
    setZoomIndex((current) => clamp(
      current + direction,
      0,
      ROOM_ZOOM_LEVELS.length - 1,
    ));
  };

  const openCrate = () => {
    if (didDrag.current) return;
    setIsCrateOpen(true);
  };

  const closeCrate = useCallback(() => {
    setIsCrateOpen(false);
  }, []);

  useEffect(() => {
    if (isCrateOpen) vinylBackButtonRef.current?.focus();
  }, [isCrateOpen]);

  const selectedPhoto = selectedIndex === null ? null : PHOTOS[selectedIndex];
  const playingRecord = playingAlbum === null
    ? null
    : VINYL_LIBRARY.find((album) => album.title === playingAlbum);

  return (
    <div className="photo-world-shell">
      <div className="photo-world-heading">
        <Badge variant="outline">Discovery channel · Room view</Badge>
        <h2>Here&apos;s a glance into my room and interests.</h2>
        <p>Drag to look all the way around the room, and zoom with the + and − buttons. Select a framed photo to view it, or open the crate under the table to spin a record.</p>
      </div>

      <div
        className="photo-world"
        aria-label={selectedPhoto
          ? "Digital camera photo playback"
          : (isCrateOpen ? "Vinyl record crate" : "Interactive 3D photo room")}
      >
        <div
          className="photo-world-gallery"
          hidden={Boolean(selectedPhoto) || isCrateOpen}
          aria-hidden={selectedPhoto || isCrateOpen ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <div className="photo-world-sky" aria-hidden="true" />

          <motion.div
            className="photo-room-stage"
            animate={{ scale: ROOM_ZOOM_LEVELS[zoomIndex] }}
            transition={reduceMotion
              ? { duration: 0 }
              : { type: "spring", stiffness: 160, damping: 26 }}
          >
            <div className="photo-room-camera">
              <motion.div
                className="photo-room-pitch"
                style={{ rotateX: reduceMotion ? pitch : smoothPitch }}
              >
                <motion.div
                  className="photo-room-yaw"
                  style={{ rotateY: reduceMotion ? yaw : smoothYaw }}
                >
                  <div className="photo-room">
                    <div className="photo-room-floor" aria-hidden="true" />
                    <div className="photo-room-ceiling" aria-hidden="true" />
                    <div className="photo-room-rug" aria-hidden="true" />

                    {/* Every wall's photos and posters are always mounted, just rotated
                        out of the frustum via CSS 3D transforms. The room never scrolls,
                        so the browser's lazy-load IntersectionObserver never gets a signal
                        to re-check an off-angle wall, and images can sit as blank frames
                        until something else nudges it — loading them eagerly avoids that. */}
                    {ROOM_WALLS.map((wall) => (
                      <div
                        key={wall}
                        className={"photo-room-wall photo-room-wall-" + wall}
                      >
                        {SLOT_LAYOUTS[WALL_SLOT_LAYOUT[wall]].filter(slot =>
                          ![...photoPlacements, ...moviePlacements].some(item => item.wall === wall &&
                            (item.slotX !== undefined ? item.slotX === slot.x && item.slotY === slot.y :
                              Math.abs(item.x - slot.x) < slot.halfW && Math.abs(item.y - slot.y) < Math.max(slot.aboveH, slot.belowH)))
                        ).map(slot => (
                          <Fragment key={`wall-art-${slot.x}-${slot.y}`}>
                          {peachSlot?.wall === wall && peachSlot.x === slot.x && peachSlot.y === slot.y && <figure className="peach-castle-portrait" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                            <img src="/wii/peach-portrait.png" alt="Princess Peach in a pink gown, depicted in stained glass" loading="eager" />
                            <figcaption>Princess Peach</figcaption>
                          </figure>}
                          <svg key={`doodle-${slot.x}-${slot.y}`} className="wario-wall-doodle" viewBox="0 0 160 160" aria-hidden="true"
                            style={{ left: `${slot.x}%`, top: `${slot.y}%`, width: `${Math.min(slot.halfW * 1.5, 20)}%`, color: ["#3485a2", "#c57498", "#b7aa47", "#56a383"][ROOM_WALLS.indexOf(wall)] }}>
                            {wall === "right" ? <g stroke="none">
                              <path fill="#151515" d="M8 62L34 72L43 59L57 77L68 69L80 91L93 70L105 77L117 59L125 72L153 60L134 88L122 81L111 102L99 91L90 109L80 99L70 109L58 92L47 103L36 82L25 89Z" />
                              <path fill="#df79b5" d="M59 55Q61 43 70 42Q79 30 90 43Q102 42 104 55Q116 61 108 73L99 86Q81 96 64 84L54 71Q49 62 59 55Z" />
                            </g> : <path d={[
                              "M39 55Q24 50 26 30L29 16Q50 26 53 44M105 43Q118 25 134 16L140 44Q138 51 130 55M39 55L57 47Q78 40 102 47L126 55Q143 64 143 85L138 108Q124 130 96 136Q61 143 34 122Q18 109 20 89L29 73ZM51 77L52 82M117 72L119 77M64 94Q83 82 105 89Q118 99 106 110Q88 122 68 116Q53 108 64 94ZM75 101L76 105M96 98L97 102M92 126Q118 122 125 110",
                              "M42 39Q74 5 104 38Q135 66 115 112Q95 151 55 125Q20 104 30 67L42 39ZM44 49Q73 39 77 69Q72 98 44 88Q27 71 44 49ZM99 91Q124 86 113 112Q94 143 75 126Q74 107 99 91Z",
                              "M31 66L24 28L62 49L80 16L96 49L137 29L125 72M32 81Q46 55 70 82L80 96L93 79Q120 54 137 81L126 104L110 95L95 117L80 104L63 118L48 96L34 107ZM66 132L98 133",
                              "M42 39Q74 5 104 38Q135 66 115 112Q95 151 55 125Q20 104 30 67L42 39ZM44 49Q73 39 77 69Q72 98 44 88Q27 71 44 49ZM99 91Q124 86 113 112Q94 143 75 126Q74 107 99 91Z"
                            ][ROOM_WALLS.indexOf(wall)]} />}
                          </svg>
                          </Fragment>
                        ))}
                        {PHOTOS.map((photo, index) => {
                          const placement = photoPlacements[index];
                          if (placement.wall !== wall) return null;

                          return (
                            <button
                              key={photo.src}
                              ref={(node) => {
                                photoButtonRefs.current[index] = node;
                              }}
                              type="button"
                              className="photo-room-frame"
                              style={{
                                left: placement.x + "%",
                                top: placement.y + "%",
                                "--photo-tilt": placement.tilt + "deg",
                                "--photo-room-scale": placement.scale,
                              }}
                              onFocus={(event) => {
                                if (event.currentTarget.matches(":focus-visible")) {
                                  focusRoomWall(wall);
                                }
                              }}
                              onClick={() => showPhoto(index)}
                              aria-label={"View " + photo.title + " on the camera screen"}
                            >
                              <Image
                                src={photo.src}
                                alt=""
                                fill
                                sizes="(max-width: 760px) 190px, 280px"
                                priority={index === 0}
                                loading={index === 0 ? undefined : "eager"}
                                draggable={false}
                              />
                              <span><Camera size={14} /> {photo.title}</span>
                            </button>
                          );
                        })}

                        {MOVIE_POSTERS.map((movie, movieIndex) => {
                          const placement = moviePlacements[movieIndex];
                          if (placement.wall !== wall) return null;

                          return (
                            <figure
                              key={movie.title}
                              className="pixel-album-cover movie-poster"
                              style={{
                                left: placement.x + "%",
                                top: placement.y + "%",
                              }}
                            >
                              <img
                                src={movie.src}
                                alt={movie.title + " movie poster"}
                                draggable={false}
                              />
                              <figcaption>
                                <strong>{movie.title}</strong>
                                <span>{movie.year}</span>
                              </figcaption>
                            </figure>
                          );
                        })}
                      </div>
                    ))}

                    <div className="photo-room-table" aria-hidden="true">
                      <div className="pixel-table-top" />
                      <div className="pixel-table-edge" />
                      <div className="pixel-table-edge-side pixel-table-edge-left" />
                      <div className="pixel-table-edge-side pixel-table-edge-right" />
                      <div className="pixel-table-apron" />
                      <span className="pixel-table-leg pixel-table-leg-front-left" />
                      <span className="pixel-table-leg pixel-table-leg-front-right" />
                      <span className="pixel-table-leg pixel-table-leg-back-left" />
                      <span className="pixel-table-leg pixel-table-leg-back-right" />
                    </div>

                    <div className="photo-room-tv" aria-hidden="true">
                      <div className="pixel-tv-console">
                        <span className="pixel-tv-console-top" />
                        <span className="pixel-tv-console-front" />
                        <span className="pixel-tv-console-side pixel-tv-console-side-left" />
                        <span className="pixel-tv-console-side pixel-tv-console-side-right" />
                      </div>
                      <div className="pixel-tv-set">
                        <span className="pixel-tv-panel">
                          <span className="pixel-tv-screen" />
                        </span>
                        <span className="pixel-tv-edge pixel-tv-edge-left" />
                        <span className="pixel-tv-edge pixel-tv-edge-right" />
                        <span className="pixel-tv-edge-top" />
                        <span className="pixel-tv-stand" />
                      </div>
                    </div>

                    <div className="photo-room-fan" aria-hidden="true">
                      <span className="fan-rod" />
                      <span className="fan-rod fan-rod-cross" />
                      <span className="fan-motor" />
                      <span className="fan-motor fan-motor-cross" />
                      <div className="fan-rotor">
                        <div className="fan-blades">
                          <span className="fan-blade" />
                          <span className="fan-blade" />
                          <span className="fan-blade" />
                          <span className="fan-blade" />
                          <span className="fan-hub" />
                        </div>
                      </div>
                    </div>

                    <div className="photo-room-couch" aria-hidden="true">
                      <span className="couch-shadow" />
                      <span className="couch-back-rear" />
                      <span className="couch-back-front" />
                      <span className="couch-back-top" />
                      <span className="couch-back-cap couch-back-cap-left" />
                      <span className="couch-back-cap couch-back-cap-right" />
                      <span className="couch-seat" />
                      <span className="couch-seat-front" />
                      <span className="couch-arm-top couch-arm-top-left" />
                      <span className="couch-arm-top couch-arm-top-right" />
                      <span className="couch-arm-front couch-arm-front-left" />
                      <span className="couch-arm-front couch-arm-front-right" />
                      <span className="couch-arm-side couch-arm-side-outer-left" />
                      <span className="couch-arm-side couch-arm-side-inner-left" />
                      <span className="couch-arm-side couch-arm-side-inner-right" />
                      <span className="couch-arm-side couch-arm-side-outer-right" />
                    </div>

                    {["tall", "couch"].map((variant) => (
                      <div
                        key={variant}
                        className={"photo-room-plant photo-room-plant-" + variant}
                        aria-hidden="true"
                      >
                        <span className="plant-shadow" />
                        <span className="plant-pot-face plant-pot-front" />
                        <span className="plant-pot-face plant-pot-back" />
                        <span className="plant-pot-face plant-pot-left" />
                        <span className="plant-pot-face plant-pot-right" />
                        <span className="plant-pot-soil" />
                        <span className="plant-leaves" />
                        <span className="plant-leaves plant-leaves-cross" />
                      </div>
                    ))}

                    <div
                      className={"record-player" + (playingAlbum ? " is-playing" : "")}
                      aria-hidden="true"
                    >
                      <span className="record-plinth-face record-plinth-front" />
                      <span className="record-plinth-face record-plinth-back" />
                      <span className="record-plinth-side record-plinth-left" />
                      <span className="record-plinth-side record-plinth-right" />
                      <span className="record-plinth-top" />
                      <span className="record-platter" />
                      <span className="record-vinyl">
                        <span className="record-vinyl-face">
                          {playingRecord ? (
                            <img src={playingRecord.src} alt="" draggable={false} />
                          ) : null}
                        </span>
                      </span>
                      <span className="record-tonearm">
                        <span className="record-tonearm-arm" />
                      </span>
                      {playingAlbum ? (
                        <span className="record-notes">
                          <i>♪</i>
                          <i>♫</i>
                          <i>♪</i>
                          <i>♩</i>
                        </span>
                      ) : null}
                    </div>

                    <button
                      ref={crateButtonRef}
                      type="button"
                      className="vinyl-crate"
                      onClick={openCrate}
                      aria-label="Open the record crate under the table to browse and play music"
                    >
                      <span className="vinyl-crate-records" aria-hidden="true">
                        {VINYL_LIBRARY.map((album) => (
                          <img key={album.title} src={album.src} alt="" draggable={false} />
                        ))}
                      </span>
                      <span className="vinyl-crate-face vinyl-crate-back" aria-hidden="true" />
                      <span className="vinyl-crate-side vinyl-crate-side-left" aria-hidden="true" />
                      <span className="vinyl-crate-side vinyl-crate-side-right" aria-hidden="true" />
                      <span className="vinyl-crate-face vinyl-crate-front" aria-hidden="true">
                        45 RPM
                      </span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <div
            className="photo-world-controls"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="wii-nav-button wii-arrow-button"
              onClick={(event) => {
                event.stopPropagation();
                rotateRoom(-1);
              }}
              aria-label="Look left around the room"
            >
              <img src="/wii/wii-arrow-left.png" alt="" draggable={false} />
            </button>
            <button
              type="button"
              className="wii-nav-button wii-zoom-button"
              onClick={(event) => {
                event.stopPropagation();
                zoomRoom(-1);
              }}
              disabled={zoomIndex === 0}
              aria-label="Zoom out"
            >
              <img src="/wii/wii-zoom-out.png" alt="" draggable={false} />
            </button>
            <span>Drag to look around the room</span>
            <button
              type="button"
              className="wii-nav-button wii-zoom-button"
              onClick={(event) => {
                event.stopPropagation();
                zoomRoom(1);
              }}
              disabled={zoomIndex === ROOM_ZOOM_LEVELS.length - 1}
              aria-label="Zoom in"
            >
              <img src="/wii/wii-zoom-in.png" alt="" draggable={false} />
            </button>
            <button
              type="button"
              className="wii-nav-button wii-arrow-button"
              onClick={(event) => {
                event.stopPropagation();
                rotateRoom(1);
              }}
              aria-label="Look right around the room"
            >
              <img src="/wii/wii-arrow-right.png" alt="" draggable={false} />
            </button>
          </div>
        </div>

        <AnimatePresence
          onExitComplete={() => {
            const index = restorePhotoFocus.current;
            if (index === null) return;
            photoButtonRefs.current[index]?.focus();
            restorePhotoFocus.current = null;
          }}
        >
          {selectedPhoto ? (
            <DigitalCameraView
              photo={selectedPhoto}
              index={selectedIndex}
              onPrevious={showPreviousPhoto}
              onNext={showNextPhoto}
              onClose={closePhoto}
              backButtonRef={cameraBackButtonRef}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence
          onExitComplete={() => crateButtonRef.current?.focus()}
        >
          {isCrateOpen ? (
            <VinylCrateView
              playingAlbum={playingAlbum}
              onToggle={toggleAlbumPreview}
              onClose={closeCrate}
              backButtonRef={vinylBackButtonRef}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {capturePhase ? (
            <CaptureEffect
              key="capture"
              phase={capturePhase}
              reduceMotion={reduceMotion}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
