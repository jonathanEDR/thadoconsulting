import { Skeleton } from './Skeleton';

/**
 * Skeletons de carga para las secciones publicas del Home
 * Se muestran mientras los datos del CMS se cargan desde la base de datos
 */

export const HeroSkeleton = () => (
  <section className="relative min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
      <Skeleton height={48} width="70%" className="mx-auto" />
      <Skeleton height={28} width="50%" className="mx-auto" />
      <div className="space-y-3 max-w-2xl mx-auto">
        <Skeleton height={18} width="90%" className="mx-auto" />
        <Skeleton height={18} width="75%" className="mx-auto" />
      </div>
      <Skeleton height={48} width={220} className="mx-auto rounded-lg" />
    </div>
  </section>
);

export const SolutionsSkeleton = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center space-y-4 mb-12">
        <Skeleton height={36} width="60%" className="mx-auto" />
        <Skeleton height={18} width="80%" className="mx-auto" />
        <Skeleton height={18} width="65%" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-4">
            <Skeleton circle width={64} height={64} className="mx-auto" />
            <Skeleton height={24} width="70%" className="mx-auto" />
            <div className="space-y-2">
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="70%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ValueAddedSkeleton = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center space-y-4 mb-12">
        <Skeleton height={36} width="50%" className="mx-auto" />
        <Skeleton height={18} width="40%" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <Skeleton height={22} width="80%" />
            <div className="space-y-2">
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="85%" />
              <Skeleton height={14} width="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const FeaturedBlogSkeleton = () => (
  <section className="py-20 bg-white dark:bg-gray-900">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center space-y-4 mb-12">
        <Skeleton height={36} width="40%" className="mx-auto" />
        <Skeleton height={18} width="60%" className="mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Skeleton height={200} className="w-full" />
            <div className="p-5 space-y-3">
              <Skeleton height={12} width={80} />
              <Skeleton height={22} width="90%" />
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="75%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ContactSkeleton = () => (
  <section className="py-20 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-2xl mx-auto px-6">
      <div className="text-center space-y-4 mb-10">
        <Skeleton height={36} width="60%" className="mx-auto" />
        <Skeleton height={18} width="80%" className="mx-auto" />
      </div>
      <div className="space-y-5 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton height={16} width={120} />
            <Skeleton height={44} className="w-full rounded-lg" />
          </div>
        ))}
        <div className="space-y-2">
          <Skeleton height={16} width={180} />
          <Skeleton height={100} className="w-full rounded-lg" />
        </div>
        <Skeleton height={48} className="w-full rounded-lg" />
      </div>
    </div>
  </section>
);

export const HomePageSkeleton = () => (
  <div className="animate-pulse">
    <HeroSkeleton />
    <SolutionsSkeleton />
    <ValueAddedSkeleton />
    <FeaturedBlogSkeleton />
    <ContactSkeleton />
  </div>
);
