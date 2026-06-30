import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrambleTextProps {
  text?: string;
  children?: string;
  className?: string;
  duration?: number;
  delay?: number;
  triggerOnce?: boolean;
}

export default function ScrambleText({
  text,
  children,
  className = '',
  duration = 1.2,
  delay = 0,
  triggerOnce = false,
}: ScrambleTextProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const targetText = text || children || '';
  const [displayText, setDisplayText] = useState(targetText);
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    const el = elementRef.current;
    if (!el || !targetText) return;

    // Use a dummy object to animate progress from 0 to 1
    const obj = { progress: 0 };
    let frameCount = 0;
    let cachedScramble: string[] = [];

    const tween = gsap.to(obj, {
      progress: 1,
      duration: duration,
      delay: delay,
      paused: true,
      ease: 'none',
      onUpdate: () => {
        const p = obj.progress;
        const totalLen = targetText.length;
        const resolvedCount = Math.floor(p * totalLen);

        // Slow down scramble speed by only changing scramble characters every 7 frames
        frameCount++;
        if (frameCount % 7 === 1 || cachedScramble.length !== totalLen) {
          cachedScramble = [];
          for (let i = 0; i < totalLen; i++) {
            cachedScramble.push(scrambleChars[Math.floor(Math.random() * scrambleChars.length)]);
          }
        }

        let result = '';
        for (let i = 0; i < totalLen; i++) {
          if (targetText[i] === ' ' || targetText[i] === '\n') {
            result += targetText[i];
          } else if (i < resolvedCount) {
            result += targetText[i];
          } else {
            result += cachedScramble[i] || scrambleChars[0];
          }
        }
        setDisplayText(result);
      },
      onComplete: () => {
        setDisplayText(targetText);
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (window.blockScramble) return;
        tween.play();
      },
      onLeave: () => {
        if (window.blockScramble) return;
        if (!triggerOnce) {
          tween.pause(0);
          setDisplayText(targetText);
        }
      },
      onEnterBack: () => {
        if (window.blockScramble) return;
        if (!triggerOnce) {
          tween.play();
        }
      },
      onLeaveBack: () => {
        if (window.blockScramble) return;
        if (!triggerOnce) {
          tween.pause(0);
          setDisplayText(targetText);
        }
      },
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [targetText, duration, delay, triggerOnce]);

  return (
    <span ref={elementRef} className={className}>
      {displayText}
    </span>
  );
}
