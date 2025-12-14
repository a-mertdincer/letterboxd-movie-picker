
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'nodejs';
export const revalidate = 0; // Disable cache for debugging

interface Movie {
  id: string;
  title: string;
  year?: string;
  link: string;
  image: string | null;
}

const MAX_PAGES = 10;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listUrl = searchParams.get('url');

  if (!listUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  // Basic validation
  if (!listUrl.includes('letterboxd.com/') || !listUrl.includes('/list/')) {
    return NextResponse.json({ error: 'Invalid Letterboxd list URL. Must be a list page.' }, { status: 400 });
  }

  try {
    const movies: Movie[] = [];
    let nextUrl: string | null = listUrl;
    let pageCount = 0;

    while (nextUrl && pageCount < MAX_PAGES) {
      console.log(`Fetching page: ${nextUrl}`);
      const response = await fetch(nextUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch ${nextUrl}: ${response.status} ${response.statusText}`);
        break;
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      // New selector strategy based on debug analysis
      const items = $('.poster-list li.posteritem');
      console.log(`Found ${items.length} items on page ${pageCount + 1}`);

      items.each((_, element) => {
        const $el = $(element);
        // Data is often in a child div with class 'react-component'
        const $div = $el.find('div.react-component');

        // Fallbacks for data attributes
        const nameData = $div.attr('data-item-name') || $el.attr('data-film-name');
        const linkSlug = $div.attr('data-target-link') || $div.attr('data-film-slug') || $el.attr('data-film-slug');
        const id = $div.attr('data-film-id') || $el.attr('data-film-id');
        let image: string | null | undefined = $div.find('img').attr('src') || $el.find('img').attr('src');

        if (!nameData || !linkSlug) return;

        // Parse Title and Year from "Title (Year)" format commonly used in data-item-name
        let title = nameData;
        let year = '';
        const match = nameData.match(/(.*)\s\((\d{4})\)$/);
        if (match) {
          title = match[1];
          year = match[2];
        } else {
          // Fallback to separate year attribute if available (though didn't see it in check)
          year = $div.attr('data-film-release-year') || $el.attr('data-film-release-year') || '';
        }

        // Handle image placeholder
        if (image && image.includes('empty-poster')) {
          // If we have a data-poster-url, we technically could try to use it, 
          // but it's a relative path to an HTML page, not an image.
          // For now, set to null so UI knows it's missing.
          image = null;
        }

        movies.push({
          id: id || linkSlug,
          title,
          year,
          link: `https://letterboxd.com${linkSlug}`,
          image: image || null,
        });
      });

      // Pagination
      const nextLink = $('.paginate-nextprev a.next').attr('href');
      if (nextLink) {
        nextUrl = `https://letterboxd.com${nextLink}`;
      } else {
        nextUrl = null;
      }

      pageCount++;
    }

    if (movies.length === 0) {
      return NextResponse.json(
        { error: 'No movies found. The list might be private or the scraping logic needs update.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ movies, total: movies.length });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
