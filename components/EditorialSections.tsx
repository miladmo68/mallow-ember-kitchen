import { photos } from "../lib/photos";

export function EditorialSections() {
  return <>
    <section id="story" className="story-section section-shell">
      <div className="story-copy">
        <div className="section-kicker"><span>01 / The feeling</span><span className="star" aria-hidden="true">✳</span></div>
        <h2>Good food.<br /><em>Long conversations.</em></h2>
        <p>Some evenings deserve a little more room. Pull up a chair for seasonal cooking, thoughtful drinks and the pleasure of staying awhile.</p>
        <a className="text-link" href="#menu">See what’s cooking <span aria-hidden="true">↗</span></a>
      </div>
      <div className="story-image-wrap"><img src={photos.pasta} alt="Editorial photograph of a plated pasta dish at a dining table" loading="lazy" /><span className="image-note">A little something to share<br />— always.</span></div>
    </section>
    <section className="manifesto-section" aria-label="Our approach">
      <div className="manifesto-orbit" aria-hidden="true">✳</div>
      <p>From the first bite<br />to the last story.</p>
      <span>Gather often. Eat well. Stay longer.</span>
    </section>
  </>;
}
