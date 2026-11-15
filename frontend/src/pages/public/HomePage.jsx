import React from 'react';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import Features from '../../components/public/Features';
import GamesCatalogue from '../../components/public/GamesCatalogue';
import RentalPlans from '../../components/public/RentalPlans';
import HowItWorks from '../../components/public/HowItWorks';
import AboutUs from '../../components/public/AboutUs';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-vault-bg text-vault-text flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <GamesCatalogue />
        <RentalPlans />
        <HowItWorks />
        <AboutUs />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
