"use client";

import { useRef, useState } from "react";
import { Icon } from "./icons";

type Props = { id: string; title: string; provider?: "youtube" | "bunny" };

const embedUrl = (id: string, provider: Props["provider"]) =>
  provider === "bunny"
    ? `https://iframe.mediadelivery.net/embed/${id}?autoplay=true&preload=true&responsive=true`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

/**
 * Lesson player. Shows a light thumbnail first and loads the video player only when the
 * learner presses play, so pages stay fast and set no third-party cookies until then.
 * Works with YouTube (privacy-enhanced) and Bunny Stream.
 */
export function VideoPlayer({ id, title, provider = "youtube" }: Props) {
  const [playing, setPlaying] = useState(false);
  // If the thumbnail can't load (blocked network, removed video), show the title instead of a broken image.
  const [thumbFailed, setThumbFailed] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const thumb = provider === "youtube" ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;

  const fullscreen = () => {
    setPlaying(true);
    box.current?.requestFullscreen?.().catch(() => {});
  };

  return (
    <div>
      <div ref={box} id="lesson-video" className="relative aspect-video overflow-hidden rounded-2xl border border-rule bg-black">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedUrl(id, provider)}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${title}`}>
            {thumb && !thumbFailed ? (
              // eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, allowed by CSP
              <img src={thumb} alt="" loading="lazy" onError={() => setThumbFailed(true)} ref={(img) => { if (img?.complete && img.naturalWidth === 0) setThumbFailed(true); }} className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            ) : (
              <span className="absolute inset-0 flex items-end bg-[linear-gradient(135deg,var(--brand-soft),var(--card-2))] p-5 text-left text-lg font-bold text-ink sm:text-xl">{title}</span>
            )}
            <span className="absolute inset-0 grid place-items-center">
              <span className="icon-tile h-14 w-14 rounded-full transition-transform group-hover:scale-105 sm:h-16 sm:w-16">
                <Icon name="play" size={26} />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={fullscreen} className="btn-primary !px-3.5 !py-2 text-[14px]">
          <Icon name="expand" size={15} /> Fullscreen
        </button>
      </div>
    </div>
  );
}
