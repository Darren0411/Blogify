import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Ferrofluid from '../Ferrofluid';

const HeroSection = () => {
  return (
    <div className="w-full relative overflow-hidden" style={{ height: '500px' }}>
      {/* Ferrofluid background */}
      <div className="absolute inset-0">
        <Ferrofluid
          colors={['#e5e5e5', '#e5e5e5', '#e5e5e5']}
          speed={0.4}
          scale={1.2}
          turbulence={0.8}
          fluidity={0.15}
          rimWidth={0.15}
          sharpness={2.5}
          shimmer={1}
          glow={1.5}
          flowDirection="up"
          opacity={0.35}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.3}
        />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6">
            Now live — share your story
          </Badge>

          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 leading-[1.1]">
            Where ideas
            <br />
            come alive
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            A focused space for writers and readers — no clutter, no noise.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              to="/add-blog"
              className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Start writing
            </Link>
            <Link
              to="#stories"
              className="inline-flex items-center px-6 py-3 rounded-md border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
            >
              Explore stories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;