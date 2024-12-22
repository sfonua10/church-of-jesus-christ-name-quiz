import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';

interface ShareButtonProps {
  score: number;
  total: number;
  message: string;
}

export default function ShareButton({ score, total, message }: ShareButtonProps) {
  const [shareCount, setShareCount] = useState({ facebook: 0, twitter: 0, system: 0 });
  const [isSharing, setIsSharing] = useState(false);

  const generateShareUrl = () => {
    // Get the current URL without any query parameters
    const baseUrl = window.location.origin + window.location.pathname;
    // Add our query parameters for OG image generation
    const queryParams = new URLSearchParams({
      score: score.toString(),
      total: total.toString(),
      message: message
    }).toString();
    return `${baseUrl}?${queryParams}`;
  };

  const shareText = `I scored ${score}/${total} on the Church Name Quiz! ${message}`;

  const trackShare = (platform: 'facebook' | 'twitter' | 'system') => {
    // Track share event with Vercel Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'quiz_result',
        score: score,
        platform: platform
      });
    }
    setShareCount(prev => ({
      ...prev,
      [platform]: prev[platform] + 1
    }));
  };

  const handleNativeShare = async () => {
    try {
      setIsSharing(true);
      const shareUrl = generateShareUrl();
      await navigator.share({
        title: 'Church Name Quiz Results',
        text: shareText,
        url: shareUrl,
      });
      trackShare('system');
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleFacebookShare = () => {
    setIsSharing(true);
    const shareUrl = generateShareUrl();
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(shareText)}`;
    window.open(fbShareUrl, '_blank', 'width=600,height=400');
    trackShare('facebook');
    setIsSharing(false);
  };

  const handleTwitterShare = () => {
    setIsSharing(true);
    const shareUrl = generateShareUrl();
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterShareUrl, '_blank', 'width=600,height=400');
    trackShare('twitter');
    setIsSharing(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <Analytics />
      <button
        onClick={handleFacebookShare}
        disabled={isSharing}
        className="px-6 py-2 bg-[#1877F2] text-white rounded hover:bg-[#166FE5] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 011-1h3v-4h-3a5 5 0 00-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
        </svg>
        {isSharing ? 'Sharing...' : 'Share on Facebook'}
      </button>

      <button
        onClick={handleTwitterShare}
        disabled={isSharing}
        className="px-6 py-2 bg-[#1DA1F2] text-white rounded hover:bg-[#1a90da] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
        {isSharing ? 'Sharing...' : 'Share on Twitter'}
      </button>

      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          onClick={handleNativeShare}
          disabled={isSharing}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          {isSharing ? 'Sharing...' : 'Share via System'}
        </button>
      )}
    </div>
  );
}