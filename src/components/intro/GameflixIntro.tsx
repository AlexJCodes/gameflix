import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import GameflixLogo from "../../assets/branding/gameflix-logo.svg?react";

gsap.registerPlugin(useGSAP);

// Letter boundaries from the original 205 × 58 Gameflix SVG.
const letterRegions = [
  { x: 30, width: 22.5 }, // G
  { x: 52.5, width: 25 }, // A
  { x: 77.5, width: 27 }, // M
  { x: 104.5, width: 22 }, // E
  { x: 126.5, width: 22 }, // F
  { x: 148.5, width: 21.5 }, // L
  { x: 170, width: 11.5 }, // I
  { x: 181.5, width: 23.5 }, // X
];

type GameflixIntroProps = {
  onComplete: () => void;
};

export function GameflixIntro({ onComplete }: GameflixIntroProps) {
  const containerRef = useRef<HTMLElement>(null);
  const finishedRef = useRef(false);

  function finishIntro() {
    if (finishedRef.current) return;

    finishedRef.current = true;
    onComplete();
  }

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reducedMotion) {
        const timeout = window.setTimeout(finishIntro, 0);
        return () => window.clearTimeout(timeout);
      }

      const stage = container.querySelector("[data-intro-stage]");
      const glow = container.querySelector("[data-intro-glow]");
      const svg = stage?.querySelector("svg");

      const icon = svg?.querySelector<SVGGElement>("g g");
      const paths = svg ? Array.from(svg.querySelectorAll<SVGPathElement>("path")) : [];

      // The second path contains the entire GAMEFLIX wordmark.
      const wordmark = paths.length === 2 ? paths[1] : null;

      if (!stage || !glow || !svg || !icon || !wordmark) {
        console.error("[Gameflix] Invalid logo SVG structure.");

        const timeout = window.setTimeout(finishIntro, 0);
        return () => window.clearTimeout(timeout);
      }

      // Create an SVG clipping region for each letter.
      const namespace = "http://www.w3.org/2000/svg";
      const maskId = "gameflix-intro-letters";

      const defs = document.createElementNS(namespace, "defs");
      const clipPath = document.createElementNS(namespace, "clipPath");

      clipPath.setAttribute("id", maskId);
      clipPath.setAttribute("clipPathUnits", "userSpaceOnUse");

      const letterRects = letterRegions.map(({ x }) => {
        const rect = document.createElementNS(namespace, "rect");

        rect.setAttribute("x", String(x));
        rect.setAttribute("y", "0");
        rect.setAttribute("width", "0");
        rect.setAttribute("height", "58");

        clipPath.appendChild(rect);
        return rect;
      });

      defs.appendChild(clipPath);
      svg.appendChild(defs);

      const previousClipPath = wordmark.getAttribute("clip-path");
      wordmark.setAttribute("clip-path", `url(#${maskId})`);

      // Initial appearance.
      gsap.set(icon, {
        autoAlpha: 0,
        x: 86,
        scale: 0.8,
        transformOrigin: "50% 50%",
      });

      gsap.set(glow, {
        autoAlpha: 0,
        scale: 0.6,
      });

      gsap.set(stage, {
        autoAlpha: 1,
        scale: 1,
      });

      // Main cinematic sequence.
      const timeline = gsap.timeline({
        onComplete: finishIntro,
      });

      timeline
        // Red icon appears.
        .to(icon, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.3,
          ease: "power3.out",
        })

        // Icon glow.
        .to(
          glow,
          {
            autoAlpha: 0.6,
            scale: 1.25,
            duration: 0.4,
          },
          "<",
        )

        // Pulse.
        .to(icon, {
          scale: 1.28,
          duration: 0.14,
          ease: "power2.out",
        })
        .to(icon, {
          scale: 1,
          duration: 0.22,
          ease: "power2.inOut",
        })

        // Move icon into place.
        .to(icon, {
          x: 0,
          duration: 0.42,
          ease: "power3.inOut",
        })

        // Reveal the letters from left to right.
        .to(
          letterRects,
          {
            attr: {
              width: (index: number) => letterRegions[index].width,
            },
            duration: 0.28,
            stagger: 0.12,
            ease: "power2.out",
          },
          "-=0.08",
        )

        // Subtle white glow on the completed wordmark.
        .to(
          wordmark,
          {
            filter: "drop-shadow(0 0 5px rgba(246,242,236,0.35))",
            duration: 0.22,
          },
          "-=0.2",
        )

        // Red atmospheric glow fades away.
        .to(
          glow,
          {
            autoAlpha: 0,
            duration: 0.35,
          },
          "-=0.15",
        )

        // Fade into Home.
        .to(
          stage,
          {
            autoAlpha: 0,
            scale: 1.04,
            duration: 0.32,
            ease: "power2.in",
          },
          "+=0.18",
        );

      // Restore SVG when the component unmounts.
      return () => {
        if (previousClipPath === null) {
          wordmark.removeAttribute("clip-path");
        } else {
          wordmark.setAttribute("clip-path", previousClipPath);
        }

        defs.remove();
      };
    },
    {
      scope: containerRef,
      dependencies: [onComplete],
      revertOnUpdate: true,
    },
  );

  return (
    <main
      ref={containerRef}
      aria-label="Gameflix intro"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background"
    >
      <div
        data-intro-glow
        aria-hidden="true"
        className="pointer-events-none absolute size-72 rounded-full bg-brand/30 blur-3xl sm:size-96"
      />

      <div data-intro-stage className="relative w-64 max-w-[85vw] sm:w-96">
        <GameflixLogo role="img" aria-label="Gameflix" className="h-auto w-full" />
      </div>

      <button
        type="button"
        onClick={finishIntro}
        className="absolute right-6 bottom-8 rounded-md px-4 py-3 font-body text-body-sm text-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
      >
        Skip intro
      </button>
    </main>
  );
}
