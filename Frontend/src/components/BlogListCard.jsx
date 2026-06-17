import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, HeartIcon, MessageCircleIcon, TrashIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogListCard = ({ blog, variant = 'saved', onRemove }) => {
  return (
    <div className="border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors bg-card">
      <div className="flex flex-col md:flex-row">
        {blog.coverImageURL && (
          <div className="w-full md:w-56 h-44 md:h-auto overflow-hidden flex-shrink-0">
            <img src={blog.coverImageURL} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 p-5">
          <div className="flex justify-between items-start gap-3 mb-3">
            <Link to={`/blog/${blog._id}`} className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                {blog.title}
              </h2>
            </Link>
            {variant === 'saved' && onRemove && (
              <button
                onClick={() => onRemove(blog._id)}
                title="Remove from saved"
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-secondary rounded-md transition-colors flex-shrink-0"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            {variant === 'saved' ? (
              <div className="flex items-center gap-2">
                <ProfileAvatar user={blog.createdBy} size="w-6 h-6" />
                <span>{blog.createdBy?.fullName || blog.createdBy?.name || 'Anonymous'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                Published {formatDate(blog.createdAt)}
              </div>
            )}
            <div className="flex items-center gap-1">
              <HeartIcon className="h-3.5 w-3.5" />
              {blog.likes || 0} likes
            </div>
            {variant === 'mine' && blog.comments && (
              <div className="flex items-center gap-1">
                <MessageCircleIcon className="h-3.5 w-3.5" />
                {blog.comments.length || 0} comments
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {blog.body?.substring(0, 160)}...
          </p>

          <div className="flex items-center justify-between">
            <Link
              to={`/blog/${blog._id}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {variant === 'saved' ? 'Read more' : 'View blog'}
            </Link>
            <span className="text-xs text-muted-foreground">
              {variant === 'mine' && blog.updatedAt !== blog.createdAt
                ? `Updated ${formatDate(blog.updatedAt)}`
                : variant === 'saved'
                ? `Saved on ${formatDate(blog.createdAt)}`
                : null}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListCard;