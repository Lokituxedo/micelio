import { useEffect, useRef, useState } from "react";
import { CircleOff, Flower2, Leaf, RefreshCw, Volume2, VolumeX } from "lucide-react";
import {
  PALETTES,
  drawColony,
  generateColony,
  paletteById,
  voiceOf,
  type Colony,
  type Overlay,
} from "@/lib/mycelium";
import { OrganismAudio } from "@/lib/organism-audio";

const GROW_MS = 5600;

type Params = {
  angle: number;
  depth: number;
  length: number;
  wavelength: number;
  seed: number;
  paletteId: string;
  overlay: Overlay;
};

function SoundIcon({ on }: { on: boolean }) {
  const motion =
    "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
  return (
    <span className="relative size-4" aria-hidden="true">
      <Volume2
        className={
          "absolute inset-0 size-4 " +
          motion +
          (on ? " scale-100 opacity-100 blur-none" : " scale-[0.25] opacity-0 blur-[4px]")
        }
      />
      <VolumeX
        className={
          "size-4 " +
          motion +
          (on ? " scale-[0.25] opacity-0 blur-[4px]" : " scale-100 opacity-100 blur-none")
        }
      />
    </span>
  );
}

function SliderField({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  valueText,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  valueText?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="flex min-w-0 flex-col">
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-display text-sm font-semibold tabular-nums text-fg">{display}</span>
      </span>
      <input
        id={id}
        className="range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText ?? display}
        onChange={(event) => onChange(Number(event.target.value))}
        suppressHydrationWarning
      />
    </label>
  );
}

