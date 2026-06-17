import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleIcon, SendIcon, InfoIcon } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const CommentsSection = ({
  comments, user, isAuthor,
  commentContent, setCommentContent, commentLoading, onSubmit,
}) => {
  return (
    <div className="mt-8 bg-card border border-border rounded-lg p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h2>
      </div>

      {user ? (
        isAuthor ? (
          <div className="mb-8 p-4 bg-secondary rounded-lg flex items-center gap-2 text-sm text-foreground">
            <InfoIcon className="h-4 w-4 flex-shrink-0" />
            You cannot comment on your own blog
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mb-8">
            <div className="flex gap-3">
              <ProfileAvatar user={user} />
              <div className="flex-1">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  rows="3"
                  disabled={commentLoading}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={commentLoading || !commentContent.trim()}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    <SendIcon className="h-3.5 w-3.5" />
                    {commentLoading ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )
      ) : (
        <div className="mb-8 p-4 bg-secondary rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-3">Please log in to post a comment</p>
          <Link
            to="/login"
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Login
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircleIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3 p-4 bg-secondary rounded-lg">
              <ProfileAvatar user={comment.createdBy} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground">
                    {comment.createdBy?.fullName || comment.createdBy?.name || 'Anonymous'}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-foreground">{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;