import { Hero } from "../components/Hero";
import { EditorialSections } from "../components/EditorialSections";
import { MenuExperience } from "../components/MenuExperience";
import { ReservationExperience } from "../components/ReservationExperience";

export default function Home() {
  return <>
    <Hero />
    <EditorialSections />
    <MenuExperience />
    <ReservationExperience />
    <footer id="visit" className="site-footer"><span>Mallow & Ember</span><span>Toronto · Tuesday–Sunday</span><a href="#top">Back to top ↑</a></footer>
  </>;
}
