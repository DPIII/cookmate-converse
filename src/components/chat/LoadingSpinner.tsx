export const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
      <div
        className="absolute top-0 left-1/2 w-1 h-6 bg-primary origin-bottom transform -translate-x-1/2 animate-spin"
        style={{ animationDuration: '2s' }}
      ></div>
    </div>
  </div>
);