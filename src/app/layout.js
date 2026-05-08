import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';

export const metadata = {
  title: {
    default: 'Spark FitLife – Fitness Community Platform',
    template: '%s | Spark FitLife',
  },
  description:
    'Join the Spark FitLife community to share fitness thoughts, monitor workouts, track runs & walks, and connect with like-minded fitness enthusiasts.',
  keywords: [
    'fitness',
    'community',
    'workout tracker',
    'running',
    'walking',
    'gym',
    'health',
    'Spark FitLife',
  ],
  openGraph: {
    title: 'Spark FitLife – Fitness Community Platform',
    description:
      'Share fitness thoughts, monitor workouts, and connect with your fitness community.',
    siteName: 'Spark FitLife',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0 }}>
        <AppRouterCacheProvider options={{ key: 'spark' }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
