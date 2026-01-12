import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  type Transition,
  type VariantLabels,
  type Target,
  type TargetAndTransition,
  m,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from 'motion/react';
import clsx from 'clsx';

import s from './RotatingText.module.scss';

export interface RotatingTextRef {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
}

export interface RotatingTextProps
  extends Omit<ComponentPropsWithoutRef<typeof m.span>, 'children' | 'transition' | 'initial' | 'animate' | 'exit'> {
  texts: string[];
  transition?: Transition;
  initial?: boolean | Target | VariantLabels;
  animate?: boolean | VariantLabels | TargetAndTransition;
  exit?: Target | VariantLabels;
  animatePresenceMode?: 'sync' | 'wait';
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: 'first' | 'last' | 'center' | 'random' | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: 'characters' | 'words' | 'lines' | string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
}

export const RotatingText = forwardRef<RotatingTextRef, RotatingTextProps>((props, ref) => {
  const {
    texts,
    transition = { type: 'spring', damping: 25, stiffness: 300 },
    initial = { y: '100%', opacity: 0 },
    animate = { y: 0, opacity: 1 },
    exit = { y: '-120%', opacity: 0 },
    animatePresenceMode = 'wait',
    animatePresenceInitial = false,
    rotationInterval = 2000,
    staggerDuration = 0,
    staggerFrom = 'first',
    loop = true,
    auto = true,
    splitBy = 'characters',
    onNext,
    mainClassName,
    splitLevelClassName,
    elementLevelClassName,
    ...rest
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const splitIntoCharacters = (text: string): string[] => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
      return Array.from(segmenter.segment(text), s => s.segment);
    }
    return Array.from(text);
  };

  const elements = useMemo(() => {
    const currentText = texts[currentTextIndex];

    if (splitBy === 'characters') {
      const words = currentText.split(' ');
      return words.map((word, i) => ({
        characters: splitIntoCharacters(word),
        needsSpace: i !== words.length - 1,
      }));
    }

    if (splitBy === 'words') {
      return currentText.split(' ').map((word, i, arr) => ({
        characters: [word],
        needsSpace: i !== arr.length - 1,
      }));
    }

    if (splitBy === 'lines') {
      return currentText.split('\n').map((line, i, arr) => ({
        characters: [line],
        needsSpace: i !== arr.length - 1,
      }));
    }

    return currentText.split(splitBy).map((part, i, arr) => ({
      characters: [part],
      needsSpace: i !== arr.length - 1,
    }));
  }, [texts, currentTextIndex, splitBy]);

  const getStaggerDelay = useCallback(
    (index: number, total: number) => {
      if (staggerFrom === 'first') return index * staggerDuration;
      if (staggerFrom === 'last') return (total - 1 - index) * staggerDuration;
      if (staggerFrom === 'center') {
        const center = Math.floor(total / 2);
        return Math.abs(center - index) * staggerDuration;
      }
      if (staggerFrom === 'random') {
        const randomIndex = Math.floor(Math.random() * total);
        return Math.abs(randomIndex - index) * staggerDuration;
      }
      return Math.abs((staggerFrom as number) - index) * staggerDuration;
    },
    [staggerFrom, staggerDuration]
  );

  const handleIndexChange = useCallback(
    (newIndex: number) => {
      setCurrentTextIndex(newIndex);
      onNext?.(newIndex);
    },
    [onNext]
  );

  const next = useCallback(() => {
    const nextIndex = currentTextIndex === texts.length - 1 ? (loop ? 0 : currentTextIndex) : currentTextIndex + 1;

    if (nextIndex !== currentTextIndex) {
      handleIndexChange(nextIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const previous = useCallback(() => {
    const prevIndex = currentTextIndex === 0 ? (loop ? texts.length - 1 : currentTextIndex) : currentTextIndex - 1;

    if (prevIndex !== currentTextIndex) {
      handleIndexChange(prevIndex);
    }
  }, [currentTextIndex, texts.length, loop, handleIndexChange]);

  const jumpTo = useCallback(
    (index: number) => {
      const validIndex = Math.max(0, Math.min(index, texts.length - 1));
      if (validIndex !== currentTextIndex) {
        handleIndexChange(validIndex);
      }
    },
    [texts.length, currentTextIndex, handleIndexChange]
  );

  const reset = useCallback(() => {
    if (currentTextIndex !== 0) {
      handleIndexChange(0);
    }
  }, [currentTextIndex, handleIndexChange]);

  useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [next, previous, jumpTo, reset]);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(next, rotationInterval);
    return () => clearInterval(id);
  }, [next, rotationInterval, auto]);

  const totalChars = elements.reduce((sum, w) => sum + w.characters.length, 0);

  return (
    <LazyMotion features={domAnimation}>
      <m.span {...rest} layout transition={transition} className={clsx(s.root, mainClassName)}>
        <span className={s.srOnly}>{texts[currentTextIndex]}</span>

        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <m.span
            key={currentTextIndex}
            layout
            aria-hidden
            className={clsx(splitBy === 'lines' ? s.lines : s.container)}
          >
            {elements.map((word, wordIndex, arr) => {
              const prevCount = arr.slice(0, wordIndex).reduce((sum, w) => sum + w.characters.length, 0);

              return (
                <span key={wordIndex} className={clsx(s.word, splitLevelClassName)}>
                  {word.characters.map((char, charIndex) => (
                    <m.span
                      key={charIndex}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(prevCount + charIndex, totalChars),
                      }}
                      className={clsx(s.element, elementLevelClassName)}
                    >
                      {char}
                    </m.span>
                  ))}
                  {word.needsSpace && <span className={s.space}> </span>}
                </span>
              );
            })}
          </m.span>
        </AnimatePresence>
      </m.span>
    </LazyMotion>
  );
});
