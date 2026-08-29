
export function SiteFrame({children}:{children:React.ReactNode}) {
  return <main className="gpp-page">
    <header><a className="brand" href="/"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>RF ENGINEERING TOOLS</small></span></a><span className="version-badge">BETA 0.1</span><nav><a href="/">Tools</a><a href="/3gpp">3GPP Map</a><a href="/3gpp/specifications">Specifications</a><a href="/info/methodology">Methodology</a></nav></header>
    {children}
    <footer><div className="brand inverse"><span className="brand-mark">W</span><span>Wave<span>Kit</span><small>3GPP KNOWLEDGE MAP · LOCAL PROTOTYPE</small></span></div><p>Metadata and original summaries only. Always verify engineering decisions against current official 3GPP material.</p><div><a href="/3gpp">Knowledge map</a><a href="/3gpp/specifications">Specification index</a><a href="/info/disclaimer">Disclaimer</a></div></footer>
  </main>;
}
