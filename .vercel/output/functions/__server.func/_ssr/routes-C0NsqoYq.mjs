import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Leaf, i as RefreshCw, n as Volume2, o as Flower2, s as CircleOff, t as VolumeX } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C0NsqoYq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PALETTES = [
	{
		id: "espora",
		name: "Espora",
		bgEdge: "#07110c",
		bgCenter: "#163024",
		ground: "#050c09",
		root: "#cbb892",
		tip: "#f4ecd4",
		glow: "#e2c27a",
		leaf: "#8eae72",
		vein: "#e4f0c8",
		petal: "#f0d7a4",
		center: "#d15a32",
		spore: "#f3e6c0"
	},
	{
		id: "brasa",
		name: "Brasa",
		bgEdge: "#120804",
		bgCenter: "#3a1a10",
		ground: "#0c0604",
		root: "#e8a07a",
		tip: "#ffd7a8",
		glow: "#ff7a3c",
		leaf: "#d97848",
		vein: "#ffd0a8",
		petal: "#ffb07a",
		center: "#ffe3b0",
		spore: "#ffc49a"
	},
	{
		id: "escarcha",
		name: "Escarcha",
		bgEdge: "#071016",
		bgCenter: "#163040",
		ground: "#05090e",
		root: "#b7c9d4",
		tip: "#f4fbfc",
		glow: "#9fd8e4",
		leaf: "#7eaea6",
		vein: "#dff4f0",
		petal: "#d5eaf2",
		center: "#f0d48a",
		spore: "#e7f6f8"
	},
	{
		id: "azafran",
		name: "Azafrán",
		bgEdge: "#140e06",
		bgCenter: "#3a2a12",
		ground: "#0c0904",
		root: "#e0a15a",
		tip: "#ffe6b0",
		glow: "#ffb703",
		leaf: "#c6a35a",
		vein: "#f6e6bf",
		petal: "#ffd56a",
		center: "#8f3418",
		spore: "#ffe1a8"
	},
	{
		id: "niscalo",
		name: "Níscalo",
		bgEdge: "#101208",
		bgCenter: "#243018",
		ground: "#0a0c06",
		root: "#d4895a",
		tip: "#f6ddc4",
		glow: "#ef8a45",
		leaf: "#a3b56a",
		vein: "#e7efc4",
		petal: "#f0a36a",
		center: "#f8efd4",
		spore: "#f6d2b0"
	}
];
function paletteById(id) {
	return PALETTES.find((p) => p.id === id) ?? PALETTES[0];
}
var NOTES = [
	"Do",
	"Do♯",
	"Re",
	"Re♯",
	"Mi",
	"Fa",
	"Fa♯",
	"Sol",
	"Sol♯",
	"La",
	"La♯",
	"Si"
];
var PENTATONIC = [
	0,
	2,
	4,
	7,
	9
];
function quantizePentatonic(freq) {
	const midi = 69 + 12 * Math.log2(freq / 440);
	const rounded = Math.round(midi);
	let best = rounded;
	let bestDist = 99;
	for (let n = rounded - 6; n <= rounded + 6; n++) {
		const pc = (n % 12 + 12) % 12;
		if (!PENTATONIC.includes(pc)) continue;
		const dist = Math.abs(n - midi);
		if (dist < bestDist) {
			bestDist = dist;
			best = n;
		}
	}
	const pc = (best % 12 + 12) % 12;
	const oct = Math.floor(best / 12) - 1;
	return {
		hz: 440 * 2 ** ((best - 69) / 12),
		note: `${NOTES[pc]}${oct}`
	};
}
function harmonyRatio(angleDeg) {
	if (angleDeg < 20) return 1;
	if (angleDeg < 32) return 6 / 5;
	if (angleDeg < 46) return 4 / 3;
	if (angleDeg < 62) return 3 / 2;
	return 5 / 3;
}
function voiceOf(input) {
	const tuned = quantizePentatonic(9200 / clamp(input.wavelength, 12, 160));
	const pulseHz = clamp(tuned.hz / 380, .16, 1.25);
	const lengthT = clamp((input.length - 40) / 120, 0, 1);
	return {
		hz: tuned.hz,
		note: tuned.note,
		pulseHz,
		ratio: harmonyRatio(input.angle),
		cutoff: 340 + (1 - lengthT) * 1500,
		partial: clamp((input.depth - 2) * .022, .03, .14),
		detune: 3 + Math.abs(Math.round(input.angle)) % 8
	};
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function hexToRgb(hex) {
	const h = hex.replace("#", "");
	return [
		parseInt(h.slice(0, 2), 16),
		parseInt(h.slice(2, 4), 16),
		parseInt(h.slice(4, 6), 16)
	];
}
function mixHex(a, b, t) {
	const A = hexToRgb(a);
	const B = hexToRgb(b);
	const u = clamp(t, 0, 1);
	return `rgb(${Math.round(A[0] + (B[0] - A[0]) * u)} ${Math.round(A[1] + (B[1] - A[1]) * u)} ${Math.round(A[2] + (B[2] - A[2]) * u)})`;
}
function withAlpha(hex, alpha) {
	const [r, g, b] = hexToRgb(hex);
	return `rgba(${r},${g},${b},${alpha})`;
}
function generateColony(opts) {
	const width = Math.max(2, opts.width);
	const height = Math.max(2, opts.height);
	const dpr = opts.dpr;
	const maxDepth = clamp(Math.round(opts.depth), 2, 8);
	const angleDeg = clamp(opts.angleDeg, 8, 80);
	const length = clamp(opts.length, 30, 160);
	const wavelength = clamp(opts.wavelength, 12, 160);
	const rand = mulberry32(opts.seed || 1);
	const voice = voiceOf({
		wavelength,
		angle: angleDeg,
		depth: maxDepth,
		length
	});
	const baseLen = length / 100 * height * .22;
	const wavePx = wavelength / 48 * baseLen * .46;
	const hyphae = [];
	const CAP = 1400;
	const pushHypha = (partial, parent) => {
		const index = hyphae.length;
		hyphae.push({
			...partial,
			isTip: false,
			leafy: false,
			bloom: false,
			childCount: 0
		});
		if (parent >= 0) hyphae[parent].childCount += 1;
		return index;
	};
	for (let i = 0; i < 12; i++) {
		const horizontal = i < 9;
		const ang = horizontal ? (rand() < .5 ? 0 : Math.PI) + (rand() - .5) * .55 : Math.PI / 2 + (rand() - .5) * .5;
		const len = (horizontal ? 36 + rand() * 78 : 16 + rand() * 28) * dpr;
		const x = width * (.16 + rand() * .68);
		const y = height * .86 + (rand() - .35) * 10 * dpr;
		pushHypha({
			ax: x,
			ay: y,
			bx: x + Math.cos(ang) * len,
			by: y + Math.sin(ang) * len * (horizontal ? .28 : 1),
			depth: 0,
			born: rand() * .05,
			span: .24,
			width: (horizontal ? 1.25 : .9) * dpr,
			phase: rand() * Math.PI * 2,
			amp: wavePx * .06,
			wavelength: wavePx,
			kind: "mat",
			ornament: rand()
		}, -1);
	}
	const primaries = 5;
	const fan = .92 + rand() * .38;
	const queue = [];
	for (let i = 0; i < primaries; i++) {
		const t = i / 4;
		queue.push({
			x: width / 2 + (t - .5) * 18 * dpr,
			y: height * .86,
			angle: -Math.PI / 2 + (t - .5) * fan,
			len: baseLen * (.7 + Math.sin(t * Math.PI) * .4),
			depth: 0,
			born: t * .035,
			parent: -1
		});
	}
	let qh = 0;
	while (qh < queue.length && hyphae.length < CAP) {
		const job = queue[qh++];
		if (job.len < 5 * dpr) continue;
		const wander = (rand() - .5) * .12;
		const angle = job.angle + wander;
		const ex = job.x + Math.cos(angle) * job.len;
		const ey = job.y + Math.sin(angle) * job.len;
		const ornament = rand();
		const index = pushHypha({
			ax: job.x,
			ay: job.y,
			bx: ex,
			by: ey,
			depth: job.depth,
			born: clamp(job.born, 0, .7),
			span: .32,
			width: (job.depth === 0 ? 2.55 : Math.max(.62, 1.9 - job.depth * .2)) * dpr,
			phase: rand() * Math.PI * 2,
			amp: Math.max(dpr * 1.4, Math.min(job.len * .15, wavePx * .36)),
			wavelength: Math.max(8 * dpr, wavePx),
			kind: job.depth === 0 ? "stipe" : "hypha",
			ornament
		}, job.parent);
		if (job.depth >= maxDepth || hyphae.length >= CAP) continue;
		const spread = angleDeg * Math.PI / 180;
		const nextDepth = job.depth + 1;
		const born = nextDepth / maxDepth * .58 + rand() * .035;
		const shrink = .62 + rand() * .1;
		const lift = (a) => Math.sin(a) > .02 ? a - Math.sin(a) * .72 : a;
		const enqueue = (a, lenMul) => {
			const aa = lift(a);
			const len = job.len * shrink * lenMul;
			if (len < 4 * dpr) return;
			queue.push({
				x: ex,
				y: ey,
				angle: aa,
				len,
				depth: nextDepth,
				born,
				parent: index
			});
		};
		if (rand() < .16 && nextDepth < maxDepth) enqueue(angle + (rand() - .5) * .2, 1.14);
		else {
			enqueue(angle - spread * (.8 + rand() * .38), .9 + rand() * .14);
			enqueue(angle + spread * (.8 + rand() * .38), .9 + rand() * .14);
			if (rand() < .2 && nextDepth < maxDepth - 1) enqueue(angle + (rand() - .5) * spread * .3, 1.04);
		}
	}
	for (const h of hyphae) {
		if (h.kind === "mat") continue;
		h.isTip = h.childCount === 0;
		const outer = h.depth >= maxDepth - 1;
		h.leafy = h.isTip && outer && h.ornament > .28;
		h.bloom = h.isTip && outer && h.ornament > .72;
	}
	const tips = hyphae.filter((h) => h.isTip);
	const used = /* @__PURE__ */ new Set();
	let links = 0;
	const minD = width * .018;
	const maxD = width * .075;
	for (let i = 0; i < tips.length && links < 72; i++) {
		if (used.has(i)) continue;
		let best = -1;
		let bestD = Infinity;
		for (let j = i + 1; j < tips.length; j++) {
			if (used.has(j)) continue;
			const dx = tips[i].bx - tips[j].bx;
			const dy = tips[i].by - tips[j].by;
			const d = Math.hypot(dx, dy);
			if (d > minD && d < maxD && d < bestD) {
				bestD = d;
				best = j;
			}
		}
		if (best < 0 || rand() > .72) continue;
		used.add(i);
		used.add(best);
		const a = tips[i];
		const b = tips[best];
		pushHypha({
			ax: a.bx,
			ay: a.by,
			bx: b.bx,
			by: b.by,
			depth: maxDepth,
			born: .8 + rand() * .04,
			span: .18,
			width: .7 * dpr,
			phase: rand() * Math.PI * 2,
			amp: wavePx * .07,
			wavelength: Math.max(8 * dpr, wavePx),
			kind: "link",
			ornament: rand()
		}, -1);
		links += 1;
	}
	const spores = [];
	for (let i = 0; i < 42; i++) spores.push({
		x: rand() * width,
		y: rand() * height,
		r: (.6 + rand() * 1.5) * dpr,
		p: rand() * Math.PI * 2,
		speed: (8 + rand() * 22) * dpr
	});
	const motes = [];
	for (let i = 0; i < 160; i++) motes.push({
		x: rand() * width,
		y: rand() * height,
		r: (.35 + rand() * .9) * dpr,
		a: .03 + rand() * .07
	});
	return {
		hyphae,
		spores,
		motes,
		width,
		height,
		dpr,
		pulseHz: voice.pulseHz,
		seed: opts.seed
	};
}
function pointAt(hy, t, time, pulse) {
	const dx = hy.bx - hy.ax;
	const dy = hy.by - hy.ay;
	const len = Math.hypot(dx, dy) || 1;
	const px = -dy / len;
	const py = dx / len;
	const amp = hy.amp * (1 + pulse * .2);
	const wave = Math.sin(len * t / hy.wavelength * Math.PI * 2 + hy.phase + time * .35);
	return {
		x: hy.ax + dx * t + px * wave * amp,
		y: hy.ay + dy * t + py * wave * amp
	};
}
function strokeHypha(ctx, hy, eased, time, pulse) {
	const dx = hy.bx - hy.ax;
	const dy = hy.by - hy.ay;
	const samples = clamp(Math.ceil((Math.hypot(dx, dy) || 1) / Math.max(6, hy.wavelength * .42)), 4, 20);
	ctx.beginPath();
	for (let i = 0; i <= samples; i++) {
		const t = i / samples;
		const p = pointAt(hy, Math.min(t, eased), time, pulse);
		if (i === 0) ctx.moveTo(p.x, p.y);
		else ctx.lineTo(p.x, p.y);
		if (t >= eased) break;
	}
	ctx.stroke();
	return eased < 1 ? pointAt(hy, eased, time, pulse) : null;
}
function drawLeaf(ctx, x, y, angle, size, palette, pulse, tint) {
	ctx.save();
	ctx.translate(x, y);
	for (const s of [-1, 1]) {
		ctx.save();
		ctx.rotate(angle + s * (.62 + pulse * .06));
		ctx.beginPath();
		ctx.fillStyle = tint;
		ctx.ellipse(size * .72, 0, size * .74, size * .28, 0, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath();
		ctx.strokeStyle = palette.vein;
		ctx.lineWidth = Math.max(.6, size * .07);
		ctx.moveTo(size * .05, 0);
		ctx.lineTo(size * 1.3, 0);
		ctx.stroke();
		ctx.restore();
	}
	ctx.restore();
}
function drawFlower(ctx, x, y, angle, size, palette, pulse, petal) {
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(pulse * .18 + angle * .15);
	const petals = 5;
	ctx.fillStyle = petal;
	for (let i = 0; i < petals; i++) {
		const a = i / petals * Math.PI * 2;
		ctx.beginPath();
		ctx.ellipse(Math.cos(a) * size * .4, Math.sin(a) * size * .4, size * .4, size * .22, a, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.beginPath();
	ctx.fillStyle = palette.center;
	ctx.arc(0, 0, size * .2, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}
function drawColony(ctx, colony, growth, time, palette, overlay) {
	const { width, height, dpr } = colony;
	const pulse = Math.sin(time * colony.pulseHz * Math.PI * 2);
	ctx.clearRect(0, 0, width, height);
	const bg = ctx.createRadialGradient(width * .5, height * .62, height * .04, width * .5, height * .58, Math.max(width, height) * .72);
	bg.addColorStop(0, palette.bgCenter);
	bg.addColorStop(1, palette.bgEdge);
	ctx.fillStyle = bg;
	ctx.fillRect(0, 0, width, height);
	const light = ctx.createRadialGradient(width * .5, height * .4, 8, width * .5, height * .42, height * .5);
	light.addColorStop(0, withAlpha(palette.glow, .16));
	light.addColorStop(1, withAlpha(palette.glow, 0));
	ctx.fillStyle = light;
	ctx.fillRect(0, 0, width, height);
	ctx.beginPath();
	ctx.ellipse(width * .5, height * .875, width * .2, Math.max(4, height * .012), 0, 0, Math.PI * 2);
	ctx.fillStyle = withAlpha(palette.root, .16);
	ctx.fill();
	ctx.fillStyle = palette.tip;
	for (const m of colony.motes) {
		ctx.globalAlpha = m.a;
		ctx.beginPath();
		ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	for (const pass of [0, 1]) for (const hy of colony.hyphae) {
		const local = clamp((growth - hy.born) / hy.span, 0, 1);
		if (local <= 0) continue;
		const eased = 1 - (1 - local) ** 3;
		const color = mixHex(palette.root, palette.tip, hy.kind === "mat" ? .15 : hy.depth / 7);
		if (pass === 0) {
			if (hy.kind === "link") continue;
			ctx.strokeStyle = palette.glow;
			ctx.globalAlpha = (hy.kind === "stipe" ? .2 : .1) * (.45 + .55 * eased);
			ctx.lineWidth = hy.width * (hy.kind === "stipe" ? 3.4 : 2.6);
		} else {
			ctx.strokeStyle = color;
			ctx.globalAlpha = (hy.kind === "link" ? .38 : .94) * (.35 + .65 * eased);
			ctx.lineWidth = hy.width;
		}
		const tip = strokeHypha(ctx, hy, eased, time, pulse);
		if (pass === 1 && tip && hy.kind !== "mat") {
			ctx.globalAlpha = .9;
			ctx.fillStyle = palette.glow;
			ctx.beginPath();
			ctx.arc(tip.x, tip.y, Math.max(dpr, hy.width * .85), 0, Math.PI * 2);
			ctx.fill();
		}
	}
	ctx.globalAlpha = 1;
	if (overlay !== "none") for (const hy of colony.hyphae) {
		if (!(overlay === "leaf" ? hy.leafy : hy.bloom)) continue;
		if (clamp((growth - hy.born) / hy.span, 0, 1) < .94) continue;
		const tip = pointAt(hy, 1, time, pulse);
		const ang = Math.atan2(hy.by - hy.ay, hy.bx - hy.ax);
		const hero = hy.ornament > .88;
		if (overlay === "leaf") {
			const tint = mixHex(palette.leaf, palette.tip, hy.ornament * .35);
			drawLeaf(ctx, tip.x, tip.y, ang, (4.2 + hy.ornament * 5.5) * dpr, palette, pulse, tint);
		} else {
			const petal = mixHex(palette.petal, palette.tip, hy.ornament * .35);
			drawFlower(ctx, tip.x, tip.y, ang, (hero ? 8.5 : 4.6 + hy.ornament * 3.2) * dpr, palette, pulse, petal);
		}
	}
	ctx.fillStyle = palette.spore;
	for (const s of colony.spores) {
		const drift = Math.sin(time * .45 + s.p) * 10 * dpr;
		let y = (s.y - time * s.speed) % height;
		if (y < 0) y += height;
		ctx.globalAlpha = .18 + .22 * (.5 + .5 * Math.sin(time * 1.4 + s.p));
		ctx.beginPath();
		ctx.arc(s.x + drift, y, s.r, 0, Math.PI * 2);
		ctx.fill();
	}
	ctx.globalAlpha = 1;
}
function audioCtor() {
	if (typeof window === "undefined") return null;
	const w = window;
	return window.AudioContext ?? w.webkitAudioContext ?? null;
}
var OrganismAudio = class {
	ctx = null;
	master = null;
	filter = null;
	lfo = null;
	oscs = [];
	amps = [];
	running = false;
	volume = .7;
	generation = 0;
	unlock() {
		const ctx = this.ensure();
		if (ctx && ctx.state === "suspended") ctx.resume();
	}
	isRunning() {
		return this.running;
	}
	ensure() {
		if (this.ctx) return this.ctx;
		const AC = audioCtor();
		if (!AC) return null;
		const ctx = new AC({ latencyHint: "interactive" });
		const master = ctx.createGain();
		master.gain.value = 0;
		master.connect(ctx.destination);
		const filter = ctx.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 900;
		filter.Q.value = .65;
		filter.connect(master);
		const lfo = ctx.createOscillator();
		lfo.type = "sine";
		lfo.frequency.value = .3;
		const lfoGain = ctx.createGain();
		lfoGain.gain.value = 130;
		lfo.connect(lfoGain);
		lfoGain.connect(filter.frequency);
		lfo.start();
		this.ctx = ctx;
		this.master = master;
		this.filter = filter;
		this.lfo = lfo;
		return ctx;
	}
	teardownOsc() {
		for (const osc of this.oscs) {
			try {
				osc.stop();
			} catch {}
			osc.disconnect();
		}
		for (const amp of this.amps) amp.disconnect();
		this.oscs = [];
		this.amps = [];
		this.running = false;
	}
	targetGain() {
		return this.volume * this.volume * .28;
	}
	start(voice, volume) {
		const ctx = this.ensure();
		if (!ctx || !this.filter || !this.master) return;
		this.unlock();
		this.volume = volume;
		this.generation += 1;
		this.teardownOsc();
		const voices = [
			[
				"sine",
				voice.hz / 2,
				.2,
				0
			],
			[
				"sine",
				voice.hz,
				.36,
				0
			],
			[
				"sine",
				voice.hz * voice.ratio,
				.16,
				voice.detune
			],
			[
				"triangle",
				voice.hz * 2,
				voice.partial,
				0
			]
		];
		for (const [type, freq, gain, detune] of voices) {
			const osc = ctx.createOscillator();
			const amp = ctx.createGain();
			osc.type = type;
			osc.frequency.value = freq;
			osc.detune.value = detune;
			amp.gain.value = gain;
			osc.connect(amp);
			amp.connect(this.filter);
			osc.start();
			this.oscs.push(osc);
			this.amps.push(amp);
		}
		this.applyVoice(voice);
		this.master.gain.cancelScheduledValues(ctx.currentTime);
		this.master.gain.setValueAtTime(Math.max(0, this.master.gain.value), ctx.currentTime);
		this.master.gain.setTargetAtTime(this.targetGain(), ctx.currentTime, .45);
		this.running = true;
	}
	retune(voice) {
		if (!this.running || !this.ctx) return;
		this.applyVoice(voice);
		const freqs = [
			voice.hz / 2,
			voice.hz,
			voice.hz * voice.ratio,
			voice.hz * 2
		];
		const t = this.ctx.currentTime;
		this.oscs.forEach((osc, i) => {
			const freq = freqs[i];
			if (freq === void 0) return;
			osc.frequency.setTargetAtTime(freq, t, .08);
		});
		if (this.oscs[2]) this.oscs[2].detune.setTargetAtTime(voice.detune, t, .08);
		if (this.amps[3]) this.amps[3].gain.setTargetAtTime(voice.partial, t, .08);
	}
	applyVoice(voice) {
		if (!this.ctx || !this.filter || !this.lfo) return;
		const t = this.ctx.currentTime;
		this.filter.frequency.setTargetAtTime(voice.cutoff, t, .12);
		this.lfo.frequency.setTargetAtTime(voice.pulseHz, t, .12);
	}
	setVolume(volume) {
		this.volume = volume;
		if (!this.running || !this.ctx || !this.master) return;
		this.master.gain.setTargetAtTime(this.targetGain(), this.ctx.currentTime, .06);
	}
	stop() {
		if (!this.ctx || !this.master) {
			this.teardownOsc();
			return;
		}
		const gen = ++this.generation;
		this.master.gain.setTargetAtTime(0, this.ctx.currentTime, .06);
		window.setTimeout(() => {
			if (this.generation !== gen) return;
			this.teardownOsc();
		}, 220);
	}
};
var GROW_MS = 5600;
function SoundIcon({ on }) {
	const motion = "transition-[opacity,filter,scale] duration-300 ease-[cubic-bezier(0.2,0,0,1)]";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative size-4",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "absolute inset-0 size-4 " + motion + (on ? " scale-100 opacity-100 blur-none" : " scale-[0.25] opacity-0 blur-[4px]") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4 " + motion + (on ? " scale-[0.25] opacity-0 blur-[4px]" : " scale-100 opacity-100 blur-none") })]
	});
}
function SliderField({ id, label, value, min, max, step, display, valueText, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		htmlFor: id,
		className: "flex min-w-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-baseline justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-display text-sm font-semibold tabular-nums text-fg",
				children: display
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id,
			className: "range",
			type: "range",
			min,
			max,
			step,
			value,
			"aria-valuetext": valueText ?? display,
			onChange: (event) => onChange(Number(event.target.value)),
			suppressHydrationWarning: true
		})]
	});
}
function MicelioApp() {
	const canvasRef = (0, import_react.useRef)(null);
	const [angle, setAngle] = (0, import_react.useState)(32);
	const [depth, setDepth] = (0, import_react.useState)(6);
	const [length, setLength] = (0, import_react.useState)(108);
	const [wavelength, setWavelength] = (0, import_react.useState)(48);
	const [paletteId, setPaletteId] = (0, import_react.useState)("espora");
	const [overlay, setOverlay] = (0, import_react.useState)("none");
	const [seed, setSeed] = (0, import_react.useState)(184729);
	const [soundOn, setSoundOn] = (0, import_react.useState)(false);
	const [volume, setVolume] = (0, import_react.useState)(.72);
	const [phase, setPhase] = (0, import_react.useState)("grow");
	const paramsRef = (0, import_react.useRef)({
		angle,
		depth,
		length,
		wavelength,
		seed,
		paletteId,
		overlay
	});
	paramsRef.current = {
		angle,
		depth,
		length,
		wavelength,
		seed,
		paletteId,
		overlay
	};
	const animToken = (0, import_react.useRef)(0);
	const phaseRef = (0, import_react.useRef)(phase);
	phaseRef.current = phase;
	const reducedRef = (0, import_react.useRef)(false);
	const audioRef = (0, import_react.useRef)(null);
	const volumeRef = (0, import_react.useRef)(volume);
	volumeRef.current = volume;
	const voice = voiceOf({
		wavelength,
		angle,
		depth,
		length
	});
	const palette = paletteById(paletteId);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const apply = () => {
			reducedRef.current = media.matches;
		};
		apply();
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, []);
	(0, import_react.useEffect)(() => {
		const onVisible = () => {
			if (document.visibilityState === "visible") audioRef.current?.unlock();
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => document.removeEventListener("visibilitychange", onVisible);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!soundOn) return;
		audioRef.current?.retune(voiceOf(paramsRef.current));
	}, [
		soundOn,
		wavelength,
		angle,
		depth,
		length
	]);
	(0, import_react.useEffect)(() => {
		audioRef.current?.setVolume(volume);
	}, [volume]);
	(0, import_react.useEffect)(() => {
		if (!canvasRef.current) return;
		let frame = 0;
		let seen = -1;
		let growStart = 0;
		let growth = 0;
		let colony = null;
		let colonyKey = "";
		const loop = (now) => {
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
				height
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
					seed: params.seed
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
			drawColony(ctx, colony, growth, now / 1e3, paletteById(params.paletteId), params.overlay);
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
		setSeed(Math.floor(Math.random() * 4294967295) >>> 0 || 1);
		animToken.current += 1;
		setPhase("grow");
	}
	const colonyLabel = String(seed % 1e4).padStart(4, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex h-dvh flex-col overflow-hidden bg-bg text-fg md:flex-row",
		style: { backgroundColor: palette.bgEdge },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "sr-only",
				children: [
					"Red micelar fractal. Ángulo ",
					angle,
					" grados, profundidad ",
					depth,
					", longitud ",
					length,
					", longitud de onda ",
					wavelength,
					", tono ",
					voice.note,
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-[42dvh] min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "absolute inset-0 h-full w-full",
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "canvas-status flex items-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: phase === "grow" ? "status-dot grow" : "status-dot" }), phase === "grow" ? "Creciendo" : "Viva"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "dock w-full shrink-0 border-t border-border bg-surface px-4 pt-4 md:max-h-none md:w-96 md:border-t-0 md:border-l",
				"aria-label": "Controles de la colonia",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-3xl font-medium italic leading-none",
								children: "Micelio"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: "Onda larga, voz grave. Onda corta, voz aguda."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm " + (soundOn ? "border-primary text-primary" : "border-border text-fg"),
							"aria-pressed": soundOn,
							onClick: toggleSound,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoundIcon, { on: soundOn }), soundOn ? "Silenciar" : "Escuchar"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 flex items-baseline gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl font-semibold leading-none text-primary",
							children: voice.note
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm tabular-nums text-muted",
							children: [Math.round(voice.hz), " Hz"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-x-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								id: "angulo",
								label: "Ángulo",
								min: 12,
								max: 72,
								step: 1,
								value: angle,
								display: `${angle}°`,
								onChange: setAngle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								id: "profundidad",
								label: "Profundidad",
								min: 3,
								max: 7,
								step: 1,
								value: depth,
								display: String(depth),
								onChange: setDepth
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								id: "longitud",
								label: "Longitud",
								min: 48,
								max: 150,
								step: 1,
								value: length,
								display: String(length),
								onChange: setLength
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
								id: "onda",
								label: "Onda",
								min: 18,
								max: 132,
								step: 1,
								value: wavelength,
								display: String(wavelength),
								valueText: `${wavelength}, nota ${voice.note}, ${Math.round(voice.hz)} hercios`,
								onChange: setWavelength
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliderField, {
						id: "volumen",
						label: "Volumen",
						min: 0,
						max: 100,
						step: 1,
						value: Math.round(volume * 100),
						display: soundOn ? `${Math.round(volume * 100)}` : "en silencio",
						onChange: (next) => setVolume(next / 100)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "mb-2 text-sm text-muted",
							children: "Paleta"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-2",
							children: PALETTES.map((item) => {
								const selected = item.id === paletteId;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									"aria-pressed": selected,
									onClick: () => setPaletteId(item.id),
									className: "btn flex min-h-11 flex-col items-stretch gap-1 rounded-md p-1 " + (selected ? "bg-surface-2" : ""),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-7 rounded-sm",
										style: { background: `linear-gradient(180deg, ${item.tip}, ${item.root})` }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-center text-xs " + (selected ? "text-fg" : "text-muted"),
										children: item.name
									})]
								}, item.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
							className: "mb-2 text-sm text-muted",
							children: "Superposición"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							role: "radiogroup",
							"aria-label": "Superposición",
							children: [
								{
									id: "none",
									label: "Limpio",
									icon: CircleOff
								},
								{
									id: "leaf",
									label: "Hojas",
									icon: Leaf
								},
								{
									id: "flower",
									label: "Flores",
									icon: Flower2
								}
							].map((option) => {
								const selected = overlay === option.id;
								const Icon = option.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									role: "radio",
									"aria-checked": selected,
									onClick: () => setOverlay(option.id),
									className: "btn inline-flex h-11 items-center justify-center gap-2 rounded-md text-sm " + (selected ? "bg-surface-2 text-fg" : "text-muted"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
										className: "size-4",
										"aria-hidden": "true"
									}), option.label]
								}, option.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "btn mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-base font-medium text-primary-fg",
						onClick: regenerate,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Regenerar"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-center text-xs tabular-nums text-muted",
						children: ["colonia ", colonyLabel]
					})
				]
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicelioApp, {});
}
//#endregion
export { Home as component };
