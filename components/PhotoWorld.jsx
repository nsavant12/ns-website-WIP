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

const ROOM_WALLS = ["back", "left", "right"];

const PHOTO_PLACEMENTS = [
  { wall: "back", x: 21, y: 53, tilt: -2.5, scale: 1.04 },
  { wall: "back", x: 50, y: 77, tilt: 1.5, scale: 0.92 },
  { wall: "back", x: 79, y: 53, tilt: 2, scale: 1 },
  { wall: "left", x: 23, y: 42, tilt: 2.5, scale: 0.78 },
  { wall: "left", x: 51, y: 72, tilt: -1.5, scale: 0.83 },
  { wall: "left", x: 78, y: 43, tilt: 1.5, scale: 0.76 },
  { wall: "right", x: 22, y: 70, tilt: -2, scale: 0.8 },
  { wall: "right", x: 50, y: 42, tilt: -1.5, scale: 0.76 },
  { wall: "right", x: 78, y: 70, tilt: 2, scale: 0.82 },
];

const ALBUM_COVERS = [
  {
    title: "Utility",
    artist: "Barker",
    wall: "back",
    x: 32,
    y: 16,
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/58/17/c6/5817c6c7-d5ba-bec6-f98d-2910748c17f5/4250101407932_cover.jpg/600x600bb.jpg",
  },
  {
    title: "Walking Wounded",
    artist: "Everything But the Girl",
    wall: "back",
    x: 68,
    y: 16,
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bb/26/57/bb265719-c6c7-d4bd-16ca-08946eff894d/5060516091058.png/600x600bb.jpg",
  },
  {
    title: "Producer 01",
    artist: "LTJ Bukem",
    wall: "left",
    x: 50,
    y: 15,
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/d1/57/13/d15713db-09fd-d905-a7ed-9abc248bb85e/7640152970504_Cover.jpg/600x600bb.jpg",
  },
  {
    title: "The Best of Sade",
    artist: "Sade",
    wall: "right",
    x: 50,
    y: 15,
    src: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5f/ad/2a/5fad2aca-d998-701d-7b27-c074339d5fd0/886972262628.jpg/600x600bb.jpg",
  },
];

const GLOBE_PINS = [
  { country: "United States", latitude: 39.5, longitude: -98.4 },
  { country: "Canada", latitude: 56.1, longitude: -106.3 },
  { country: "Mexico", latitude: 23.6, longitude: -102.6 },
  { country: "Portugal", latitude: 39.5, longitude: -8.0 },
  { country: "Spain", latitude: 40.3, longitude: -3.7 },
  { country: "Morocco", latitude: 31.8, longitude: -6.3 },
  { country: "Switzerland", latitude: 46.8, longitude: 8.2 },
  { country: "Austria", latitude: 47.6, longitude: 13.7 },
  { country: "India", latitude: 22.9, longitude: 79.4 },
];

// Public-domain Natural Earth country outlines, projected onto the canvas sphere below.
const WORLD_MAP_TEXTURE = "https://upload.wikimedia.org/wikipedia/commons/5/51/BlankMap-Equirectangular.svg";

