import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './DayNight.css';

// the greeting changes as the day goes on (until = timeline progress 0–1)
const PHASES = [
  { until: 0.25, text: 'good morning ☀' },
  { until: 0.5, text: 'lunch break' },
  { until: 0.72, text: 'golden hour' },
  { until: 1.01, text: 'goodnight ✦' },
];

// progress 0 → 6:00 am, progress 1 → 12:00 am, ticking in 10-minute steps
function formatTime(progress) {
  const total = 6 * 60 + Math.round(progress * 18 * 6) * 10;
  const h24 = Math.floor(total / 60) % 24;
  const m = total % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h24 < 12 ? 'am' : 'pm'}`;
}

function makeStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 55,
    left: Math.random() * 100,
    size: [12, 16, 24][Math.floor(Math.random() * 3)],
  }));
}

export default function DayNight() {
  const root = useRef(null);
  const [stars] = useState(() => makeStars(24));

  useGSAP(
    () => {
      const sky = root.current.querySelector('.dn__sky');
      const clock = root.current.querySelector('.dn__clock');
      const greet = root.current.querySelector('.dn__greet');
      const vw = () => window.innerWidth;
      const vh = () => window.innerHeight;

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=300%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
        // runs whenever the (smoothed) timeline moves — keeps the clock in sync with the sun
        onUpdate() {
          const p = this.progress();
          clock.textContent = formatTime(p);
          const phase = PHASES.find((ph) => p < ph.until);
          if (greet.textContent !== phase.text) greet.textContent = phase.text;
        },
      });

      // 1. sky + ground colours: tweening CSS variables
      tl.to(sky, { '--top': '#6ec3ff', '--bottom': '#bfe8ff', '--ground': '#6fd08f', duration: 1 }, 0)
        .to(sky, { '--top': '#6b4fa0', '--bottom': '#ff9e7a', '--ground': '#6b6a8f', duration: 1 }, 1.4)
        .to(sky, { '--top': '#1b1433', '--bottom': '#3a2560', '--ground': '#2a2a4a', duration: 1 }, 2.6);

      // 2. the sun's arc: outer slides across at a steady speed…
      tl.fromTo('.dn__sun', { x: () => vw() * 0.06 }, { x: () => vw() * 0.82, duration: 2.8 }, 0)
        // …while the inner rises (slowing at the top) then sinks (speeding up)
        .to('.dn__sun-body', { y: () => -vh() * 0.55, duration: 1.4, ease: 'sine.out' }, 0)
        .to('.dn__sun-body', { y: () => vh() * 0.2, duration: 1.4, ease: 'sine.in' }, 1.4);

      // 3. night: clouds dim, moon rises, stars appear
      tl.to('.dn__cloud', { autoAlpha: 0.2, duration: 0.8 }, 2.6)
        .fromTo(
          '.dn__moon',
          { y: () => vh() * 0.5, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, ease: 'power1.out' },
          2.8
        )        .to('.dn__star', { autoAlpha: 1, duration: 0.6, stagger: { each: 0.03, from: 'random' } }, 2.9)
        .to({}, { duration: 0.5 }); // empty tween = a little pause at night before unpinning
    },
    { scope: root }
  );

  return (
    <section className="level dn" ref={root}>
      <div className="dn__sky">
        <div className="dn__stars" aria-hidden="true">
          {stars.map((s) => (
            <img
              key={s.id}
              className="dn__star"
              src="/img/star.png"
              alt=""
              style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size }}
            />
          ))}
        </div>

        <div className="dn__cloud dn__cloud--1" aria-hidden="true">
          <img src="/img/cloud-1.png" alt="" />
        </div>
        <div className="dn__cloud dn__cloud--2" aria-hidden="true">
          <img src="/img/cloud-3.png" alt="" />
        </div>

        <div className="dn__sun" aria-hidden="true">
          <div className="dn__sun-body" />
        </div>

        <div className="dn__moon" aria-hidden="true" />

        <div className="dn__ground" aria-hidden="true" />

        <div className="dn__hud pixel-box">
          <p className="dn__level">level 5 — a day on the planet</p>
          <p className="dn__clock">6:00 am</p>
          <p className="dn__greet">good morning ☀</p>
        </div>
      </div>
    </section>
  );
}