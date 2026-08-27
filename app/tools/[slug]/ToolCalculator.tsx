"use client";

import { useMemo, useState } from "react";

const Field = ({ label, value, setValue, unit }: { label: string; value: number; setValue: (n:number)=>void; unit?: string }) => <label className="calc-field"><span>{label}</span><div><input type="number" value={value} onChange={e=>setValue(Number(e.target.value))}/>{unit && <b>{unit}</b>}</div></label>;
const NumberSelect = ({label,value,options,setValue,unit}:{label:string;value:number;options:number[];setValue:(n:number)=>void;unit?:string}) => <label className="calc-field select-field"><span>{label}</span><div><select value={value} onChange={e=>setValue(Number(e.target.value))}>{options.map(x=><option value={x} key={x}>{x}</option>)}</select>{unit&&<b>{unit}</b>}</div></label>;
const ChoiceSelect = ({label,value,options,setValue}:{label:string;value:string;options:string[];setValue:(v:string)=>void}) => <label className="calc-field select-field"><span>{label}</span><div><select value={value} onChange={e=>setValue(e.target.value)}>{options.map(x=><option value={x} key={x}>{x}</option>)}</select></div></label>;
const Result = ({ value, unit, note }: { value: string|number; unit?: string; note?: string }) => <div className="tool-result"><span>RESULT</span><strong>{value}</strong>{unit&&<b>{unit}</b>}{note&&<small>{note}</small>}</div>;
const TextField = ({label,value,setValue,placeholder}:{label:string;value:string;setValue:(v:string)=>void;placeholder?:string}) => <label className="calc-field text-field"><span>{label}</span><div><input type="text" value={value} placeholder={placeholder} onChange={e=>setValue(e.target.value)}/></div></label>;
const TextAreaField = ({label,value,setValue,placeholder}:{label:string;value:string;setValue:(v:string)=>void;placeholder?:string}) => <label className="calc-field text-field area-field"><span>{label}</span><textarea value={value} placeholder={placeholder} onChange={e=>setValue(e.target.value)}/></label>;

const pathModels = {
  fspl: { name:"Free Space (LOS)", range:"Any RF band; unobstructed ideal path", formula:"32.44 + 20 log₁₀(dkm) + 20 log₁₀(fMHz)" },
  hataUrban: { name:"Okumura-Hata Urban", range:"150–1,500 MHz • 1–20 km • macrocell", formula:"69.55 + 26.16 log₁₀(f) − 13.82 log₁₀(hb) − a(hm) + (44.9 − 6.55 log₁₀(hb)) log₁₀(d)" },
  hataSuburban: { name:"Okumura-Hata Suburban", range:"150–1,500 MHz • 1–20 km • suburban macrocell", formula:"Lurban − 2[log₁₀(f/28)]² − 5.4" },
  hataOpen: { name:"Okumura-Hata Open", range:"150–1,500 MHz • 1–20 km • open/rural macrocell", formula:"Lurban − 4.78(log₁₀ f)² + 18.33 log₁₀(f) − 40.94" },
  cost231: { name:"COST-231 Hata Urban", range:"1,500–2,000 MHz • 1–20 km • urban macrocell", formula:"46.3 + 33.9 log₁₀(f) − 13.82 log₁₀(hb) − a(hm) + (44.9 − 6.55 log₁₀(hb)) log₁₀(d)" },
  uma: { name:"3GPP UMa NLOS", range:"0.5–37 GHz • 10 m–5 km • urban macro", formula:"max(PLLOS, 13.54 + 39.08 log₁₀(d3D) + 20 log₁₀(fc) − 0.6(hUT−1.5))" },
  umi: { name:"3GPP UMi Street Canyon NLOS", range:"0.5–100 GHz • 10 m–5 km • urban micro", formula:"max(PLLOS, 35.3 log₁₀(d3D) + 22.4 + 21.3 log₁₀(fc) − 0.3(hUT−1.5))" },
} as const;

const lteBands: Record<string,{low:number;offset:number;ulLow?:number;ulOffset?:number}> = {
  "1":{low:2110,offset:0,ulLow:1920,ulOffset:18000},"2":{low:1930,offset:600,ulLow:1850,ulOffset:18600},"3":{low:1805,offset:1200,ulLow:1710,ulOffset:19200},"4":{low:2110,offset:1950,ulLow:1710,ulOffset:19950},"5":{low:869,offset:2400,ulLow:824,ulOffset:20400},"7":{low:2620,offset:2750,ulLow:2500,ulOffset:20750},"8":{low:925,offset:3450,ulLow:880,ulOffset:21450},"12":{low:729,offset:5010,ulLow:699,ulOffset:23010},"13":{low:746,offset:5180,ulLow:777,ulOffset:23180},"14":{low:758,offset:5280,ulLow:788,ulOffset:23280},"17":{low:734,offset:5730,ulLow:704,ulOffset:23730},"18":{low:860,offset:5850,ulLow:815,ulOffset:23850},"19":{low:875,offset:6000,ulLow:830,ulOffset:24000},"20":{low:791,offset:6150,ulLow:832,ulOffset:24150},"25":{low:1930,offset:8040,ulLow:1850,ulOffset:26040},"26":{low:859,offset:8690,ulLow:814,ulOffset:26690},"28":{low:758,offset:9210,ulLow:703,ulOffset:27210},"30":{low:2350,offset:9770,ulLow:2305,ulOffset:27660},"32":{low:1452,offset:9920},"38":{low:2570,offset:37750,ulLow:2570,ulOffset:37750},"39":{low:1880,offset:38250,ulLow:1880,ulOffset:38250},"40":{low:2300,offset:38650,ulLow:2300,ulOffset:38650},"41":{low:2496,offset:39650,ulLow:2496,ulOffset:39650},"42":{low:3400,offset:41590,ulLow:3400,ulOffset:41590},"43":{low:3600,offset:43590,ulLow:3600,ulOffset:43590},"48":{low:3550,offset:55240,ulLow:3550,ulOffset:55240},"66":{low:2110,offset:66436,ulLow:1710,ulOffset:131972},"71":{low:617,offset:68586,ulLow:663,ulOffset:132672}
};
const gsmBands:Record<string,{ulLow:number;dlLow:number;offset:number}>={"850":{ulLow:824.2,dlLow:869.2,offset:128},"900":{ulLow:890,dlLow:935,offset:0},"1800":{ulLow:1710.2,dlLow:1805.2,offset:512},"1900":{ulLow:1850.2,dlLow:1930.2,offset:512}};

function ChannelFormulaReference(){
  return <section className="channel-formulas"><div><span className="eyebrow">TECHNOLOGY-SPECIFIC FORMULAS</span><h3>Each radio system uses a different raster</h3><p>The linear equation is a common structure, but its reference frequency, offset and spacing must come from the selected technology and band.</p></div>
    <article><b>GSM · ARFCN</b><code>Fᴜʟ = Fbase + 0.2 × (N − Noffset)</code><code>Fᴅʟ = Fᴜʟ + duplex spacing</code><p>200 kHz raster. Base frequency, channel offset and duplex spacing depend on GSM 850/900/1800/1900.</p></article>
    <article><b>LTE · EARFCN</b><code>Fᴅʟ = FDL_low + 0.1 × (Nᴅʟ − Noffs-DL)</code><code>Fᴜʟ = FUL_low + 0.1 × (Nᴜʟ − Noffs-UL)</code><code>Nlink = Noffs-link + 10 × (Flink − Flow-link)</code><p>100 kHz raster with separate downlink/uplink references from 3GPP TS 36.101. TDD bands use the same carrier range in both directions.</p></article>
    <article><b>5G NR · NR-ARFCN</b><code>N 0–599999: F = 0.005 × N</code><code>N 600000–2016666: F = 3000 + 0.015 × (N−600000)</code><code>N 2016667–3279165: F = 24250.08 + 0.06 × (N−2016667)</code><p>Global raster segments use 5, 15 and 60 kHz spacing respectively.</p></article>
  </section>;
}

function normalQuantile(p:number){
  const pp=Math.min(.9999,Math.max(.5001,p));
  const a=[-39.6968302866538,220.946098424521,-275.928510446969,138.357751867269,-30.6647980661472,2.50662827745924];
  const b=[-54.4760987982241,161.585836858041,-155.698979859887,66.8013118877197,-13.2806815528857];
  const q=pp-.5,r=q*q;
  return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1);
}

