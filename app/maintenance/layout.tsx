import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maintenance | Marcus Gollahon',
  description:
    'The site is currently undergoing maintenance. I\'m upgrading the site and polishing the propellers. Please check back soon.',
  robots: 'noindex, nofollow', // Prevent indexing maintenance page
}

export default function MaintenanceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
