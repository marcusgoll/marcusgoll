"use client"

import React, { useEffect, useState } from 'react'

const TOKEN_NAMES = [
	'navy-900',
	'emerald-600',
	'sky-blue',
	'bg-dark',
	'bg',
	'bg-light',
	'text',
	'text-muted',
	'highlight',
	'border',
	'border-muted',
	'primary',
	'primary-foreground',
	'secondary',
	'secondary-foreground',
	'danger',
	'danger-foreground',
	'warning',
	'warning-foreground',
	'success',
	'success-foreground',
	'info',
	'info-foreground',
	'spacing-base',
	'radius',
	'background',
	'foreground',
	'card',
	'card-foreground',
	'popover',
	'popover-foreground',
	'muted',
	'muted-foreground',
	'accent',
	'accent-foreground',
	'destructive',
	'input',
	'ring',
	'chart-1',
	'chart-2',
	'chart-3',
	'chart-4',
	'chart-5',
	'sidebar',
	'sidebar-foreground',
	'sidebar-primary',
	'sidebar-primary-foreground',
	'sidebar-accent',
	'sidebar-accent-foreground',
	'sidebar-border',
	'sidebar-ring',
]

function readTokenValues(): { name: string; value: string; resolved?: string }[] {
	if (typeof window === 'undefined') return []
	const cs = getComputedStyle(document.documentElement)

	// Helper to resolve a CSS custom property to a computed background-color
	const resolveToColor = (propName: string) => {
		try {
			const el = document.createElement('div')
			// keep it out of layout flow
			el.style.position = 'fixed'
			el.style.left = '-9999px'
			el.style.width = '10px'
			el.style.height = '10px'
			// apply the variable as a background then read computed backgroundColor
			el.style.background = `var(--${propName})`
			document.body.appendChild(el)
			const resolved = getComputedStyle(el).backgroundColor
			document.body.removeChild(el)
			return resolved
		} catch (e) {
			return ''
		}
	}

	return TOKEN_NAMES.map((name) => {
		const raw = cs.getPropertyValue(`--${name}`).trim()
		const resolved = raw ? resolveToColor(name) : ''
		return { name, value: raw, resolved }
	})
}

export default function Page() {
	// Don't render token-dependent markup on the server. Wait until mounted
	// to read document styles and show the live preview. This avoids
	// hydration mismatches between SSR and client render.
		const [mounted, setMounted] = useState(false)
		const [tokens, setTokens] = useState<{ name: string; value: string; resolved?: string }[]>([])
	const [dark, setDark] = useState(false)

	useEffect(() => {
		if (typeof window === 'undefined') return
		setMounted(true)

		// initial read
		setTokens(readTokenValues())
		setDark(document.documentElement.classList.contains('dark'))

		// Poll for changes so editing brand-tokens.css will show up live.
			const id = setInterval(() => {
				setTokens(readTokenValues())
			}, 1000)

		// Keep dark state in sync if something else toggles it.
		const obs = new MutationObserver(() => {
			setDark(document.documentElement.classList.contains('dark'))
			setTokens(readTokenValues())
		})
		obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

		return () => {
			clearInterval(id)
			obs.disconnect()
		}
	}, [])

	function toggleDark() {
		document.documentElement.classList.toggle('dark')
		setDark(document.documentElement.classList.contains('dark'))
		// refresh values immediately
		setTokens(readTokenValues())
	}

	return (
		<main className="py-8 px-4">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">Brand tokens — live preview</h1>
					<div className="flex items-center gap-3">
						<button
							onClick={toggleDark}
							className="rounded-md border px-3 py-2 text-sm bg-white dark:bg-gray-800"
						>
							Toggle dark: {dark ? 'On' : 'Off'}
						</button>
						<button
							onClick={() => setTokens(readTokenValues())}
							className="rounded-md border px-3 py-2 text-sm"
						>
							Refresh
						</button>
					</div>
				</div>

				<p className="mb-6 text-sm text-gray-600 dark:text-gray-300">Edit <code>app/brand-tokens.css</code> and you'll see values update here. Colors show as backgrounds; spacing and radius are demonstrated visually.</p>

				{mounted ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{tokens.map((t) => {
							const isLength = t.value && (t.value.includes('px') || t.value.includes('rem') || t.value.includes('%'))
							// Consider resolved computed color (rgb/rgba) as authoritative for swatches
							const resolved = t.resolved || ''
							const isColor = Boolean(resolved && resolved !== 'transparent' && resolved !== 'rgba(0, 0, 0, 0)')
						return (
							<div key={t.name} className="rounded-lg border p-4 bg-white dark:bg-gray-900">
								<div className="flex items-center gap-4">
									<div className="w-16 h-12 rounded-md border" style={isColor ? { background: resolved } : { background: 'transparent' }} />
									<div className="flex-1">
										<div className="flex items-baseline justify-between">
											<h3 className="font-mono text-sm">--{t.name}</h3>
											<code className="text-xs text-gray-500 dark:text-gray-400">{t.value || <span className="text-red-500">(not set)</span>}</code>
										</div>

										{isLength && (
											<div className="mt-2">
												<div className="inline-block rounded" style={{ background: 'var(--accent)', padding: t.value, color: 'var(--accent-foreground)' }}>padding</div>
											</div>
										)}

										{!isLength && !isColor && (
											<div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Value: {t.value || '—'}</div>
										)}
									</div>
								</div>
							</div>
						)
						})}
					</div>
				) : (
					<div className="rounded-lg border p-6 text-sm text-gray-600 dark:text-gray-300">Client preview will appear after mount. Edit <code>app/brand-tokens.css</code> and click Refresh if needed.</div>
				)}
			</div>
		</main>
	)
}

