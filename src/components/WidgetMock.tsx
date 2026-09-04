import { useState, FormEvent } from 'react';

export interface MockComment {
  id: string;
  author: string;
  avatarColor?: string;
  timeAgo: string;
  text: string;
  votes: number;
  edited?: boolean;
  pinned?: boolean;
  replies?: MockComment[];
}

export const HERO_SEED_COMMENTS: MockComment[] = [
  {
    id: 'c1',
    author: 'saad chraibi',
    timeAgo: '4 days ago',
    text: "That's really great!",
    votes: 10,
  },
  {
    id: 'c2',
    author: 'Sanjeeb Kumar',
    timeAgo: '4 days ago',
    text: 'Check out the experiments in the Lab tab!',
    votes: 14,
    replies: [
      {
        id: 'c2-r1',
        author: 'Boris',
        timeAgo: '3 days ago',
        text: '@Sanjeeb Kumar good!',
        votes: 4,
      },
    ],
  },
  {
    id: 'c3',
    author: 'Sanjeeb Kumar Sahoo',
    timeAgo: '4 days ago',
    text: 'Absolutely!',
    votes: 3,
    replies: [
      {
        id: 'c3-r1',
        author: 'Sanjeeb Kumar',
        timeAgo: '3 days ago',
        text: 'Biased..😂',
        votes: 2,
        edited: true,
      },
    ],
  },
];

export const TRY_SEED_COMMENTS: MockComment[] = [
  {
    id: 't1',
    author: 'cmmnts team',
    timeAgo: '1 week ago',
    text: 'You can discuss anything here.',
    votes: 42,
    pinned: true,
  },
  {
    id: 't2',
    author: 'Aditya Pal',
    timeAgo: '2 days ago',
    text: 'nicee 🔥',
    votes: 8,
  },
  {
    id: 't3',
    author: 'goutham',
    timeAgo: '1 day ago',
    text: 'good bhai !!',
    votes: 5,
  },
  {
    id: 't4',
    author: 'mr imperfect',
    timeAgo: '5 hours ago',
    text: 'Ok ok',
    votes: 1,
  },
];

interface WidgetMockProps {
  pageId: 'hero' | 'try-it-out';
  title?: string;
  initialComments?: MockComment[];
  className?: string;
}

