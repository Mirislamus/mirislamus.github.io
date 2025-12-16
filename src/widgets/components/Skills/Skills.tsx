import type { Section } from '@typings/global';
import s from './Skills.module.scss';
import cx from 'clsx';
import skillsData from '@data/skills/skills.json';
import skills from '@data/skills/skills';
import { useTheme, useTextHighlight } from '@shared/hooks';

export const Skills = ({ locale }: Section) => {
  const data = skillsData[locale];
  const title = useTextHighlight(data.title);

  const { theme, mounted } = useTheme();

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
              {mounted && (
                <img src={`/images/skills/${skill.id + (skill.hasTheme ? `-${theme}` : '')}.svg`} alt={skill.name} />
              )}
              <span>{skill.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
