import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

interface AvatarProps {
  className?: string;
}

export const Avatar = ({ className }: AvatarProps) => {
  useGSAP(() => {
    const timeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      defaults: { ease: 'power1.inOut', duration: 2 },
    });

    timeline.to('#shape_1', { morphSVG: '#shape_2' });
  });

  return (
    <svg width="260" height="260" viewBox="0 0 260 260" fill="none" className={className}>
      <defs>
        <linearGradient
          id="circleGradient"
          x1="20.0342"
          y1="127.858"
          x2="240.429"
          y2="130.181"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--orange)" />
          <stop offset="1" stopColor="var(--purple)" />
        </linearGradient>

        <mask id="circleMask">
          <path
            id="shape_1"
            d="M130 0C180 0 250 60 250 130C250 200 180 260 130 260C80 260 10 200 10 130C10 60 80 0 130 0Z"
            fill="white"
          />
        </mask>

        <path
          id="shape_2"
          d="M130 10C190 0 260 70 250 130C240 200 170 250 100 240C30 230 10 170 20 100C30 30 70 20 130 10Z"
          fill="white"
          style={{ display: 'none' }}
        />
      </defs>

      <g mask="url(#circleMask)">
        <rect fill="url(#circleGradient)" width="260" height="260" />
        <image href="/images/avatar.png" width="260" height="260" preserveAspectRatio="xMidYMid" transform="translate(0 26)" />
      </g>
    </svg>
  );
};
