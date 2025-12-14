
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';
export const revalidate = 3600; // Cache movie details for an hour

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const filmUrl = searchParams.get('url');

    if (!filmUrl) {
        return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validate it's a letterboxd film URL
    if (!filmUrl.includes('letterboxd.com/film/')) {
        return NextResponse.json({ error: 'Invalid Film URL' }, { status: 400 });
    }

    try {
        const response = await fetch(filmUrl, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch film page: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Extract Open Graph image (high res poster)
        const poster = $('meta[property="og:image"]').attr('content');

        // Sometimes we might want other details in the future (director, runtime, etc.)
        // but for now, just the poster is the priority.

        return NextResponse.json({
            poster: poster || null
        });

    } catch (error) {
        console.error('Error fetching film details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch film details' },
            { status: 500 }
        );
    }
}
