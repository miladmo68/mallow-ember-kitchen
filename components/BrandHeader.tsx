export function BrandHeader() {
  return <header className="site-header">
    <a className="wordmark" href="#top" aria-label="Mallow and Ember, back to top"><span className="wordmark-icon">M<span>✳</span>E</span><span className="wordmark-text">MALLOW<br /><i>&</i> EMBER</span></a>
    <nav className="desktop-nav" aria-label="Main navigation">
      <a href="#story">Our table</a><a href="#menu">The menu</a><a href="#visit">Visit</a>
    </nav>
    <a className="header-book" href="#reserve">Find a table <span aria-hidden="true">↗</span></a>
  </header>;
}
