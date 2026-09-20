import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export const THEMES = [
  { id: "wii", name: "Wii Classic", mark: "Wii ", description: "The OG • silver & blue" },
  { id: "dark", name: "Dark Mode", mark: "☾", description: "Night • dark & light blue" },
  { id: "wario", name: "WarioWare", mark: "W!", description: "WAHAHA! • yellow & purple" },
  { id: "mario", name: "Mario", mark: "M", description: "Super Mario Bros. • red & blue" },
];
const STORAGE = "wii-portfolio-mods-v1";
export const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
export function duration(ms) {
  const seconds = Math.floor(ms / 1000);
  return seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m` : `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}
// Each letter gets two normal copies. A warning permits one final print.
export function nextFaxPrintKind(records, requestedKind) {
  if (!["activity", "bomb"].includes(requestedKind)) return null;
  const warningIndex = records.findIndex(record => record.kind === "warning");
  if (warningIndex > 0) return null;
  if (warningIndex === 0) return requestedKind;
  return records.filter(record => record.kind === requestedKind).length >= 2
    ? "warning" : requestedKind;
}

export function useWiiMods(channelId) {
  const [faxPrints, setFaxPrints] = useState([]);
  const [state, setState] = useState({ unlocked: false, theme: "wii", installed: ["wii", "dark"], activity: {}, readDays: [] });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE));
      if (saved && typeof saved === "object") {
        const unlocked = saved.unlocked === true;
        const installed = THEMES.map(t => t.id).filter(id => ["wii", "dark"].includes(id) || (unlocked && (id === "wario" || saved.installed?.includes(id))));
        const activity = {};
        Object.entries(saved.activity || {}).slice(-90).forEach(([day, entries]) => {
          if (/^\d{4}-\d{2}-\d{2}$/.test(day) && entries && typeof entries === "object") {
            activity[day] = Object.fromEntries(Object.entries(entries).filter(([id, ms]) => ["profile", "photos", "skills", "links", "resume", "homebrew"].includes(id) && Number.isFinite(ms) && ms >= 0));
          }
        });
        const readDays = Array.isArray(saved.readDays) ? saved.readDays.filter(day => typeof day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(day)).slice(-90) : [];
        setState({ unlocked, installed, theme: installed.includes(saved.theme) ? saved.theme : "wii", activity, readDays });
      }
    } catch { /* Storage may be unavailable; keep the session usable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch {}
  }, [state, ready]);
  useEffect(() => {
    if (!ready || !channelId || ["messages", "themes"].includes(channelId)) return;
    let started = document.visibilityState === "visible" ? Date.now() : null;
    const flush = () => {
      const end = Date.now();
      if (started !== null && end > started) {
        const additions = {};
        let cursor = started;
        while (cursor < end) {
          const next = new Date(cursor); next.setHours(24, 0, 0, 0);
          const stop = Math.min(end, next.getTime());
          additions[dayKey(new Date(cursor))] = stop - cursor;
          cursor = stop;
        }
        setState(previous => {
          const activity = { ...previous.activity };
          Object.entries(additions).forEach(([day, ms]) => { activity[day] = { ...activity[day], [channelId]: (activity[day]?.[channelId] || 0) + ms }; });
          const next = { ...previous, activity: Object.fromEntries(Object.entries(activity).sort().slice(-90)) };
          try { localStorage.setItem(STORAGE, JSON.stringify(next)); } catch {}
          return next;
        });
      }
      started = document.visibilityState === "visible" ? end : null;
    };
    const timer = setInterval(flush, 1000);
    document.addEventListener("visibilitychange", flush);
    window.addEventListener("pagehide", flush);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", flush); window.removeEventListener("pagehide", flush); flush(); };
  }, [channelId, ready]);
  return { ...state, faxPrints, faxJammed: faxPrints.some((record, index) => record.kind === "warning" && index > 0), printLetter: record => setFaxPrints(previous => {
    const kind = nextFaxPrintKind(previous, record.kind);
    return kind ? [{ ...record, kind }, ...previous] : previous;
  }), markRead: day => setState(s => ({ ...s, readDays: [...new Set([...s.readDays, day])].slice(-90) })), unlock: () => setState(s => ({ ...s, unlocked: true, theme: "wario", installed: [...new Set([...s.installed, "wario"])] })), install: id => setState(s => ({ ...s, installed: [...new Set([...s.installed, id])] })), select: id => setState(s => s.installed.includes(id) ? { ...s, theme: id } : s) };
}

export function Envelope({ open = false, bomb = false }) {
  return (
    <span className={`wii-envelope ${open ? "is-open" : ""} ${bomb ? "is-bomb" : ""}`} aria-hidden="true">
      <i />
      {bomb && !open && <img className="bomb-envelope-front" src="/wii/letterbomb.png" alt="" />}
      {bomb && open && <img className="bomb-flap-character" src="/wii/letterbomb.png" alt="" />}
    </span>
  );
}
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function MessageBoard({ mods, channels, onHomebrew, onPrintingChange }) {
  const reduceMotion = useReducedMotion();
  const paper = useRef(null);
  const feed = useRef(null);
  const mounted = useRef(false);
  const busy = useRef(false);
  const [printing, setPrinting] = useState(false);
  const latestPrint = useRef(null);
  const requestedPrint = useRef(null);
  const board = useRef(null);
  const date = new Date();
  const activityRead = mods.readDays.includes(dayKey(date));

  useBrowserLayoutEffect(() => {
    const sheet = paper.current;
    const viewport = feed.current;
    if (!sheet || !viewport) return;
    const firstVisit = !mounted.current;
    mounted.current = true;
    const newRecord = requestedPrint.current === mods.faxPrints[0]?.id;
    if (!firstVisit && !newRecord) return;
    const distance = newRecord
      ? latestPrint.current.getBoundingClientRect().height
      : mods.faxPrints.length ? 0 : sheet.getBoundingClientRect().height;
    requestedPrint.current = null;
    const finish = () => {
      busy.current = false;
      setPrinting(false);
      onPrintingChange(false);
      if (newRecord) latestPrint.current?.focus({ preventScroll: true });
    };
    if (reduceMotion || !distance) { finish(); return; }
    busy.current = true;
    setPrinting(true);
    onPrintingChange(true);
    const fullHeight = sheet.getBoundingClientRect().height;
    const timing = { duration: Math.min(3200, Math.max(1400, distance * 4)), easing: "linear" };
    // Translate the entire sheet, including its ruling and older records, through
    // the fixed output slot. Only the exposed length changes; nothing stretches.
    const sheetMotion = sheet.animate([
      { transform: `translateY(${-distance}px)` }, { transform: "translateY(0)" },
    ], timing);
    const feedMotion = viewport.animate([
      { height: `${Math.max(0, fullHeight - distance)}px` }, { height: `${fullHeight}px` },
    ], timing);
    sheetMotion.onfinish = finish;
    return () => {
      sheetMotion.onfinish = null;
      sheetMotion.cancel();
      feedMotion.cancel();
      busy.current = false;
      setPrinting(false);
      onPrintingChange(false);
    };
  }, [mods.faxPrints, reduceMotion, onPrintingChange]);

  const printLetter = kind => {
    if (busy.current) return;
    const printedKind = nextFaxPrintKind(mods.faxPrints, kind);
    if (!printedKind) return;
    busy.current = true;
    const printedAt = new Date();
    const activity = mods.activity[dayKey(printedAt)] || {};
    const id = crypto.randomUUID();
    requestedPrint.current = id;

    mods.printLetter({
      id, kind, printedAt: printedAt.toISOString(),
      activity: channels.map(channel => ({ title: channel.title, ms: activity[channel.id] || 0 })),
    });
    if (printedKind === "activity") mods.markRead(dayKey(printedAt));
    if (printedKind === "bomb" && !mods.unlocked) mods.unlock();
    feed.current?.closest(".channel-window-scroll")?.scrollTo({ top: 0, behavior: "auto" });
  };
  const returnToLetters = () => {
    board.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    board.current?.querySelector("button")?.focus({ preventScroll: true });
  };

  return (
    <div className="message-board fax-board">
      <div ref={feed} className="fax-paper-viewport" aria-busy={printing}>
      <div ref={paper} className="board-paper fax-paper" aria-label="Message Board print history">
        {mods.faxPrints.map((record, index) => (
          <div key={record.id} className="fax-feed">
            <article ref={index === 0 ? latestPrint : undefined} tabIndex={-1} className={`fax-record ${record.kind === "bomb" ? "fax-bomb-record" : ""}`} aria-label={record.kind === "warning" ? "Paper waste warning" : record.kind === "activity" ? "Printed activity letter" : "Printed LetterBomb letter"}>
              {record.kind === "warning" ? <p className="fax-waste-warning">Now your just wasting paper.</p> : <>
              <div className="fax-record-meta"><span>RECEIVED · {record.kind === "activity" ? "DAILY ACTIVITY" : "SPECIAL DELIVERY"}</span><time dateTime={record.printedAt}>{new Date(record.printedAt).toLocaleString()}</time></div>
              {record.kind === "activity" ? <>
                <h2>Today's Activity</h2>
                <div className="activity-total"><span>Total Play Time</span><strong>{duration(record.activity.reduce((sum, item) => sum + item.ms, 0))}</strong></div>
                <ul className="activity-list">{record.activity.map(item => <li key={item.title}><span>{item.title}</span><time>{duration(item.ms)}</time></li>)}</ul>
                <p className="letter-footnote">Thanks for viewing my portfolio!</p>
              </> : <>
                <img className="letter-wario" src="/wii/wario.png" alt="Wario" />
                <h2>WAHAHA!<br />Now Wario has access to all your data!</h2>
                <p>Just kidding, the WarioWare theme is now available and The Homebrew Channel has been added to your Wii Menu.</p>
                <button className="mod-button" onClick={onHomebrew}>Launch Homebrew →</button>
                <p className="letter-footnote">Install more themes in Homebrew, then choose your theme using profile button.</p>
              </>}
              <button className="letter-back fax-back" onClick={returnToLetters}>Return to the letters ↓</button>
              </>}
            </article>
          </div>
        ))}
        <div className="fax-feed">
          <section className="fax-board-record" ref={board} aria-label="Letters">
            <div className="board-date"><div><span>Wii Message Board</span><h2>Today</h2><p>{date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</p></div></div>
            <div className="board-letters">
              <button className="board-letter daily-envelope" disabled={printing || mods.faxJammed} onClick={() => printLetter("activity")}><span className="board-letter-art"><Envelope open={activityRead} /></span><span className="sr-only">{activityRead ? "Opened letter: " : "Closed letter: "}</span><strong>Today's Activity</strong></button>
              <button className="board-letter bomb-envelope" disabled={printing || mods.faxJammed} onClick={() => printLetter("bomb")}><span className="board-letter-art"><Envelope bomb open={mods.unlocked} /></span><span className="sr-only">{mods.unlocked ? "Opened letter: " : "Closed letter: "}</span><strong>CLICK ME TO REDEEM 1000 GEMS, 100% LEGIT!! (pls don't get scared it's actually safe)</strong></button>
            </div>
            <p className="board-hint">{mods.faxJammed ? "Fax machine jammed. Your printed records are still below the output slot." : "Select a letter to read it."}</p>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}

export function ThemeEditor({ mods, onHomebrew }) {
  return (
    <section className="theme-editor" aria-labelledby="theme-editor-heading">
      <div className="content-heading">
        <p className="mini-label">Profile</p>
        <h2 id="theme-editor-heading">Pick your favorite Wii Theme!</h2>
        <p>Choose your style.</p>
      </div>
      <div className="theme-packages">
        {THEMES.map(theme => {
          const installed = mods.installed.includes(theme.id);
          const active = mods.theme === theme.id;
          return (
            <article className={`theme-package preview-${theme.id}`} key={theme.id}>
              <div className="theme-mark" aria-hidden="true">{theme.mark}</div>
              <div><h3>{theme.name}</h3><p>{theme.description}</p></div>
              <button
                disabled={!installed}
                aria-pressed={active}
                aria-label={`${active ? "Selected" : installed ? "Apply" : "Not installed:"} ${theme.name}`}
                onClick={() => mods.select(theme.id)}
              >{active ? "Active ✓" : installed ? "Apply" : "Not installed"}</button>
            </article>
          );
        })}
      </div>
      <div className="theme-editor-help">
        <p>{mods.unlocked ? "Install additional themes in the Homebrew terminal, then select them here." : "Wii Classic and Dark Mode are ready to use. Open the mysterious letter on your Message Board to unlock Homebrew and more themes."}</p>
        {mods.unlocked && <button className="mod-button" onClick={onHomebrew}>Open Homebrew →</button>}
      </div>
    </section>
  );
}

export function HomebrewChannel({ mods }) {
  const [lines, setLines] = useState([
    "Homebrew Channel / Theme Installer v1.1",
    "SD mounted. Theme library ready.",
    "Type list to browse packages, install all to install everything, or help for commands.",
    "After installing, choose your theme with NS on the Wii Menu.",
  ]);
  const [command, setCommand] = useState("");
  const installing = useRef(null);
  const timer = useRef(null);
  const log = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [lines]);
  const print = text => setLines(old => [...old.slice(-60), text]);
  const install = id => {
    if (installing.current) return print("Another package is installing. Please wait.");
    const packages = (id === "all" ? THEMES.map(theme => theme.id) : [id]).filter(theme => !mods.installed.includes(theme));
    if (!packages.length) return print(id === "all" ? "All themes are already installed. Select one in the NS theme editor." : `${id} is already installed. Select it in the NS theme editor.`);
    installing.current = id;
    print(`Reading ${packages.join(", ")}… verifying theme assets…`);
    timer.current = setTimeout(() => {
      packages.forEach(theme => mods.install(theme));
      installing.current = null;
      print(`✓ ${packages.join(", ")} installed. Open NS on the Wii Menu to apply a theme.`);
    }, 1100);
  };
  const run = event => {
    event.preventDefault();
    const value = command.trim().toLowerCase();
    setCommand("");
    if (!value) return;
    print(`wii@homebrew:~$ ${value}`);
    const [verb, id, extra] = value.split(/\s+/);
    if (verb === "clear" && !id) return setLines([]);
    if (verb === "help" && !id) return print(`Commands: list · install <theme> · install all · clear\nThemes: ${THEMES.map(t => t.id).join(", ")}\nChoose installed themes in the NS theme editor.`);
    if (verb === "list" && !id) return print(THEMES.map(t => `${t.id} — ${mods.installed.includes(t.id) ? "installed" : "available"}`).join("\n"));
    if (verb === "use") return print("Theme selection has moved to NS on the Wii Menu. Install packages here, then apply them there.");
    if (verb !== "install" || extra || (id !== "all" && !THEMES.some(t => t.id === id))) return print("Unknown command or theme. Type help for the package list.");
    install(id);
  };
  return (
    <div className="homebrew-channel homebrew-installer">
      <div className="brew-terminal">
        <div className="terminal-bar"><span aria-hidden="true">● ● ●</span> theme-installer <small>SD: /themes</small></div>
        <pre ref={log} role="log" aria-live="polite">{lines.join("\n")}</pre>
        <form onSubmit={run}>
          <label htmlFor="brew-command">wii@homebrew:~$</label>
          <input id="brew-command" value={command} onChange={event => setCommand(event.target.value)} autoComplete="off" spellCheck="false" placeholder="help" />
          <button type="submit" aria-label="Run command">↵</button>
        </form>
      </div>
    </div>
  );
}
