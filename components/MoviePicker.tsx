
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Shuffle, Film, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default poster placeholder if image fails or is missing
const DEFAULT_POSTER = "https://s.ltrbxd.com/static/img/empty-poster-1000.png";

interface Movie {
    id: string;
    title: string;
    year?: string;
    link: string;
    image: string | null;
}

export default function MoviePicker() {
    const [url, setUrl] = useState('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);
    const [posterLoading, setPosterLoading] = useState(false);
    const [highResPoster, setHighResPoster] = useState<string | null>(null);

    const fetchMovies = async () => {
        if (!url.includes('letterboxd.com/') || !url.includes('/list/')) {
            setError('Please enter a valid Letterboxd list URL');
            return;
        }

        setLoading(true);
        setError('');
        setMovies([]);
        setSelectedMovie(null);
        setHighResPoster(null);

        try {
            const res = await fetch(`/api/letterboxd?url=${encodeURIComponent(url)}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to fetch');

            if (data.movies.length === 0) {
                setError('No movies found in this list.');
            } else {
                setMovies(data.movies);
            }
        } catch (err) {
            setError('Failed to load list. Make sure the list is public.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHighResPoster = async (movie: Movie) => {
        setPosterLoading(true);
        try {
            const res = await fetch(`/api/letterboxd/film?url=${encodeURIComponent(movie.link)}`);
            const data = await res.json();
            if (data.poster) {
                setHighResPoster(data.poster);
            }
        } catch (error) {
            console.error("Failed to fetch high res poster", error);
        } finally {
            setPosterLoading(false);
        }
    }

    const pickRandomMovie = () => {
        if (movies.length === 0) return;

        setIsShuffling(true);
        setSelectedMovie(null);
        setHighResPoster(null);

        // Shuffle effect
        let count = 0;
        const maxShuffles = 20;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * movies.length);
            setSelectedMovie(movies[randomIndex]);
            count++;

            if (count >= maxShuffles) {
                clearInterval(interval);
                // Final pick
                const finalPick = movies[Math.floor(Math.random() * movies.length)];
                setSelectedMovie(finalPick);
                setIsShuffling(false);

                // Fetch high res image for the final pick
                fetchHighResPoster(finalPick);
            }
        }, 100);
    };

    // Determine which image to show
    // 1. High res if available
    // 2. Movie's scraped low-res/placeholder if available (and not empty placeholder)
    // 3. DEFAULT_POSTER
    const displayImage = highResPoster || selectedMovie?.image || DEFAULT_POSTER;

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="glass-panel p-8 rounded-2xl mb-8">
                <div className="flex flex-col gap-4">
                    <label className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                        Letterboxd List URL
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://letterboxd.com/user/list/..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                        />
                        <button
                            onClick={fetchMovies}
                            disabled={loading || !url}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Load List'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                    {movies.length > 0 && (
                        <p className="text-emerald-400 text-sm">{movies.length} movies loaded ready to pick.</p>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {movies.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex flex-col items-center gap-8"
                    >
                        <button
                            onClick={pickRandomMovie}
                            disabled={isShuffling}
                            className="group relative bg-white text-black font-black text-xl px-12 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <span className="flex items-center gap-3">
                                <Shuffle className={cn("w-6 h-6", isShuffling && "animate-spin")} />
                                {isShuffling ? 'PICKING...' : 'PICK RANDOM MOVIE'}
                            </span>
                        </button>

                        {selectedMovie && (
                            <motion.div
                                key={selectedMovie.id}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="relative perspective-1000"
                            >
                                <div className={cn(
                                    "relative z-10 rounded-xl overflow-hidden shadow-2xl transition-all duration-300",
                                    !isShuffling && "poster-glow scale-105 ring-4 ring-primary/50"
                                )}>
                                    <div className="relative w-[300px] h-[450px] bg-gray-900">
                                        {/* Loading State Overlay */}
                                        {posterLoading && !isShuffling && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                                                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                            </div>
                                        )}

                                        <img
                                            src={displayImage}
                                            alt={selectedMovie.title}
                                            className="w-full h-full object-cover transition-opacity duration-500"
                                            onError={(e) => {
                                                e.currentTarget.src = DEFAULT_POSTER;
                                            }}
                                        />
                                    </div>

                                    {!isShuffling && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20 text-center z-30">
                                            <h2 className="text-2xl font-bold text-white mb-1 leading-tight">{selectedMovie.title}</h2>
                                            {selectedMovie.year && <p className="text-gray-400 font-medium mb-4">{selectedMovie.year}</p>}

                                            <a
                                                href={selectedMovie.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-2 text-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-wider"
                                            >
                                                View on Letterboxd <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Empty State / Graphic */}
            {!movies.length && !loading && !error && (
                <div className="flex flex-col items-center justify-center text-gray-600 mt-12 opacity-50">
                    <Film size={64} className="mb-4" />
                    <p>Enter a list URL to get started</p>
                </div>
            )}
        </div>
    );
}
