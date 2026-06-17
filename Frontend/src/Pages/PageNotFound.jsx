import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, SearchIcon, BookOpenIcon, PenToolIcon } from 'lucide-react';

const PageNotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const isDark = savedMode === null ? true : savedMode === 'true';
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md mx-auto text-center">
        <p className="text-6xl font-semibold tracking-tight text-foreground mb-4">404</p>
        <h1 className="text-xl font-semibold text-foreground mb-2">Page not found</h1>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex items-center justify-center gap-3 mb-10">
          <Link
            to="/"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <HomeIcon className="h-4 w-4" />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-sm font-medium text-foreground mb-4">While you're here</p>
          <div className="grid grid-cols-3 gap-3">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-primary/40 transition-colors"
            >
              <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Explore</span>
            </Link>
            <Link
              to="/add-blog"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-primary/40 transition-colors"
            >
              <PenToolIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Write</span>
            </Link>
            <Link
              to="/signup"
              className="flex flex-col items-center gap-2 p-4 border border-border rounded-lg hover:border-primary/40 transition-colors"
            >
              <SearchIcon className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Join</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;