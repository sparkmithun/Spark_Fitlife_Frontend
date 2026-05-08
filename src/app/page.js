import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';

export const metadata = {
  title: 'Spark FitLife – Ignite Your Fitness Journey',
  description:
    'Join Spark FitLife to share fitness thoughts, track workouts, log runs and walks, and connect with a thriving fitness community.',
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
      <Footer />
    </>
  );
}
