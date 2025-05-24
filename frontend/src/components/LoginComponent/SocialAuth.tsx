import * as React from 'react';
import type { SocialAuthProps } from '../../types/AuthType';

export const SocialAuth: React.FC<SocialAuthProps> = ({ imageUrl, provider, onClick }) => (
  <button
    onClick={onClick}
    className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    aria-label={`Sign in with ${provider}`}
  >
    <img
      src={imageUrl}
      alt={`${provider} login`}
      className="object-contain shrink-0 w-6 aspect-square hover:opacity-80 transition-opacity"
    />
  </button>
);