import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
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
import { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PHOTOS = [
  {
    src: "/desert.jpg",
    title: "Desert light",
    alt: "Desert path and mountains under a deep blue sky.",
  },
  {
    src: "/summer.jpg",
    title: "Summer",
    alt: "A summer scene photographed by Nikhil.",
  },
  {
    src: "/IMG_20210707_170928.jpg",
    title: "Interior study",
    alt: "A bright interior with wood columns and colorful artwork.",
  },
  {
    src: "/IMG_20210629_202206.jpg",
    title: "City evening",
    alt: "An evening city view photographed by Nikhil.",
  },
  {
    src: "/sunset.jpg",
    title: "Afterglow",
    alt: "A sunset from Nikhil's photo archive.",
  },
  {
    src: "/chicagoSkyline.jpg",
    title: "Chicago",
    alt: "The Chicago skyline seen across the water.",
  },
  {
    src: "/Miami.jpg",
    title: "Miami",
    alt: "A wide view of Miami photographed by Nikhil.",
  },
  {
    src: "/chicago.jpg",
    title: "Lakefront",
    alt: "A Chicago lakefront scene photographed by Nikhil.",
  },
  {
    src: "/southLoopSunset.jpg",
    title: "South Loop",
    alt: "Sunset over Chicago's South Loop.",
  },
];

const ROOM_WALLS = ["back", "left", "right", "front"];

const PHOTO_PLACEMENTS = [
  { wall: "back", x: 21, y: 53, tilt: -2.5, scale: 1.04 },
  { wall: "front", x: 50, y: 46, tilt: 1.5, scale: 0.92 },
  { wall: "back", x: 79, y: 53, tilt: 2, scale: 1 },
  { wall: "left", x: 32, y: 42, tilt: 2.5, scale: 0.78 },
  { wall: "left", x: 62, y: 68, tilt: -1.5, scale: 0.83 },
  { wall: "front", x: 24, y: 52, tilt: 1.5, scale: 0.9 },
  { wall: "right", x: 38, y: 68, tilt: -2, scale: 0.8 },
  { wall: "right", x: 68, y: 42, tilt: -1.5, scale: 0.76 },
  { wall: "front", x: 76, y: 52, tilt: -2, scale: 0.94 },
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
    wall: "back",
    x: 50,
    y: 16,
    src: "https://upload.wikimedia.org/wikipedia/en/c/c7/Memento_poster.jpg",
  },
  {
    title: "Memories of Murder",
    year: "2003",
    wall: "left",
    x: 84,
    y: 14,
    src: "https://upload.wikimedia.org/wikipedia/en/0/01/Salinui-chueok-south-korean-movie-poster-md.jpg",
  },
  {
    title: "Nausicaä of the Valley of the Wind",
    year: "1984",
    wall: "right",
    x: 16,
    y: 15,
    src: "https://upload.wikimedia.org/wikipedia/en/b/bc/Nausicaaposter.jpg",
  },
];

const ROOM_PITCH_LIMIT = 14;

const ROOM_ZOOM_LEVELS = [1, 1.4, 1.9, 2.5];

const clamp = (value, minimum, maximum) => (
  Math.min(maximum, Math.max(minimum, value))
);

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

function VinylCrateView({
  playingAlbum,
  onToggle,
  onClose,
  backButtonRef,
  reduceMotion,
}) {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
    }
  };

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

      <div className="vinyl-grid">
        {VINYL_LIBRARY.map((album) => {
          const isPlaying = playingAlbum === album.title;

          return (
            <button
              key={album.title}
              type="button"
              className={"vinyl-card" + (isPlaying ? " is-playing" : "")}
              onClick={() => onToggle(album)}
              aria-pressed={isPlaying}
              aria-label={(isPlaying ? "Pause the preview of " : "Play a preview of ")
                + album.track + " by " + album.artist}
            >
              <span className="vinyl-disc" aria-hidden="true">
                <img src={album.src} alt="" loading="lazy" draggable={false} />
              </span>
              <span className="vinyl-card-info">
                <strong>{album.track}</strong>
                <span>{album.artist}</span>
              </span>
              <span className="vinyl-card-state" aria-hidden="true">
                {isPlaying ? <Pause /> : <Play />}
              </span>
            </button>
          );
        })}
      </div>

      <p className="vinyl-hint">30-second previews spin on the turntable back in the room.</p>
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

                    {ROOM_WALLS.map((wall) => (
                      <div
                        key={wall}
                        className={"photo-room-wall photo-room-wall-" + wall}
                      >
                        {PHOTOS.map((photo, index) => {
                          const placement = PHOTO_PLACEMENTS[index];
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
                                draggable={false}
                              />
                              <span><Camera size={14} /> {photo.title}</span>
                            </button>
                          );
                        })}

                        {MOVIE_POSTERS.map((movie) => (
                          movie.wall === wall ? (
                            <figure
                              key={movie.title}
                              className="pixel-album-cover movie-poster"
                              style={{
                                left: movie.x + "%",
                                top: movie.y + "%",
                              }}
                            >
                              <img
                                src={movie.src}
                                alt={movie.title + " movie poster"}
                                loading="lazy"
                                draggable={false}
                              />
                              <figcaption>
                                <strong>{movie.title}</strong>
                                <span>{movie.year}</span>
                              </figcaption>
                            </figure>
                          ) : null
                        ))}
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
