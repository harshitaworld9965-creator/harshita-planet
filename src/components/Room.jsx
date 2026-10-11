import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SPOTS, GLOWS } from '../data/room.js';
import './Room.css';

export default function Room() {
  const root = useRef(null);

    useGSAP(
    () => {
      const track = root.current.querySelector('.room__track');
      const bar = root.current.querySelector('.room__bar-fill');

      // clientWidth = visible width WITHOUT the scrollbar (innerWidth includes it)
      const distance = () =>
        Math.max(0, track.scrollWidth - document.documentElement.clientWidth);

      // 1. the horizontal scroll itself
      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',        // ← this one stays 'top top'
          end: () => '+=' + distance(),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set(bar, { scaleX: self.progress }),
        },
      });

      // 2. each label pops up when its pin slides into view
      gsap.utils.toArray('.spot').forEach((spot) => {
        gsap.from(spot.querySelector('.spot__label'), {
          scale: 0,
          opacity: 0,
          duration: 0.4,
          ease: 'steps(4)',
          scrollTrigger: {
            trigger: spot,
            containerAnimation: scrollTween,
            start: 'left right',   // ← this is the one that changed
            toggleActions: 'play none none reverse',
            // markers: true,      // uncomment to see where each trigger fires
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section className="level room" ref={root}>
      <div className="room__track">
        <img className="room__img" src="/img/room.webp" alt="a cosy pixel bedroom at night" />

        {GLOWS.map((g) => (
          <span
            key={g.id}
            className="room__glow"
            aria-hidden="true"
            style={{ '--x': `${g.x}%`, '--y': `${g.y}%`, '--w': `${g.w}%`, '--h': `${g.h}%` }}
          />
        ))}

        {SPOTS.map((s) => (
          <div key={s.id} className="spot" style={{ '--x': `${s.x}%`, '--y': `${s.y}%` }}>
            <span className="spot__dot" aria-hidden="true" />
            <span className="spot__label pixel-box">{s.text}</span>
          </div>
        ))}
      </div>

      <p className="room__label">level 3 — my room <span>scroll →</span></p>

      <div className="room__bar pixel-box" aria-hidden="true">
        <div className="room__bar-fill" />
      </div>
    </section>
  );
}