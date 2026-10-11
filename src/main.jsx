import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import App from './App.jsx';
import './index.css';

gsap.registerPlugin(ScrollTrigger, Draggable, useGSAP);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);