function AdvancedLinkBudget(){
  const [tech,setTech]=useState<"LTE"|"5G NR">("LTE");
  const [direction,setDirection]=useState<"Downlink"|"Uplink">("Downlink");
  const [frequency,setFrequency]=useState(1800);
  const [bandwidth,setBandwidth]=useState(20);
  const [scs,setScs]=useState(15);
  const [prbs,setPrbs]=useState(100);
  const [txPower,setTxPower]=useState(46);
  const [txLoss,setTxLoss]=useState(2);
  const [txGain,setTxGain]=useState(17);
  const [rxGain,setRxGain]=useState(0);
  const [rxLoss,setRxLoss]=useState(0);
  const [noiseFigure,setNoiseFigure]=useState(7);
  const [sinr,setSinr]=useState(-3);
  const [implementationLoss,setImplementationLoss]=useState(2);
  const [interferenceMargin,setInterferenceMargin]=useState(3);
  const [penetrationLoss,setPenetrationLoss]=useState(15);
  const [bodyLoss,setBodyLoss]=useState(3);
  const [shadowSigma,setShadowSigma]=useState(6);
  const [confidence,setConfidence]=useState(90);
  const [fastFade,setFastFade]=useState(3);
  const lteBandwidths=[1.4,3,5,10,15,20];
  const nrBandwidths=[5,10,15,20,25,30,40,50,60,70,80,90,100,200,400];
  const ltePrbs:Record<number,number>={1.4:6,3:15,5:25,10:50,15:75,20:100};
  const nr30Prbs:Record<number,number>={5:11,10:24,15:38,20:51,25:65,30:78,40:106,50:133,60:162,70:189,80:217,90:245,100:273};
  const setStandardBandwidth=(bw:number)=>{setBandwidth(bw);if(tech==="LTE"){setScs(15);setPrbs(ltePrbs[bw]??100)}else if(bw>=200){setScs(120);setPrbs(bw===200?132:264)}else{setScs(30);setPrbs(nr30Prbs[bw]??273)}};
  const applyPreset=(t:"LTE"|"5G NR",dir:"Downlink"|"Uplink")=>{
    setTech(t);setDirection(dir);setFrequency(t==="LTE"?1800:3500);setBandwidth(t==="LTE"?20:100);setScs(t==="LTE"?15:30);setPrbs(t==="LTE"?100:273);
    if(dir==="Downlink"){setTxPower(t==="LTE"?46:49);setTxLoss(2);setTxGain(17);setRxGain(0);setRxLoss(0);setNoiseFigure(7);setBodyLoss(3)}
    else{setTxPower(23);setTxLoss(0);setTxGain(0);setRxGain(17);setRxLoss(2);setNoiseFigure(3);setBodyLoss(3)}
    setSinr(-3);setImplementationLoss(2);setInterferenceMargin(3);setPenetrationLoss(15);setShadowSigma(6);setConfidence(90);setFastFade(3);
  };
  const occupiedHz=prbs*12*scs*1000;
  const thermal=-174+10*Math.log10(Math.max(occupiedHz,1));
  const receiverNoise=thermal+noiseFigure;
  const sensitivity=receiverNoise+sinr+implementationLoss;
  const eirp=txPower-txLoss+txGain;
  const shadowMargin=normalQuantile(confidence/100)*shadowSigma;
  const environmentMargins=penetrationLoss+bodyLoss+shadowMargin+fastFade+interferenceMargin;
  const mapl=eirp+rxGain-rxLoss-sensitivity-environmentMargins;
  const spectralEfficiency=Math.max(.01,Math.pow(2,Math.max(-5,sinr)/10)-1);
  const idealThroughput=occupiedHz*spectralEfficiency/1e6;
  const rows=[
    ["Occupied bandwidth",`${(occupiedHz/1e6).toFixed(2)} MHz`],
    ["Transmitter EIRP",`${eirp.toFixed(2)} dBm`],
    ["Thermal noise",`${thermal.toFixed(2)} dBm`],
    ["Receiver noise floor",`${receiverNoise.toFixed(2)} dBm`],
    ["Required receiver sensitivity",`${sensitivity.toFixed(2)} dBm`],
    ["Log-normal shadow margin",`${shadowMargin.toFixed(2)} dB`],
    ["Total non-path margins",`${environmentMargins.toFixed(2)} dB`],
    ["Maximum allowable path loss",`${mapl.toFixed(2)} dB`],
  ];
  return <section className="advanced-budget">
    <div className="budget-top"><div className="mode-switch">{(["LTE","5G NR"] as const).map(t=><button className={tech===t?"active":""} key={t} onClick={()=>applyPreset(t,direction)}>{t}</button>)}</div><div className="mode-switch">{(["Downlink","Uplink"] as const).map(x=><button className={direction===x?"active":""} key={x} onClick={()=>applyPreset(tech,x)}>{x}</button>)}</div></div>
    <div className="budget-layout"><div className="budget-inputs">
      <fieldset><legend>1 · Radio allocation</legend><div className="budget-fields"><Field label="Carrier frequency" value={frequency} setValue={setFrequency} unit="MHz"/><NumberSelect label="Channel bandwidth" value={bandwidth} options={tech==="LTE"?lteBandwidths:nrBandwidths} setValue={setStandardBandwidth} unit="MHz"/><Field label="Subcarrier spacing" value={scs} setValue={setScs} unit="kHz"/><Field label="Allocated PRBs" value={prbs} setValue={setPrbs} unit="PRB"/></div></fieldset>
      <fieldset><legend>2 · Transmitter</legend><div className="budget-fields"><Field label="Conducted Tx power" value={txPower} setValue={setTxPower} unit="dBm"/><Field label="Tx feeder / connector loss" value={txLoss} setValue={setTxLoss} unit="dB"/><Field label="Tx antenna gain" value={txGain} setValue={setTxGain} unit="dBi"/></div></fieldset>
      <fieldset><legend>3 · Receiver</legend><div className="budget-fields"><Field label="Rx antenna gain" value={rxGain} setValue={setRxGain} unit="dBi"/><Field label="Rx feeder loss" value={rxLoss} setValue={setRxLoss} unit="dB"/><Field label="Receiver noise figure" value={noiseFigure} setValue={setNoiseFigure} unit="dB"/><Field label="Required SINR" value={sinr} setValue={setSinr} unit="dB"/><Field label="Implementation loss" value={implementationLoss} setValue={setImplementationLoss} unit="dB"/></div></fieldset>
      <fieldset><legend>4 · Environment & margins</legend><div className="budget-fields"><Field label="Interference margin" value={interferenceMargin} setValue={setInterferenceMargin} unit="dB"/><Field label="Building penetration loss" value={penetrationLoss} setValue={setPenetrationLoss} unit="dB"/><Field label="Body loss" value={bodyLoss} setValue={setBodyLoss} unit="dB"/><Field label="Shadow-fading σ" value={shadowSigma} setValue={setShadowSigma} unit="dB"/><Field label="Cell-edge confidence" value={confidence} setValue={setConfidence} unit="%"/><Field label="Fast-fading margin" value={fastFade} setValue={setFastFade} unit="dB"/></div></fieldset>
    </div><div className="budget-results"><span>{tech} · {direction.toUpperCase()}</span><strong>{Number.isFinite(mapl)?mapl.toFixed(2):"Check inputs"}</strong><b>dB MAPL</b><div className="budget-meter"><i style={{width:`${Number.isFinite(mapl)?Math.min(100,Math.max(0,(mapl-80)/1.1)):0}%`}}/></div>{rows.map(([k,v])=><div className="budget-row" key={k}><span>{k}</span><b>{v}</b></div>)}<small>Ideal Shannon-rate indicator: {idealThroughput.toFixed(1)} Mbps. Use an MCS/TBS tool for standards-based throughput.</small></div></div>
    <div className="budget-equation"><b>Calculation chain</b><code>MAPL = (Ptx − Ltx + Gtx) + Grx − Lrx − Sensitivity − Penetration − Body − Shadow − Fast fade − Interference</code><p>Sensitivity = −174 + 10 log₁₀(12 × PRB × SCS) + NF + required SINR + implementation loss</p></div>
  </section>;
}

const ltePrb:Record<number,number>={1.4:6,3:15,5:25,10:50,15:75,20:100};
const nrPrb:Record<number,Record<number,number>>={
  15:{5:25,10:52,15:79,20:106,25:133,30:160,40:216,50:270},
  30:{5:11,10:24,15:38,20:51,25:65,30:78,40:106,50:133,60:162,70:189,80:217,90:245,100:273},
  60:{10:11,15:18,20:24,25:31,30:38,40:51,50:65,60:79,70:93,80:107,90:121,100:135},
  120:{50:32,100:66,200:132,400:264}
};
const tddPatterns=["DSUUUDSUUU","DSUUDDSUUD","DSUDDDSUDD","DSUUUDDDDD","DSUUDDDDDD","DSUDDDDDDD","DSUUUDSUUD"];
const specialNormal=[[3,1],[9,1],[10,1],[11,1],[12,1],[3,2],[9,2],[10,2],[11,2]];

function MaximumSpeedCalculator(){
  const [tech,setTech]=useState<"LTE FDD"|"LTE TDD"|"5G NR">("LTE FDD");
  const [direction,setDirection]=useState<"Downlink"|"Uplink">("Downlink");
  const [bandwidth,setBandwidth]=useState(20),[scs,setScs]=useState(30),[modulation,setModulation]=useState(6);
  const [layers,setLayers]=useState(2),[carriers,setCarriers]=useState(1),[overhead,setOverhead]=useState(25);
  const [cp,setCp]=useState("Normal"),[tddConfig,setTddConfig]=useState(1),[specialConfig,setSpecialConfig]=useState(7),[nrShare,setNrShare]=useState(75);
  const nrBandwidths=Object.keys(nrPrb[scs]).map(Number);
  const prbs=tech==="5G NR"?(nrPrb[scs]?.[bandwidth]??0):(ltePrb[bandwidth]??0);
  const symbolsPerSlot=cp==="Normal"?7:6;
  let resourceRate=0, allocation="100% radio time", detail="2 slots per 1 ms subframe";
  if(tech==="LTE FDD") resourceRate=symbolsPerSlot*2*1000;
  if(tech==="LTE TDD"){
    const pattern=tddPatterns[tddConfig],full=[...pattern].filter(x=>x===(direction==="Downlink"?"D":"U")).length,special=[...pattern].filter(x=>x==="S").length;
    const specialSymbols=specialNormal[specialConfig][direction==="Downlink"?0:1];
    const frameSymbols=full*symbolsPerSlot*2+special*specialSymbols;
    resourceRate=frameSymbols*100;allocation=`${full} full + ${special} special subframe${special===1?"":"s"}`;detail=`${frameSymbols} ${direction.toLowerCase()} OFDM symbols per 10 ms frame`;
  }
  if(tech==="5G NR") {resourceRate=14*1000*(scs/15)*(nrShare/100);allocation=`${nrShare}% ${direction.toLowerCase()} time allocation`;detail=`${(1000*scs/15).toLocaleString()} slots/s × 14 symbols`}
  const perCarrier=prbs*12*resourceRate*modulation/1e6;
  const gross=perCarrier*layers*carriers,net=gross*(1-overhead/100);
  const setPreset=(next:"LTE FDD"|"LTE TDD"|"5G NR")=>{setTech(next);setCp("Normal");setModulation(next==="5G NR"?8:6);setLayers(next==="5G NR"?4:2);setCarriers(1);setOverhead(next==="5G NR"?20:25);if(next==="5G NR"){setScs(30);setBandwidth(100)}else{setBandwidth(20)}};
  const speed=net>=1000?`${(net/1000).toFixed(3)} Gbps`:`${net.toFixed(2)} Mbps`;
  return <section className="advanced-budget speed-calculator">
    <div className="budget-top"><div className="mode-switch">{(["LTE FDD","LTE TDD","5G NR"] as const).map(x=><button className={tech===x?"active":""} onClick={()=>setPreset(x)} key={x}>{x}</button>)}</div><div className="mode-switch">{(["Downlink","Uplink"] as const).map(x=><button className={direction===x?"active":""} onClick={()=>setDirection(x)} key={x}>{x}</button>)}</div></div>
    <div className="budget-layout"><div className="budget-inputs">
      <fieldset><legend>1 · Radio resources</legend><div className="budget-fields">{tech==="5G NR"&&<NumberSelect label="Subcarrier spacing" value={scs} options={[15,30,60,120]} setValue={v=>{setScs(v);setBandwidth(Number(Object.keys(nrPrb[v])[0]))}} unit="kHz"/>}<NumberSelect label="Channel bandwidth" value={bandwidth} options={tech==="5G NR"?nrBandwidths:[1.4,3,5,10,15,20]} setValue={setBandwidth} unit="MHz"/><Field label="Standard PRBs" value={prbs} setValue={()=>{}} unit="PRB"/><NumberSelect label="Modulation order" value={modulation} options={[2,4,6,8]} setValue={setModulation} unit="bits/symbol"/></div></fieldset>
      <fieldset><legend>2 · Time allocation</legend><div className="budget-fields">{tech!=="5G NR"&&<ChoiceSelect label="Cyclic prefix" value={cp} options={["Normal","Extended"]} setValue={setCp}/>} {tech==="LTE TDD"&&<><NumberSelect label="TDD UL/DL config" value={tddConfig} options={[0,1,2,3,4,5,6]} setValue={setTddConfig}/><NumberSelect label="Special subframe config" value={specialConfig} options={[0,1,2,3,4,5,6,7,8]} setValue={setSpecialConfig}/></>}{tech==="5G NR"&&<Field label={`${direction} time allocation`} value={nrShare} setValue={setNrShare} unit="%"/>}</div></fieldset>
      <fieldset><legend>3 · Spatial & carrier scaling</legend><div className="budget-fields"><NumberSelect label="MIMO layers" value={layers} options={tech==="5G NR"?[1,2,4,8]:[1,2,4]} setValue={setLayers}/><NumberSelect label="Aggregated carriers" value={carriers} options={[1,2,3,4,5,6,7,8]} setValue={setCarriers}/><Field label="Control / reference overhead" value={overhead} setValue={setOverhead} unit="%"/></div></fieldset>
    </div><div className="budget-results"><span>{tech} · {direction.toUpperCase()}</span><strong className="speed-result">{speed.split(" ")[0]}</strong><b>{speed.split(" ")[1]}</b><div className="budget-meter"><i style={{width:`${Math.min(100,net/20)}%`}}/></div><div className="budget-row"><span>Resource blocks</span><b>{prbs} PRBs</b></div><div className="budget-row"><span>Time allocation</span><b>{allocation}</b></div><div className="budget-row"><span>Gross per carrier / layer</span><b>{perCarrier.toFixed(2)} Mbps</b></div><div className="budget-row"><span>After {layers} MIMO layer{layers>1?"s":""}</span><b>{(perCarrier*layers).toFixed(2)} Mbps</b></div><div className="budget-row"><span>After {carriers} carrier{carriers>1?"s":""}</span><b>{gross.toFixed(2)} Mbps</b></div><div className="budget-row"><span>Net after {overhead}% overhead</span><b>{speed}</b></div><small>{detail}. This is a theoretical PHY estimate; scheduler load, MCS limits, coding, retransmissions and device capability reduce user speed.</small></div></div>
    <div className="budget-equation"><b>Calculation chain</b><code>Speed = PRB × 12 subcarriers × symbols/s × modulation bits × MIMO layers × carriers × (1 − overhead)</code><p>{tech==="LTE TDD"?`TDD pattern ${tddConfig}: ${tddPatterns[tddConfig].split("").join(" ")} · Special config ${specialConfig}`:"Standard PRB tables are selected from bandwidth and numerology."}</p></div>
  </section>;
}

