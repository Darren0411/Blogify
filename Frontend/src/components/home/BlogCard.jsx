import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const truncateText = (text = '', maxLength = 100) =>
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

const BlogCard = ({ blog }) => {
  return (
    <article className="border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors duration-200 bg-card">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={blog.coverImageURL}
          alt={blog.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        {blog.category && (
          <Badge variant="secondary" className="mb-2 text-xs">
            {blog.category}
          </Badge>
        )}
        <h3 className="text-base font-semibold text-foreground mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {truncateText(blog.body)}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-medium">
              {blog.createdBy?.fullName?.charAt(0) || '?'}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {blog.createdBy?.fullName || 'Unknown'}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
          <Link
            to={`/blog/${blog._id}`}
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Read <ArrowRightIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;