export default function WidgetMock({
  pageId,
  title = pageId === 'hero' ? 'Did you like the game?' : undefined,
  initialComments = pageId === 'hero' ? HERO_SEED_COMMENTS : TRY_SEED_COMMENTS,
  className = '',
}: WidgetMockProps) {
  const [comments, setComments] = useState<MockComment[]>(initialComments);
  const [sortBy, setSortBy] = useState<'recent' | 'oldest'>('recent');
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [composerText, setComposerText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Count total comments including replies
  const totalCount = comments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0);

  const handleVote = (id: string, delta: number) => {
    const current = userVotes[id] || 0;
    if (current === delta) {
      // Undo vote
      setUserVotes((prev) => ({ ...prev, [id]: 0 }));
      updateCommentVotes(id, -delta);
    } else {
      const netDelta = delta - current;
      setUserVotes((prev) => ({ ...prev, [id]: delta }));
      updateCommentVotes(id, netDelta);
    }
  };

  const updateCommentVotes = (id: string, delta: number) => {
    setComments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, votes: item.votes + delta };
        }
        if (item.replies) {
          return {
            ...item,
            replies: item.replies.map((r) =>
              r.id === id ? { ...r, votes: r.votes + delta } : r
            ),
          };
        }
        return item;
      })
    );
  };

  const handlePost = (e: FormEvent) => {
    e.preventDefault();
    if (!composerText.trim()) return;

    setIsPosting(true);
    setTimeout(() => {
      const newComment: MockComment = {
        id: `c_${Date.now()}`,
        author: authorName.trim() || 'Guest Reader',
        timeAgo: 'just now',
        text: composerText.trim(),
        votes: 1,
      };

      setComments((prev) => [newComment, ...prev]);
      setComposerText('');
      setIsPosting(false);
    }, 450);
  };

  const handlePostReply = (parentId: string, e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const newReply: MockComment = {
      id: `r_${Date.now()}`,
      author: replyAuthor.trim() || 'Guest Reader',
      timeAgo: 'just now',
      text: replyText.trim(),
      votes: 1,
    };

    setComments((prev) =>
      prev.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [...(item.replies || []), newReply],
          };
        }
        return item;
      })
    );

    setReplyText('');
    setReplyingToId(null);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'U';
  };

  return (
    <div
      className={`border border-dotted border-[var(--st)] bg-[var(--sf-raised)] p-4 sm:p-5 font-sans relative ${className}`}
    >
      <div className="joint-corner joint-tl" />
      <div className="joint-corner joint-tr" />
      <div className="joint-corner joint-bl" />
      <div className="joint-corner joint-br" />

      {/* Header if title present */}
      {title && (
        <div className="pb-3 mb-4 border-b border-dotted border-[var(--st-secondary)]">
          <h3 className="text-base sm:text-lg font-bold text-[var(--tx)]">{title}</h3>
          <p className="text-xs text-[var(--tx-secondary)] mt-0.5">
            Sign in to join the conversation.
          </p>
        </div>
      )}

      {/* Quick composer */}
      <form onSubmit={handlePost} className="mb-5 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name (e.g. Maya)"
            className="w-1/3 bg-[var(--sf)] border border-dotted border-[var(--st)] px-2.5 py-1.5 text-xs text-[var(--tx)] placeholder:text-[var(--tx-tertiary)] outline-none focus:border-[var(--accent-orange)]"
          />
          <input
            type="text"
            required
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 bg-[var(--sf)] border border-dotted border-[var(--st)] px-3 py-1.5 text-xs text-[var(--tx)] placeholder:text-[var(--tx-tertiary)] outline-none focus:border-[var(--accent-orange)]"
          />
          <button
            type="submit"
            disabled={isPosting || !composerText.trim()}
            className="noise-btn"
          >
            <div className="noise-btn-inner text-xs py-1 px-3">
              {isPosting ? (
                <div className="sq-loader">
                  <span className="sq" />
                  <span className="sq" />
                  <span className="sq" />
                </div>
              ) : (
                'Post'
              )}
            </div>
          </button>
        </div>
      </form>

      {/* Meta Bar: Comments {n} · Most recent | Oldest */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b border-dotted border-[var(--st-secondary)] text-xs text-[var(--tx-secondary)] font-mono">
        <div>
          <span>Comments {totalCount}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSortBy('recent')}
            className={`cursor-pointer hover:text-[var(--tx)] ${
              sortBy === 'recent' ? 'text-[var(--tx)] font-semibold underline' : ''
            }`}
          >
            Most recent
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setSortBy('oldest')}
            className={`cursor-pointer hover:text-[var(--tx)] ${
              sortBy === 'oldest' ? 'text-[var(--tx)] font-semibold underline' : ''
            }`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-3">
            {/* Main comment row */}
            <div className="flex items-start gap-3">
              {/* 36px circle avatar with initials */}
              <div className="w-[36px] h-[36px] rounded-full bg-[var(--sf-tertiary)] flex items-center justify-center text-[12px] font-mono font-bold text-[var(--tx)] shrink-0 border border-dotted border-[var(--st-secondary)]">
                {getInitials(comment.author)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-[var(--tx)]">{comment.author}</span>

                  {comment.pinned && (
                    <span className="px-1.5 py-0.2 bg-[var(--accent-orange)] text-white text-[10px] font-mono rounded-[1px] uppercase">
                      Pinned
                    </span>
                  )}

                  <span className="text-[var(--tx-tertiary)]">·</span>
                  <span className="text-[var(--tx-tertiary)]">{comment.timeAgo}</span>

                  {comment.edited && (
                    <span className="text-[10px] text-[var(--tx-tertiary)] italic">
                      (edited)
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-[var(--tx)] mt-1 font-sans leading-relaxed break-words">
                  {comment.text}
                </p>

                {/* Up/down counts and reply */}
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--tx-secondary)] font-mono">
                  <div className="flex items-center gap-1 border border-dotted border-[var(--st-secondary)] px-1.5 py-0.5 bg-[var(--sf)]">
                    <button
                      type="button"
                      onClick={() => handleVote(comment.id, 1)}
                      className={`hover:text-[var(--accent-orange)] cursor-pointer ${
                        userVotes[comment.id] === 1 ? 'text-[var(--accent-orange)] font-bold' : ''
                      }`}
                      title="Upvote"
                    >
                      ▲
                    </button>
                    <span>{comment.votes}</span>
                    <button
                      type="button"
                      onClick={() => handleVote(comment.id, -1)}
                      className={`hover:text-[var(--accent-red)] cursor-pointer ${
                        userVotes[comment.id] === -1 ? 'text-[var(--accent-red)] font-bold' : ''
                      }`}
                      title="Downvote"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setReplyingToId(replyingToId === comment.id ? null : comment.id)
                    }
                    className="hover:text-[var(--tx)] cursor-pointer underline"
                  >
                    Reply
                  </button>
                </div>

                {/* Reply Form */}
                {replyingToId === comment.id && (
                  <form
                    onSubmit={(e) => handlePostReply(comment.id, e)}
                    className="mt-2.5 p-2 bg-[var(--sf-secondary)] border border-dotted border-[var(--st)] space-y-1.5"
                  >
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyAuthor}
                        onChange={(e) => setReplyAuthor(e.target.value)}
                        placeholder="Your name"
                        className="w-1/3 bg-[var(--sf)] border border-dotted border-[var(--st)] px-2 py-1 text-xs text-[var(--tx)] outline-none"
                      />
                      <input
                        type="text"
                        required
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Reply to ${comment.author}...`}
                        className="flex-1 bg-[var(--sf)] border border-dotted border-[var(--st)] px-2 py-1 text-xs text-[var(--tx)] outline-none"
                      />
                      <button type="submit" className="outline-btn text-xs py-0.5 px-2.5">
                        Send
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Nested replies (indented 28px) */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-[28px] pl-3 border-l-2 border-dotted border-[var(--st-secondary)] space-y-3">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex items-start gap-2.5">
                    <div className="w-[28px] h-[28px] rounded-full bg-[var(--sf-tertiary)] flex items-center justify-center text-[10px] font-mono font-bold text-[var(--tx)] shrink-0 border border-dotted border-[var(--st-secondary)]">
                      {getInitials(reply.author)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-semibold text-[var(--tx)]">{reply.author}</span>
                        <span className="text-[var(--tx-tertiary)]">·</span>
                        <span className="text-[var(--tx-tertiary)]">{reply.timeAgo}</span>
                        {reply.edited && (
                          <span className="text-[10px] text-[var(--tx-tertiary)] italic">
                            (edited)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--tx)] mt-0.5 font-sans leading-relaxed break-words">
                        {reply.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[var(--tx-secondary)] font-mono">
                        <span className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleVote(reply.id, 1)}
                            className="cursor-pointer hover:text-[var(--accent-orange)]"
                          >
                            ▲
                          </button>
                          <span>{reply.votes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer "Powered by cmmnts" */}
      <div className="mt-5 pt-3 border-t border-dotted border-[var(--st-secondary)] flex items-center justify-between text-[10px] font-mono text-[var(--tx-tertiary)]">
        <a
          href="/"
          className="hover:text-[var(--accent-orange)] transition-colors no-underline text-[var(--tx-tertiary)]"
        >
          Powered by cmmnts
        </a>
        <span>Shadow DOM · 38 KB</span>
      </div>
    </div>
  );
}
