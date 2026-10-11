import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Hero.css';

const NAME = 'harshita';

// random star positions, made once when the component first mounts
function makeStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: [16, 24, 32][Math.floor(Math.random() * 3)],
  }));
}

export default function Hero() {
  const root = useRef(null);
  const [stars] = useState(() => makeStars(18));

  useGSAP(
    () => {
      // 1. intro: planet pops in, letters drop one by one
      const intro = gsap.timeline({ defaults: { ease: 'power2.out' } });
      intro
        .from('.hero__planet', {
          y: 120,
          scale: 0.6,
          opacity: 0,
          duration: 1.2,
          ease: 'back.out(1.6)',
        })
        .from(
          '.hero__letter',
          { yPercent: -200, opacity: 0, duration: 0.6, stagger: 0.07, ease: 'bounce.out' },
          '-=0.6'
        )
        .from('.hero__sub', { y: 10, opacity: 0, duration: 0.5 })
        .from('.hero__start', { opacity: 0, duration: 0.4 });

      // 2. idle float — steps() makes it move in chunky jumps, like a sprite
      gsap.to('.hero__planet', {
        y: -16,
        duration: 1.6,
        ease: 'steps(6)',
        yoyo: true,
        repeat: -1,
        delay: 1.2,
      });

      // 3. stars twinkle at random speeds, in random order
      gsap.to('.hero__star', {
        opacity: 0.2,
        duration: 'random(0.6, 1.6)',
        ease: 'steps(2)',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.15, from: 'random' },
      });

      // 4. clouds follow the mouse — deeper clouds move further (parallax)
      const movers = gsap.utils.toArray('.hero__cloud').map((el) => ({
        depth: Number(el.dataset.depth),
        x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' }),
      }));

      const onMove = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;  // -0.5 … 0.5
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach((m) => {
          m.x(nx * m.depth);
          m.y(ny * m.depth);
        });
      };
      window.addEventListener('pointermove', onMove);

      // 5. scroll away: planet shrinks up, text lifts and fades, clouds rise
      gsap
        .timeline({
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        })
        .to('.hero__planet-wrap', { y: -180, scale: 0.5, ease: 'none' }, 0)
        .to('.hero__text', { y: -120, opacity: 0, ease: 'none' }, 0)
        .to('.hero__cloud', { yPercent: -80, ease: 'none' }, 0);

      // cleanup the listener when the component unmounts
      return () => window.removeEventListener('pointermove', onMove);
    },
    { scope: root }
  );

  return (
    <section className="level hero" ref={root}>
      <div className="hero__stars" aria-hidden="true">
        {stars.map((s) => (
          <img
            key={s.id}
            className="hero__star"
            src="/img/star.png"
            alt=""
            style={{ top: `${s.top}%`, left: `${s.left}%`, width: s.size }}
          />
        ))}
      </div>

      <img className="hero__cloud hero__cloud--1" data-depth="40" src="/img/cloud-1.png" alt="" />
      <img className="hero__cloud hero__cloud--2" data-depth="70" src="/img/cloud-2.png" alt="" />
      <img className="hero__cloud hero__cloud--3" data-depth="110" src="/img/cloud-3.png" alt="" />

      <div className="hero__center">
        <div className="hero__planet-wrap">
          <img
            className="hero__planet"
            src="/img/planet.png"
            alt="a tiny pixel planet with a house and a tree"
          />
        </div>

        <div className="hero__text">
          <h1 className="hero__title" aria-label={NAME}>
            {NAME.split('').map((ch, i) => (
              <span key={i} className="hero__letter" aria-hidden="true">
                {ch}
              </span>
            ))}
          </h1>
          <p className="hero__sub">welcome to my little planet ✦ population: 1</p>
          <p className="hero__start">▼ scroll to start ▼</p>
        </div>
      </div>
    </section>
  );
}