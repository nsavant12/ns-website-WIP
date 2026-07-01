import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Grid3X3,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaJava } from "react-icons/fa";
import {
  SiAmazonaws,
  SiAngular,
  SiCplusplus,
  SiCss3,
  SiDocker,
  SiGit,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiLit,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSwift,
  SiTensorflow,
  SiTypescript,
} from "react-icons/si";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const BOARD_SIZE = 4;
const TARGET_VALUE = 2048;
const MOVE_DURATION_PER_CELL = 88;
const MOVE_SETTLE_BUFFER = 18;

const SKILL_TILES = [
  { value: 2, label: "HTML", icon: SiHtml5, color: "#e34f26", surface: "#f9e4dc" },
  { value: 4, label: "CSS", icon: SiCss3, color: "#1572b6", surface: "#dcecf9" },
  { value: 8, label: "JavaScript", icon: SiJavascript, color: "#806b00", surface: "#fff3ad" },
  { value: 16, label: "TypeScript", icon: SiTypescript, color: "#3178c6", surface: "#dceafa" },
  { value: 32, label: "React", icon: SiReact, color: "#147e95", surface: "#d9f4f8" },
  { value: 64, label: "Next.js", icon: SiNextdotjs, color: "#ffffff", surface: "#292d31" },
  { value: 128, label: "Node.js", icon: SiNodedotjs, color: "#339933", surface: "#e1f2df" },
  { value: 256, label: "Python", icon: SiPython, color: "#3776ab", surface: "#e1eaf4" },
  { value: 512, label: "Java", icon: FaJava, color: "#d96f12", surface: "#fae9dc" },
  { value: 1024, label: "Git", icon: SiGit, color: "#f05032", surface: "#fbe1dc" },
  { value: 2048, label: "Docker", icon: SiDocker, color: "#1479c9", surface: "#dcedfb" },
  { value: 4096, label: "AWS", icon: SiAmazonaws, color: "#d77c00", surface: "#fff0d8" },
  { value: 8192, label: "Go", icon: SiGo, color: "#008eae", surface: "#d9f4f8" },
  { value: 16384, label: "C++", icon: SiCplusplus, color: "#00599c", surface: "#dce9f5" },
  { value: 32768, label: "Swift", icon: SiSwift, color: "#e65b36", surface: "#fbe4dd" },
  { value: 65536, label: "Angular", icon: SiAngular, color: "#c3002f", surface: "#f8dfe5" },
  { value: 131072, label: "MongoDB", icon: SiMongodb, color: "#369954", surface: "#e1f3e6" },
  { value: 262144, label: "TensorFlow", icon: SiTensorflow, color: "#e97000", surface: "#ffead5" },
  { value: 524288, label: "Lit", icon: SiLit, color: "#324fff", surface: "#e4e8ff" },
];

function getSkillForValue(value) {
  const exactSkill = SKILL_TILES.find((skill) => skill.value === value);
  return exactSkill || SKILL_TILES[SKILL_TILES.length - 1];
}

function tilesToBoard(tiles) {
  const board = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
  tiles.forEach((tile) => {
    board[tile.index] = tile.value;
  });
  return board;
}

function createSkillTileId() {
  if (globalThis.crypto?.randomUUID) {
    return "skill-tile-" + globalThis.crypto.randomUUID();
  }
  return "skill-tile-" + Date.now() + "-" + Math.random().toString(36).slice(2);
}

function addRandomSkillTile(tiles) {
  const occupiedCells = new Set(tiles.map((tile) => tile.index));
  const emptyCells = Array.from(
    { length: BOARD_SIZE * BOARD_SIZE },
    (_, index) => index,
  ).filter((index) => !occupiedCells.has(index));

  if (!emptyCells.length) return tiles;

  const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  return [
    ...tiles,
    {
      id: createSkillTileId(),
      index: cellIndex,
      value: Math.random() < 0.9 ? 2 : 4,
    },
  ];
}

