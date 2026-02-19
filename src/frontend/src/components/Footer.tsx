import { SiX, SiFacebook, SiInstagram, SiYoutube } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'tesla-experience';

  return (
    <footer className="bg-[#111] text-center py-10 px-5">
      <div className="container mx-auto">
        <div className="flex justify-center gap-6 mb-6">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
          >
            <SiX size={24} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
          >
            <SiFacebook size={24} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
          >
            <SiInstagram size={24} />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-cyan transition-colors duration-300"
          >
            <SiYoutube size={24} />
          </a>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          &copy; {currentYear} Tesla, Inc. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm flex items-center justify-center gap-1">
          Built with <Heart size={14} className="text-cyan fill-cyan" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
