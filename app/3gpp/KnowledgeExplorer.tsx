"use client";

import Link from "next/link";
import {useMemo, useState} from "react";
import {domains, featureDetails, features, releases, snapshot, specifications, technologies, type Domain, type Feature, type Release, type Technology} from "./data";
import {toolCatalog} from "../tool-data";
import {toolsForFeature} from "./tool-relations";

const cloudKeywords=[
  {label:"NR",query:"NR"},{label:"LTE",query:"LTE"},{label:"RRC",query:"RRC"},{label:"Physical layer",query:"physical layer"},
  {label:"Radio",query:"radio"},{label:"5G-Advanced",query:"5G-Advanced"},{label:"RedCap",query:"RedCap"},{label:"Carrier aggregation",query:"carrier aggregation"},
  {label:"URLLC",query:"URLLC"},{label:"V2X",query:"V2X"},{label:"NB-IoT",query:"NB-IoT"},{label:"LTE-M",query:"LTE-M"},
  {label:"MIMO",query:"MIMO"},{label:"HARQ",query:"HARQ"},{label:"Sidelink",query:"sidelink"},{label:"NTN",query:"NTN"},
  {label:"WCDMA",query:"WCDMA"},{label:"HSDPA",query:"HSDPA"},{label:"HSUPA",query:"HSUPA"},{label:"EDGE",query:"EDGE"},
  {label:"GPRS",query:"GPRS"},{label:"OFDMA",query:"OFDMA"},{label:"5GC",query:"5GS"},{label:"NG-RAN",query:"NG-RAN"},
];

function FeatureEngineeringView({feature}:{feature:Feature}){
  const detail=featureDetails[feature.id];
  const relatedTools=toolsForFeature(feature.id).map(slug=>toolCatalog.find(tool=>tool.slug===slug)).filter(Boolean);
  return <div className="gpp-feature-engineering"><div className="gpp-mini-flow" aria-label={`${feature.name} operation overview`}>{detail.diagram.map((step,index)=><div className="gpp-flow-step" key={step.label}><span>{index+1}</span><b>{step.label}</b><small>{step.caption}</small>{index<detail.diagram.length-1&&<i aria-hidden="true">→</i>}</div>)}</div><div className="gpp-feature-info"><section><h4>Topics in this feature</h4><ul>{detail.topics.map(topic=><li key={topic}>{topic}</li>)}</ul></section><section><h4>Key engineering parameters</h4><dl>{detail.parameters.map(parameter=><div key={parameter.name}><dt>{parameter.name}</dt><dd>{parameter.guidance}</dd></div>)}</dl></section></div>{relatedTools.length>0&&<section className="gpp-related-tools"><h4>Related WaveKit tools</h4><div>{relatedTools.map(tool=><Link href={`/tools/${tool!.slug}`} key={tool!.slug}><b>{tool!.name}</b><span>{tool!.summary}</span><em>Open calculator →</em></Link>)}</div></section>}</div>
}

