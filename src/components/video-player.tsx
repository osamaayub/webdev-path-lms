"use client";

import { useState } from "react";
import { Icon } from "./icons";

/**
 * YouTube lesson player. Shows a lightweight thumbnail first and loads the
 * privacy-enhanced (youtube-nocookie) player only when the learner presses play,
 * so lesson pages stay fast and set no third-party cookies until then.
 */
export function VideoPlayer({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  // If the thumbnail can't load (blocked network, removed video), show the title instead of a broken image.
  const [thumbFailed, setThumbFailed] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-rule bg-black">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
          {thumbFailed ? (
            <span className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,var(--brand-soft),var(--card-2))] p-5 text-left text-lg font-bold text-ink sm:text-xl">{title}</span>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, allowed by CSP
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" onError={() => setThumbFailed(true)} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
          )}
          <span className="absolute inset-0 grid place-items-center">
            <span className="icon-tile h-16 w-16 rounded-full transition-transform group-hover:scale-105">
              <Icon name="play" size={26} />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
