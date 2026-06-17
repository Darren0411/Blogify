import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const HeroSection = () => {
  return (
    <div className="w-full border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32 text-center">
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
  );
};

export default HeroSection;