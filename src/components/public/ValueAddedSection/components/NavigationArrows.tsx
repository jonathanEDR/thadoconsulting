interface NavigationArrowsProps {
  onPrev: () => void;
  onNext: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

export const NavigationArrows = ({ 
  onPrev, 
  onNext, 
  canGoPrev = true, 
  canGoNext = true 
}: NavigationArrowsProps) => {
  if (!canGoPrev && !canGoNext) return null;

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex justify-center space-x-4">
      <button
        onClick={onPrev}
        disabled={!canGoPrev}
        className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group ${
          canGoPrev 
            ? 'bg-gray-800 hover:bg-purple-600 cursor-pointer' 
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
        aria-label="Anterior"
      >
        <svg 
          className={`w-6 h-6 text-white transition-transform duration-300 ${
            canGoPrev ? 'group-hover:scale-110' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={onNext}
        disabled={!canGoNext}
        className={`w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group ${
          canGoNext 
            ? 'bg-gray-800 hover:bg-purple-600 cursor-pointer' 
            : 'bg-gray-600 cursor-not-allowed opacity-50'
        }`}
        aria-label="Siguiente"
      >
        <svg 
          className={`w-6 h-6 text-white transition-transform duration-300 ${
            canGoNext ? 'group-hover:scale-110' : ''
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};
