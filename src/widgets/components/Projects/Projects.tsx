import type { Section } from '@typings/global';
import projectData from '@data/projects/projects.json';
import s from './Projects.module.scss';
import cx from 'clsx';
import { useTextHighlight } from '@shared/hooks';
import { Spotlight, Tag } from '@shared/ui';

export const Projects = ({ locale }: Section) => {
  const data = projectData.data[locale];
  const links = projectData.links;
  const colors = projectData.colors;
  const projects = data.items;
  const stacks = projectData.stacks;
  const title = useTextHighlight(data.title);

  return (
    <section id="projects" className={cx(s.projects, 'section')}>
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          {projects.map((project, index) => (
            <a href={links[index]} target="_blank" rel="noopener noreferrer" key={project.id} className={s.project}>
              <Spotlight className={s.spotlight} spotlightColor={colors[index]} />
              <div className={s.projectImage}>
                <img src={`/images/projects/${project.id}.jpg`} alt={project.name} />
              </div>
              <h3>{project.name}</h3>
              <p className="text-lg">{project.text}</p>
              <div className={s.bottom}>
                <div className={s.stack}>
                  {stacks[index].map(stack => (
                    <Tag key={stack}>{stack}</Tag>
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
