import React from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';

const shareOptions = [
  { key: 'copy', label: 'Copy Link' },
  { key: 'twitter', label: 'Share on Twitter' },
  { key: 'facebook', label: 'Share on Facebook' },
  { key: 'linkedin', label: 'Share on LinkedIn' },
  { key: 'whatsapp', label: 'Share on WhatsApp' },
  { key: 'email', label: 'Share via Email' },
];

const ShareMenu = ({ onShare, copySuccess, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
        <div className="px-4 py-2 border-b border-border">
          <p className="text-sm font-medium text-foreground">Share this article</p>
        </div>
        <div className="py-1">
          {shareOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onShare(key)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
            >
              {key === 'copy' ? (
                copySuccess ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4 flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {label[12]?.toUpperCase() || '•'}
                </span>
              )}
              {key === 'copy' && copySuccess ? 'Copied!' : label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ShareMenu;