import type { Section } from '@typings/global';
import projectData from '@data/projects/projects.json';
import s from './Projects.module.scss';
import cx from 'clsx';
import { useTextHighlight } from '@shared/hooks';
import { ArrowUpRight } from 'lucide-react';

export const Projects = ({ locale }: Section) => {
  const data = projectData.data[locale];
  const links = projectData.links;
  const projects = data.items;
  const title = useTextHighlight(data.title);

  return (
    <section id="projects" className={cx(s.projects, 'section')}>
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          {projects.map((project, index) => (
            <a href={links[index]} target="_blank" rel="noopener noreferrer" key={project.id} className={s.project}>
              <div className={s.projectImage}>
                <img src={`/images/projects/${project.id}.jpg`} alt={project.name} />
              </div>
              <h3>{project.name}</h3>
              <p className="text-lg">
                {project.text}
              </p>
              <span>{data.link} ↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
