import CallToAction from '../components/CallToAction';
import PageHero from '../components/PageHero';
import ContactSection from '../components/ContactSection';
import contactHero from '../assets/extras/contact-us-hero.webp'
import ctaImage from '../assets/cta/cta-image.webp'

export default function Games() {
  return (
    <div className="bg-white dark:bg-black">
        <PageHero
            imagePath={contactHero}
            pageName="Let’s Talk Gaming"
            heading={<>Let’s <span className="text-primary-dark">Talk</span> Gaming</>}
            description="Have a question about our games, studio, careers, or future projects? Connect with Waywe Gaming and reach the right team. We’re always open to hearing from players, partners, talent, and people interested in what we’re building next."
        />
    
        <ContactSection />

      {/* <CallToAction
        imagePath={ctaImage}
        heading={<>Follow Our Journey to the  <span className="text-primary-dark">Next Level</span></>}
        description="Let&apos;s create a game experience players will remember."
        buttonLabel="Get Consultation"
        buttonHref="/contact"
      /> */}
    </div>
  );
}
