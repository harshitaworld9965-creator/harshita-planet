import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LOVES } from '../data/loves.js';
import './Loves.css';

export default function Loves() {
  const root = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=200%',
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.from('.loves__title', { yPercent: 100, opacity: 0, duration: 0.5, ease: 'steps(4)' })
        .from(
          '.love',
          {
            // function values: GSAP calls these once per card, with its index
            x: (i) => LOVES[i].from[0] * window.innerWidth,
            y: (i) => LOVES[i].from[1] * window.innerHeight,
            rotation: () => gsap.utils.random(-120, 120),
            scale: 0.4,
            duration: 1,
            stagger: 0.35,
            ease: 'back.out(1.4)',
          },
          '<0.2'
        );
    },
    { scope: root }
  );

  return (
    <section className="level loves" ref={root}>
      <div className="loves__inner">
        <h2 className="loves__title">
          <span className="loves__level">level 2</span>
          things i love
        </h2>

        <ul className="loves__grid">
          {LOVES.map((love, i) => (
            <li key={love.id} className="love">
              <figure
                className="love__card pixel-box"
                style={{ '--tilt': `${love.tilt}deg`, '--delay': `${i * -0.4}s` }}
              >
                <img className="love__img" src={love.img} alt="" />
                <figcaption className="love__caption">{love.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}