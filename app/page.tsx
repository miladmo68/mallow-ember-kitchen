import { Hero } from "../components/Hero";
import { EditorialSections } from "../components/EditorialSections";

export default function Home() {
  return <>
    <Hero />
    <EditorialSections />
    <section id="menu" className="section-shell holding-section"><div className="section-kicker">02 / Eat well</div><h2>Our seasonal menu</h2><p>Plates to linger over, from the first bite to the last.</p></section>
    <section id="reserve" className="section-shell holding-section"><div className="section-kicker">03 / Gather</div><h2>Find your seat</h2><p>Make room for a good evening.</p></section>
    <footer id="visit" className="site-footer"><span>Mallow & Ember</span><span>Toronto · Tuesday–Sunday</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
