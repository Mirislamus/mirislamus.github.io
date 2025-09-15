import type { Locale } from '@typings/global';
import type { CSSProperties, RefObject } from 'react';
import { useLayoutEffect, useRef, useState, useEffect, useMemo } from 'react';
import s from './Header.module.scss';
import cx from 'clsx';
import { Logo, Light, System, Dark, Hamburger, Close } from '@shared/icons';
import { useClickOutside, useThemeWatcher } from '@shared/hooks';
import { ActionButton, Switcher } from '@shared/ui';
import { updateTheme, type Theme } from '@utils/theme';
import menuData from '@data/menu/menu.json';
import { useActiveSection } from '@shared/hooks/useActiveSection';

interface HeaderProps {
  locale: Locale;
}

export const Header = ({ locale }: HeaderProps) => {
  const menuItems = menuData.data[locale];
  const menuUrls = menuData.urls;

  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const langsRef = useRef<HTMLDivElement>(null);
  const langsButtonRef = useRef<HTMLButtonElement>(null);

  const theme = useThemeWatcher();
  const activeId = useActiveSection();

  const [currentTheme, setCurrentTheme] = useState<Theme>('dark');
  const [langsIsOpen, setLangsIsOpen] = useState<boolean>(false);
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);
  const [itemActiveWidth, setItemActiveWidth] = useState<number>(43);
  const [itemOffsetLeft, setItemOffsetLeft] = useState<number>(0);

  useClickOutside([langsRef, langsButtonRef], () => setLangsIsOpen(false));

  const activeLinkIndex = useMemo(() => {
    const index = linksRef.current.findIndex(link => link.hash.replace('#', '') === activeId);
    return index === -1 ? 0 : index;
  }, [activeId]);

  useLayoutEffect(() => {
    setItemActiveWidth(linksRef.current[activeLinkIndex].offsetWidth);
    setItemOffsetLeft(linksRef.current[activeLinkIndex].offsetLeft);
  }, [activeId]);

  useEffect(() => {
    if (menuIsOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [menuIsOpen]);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  const themesData = [
    {
      content: <Light />,
      onClick: () => {
        updateTheme('light');
      },
      isActive: currentTheme === 'light',
    },
    {
      content: <System />,
      onClick: () => {
        updateTheme('system');
      },
      isActive: currentTheme === 'system',
    },
    {
      content: <Dark />,
      onClick: () => {
        updateTheme('dark');
      },
      isActive: currentTheme === 'dark',
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

  const currentHref = locale === 'en' ? '/' : `/${locale}`;

  return (
    <header className={s.header}>
      <div className="container">
        <div className={s.wrap}>
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
              style={{ '--width': `${itemActiveWidth}px`, '--offset': `${itemOffsetLeft}px` } as CSSProperties}
            />
            <Switcher className={s.mobileSwitcher} items={themesData} />
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
              <Hamburger />
              <Close />
            </ActionButton>
          </div>
        </div>
      </div>
    </header>
  );
};
