import { notFound } from "next/navigation";
import Link from "next/link";
import ToolCalculator from "./ToolCalculator";
import ToolExplainer from "./ToolExplainer";
import ToolActions from "./ToolActions";
import { categories, toolCatalog } from "../../tool-data";
import { getToolMeta } from "../../tool-meta";
import {features, specifications} from "../../3gpp/data";
import {tool3gppRelations} from "../../3gpp/tool-relations";
import type { Metadata } from "next";

const references: Record<string,{label:string;url:string}[]> = {
  "channel-frequency": [
    {label:"3GPP TS 45.005 — GSM radio transmission and reception",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2705"},
    {label:"3GPP TS 36.101 — LTE UE radio transmission and reception",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2411"},
    {label:"3GPP TS 38.104 — NR base-station radio transmission and reception",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3202"},
  ],
  "resource-blocks": [
    {label:"3GPP TS 36.211 — LTE physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2425"},
    {label:"3GPP TS 38.211 — NR physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3213"},
  ],
  "lte-resource-grid": [
    {label:"3GPP TS 36.211 — LTE physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2425"},
    {label:"3GPP TS 36.213 — LTE physical-layer procedures",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2427"},
  ],
  "nr-resource-grid": [
    {label:"3GPP TS 38.211 — NR physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3213"},
    {label:"3GPP TS 38.213 — NR physical-layer control procedures",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3215"},
  ],
  "maximum-cellular-speed": [
    {label:"3GPP TS 36.211 — LTE physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2425"},
    {label:"3GPP TS 38.211 — NR physical channels and modulation",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3213"},
  ],
  "free-space-path-loss": [
    {label:"ITU-R P.525 — Calculation of free-space attenuation",url:"https://www.itu.int/rec/R-REC-P.525/en"},
    {label:"3GPP TR 38.901 — Channel models from 0.5 to 100 GHz",url:"https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/19.03.00_60/tr_138901v190300p.pdf"},
    {label:"ETSI ETR 103 — Hata and COST-231 Hata guidance",url:"https://www.etsi.org/deliver/etsi_etr/100_199/103/02_60/etr_103e02p.pdf"},
  ],
  "link-budget": [
    {label:"ITU-R P.341 — The concept of transmission loss for radio links",url:"https://www.itu.int/rec/R-REC-P.341/en"},
    {label:"3GPP TS 36.101 — LTE UE radio transmission and reception",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=2411"},
    {label:"3GPP TS 38.101-1 — NR UE radio transmission and reception",url:"https://portal.3gpp.org/desktopmodules/Specifications/SpecificationDetails.aspx?specificationId=3283"},
  ],
  "fresnel-zone": [{label:"ITU-R P.526 — Propagation by diffraction and Fresnel zones",url:"https://www.itu.int/rec/R-REC-P.526/en"}],
  "thermal-noise": [{label:"ITU-R P.372 — Radio noise",url:"https://www.itu.int/rec/R-REC-P.372/en"}],
  "eirp": [{label:"ITU-R P.341 — Radio-link transmission-loss definitions",url:"https://www.itu.int/rec/R-REC-P.341/en"}],
  "wavelength": [{label:"NIST SP 330 — International System of Units (SI)",url:"https://www.nist.gov/pml/special-publication-330"}],
  "downtilt": [{label:"ITU-R F.1336 — Reference radiation patterns for fixed wireless antennas",url:"https://www.itu.int/rec/R-REC-F.1336/en"}],
  "antenna-coverage": [{label:"ITU-R F.1336 — Reference radiation patterns for sectoral antennas",url:"https://www.itu.int/rec/R-REC-F.1336/en"}],
  "radiation-pattern": [{label:"ITU-R F.1336 — Reference radiation patterns for sectoral antennas",url:"https://www.itu.int/rec/R-REC-F.1336/en"}],
  "array-beamforming": [{label:"3GPP TR 38.901 — Antenna-array and channel models",url:"https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/19.03.00_60/tr_138901v190300p.pdf"}],
  "gain-aperture": [{label:"IEEE 145 — Standard antenna terminology",url:"https://standards.ieee.org/ieee/145/11020/"}],
  "dish-design": [{label:"ITU-R F.699 — Reference patterns for fixed wireless antennas",url:"https://www.itu.int/rec/R-REC-F.699/en"}],
  "near-far-field": [{label:"IEEE 145 — Standard antenna terminology",url:"https://standards.ieee.org/ieee/145/11020/"}],
  "polarization-loss": [{label:"IEEE 145 — Standard antenna terminology",url:"https://standards.ieee.org/ieee/145/11020/"}],
  "mimo-spacing": [{label:"3GPP TR 38.901 — Antenna-array and channel models",url:"https://www.etsi.org/deliver/etsi_tr/138900_138999/138901/19.03.00_60/tr_138901v190300p.pdf"}],
  "pim-finder": [{label:"IEC 62037-1 — Passive RF and microwave intermodulation",url:"https://webstore.iec.ch/en/publication/62071"}],
  "feeder-loss": [{label:"ITU-R P.341 — Radio-link transmission-loss definitions",url:"https://www.itu.int/rec/R-REC-P.341/en"}],
  "power-converter": [{label:"NIST SP 811 — Guide for the use of the International System of Units",url:"https://www.nist.gov/pml/special-publication-811"}],
  "wifi-channel": [{label:"IEEE 802.11 — Wireless LAN standards",url:"https://standards.ieee.org/ieee/802.11/10548/"}],
  "wifi-airtime": [{label:"IEEE 802.11 — Wireless LAN standards",url:"https://standards.ieee.org/ieee/802.11/10548/"}],
};
const ipReferences=[
  {label:"RFC 4632 — Classless Inter-domain Routing (CIDR)",url:"https://www.rfc-editor.org/rfc/rfc4632.html"},
  {label:"RFC 4291 — IPv6 Addressing Architecture",url:"https://www.rfc-editor.org/rfc/rfc4291.html"},
  {label:"IANA — Special-Purpose Address Registries",url:"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml"},
];

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const tool=toolCatalog.find(t=>t.slug===slug);return tool?{title:`${tool.name} | WaveKit`,description:tool.summary}:{title:"Tool not found | WaveKit"}}

export default async function ToolPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const tool=toolCatalog.find(t=>t.slug===slug);if(!tool)notFound();const meta=getToolMeta(slug,tool.category);
  const relation=tool3gppRelations[slug];const mappedSpecs=(relation?.specifications??[]).map(number=>specifications.find(item=>item.number===number)).filter(Boolean);const mappedFeatures=(relation?.features??[]).map(id=>features.find(item=>item.id===id)).filter(Boolean);const externalReferences=(references[slug]??(tool.category==="IP Calculator"?ipReferences:[])).filter(ref=>!relation||!ref.label.startsWith("3GPP"));
  const reportUrl=`https://github.com/suwatchaiT/wavekit/issues/new?template=calculation-problem.yml&title=${encodeURIComponent(`[Calculation]: ${tool.name}`)}`;
  return <main className="tool-page">
    <header><Link className="brand" href="/"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></Link><span className="version-badge">BETA 0.1</span><nav><Link href="/#tools">All tools</Link><Link href="/#reference">Technology</Link><Link href="/info/methodology">Methodology</Link><Link href="/info/readiness">Readiness</Link></nav><Link className="header-cta" href="/">← Home</Link></header>
    <div className="tool-shell"><aside><b>TOOL CATEGORIES</b>{categories.map(c=><div key={c}><span>{c}</span>{toolCatalog.filter(t=>t.category===c).map(t=><Link className={t.slug===slug?"active":""} href={`/tools/${t.slug}`} key={t.slug}>{t.name}</Link>)}</div>)}</aside>
      <article className="tool-main">
        <div className="breadcrumbs"><Link href="/">Home</Link><i>›</i><span>{tool.category}</span><i>›</i><b>{tool.name}</b></div><span className="eyebrow">{tool.category.toUpperCase()}</span><h1>{tool.name}</h1><p className="tool-lead">{tool.summary} All calculations run locally in your browser.</p>
        <div className="tool-references"><b>References</b>{mappedSpecs.map((item,i)=><span key={item!.number}>{i>0&&<i>•</i>}<Link href={`/3gpp/spec/${item!.number}`}>{item!.type} {item!.number} — {item!.title} →</Link></span>)}{externalReferences.map((ref,i)=><span key={ref.url}>{(i>0||mappedSpecs.length>0)&&<i>•</i>}<a href={ref.url} target="_blank" rel="noreferrer">{ref.label} ↗</a></span>)}</div>
        <ToolActions slug={slug}/><div id="calculator-workspace"><ToolCalculator key={slug} slug={slug}/></div><ToolExplainer slug={slug}/>
        <section className="technical-review"><div className="review-heading"><div><span className="eyebrow">TECHNICAL BASIS</span><h2>Scope and review</h2></div><b className={`review-status ${meta.status==="Standards-based"?"standard":"estimate"}`}>{meta.status}</b></div><dl>{relation&&<><div><dt>3GPP technology</dt><dd>{relation.technologies.join(" · ")}</dd></div><div><dt>Mapped features</dt><dd className="technical-links">{mappedFeatures.map(feature=><Link href={`/3gpp?feature=${feature!.id}`} key={feature!.id}>{feature!.name} ({feature!.release}) →</Link>)}</dd></div><div><dt>Release coverage</dt><dd>{relation.releases.join(" · ")}</dd></div><div><dt>Mapped specifications</dt><dd className="technical-links">{mappedSpecs.map(item=><Link href={`/3gpp/spec/${item!.number}`} key={item!.number}>{item!.type} {item!.number} →</Link>)}</dd></div></>}<div><dt>Model or standard</dt><dd>{meta.standard}</dd></div><div><dt>Version</dt><dd>{meta.version}</dd></div><div><dt>Applicable range</dt><dd>{meta.range}</dd></div><div><dt>Assumptions</dt><dd>{meta.assumptions}</dd></div><div><dt>Technical owner</dt><dd>{meta.technicalOwner}</dd></div><div><dt>Review level</dt><dd>{meta.reviewLevel}</dd></div><div><dt>Last technical review</dt><dd>{meta.reviewed}</dd></div></dl>{relation&&<Link className="technical-map-link" href="/3gpp">Explore the complete 3GPP knowledge map →</Link>}<a href={reportUrl} target="_blank" rel="noreferrer">Report a problem on GitHub ↗</a></section>
        <section className="formula-note disclaimer-note"><h2>Reference-only disclaimer</h2><p>WaveKit is provided for learning, planning estimates and cross-checks. Do not use this output as the sole basis for a safety, regulatory, commercial, commissioning or real-world operational claim. Verify inputs and results against current standards, vendor documentation, calibrated tools and applicable local requirements.</p><Link href="/info/disclaimer">Read the full disclaimer →</Link></section>
      </article>
    </div>
  </main>
}
