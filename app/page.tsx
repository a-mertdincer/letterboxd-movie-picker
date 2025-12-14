
import MoviePicker from '@/components/MoviePicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex flex-col items-center py-12 px-4 selection:bg-primary/30">

      {/* Header Badge */}
      <div className="mb-8 animate-fade-in opacity-0 [animation-fill-mode:forwards]">
        <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-gray-400 tracking-widest uppercase shadow-xl ring-1 ring-white/5">
          Letterboxd List Picker
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 relative animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:200ms]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-20 pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-6 relative z-10 leading-tight">
          WHAT SHOULD <br />I <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]">WATCH?</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto relative z-10 leading-relaxed">
          Paste a Letterboxd list URL and let fate decide your next movie night.
        </p>
      </div>

      <MoviePicker />

      {/* Footer */}
      <footer className="mt-auto py-12 text-center text-sm animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:600ms]">
        <div className="flex flex-col gap-4 text-gray-500">
          <p>
            Developed by{' '}
            <a
              href="https://github.com/a-mertdincer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-primary transition-colors font-medium border-b border-transparent hover:border-primary/50 pb-0.5"
            >
              Mert Dincer
            </a>
          </p>
          <p className="text-xs text-gray-700">
            Not affiliated with Letterboxd. Use public lists only.
          </p>
        </div>
      </footer>
    </main>
  );
}
