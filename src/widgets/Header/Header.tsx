import type { CSSProperties } from 'react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import s from '@widgets/Header/Header.module.scss';
import cx from 'clsx';
import { Logo, Light, System, Dark, Hamburger, Close } from '@shared/icons';
import { useBreakpoint } from '@shared/hooks';
import { ActionButton, Switcher } from '@shared/ui';
import { motion, AnimatePresence } from 'motion/react';
import { updateTheme } from '@utils/updateTheme';
import menuData from '@data/menu/menu.json';

interface HeaderProps {
  url: string;
  lang: string;
}

export const Header = ({ url, lang }: HeaderProps) => {
  const menuItems = menuData.data[lang];
  const menuUrls = menuData.urls;

  const isMobile = useBreakpoint('(max-width: 1199px)');

  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);

  const [langsIsOpen, setLangsIsOpen] = useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [itemActiveIndex, setItemActiveIndex] = useState<number>(0);
  const [itemActiveWidth, setItemActiveWidth] = useState<number>(43);
  const [itemOffsetLeft, setItemOffsetLeft] = useState<number>(0);
  const [theme, setTheme] = useState<string>('system');

  useLayoutEffect(() => {
    setItemActiveWidth(linksRef.current[itemActiveIndex].offsetWidth);
    setItemOffsetLeft(linksRef.current[itemActiveIndex].offsetLeft);

    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme);
  }, [itemActiveIndex]);

  useEffect(() => {
    if (menuIsOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [menuIsOpen]);

  const themesData = [
    {
      content: <Light />,
      onClick: () => {
        updateTheme('light');
        setTheme('light');
      },
      isActive: theme === 'light',
    },
    {
      content: <System />,
      onClick: () => {
        updateTheme('system');
        setTheme('system');
      },
      isActive: theme === 'system',
    },
    {
      content: <Dark />,
      onClick: () => {
        updateTheme('dark');
        setTheme('dark');
      },
      isActive: theme === 'dark',
    },
  ];

  const langsData = [
    {
      href: '/',
      content: 'EN',
      isActive: lang === 'en',
    },
    {
      href: '/ru',
      content: 'RU',
      isActive: lang === 'ru',
    },
    {
      href: '/uz',
      content: 'UZ',
      isActive: lang === 'uz',
    },
  ];

  const onLangClick = () => {
    setLangsIsOpen(!langsIsOpen);
  };

  const onMenuClick = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const onLinkClick = (index: number) => {
    setMenuIsOpen(false);
    setItemActiveIndex(index);
  };

  return (
    <header className={s.header}>
      <div className="container">
        <motion.div className={s.wrap}>
          <a href={url}>
            <Logo />
          </a>
          <motion.div
            initial={isMobile && { opacity: 0, visibility: 'hidden' }}
            variants={{
              open: { opacity: 1, visibility: 'visible' },
              closed: { opacity: 0, visibility: 'hidden' },
            }}
            animate={menuIsOpen ? 'open' : 'closed'}
            transition={{ duration: 0.25, ease: 'easeIn' }}
            className={s.navWrapper}
          >
            <nav className={s.nav}>
              <ul>
                {menuItems.map((item: string, index: number) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: -50 }}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: -50 },
                    }}
                    transition={{ duration: 0.25, ease: 'easeIn' }}
                  >
                    <a
                      href={`#${menuUrls[index]}`}
                      ref={(ref: HTMLAnchorElement) => {
                        linksRef.current[index] = ref;
                      }}
                      className={cx(s.link, { [s.active]: index === itemActiveIndex })}
                      onClick={() => onLinkClick(index)}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div
                ref={lineRef}
                className={s.line}
                style={{ '--width': `${itemActiveWidth}px`, '--offset': `${itemOffsetLeft}px` } as CSSProperties}
              />
              <Switcher className={s.mobileSwitcher} items={themesData} />
            </nav>
          </motion.div>

          <div className={s.end}>
            <Switcher className={s.themesSwitcher} items={themesData} />
            <div className={s.langsSwitcher}>
              <ActionButton onClick={onLangClick}>{lang}</ActionButton>
              <AnimatePresence>
                {langsIsOpen && (
                  <motion.div
                    className={s.langsList}
                    initial={{ opacity: 1, width: 0 }}
                    animate={{ opacity: 1, width: '114px' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.3, ease: 'easeIn' }}
                  >
                    <Switcher items={langsData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ActionButton className={cx(s.hamburger, { [s.active]: menuIsOpen })} onClick={onMenuClick}>
              <Hamburger />
              <Close />
            </ActionButton>
          </div>
        </motion.div>
      </div>
    </header>
  );
};