const gridLegend:Record<string,{label:string;short:string}>={pdsch:{label:"PDSCH · shared data",short:"D"},pdcch:{label:"PDCCH · control",short:"C"},crs:{label:"CRS · reference signal",short:"R"},pss:{label:"PSS · primary sync",short:"P"},sss:{label:"SSS · secondary sync",short:"S"},pbch:{label:"PBCH · broadcast",short:"B"},uplink:{label:"TDD uplink subframe",short:"U"},guard:{label:"Special-subframe guard",short:"G"},uppts:{label:"UpPTS",short:"U"}};

function LteResourceGrid(){
  const [duplex,setDuplex]=useState<"FDD"|"TDD">("FDD"),[bandwidth,setBandwidth]=useState(20),[cp,setCp]=useState("Normal");
  const [subframe,setSubframe]=useState(0),[ports,setPorts]=useState(2),[pci,setPci]=useState(0),[cfi,setCfi]=useState(2),[tddConfig,setTddConfig]=useState(1),[specialConfig,setSpecialConfig]=useState(7);
  const symbols=cp==="Normal"?14:12,rows=72,totalPrbs=ltePrb[bandwidth],pattern=tddPatterns[tddConfig],subframeType=duplex==="TDD"?pattern[subframe]:"D";
  const special=specialNormal[specialConfig],dwpts=Math.min(symbols,special[0]),uppts=Math.min(symbols-dwpts,special[1]),guardStart=dwpts,guardEnd=symbols-uppts;
  const typeFor=(k:number,s:number)=>{
    if(subframeType==="U") return "uplink";
    if(subframeType==="S"){if(s<dwpts)return "pdsch";if(s>=guardEnd)return "uppts";return "guard"}
    const center=k>=5&&k<=66;
    if((subframe===0||subframe===5)&&center&&s===(cp==="Normal"?6:5))return "pss";
    if((subframe===0||subframe===5)&&center&&s===(cp==="Normal"?5:4))return "sss";
    if(subframe===0&&k>=0&&k<72&&s>=symbols/2&&s<symbols/2+4)return "pbch";
    const crsSymbols=cp==="Normal"?[0,4,7,11]:[0,3,6,9];
    if(crsSymbols.includes(s)&&((k+(pci%6)+(ports>2&&s%2?3:0))%6===0))return "crs";
    if(s<cfi)return "pdcch";
    return "pdsch";
  };
  const counts:Record<string,number>={};for(let k=0;k<rows;k++)for(let s=0;s<symbols;s++){const t=typeFor(k,s);counts[t]=(counts[t]||0)+1}
  return <section className="lte-grid-tool">
    <div className="budget-top"><div className="mode-switch">{(["FDD","TDD"] as const).map(x=><button key={x} className={duplex===x?"active":""} onClick={()=>{setDuplex(x);if(x==="TDD")setCp("Normal")}}>{x}</button>)}</div><div className="grid-subframe-picker"><span>Subframe</span>{Array.from({length:10},(_,i)=><button className={subframe===i?"active":""} onClick={()=>setSubframe(i)} key={i}>{i}</button>)}</div></div>
    <div className="grid-controls"><NumberSelect label="Channel bandwidth" value={bandwidth} options={[1.4,3,5,10,15,20]} setValue={setBandwidth} unit="MHz"/><ChoiceSelect label="Cyclic prefix" value={cp} options={duplex==="TDD"?["Normal"]:["Normal","Extended"]} setValue={setCp}/><NumberSelect label="Antenna ports" value={ports} options={[1,2,4]} setValue={setPorts}/><Field label="Physical cell ID" value={pci} setValue={v=>setPci(Math.max(0,Math.min(503,Math.round(v))))}/><NumberSelect label="Control format indicator" value={cfi} options={[1,2,3]} setValue={setCfi}/>{duplex==="TDD"&&<><NumberSelect label="TDD UL/DL config" value={tddConfig} options={[0,1,2,3,4,5,6]} setValue={setTddConfig}/><NumberSelect label="Special subframe config" value={specialConfig} options={[0,1,2,3,4,5,6,7,8]} setValue={setSpecialConfig}/></>}</div>
    {duplex==="TDD"&&<section className="tdd-frame-panel"><div className="tdd-frame-head"><div><span>10 ms RADIO FRAME</span><b>UL/DL configuration {tddConfig}</b></div><div><span>D</span> Downlink <span>S</span> Special <span>U</span> Uplink</div></div><div className="tdd-frame-strip">{[...pattern].map((type,i)=><button key={i} className={`tdd-${type.toLowerCase()} ${subframe===i?"active":""}`} onClick={()=>setSubframe(i)}><small>SF {i}</small><b>{type}</b><span>{type==="D"?"DL":type==="U"?"UL":"Dw/GP/Up"}</span></button>)}</div><div className="tdd-details"><div><span>Downlink subframes</span><b>{[...pattern].filter(x=>x==="D").length}</b></div><div><span>Uplink subframes</span><b>{[...pattern].filter(x=>x==="U").length}</b></div><div><span>Special subframes</span><b>{[...pattern].filter(x=>x==="S").length}</b></div><div className="special-structure"><span>Special configuration {specialConfig}</span><div><i className="dwpts" style={{flex:dwpts}}>DwPTS · {dwpts}</i><i className="gp" style={{flex:Math.max(1,guardEnd-guardStart)}}>GP · {guardEnd-guardStart}</i><i className="uppts" style={{flex:uppts}}>UpPTS · {uppts}</i></div><small>Values are OFDM symbols for normal cyclic prefix.</small></div></div></section>}
    <div className="grid-summary"><div><b>{totalPrbs}</b><span>PRBs in full carrier</span></div><div><b>{symbols}</b><span>symbols / subframe</span></div><div><b>{subframeType==="D"?"Downlink":subframeType==="U"?"Uplink":"Special"}</b><span>selected subframe type</span></div><p>Detailed view: central 6 PRBs around the LTE carrier centre. Each square is one resource element (1 subcarrier × 1 OFDM symbol).</p></div>
    <div className="resource-grid-wrap"><div className="axis-title y">Frequency · 72 subcarriers</div><div className="resource-grid" style={{gridTemplateColumns:`repeat(${symbols},minmax(12px,1fr))`}}>{Array.from({length:rows},(_,ri)=>{const k=rows-1-ri;return Array.from({length:symbols},(_,s)=>{const type=typeFor(k,s);return <i className={`re re-${type}`} title={`Subcarrier ${k-36}, symbol ${s}: ${gridLegend[type]?.label}`} key={`${k}-${s}`}>{rows<=72&&gridLegend[type]?.short}</i>})})}</div><div className="symbol-axis" style={{gridTemplateColumns:`repeat(${symbols},1fr)`}}>{Array.from({length:symbols},(_,s)=><b key={s}>{s}</b>)}</div><div className="axis-title x">Time · OFDM symbol</div></div>
    <div className="grid-legend">{Object.entries(gridLegend).filter(([id])=>counts[id]).map(([id,item])=><div key={id}><i className={`re-${id}`}/><span>{item.label}</span><b>{counts[id]} RE</b></div>)}</div>
    <div className="budget-equation"><b>Resource-grid structure</b><code>1 PRB = 12 consecutive subcarriers × one 0.5 ms slot · Δf = 15 kHz</code><p>Signal placement is an engineering visualization of the selected subframe. Exact control and reference mapping also depends on PHICH, CCE aggregation, scheduling, MBSFN and antenna-port-specific rules.</p></div>
  </section>;
}

const nrGridLegend:Record<string,{label:string;short:string}>={pdsch:{label:"PDSCH · shared data",short:"D"},pdcch:{label:"PDCCH / CORESET",short:"C"},dmrs:{label:"PDSCH DM-RS",short:"R"},pss:{label:"PSS · primary sync",short:"P"},sss:{label:"SSS · secondary sync",short:"S"},pbch:{label:"PBCH · broadcast",short:"B"},uplink:{label:"Uplink symbol",short:"U"},guard:{label:"Flexible / guard symbol",short:"G"}};

