import { useState } from 'react';
import { useStore } from '@nanostores/react';
import { localeAtom } from '@shared/stores';
import projectDataRaw from '@data/projects/projects.json';
import type { ProjectData } from '@typings/data';
import s from './Projects.module.scss';
import cx from 'clsx';
import { useTextHighlight } from '@shared/hooks';
import { Spotlight, Tag, Button } from '@shared/ui';

import { ProjectSkeleton } from './ProjectSkeleton';

const projectData = projectDataRaw as Record<string, ProjectData>;
const INITIAL_COUNT = 4;
const LOAD_STEP = 4;

export const Projects = () => {
  const locale = useStore(localeAtom);
  const data = projectData[locale];
  const projects = data.items;
  const title = useTextHighlight(data.title);

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + LOAD_STEP);
      setIsLoading(false);
    }, 500);
  };

  const visibleProjects = projects.slice(0, visibleCount);
  const remainingCount = projects.length - visibleCount;
  const skeletonCount = Math.min(LOAD_STEP, remainingCount);
  const hasMore = visibleCount < projects.length;

  return (
    <section id="projects" className={cx(s.projects, 'section')}>
      <div className="container">
        <h2 className="title">{title}</h2>
        <div className={s.grid}>
          {visibleProjects.map(project => (
            <a href={project.link} target="_blank" rel="noopener noreferrer" key={project.id} className={s.project}>
              <Spotlight className={s.spotlight} spotlightColor={project.color} />
              <div className={s.projectImage}>
                <picture>
                  <source
                    type="image/webp"
                    srcSet={`/images/projects/${project.id}.webp 1x, /images/projects/${project.id}@2x.webp 2x`}
                  />
                  <img src={`/images/projects/${project.id}.jpg`} alt={project.name} loading="lazy" />
                </picture>
              </div>
              <h3>{project.name}</h3>
              <p className="text-lg">{project.text}</p>
              <div className={s.bottom}>
                <div className={s.stack}>
                  {project.stack.map(stack => (
                    <Tag className={s.tag} key={stack}>
                      {stack}
                    </Tag>
                  ))}
                </div>
              </div>
            </a>
          ))}

          {isLoading &&
            Array.from({ length: skeletonCount }).map((_, index) => (
              <ProjectSkeleton key={`skeleton-${index}`} />
            ))}
        </div>

        {(hasMore || isLoading) && (
          <div className={s.actions}>
            <Button variant="outline" onClick={handleLoadMore} disabled={isLoading}>
              {data.loadMore || 'Show more'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
