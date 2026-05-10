import { useState } from 'react';

/**
 * CharacterImage - Displays a character portrait with loading skeleton and fallback.
 *
 * Props:
 * - name: character short name (e.g. "Gojo")
 * - image: image URL/path
 * - size: "sm" | "md" | "lg" (default "md")
 * - glowColor: "cyan" | "red" | "green" | "none" (default "none")
 * - className: additional classes
 */

const SIZES = {
  sm: 'w-12 h-12 text-sm',
  md: 'w-24 h-24 text-xl',
  lg: 'w-32 h-32 text-2xl',
};

const GLOW_STYLES = {
  cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.3)] border-cyan-500/40',
  red: 'shadow-[0_0_20px_rgba(255,0,60,0.3)] border-red-500/40',
  green: 'shadow-[0_0_20px_rgba(0,255,136,0.3)] border-green-500/40',
  none: 'border-white/10',
};

export default function CharacterImage({ name, image, size = 'md', glowColor = 'none', className = '' }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const initials = name ? name.slice(0, 2).toUpperCase() : '??';
  const sizeClass = SIZES[size] || SIZES.md;
  const glowClass = GLOW_STYLES[glowColor] || GLOW_STYLES.none;

  return (
    <div className={`relative rounded-2xl overflow-hidden border-2 ${sizeClass} ${glowClass} ${className}`}>
      {/* Dark gradient background — ensures transparent PNGs look great on dark cards */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-700/80 via-zinc-800/90 to-zinc-900" />

      {/* Skeleton loader */}
      {!loaded && !failed && (
        <div className="absolute inset-0 bg-white/[0.04] animate-pulse flex items-center justify-center z-10">
          <span className="text-zinc-600 font-bold">{initials}</span>
        </div>
      )}

      {/* Fallback initials avatar */}
      {failed && (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center z-10">
          <span className="font-black text-zinc-400">{initials}</span>
        </div>
      )}

      {/* Actual image — uses object-cover with top alignment so face/head is always visible */}
      {!failed && (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-300 z-[1] ${loaded ? 'opacity-100' : 'opacity-0'}`}
          draggable={false}
        />
      )}
    </div>
  );
}