function NrResourceGrid(){
  const [duplex,setDuplex]=useState<"FDD"|"TDD">("FDD"),[scs,setScs]=useState(30),[bandwidth,setBandwidth]=useState(100),[slot,setSlot]=useState(0),[slotType,setSlotType]=useState("Downlink");
  const [periodMs,setPeriodMs]=useState(5),[dlSlots,setDlSlots]=useState(6),[dlSymbols,setDlSymbols]=useState(10),[guardSymbols,setGuardSymbols]=useState(2),[coreset,setCoreset]=useState(2),[dmrsPosition,setDmrsPosition]=useState(2),[dmrsAdditional,setDmrsAdditional]=useState(1),[ssb,setSsb]=useState("Present"),[pci,setPci]=useState(0);
  const symbols=14,rows=72,prbs=nrPrb[scs]?.[bandwidth]??0,slotsPerFrame=10*(scs/15),bandwidths=Object.keys(nrPrb[scs]).map(Number);
  const validPeriods=[.5,.625,1,1.25,2,2.5,5,10].filter(p=>Number.isInteger(p*scs/15));
  const periodSlots=Math.max(2,Math.round(periodMs*scs/15)),safeDlSlots=Math.min(dlSlots,periodSlots-2),periodIndex=slot%periodSlots;
  const effectiveType=duplex==="FDD"?slotType:periodIndex<safeDlSlots?"Downlink":periodIndex===safeDlSlots?"Mixed":"Uplink";
  const ulSymbols=Math.max(0,14-dlSymbols-guardSymbols);
  const dmrsSymbols=[dmrsPosition,...Array.from({length:dmrsAdditional},(_,i)=>Math.min(13,dmrsPosition+3*(i+1)))];
  const typeFor=(k:number,s:number)=>{
    if(effectiveType==="Uplink")return "uplink";
    if(effectiveType==="Mixed"&&s>=dlSymbols)return s<dlSymbols+guardSymbols?"guard":"uplink";
    const center=k>=5&&k<=66,ssbStart=4;
    if(ssb==="Present"&&center&&s>=ssbStart&&s<ssbStart+4){if(s===ssbStart+1)return "pss";if(s===ssbStart+2)return "sss";return "pbch"}
    if(s<coreset)return "pdcch";
    if(dmrsSymbols.includes(s)&&((k+pci)%2===0))return "dmrs";
    return "pdsch";
  };
  const counts:Record<string,number>={};for(let k=0;k<rows;k++)for(let s=0;s<symbols;s++){const t=typeFor(k,s);counts[t]=(counts[t]||0)+1}
  return <section className="lte-grid-tool nr-grid-tool">
    <div className="budget-top"><div className="nr-top-left"><div className="mode-switch">{(["FDD","TDD"] as const).map(x=><button key={x} className={duplex===x?"active":""} onClick={()=>setDuplex(x)}>{x}</button>)}</div><div><span className="grid-tech-label">5G NR · NORMAL CP</span><b>{scs} kHz numerology</b></div></div><div className="grid-slot-picker"><button onClick={()=>setSlot(Math.max(0,slot-1))}>−</button><span>Slot <b>{slot}</b> / {slotsPerFrame-1}</span><button onClick={()=>setSlot(Math.min(slotsPerFrame-1,slot+1))}>+</button></div></div>
    <div className="grid-controls"><NumberSelect label="Subcarrier spacing" value={scs} options={[15,30,60,120]} setValue={v=>{setScs(v);setBandwidth(Number(Object.keys(nrPrb[v])[0]));setSlot(0);setPeriodMs(v===15?5:2.5)}} unit="kHz"/><NumberSelect label="Channel bandwidth" value={bandwidth} options={bandwidths} setValue={setBandwidth} unit="MHz"/>{duplex==="FDD"&&<ChoiceSelect label="Slot direction" value={slotType} options={["Downlink","Uplink"]} setValue={setSlotType}/>}<NumberSelect label="CORESET duration" value={coreset} options={[1,2,3]} setValue={setCoreset} unit="symbols"/><NumberSelect label="DM-RS type-A position" value={dmrsPosition} options={[2,3]} setValue={setDmrsPosition}/><NumberSelect label="Additional DM-RS positions" value={dmrsAdditional} options={[0,1,2,3]} setValue={setDmrsAdditional}/><ChoiceSelect label="SS/PBCH block" value={ssb} options={["Present","Not present"]} setValue={setSsb}/><Field label="Physical cell ID" value={pci} setValue={v=>setPci(Math.max(0,Math.min(1007,Math.round(v))))}/></div>
    {duplex==="TDD"&&<section className="tdd-frame-panel nr-tdd-panel"><div className="tdd-frame-head"><div><span>TDD PATTERN PERIODICITY</span><b>{periodMs} ms · {periodSlots} slots</b></div><div><span>D</span> Downlink <span>M</span> Mixed <span>U</span> Uplink</div></div><div className="nr-tdd-controls"><NumberSelect label="Periodicity" value={periodMs} options={validPeriods} setValue={v=>{setPeriodMs(v);setSlot(0);setDlSlots(Math.max(1,Math.min(6,Math.round(v*scs/15)-2)))}} unit="ms"/><NumberSelect label="Full downlink slots" value={safeDlSlots} options={Array.from({length:Math.max(1,periodSlots-1)},(_,i)=>i+1)} setValue={setDlSlots}/><NumberSelect label="Mixed-slot DL symbols" value={dlSymbols} options={[2,4,6,7,8,10,11,12]} setValue={v=>{setDlSymbols(v);if(v+guardSymbols>14)setGuardSymbols(1)}}/><NumberSelect label="Mixed-slot guard symbols" value={guardSymbols} options={[1,2,3,4].filter(v=>v+dlSymbols<=14)} setValue={setGuardSymbols}/></div><div className="nr-tdd-strip" style={{gridTemplateColumns:`repeat(${periodSlots},minmax(42px,1fr))`}}>{Array.from({length:periodSlots},(_,i)=>{const type=i<safeDlSlots?"D":i===safeDlSlots?"M":"U";return <button key={i} className={`tdd-${type.toLowerCase()} ${periodIndex===i?"active":""}`} onClick={()=>setSlot(Math.min(slotsPerFrame-1,i))}><small>Slot {i}</small><b>{type}</b><span>{type==="M"?`${dlSymbols}D/${guardSymbols}G/${ulSymbols}U`:type==="D"?"DL":"UL"}</span></button>})}</div><div className="tdd-details"><div><span>Full DL slots</span><b>{safeDlSlots}</b></div><div><span>Full UL slots</span><b>{Math.max(0,periodSlots-safeDlSlots-1)}</b></div><div><span>Mixed slot</span><b>{dlSymbols}D · {guardSymbols}G · {ulSymbols}U</b></div><div className="special-structure"><span>Mixed-slot symbol structure</span><div><i className="dwpts" style={{flex:dlSymbols}}>DL · {dlSymbols}</i><i className="gp" style={{flex:guardSymbols}}>Flexible · {guardSymbols}</i><i className="uppts" style={{flex:Math.max(1,ulSymbols)}}>UL · {ulSymbols}</i></div><small>One pattern repeats according to the selected periodicity.</small></div></div></section>}
    <div className="grid-summary"><div><b>{prbs}</b><span>PRBs in full carrier</span></div><div><b>{slotsPerFrame}</b><span>slots / 10 ms frame</span></div><div><b>{duplex==="TDD"?effectiveType:slotType}</b><span>selected slot type</span></div><p>Detailed view: central 6 PRBs of slot {slot}. Each square represents one resource element; the complete carrier contains {prbs} PRBs.</p></div>
    <div className="resource-grid-wrap"><div className="axis-title y">Frequency · 72 subcarriers</div><div className="resource-grid" style={{gridTemplateColumns:"repeat(14,minmax(12px,1fr))"}}>{Array.from({length:rows},(_,ri)=>{const k=rows-1-ri;return Array.from({length:symbols},(_,s)=>{const type=typeFor(k,s);return <i className={`re re-${type}`} title={`Subcarrier ${k-36}, symbol ${s}: ${nrGridLegend[type]?.label}`} key={`${k}-${s}`}>{nrGridLegend[type]?.short}</i>})})}</div><div className="symbol-axis" style={{gridTemplateColumns:"repeat(14,1fr)"}}>{Array.from({length:14},(_,s)=><b key={s}>{s}</b>)}</div><div className="axis-title x">Time · OFDM symbol within slot</div></div>
    <div className="grid-legend">{Object.entries(nrGridLegend).filter(([id])=>counts[id]).map(([id,item])=><div key={id}><i className={`re-${id}`}/><span>{item.label}</span><b>{counts[id]} RE</b></div>)}</div>
    <div className="budget-equation"><b>NR resource-grid structure</b><code>1 PRB = 12 subcarriers · 1 slot = 14 OFDM symbols · slots/frame = 10 × 2ᵘ</code><p>μ = log₂(SCS ÷ 15 kHz). This planning view illustrates channel regions; exact CORESET, search-space, SS/PBCH, DM-RS and PDSCH mapping depends on the configured BWP and higher-layer parameters.</p></div>
  </section>;
}

const ipSlugs=["ipv4-subnet","ipv6-subnet","vlsm-planner","cidr-tools","ip-analyzer","ip-range","wildcard-mask","ip-converter","ipv6-format","mtu-mss","dhcp-planner","network-overlap"];
function parseIpv4(value:string){const p=value.trim().split(".").map(Number);return p.length===4&&p.every(x=>Number.isInteger(x)&&x>=0&&x<=255)?p.reduce((n,x)=>n*256+x,0):null}
function formatIpv4(n:number){const x=Math.max(0,Math.min(4294967295,Math.floor(n)));return [Math.floor(x/16777216)%256,Math.floor(x/65536)%256,Math.floor(x/256)%256,x%256].join(".")}
function maskNum(prefix:number){return prefix<=0?0:4294967296-Math.pow(2,32-prefix)}
function ipv4Net(ip:number,prefix:number){const size=Math.pow(2,32-prefix);return Math.floor(ip/size)*size}
function parseIpv6(value:string){try{const text=value.trim().toLowerCase(),parts=text.split("::");if(parts.length>2)return null;const left=parts[0]?parts[0].split(":"):[],right=parts[1]?parts[1].split(":"):[];if(parts.length===1&&left.length!==8)return null;const fill=8-left.length-right.length;if(fill<0)return null;const groups=[...left,...Array(fill).fill("0"),...right];if(groups.length!==8||groups.some(x=>!/^[0-9a-f]{1,4}$/.test(x)))return null;return groups.map(x=>parseInt(x,16))}catch{return null}}
function expandIpv6(g:number[]){return g.map(x=>x.toString(16).padStart(4,"0")).join(":")}
function compressIpv6(g:number[]){const s=g.map(x=>x.toString(16));let bestStart=-1,bestLen=0,start=-1;for(let i=0;i<=8;i++){if(i<8&&g[i]===0){if(start<0)start=i}else if(start>=0){if(i-start>bestLen){bestStart=start;bestLen=i-start}start=-1}}if(bestLen<2)return s.join(":");return `${s.slice(0,bestStart).join(":")}::${s.slice(bestStart+bestLen).join(":")}`.replace(/^:::/,"::").replace(/:::$/,"::")}
function groupsToBig(g:number[]){return g.reduce((n,x)=>(n<<16n)+BigInt(x),0n)}
function bigToGroups(n:bigint){return Array.from({length:8},(_,i)=>Number((n>>BigInt((7-i)*16))&65535n))}
function classifyIpv4(n:number){if(Math.floor(n/16777216)===10||n>=2886729728&&n<=2887778303||n>=3232235520&&n<=3232301055)return "Private (RFC 1918)";if(n>=1681915904&&n<=1686110207)return "Shared CGNAT";if(n>=2130706432&&n<=2147483647)return "Loopback";if(n>=2851995648&&n<=2852061183)return "Link-local";if(n>=3758096384&&n<=4026531839)return "Multicast";if(n===0||n===4294967295)return "Special / reserved";return "Public unicast"}

