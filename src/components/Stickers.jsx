import { useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import { STICKERS, REACTIONS } from '../data/stickers.js';
import './Stickers.css';

export default function Stickers() {
  const root = useRef(null);
  const [drags, setDrags] = useState(0);

  useGSAP(
    () => {
      const board = root.current.querySelector('.stickers__board');

      // 1. stickers "slap on" when the board scrolls into view
      gsap.from('.sticker', {
        scale: 0,
        rotation: -90,
        duration: 0.5,
        ease: 'back.out(2)',
        stagger: { each: 0.08, from: 'random' },
        scrollTrigger: {
          trigger: board,
          start: 'top 65%',
          toggleActions: 'play none none reverse',
        },
      });

      // 2. each sticker's inner element gets its resting tilt…
      const inners = gsap.utils.toArray('.sticker__drag');
      inners.forEach((el, i) => gsap.set(el, { rotation: STICKERS[i].tilt }));

      // 3. …and becomes draggable
      const draggables = inners.map((el, i) =>
        Draggable.create(el, {
          type: 'x,y',
          bounds: board,
          onPress() {
            this.target.classList.add('is-dragging');
            gsap.to(this.target, { scale: 1.15, rotation: 0, duration: 0.2, ease: 'steps(3)' });
          },
          onRelease() {
            this.target.classList.remove('is-dragging');
            // spring home with a wobble
            gsap.to(this.target, {
              x: 0,
              y: 0,
              scale: 1,
              rotation: STICKERS[i].tilt,
              duration: 0.9,
              ease: 'elastic.out(1, 0.4)',
            });
          },
          onDragEnd() {
            setDrags((n) => n + 1);
          },
        })[0]
      );

      return () => draggables.forEach((d) => d.kill());
    },
    { scope: root }
  );

  const reaction = REACTIONS[Math.min(drags, REACTIONS.length - 1)];

  return (
    <section className="level stickers" ref={root}>
      <div className="stickers__inner">
        <h2 className="stickers__title">
          <span className="stickers__level">level 4</span>
          sticker book
        </h2>

        <div className="stickers__board pixel-box">
          {STICKERS.map((s) => (
            <div key={s.id} className="sticker" style={{ '--x': `${s.x}%`, '--y': `${s.y}%` }}>
              <div className="sticker__drag">
                <img src={s.img} alt="" draggable="false" />
              </div>
            </div>
          ))}
        </div>

        <p className="stickers__hint" aria-live="polite">
          {reaction}
        </p>
      </div>
    </section>
  );
}