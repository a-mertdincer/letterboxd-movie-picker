
import MoviePicker from '@/components/MoviePicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black flex flex-col items-center py-20 px-4">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-black/50 backdrop-blur-md pb-6 pt-8 text-gray-400 lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-black/30 lg:p-4">
          Letterboxd List Picker
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-black via-black/80 lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0 font-bold text-primary"
            href="https://letterboxd.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Letterboxd Lists
          </a>
        </div>
      </div>

      <div className="text-center mb-12 relative">
        <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full opacity-20 pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 mb-4 relative z-10">
          WHAT SHOULD <br />I <span className="text-primary">WATCH?</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto relative z-10">
          Paste a Letterboxd list URL and let fate decide your next movie night.
        </p>
      </div>

      <MoviePicker />

      <footer className="mt-auto pt-20 text-center text-gray-600 text-sm">
        <p>Not affiliated with Letterboxd. Use public lists only.</p>
      </footer>
    </main>
  );
}
