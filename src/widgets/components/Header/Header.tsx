import type { Section } from '@typings/global';
import type { CSSProperties, RefObject } from 'react';
import { useLayoutEffect, useRef, useState, useMemo } from 'react';
import s from './Header.module.scss';
import cx from 'clsx';
import { Logo } from '@shared/icons';
import { Moon, Sun, Monitor, X, Menu } from 'lucide-react';
import { useClickOutside, useTheme, useActiveSection } from '@shared/hooks';
import { ActionButton, Switcher } from '@shared/ui';
import { setThemeMode } from '@utils/theme';
import menuData from '@data/menu/menu.json';

export const Header = ({ locale }: Section) => {
  const menuItems = menuData.data[locale];
  const menuUrls = menuData.urls;

  const currentHref = locale === 'en' ? '/' : `/${locale}`;

  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const langsRef = useRef<HTMLDivElement>(null);
  const langsButtonRef = useRef<HTMLButtonElement>(null);

  const { mode } = useTheme();
  const activeId = useActiveSection();

  const [langsIsOpen, setLangsIsOpen] = useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [itemActiveWidth, setItemActiveWidth] = useState<number>(0);
  const [itemOffsetLeft, setItemOffsetLeft] = useState<number>(0);

  useClickOutside([langsRef, langsButtonRef], () => setLangsIsOpen(false));

  const activeLinkIndex = useMemo(() => {
    const index = linksRef.current.findIndex(link => link.hash.replace('#', '') === activeId);
    return index === -1 ? 0 : index;
  }, [activeId]);

  useLayoutEffect(() => {
    const link = linksRef.current[activeLinkIndex];

    setItemActiveWidth(link.offsetWidth);
    setItemOffsetLeft(link.offsetLeft);
  }, [activeId]);

  useLayoutEffect(() => {
    if (menuIsOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [menuIsOpen]);

  const themesData = [
    {
      content: <Sun />,
      onClick: () => setThemeMode('light'),
      isActive: mode === 'light',
    },
    {
      content: <Monitor />,
      onClick: () => setThemeMode('system'),
      isActive: mode === 'system',
    },
    {
      content: <Moon />,
      onClick: () => setThemeMode('dark'),
      isActive: mode === 'dark',
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

  const onLinkClick = () => {
    setMenuIsOpen(false);
  };

  return (
    <>
      <div className={cx(s.overlay, { [s.active]: menuIsOpen })} onClick={onMenuClick} />
      <header className={s.header}>
        <div className="container">
          <div className={cx(s.wrap, { [s.active]: menuIsOpen })}>
            <a href={currentHref} aria-label="logo">
              <Logo />
            </a>
            <nav className={cx(s.nav, { [s.active]: menuIsOpen })}>
              <ul>
                {menuItems.map((item: string, index: number) => (
                  <li key={item}>
                    <a
                      href={`#${menuUrls[index]}`}
                      ref={(ref: HTMLAnchorElement) => {
                        linksRef.current[index] = ref;
                      }}
                      className={cx(s.link, { [s.active]: menuUrls[index] === activeId })}
                      onClick={() => onLinkClick()}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <div
                ref={lineRef}
                className={s.line}
                style={
                  { '--width': `${itemActiveWidth + 16}px`, '--offset': `${itemOffsetLeft - 8}px` } as CSSProperties
                }
              />
              <Switcher className={s.mobileSwitcher} items={themesData} isMoreRadius />
            </nav>

            <div className={s.end}>
              <Switcher className={s.themesSwitcher} items={themesData} />
              <div className={s.langsSwitcher}>
                <ActionButton ref={langsButtonRef as RefObject<HTMLButtonElement>} onClick={onLangClick}>
                  {locale}
                </ActionButton>
                {langsIsOpen && (
                  <div className={cx(s.langsList, { [s.active]: langsIsOpen })}>
                    <Switcher ref={langsRef as RefObject<HTMLDivElement>} variant="column" items={langsData} />
                  </div>
                )}
              </div>
              <ActionButton className={cx(s.hamburger, { [s.active]: menuIsOpen })} onClick={onMenuClick}>
                <Menu />
                <X />
              </ActionButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
