import Link from "next/link";

export function SiteFrame({children}:{children:React.ReactNode}) {
  return <main className="gpp-page">
    <header><Link className="brand" href="/"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></Link><span className="version-badge">BETA 0.1</span><nav><Link href="/">Tools</Link><Link href="/3gpp">3GPP Map</Link><Link href="/3gpp/specifications">Specifications</Link><Link href="/info/methodology">Methodology</Link></nav></header>
    {children}
    <footer><div className="brand inverse"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>3GPP KNOWLEDGE MAP · LOCAL PROTOTYPE</small></span></div><p>Metadata and original summaries only. Always verify engineering decisions against current official 3GPP material.</p><div><Link href="/3gpp">Knowledge map</Link><Link href="/3gpp/specifications">Specification index</Link><Link href="/info/disclaimer">Disclaimer</Link></div></footer>
  </main>;
}
