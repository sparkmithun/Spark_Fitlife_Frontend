import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Communities',
  description: 'Discover and join fitness communities on Spark FitLife. Find your tribe in running, yoga, weightlifting, and more.',
};

export default function CommunitiesLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