function IpEngineeringTool({slug}:{slug:string}){
  const defaults:Record<string,[string,string,string,string,string]>={"ipv4-subnet":["192.168.10.34","24","","",""],"ipv6-subnet":["2001:db8:1234::1","64","","",""],"vlsm-planner":["10.0.0.0","24","50, 30, 12, 2","",""],"cidr-tools":["192.168.0.0","24","26","",""],"ip-analyzer":["192.168.1.10","","","",""],"ip-range":["192.168.1.10","192.168.1.50","","",""],"wildcard-mask":["192.168.10.0","24","","",""],"ip-converter":["192.168.1.10","","","",""],"ipv6-format":["2001:db8::8:800:200c:417a","","","",""],"mtu-mss":["1500","TCP over IPv4","","",""],"dhcp-planner":["192.168.50.0","24","192.168.50.1","20",""],"network-overlap":["10.0.0.0/24\n10.0.0.128/25\n10.0.1.0/24","","","",""]};
  const initial=defaults[slug]??defaults["ipv4-subnet"],[x,setX]=useState(initial[0]),[y,setY]=useState(initial[1]),[z,setZ]=useState(initial[2]),[w,setW]=useState(initial[3]);const title="Result";let main="—",formula="",error="",rows:[string,string][]=[];
  const prefix=Math.max(0,Math.min(32,Number(y)||0)),ip=parseIpv4(x);
  if(slug==="ipv4-subnet"||slug==="wildcard-mask"||slug==="dhcp-planner"){if(ip===null)error="Enter a valid IPv4 address.";else{const net=ipv4Net(ip,prefix),size=Math.pow(2,32-prefix),broadcast=net+size-1,mask=maskNum(prefix),usable=prefix===31?2:prefix===32?1:Math.max(0,size-2);main=`${formatIpv4(net)}/${prefix}`;formula="network = IP AND subnet mask";rows=[["Subnet mask",formatIpv4(mask)],["Wildcard mask",formatIpv4(4294967295-mask)],["Broadcast",formatIpv4(broadcast)],["Usable range",prefix>=31?`${formatIpv4(net)} – ${formatIpv4(broadcast)}`:`${formatIpv4(net+1)} – ${formatIpv4(broadcast-1)}`],["Usable addresses",usable.toLocaleString()]];if(slug==="dhcp-planner"){const excluded=Math.max(0,Number(w)||0),gateway=parseIpv4(z);const first=net+1+excluded,last=broadcast-1;main=`${Math.max(0,last-first+1).toLocaleString()} leases`;formula="pool = usable hosts − excluded addresses";rows=[["Network",`${formatIpv4(net)}/${prefix}`],["Gateway",gateway===null?"Invalid":formatIpv4(gateway)],["Dynamic pool",`${formatIpv4(Math.min(first,last))} – ${formatIpv4(last)}`],["Excluded/static",String(excluded)],["Broadcast",formatIpv4(broadcast)]]}}}
  if(slug==="ipv6-subnet"||slug==="ipv6-format"){const g=parseIpv6(x);if(!g)error="Enter a valid IPv6 address.";else{const p=slug==="ipv6-subnet"?Math.max(0,Math.min(128,Number(y)||0)):128,big=groupsToBig(g),hostBits=128n-BigInt(p),network=(big>>hostBits)<<hostBits,last=network+(1n<<hostBits)-1n;main=slug==="ipv6-format"?compressIpv6(g):`${compressIpv6(bigToGroups(network))}/${p}`;formula=slug==="ipv6-format"?"canonical form = longest zero run compressed with ::":"prefix = address AND /prefix mask";rows=[["Expanded",expandIpv6(g)],["Compressed",compressIpv6(g)],...[...(slug==="ipv6-subnet"?[["First address",compressIpv6(bigToGroups(network))],["Last address",compressIpv6(bigToGroups(last))],["Addresses",`2^${128-p}`]]:[]) as [string,string][]]]}}
  if(slug==="ip-analyzer"){const v4=parseIpv4(x),v6=parseIpv6(x);if(v4!==null){main="IPv4";formula="classification = longest matching special-use prefix";rows=[["Classification",classifyIpv4(v4)],["Integer",String(v4)],["Binary",v4.toString(2).padStart(32,"0").match(/.{8}/g)?.join(".")??""]]}else if(v6){const first=v6[0];main="IPv6";formula="type = high-order prefix bits";rows=[["Classification",x==="::1"?"Loopback":first>=0xfe80&&first<=0xfebf?"Link-local":first>=0xff00?"Multicast":first>=0xfc00&&first<=0xfdff?"Unique local":"Global / documentation"],["Expanded",expandIpv6(v6)],["Compressed",compressIpv6(v6)]]}else error="Enter a valid IPv4 or IPv6 address."}
  if(slug==="ip-converter"){if(ip===null)error="Enter a valid IPv4 address.";else{main=String(ip);formula="integer = a·256³ + b·256² + c·256 + d";rows=[["Dotted decimal",formatIpv4(ip)],["32-bit binary",ip.toString(2).padStart(32,"0").match(/.{8}/g)?.join(" ")??""],["Hexadecimal",`0x${ip.toString(16).padStart(8,"0").toUpperCase()}`]]}}
  if(slug==="ip-range"){const end=parseIpv4(y);if(ip===null||end===null||end<ip)error="Enter a valid ascending IPv4 range.";else{let cur=ip;const blocks:string[]=[];while(cur<=end&&blocks.length<64){let size=1;while(cur%(size*2)===0&&size*2<=end-cur+1)size*=2;while(size>end-cur+1)size/=2;blocks.push(`${formatIpv4(cur)}/${32-Math.log2(size)}`);cur+=size}main=`${blocks.length} CIDR block${blocks.length===1?"":"s"}`;formula="choose the largest aligned power-of-two block at each step";rows=blocks.map((v,i)=>[`Block ${i+1}`,v])}}
  if(slug==="vlsm-planner"){if(ip===null)error="Enter a valid parent IPv4 network.";else{const parent=ipv4Net(ip,prefix),end=parent+Math.pow(2,32-prefix)-1,needs=z.split(/[ ,\n]+/).map(Number).filter(n=>n>0).sort((a,b)=>b-a);let cur=parent;const allocated:[string,string][]=[];for(const hosts of needs){const p=Math.max(prefix,32-Math.ceil(Math.log2(hosts+2))),size=Math.pow(2,32-p);cur=Math.ceil(cur/size)*size;if(cur+size-1>end){allocated.push([`${hosts} hosts`,"Does not fit"]);continue}allocated.push([`${hosts} hosts`,`${formatIpv4(cur)}/${p} · ${size-2} usable`]);cur+=size}main=`${allocated.filter(r=>!r[1].includes("not")).length}/${needs.length} allocated`;formula="allocate largest host requirement first using power-of-two blocks";rows=allocated}}
  if(slug==="cidr-tools"){if(ip===null)error="Enter a valid IPv4 network.";else{const target=Math.max(prefix,Math.min(32,Number(z)||prefix)),count=Math.pow(2,target-prefix),size=Math.pow(2,32-target),net=ipv4Net(ip,prefix);main=`${count.toLocaleString()} × /${target}`;formula="subnet count = 2^(new prefix − old prefix)";rows=Array.from({length:Math.min(count,32)},(_,i)=>[`Subnet ${i+1}`,`${formatIpv4(net+i*size)}/${target}`]);if(count>32)rows.push(["Display",`First 32 of ${count}`])}}
  if(slug==="mtu-mss"){const mtu=Math.max(68,Number(x)||1500),overheads:Record<string,number>={"TCP over IPv4":40,"TCP over IPv6":60,"IPv4 + GRE + TCP":64,"IPv4 + IPsec ESP + TCP":96,"IPv6 + GRE + TCP":84,"VXLAN over IPv4 + TCP":90};const overhead=overheads[y]??40,mss=mtu-overhead;main=`${mss} bytes`;formula="MSS = path MTU − IP/TCP/tunnel headers";rows=[["Path MTU",`${mtu} bytes`],["Estimated headers",`${overhead} bytes`],["Payload efficiency",`${(100*mss/mtu).toFixed(1)}%`],["Encapsulation",y]]}
  if(slug==="network-overlap"){const nets=x.split(/\n+/).map(v=>{const [addr,p]=v.trim().split("/");const n=parseIpv4(addr),pr=Number(p);return n===null||pr<0||pr>32?null:{text:v.trim(),lo:ipv4Net(n,pr),hi:ipv4Net(n,pr)+Math.pow(2,32-pr)-1}}).filter(Boolean) as {text:string;lo:number;hi:number}[];const hits:[string,string][]=[];for(let i=0;i<nets.length;i++)for(let j=i+1;j<nets.length;j++)if(nets[i].lo<=nets[j].hi&&nets[j].lo<=nets[i].hi)hits.push([nets[i].text,nets[j].text]);main=`${hits.length} overlap${hits.length===1?"":"s"}`;formula="overlap when Astart ≤ Bend and Bstart ≤ Aend";rows=hits.length?hits.map((h,i)=>[`Conflict ${i+1}`,`${h[0]} ↔ ${h[1]}`]):[["Result","No overlaps found"]]}
  const inputs=slug==="ipv4-subnet"||slug==="wildcard-mask"?<><TextField label="IPv4 address" value={x} setValue={setX}/><NumberSelect label="CIDR prefix" value={prefix} options={Array.from({length:33},(_,i)=>i)} setValue={v=>setY(String(v))} unit="bits"/></>:slug==="ipv6-subnet"?<><TextField label="IPv6 address" value={x} setValue={setX}/><NumberSelect label="Prefix length" value={Number(y)} options={Array.from({length:129},(_,i)=>i)} setValue={v=>setY(String(v))} unit="bits"/></>:slug==="vlsm-planner"?<><TextField label="Parent IPv4 network" value={x} setValue={setX}/><NumberSelect label="Parent prefix" value={prefix} options={Array.from({length:33},(_,i)=>i)} setValue={v=>setY(String(v))}/><TextAreaField label="Required hosts per subnet" value={z} setValue={setZ} placeholder="50, 30, 12, 2"/></>:slug==="cidr-tools"?<><TextField label="Parent IPv4 network" value={x} setValue={setX}/><NumberSelect label="Current prefix" value={prefix} options={Array.from({length:33},(_,i)=>i)} setValue={v=>setY(String(v))}/><NumberSelect label="New prefix" value={Number(z)} options={Array.from({length:33-prefix},(_,i)=>prefix+i)} setValue={v=>setZ(String(v))}/></>:slug==="ip-range"?<><TextField label="Start address" value={x} setValue={setX}/><TextField label="End address" value={y} setValue={setY}/></>:slug==="mtu-mss"?<><TextField label="Path MTU (bytes)" value={x} setValue={setX}/><ChoiceSelect label="Protocol / encapsulation" value={y} options={["TCP over IPv4","TCP over IPv6","IPv4 + GRE + TCP","IPv4 + IPsec ESP + TCP","IPv6 + GRE + TCP","VXLAN over IPv4 + TCP"]} setValue={setY}/></>:slug==="dhcp-planner"?<><TextField label="IPv4 network" value={x} setValue={setX}/><NumberSelect label="Prefix" value={prefix} options={Array.from({length:23},(_,i)=>i+8)} setValue={v=>setY(String(v))}/><TextField label="Gateway" value={z} setValue={setZ}/><TextField label="Excluded addresses from start" value={w} setValue={setW}/></>:slug==="network-overlap"?<TextAreaField label="IPv4 CIDR networks" value={x} setValue={setX} placeholder="One network per line"/>:<TextField label={slug==="ipv6-format"?"IPv6 address":"IP address"} value={x} setValue={setX}/>;
  return <section className="ip-engineering"><div className="ip-layout"><div className="ip-inputs"><span className="eyebrow">NETWORK INPUTS</span><div className="budget-fields">{inputs}</div>{error&&<div className="ip-error">{error}</div>}</div><div className="ip-primary"><span>{title}</span><strong>{error?"Invalid":main}</strong><small>{formula}</small></div></div>{!error&&<div className="ip-results">{rows.map(([k,v])=><div key={`${k}-${v}`}><span>{k}</span><code>{v}</code></div>)}</div>}<div className="ip-bit-visual"><span>NETWORK PREFIX</span><div>{Array.from({length:32},(_,i)=><i className={i<prefix?"network":"host"} key={i}/>)}</div><b>network bits</b><b>host bits</b></div></section>;
}

