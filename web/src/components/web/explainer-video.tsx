import { VIDEO } from "@/content/video";

/**
 * Vysvětlující video s titulky. Načte se až po spuštění (preload="none"), do té doby je
 * vidět jen náhled; celý text je pod videem i pro ty, kdo si ho pustit nemohou.
 */
export function ExplainerVideo() {
  const min = Math.floor(VIDEO.seconds / 60);
  const sec = String(VIDEO.seconds % 60).padStart(2, "0");
  return (
    <figure className="flex max-w-[960px] flex-col gap-3">
      <video
        controls
        preload="none"
        playsInline
        poster={VIDEO.poster}
        width={1280}
        height={720}
        aria-describedby="video-text"
        className="aspect-video h-auto w-full rounded-card border border-line bg-paper"
      >
        <source src={VIDEO.src} type="video/mp4" />
        <track kind="captions" src={VIDEO.captions} srcLang="cs" label="Čeština" default />
      </video>
      <figcaption className="text-[15px] text-muted">
        {min}:{sec} min, s titulky. {VIDEO.voice}
      </figcaption>
      <details id="video-text" className="group">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-semibold text-forest underline">Celý text videa</summary>
        <div className="mt-2 flex max-w-[44em] flex-col gap-3 text-[17px] leading-relaxed text-ink-2">
          {VIDEO.paragraphs.map((p) => (
            <p key={p[0]}>{p.join(" ")}</p>
          ))}
        </div>
      </details>
    </figure>
  );
}
