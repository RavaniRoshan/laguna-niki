import { useState, FormEvent } from 'react';
import { CommentItem } from '../types';

interface CommentsWidgetProps {
  siteKey: string;
  pageId: string;
  title?: string;
  subtitle?: string;
  initialComments?: CommentItem[];
  allowAnonymous?: boolean;
}

export const HERO_INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    author: 'Sanjeeb Kumar',
    avatarText: 'SK',
    avatarBg: '#E8642C',
    timeAgo: '2 hours ago',
    content: 'Nice level design! Got all 15 gems on Foothills and found the hidden staircase 💎',
    upvotes: 8,
    downvotes: 0,
    isEdited: false,
    replies: [
      {
        id: 'c1-1',
        author: 'cmmnts dev',
        avatarText: 'CD',
        avatarBg: '#3B82F6',
        timeAgo: '1 hour ago',
        content: 'Thanks Sanjeeb! Try out Chimney and Sieve next, wall-jumps get intense.',
        upvotes: 4,
        downvotes: 0,
      },
    ],
  },
  {
    id: 'c2',
    author: 'saad chraibi',
    avatarText: 'SC',
    avatarBg: '#2F9E5B',
    timeAgo: '5 hours ago',
    content: 'Wall jumping feels so crisp. The 6-tick coyote time really makes it feel like Celeste.',
    upvotes: 6,
    downvotes: 0,
    isEdited: true,
  },
  {
    id: 'c3',
    author: 'Boris',
    avatarText: 'B',
    avatarBg: '#8B5CF6',
    timeAgo: '1 day ago',
    content: 'Loving the paper-editorial aesthetic with the orange accents and dotted grid.',
    upvotes: 5,
    downvotes: 0,
  },
  {
    id: 'c4',
    author: 'Elena V.',
    avatarText: 'EV',
    avatarBg: '#DB2777',
    timeAgo: '2 days ago',
    content: 'Super smooth double jump. Reached stage 7! Great work.',
    upvotes: 3,
    downvotes: 0,
  },
  {
    id: 'c5',
    author: 'alex_dev',
    avatarText: 'AD',
    avatarBg: '#D97706',
    timeAgo: '3 days ago',
    content: 'Wait, the whole widget is only 38KB? Definitely replacing Disqus with this.',
    upvotes: 11,
    downvotes: 0,
  },
];

export const TRY_INITIAL_COMMENTS: CommentItem[] = [
  {
    id: 't-pin',
    author: 'cmmnts admin',
    avatarText: 'CA',
    avatarBg: '#E8642C',
    timeAgo: 'Pinned',
    content: 'You can discuss anything here. Leave feedback, test markdown, or drop an emoji!',
    upvotes: 24,
    downvotes: 0,
    isPinned: true,
  },
  {
    id: 't-1',
    author: 'Rohan Gupta',
    avatarText: 'RG',
    avatarBg: '#3B82F6',
    timeAgo: '35 mins ago',
    content: 'nicee 🔥 love the zero-bundle overhead',
    upvotes: 4,
    downvotes: 0,
  },
  {
    id: 't-2',
    author: 'Vikram S.',
    avatarText: 'VS',
    avatarBg: '#0D9488',
    timeAgo: '2 hours ago',
    content: 'good bhai !! Cleanest comments UI I have seen in a while',
    upvotes: 7,
    downvotes: 0,
  },
  {
    id: 't-3',
    author: 'Anonymous',
    avatarText: '?',
    avatarBg: '#6B6560',
    timeAgo: '4 hours ago',
    content: 'Ok ok works well even without sign-in 👍',
    upvotes: 2,
    downvotes: 0,
  },
];

