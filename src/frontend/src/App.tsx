import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import ParallaxSection from './components/ParallaxSection';
import ScrollCarAnimation from './components/ScrollCarAnimation';
import GallerySection from './components/GallerySection';
import VideoSection from './components/VideoSection';
import CarsPage from './pages/CarsPage';
import AdminPage from './pages/AdminPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Header />
      <div id="root-content">
        {window.location.pathname === '/' ? (
          <>
            <HeroSection />
            <FeaturesSection />
            <ParallaxSection />
            <ScrollCarAnimation />
            <GallerySection />
            <VideoSection />
          </>
        ) : window.location.pathname === '/cars' ? (
          <CarsPage />
        ) : window.location.pathname === '/admin' ? (
          <AdminPage />
        ) : window.location.pathname.startsWith('/payment/') ? (
          <PaymentPage />
        ) : window.location.pathname === '/order-confirmation' ? (
          <OrderConfirmationPage />
        ) : window.location.pathname === '/signup' ? (
          <SignupPage />
        ) : window.location.pathname === '/login' ? (
          <LoginPage />
        ) : window.location.pathname === '/profile' ? (
          <UserProfilePage />
        ) : (
          <>
            <HeroSection />
            <FeaturesSection />
            <ParallaxSection />
            <ScrollCarAnimation />
            <GallerySection />
            <VideoSection />
          </>
        )}
      </div>
      <Footer />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => null,
});

const carsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cars',
  component: () => null,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => null,
});

const paymentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment/$vin',
  component: () => null,
});

const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation',
  component: () => null,
});

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => null,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => null,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => null,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  carsRoute,
  adminRoute,
  paymentRoute,
  orderConfirmationRoute,
  signupRoute,
  loginRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
