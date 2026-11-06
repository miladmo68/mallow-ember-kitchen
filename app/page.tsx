import { Hero } from "../components/Hero";
import { EditorialSections } from "../components/EditorialSections";
import { MenuExperience } from "../components/MenuExperience";

export default function Home() {
  return <>
    <Hero />
    <EditorialSections />
    <MenuExperience />
    <section id="reserve" className="section-shell holding-section"><div className="section-kicker">03 / Gather</div><h2>Find your seat</h2><p>Make room for a good evening.</p></section>
    <footer id="visit" className="site-footer"><span>Mallow & Ember</span><span>Toronto · Tuesday–Sunday</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
