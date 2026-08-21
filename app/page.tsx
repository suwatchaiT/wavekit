"use client";

import { useMemo, useState } from "react";

type Tech = "All" | "GSM" | "LTE" | "5G NR" | "Wi-Fi" | "RF";

const tools = [
  { icon: "⌁", name: "Channel ↔ Frequency", desc: "Convert ARFCN, EARFCN and NR-ARFCN into center frequencies.", tech: "LTE", accent: "blue" },
  { icon: "▤", name: "Link Budget", desc: "Estimate received power, losses and fade margin across a radio link.", tech: "RF", accent: "orange" },
  { icon: "λ", name: "Wavelength", desc: "Calculate wavelength and practical antenna element dimensions.", tech: "RF", accent: "green" },
  { icon: "◉", name: "Free-Space Path Loss", desc: "Find propagation loss from frequency and line-of-sight distance.", tech: "RF", accent: "violet" },
  { icon: "⇄", name: "RF Unit Converter", desc: "Convert power between dBm, dBW, watts and milliwatts.", tech: "RF", accent: "cyan" },
  { icon: "▦", name: "Resource Grid", desc: "Estimate LTE/NR resource blocks from channel bandwidth.", tech: "5G NR", accent: "pink" },
];

const references = [
  { title: "GSM", sub: "2G radio reference", color: "#1f7aff", rows: [["Bands", "850 / 900 / 1800 / 1900"], ["Channel width", "200 kHz"], ["Access", "TDMA / FDMA"], ["Modulation", "GMSK, 8PSK"]] },
  { title: "LTE", sub: "4G E-UTRA reference", color: "#ff8b3d", rows: [["Bands", "1–106"], ["Bandwidth", "1.4–20 MHz"], ["Access", "OFDMA / SC-FDMA"], ["Spacing", "15 kHz"]] },
  { title: "5G NR", sub: "New Radio reference", color: "#17b77e", rows: [["Ranges", "FR1 / FR2"], ["Bandwidth", "5–400 MHz"], ["Access", "CP-OFDM / DFT-s-OFDM"], ["Spacing", "15–240 kHz"]] },
  { title: "Wi-Fi", sub: "IEEE 802.11 reference", color: "#8b5cf6", rows: [["Bands", "2.4 / 5 / 6 GHz"], ["Standards", "a/b/g/n/ac/ax/be"], ["Width", "20–320 MHz"], ["Access", "CSMA/CA, OFDMA"]] },
];

function ChannelCalculator() {
  const [mode, setMode] = useState("LTE");
  const [channel, setChannel] = useState(1300);
  const frequency = useMemo(() => {
    if (mode === "GSM") return channel <= 124 ? 935 + 0.2 * channel : 1805.2 + 0.2 * (channel - 512);
    if (mode === "5G NR") return channel <= 599999 ? channel * 0.005 : 3000 + (channel - 600000) * 0.015;
    return channel <= 9659 ? 0.1 * channel : 0.1 * channel;
  }, [mode, channel]);
  return <section className="calculator" id="calculator">
    <div className="calc-copy"><span className="eyebrow">QUICK CALCULATOR</span><h2>Channel to frequency</h2><p>Enter a channel number to get an immediate center-frequency estimate. Use the result as a quick field reference.</p>
      <div className="mode-switch" aria-label="Radio technology">{["GSM", "LTE", "5G NR"].map(x => <button className={mode === x ? "active" : ""} key={x} onClick={() => setMode(x)}>{x}</button>)}</div>
      <label>{mode === "GSM" ? "ARFCN" : mode === "LTE" ? "EARFCN" : "NR-ARFCN"}<input type="number" value={channel} min="0" onChange={e => setChannel(Number(e.target.value))}/></label>
    </div>
    <div className="result-card"><span>ESTIMATED FREQUENCY</span><strong>{frequency.toLocaleString(undefined, { maximumFractionDigits: 3 })}</strong><b>MHz</b><div className="signal-bars"><i/><i/><i/><i/><i/></div><small>Verify band-specific raster and duplex offsets before commissioning.</small></div>
  </section>
}

export default function Home() {
  const [filter, setFilter] = useState<Tech>("All");
  const visible = filter === "All" ? tools : tools.filter(t => t.tech === filter || (filter !== "RF" && t.name.includes(filter)));
  return <main>
    <header><a className="brand" href="#top"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></a><nav><a href="#tools">Tools</a><a href="#reference">Technology</a><a href="#calculator">Calculator</a></nav><a className="header-cta" href="#tools">Open toolkit <b>→</b></a></header>
    <section className="hero" id="top"><div className="hero-grid"/><div className="hero-copy"><div className="status"><i/> BUILT FOR THE FIELD</div><h1>RF answers.<br/><em>Without the noise.</em></h1><p>Fast, dependable calculators and pocket references for wireless engineers working across GSM, LTE, 5G NR and Wi-Fi.</p><div className="hero-actions"><a className="primary" href="#tools">Explore tools <span>↓</span></a><a className="secondary" href="#reference">Browse references</a></div><div className="trust"><div><b>20+</b><span>Engineering tools</span></div><div><b>4</b><span>Radio technologies</span></div><div><b>0</b><span>Sign-ups required</span></div></div></div><div className="spectrum" aria-label="Decorative radio spectrum"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="antenna"><i/><i/><i/><b/></div><span className="freq f1">700 MHz</span><span className="freq f2">3.5 GHz</span><span className="freq f3">28 GHz</span><div className="waveform">{[38,54,26,75,48,92,60,42,80,31,62,45].map((h,i)=><i style={{height:h}} key={i}/>)}</div></div></section>
    <section className="tool-section" id="tools"><div className="section-heading"><div><span className="eyebrow">EVERYDAY ESSENTIALS</span><h2>Pick a tool. Get the answer.</h2></div><p>Focused utilities for planning, optimization and troubleshooting—designed to stay out of your way.</p></div><div className="filters">{(["All","GSM","LTE","5G NR","Wi-Fi","RF"] as Tech[]).map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><div className="tool-grid">{visible.map((t,i)=><a className={`tool-card ${t.accent}`} href={i===0?"#calculator":"#calculator"} key={t.name}><span className="tool-icon">{t.icon}</span><small>{t.tech}</small><h3>{t.name}</h3><p>{t.desc}</p><b>Launch tool <i>↗</i></b></a>)}</div></section>
    <ChannelCalculator/>
    <section className="reference" id="reference"><div className="section-heading"><div><span className="eyebrow">POCKET REFERENCE</span><h2>Know the radio landscape.</h2></div><p>Core parameters at a glance for the technologies you work with every day.</p></div><div className="ref-grid">{references.map(r=><article key={r.title} style={{"--tech":r.color} as React.CSSProperties}><div className="ref-top"><span>{r.title.slice(0,2)}</span><div><h3>{r.title}</h3><p>{r.sub}</p></div></div>{r.rows.map(row=><div className="ref-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b></div>)}<a href="#calculator">Open {r.title} tools <b>→</b></a></article>)}</div></section>
    <footer><div className="brand inverse"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></div><p>Built for engineers who would rather solve the link than fight the spreadsheet.</p><div><a href="#tools">Tools</a><a href="#reference">References</a><a href="#top">Back to top ↑</a></div></footer>
  </main>;
}
