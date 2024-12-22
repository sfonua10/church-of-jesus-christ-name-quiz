import type { APIRoute } from 'astro';
import satori from 'satori';
import type { SatoriOptions } from 'satori';
import sharp from 'sharp';
import type { ReactElement } from 'react';

const createSatoriElement = (score: string, total: string, message: string): ReactElement => ({
  key: null,
  type: 'div',
  props: {
    style: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ffffff',
      padding: '40px',
    },
    children: [
      {
        type: 'div',
        key: 'title',
        props: {
          style: {
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#1e3a8a',
            marginBottom: '20px',
          },
          children: 'Church Name Quiz Results',
        },
      },
      {
        type: 'div',
        key: 'score',
        props: {
          style: {
            fontSize: '36px',
            color: '#000000',
            marginBottom: '20px',
          },
          children: `Score: ${score}/${total}`,
        },
      },
      {
        type: 'div',
        key: 'message',
        props: {
          style: {
            fontSize: '24px',
            color: '#4b5563',
            textAlign: 'center',
            maxWidth: '800px',
          },
          children: message,
        },
      },
    ],
  },
});

export const get: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;
  const score = searchParams.get('score') || '0';
  const total = searchParams.get('total') || '5';
  const message = searchParams.get('message') || '';

  const options: SatoriOptions = {
    width: 1200,
    height: 630,
    fonts: [], // Add appropriate FontOptions here
  };

  const svg = await satori(
    createSatoriElement(score, total, message),
    options
  );

  // Convert SVG to PNG
  const png = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};