function createNewTiles() {
  return addRandomSkillTile(addRandomSkillTile([]));
}

export function mergeSkillLine(line) {
  const compacted = line.filter(Boolean);
  const merged = [];
  let score = 0;

  for (let index = 0; index < compacted.length; index += 1) {
    if (compacted[index] === compacted[index + 1]) {
      const mergedValue = compacted[index] * 2;
      merged.push(mergedValue);
      score += mergedValue;
      index += 1;
    } else {
      merged.push(compacted[index]);
    }
  }

  while (merged.length < BOARD_SIZE) merged.push(0);
  return { line: merged, score };
}

export function moveSkillBoard(board, direction) {
  const nextBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
  let score = 0;

  for (let outer = 0; outer < BOARD_SIZE; outer += 1) {
    const sourceLine = [];

    for (let inner = 0; inner < BOARD_SIZE; inner += 1) {
      const row = direction === "left" || direction === "right" ? outer : inner;
      const column = direction === "left" || direction === "right" ? inner : outer;
      sourceLine.push(board[row * BOARD_SIZE + column]);
    }

    const shouldReverse = direction === "right" || direction === "down";
    const workingLine = shouldReverse ? [...sourceLine].reverse() : sourceLine;
    const result = mergeSkillLine(workingLine);
    const finishedLine = shouldReverse ? [...result.line].reverse() : result.line;
    score += result.score;

    for (let inner = 0; inner < BOARD_SIZE; inner += 1) {
      const row = direction === "left" || direction === "right" ? outer : inner;
      const column = direction === "left" || direction === "right" ? inner : outer;
      nextBoard[row * BOARD_SIZE + column] = finishedLine[inner];
    }
  }

  return {
    board: nextBoard,
    moved: nextBoard.some((value, index) => value !== board[index]),
    score,
  };
}

export function canMoveSkillBoard(board) {
  if (board.some((value) => value === 0)) return true;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let column = 0; column < BOARD_SIZE; column += 1) {
      const value = board[row * BOARD_SIZE + column];
      const right = column < BOARD_SIZE - 1
        ? board[row * BOARD_SIZE + column + 1]
        : null;
      const below = row < BOARD_SIZE - 1
        ? board[(row + 1) * BOARD_SIZE + column]
        : null;
      if (value === right || value === below) return true;
    }
  }

  return false;
}

function getLineIndexes(direction, line) {
  return Array.from({ length: BOARD_SIZE }, (_, offset) => {
    if (direction === "left") return line * BOARD_SIZE + offset;
    if (direction === "right") return line * BOARD_SIZE + (BOARD_SIZE - 1 - offset);
    if (direction === "up") return offset * BOARD_SIZE + line;
    return (BOARD_SIZE - 1 - offset) * BOARD_SIZE + line;
  });
}

function getTileDistance(fromIndex, toIndex) {
  const fromRow = Math.floor(fromIndex / BOARD_SIZE);
  const fromColumn = fromIndex % BOARD_SIZE;
  const toRow = Math.floor(toIndex / BOARD_SIZE);
  const toColumn = toIndex % BOARD_SIZE;
  return Math.abs(toRow - fromRow) + Math.abs(toColumn - fromColumn);
}

