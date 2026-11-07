import { BrandHeader } from "./BrandHeader";
import { photos } from "../lib/photos";

export function Hero() {
  return <div id="top" className="hero-wrap">
    <BrandHeader />
    <section className="hero section-shell">
      <div className="hero-copy">
        <p className="hero-overline">A neighbourhood table · Toronto</p>
        <h1>Come hungry.<br /><em>Stay awhile.</em></h1>
        <p className="hero-subtitle">Food from the hearth. Drinks made with care. The kind of evening you wish would go on a little longer.</p>
        <div className="hero-actions"><a className="button button-ink" href="#menu">Explore the menu <span>↗</span></a><a className="button button-outline" href="#reserve">Book a table <span>↗</span></a></div>
        <div className="hero-footnote"><span className="tiny-sun" aria-hidden="true">✳</span> Open Tuesday–Sunday · Walk-ins welcome</div>
      </div>
      <div className="hero-photo"><img src={photos.room} alt="Warm restaurant interior photographed for editorial atmosphere" /><div className="hero-photo-label"><span>At the table</span><strong>Every meal is an occasion.</strong></div></div>
      <div className="hero-side-note" aria-hidden="true">SEASONAL / SHARED / SLOW</div>
    </section>
  </div>;
}
