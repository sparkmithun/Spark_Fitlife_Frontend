import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'Profile',
  description: 'View and edit your Spark FitLife profile, fitness goals, and activity summary.',
};

export default function ProfileLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
