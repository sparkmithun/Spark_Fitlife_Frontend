import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Feed',
  description: 'Browse the latest fitness thoughts, tips, and progress updates from the Spark FitLife community.',
};

export default function FeedLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