function planSkillTileMove(tiles, direction) {
  const tileByIndex = new Map(tiles.map((tile) => [tile.index, tile]));
  const movingTiles = [];
  const settledTiles = [];
  let score = 0;

  for (let line = 0; line < BOARD_SIZE; line += 1) {
    const lineIndexes = getLineIndexes(direction, line);
    const lineTiles = lineIndexes
      .map((index) => tileByIndex.get(index))
      .filter(Boolean);
    let destinationOffset = 0;

    for (let sourceOffset = 0; sourceOffset < lineTiles.length; sourceOffset += 1) {
      const tile = lineTiles[sourceOffset];
      const nextTile = lineTiles[sourceOffset + 1];
      const destinationIndex = lineIndexes[destinationOffset];

      if (nextTile && tile.value === nextTile.value) {
        movingTiles.push(
          {
            ...tile,
            index: destinationIndex,
            moveDistance: getTileDistance(tile.index, destinationIndex),
          },
          {
            ...nextTile,
            index: destinationIndex,
            moveDistance: getTileDistance(nextTile.index, destinationIndex),
          },
        );
        settledTiles.push({
          id: tile.id,
          index: destinationIndex,
          value: tile.value * 2,
        });
        score += tile.value * 2;
        sourceOffset += 1;
      } else {
        movingTiles.push({
          ...tile,
          index: destinationIndex,
          moveDistance: getTileDistance(tile.index, destinationIndex),
        });
        settledTiles.push({
          id: tile.id,
          index: destinationIndex,
          value: tile.value,
        });
      }

      destinationOffset += 1;
    }
  }

  const originalPositions = new Map(tiles.map((tile) => [tile.id, tile.index]));
  return {
    movingTiles,
    settledTiles,
    score,
    duration: Math.max(
      0,
      ...movingTiles.map((tile) => tile.moveDistance),
    ) * MOVE_DURATION_PER_CELL,
    moved: score > 0 || movingTiles.some(
      (tile) => originalPositions.get(tile.id) !== tile.index,
    ),
  };
}