const antennaSlugs=["antenna-coverage","radiation-pattern","array-beamforming","gain-aperture","dish-design","near-far-field","polarization-loss","mimo-spacing","pim-finder","feeder-loss"];
function AntennaEngineeringTool({slug}:{slug:string}){
  const [a,setA]=useState(slug==="dish-design"?18000:slug==="pim-finder"?1805:slug==="feeder-loss"?1800:3500);
  const [b,setB]=useState(slug==="antenna-coverage"?30:slug==="radiation-pattern"?17:slug==="array-beamforming"?8:slug==="gain-aperture"?17:slug==="dish-design"?.6:slug==="near-far-field"?1:slug==="polarization-loss"?30:slug==="mimo-spacing"?2:slug==="pim-finder"?1840:50);
  const [c,setC]=useState(slug==="antenna-coverage"?1.5:slug==="radiation-pattern"?65:slug==="array-beamforming"?8:slug==="gain-aperture"?65:slug==="dish-design"?60:slug==="polarization-loss"?30:slug==="pim-finder"?1710:3.4);
  const [d,setD]=useState(slug==="antenna-coverage"?6:slug==="radiation-pattern"?7:slug==="array-beamforming"?.5:slug==="dish-design"?.4:slug==="pim-finder"?1785:2);
  const [e,setE]=useState(slug==="antenna-coverage"?6:slug==="radiation-pattern"?25:slug==="array-beamforming"?0:slug==="feeder-loss"?.1:0);
  const [choice,setChoice]=useState(slug==="polarization-loss"?"Linear ↔ Linear":slug==="mimo-spacing"?"Urban macro":"Horizontal plane");
  const lambda=299.792458/Math.max(a,.001);let main="",unit="",note="",formula="",rows:[string,string][]=[];let warning="";
  if(slug==="antenna-coverage") {const h=Math.max(0,b-c),dist=(ang:number)=>ang<=0?Infinity:h/Math.tan(ang*Math.PI/180)/1000,center=dist(d),near=dist(d+e/2),far=dist(d-e/2);main=center.toFixed(3);unit="km";note="Boresight ground intersection";formula="D = (hBS − hUE) ÷ tan(θ)";rows=[["Near beam edge",`${near.toFixed(3)} km`],["Far beam edge",Number.isFinite(far)?`${far.toFixed(3)} km`:"Horizon / skyward"],["Approx. footprint",Number.isFinite(far)?`${Math.max(0,far-near).toFixed(3)} km`:"Unbounded"]]}
  if(slug==="radiation-pattern") {const az=choice==="Horizontal plane"?e:0,el=choice==="Vertical plane"?e:0,att=Math.min(25,12*(az/c)**2+12*(el/d)**2),g=b-att;main=g.toFixed(2);unit="dBi";note=`Gain at ${e}° in the ${choice.toLowerCase()}`;formula="G(φ,θ) = Gmax − min[12(φ/φ3dB)² + 12(θ/θ3dB)², Am]";rows=[["Pattern attenuation",`${att.toFixed(2)} dB`],["Peak gain",`${b} dBi`],["Front-to-back cap",`${25} dB`]]}
  if(slug==="array-beamforming") {const n=Math.max(1,Math.round(b*c)),gain=10*Math.log10(n),h=50.8/(Math.max(1,c)*d),v=50.8/(Math.max(1,b)*d),limit=1/(1+Math.abs(Math.sin(e*Math.PI/180)));main=gain.toFixed(2);unit="dB";note=`Ideal coherent gain from ${b} × ${c} elements`;formula="Garray = 10 log₁₀(N)";rows=[["Horizontal HPBW",`${h.toFixed(2)}°`],["Vertical HPBW",`${v.toFixed(2)}°`],["Element spacing",`${(d*lambda).toFixed(4)} m`]];if(d>limit)warning="Grating-lobe risk at the selected steering angle."}
  if(slug==="gain-aperture") {const gain=Math.pow(10,b/10),ae=gain*lambda*lambda/(4*Math.PI),physical=ae/(c/100);main=ae.toFixed(4);unit="m²";note="Effective antenna aperture";formula="Ae = Gλ² ÷ 4π";rows=[["Wavelength",`${lambda.toFixed(4)} m`],["Linear gain",gain.toFixed(2)],["Physical aperture",`${physical.toFixed(4)} m²`]]}
  if(slug==="dish-design") {const eta=c/100,gainLin=eta*Math.pow(Math.PI*b/lambda,2),gain=10*Math.log10(gainLin),beam=70*lambda/b;main=gain.toFixed(2);unit="dBi";note="Estimated parabolic-reflector gain";formula="G = η(πD/λ)²";rows=[["3 dB beamwidth",`${beam.toFixed(2)}°`],["Effective aperture",`${(eta*Math.PI*b*b/4).toFixed(4)} m²`],["Focal length",`${(d*b).toFixed(3)} m`]]}
  if(slug==="near-far-field") {const reactive=.62*Math.sqrt(Math.pow(b,3)/lambda),fraunhofer=2*b*b/lambda;main=fraunhofer.toFixed(2);unit="m";note="Fraunhofer far-field boundary";formula="Rfar = 2D² ÷ λ";rows=[["Reactive near field",`0 – ${reactive.toFixed(2)} m`],["Radiating near field",`${reactive.toFixed(2)} – ${fraunhofer.toFixed(2)} m`],["Wavelength",`${lambda.toFixed(4)} m`]]}
  if(slug==="polarization-loss") {let loss=0;if(choice==="Linear ↔ Linear")loss=-20*Math.log10(Math.max(.0001,Math.abs(Math.cos(b*Math.PI/180))));if(choice==="Linear ↔ Circular")loss=3.01;if(choice==="Circular co-polar")loss=0;if(choice==="Circular cross-polar")loss=c;main=loss.toFixed(2);unit="dB";note="Polarization mismatch loss";formula="Lpol = −20 log₁₀|cos ψ|";rows=[["Polarization pair",choice],["Mismatch angle",`${b}°`],["Assumed XPD",`${c} dB`]]}
  if(slug==="mimo-spacing") {const factor=choice==="Indoor / rich scatter"?.5:choice==="Urban macro"?2:10,spacing=factor*lambda;main=spacing.toFixed(3);unit="m";note=`Planning separation for ${choice.toLowerCase()}`;formula="Srecommended = k × λ";rows=[["Wavelength",`${lambda.toFixed(4)} m`],["Environment factor",`${factor} λ`],["User override",`${b} λ = ${(b*lambda).toFixed(3)} m`]]}
  if(slug==="pim-finder") {const hits:{f:number,o:number,expr:string}[]=[];for(const order of [3,5,7])for(let m=1;m<order;m++){const n=order-m;for(const sign of [-1,1]){const f=Math.abs(m*a+sign*n*b);if(f>=c&&f<=d)hits.push({f,o:order,expr:`${m}f₁ ${sign>0?"+":"−"} ${n}f₂`})}}main=String(hits.length);unit="hits";note=`Products inside ${c}–${d} MHz`;formula="fPIM = |m·f₁ ± n·f₂|, m+n = odd order";rows=(hits.slice(0,6).map(x=>[`${x.o}th · ${x.expr}`,`${x.f.toFixed(3)} MHz`]) as [string,string][]);if(!hits.length)rows=[["Result","No 3rd, 5th or 7th-order hit"]]}
  if(slug==="feeder-loss") {const mainCable=b*c/100,connectors=d*e,jumper=5*6/100,total=mainCable+connectors+jumper;main=total.toFixed(2);unit="dB";note="Estimated tower-line insertion loss";formula="Ltotal = Lcable(f) × length + ΣLconnector + Ljumper";rows=[["Main cable",`${mainCable.toFixed(2)} dB`],["Connectors",`${connectors.toFixed(2)} dB`],["5 m jumper allowance",`${jumper.toFixed(2)} dB`],["Power delivered",`${(100*Math.pow(10,-total/10)).toFixed(1)}%`]]}
  const inputs=slug==="antenna-coverage"?<><Field label="Base antenna height" value={b} setValue={setB} unit="m"/><Field label="UE / target height" value={c} setValue={setC} unit="m"/><Field label="Total downtilt" value={d} setValue={setD} unit="°"/><Field label="Vertical beamwidth" value={e} setValue={setE} unit="°"/></>:slug==="radiation-pattern"?<><Field label="Peak gain" value={b} setValue={setB} unit="dBi"/><Field label="Horizontal beamwidth" value={c} setValue={setC} unit="°"/><Field label="Vertical beamwidth" value={d} setValue={setD} unit="°"/><Field label="Off-axis angle" value={e} setValue={setE} unit="°"/><ChoiceSelect label="Pattern plane" value={choice} options={["Horizontal plane","Vertical plane"]} setValue={setChoice}/></>:slug==="array-beamforming"?<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Vertical elements" value={b} setValue={setB}/><Field label="Horizontal elements" value={c} setValue={setC}/><Field label="Element spacing" value={d} setValue={setD} unit="λ"/><Field label="Steering angle" value={e} setValue={setE} unit="°"/></>:slug==="gain-aperture"?<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Antenna gain" value={b} setValue={setB} unit="dBi"/><Field label="Aperture efficiency" value={c} setValue={setC} unit="%"/></>:slug==="dish-design"?<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Dish diameter" value={b} setValue={setB} unit="m"/><Field label="Aperture efficiency" value={c} setValue={setC} unit="%"/><Field label="F/D ratio" value={d} setValue={setD}/></>:slug==="near-far-field"?<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Maximum antenna dimension" value={b} setValue={setB} unit="m"/></>:slug==="polarization-loss"?<><ChoiceSelect label="Polarization pair" value={choice} options={["Linear ↔ Linear","Linear ↔ Circular","Circular co-polar","Circular cross-polar"]} setValue={setChoice}/><Field label="Mismatch angle" value={b} setValue={setB} unit="°"/><Field label="Cross-polar discrimination" value={c} setValue={setC} unit="dB"/></>:slug==="mimo-spacing"?<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><ChoiceSelect label="Environment" value={choice} options={["Indoor / rich scatter","Urban macro","Rural / low scatter"]} setValue={setChoice}/><Field label="Custom separation" value={b} setValue={setB} unit="λ"/></>:slug==="pim-finder"?<><Field label="Transmit frequency f₁" value={a} setValue={setA} unit="MHz"/><Field label="Transmit frequency f₂" value={b} setValue={setB} unit="MHz"/><Field label="Receive-band low" value={c} setValue={setC} unit="MHz"/><Field label="Receive-band high" value={d} setValue={setD} unit="MHz"/></>:<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Main cable length" value={b} setValue={setB} unit="m"/><Field label="Cable loss at frequency" value={c} setValue={setC} unit="dB/100m"/><Field label="Connector count" value={d} setValue={setD}/><Field label="Loss per connector" value={e} setValue={setE} unit="dB"/></>;
  return <section className="antenna-engineering"><div className="antenna-calc-layout"><div className="antenna-input-card"><span className="eyebrow">ENGINEERING INPUTS</span><div className="budget-fields">{inputs}</div>{warning&&<div className="antenna-warning">⚠ {warning}</div>}</div><div className="antenna-result-card"><span>PRIMARY RESULT</span><strong>{main}</strong><b>{unit}</b><p>{note}</p><div className="antenna-viz"><i/><i/><i/><b>⌁</b></div>{rows.map(([k,v])=><div className="budget-row" key={k}><span>{k}</span><b>{v}</b></div>)}</div></div><div className="budget-equation"><b>Active formula</b><code>{formula}</code><p>Values are planning estimates. Use the measured antenna pattern and manufacturer cable data for final design.</p></div></section>;
}

