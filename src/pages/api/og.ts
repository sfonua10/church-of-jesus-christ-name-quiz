import satori from 'satori';
import type { SatoriOptions } from 'satori';
import sharp from 'sharp';
import type { ReactElement } from 'react';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const { score = '0', total = '5', message = '' } = req.query;

    // Calculate percentage for background color
    const percentage = (parseInt(score as string) / parseInt(total as string)) * 100;
    const scoreColor = percentage === 100 ? '#22c55e' : // green
                      percentage >= 80 ? '#3b82f6' : // blue
                      percentage >= 60 ? '#eab308' : // yellow
                      '#ef4444'; // red

    const element: ReactElement = {
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
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '40px 60px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                maxWidth: '90%',
              },
              children: [
                {
                  type: 'div',
                  key: 'title',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#0f172a',
                      marginBottom: '20px',
                      textAlign: 'center',
                      lineHeight: '1.2',
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
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: `${score}/${total}`,
                  },
                },
                {
                  type: 'div',
                  key: 'message',
                  props: {
                    style: {
                      fontSize: '28px',
                      color: '#64748b',
                      textAlign: 'center',
                      maxWidth: '800px',
                      lineHeight: '1.4',
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

    const options: SatoriOptions = {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Arial',
          data: Buffer.from([]), // You'll need to load a font here
          weight: 400,
          style: 'normal',
        },
      ],
    };

    const svg = await satori(element, options);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.send(png);
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      error: 'Error generating image',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}