export default function CommentsWidget({
  siteKey,
  pageId,
  title = 'Did you like the game?',
  subtitle = 'Sign in to join the conversation.',
  initialComments = HERO_INITIAL_COMMENTS,
}: CommentsWidgetProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [composerText, setComposerText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const handleVote = (commentId: string, isUp: boolean, isReply = false, parentId?: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (!isReply && c.id === commentId) {
          const currentVote = c.userVote;
          let newVote: 'up' | 'down' | null = isUp ? 'up' : 'down';
          let upDiff = 0;
          let downDiff = 0;

          if (currentVote === newVote) {
            newVote = null;
            if (isUp) upDiff = -1;
            else downDiff = -1;
          } else if (currentVote === 'up') {
            upDiff = -1;
            downDiff = 1;
          } else if (currentVote === 'down') {
            upDiff = 1;
            downDiff = -1;
          } else {
            if (isUp) upDiff = 1;
            else downDiff = 1;
          }

          return {
            ...c,
            upvotes: Math.max(0, c.upvotes + upDiff),
            downvotes: Math.max(0, c.downvotes + downDiff),
            userVote: newVote,
          };
        }

        if (isReply && c.id === parentId && c.replies) {
          return {
            ...c,
            replies: c.replies.map((r) => {
              if (r.id === commentId) {
                const currentVote = r.userVote;
                let newVote: 'up' | 'down' | null = isUp ? 'up' : 'down';
                let upDiff = 0;
                let downDiff = 0;

                if (currentVote === newVote) {
                  newVote = null;
                  if (isUp) upDiff = -1;
                  else downDiff = -1;
                } else if (currentVote === 'up') {
                  upDiff = -1;
                  downDiff = 1;
                } else if (currentVote === 'down') {
                  upDiff = 1;
                  downDiff = -1;
                } else {
                  if (isUp) upDiff = 1;
                  else downDiff = 1;
                }

                return {
                  ...r,
                  upvotes: Math.max(0, r.upvotes + upDiff),
                  downvotes: Math.max(0, r.downvotes + downDiff),
                  userVote: newVote,
                };
              }
              return r;
            }),
          };
        }

        return c;
      })
    );
  };

  const handleAddComment = (e: FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const name = authorName.trim() || 'Visitor';
      const initials = name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const newC: CommentItem = {
        id: 'new-' + Date.now(),
        author: name,
        avatarText: initials,
        avatarBg: '#E8642C',
        timeAgo: 'Just now',
        content: composerText.trim(),
        upvotes: 1,
        downvotes: 0,
        userVote: 'up',
      };

      setComments((prev) => [newC, ...prev]);
      setComposerText('');
      setIsSubmitting(false);
    }, 250);
  };

  const handleAddReply = (parentId: string) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === parentId) {
          const newReply: CommentItem = {
            id: 'rep-' + Date.now(),
            author: authorName.trim() || 'You',
            avatarText: (authorName.trim() || 'Y').slice(0, 2).toUpperCase(),
            avatarBg: '#4F46E5',
            timeAgo: 'Just now',
            content: replyText.trim(),
            upvotes: 0,
            downvotes: 0,
          };
          return {
            ...c,
            replies: [...(c.replies || []), newReply],
          };
        }
        return c;
      })
    );

    setReplyText('');
    setReplyingToId(null);
  };

  // Count total comments including replies
  const totalCount = comments.reduce(
    (sum, c) => sum + 1 + (c.replies?.length || 0),
    0
  );

  const displayedComments = [...comments].sort((a, b) => {
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;
    if (sortBy === 'oldest') return -1;
    return 1;
  });

  return (
    <div
      className="cmmnts-widget-container bg-[var(--sf-raised)] border border-dotted border-[var(--st)] p-4 sm:p-5 text-sm font-sans"
      data-site-key={siteKey}
      data-page-id={pageId}
    >
      {/* Header section */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dotted border-[var(--st-secondary)]">
        <div>
          <h3 className="font-semibold text-base text-[var(--tx)]">{title}</h3>
          <p className="text-xs text-[var(--tx-secondary)]">{subtitle}</p>
        </div>

        {/* Sort & count selector */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-[var(--tx-secondary)]">
            Comments <span className="text-[var(--tx)] font-semibold">{totalCount}</span>
          </span>
          <span className="text-[var(--st-secondary)]">·</span>
          <div className="inline-flex border border-dotted border-[var(--st)] p-0.5 bg-[var(--sf-secondary)]">
            <button
              type="button"
              onClick={() => setSortBy('recent')}
              className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                sortBy === 'recent'
                  ? 'bg-[var(--sf-raised)] font-medium text-[var(--tx)] shadow-xs'
                  : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
              }`}
            >
              Most recent
            </button>
            <button
              type="button"
              onClick={() => setSortBy('oldest')}
              className={`px-2 py-0.5 text-xs transition-colors cursor-pointer ${
                sortBy === 'oldest'
                  ? 'bg-[var(--sf-raised)] font-medium text-[var(--tx)] shadow-xs'
                  : 'text-[var(--tx-secondary)] hover:text-[var(--tx)]'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {/* Composer box */}
      <form onSubmit={handleAddComment} className="my-4">
        <div className="border border-dotted border-[var(--st)] bg-[var(--sf)] focus-within:border-[var(--accent-orange)] transition-colors p-2.5">
          <textarea
            rows={2}
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder="Write a comment... (markdown supported)"
            className="w-full bg-transparent border-none outline-none resize-none text-[var(--tx)] placeholder:text-[var(--tx-tertiary)] text-xs sm:text-sm font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dotted border-[var(--st-secondary)] text-xs">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name (optional)"
                className="bg-transparent border border-dotted border-[var(--st-secondary)] px-2 py-1 text-xs text-[var(--tx)] placeholder:text-[var(--tx-tertiary)] outline-none max-w-[140px]"
              />
              <button
                type="button"
                onClick={() => setShowSignInPrompt(!showSignInPrompt)}
                className="text-[var(--accent-orange)] hover:underline text-xs cursor-pointer"
              >
                Sign in options
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !composerText.trim()}
              className="noise-btn"
            >
              <div className="noise-btn-inner text-xs py-1 px-3">
                {isSubmitting ? (
                  <div className="sq-loader">
                    <span className="sq" />
                    <span className="sq" />
                    <span className="sq" />
                  </div>
                ) : (
                  'Comment'
                )}
              </div>
            </button>
          </div>
        </div>

        {showSignInPrompt && (
          <div className="mt-2 p-2.5 bg-[var(--sf-secondary)] border border-dotted border-[var(--st-secondary)] text-xs text-[var(--tx-secondary)] flex flex-wrap items-center justify-between gap-2">
            <span>Sign in with Google, GitHub or Microsoft Entra ID — or continue anonymously.</span>
            <button
              type="button"
              onClick={() => setShowSignInPrompt(false)}
              className="text-[var(--tx)] font-medium underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </form>

      {/* Comments thread list */}
      <div className="space-y-3.5 divide-y divide-dotted divide-[var(--st-secondary)]">
        {displayedComments.map((comment) => (
          <div key={comment.id} className="pt-3 first:pt-0">
            <div className="flex items-start gap-3">
              {/* Avatar circle with initials */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0 select-none shadow-xs"
                style={{ backgroundColor: comment.avatarBg || 'var(--accent-orange)' }}
              >
                {comment.avatarText}
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-[var(--tx)] text-xs sm:text-sm">
                    {comment.author}
                  </span>
                  {comment.isPinned && (
                    <span className="px-1.5 py-0.2 bg-[var(--accent-orange)] text-white text-[10px] font-semibold tracking-wider uppercase">
                      Pinned
                    </span>
                  )}
                  <span className="text-[11px] text-[var(--tx-tertiary)]">
                    {comment.timeAgo}
                  </span>
                  {comment.isEdited && (
                    <span className="text-[10px] text-[var(--tx-tertiary)] italic">
                      (edited)
                    </span>
                  )}
                </div>

                <div className="mt-1 text-[var(--tx)] text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </div>

                {/* Vote & Reply toolbar */}
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--tx-secondary)]">
                  {/* Upvote */}
                  <button
                    type="button"
                    onClick={() => handleVote(comment.id, true)}
                    className={`inline-flex items-center gap-1 hover:text-[var(--tx)] cursor-pointer transition-colors ${
                      comment.userVote === 'up' ? 'text-[var(--accent-orange)] font-semibold' : ''
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    <span>{comment.upvotes}</span>
                  </button>

                  {/* Downvote */}
                  <button
                    type="button"
                    onClick={() => handleVote(comment.id, false)}
                    className={`inline-flex items-center gap-1 hover:text-[var(--tx)] cursor-pointer transition-colors ${
                      comment.userVote === 'down' ? 'text-[var(--accent-blue)] font-semibold' : ''
                    }`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    {comment.downvotes > 0 && <span>{comment.downvotes}</span>}
                  </button>

                  <span className="text-[var(--st-secondary)]">·</span>

                  {/* Reply button */}
                  <button
                    type="button"
                    onClick={() =>
                      setReplyingToId(replyingToId === comment.id ? null : comment.id)
                    }
                    className="hover:text-[var(--tx)] cursor-pointer underline text-[11px]"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply composer */}
                {replyingToId === comment.id && (
                  <div className="mt-2.5 p-2 bg-[var(--sf-secondary)] border border-dotted border-[var(--st-secondary)]">
                    <textarea
                      rows={2}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${comment.author}...`}
                      className="w-full bg-transparent border-none outline-none text-xs text-[var(--tx)] resize-none"
                    />
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <button
                        type="button"
                        onClick={() => setReplyingToId(null)}
                        className="text-xs text-[var(--tx-secondary)] hover:text-[var(--tx)] cursor-pointer px-2 py-1"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAddReply(comment.id)}
                        className="noise-btn"
                      >
                        <div className="noise-btn-inner text-[11px] py-0.5 px-2">
                          Send reply
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 pl-3 border-l-2 border-dotted border-[var(--st-secondary)] space-y-2.5">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2.5">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white shrink-0 select-none"
                          style={{ backgroundColor: reply.avatarBg || 'var(--seat-purple)' }}
                        >
                          {reply.avatarText}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[var(--tx)] text-xs">
                              {reply.author}
                            </span>
                            <span className="text-[10px] text-[var(--tx-tertiary)]">
                              {reply.timeAgo}
                            </span>
                          </div>
                          <div className="mt-0.5 text-xs text-[var(--tx)] leading-relaxed">
                            {reply.content}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--tx-secondary)]">
                            <button
                              type="button"
                              onClick={() => handleVote(reply.id, true, true, comment.id)}
                              className={`inline-flex items-center gap-1 hover:text-[var(--tx)] cursor-pointer ${
                                reply.userVote === 'up' ? 'text-[var(--accent-orange)] font-semibold' : ''
                              }`}
                            >
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="18 15 12 9 6 15" />
                              </svg>
                              <span>{reply.upvotes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Powered by cmmnts badge */}
      <div className="mt-5 pt-3 border-t border-dotted border-[var(--st-secondary)] flex items-center justify-between text-[11px] text-[var(--tx-secondary)]">
        <span>38 KB · Shadow DOM · Zero cookie PKCE</span>
        <a
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-[var(--tx)] font-medium transition-colors"
        >
          <span>Powered by</span>
          <span className="font-semibold text-[var(--tx)] tracking-wide">cmmnts</span>
        </a>
      </div>
    </div>
  );
}