export function MicelioApp() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(32);
  const [depth, setDepth] = useState(6);
  const [length, setLength] = useState(108);
  const [wavelength, setWavelength] = useState(48);
  const [paletteId, setPaletteId] = useState("espora");
  const [overlay, setOverlay] = useState<Overlay>("none");
  const [seed, setSeed] = useState(184729);
  const [soundOn, setSoundOn] = useState(false);
  const [volume, setVolume] = useState(0.72);
  const [phase, setPhase] = useState<"grow" | "live">("grow");

  const paramsRef = useRef<Params>({
    angle,
    depth,
    length,
    wavelength,
    seed,
    paletteId,
    overlay,
  });
  paramsRef.current = { angle, depth, length, wavelength, seed, paletteId, overlay };

  const animToken = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const reducedRef = useRef(false);
  const audioRef = useRef<OrganismAudio | null>(null);
  const volumeRef = useRef(volume);
  volumeRef.current = volume;

  const voice = voiceOf({ wavelength, angle, depth, length });
  const palette = paletteById(paletteId);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      reducedRef.current = media.matches;
    };
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") audioRef.current?.unlock();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  useEffect(() => {
    if (!soundOn) return;
    audioRef.current?.retune(voiceOf(paramsRef.current));
  }, [soundOn, wavelength, angle, depth, length]);

  useEffect(() => {
    audioRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let frame = 0;
    let seen = -1;
    let growStart = 0;
    let growth = 0;
    let colony: Colony | null = null;
    let colonyKey = "";

    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      const node = canvasRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = Math.max(2, Math.floor(rect.width * dpr));
      const height = Math.max(2, Math.floor(rect.height * dpr));
      if (node.width !== width || node.height !== height) {
        node.width = width;
        node.height = height;
        colony = null;
        colonyKey = "";
      }
      const ctx = node.getContext("2d", { alpha: false });
      if (!ctx) return;
      const params = paramsRef.current;
      const key = [
        params.angle,
        params.depth,
        params.length,
        params.wavelength,
        params.seed,
        width,
        height,
      ].join("|");
      if (!colony || colonyKey !== key) {
        colony = generateColony({
          width,
          height,
          dpr,
          angleDeg: params.angle,
          depth: params.depth,
          length: params.length,
          wavelength: params.wavelength,
          seed: params.seed,
        });
        colonyKey = key;
      }

      const reduced = reducedRef.current;
      if (seen !== animToken.current) {
        seen = animToken.current;
        growStart = now;
        growth = reduced ? 1 : 0;
      }
      if (reduced) {
        growth = 1;
        if (phaseRef.current !== "live") setPhase("live");
      } else {
        const raw = Math.min(1, (now - growStart) / GROW_MS);
        growth = 1 - (1 - raw) ** 3;
        if (raw >= 1 && phaseRef.current !== "live") setPhase("live");
        if (raw < 1 && phaseRef.current !== "grow") setPhase("grow");
      }

      drawColony(
        ctx,
        colony,
        growth,
        now / 1000,
        paletteById(params.paletteId),
        params.overlay,
      );
    };

    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleSound() {
    const audio = audioRef.current ?? (audioRef.current = new OrganismAudio());
    if (soundOn) {
      audio.stop();
      setSoundOn(false);
      return;
    }
    try {
      audio.unlock();
      audio.start(voiceOf(paramsRef.current), volumeRef.current);
      setSoundOn(true);
    } catch {
      setSoundOn(false);
    }
  }

  function regenerate() {
    setSeed((Math.floor(Math.random() * 4294967295) >>> 0) || 1);
    animToken.current += 1;
    setPhase("grow");
  }

  const colonyLabel = String(seed % 10000).padStart(4, "0");

  return (
    <main className="flex h-dvh flex-col overflow-hidden bg-bg text-fg md:flex-row" style={{ backgroundColor: palette.bgEdge }}>
      <p className="sr-only">
        Red micelar fractal. Ángulo {angle} grados, profundidad {depth}, longitud {length}, longitud
        de onda {wavelength}, tono {voice.note}.
      </p>
      <div className="relative min-h-[42dvh] min-w-0 flex-1">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
        <p className="canvas-status flex items-center gap-2 text-sm text-muted">
          <span className={phase === "grow" ? "status-dot grow" : "status-dot"} />
          {phase === "grow" ? "Creciendo" : "Viva"}
        </p>
      </div>
      <section className="dock w-full shrink-0 border-t border-border bg-surface px-4 pt-4 md:max-h-none md:w-96 md:border-t-0 md:border-l" aria-label="Controles de la colonia">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-medium italic leading-none">Micelio</h1>
            <p className="mt-1 text-sm text-muted">Onda larga, voz grave. Onda corta, voz aguda.</p>
          </div>
          <button
            type="button"
            className={
              "btn inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm " +
              (soundOn ? "border-primary text-primary" : "border-border text-fg")
            }
            aria-pressed={soundOn}
            onClick={toggleSound}
          >
            <SoundIcon on={soundOn} />
            {soundOn ? "Silenciar" : "Escuchar"}
          </button>
        </div>

        <p className="mt-4 flex items-baseline gap-3">
          <span className="font-display text-3xl font-semibold leading-none text-primary">{voice.note}</span>
          <span className="text-sm tabular-nums text-muted">{Math.round(voice.hz)} Hz</span>
        </p>

        <div className="mt-3 grid grid-cols-2 gap-x-5">
          <SliderField
            id="angulo"
            label="Ángulo"
            min={12}
            max={72}
            step={1}
            value={angle}
            display={`${angle}°`}
            onChange={setAngle}
          />
          <SliderField
            id="profundidad"
            label="Profundidad"
            min={3}
            max={7}
            step={1}
            value={depth}
            display={String(depth)}
            onChange={setDepth}
          />
          <SliderField
            id="longitud"
            label="Longitud"
            min={48}
            max={150}
            step={1}
            value={length}
            display={String(length)}
            onChange={setLength}
          />
          <SliderField
            id="onda"
            label="Onda"
            min={18}
            max={132}
            step={1}
            value={wavelength}
            display={String(wavelength)}
            valueText={`${wavelength}, nota ${voice.note}, ${Math.round(voice.hz)} hercios`}
            onChange={setWavelength}
          />
        </div>

        <SliderField
          id="volumen"
          label="Volumen"
          min={0}
          max={100}
          step={1}
          value={Math.round(volume * 100)}
          display={soundOn ? `${Math.round(volume * 100)}` : "en silencio"}
          onChange={(next) => setVolume(next / 100)}
        />

        <fieldset className="mt-2">
          <legend className="mb-2 text-sm text-muted">Paleta</legend>
          <div className="grid grid-cols-5 gap-2">
            {PALETTES.map((item) => {
              const selected = item.id === paletteId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setPaletteId(item.id)}
                  className={
                    "btn flex min-h-11 flex-col items-stretch gap-1 rounded-md p-1 " +
                    (selected ? "bg-surface-2" : "")
                  }
                >
                  <span
                    className="h-7 rounded-sm"
                    style={{ background: `linear-gradient(180deg, ${item.tip}, ${item.root})` }}
                  />
                  <span className={"truncate text-center text-xs " + (selected ? "text-fg" : "text-muted")}>
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="mt-4">
          <legend className="mb-2 text-sm text-muted">Superposición</legend>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Superposición">
            {(
              [
                { id: "none", label: "Limpio", icon: CircleOff },
                { id: "leaf", label: "Hojas", icon: Leaf },
                { id: "flower", label: "Flores", icon: Flower2 },
              ] as const
            ).map((option) => {
              const selected = overlay === option.id;
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setOverlay(option.id)}
                  className={
                    "btn inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm " +
                    (selected ? "bg-surface-2 text-fg" : "text-muted")
                  }
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        <button
          type="button"
          className="btn mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-fg"
          onClick={regenerate}
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Regenerar
        </button>
        <p className="mt-2 text-center text-xs tabular-nums text-muted">colonia {colonyLabel}</p>
      </section>
    </main>
  );
}
