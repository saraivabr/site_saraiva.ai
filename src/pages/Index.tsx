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

const SectionSkeleton = () => (
  <div className="min-h-[300px] py-16 px-6">
    <div className="container-max space-y-6 animate-pulse">
      <div className="h-8 w-2/5 bg-black/5 rounded" />
      <div className="h-4 w-3/4 bg-black/5 rounded" />
      <div className="h-4 w-1/2 bg-black/5 rounded" />
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <ErrorBoundary>
        <Hero />
      </ErrorBoundary>
      <Suspense fallback={<SectionSkeleton />}>
        <ErrorBoundary>
          <About />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ErrorBoundary>
          <Products />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ErrorBoundary>
          <Mentoria />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ErrorBoundary>
          <Testimonials />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <ErrorBoundary>
          <CTA />
        </ErrorBoundary>
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <CookieConsent />
      </Suspense>
    </div>
  );
};

export default Index;
