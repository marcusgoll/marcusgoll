'use client';

import { Project } from '@/lib/projects';

interface ProjectsClientProps {
  projects: Project[];
}

/**
 * ProjectsClient - Simple table layout for projects
 * Shows featured project at top, then chronological list
 */
export default function ProjectsClient({ projects }: ProjectsClientProps) {
  // Get featured project
  const featuredProject = projects.find(p => p.featured);

  // Sort projects by year (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
    const yearA = new Date(a.dateCreated).getFullYear();
    const yearB = new Date(b.dateCreated).getFullYear();
    return yearB - yearA;
  });

  return (
    <>
      {/* Featured Project */}
      {featuredProject && (
        <section className="mb-12 md:mb-20">
          <div className="flex items-start gap-4 md:gap-6">
            <div className="text-4xl md:text-5xl flex-shrink-0">
              {featuredProject.category === 'aviation' ? '✈️' :
               featuredProject.category === 'dev-startup' ? '💻' : '🔗'}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="mb-2 md:mb-3 text-2xl md:text-3xl font-bold text-white break-words">
                {featuredProject.title}
              </h2>
              <p className="mb-3 md:mb-4 text-base md:text-lg text-gray-400 leading-relaxed">
                {featuredProject.description}
              </p>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {featuredProject.liveUrl && (
                  <a
                    href={featuredProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 md:px-4 py-2 text-sm md:text-base font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    View Project
                  </a>
                )}
                {featuredProject.githubUrl && (
                  <a
                    href={featuredProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-3 md:px-4 py-2 text-sm md:text-base font-medium text-gray-300 transition-colors hover:border-gray-600 hover:text-white"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Projects */}
      <section>
        <h2 className="mb-4 md:mb-6 text-2xl md:text-3xl font-bold text-white">
          All my projects
        </h2>
        <p className="mb-6 md:mb-10 text-base md:text-lg text-gray-400">
          Let's work our way back to the beginning.
        </p>

        {/* Projects Table - Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left text-sm uppercase tracking-wide text-gray-500">
                <th className="pb-4 pr-6 font-medium">Started</th>
                <th className="pb-4 pr-6 font-medium">Project</th>
                <th className="pb-4 pr-6 font-medium">Description</th>
                <th className="pb-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project) => {
                const year = new Date(project.dateCreated).getFullYear();
                const projectUrl = project.liveUrl || project.githubUrl;

                return (
                  <tr
                    key={project.slug}
                    className="group border-b border-gray-800/50 transition-colors hover:bg-gray-800/20"
                  >
                    <td className="py-5 pr-6 align-top text-base text-gray-500">
                      {year}
                    </td>
                    <td className="py-5 pr-6 align-top">
                      {projectUrl ? (
                        <a
                          href={projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-medium text-white underline decoration-gray-700 underline-offset-2 transition-colors hover:text-emerald-500 hover:decoration-emerald-500"
                        >
                          {project.title}
                        </a>
                      ) : (
                        <span className="text-base font-medium text-white">{project.title}</span>
                      )}
                    </td>
                    <td className="py-5 pr-6 align-top text-base text-gray-400">
                      {project.description}
                    </td>
                    <td className="py-5 align-top">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-emerald-900/30 text-emerald-400' :
                        project.status === 'paused'
                          ? 'bg-yellow-900/30 text-yellow-400' :
                        'bg-gray-800/50 text-gray-400'
                      }`}>
                        {project.status === 'active' && 'Active'}
                        {project.status === 'paused' && 'Paused'}
                        {project.status === 'archived' && 'Archived'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Projects Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {sortedProjects.map((project) => {
            const year = new Date(project.dateCreated).getFullYear();
            const projectUrl = project.liveUrl || project.githubUrl;

            return (
              <div
                key={project.slug}
                className="border border-gray-800 rounded-lg p-4 transition-colors hover:border-gray-700"
              >
                {/* Header: Title + Status */}
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {projectUrl ? (
                      <a
                        href={projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold text-white underline decoration-gray-700 underline-offset-2 transition-colors hover:text-emerald-500 hover:decoration-emerald-500 break-words"
                      >
                        {project.title}
                      </a>
                    ) : (
                      <h3 className="text-lg font-semibold text-white break-words">{project.title}</h3>
                    )}
                  </div>
                  <span className={`flex-shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                    project.status === 'active'
                      ? 'bg-emerald-900/30 text-emerald-400' :
                    project.status === 'paused'
                      ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-gray-800/50 text-gray-400'
                  }`}>
                    {project.status === 'active' && 'Active'}
                    {project.status === 'paused' && 'Paused'}
                    {project.status === 'archived' && 'Archived'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-base text-gray-400 leading-relaxed mb-2">
                  {project.description}
                </p>

                {/* Year */}
                <p className="text-sm text-gray-500">
                  Started {year}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
