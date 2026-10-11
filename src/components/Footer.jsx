import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import './Footer.css';

const TITLE = 'thanks for playing';

// fill in your real github username and email
const LINKS = [
  { label: 'portfolio', href: 'https://harshita-works.vercel.app' },
  { label: 'github', href: 'https://github.com/your-username' },
  { label: 'say hi', href: 'mailto:you@example.com' },
];

const CREDITS = [
  ['made by', 'harshita'],
  ['art', 'chatgpt + a lot of prompting'],
  ['motion', 'gsap + scrolltrigger'],
  ['pug', 'asleep, as usual'],
];

export default function Footer() {
  const root = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      // 1. title letters drop in — the hero's intro, bookending the site
      gsap.from('.ft__letter', {
        yPercent: -200,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'bounce.out',
        scrollTrigger: {
          trigger: '.ft__title',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // 2. "continue? 9…1" — tweening a plain number, not an element
      const countEl = root.current.querySelector('.ft__count');
      const counter = { n: 9 };
      gsap.to(counter, {
        n: 0,
        duration: 9,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          countEl.textContent = Math.max(1, Math.ceil(counter.n));
        },
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          // only ticks while the footer is on screen
          toggleActions: 'play pause resume pause',
        },
      });

      // 3. credits slide up one by one
      gsap.from('.ft__credit', {
        y: 24,
        opacity: 0,
        duration: 0.4,
        stagger: 0.15,
        ease: 'steps(4)',
        scrollTrigger: {
          trigger: '.ft__credits',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    },
    { scope: root }
  );

  // a click handler is outside the useGSAP function, so wrap it in contextSafe
  const playAgain = contextSafe(() => {
    gsap.to(window, { scrollTo: 0, duration: 3, ease: 'power2.inOut' });
  });

  return (
    <footer className="level ft" ref={root}>
      <div className="ft__inner">
        <div className="ft__world" aria-hidden="true">
          <img className="ft__planet" src="/img/planet.png" alt="" />
          <div className="ft__girl" />
        </div>

        <h2 className="ft__title" aria-label={TITLE}>
          {TITLE.split('').map((ch, i) => (
            <span key={i} className="ft__letter" aria-hidden="true">
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </h2>

        <p className="ft__continue">
          continue? <span className="ft__count">9</span>
        </p>

        <button className="ft__again pixel-box" onClick={playAgain}>
          ▶ play again
        </button>

        <ul className="ft__links">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a className="ft__link pixel-box" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <dl className="ft__credits">
          {CREDITS.map(([role, who]) => (
            <div key={role} className="ft__credit">
              <dt>{role}</dt>
              <dd>{who}</dd>
            </div>
          ))}
        </dl>
      </div>
    </footer>
  );
}