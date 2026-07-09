import { useStore } from '@nanostores/react';
import { localeAtom } from '@shared/stores';
import projectDataRaw from '@data/projects/projects.json';
import type { ProjectData } from '@typings/data';
import s from './Projects.module.scss';

const projectData = projectDataRaw as Record<string, ProjectData>;
import cx from 'clsx';
import { useTextHighlight } from '@shared/hooks';
import { Spotlight, Tag } from '@shared/ui';

export const Projects = () => {
  const locale = useStore(localeAtom);
  const data = projectData[locale];
  const projects = data.items;
  const title = useTextHighlight(data.title);

  return (
    <section id="projects" className={cx(s.projects, 'section')}>
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          {projects.map(project => (
            <a href={project.link} target="_blank" rel="noopener noreferrer" key={project.id} className={s.project}>
              <Spotlight className={s.spotlight} spotlightColor={project.color} />
              <div className={s.projectImage}>
                <img src={`/images/projects/${project.id}.webp`} alt={project.name} />
              </div>
              <h3>{project.name}</h3>
              <p className="text-lg">{project.text}</p>
              <div className={s.bottom}>
                <div className={s.stack}>
                  {project.stack.map(stack => (
                    <Tag className={s.tag} key={stack}>{stack}</Tag>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
