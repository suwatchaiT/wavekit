"use client";

import { useEffect, useRef, useState } from "react";

const selector="input:not([type=button]):not([type=submit]), select, textarea";
function encode(values:string[]){return btoa(unescape(encodeURIComponent(JSON.stringify(values)))).replaceAll("+","-").replaceAll("/","_").replaceAll("=","")}
function decode(value:string){try{const base=value.replaceAll("-","+").replaceAll("_","/");return JSON.parse(decodeURIComponent(escape(atob(base)))) as string[]}catch{return null}}
function setNativeValue(element:HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement,value:string){
  const prototype=element instanceof HTMLSelectElement?HTMLSelectElement.prototype:element instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(prototype,"value")?.set?.call(element,value);
  element.dispatchEvent(new Event("input",{bubbles:true}));element.dispatchEvent(new Event("change",{bubbles:true}));
}
async function copy(text:string){if(navigator.clipboard?.writeText)return navigator.clipboard.writeText(text);const area=document.createElement("textarea");area.value=text;document.body.append(area);area.select();document.execCommand("copy");area.remove()}

export default function ToolActions({slug}:{slug:string}){
  const [notice,setNotice]=useState("");
  const applying=useRef(true);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    const root=document.querySelector<HTMLElement>("#calculator-workspace");if(!root)return;
    const fields=()=>Array.from(root.querySelectorAll<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>(selector));
    const saved=new URLSearchParams(location.search).get("inputs");const values=saved?decode(saved):null;
    if(values)requestAnimationFrame(()=>{fields().forEach((field,index)=>{if(values[index]!==undefined)setNativeValue(field,values[index])});applying.current=false});else applying.current=false;
    const update=(event:Event)=>{if(applying.current||!root.contains(event.target as Node))return;if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{const url=new URL(location.href);url.searchParams.set("inputs",encode(fields().map(field=>field.value)));history.replaceState(null,"",url)},250)};
    root.addEventListener("input",update);root.addEventListener("change",update);return()=>{root.removeEventListener("input",update);root.removeEventListener("change",update);if(timer.current)clearTimeout(timer.current)};
  },[]);
  const flash=(message:string)=>{setNotice(message);setTimeout(()=>setNotice(""),1800)};
  const copyResult=async()=>{const root=document.querySelector("#calculator-workspace");const result=root?.querySelector(".tool-result,.budget-results,.ip-results,.antenna-result-card,.speed-result,.grid-results,.result-card");const text=result?.textContent?.replace(/\s+/g," ").trim();if(!text)return flash("No result found");await copy(text);flash("Result copied")};
  const share=async()=>{await copy(location.href);flash("Share link copied")};
  const reset=()=>{const url=new URL(location.href);url.searchParams.delete("inputs");location.assign(url.pathname+url.hash)};
  const report=()=>{const title=encodeURIComponent(`[Calculation]: ${slug}`);const body=encodeURIComponent(`Tool URL: ${location.href}\n\nActual result:\n\nExpected result and independent reference:\n`);window.open(`https://github.com/suwatchaiT/wavekit/issues/new?template=calculation-problem.yml&title=${title}&body=${body}`,"_blank","noopener,noreferrer")};
  return <div className="tool-actions" aria-label="Calculator actions"><button onClick={copyResult}>Copy result</button><button onClick={share}>Copy share link</button><button onClick={reset}>Reset defaults</button><button onClick={report}>Report a problem</button><span aria-live="polite">{notice}</span></div>
}
