import { lazy, Suspense } from "react";
import Hero from "@/components/Hero";
import ErrorBoundary from "@/components/ErrorBoundary";

const About = lazy(() => import("@/components/About"));
const Products = lazy(() => import("@/components/Products"));
const Mentoria = lazy(() => import("@/components/Mentoria"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const CTA = lazy(() => import("@/components/CTA"));
const Footer = lazy(() => import("@/components/Footer"));
const CookieConsent = lazy(() => import("@/components/CookieConsent"));

const SectionFallback = () => <div className="min-h-[200px]" />;

const Index = () => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <Suspense fallback={<SectionFallback />}>
        <ErrorBoundary>
          <About />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ErrorBoundary>
          <Products />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ErrorBoundary>
          <Mentoria />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ErrorBoundary>
          <Testimonials />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <ErrorBoundary>
          <CTA />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
};

export default Index;
