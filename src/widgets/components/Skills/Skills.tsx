import type { Theme } from '@utils/theme';
import type { Section } from '@typings/global';
import s from './Skills.module.scss';
import cx from 'clsx';
import skillsData from '@data/skills/skills.json';
import skills from '@data/skills/skills';
import { useTextHighlight } from '@shared/hooks';
import { useEffect, useState } from 'react';
import { useThemeWatcher } from '@shared/hooks';

export const Skills = ({ locale }: Section) => {
  const [currentTheme, setCurrentTheme] = useState<Omit<Theme, 'system'>>('dark');
  const theme = useThemeWatcher();

  const data = skillsData[locale];
  const title = useTextHighlight(data.title);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  return (
    <section className={cx(s.skills, 'section')} id="skills">
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          {skills.map(skill => (
            <a
              aria-label={skill.name}
              href={skill.link}
              className={s.skill}
              key={skill.id}
              target="_blank"
              rel="noreferrer noopener"
            >
              <img
                src={`/images/skills/${skill.id + (skill.hasTheme ? `-${currentTheme}` : '')}.svg`}
                alt={skill.name}
              />
              <span>{skill.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