function FresnelDiagram({d1,d2,frequency}:{d1:number;d2:number;frequency:number}){
  const safeD1=Math.max(d1,.001),safeD2=Math.max(d2,.001),safeF=Math.max(frequency,.001);
  const radius=547.72*Math.sqrt((safeD1*safeD2)/(safeF*(safeD1+safeD2)));
  const clearance=radius*.6;
  const pointPct=Math.min(82,Math.max(18,(safeD1/(safeD1+safeD2))*100));
  return <section className="fresnel-diagram-card">
    <div className="fresnel-diagram-head"><div><span className="eyebrow">PATH GEOMETRY</span><h3>First Fresnel-zone clearance</h3></div><div><b>{radius.toFixed(2)} m</b><span>r₁ at point P</span></div></div>
    <div className="fresnel-scene">
      <div className="fresnel-sky-grid"/>
      <div className="fresnel-ellipse outer"/><div className="fresnel-ellipse clearance"/>
      <div className="fresnel-los"/>
      <div className="fresnel-tower tx"><i/><b/><span>Tx</span></div><div className="fresnel-tower rx"><i/><b/><span>Rx</span></div>
      <div className="fresnel-measure" style={{left:`${pointPct}%`}}><span>r₁ = {radius.toFixed(2)} m</span><i/><b>P</b></div>
      <div className="terrain"><i/><i/><i/><i/><i/></div>
      <div className="distance-label d-one" style={{width:`${pointPct-7}%`}}>d₁ = {safeD1.toLocaleString()} km</div>
      <div className="distance-label d-two" style={{left:`${pointPct}%`,width:`${93-pointPct}%`}}>d₂ = {safeD2.toLocaleString()} km</div>
    </div>
    <div className="fresnel-legend"><div><i className="full"/><span>100% first Fresnel zone</span></div><div><i className="clear"/><span>Recommended 60% clearance: <b>{clearance.toFixed(2)} m</b></span></div><div><i className="sight"/><span>Direct line of sight</span></div></div>
    <div className="fresnel-formula-row"><code>r₁ = √(λ · d₁ · d₂ ÷ (d₁ + d₂))</code><p>At {safeF.toLocaleString()} MHz, obstacles should remain outside at least 60% of the first-zone radius to reduce diffraction loss.</p></div>
  </section>;
}

const defaults: Record<string,{a:number;b:number;c:number;d:number;mode:string}> = {
  "channel-frequency": { a: 1300, b: 0, c: 0, d: 0, mode: "LTE" },
  "resource-blocks": { a: 20, b: 0, c: 0, d: 0, mode: "LTE" },
  "free-space-path-loss": { a: 1800, b: 10, c: 30, d: 1.5, mode: "LTE" },
  "link-budget": { a: 43, b: 32, c: 132, d: 4, mode: "LTE" },
  "fresnel-zone": { a: 5, b: 5, c: 3500, d: 0, mode: "LTE" },
  "thermal-noise": { a: 20, b: 5, c: 0, d: 0, mode: "LTE" },
  "eirp": { a: 43, b: 2, c: 17, d: 0, mode: "LTE" },
  "wavelength": { a: 1800, b: 0, c: 0, d: 0, mode: "LTE" },
  "downtilt": { a: 30, b: 6, c: 0, d: 0, mode: "LTE" },
  "power-converter": { a: 30, b: 0, c: 0, d: 0, mode: "LTE" },
  "wifi-channel": { a: 36, b: 0, c: 0, d: 0, mode: "5 GHz" },
  "wifi-airtime": { a: 1500, b: 300, c: 0, d: 0, mode: "5 GHz" },
};

