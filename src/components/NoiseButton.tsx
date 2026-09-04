import { ReactNode } from 'react';

interface NoiseButtonProps {
  children: ReactNode;
  href?: string;
  size?: 'md' | 'lg';
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  target?: string;
  rel?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default function NoiseButton({
  children,
  href,
  size = 'md',
  loading = false,
  onClick,
  className = '',
  target,
  rel,
  type = 'button',
  disabled = false,
}: NoiseButtonProps) {
  const innerClass = `noise-btn-inner size-${size}`;

  const content = (
    <div className={innerClass}>
      {loading ? (
        <div className="sq-loader">
          <span className="sq" />
          <span className="sq" />
          <span className="sq" />
        </div>
      ) : (
        children
      )}
    </div>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={`noise-btn ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`noise-btn ${className}`}
    >
      {content}
    </button>
  );
}
