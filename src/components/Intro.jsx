import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Intro.css';

// edit these freely — one box appears per line
const LINES = [
  "hi! i'm harshita ✦",
  'maths grad → law grad → now i make websites.',
  'i like soft colours, tiny animations and long walks (like this one).',
  'this is my little planet. have a look around!',
];

export default function Intro() {
  const root = useRef(null);

  useGSAP(
    () => {
      const walker = root.current.querySelector('.intro__walker');
      const girl = root.current.querySelector('.intro__girl');
      const boxes = gsap.utils.toArray('.intro__box');
      let stopTimer;

      gsap.set(boxes, { autoAlpha: 0, y: 12 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=300%',           // pinned for 3 screens' worth of scrolling
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true, // recalculates the walk distance on resize
          onUpdate: (self) => {
            // legs move only while scrolling; she faces the scroll direction
            girl.classList.add('is-walking');
            gsap.set(girl, { scaleX: self.direction });
            clearTimeout(stopTimer);
            stopTimer = setTimeout(() => girl.classList.remove('is-walking'), 150);
          },
        },
      });

      // walk from the left edge to the right edge over the whole pin
      tl.to(
        walker,
        { x: () => root.current.offsetWidth - walker.offsetWidth - 48, duration: LINES.length },
        0
      );

      // one dialogue box per "second" of the timeline
      boxes.forEach((box, i) => {
        tl.to(box, { autoAlpha: 1, y: 0, duration: 0.2, ease: 'steps(3)' }, i + 0.05);
        if (i < boxes.length - 1) {
          tl.to(box, { autoAlpha: 0, y: -12, duration: 0.2, ease: 'steps(3)' }, i + 0.85);
        }
      });

      return () => clearTimeout(stopTimer);
    },
    { scope: root }
  );

  return (
    <section className="level intro" ref={root}>
      <p className="intro__label">level 1 — hello</p>

      <div className="intro__boxes">
        {LINES.map((line, i) => (
          <p key={i} className="intro__box pixel-box">
            {line}
          </p>
        ))}
      </div>

      <div className="intro__walker">
        <div className="intro__girl" role="img" aria-label="pixel harshita walking" />
      </div>

      <div className="intro__ground" aria-hidden="true" />
    </section>
  );
}