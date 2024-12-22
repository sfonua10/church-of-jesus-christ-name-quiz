export async function loadGoogleFont(font: string): Promise<Buffer> {
    const API = `https://fonts.googleapis.com/css2?family=${font}`;
  
    const css = await fetch(API).then((res) => res.text());
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/)?.[1];
  
    if (!resource) {
      throw new Error('Failed to load font');
    }
  
    const fontData = await fetch(resource).then((res) => res.arrayBuffer());
    
    return Buffer.from(fontData);
  }