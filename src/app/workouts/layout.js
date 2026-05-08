import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Workouts',
  description: 'Track and monitor your workouts, runs, walks, and gym sessions on Spark FitLife.',
};

export default function WorkoutsLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
