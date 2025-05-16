import type { CSSProperties } from 'react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import s from '@widgets/Header/Header.module.scss';
import cx from 'clsx';
import { Logo, Light, System, Dark, Hamburger, Close } from '@shared/icons';
import { useClickOutside } from '@shared/hooks';
import { ActionButton, Switcher } from '@shared/ui';
import { motion, AnimatePresence } from 'motion/react';
import { updateTheme } from '@utils/updateTheme';
import menuData from '@data/menu/menu.json';

interface HeaderProps {
  url: string;
  locale: string;
}

export const Header = ({ url, locale }: HeaderProps) => {
  const menuItems = menuData.data[locale];
  const menuUrls = menuData.urls;

  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const langsRef = useRef<HTMLDivElement>(null);
  const langsButtonRef = useRef<HTMLButtonElement>(null);

  const [langsIsOpen, setLangsIsOpen] = useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [itemActiveIndex, setItemActiveIndex] = useState<number>(0);
  const [itemActiveWidth, setItemActiveWidth] = useState<number>(43);
  const [itemOffsetLeft, setItemOffsetLeft] = useState<number>(0);
  const [theme, setTheme] = useState<string>('system');

  useClickOutside([langsRef, langsButtonRef], () => setLangsIsOpen(false));

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
      isActive: locale === 'en',
    },
    {
      href: '/ru',
      content: 'RU',
      isActive: locale === 'ru',
    },
    {
      href: '/uz',
      content: 'UZ',
      isActive: locale === 'uz',
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

  const currentHref = locale === 'en' ? '/' : `/${locale}`;

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.wrap}>
          <a href={currentHref}>
            <Logo />
          </a>
          <nav className={s.nav}>
            <ul>
              {menuItems.map((item: string, index: number) => (
                <li key={item}>
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
                </li>
              ))}
            </ul>
            <div
              ref={lineRef}
              className={s.line}
              style={{ '--width': `${itemActiveWidth}px`, '--offset': `${itemOffsetLeft}px` } as CSSProperties}
            />
            <Switcher className={s.mobileSwitcher} items={themesData} />
          </nav>

          <div className={s.end}>
            <Switcher className={s.themesSwitcher} items={themesData} />
            <div className={s.langsSwitcher}>
              <ActionButton ref={langsButtonRef} onClick={onLangClick}>
                {locale}
              </ActionButton>
              <AnimatePresence>
                {langsIsOpen && (
                  <motion.div
                    className={s.langsList}
                    initial={{ opacity: 1, height: 0 }}
                    animate={{ opacity: 1, height: '114px' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeIn' }}
                  >
                    <Switcher ref={langsRef} variant="column" items={langsData} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ActionButton className={cx(s.hamburger, { [s.active]: menuIsOpen })} onClick={onMenuClick}>
              <Hamburger />
              <Close />
            </ActionButton>
          </div>
        </div>
      </div>
    </header>
  );
};
