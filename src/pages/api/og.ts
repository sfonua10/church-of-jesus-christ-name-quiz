import type { APIRoute } from 'astro';
import satori from 'satori';
import type { SatoriOptions } from 'satori';
import sharp from 'sharp';
import type { ReactElement } from 'react';

// Function to load Google font with proper typing
async function loadGoogleFont(fontFamily: string): Promise<ArrayBuffer> {
  const API = `https://fonts.googleapis.com/css2?family=${fontFamily}`;
  const css = await fetch(API, {
    headers: {
      // Make sure it returns TTF
      'User-Agent': 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1',
    },
  }).then((res) => res.text());

  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)?.[1];

  if (!resource) {
    throw new Error('Failed to load font');
  }

  return fetch(resource).then((res) => res.arrayBuffer());
}

const createSatoriElement = (score: string, total: string, message: string): ReactElement => {
  // Calculate percentage for dynamic color
  const scoreNum = parseInt(score);
  const totalNum = parseInt(total);
  const percentage = (scoreNum / totalNum) * 100;
  const scoreColor = percentage === 100 ? '#22c55e' : // green
                    percentage >= 80 ? '#3b82f6' : // blue
                    percentage >= 60 ? '#eab308' : // yellow
                    '#ef4444'; // red

  return {
    type: 'div',
    key: null,
    props: {
      style: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        padding: '40px',
      },
      children: [
        {
          type: 'div',
          key: 'container',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '20px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
            children: [
              {
                type: 'div',
                key: 'header',
                props: {
                  style: {
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#0f172a',
                    marginBottom: '20px',
                    textAlign: 'center',
                  },
                  children: 'The Church of Jesus Christ of Latter-day Saints',
                },
              },
              {
                type: 'div',
                key: 'score',
                props: {
                  style: {
                    fontSize: '72px',
                    fontWeight: 'bold',
                    color: scoreColor,
                    margin: '20px 0',
                  },
                  children: `${score}/${total}`,
                },
              },
              {
                type: 'div',
                key: 'message',
                props: {
                  style: {
                    fontSize: '24px',
                    color: '#64748b',
                    textAlign: 'center',
                    maxWidth: '800px',
                  },
                  children: message,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          key: 'footer',
          props: {
            style: {
              position: 'absolute',
              bottom: '20px',
              fontSize: '20px',
              color: '#94a3b8',
            },
            children: 'Take the quiz at churchnamequiz.com',
          },
        },
      ],
    },
  };
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = url.searchParams;
    const score = searchParams.get('score') || '0';
    const total = searchParams.get('total') || '5';
    const message = searchParams.get('message') || 'Take the quiz to test your knowledge!';

    // Load the font
    const fontData = await loadGoogleFont('Inter');

    const element = createSatoriElement(score, total, message);

    const options: SatoriOptions = {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ],
    };

    const svg = await satori(element, options);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    return new Response(png, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error details:', error);
    return new Response(
      JSON.stringify({
        error: 'Error generating image',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};