/**
 * CareerTimeline Component - Feed Style
 *
 * Displays professional journey with color-coded categories
 * - Aviation: Emerald
 * - Teaching: Blue
 * - Development: Purple
 */

interface TimelineEvent {
  id: number;
  startYear: string;
  endYear?: string;
  title: string;
  organization?: string;
  description?: string;
  category: 'aviation' | 'teaching' | 'development';
}

const timelineEvents: TimelineEvent[] = [
  {
    id: 1,
    startYear: 'Oct 2024',
    endYear: 'Present',
    title: 'First Officer',
    organization: 'PSA Airlines',
    description: 'Regional airline operations flying Canadair Regional Jets',
    category: 'aviation',
  },
  {
    id: 2,
    startYear: 'Dec 2023',
    endYear: 'Oct 2024',
    title: 'First Officer',
    organization: 'SkyWest Charter',
    description: 'Charter flight operations',
    category: 'aviation',
  },
  {
    id: 3,
    startYear: '2021',
    endYear: '2023',
    title: 'Adjunct Ground Instructor',
    organization: 'Baylor University',
    description: 'Teaching aviation ground school courses',
    category: 'teaching',
  },
  {
    id: 4,
    startYear: '2021',
    endYear: '2023',
    title: 'Certified Flight Instructor (CFI)',
    description: 'Training pilots from private pilot through instrument and commercial ratings',
    category: 'aviation',
  },
  {
    id: 5,
    startYear: '2020',
    endYear: '2022',
    title: 'Return to Teaching',
    description: 'High school chemistry and physics during COVID aviation recovery',
    category: 'teaching',
  },
  {
    id: 6,
    startYear: '2018',
    endYear: '2020',
    title: 'Flight Training',
    organization: 'Texas State Technical College (TSTC)',
    description: 'Completed professional pilot training program',
    category: 'aviation',
  },
  {
    id: 7,
    startYear: '2012',
    endYear: '2018',
    title: 'High School Teacher',
    description: 'Chemistry and Physics instructor',
    category: 'teaching',
  },
  {
    id: 8,
    startYear: '2008',
    endYear: 'Present',
    title: 'Web Developer',
    description: 'Building websites and web applications as side projects',
    category: 'development',
  },
];

const categoryConfig = {
  aviation: {
    icon: '✈️',
    iconBg: 'bg-emerald-100 dark:bg-emerald-800',
    iconText: 'text-emerald-600 dark:text-emerald-300',
    ring: 'ring-[var(--bg)]',
    label: 'Aviation',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300',
  },
  teaching: {
    icon: '📚',
    iconBg: 'bg-blue-100 dark:bg-blue-800',
    iconText: 'text-blue-600 dark:text-blue-300',
    ring: 'ring-[var(--bg)]',
    label: 'Teaching',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300',
  },
  development: {
    icon: '💻',
    iconBg: 'bg-purple-100 dark:bg-purple-800',
    iconText: 'text-purple-600 dark:text-purple-300',
    ring: 'ring-[var(--bg)]',
    label: 'Development',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300',
  },
};

export function CareerTimeline() {
  return (
    <div className="my-16">
      <h2 className="text-3xl font-bold text-[var(--text)] mb-8">
        Career Journey
      </h2>

      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {timelineEvents.map((event, eventIdx) => {
            const config = categoryConfig[event.category];
            return (
              <li key={event.id}>
                <div className="relative pb-8">
                  {eventIdx !== timelineEvents.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-[var(--border)]"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-3">
                    <div className="relative">
                      <div
                        className={`flex size-10 items-center justify-center rounded-full ring-8 ${config.iconBg} ${config.ring}`}
                      >
                        <span className="text-lg" aria-hidden="true">
                          {config.icon}
                        </span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-lg font-semibold text-[var(--text)]">
                            {event.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}>
                            {config.label}
                          </span>
                        </div>
                        {event.organization && (
                          <p className="text-base font-medium text-[var(--primary)]">
                            {event.organization}
                          </p>
                        )}
                        <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                          {event.startYear}
                          {event.endYear && ` - ${event.endYear}`}
                        </p>
                      </div>
                      {event.description && (
                        <div className="mt-2 text-sm text-[var(--text)]">
                          <p>{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