function SkillTile({ tile }) {
  const reduceMotion = useReducedMotion();
  const skill = getSkillForValue(tile.value);
  const Icon = skill.icon;
  const row = Math.floor(tile.index / BOARD_SIZE);
  const column = tile.index % BOARD_SIZE;

  return (
    <div
      className={"skill-2048-tile-position skill-tile-position-" + column + "-" + row}
      style={{
        "--skill-slide-duration": (
          (tile.moveDistance || 0) * MOVE_DURATION_PER_CELL
        ) + "ms",
      }}
    >
      <motion.div
        key={tile.value}
        className="skill-2048-tile"
        style={{
          "--skill-tile-color": skill.color,
          "--skill-tile-surface": skill.surface,
        }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
      >
        <Icon aria-hidden="true" />
      </motion.div>
    </div>
  );
}

export default function Skills2048() {
  const reduceMotion = useReducedMotion();
  const initialGame = useMemo(() => {
    const tiles = createNewTiles();
    return { tiles, score: 0, status: "playing" };
  }, []);
  const [game, setGame] = useState(initialGame);
  const [displayTiles, setDisplayTiles] = useState(initialGame.tiles);
  const [boardEpoch, setBoardEpoch] = useState(0);
  const [showSkillCatalog, setShowSkillCatalog] = useState(false);
  const gameRef = useRef(initialGame);
  const animationTimer = useRef(null);
  const animationFrame = useRef(null);
  const isAnimating = useRef(false);
  const pointerStart = useRef(null);

  const highestValue = useMemo(
    () => Math.max(...game.tiles.map((tile) => tile.value)),
    [game.tiles],
  );
  const logicalBoard = useMemo(
    () => tilesToBoard(game.tiles),
    [game.tiles],
  );
  const highestSkill = getSkillForValue(highestValue || 2);
  const finalSkill = SKILL_TILES[SKILL_TILES.length - 1];
  const nextSkill = getSkillForValue(Math.min(highestValue * 2 || 4, finalSkill.value));
  const HighestSkillIcon = highestSkill.icon;
  const reachedTarget = highestValue >= TARGET_VALUE;

  const startNewGame = useCallback(() => {
    window.clearTimeout(animationTimer.current);
    window.cancelAnimationFrame(animationFrame.current);
    isAnimating.current = false;
    const tiles = createNewTiles();
    const nextGame = {
      tiles,
      score: 0,
      status: "playing",
    };
    gameRef.current = nextGame;
    setGame(nextGame);
    setDisplayTiles(tiles);
    setBoardEpoch((epoch) => epoch + 1);
  }, []);

  useEffect(() => {
    const gameIds = game.tiles.map((tile) => tile.id);
    const displayIds = displayTiles.map((tile) => tile.id);
    const hasDuplicateIds =
      new Set(gameIds).size !== gameIds.length ||
      new Set(displayIds).size !== displayIds.length;

    if (hasDuplicateIds) startNewGame();
  }, [displayTiles, game.tiles, startNewGame]);

  const move = useCallback((direction) => {
    if (isAnimating.current) return;

    const currentGame = gameRef.current;
    if (currentGame.status === "lost") return;

    const result = planSkillTileMove(currentGame.tiles, direction);
    if (!result.moved) {
      if (!canMoveSkillBoard(tilesToBoard(currentGame.tiles))) {
        const lostGame = { ...currentGame, status: "lost" };
        gameRef.current = lostGame;
        setGame(lostGame);
      }
      return;
    }

    isAnimating.current = true;
    setDisplayTiles(result.movingTiles);

    const settleMove = () => {
      animationTimer.current = window.setTimeout(() => {
        const tiles = addRandomSkillTile(result.settledTiles);
        const nextGame = {
          tiles,
          score: currentGame.score + result.score,
          status: canMoveSkillBoard(tilesToBoard(tiles)) ? "playing" : "lost",
        };
        gameRef.current = nextGame;
        setGame(nextGame);
        setDisplayTiles(tiles);
        isAnimating.current = false;
      }, reduceMotion ? 0 : result.duration + MOVE_SETTLE_BUFFER);
    };

    // Let React commit the new position classes and the browser paint them
    // before starting the timer that resolves merges.
    animationFrame.current = window.requestAnimationFrame(() => {
      animationFrame.current = window.requestAnimationFrame(settleMove);
    });
  }, [reduceMotion]);

  useEffect(() => () => {
    window.clearTimeout(animationTimer.current);
    window.cancelAnimationFrame(animationFrame.current);
  }, []);

  useEffect(() => {
    const keyMap = {
      ArrowUp: "up",
      w: "up",
      W: "up",
      ArrowDown: "down",
      s: "down",
      S: "down",
      ArrowLeft: "left",
      a: "left",
      A: "left",
      ArrowRight: "right",
      d: "right",
      D: "right",
    };

    const handleKeyDown = (event) => {
      const direction = keyMap[event.key];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [move]);

  const handlePointerDown = (event) => {
    pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (!pointerStart.current) return;
    const deltaX = event.clientX - pointerStart.current.x;
    const deltaY = event.clientY - pointerStart.current.y;
    if (event.currentTarget.hasPointerCapture?.(pointerStart.current.id)) {
      event.currentTarget.releasePointerCapture(pointerStart.current.id);
    }
    pointerStart.current = null;

    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 28) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      move(deltaX > 0 ? "right" : "left");
    } else {
      move(deltaY > 0 ? "down" : "up");
    }
  };

  return (
    <div className="skills-game">
      <div className="skills-game-heading">
        <div>
          <Badge variant="outline">Toolkit · 2048</Badge>
          <h2>Merge the stack.</h2>
          <p>
            Match identical skill logos to unlock the next technology.
            Reach <strong>Docker</strong> to win—or keep going.
          </p>
        </div>

        <div className="skills-game-score" aria-label={"Score " + game.score}>
          <span>Score</span>
          <strong>{game.score}</strong>
        </div>
      </div>

      <div className="skills-game-layout">
        <div>
          <div
            className="skill-2048-board"
            role="grid"
            aria-label="2048 board using technology logos"
            tabIndex={0}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStart.current = null;
            }}
          >
            {Array.from({ length: BOARD_SIZE }, (_, row) => (
              <div key={row} className="skill-2048-row" role="row">
                {logicalBoard
                  .slice(row * BOARD_SIZE, row * BOARD_SIZE + BOARD_SIZE)
                  .map((value, column) => {
                    const skill = value ? getSkillForValue(value) : null;
                    return (
                      <div
                        key={column}
                        className="skill-2048-cell"
                        role="gridcell"
                        aria-label={skill ? skill.label + " tile" : "Empty tile"}
                      >
                      </div>
                    );
                  })}
              </div>
            ))}

            <div
              key={boardEpoch}
              className="skill-2048-tile-layer"
              aria-hidden="true"
            >
              {displayTiles.map((tile) => (
                <SkillTile key={tile.id} tile={tile} />
              ))}
            </div>

            {game.status === "lost" ? (
              <div className="skill-game-over" role="status">
                <strong>Stack overflow.</strong>
                <span>No more merges are available.</span>
                <Button onClick={startNewGame}>
                  <RotateCcw size={16} />
                  Try again
                </Button>
              </div>
            ) : null}
          </div>

          <p className="skills-game-hint">
            Use arrow keys, WASD, swipe, or the controls.
          </p>
        </div>

        <aside className="skills-game-sidebar">
          <Card className="skills-game-status">
            <CardContent>
              <p className="mini-label">{reachedTarget ? "TARGET REACHED" : "CURRENT UNLOCK"}</p>
              <div className="skills-game-current">
                <span
                  style={{
                    color: highestSkill.color,
                    backgroundColor: highestSkill.surface,
                  }}
                >
                  <HighestSkillIcon aria-hidden="true" />
                </span>
                <div>
                  <strong>{highestSkill.label}</strong>
                  <small>
                    {reachedTarget ? "Keep merging the stack." : "Next: " + nextSkill.label}
                  </small>
                </div>
                {reachedTarget ? <Trophy aria-label="Target reached" /> : null}
              </div>
            </CardContent>
          </Card>

          <div className="skill-direction-pad" aria-label="Game controls">
            <Button
              variant="outline"
              size="icon"
              className="skill-control-up"
              onClick={() => move("up")}
              aria-label="Move up"
            >
              <ArrowUp />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="skill-control-left"
              onClick={() => move("left")}
              aria-label="Move left"
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="skill-control-down"
              onClick={() => move("down")}
              aria-label="Move down"
            >
              <ArrowDown />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="skill-control-right"
              onClick={() => move("right")}
              aria-label="Move right"
            >
              <ArrowRight />
            </Button>
          </div>

          <Button variant="outline" className="skills-new-game" onClick={startNewGame}>
            <RotateCcw size={16} />
            New game
          </Button>

          <Button
            variant="outline"
            className="skills-catalog-toggle"
            aria-expanded={showSkillCatalog}
            aria-controls="skills-catalog"
            onClick={() => setShowSkillCatalog((isOpen) => !isOpen)}
          >
            <Grid3X3 size={16} />
            {showSkillCatalog ? "Hide skills" : "All skills"}
          </Button>
        </aside>
      </div>

      <AnimatePresence initial={false}>
        {showSkillCatalog ? (
          <motion.section
            id="skills-catalog"
            className="skills-catalog"
            aria-labelledby="skills-catalog-title"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <div className="skills-catalog-header">
              <div>
                <p className="mini-label">FULL UNLOCK PATH</p>
                <h3 id="skills-catalog-title">Every skill in the game</h3>
                <p>Matching a logo unlocks the next technology in this order.</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSkillCatalog(false)}
                aria-label="Hide all skills"
              >
                <X />
              </Button>
            </div>

            <div className="skills-catalog-grid">
              {SKILL_TILES.map((skill) => {
                const Icon = skill.icon;
                return (
                  <div
                    key={skill.value}
                    className="skills-catalog-item"
                    style={{
                      "--skill-tile-color": skill.color,
                      "--skill-tile-surface": skill.surface,
                    }}
                  >
                    <span><Icon aria-hidden="true" /></span>
                    <strong>{skill.label}</strong>
                    {skill.value === TARGET_VALUE ? <Badge>Target</Badge> : null}
                  </div>
                );
              })}
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <p className="sr-only" aria-live="polite">
        Score {game.score}. Highest unlocked skill {highestSkill.label}.
        {game.status === "lost" ? " Game over." : ""}
      </p>
    </div>
  );
}
