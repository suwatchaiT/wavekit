"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Native navigation is intentional: the deployed vinext Link runtime currently intercepts clicks and fails before navigation. */

import { useEffect, useState } from "react";
import { categories, toolCatalog } from "./tool-data";

type Tech = "All" | "RF Planning" | "Cellular" | "Antenna" | "Wi-Fi" | "IP Calculator";

const icons: Record<string,string>={"RF Planning":"◉",Cellular:"⌁",Antenna:"λ","Wi-Fi":"⌁","IP Calculator":"IP"};
const accents=["blue","orange","green","violet","cyan","pink"];
const references = [
  { title: "GSM", category:"Cellular" as Tech, sub: "2G radio reference", color: "#1f7aff", rows: [["Bands", "850 / 900 / 1800 / 1900"], ["Channel width", "200 kHz"], ["Access", "TDMA / FDMA"], ["Modulation", "GMSK, 8PSK"]] },
  { title: "LTE", category:"Cellular" as Tech, sub: "4G E-UTRA reference", color: "#ff8b3d", rows: [["Bands", "1–106"], ["Bandwidth", "1.4–20 MHz"], ["Access", "OFDMA / SC-FDMA"], ["Spacing", "15 kHz"]] },
  { title: "NR", category:"Cellular" as Tech, sub: "New Radio reference", color: "#17b77e", rows: [["Ranges", "FR1 / FR2"], ["Bandwidth", "5–400 MHz"], ["Access", "CP-OFDM / DFT-s-OFDM"], ["Spacing", "15–240 kHz"]] },
  { title: "Wi-Fi", category:"Wi-Fi" as Tech, sub: "IEEE 802.11 reference", color: "#8b5cf6", rows: [["Bands", "2.4 / 5 / 6 GHz"], ["Standards", "a/b/g/n/ac/ax/be"], ["Width", "20–320 MHz"], ["Access", "CSMA/CA, OFDMA"]] },
];

export default function Home() {
  const [filter, setFilter] = useState<Tech>("All");
  const [search, setSearch] = useState("");
  useEffect(()=>{const timer=setTimeout(()=>{const requested=new URLSearchParams(window.location.search).get("category") as Tech|null;if(requested&&(["All",...categories] as string[]).includes(requested))setFilter(requested)},0);return()=>clearTimeout(timer)},[]);
  const query=search.trim().toLowerCase();
  const visible=toolCatalog.filter(t=>(filter==="All"||t.category===filter)&&(!query||`${t.name} ${t.summary} ${t.category}`.toLowerCase().includes(query)));
  return <main>
    <header><a className="brand" href="#top"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></a><span className="version-badge">BETA 0.1</span><nav aria-label="Primary navigation"><a href="/#tools">Tools</a><a href="/#reference">Technology</a><a href="/3gpp">3GPP Map</a><a href="/info/methodology">Methodology</a></nav><a className="header-cta" href="/#tools">Open toolkit <b>→</b></a></header>
    <section className="hero" id="top"><div className="hero-grid"/><div className="hero-copy"><div className="status"><i/> BUILT FOR THE FIELD</div><h1>RF answers.<br/><em>Without the noise.</em></h1><p>Fast, dependable calculators and pocket references for wireless engineers working across GSM, LTE, NR and Wi-Fi.</p><div className="hero-actions"><a className="primary" href="/#tools">Explore tools <span>↓</span></a><a className="knowledge-cta" href="/3gpp">Explore 3GPP map <span>→</span></a><a className="secondary" href="/#reference">Browse references</a></div><div className="trust"><div><b>{toolCatalog.length}</b><span>Engineering tools</span></div><div><b>4</b><span>Radio technologies</span></div><div><b>0</b><span>Sign-ups required</span></div></div></div><div className="spectrum" aria-label="Decorative radio spectrum"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="antenna"><i/><i/><i/><b/></div><span className="freq f1">700 MHz</span><span className="freq f2">3.5 GHz</span><span className="freq f3">28 GHz</span><div className="waveform">{[38,54,26,75,48,92,60,42,80,31,62,45].map((h,i)=><i style={{height:h}} key={i}/>)}</div></div></section>
    <section className="tool-section" id="tools"><div className="section-heading"><div><span className="eyebrow">ENGINEERING TOOLBOX</span><h2>One job. One focused tool.</h2></div><p>Browse by engineering task. Calculations shared by several radio technologies stay together in one tool.</p></div><div className="tool-search"><label htmlFor="tool-search">Search all {toolCatalog.length} tools</label><input id="tool-search" type="search" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try “link budget”, “NR”, “subnet”…"/></div><div className="filters">{(["All",...categories] as Tech[]).map(x=><button className={filter===x?"active":""} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>{visible.length?<div className="tool-grid">{visible.map((t,i)=><a className={`tool-card ${accents[i%accents.length]}`} href={`/tools/${t.slug}`} key={t.name}><span className="tool-icon">{icons[t.category]}</span><small>{t.category}</small><h3>{t.name}</h3><p>{t.summary}</p><b>Launch tool <i>↗</i></b></a>)}</div>:<div className="empty-tools"><b>No tools match “{search}”.</b><button onClick={()=>{setSearch("");setFilter("All")}}>Clear search</button></div>}</section>
    <section className="reference" id="reference"><div className="section-heading"><div><span className="eyebrow">POCKET REFERENCE</span><h2>Know the radio landscape.</h2></div><p>Core parameters at a glance for the technologies you work with every day.</p></div><div className="ref-grid">{references.map(r=><article key={r.title} style={{"--tech":r.color} as React.CSSProperties}><div className="ref-top"><span>{r.title.slice(0,2)}</span><div><h3>{r.title}</h3><p>{r.sub}</p></div></div>{r.rows.map(row=><div className="ref-row" key={row[0]}><span>{row[0]}</span><b>{row[1]}</b></div>)}<a href={`/?category=${encodeURIComponent(r.category)}#tools`}>Open {r.title} tools <b>→</b></a></article>)}</div></section>
    <footer><div className="brand inverse"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS · BETA 0.1</small></span></div><p>Reference-only planning tools. Validate every result against current standards, vendor data and local requirements.</p><div><a href="/3gpp">3GPP Map</a><a href="/info/about">About</a><a href="/info/methodology">Methodology</a><a href="/info/readiness">Readiness</a><a href="/info/privacy">Privacy</a><a href="/info/disclaimer">Disclaimer</a><a href="#top">Back to top ↑</a></div></footer>
  </main>;
}