const ROOM_YAW_LIMIT = 48;
const ROOM_PITCH_LIMIT = 9;

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
  const globeYaw = useMotionValue(-12);
  const globePitch = useMotionValue(-8);
  const smoothGlobeYaw = useSpring(globeYaw, {
    stiffness: 120,
    damping: 22,
    mass: 0.65,
  });
  const smoothGlobePitch = useSpring(globePitch, {
    stiffness: 120,
    damping: 22,
    mass: 0.65,
  });
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [capturePhase, setCapturePhase] = useState(null);
  const pointerStart = useRef(null);
  const globePointerStart = useRef(null);
  const didDrag = useRef(false);
  const captureTimers = useRef([]);
  const audioContext = useRef(null);
  const globeCanvasRef = useRef(null);
  const photoButtonRefs = useRef([]);
  const cameraBackButtonRef = useRef(null);
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
  }, [clearCaptureTimers]);

  useEffect(() => {
    const canvas = globeCanvasRef.current;
    if (!canvas) return undefined;

    const size = 160;
    const radius = 72;
    const center = size / 2;
    const textureCanvas = document.createElement("canvas");
    const textureContext = textureCanvas.getContext("2d", { willReadFrequently: true });
    const canvasContext = canvas.getContext("2d", { willReadFrequently: true });
    let textureData = null;
    let destroyed = false;

    canvas.width = size;
    canvas.height = size;

    const renderGlobe = () => {
      if (destroyed || !canvasContext) return;

      const yawRadians = ((reduceMotion ? globeYaw.get() : smoothGlobeYaw.get()) * Math.PI) / 180;
      const pitchRadians = ((reduceMotion ? globePitch.get() : smoothGlobePitch.get()) * Math.PI) / 180;
      const cosineYaw = Math.cos(yawRadians);
      const sineYaw = Math.sin(yawRadians);
      const cosinePitch = Math.cos(pitchRadians);
      const sinePitch = Math.sin(pitchRadians);
      const output = canvasContext.createImageData(size, size);

      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const xView = (x - center) / radius;
          const yView = -(y - center) / radius;
          const distanceSquared = xView * xView + yView * yView;
          if (distanceSquared > 1) continue;

          const zView = Math.sqrt(1 - distanceSquared);
          const yBeforePitch = cosinePitch * yView + sinePitch * zView;
          const zBeforePitch = -sinePitch * yView + cosinePitch * zView;
          const xWorld = cosineYaw * xView - sineYaw * zBeforePitch;
          const zWorld = sineYaw * xView + cosineYaw * zBeforePitch;
          const latitude = Math.asin(yBeforePitch);
          const longitude = Math.atan2(xWorld, zWorld);
          const target = (y * size + x) * 4;
          const lighting = 0.66 + zView * 0.34;

          if (textureData) {
            const sourceX = Math.min(
              textureData.width - 1,
              Math.max(0, Math.floor(((longitude / (2 * Math.PI)) + 0.5) * textureData.width)),
            );
            const sourceY = Math.min(
              textureData.height - 1,
              Math.max(0, Math.floor((0.5 - latitude / Math.PI) * textureData.height)),
            );
            const source = (sourceY * textureData.width + sourceX) * 4;
            const red = textureData.data[source];
            const green = textureData.data[source + 1];
            const blue = textureData.data[source + 2];
            const pale = red > 210 && green > 210 && blue > 210;
            output.data[target] = Math.round((pale ? 50 : red) * lighting);
            output.data[target + 1] = Math.round((pale ? 137 : green) * lighting);
            output.data[target + 2] = Math.round((pale ? 178 : blue) * lighting);
          } else {
            output.data[target] = Math.round(38 * lighting);
            output.data[target + 1] = Math.round(132 * lighting);
            output.data[target + 2] = Math.round(177 * lighting);
          }
          output.data[target + 3] = 255;
        }
      }

      canvasContext.putImageData(output, 0, 0);
      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.arc(center, center, radius, 0, Math.PI * 2);
      canvasContext.clip();

      GLOBE_PINS.forEach((pin) => {
        const latitude = (pin.latitude * Math.PI) / 180;
        const longitude = (pin.longitude * Math.PI) / 180;
        const localX = Math.cos(latitude) * Math.sin(longitude);
        const localY = Math.sin(latitude);
        const localZ = Math.cos(latitude) * Math.cos(longitude);
        const xAfterYaw = cosineYaw * localX + sineYaw * localZ;
        const zAfterYaw = -sineYaw * localX + cosineYaw * localZ;
        const yAfterPitch = cosinePitch * localY - sinePitch * zAfterYaw;
        const zAfterPitch = sinePitch * localY + cosinePitch * zAfterYaw;
        if (zAfterPitch <= 0) return;

        const pinX = center + xAfterYaw * radius;
        const pinY = center - yAfterPitch * radius;
        canvasContext.fillStyle = "#f04a42";
        canvasContext.strokeStyle = "#fff4dc";
        canvasContext.lineWidth = 2;
        canvasContext.beginPath();
        canvasContext.arc(pinX, pinY, 3.8, 0, Math.PI * 2);
        canvasContext.fill();
        canvasContext.stroke();
      });
      canvasContext.restore();

      canvasContext.strokeStyle = "#183a57";
      canvasContext.lineWidth = 5;
      canvasContext.beginPath();
      canvasContext.arc(center, center, radius + 1.5, 0, Math.PI * 2);
      canvasContext.stroke();
    };

    const texture = new window.Image();
    texture.crossOrigin = "anonymous";
    texture.onload = () => {
      if (destroyed || !textureContext) return;
      textureCanvas.width = 720;
      textureCanvas.height = 360;
      textureContext.drawImage(texture, 0, 0, textureCanvas.width, textureCanvas.height);
      try {
        textureData = textureContext.getImageData(0, 0, textureCanvas.width, textureCanvas.height);
      } catch {
        textureData = null;
      }
      renderGlobe();
    };
    texture.onerror = renderGlobe;
    texture.src = WORLD_MAP_TEXTURE;

    const yawMotion = reduceMotion ? globeYaw : smoothGlobeYaw;
    const pitchMotion = reduceMotion ? globePitch : smoothGlobePitch;
    const removeYawListener = yawMotion.on("change", renderGlobe);
    const removePitchListener = pitchMotion.on("change", renderGlobe);
    renderGlobe();

    return () => {
      destroyed = true;
      removeYawListener();
      removePitchListener();
    };
  }, [globePitch, globeYaw, reduceMotion, smoothGlobePitch, smoothGlobeYaw]);

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
    yaw.set(clamp(
      pointerStart.current.yaw + distanceX * 0.13,
      -ROOM_YAW_LIMIT,
      ROOM_YAW_LIMIT,
    ));
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
    yaw.set(clamp(
      yaw.get() + direction * 18,
      -ROOM_YAW_LIMIT,
      ROOM_YAW_LIMIT,
    ));
  };

  const focusRoomWall = (wall) => {
    const wallYaw = { back: 0, left: -42, right: 42 }[wall] ?? 0;
    yaw.set(wallYaw);
    pitch.set(0);
  };

  const handleGlobePointerDown = (event) => {
    if (event.button !== 0) return;
    event.stopPropagation();
    globePointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      yaw: globeYaw.get(),
      pitch: globePitch.get(),
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleGlobePointerMove = (event) => {
    if (
      !globePointerStart.current
      || globePointerStart.current.id !== event.pointerId
    ) return;
    event.stopPropagation();
    globeYaw.set(globePointerStart.current.yaw + (
      event.clientX - globePointerStart.current.x
    ) * 0.7);
    globePitch.set(clamp(
      globePointerStart.current.pitch - (
        event.clientY - globePointerStart.current.y
      ) * 0.38,
      -34,
      24,
    ));
  };

  const handleGlobePointerUp = (event) => {
    if (
      !globePointerStart.current
      || globePointerStart.current.id !== event.pointerId
    ) return;
    event.stopPropagation();
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    globePointerStart.current = null;
  };

  const handleGlobeKeyDown = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      event.stopPropagation();
      globeYaw.set(globeYaw.get() + (event.key === "ArrowLeft" ? -18 : 18));
    }
  };

  const selectedPhoto = selectedIndex === null ? null : PHOTOS[selectedIndex];

  return (
    <div className="photo-world-shell">
      <div className="photo-world-heading">
        <Badge variant="outline">Photo channel · Room view</Badge>
        <h2>Step inside the photo room.</h2>
        <p>Drag to look around the room. Select a framed photo to review it on the camera.</p>
      </div>

      <div
        className="photo-world"
        aria-label={selectedPhoto
          ? "Digital camera photo playback"
          : "Interactive 3D photo room"}
      >
        <div
          className="photo-world-gallery"
          hidden={Boolean(selectedPhoto)}
          aria-hidden={selectedPhoto ? "true" : undefined}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerLeave}
        >
          <div className="photo-world-sky" aria-hidden="true" />

          <div className="photo-room-stage">
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

                        {ALBUM_COVERS.map((album) => (
                          album.wall === wall ? (
                            <figure
                              key={album.title}
                              className="pixel-album-cover"
                              style={{
                                left: album.x + "%",
                                top: album.y + "%",
                              }}
                            >
                              <img
                                src={album.src}
                                alt={album.title + " by " + album.artist + " album cover"}
                                loading="lazy"
                              />
                              <figcaption>
                                <strong>{album.title}</strong>
                                <span>{album.artist}</span>
                              </figcaption>
                            </figure>
                          ) : null
                        ))}
                      </div>
                    ))}

                    <div className="photo-room-table" aria-hidden="true">
                      <div className="pixel-table-top" />
                      <div className="pixel-table-front" />
                      <div className="pixel-table-side" />
                      <span className="pixel-table-leg pixel-table-leg-left" />
                      <span className="pixel-table-leg pixel-table-leg-right" />
                      <span className="pixel-table-leg pixel-table-leg-back-left" />
                      <span className="pixel-table-leg pixel-table-leg-back-right" />
                    </div>

                    <div
                      className="pixel-globe-control"
                      tabIndex={0}
                      role="group"
                      aria-label="Interactive globe. Drag or use left and right arrow keys to spin it. Red pins mark the United States, Canada, Switzerland, Austria, Spain, Morocco, Portugal, India, and Mexico."
                      onPointerDown={handleGlobePointerDown}
                      onPointerMove={handleGlobePointerMove}
                      onPointerUp={handleGlobePointerUp}
                      onPointerCancel={handleGlobePointerUp}
                      onKeyDown={handleGlobeKeyDown}
                    >
                      <canvas
                        ref={globeCanvasRef}
                        className="pixel-globe"
                        aria-hidden="true"
                      />
                      <span className="pixel-globe-label" aria-hidden="true">DRAG TO SPIN</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div
            className="photo-world-controls"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                rotateRoom(-1);
              }}
              aria-label="Look left around the room"
            >
              <ChevronLeft />
            </Button>
            <span>Drag to look around the room</span>
            <Button
              variant="outline"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                rotateRoom(1);
              }}
              aria-label="Look right around the room"
            >
              <ChevronRight />
            </Button>
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