export default function KnowledgeExplorer({initialFeature}:{initialFeature?:string}) {
  const [query,setQuery]=useState(()=>features.find(item=>item.id===initialFeature)?.name??"");
  const [technology,setTechnology]=useState<Technology|"All">("All");
  const [domain,setDomain]=useState<Domain|"All">("All");
  const [release,setRelease]=useState<Release|"All">("All");
  const visible=useMemo(()=>features.filter(feature=>{
    const linked=feature.specifications.map(number=>specifications.find(item=>item.number===number)).filter(Boolean);
    const haystack=`${feature.name} ${feature.summary} ${feature.release} ${linked.map(item=>`${item?.number} ${item?.title} ${item?.responsibleGroups.join(" ")}`).join(" ")}`.toLowerCase();
    return (technology==="All"||feature.technology===technology)&&(domain==="All"||feature.domain===domain)&&(release==="All"||feature.release===release)&&(!query.trim()||haystack.includes(query.trim().toLowerCase()));
  }),[query,technology,domain,release]);
  const grouped=technologies.map(name=>({name,items:visible.filter(item=>item.technology===name)})).filter(group=>group.items.length);
  const cloudWords=useMemo(()=>cloudKeywords.map((word,index)=>{
    const needle=word.query.toLowerCase();
    const count=features.reduce((total,feature)=>{const linked=feature.specifications.map(number=>specifications.find(item=>item.number===number)).filter(Boolean);const text=`${feature.name} ${feature.summary} ${feature.technology} ${linked.map(item=>`${item?.title} ${item?.summary}`).join(" ")}`.toLowerCase();return total+(text.includes(needle)?1:0)},0);
    return {...word,count,level:Math.min(5,Math.max(1,Math.ceil(count/2))),tone:(index%5)+1};
  }).filter(word=>word.count>0).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label)),[]);
  return <>
    <section className="gpp-hero"><div><span className="eyebrow">3GPP KNOWLEDGE MAP</span><h1>Follow radio technology<br/><em>through every release.</em></h1><p>A searchable map connecting releases, features and the specifications engineers use. Official catalogue relationships stay separate from WaveKit’s curated engineering links.</p><div className="gpp-actions"><Link className="primary" href="/3gpp/specifications">Browse {specifications.length} sample specifications →</Link><span>Snapshot {snapshot.date}</span></div></div><aside><b>Prototype scope</b><strong>{features.length}</strong><span>curated features</span><strong>{specifications.length}</strong><span>representative specifications</span><p>The public catalogue import comes after local approval.</p></aside></section>
    <section className="gpp-release-band" aria-label="3GPP release filter"><div><b>Release timeline</b><button className={release==="All"?"active":""} onClick={()=>setRelease("All")}>All</button>{releases.map(item=><button className={release===item?"active":""} onClick={()=>setRelease(item)} key={item}>{item}{snapshot.openReleases.includes(item)?<i>OPEN</i>:null}</button>)}</div></section>
    <section className="gpp-cloud-section"><div className="gpp-cloud-copy"><span className="eyebrow">KEYWORD SIGNAL MAP</span><h2>See the ideas that shape 3GPP.</h2><p>Word size shows how many curated features connect to each term in this snapshot. Select any keyword to explore its technology and specification links.</p><div><span><i className="large"/>More feature connections</span><span><i/>Fewer feature connections</span></div></div><div className="gpp-word-cloud" aria-label="Interactive 3GPP keyword cloud"><div className="cloud-orbit one"/><div className="cloud-orbit two"/>{cloudWords.map(word=><button key={word.label} className={`level-${word.level} tone-${word.tone} ${query.toLowerCase()===word.query.toLowerCase()?"active":""}`} onClick={()=>setQuery(current=>current.toLowerCase()===word.query.toLowerCase()?"":word.query)} title={`${word.count} connected feature${word.count===1?"":"s"}`} aria-pressed={query.toLowerCase()===word.query.toLowerCase()}><span>{word.label}</span><small>{word.count}</small></button>)}</div></section>
    <section className="gpp-explorer"><div className="section-heading"><div><span className="eyebrow">TECHNOLOGY → FEATURE → SPEC</span><h2>Explore the standards landscape.</h2></div><p><b>Official</b> relationships come from 3GPP metadata. <b>Inferred</b> relationships are WaveKit mappings with a rationale and review date.</p></div>
      <div className="gpp-controls"><label>Search<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="38.211, RedCap, RAN1…"/></label><label>Technology<select value={technology} onChange={e=>setTechnology(e.target.value as Technology|"All")}><option>All</option>{technologies.filter(x=>x!=="Common").map(x=><option key={x}>{x}</option>)}</select></label><label>Domain<select value={domain} onChange={e=>setDomain(e.target.value as Domain|"All")}><option>All</option>{domains.map(x=><option key={x}>{x}</option>)}</select></label><button onClick={()=>{setQuery("");setTechnology("All");setDomain("All");setRelease("All")}}>Reset filters</button></div>
      {snapshot.openReleases.includes(release as Release)&&<div className="gpp-warning"><b>{release} is open.</b> Feature scope and metadata may change after the {snapshot.date} snapshot.</div>}
      <div className="gpp-tree">{grouped.map(group=><section key={group.name}><div className="gpp-tech-title"><span>{group.name.split(" ")[0]}</span><div><h3>{group.name}</h3><p>{group.items.length} matching feature{group.items.length===1?"":"s"}</p></div></div>{group.items.map(feature=><details id={`feature-${feature.id}`} key={feature.id} open={!!query}><summary><span><i>{feature.release}</i><b>{feature.name}</b></span><em className={feature.status.toLowerCase()}>{feature.status}</em></summary><div className="gpp-feature-body"><p>{featureDetails[feature.id].description}</p><small>{feature.domain} · Curated feature grouping · Inferred</small><FeatureEngineeringView feature={feature}/><h4 className="gpp-spec-heading">Related specifications</h4><div>{feature.specifications.map(number=>{const item=specifications.find(candidate=>candidate.number===number)!;return <Link href={`/3gpp/spec/${item.number}`} key={number}><b>{item.type} {item.number}</b><span>{item.title}</span><small>{item.responsibleGroups.join(", ")} · {item.domains.join(", ")}</small></Link>})}</div></div></details>)}</section>)}</div>
      {!grouped.length&&<div className="gpp-empty"><b>No matching feature.</b><p>Try a broader release, technology or keyword.</p></div>}
    </section>
  </>;
}
