import React from 'react';
import { CalendarIcon, EyeIcon, HeartIcon, ShareIcon, BookmarkIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import ShareMenu from './ShareMenu';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogHeader = ({
  blog, isAuthor, isLiked, likeCount, onLike,
  isSaved, saveLoading, onSave,
  showShareMenu, setShowShareMenu, onShare, copySuccess,
}) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <ProfileAvatar user={blog.createdBy} />
          <div>
            <p className="font-medium text-sm text-foreground">
              {blog.createdBy?.fullName || blog.createdBy?.name || 'Anonymous'}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDate(blog.createdAt)}
              </div>
              {blog.views && (
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-3.5 w-3.5" />
                  {blog.views} views
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onLike}
            disabled={isAuthor}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm transition-colors ${
              isAuthor
                ? 'text-muted-foreground bg-secondary cursor-default'
                : isLiked
                ? 'text-destructive bg-destructive/10'
                : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <HeartIcon className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
            {likeCount}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="p-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
            {showShareMenu && (
              <ShareMenu onShare={onShare} copySuccess={copySuccess} onClose={() => setShowShareMenu(false)} />
            )}
          </div>

          <button
            onClick={onSave}
            disabled={saveLoading}
            className={`p-2 rounded-md transition-colors disabled:opacity-50 ${
              isSaved ? 'text-foreground bg-secondary' : 'text-muted-foreground hover:bg-secondary'
            }`}
          >
            <BookmarkIcon className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;