export default function ToolCalculator({ slug }: { slug: string }) {
  const initial = defaults[slug] ?? defaults["channel-frequency"];
  const [a,setA]=useState(initial.a);
  const [b,setB]=useState(initial.b);
  const [c,setC]=useState(initial.c);
  const [d,setD]=useState(initial.d);
  const [mode,setMode]=useState(initial.mode);
  const [conversionDirection,setConversionDirection]=useState<"channelToFrequency"|"frequencyToChannel">("channelToFrequency");
  const [lteBand,setLteBand]=useState("3");
  const [gsmBand,setGsmBand]=useState("900");
  const [radioDirection,setRadioDirection]=useState<"Downlink"|"Uplink">("Downlink");
  const [pathModel,setPathModel]=useState<keyof typeof pathModels>("fspl");
  const output=useMemo(()=>{
    if(slug==="free-space-path-loss") {
      const f=Math.max(a,.001),distKm=Math.max(b,.001),hb=Math.max(c,1.01),hm=Math.max(d,1.01),lf=Math.log10(f),ld=Math.log10(distKm);
      const ahm=(1.1*lf-.7)*hm-(1.56*lf-.8);
      const urban=69.55+26.16*lf-13.82*Math.log10(hb)-ahm+(44.9-6.55*Math.log10(hb))*ld;
      let loss=32.44+20*lf+20*ld;
      if(pathModel==="hataUrban") loss=urban;
      if(pathModel==="hataSuburban") loss=urban-2*Math.pow(Math.log10(f/28),2)-5.4;
      if(pathModel==="hataOpen") loss=urban-4.78*lf*lf+18.33*lf-40.94;
      if(pathModel==="cost231") loss=46.3+33.9*lf-13.82*Math.log10(hb)-ahm+(44.9-6.55*Math.log10(hb))*ld;
      if(pathModel==="uma"||pathModel==="umi") {
        const fc=f/1000,d2d=distKm*1000,d3d=Math.sqrt(d2d*d2d+(hb-hm)*(hb-hm));
        const dBP=4*Math.max(hb-1,.1)*Math.max(hm-1,.1)*(f*1e6)/3e8;
        const los1=pathModel==="uma"?28+22*Math.log10(d3d)+20*Math.log10(fc):32.4+21*Math.log10(d3d)+20*Math.log10(fc);
        const los2=pathModel==="uma"?28+40*Math.log10(d3d)+20*Math.log10(fc)-9*Math.log10(dBP*dBP+(hb-hm)*(hb-hm)):32.4+40*Math.log10(d3d)+20*Math.log10(fc)-9.5*Math.log10(dBP*dBP+(hb-hm)*(hb-hm));
        const los=d2d<=dBP?los1:los2;
        const nlos=pathModel==="uma"?13.54+39.08*Math.log10(d3d)+20*Math.log10(fc)-.6*(hm-1.5):35.3*Math.log10(d3d)+22.4+21.3*Math.log10(fc)-.3*(hm-1.5);
        loss=Math.max(los,nlos);
      }
      return {v:loss.toFixed(2),u:"dB",n:pathModels[pathModel].range};
    }
    if(slug==="link-budget") return {v:(a+b-c-d).toFixed(2),u:"dBm",n:"Tx power + gains − path loss − other losses"};
    if(slug==="wavelength") {const w=299.792458/Math.max(a,.001);return {v:w.toFixed(4),u:"m",n:`½ wave ${(w/2).toFixed(4)} m  •  ¼ wave ${(w/4).toFixed(4)} m`}}
    if(slug==="power-converter") {const w=Math.pow(10,(a-30)/10);return {v:w<.001?(w*1000).toFixed(6):w.toFixed(6),u:w<.001?"mW":"W",n:`${(a-30).toFixed(2)} dBW`}}
    if(slug==="thermal-noise") return {v:(-174+10*Math.log10(Math.max(a,1)*1e6)+b).toFixed(2),u:"dBm",n:"At 290 K, including receiver noise figure"};
    if(slug==="eirp") return {v:(a-b+c).toFixed(2),u:"dBm",n:"Transmitter power − feeder loss + antenna gain"};
    if(slug==="fresnel-zone") return {v:(547.72*Math.sqrt((a*b)/(Math.max(c,.001)*(a+b)))).toFixed(2),u:"m",n:"First-zone radius; distances in km and frequency in MHz"};
    if(slug==="downtilt") return {v:(a/Math.tan(Math.max(b,.01)*Math.PI/180)/1000).toFixed(3),u:"km",n:"Approximate ground intersection on level terrain"};
    if(slug==="wifi-airtime") return {v:((a*8)/(Math.max(b,.001)*1e6)*1000).toFixed(3),u:"ms",n:"Ideal payload airtime; protocol overhead is excluded"};
    if(slug==="wifi-channel"){let f=0;if(mode==="2.4 GHz")f=a===14?2484:2407+5*a;else if(mode==="5 GHz")f=5000+5*a;else f=5950+5*a;return {v:f.toFixed(0),u:"MHz",n:`IEEE channel ${a} in the ${mode} band`}}
    if(slug==="resource-blocks"){const lte:Record<number,number>={1.4:6,3:15,5:25,10:50,15:75,20:100};const nr15:Record<number,number>={5:25,10:52,15:79,20:106,25:133,30:160,40:216,50:270};const nr30:Record<number,number>={5:11,10:24,15:38,20:51,25:65,30:78,40:106,50:133,60:162,70:189,80:217,90:245,100:273};const value=mode==="LTE"?lte[a]:mode==="NR 15 kHz"?nr15[a]:nr30[a];return {v:value??"—",u:"PRBs",n:value?`${mode}, ${a} MHz channel bandwidth`:"Select a standardized bandwidth"}}
    if(conversionDirection==="frequencyToChannel"){
      let channel=0;
      if(mode==="GSM") {const band=gsmBands[gsmBand];channel=band.offset+(a-(radioDirection==="Downlink"?band.dlLow:band.ulLow))/.2}
      else if(mode==="5G NR") channel=a<3000?a/.005:a<24250.08?600000+(a-3000)/.015:2016667+(a-24250.08)/.06;
      else {const band=lteBands[lteBand],low=radioDirection==="Uplink"?(band.ulLow??band.low):band.low,offset=radioDirection==="Uplink"?(band.ulOffset??band.offset):band.offset;channel=offset+(a-low)/.1}
      return {v:Math.max(0,Math.round(channel)),u:mode==="GSM"?"ARFCN":mode==="LTE"?"EARFCN":"NR-ARFCN",n:"Nearest integer channel on the selected technology raster"};
    }
    let f=0;
    if(mode==="GSM") {const band=gsmBands[gsmBand];f=(radioDirection==="Downlink"?band.dlLow:band.ulLow)+.2*(a-band.offset)}
    else if(mode==="5G NR") f=a<=599999?a*.005:a<=2016666?3000+(a-600000)*.015:24250.08+(a-2016667)*.06;
    else {const band=lteBands[lteBand],low=radioDirection==="Uplink"?(band.ulLow??band.low):band.low,offset=radioDirection==="Uplink"?(band.ulOffset??band.offset):band.offset;f=low+.1*(a-offset)}
    return {v:f.toFixed(3),u:"MHz",n:mode==="LTE"?`LTE Band ${lteBand} ${radioDirection.toLowerCase()} raster`:`${mode} ${radioDirection.toLowerCase()} raster`};
  },[slug,a,b,c,d,mode,pathModel,conversionDirection,lteBand,gsmBand,radioDirection]);
  const modes=slug==="channel-frequency"?["GSM","LTE","5G NR"]:slug==="wifi-channel"?["2.4 GHz","5 GHz","6 GHz"]:slug==="resource-blocks"?["LTE","NR 15 kHz","NR 30 kHz"]:[];
  const wifiChannels=mode==="2.4 GHz"?Array.from({length:14},(_,i)=>i+1):mode==="5 GHz"?[36,40,44,48,52,56,60,64,100,104,108,112,116,120,124,128,132,136,140,144,149,153,157,161,165,169,173,177]:Array.from({length:59},(_,i)=>1+i*4);
  const selectedLte=lteBands[lteBand],selectedGsm=gsmBands[gsmBand];
  const lteChannelDefault=radioDirection==="Uplink"?(selectedLte.ulOffset??selectedLte.offset):selectedLte.offset;
  const lteFrequencyDefault=radioDirection==="Uplink"?(selectedLte.ulLow??selectedLte.low):selectedLte.low;
  const gsmChannelDefault=selectedGsm.offset;
  const gsmFrequencyDefault=radioDirection==="Downlink"?selectedGsm.dlLow:selectedGsm.ulLow;
  if(slug==="link-budget") return <AdvancedLinkBudget/>;
  if(slug==="maximum-cellular-speed") return <MaximumSpeedCalculator/>;
  if(slug==="lte-resource-grid") return <LteResourceGrid/>;
  if(slug==="nr-resource-grid") return <NrResourceGrid/>;
  if(ipSlugs.includes(slug)) return <IpEngineeringTool slug={slug}/>;
  if(antennaSlugs.includes(slug)) return <AntennaEngineeringTool slug={slug}/>;
  return <><div className="tool-workspace">
    {slug==="free-space-path-loss"&&<div className="path-model-select"><label><span>Propagation model</span><select value={pathModel} onChange={e=>setPathModel(e.target.value as keyof typeof pathModels)}>{Object.entries(pathModels).map(([id,m])=><option value={id} key={id}>{m.name}</option>)}</select></label><div><span>SUITABLE RANGE</span><b>{pathModels[pathModel].range}</b></div></div>}
    {modes.length>0&&<div className="mode-switch">{modes.map(x=><button key={x} onClick={()=>{setMode(x);if(slug==="wifi-channel")setA(x==="5 GHz"?36:1);if(slug==="resource-blocks")setA(x==="LTE"?20:x==="NR 15 kHz"?20:100);if(slug==="channel-frequency")setA(conversionDirection==="channelToFrequency"?(x==="GSM"?gsmChannelDefault:x==="LTE"?lteChannelDefault:630000):(x==="GSM"?gsmFrequencyDefault:x==="LTE"?lteFrequencyDefault:x==="5G NR"?3450:130))}} className={mode===x?"active":""}>{x}</button>)}</div>}
    {slug==="channel-frequency"&&<div className="direction-switch radio-link-switch"><button className={radioDirection==="Downlink"?"active":""} onClick={()=>{setRadioDirection("Downlink");const lte=lteBands[lteBand],gsm=gsmBands[gsmBand];setA(conversionDirection==="channelToFrequency"?(mode==="GSM"?gsm.offset:mode==="LTE"?lte.offset:630000):(mode==="GSM"?gsm.dlLow:mode==="LTE"?lte.low:3450))}}>Downlink channel</button><button className={radioDirection==="Uplink"?"active":""} onClick={()=>{setRadioDirection("Uplink");const nextBand=mode==="LTE"&&lteBands[lteBand].ulLow===undefined?"1":lteBand;if(nextBand!==lteBand)setLteBand(nextBand);const lte=lteBands[nextBand],gsm=gsmBands[gsmBand];setA(conversionDirection==="channelToFrequency"?(mode==="GSM"?gsm.offset:mode==="LTE"?(lte.ulOffset??lte.offset):630000):(mode==="GSM"?gsm.ulLow:mode==="LTE"?(lte.ulLow??lte.low):3450))}}>Uplink channel</button></div>}
    {slug==="channel-frequency"&&<div className="direction-switch"><button className={conversionDirection==="channelToFrequency"?"active":""} onClick={()=>{setConversionDirection("channelToFrequency");setA(mode==="GSM"?gsmChannelDefault:mode==="LTE"?lteChannelDefault:630000)}}>Channel → Frequency</button><button className={conversionDirection==="frequencyToChannel"?"active":""} onClick={()=>{setConversionDirection("frequencyToChannel");setA(mode==="GSM"?gsmFrequencyDefault:mode==="LTE"?lteFrequencyDefault:3450)}}>Frequency → Channel</button></div>}
    {slug==="channel-frequency"&&mode==="GSM"&&<label className="channel-band-select"><span>GSM operating band</span><select value={gsmBand} onChange={e=>{const next=e.target.value;setGsmBand(next);const band=gsmBands[next];setA(conversionDirection==="channelToFrequency"?band.offset:radioDirection==="Downlink"?band.dlLow:band.ulLow)}}>{Object.keys(gsmBands).map(band=><option value={band} key={band}>GSM {band}</option>)}</select></label>}
    {slug==="channel-frequency"&&mode==="LTE"&&<label className="channel-band-select"><span>LTE operating band</span><select value={lteBand} onChange={e=>{const next=e.target.value;setLteBand(next);const band=lteBands[next],offset=radioDirection==="Uplink"?(band.ulOffset??band.offset):band.offset,low=radioDirection==="Uplink"?(band.ulLow??band.low):band.low;setA(conversionDirection==="channelToFrequency"?offset:low)}}>{Object.keys(lteBands).filter(band=>radioDirection==="Downlink"||lteBands[band].ulLow!==undefined).map(band=><option value={band} key={band}>Band {band}</option>)}</select></label>}
    <div className="input-panel">
      {slug==="free-space-path-loss"&&<><Field label="Frequency" value={a} setValue={setA} unit="MHz"/><Field label="Distance" value={b} setValue={setB} unit="km"/>{pathModel!=="fspl"&&<><Field label="Base-station height" value={c} setValue={setC} unit="m"/><Field label="Mobile / UE height" value={d} setValue={setD} unit="m"/></>}</>}
      {slug==="link-budget"&&<><Field label="Transmit power" value={a} setValue={setA} unit="dBm"/><Field label="Total antenna gains" value={b} setValue={setB} unit="dB"/><Field label="Path loss" value={c} setValue={setC} unit="dB"/><Field label="Other losses" value={d} setValue={setD} unit="dB"/></>}
      {slug==="wavelength"&&<Field label="Frequency" value={a} setValue={setA} unit="MHz"/>}
      {slug==="power-converter"&&<Field label="Power" value={a} setValue={setA} unit="dBm"/>}
      {slug==="thermal-noise"&&<><Field label="Bandwidth" value={a} setValue={setA} unit="MHz"/><Field label="Noise figure" value={b} setValue={setB} unit="dB"/></>}
      {slug==="eirp"&&<><Field label="Transmit power" value={a} setValue={setA} unit="dBm"/><Field label="Feeder loss" value={b} setValue={setB} unit="dB"/><Field label="Antenna gain" value={c} setValue={setC} unit="dBi"/></>}
      {slug==="fresnel-zone"&&<><Field label="Distance d₁ (Tx to point P)" value={a} setValue={setA} unit="km"/><Field label="Distance d₂ (point P to Rx)" value={b} setValue={setB} unit="km"/><Field label="Frequency f" value={c} setValue={setC} unit="MHz"/></>}
      {slug==="downtilt"&&<><Field label="Antenna height" value={a} setValue={setA} unit="m"/><Field label="Total downtilt" value={b} setValue={setB} unit="°"/></>}
      {slug==="wifi-airtime"&&<><Field label="Payload size" value={a} setValue={setA} unit="bytes"/><Field label="PHY rate" value={b} setValue={setB} unit="Mbps"/></>}
      {slug==="channel-frequency"&&<Field label={conversionDirection==="channelToFrequency"?(mode==="GSM"?"ARFCN":mode==="LTE"?"EARFCN":"NR-ARFCN"):"Frequency"} value={a} setValue={setA} unit={conversionDirection==="frequencyToChannel"?"MHz":undefined}/>} 
      {slug==="wifi-channel"&&<NumberSelect label="Channel number" value={a} options={wifiChannels} setValue={setA}/>} 
      {slug==="resource-blocks"&&<NumberSelect label="Channel bandwidth" value={a} setValue={setA} options={mode==="LTE"?[1.4,3,5,10,15,20]:mode==="NR 15 kHz"?[5,10,15,20,25,30,40,50]:[5,10,15,20,25,30,40,50,60,70,80,90,100]} unit="MHz"/>}
    </div><Result value={output.v} unit={output.u} note={output.n}/>
    {slug==="free-space-path-loss"&&<div className="active-model-formula"><span>ACTIVE MODEL FORMULA</span><code>{pathModels[pathModel].formula}</code><small>Model validity depends on terrain, clutter, antenna heights and distance. Do not compare models outside their stated applicability range.</small></div>}
  </div>{slug==="fresnel-zone"&&<FresnelDiagram d1={a} d2={b} frequency={c}/>} {slug==="channel-frequency"&&<ChannelFormulaReference/>}</>;
}
