import { useStore } from '@nanostores/react';
import { localeAtom, modeAtom } from '@shared/stores';
import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import s from './Header.module.scss';
import cx from 'clsx';
import { Logo } from '@shared/icons';
import { Moon, Sun, Monitor, X, Menu } from 'lucide-react';
import { useActiveSection } from '@hooks/useActiveSection';
import { useClickOutside } from '@hooks/useClickOutside';
import { useIsHydrated } from '@hooks/useIsHydrated';
import { ActionButton } from '@shared/ui/ActionButton/ActionButton';
import { Switcher } from '@shared/ui/Switcher/Switcher';
import { setThemeMode } from '@utils/theme';
import menuDataRaw from '@data/menu/menu.json';
import type { MenuItem } from '@typings/data';
import a11yData from '@data/a11y/a11y.json';

const menuData = menuDataRaw as Record<string, MenuItem[]>;

export const Header = () => {
  const locale = useStore(localeAtom);
  const mode = useStore(modeAtom);
  const isHydrated = useIsHydrated();
  const menuItems = menuData[locale];
  const a11y = a11yData[locale];

  const currentHref = locale === 'en' ? '/' : `/${locale}`;

  const lineRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLAnchorElement[]>([]);
  const langsRef = useRef<HTMLDivElement>(null);
  const langsButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);

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
    if (!link) return;
    setItemActiveWidth(link.offsetWidth);
    setItemOffsetLeft(link.offsetLeft);
  }, [activeId, activeLinkIndex]);

  useEffect(() => {
    if (!menuIsOpen) return;

    const previousOverflow = document.body.style.overflow;
    const backgroundElements = Array.from(document.querySelectorAll<HTMLElement>('main, footer'));
    const previousInert = backgroundElements.map(element => element.inert);

    document.body.style.overflow = 'hidden';
    backgroundElements.forEach(element => {
      element.inert = true;
    });

    requestAnimationFrame(() => menuRef.current?.querySelector<HTMLElement>('a, button')?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      backgroundElements.forEach((element, index) => {
        element.inert = previousInert[index];
      });
    };
  }, [menuIsOpen]);

  useEffect(() => {
    if (!langsIsOpen) return;
    requestAnimationFrame(() => langsRef.current?.querySelector<HTMLElement>('a, button')?.focus());
  }, [langsIsOpen]);

  useEffect(() => {
    if (!menuIsOpen && !langsIsOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();

        if (menuIsOpen) {
          setMenuIsOpen(false);
          requestAnimationFrame(() => menuButtonRef.current?.focus());
        } else {
          setLangsIsOpen(false);
          requestAnimationFrame(() => langsButtonRef.current?.focus());
        }
        return;
      }

      if (event.key !== 'Tab' || !menuIsOpen) return;

      const focusable = [
        menuButtonRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>('a, button') ?? []),
      ].filter((element): element is HTMLElement => Boolean(element));

      const first = focusable[0];
      const last = focusable.at(-1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [langsIsOpen, menuIsOpen]);

  const themesData = [
    {
      content: <Sun aria-hidden="true" />,
      onClick: () => setThemeMode('light'),
      isActive: isHydrated ? mode === 'light' : false,
      ariaLabel: a11y.lightTheme,
    },
    {
      content: <Monitor aria-hidden="true" />,
      onClick: () => setThemeMode('system'),
      isActive: isHydrated ? mode === 'system' : true,
      ariaLabel: a11y.systemTheme,
    },
    {
      content: <Moon aria-hidden="true" />,
      onClick: () => setThemeMode('dark'),
      isActive: isHydrated ? mode === 'dark' : false,
      ariaLabel: a11y.darkTheme,
    },
  ];

  const langsData = [
    {
      href: '/',
      content: 'EN',
      isActive: locale === 'en',
      ariaLabel: a11y.englishLanguage,
    },
    {
      href: '/ru',
      content: 'RU',
      isActive: locale === 'ru',
      ariaLabel: a11y.russianLanguage,
    },
    {
      href: '/uz',
      content: 'UZ',
      isActive: locale === 'uz',
      ariaLabel: a11y.uzbekLanguage,
    },
  ];

  const onLangClick = () => {
    const nextIsOpen = !langsIsOpen;
    setLangsIsOpen(nextIsOpen);
    if (nextIsOpen) setMenuIsOpen(false);
  };

  const onMenuClick = () => {
    const nextIsOpen = !menuIsOpen;
    setMenuIsOpen(nextIsOpen);
    if (nextIsOpen) setLangsIsOpen(false);
  };

  const onLinkClick = () => {
    setMenuIsOpen(false);
  };

  return (
    <>
      <div className={cx(s.overlay, { [s.active]: menuIsOpen })} onClick={onMenuClick} aria-hidden="true" />
      <header className={s.header}>
        <div className="container">
          <div className={cx(s.wrap, { [s.active]: menuIsOpen })}>
            <a href={currentHref} aria-label={a11y.home}>
              <Logo />
            </a>
            <nav
              id="main-navigation"
              ref={menuRef}
              className={cx(s.nav, { [s.active]: menuIsOpen })}
              aria-label={a11y.navigation}
            >
              <ul>
                {menuItems.map((item, index: number) => (
                  <li key={item.url}>
                    <a
                      href={`#${item.url}`}
                      ref={(ref: HTMLAnchorElement) => {
                        linksRef.current[index] = ref;
                      }}
                      className={cx(s.link, { [s.active]: item.url === activeId })}
                      onClick={() => onLinkClick()}
                    >
                      {item.label}
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
                <ActionButton
                  ref={langsButtonRef}
                  className={s.languageButton}
                  onClick={onLangClick}
                  aria-label={a11y.languageSelector}
                  aria-expanded={langsIsOpen}
                  aria-controls="language-options"
                >
                  {locale}
                </ActionButton>
                {langsIsOpen && (
                  <div id="language-options" className={cx(s.langsList, { [s.active]: langsIsOpen })}>
                    <Switcher ref={langsRef} variant="column" items={langsData} />
                  </div>
                )}
              </div>
              <ActionButton
                ref={menuButtonRef}
                className={cx(s.hamburger, { [s.active]: menuIsOpen })}
                onClick={onMenuClick}
                aria-label={menuIsOpen ? a11y.closeMenu : a11y.menu}
                aria-expanded={menuIsOpen}
                aria-controls="main-navigation"
              >
                <Menu aria-hidden="true" />
                <X aria-hidden="true" />
              </ActionButton>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
