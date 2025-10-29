export default function ColorsPage() {
  const colors = {
    primary: [
      { name: 'Primary 700', value: '#18382a', var: '--brand-primary-700' },
      { name: 'Primary 600', value: '#498b63', var: '--brand-primary-600' },
      { name: 'Primary 500', value: '#79a488', var: '--brand-primary-500' },
      { name: 'Primary 400', value: '#9ee1c8', var: '--brand-primary-400' },
      { name: 'Primary 300', value: '#cbf0e5', var: '--brand-primary-300' },
    ],
    backgrounds: [
      { name: 'BG 900', value: '#0a1628', var: '--brand-bg-900' },
      { name: 'BG 800', value: '#0f1f3a', var: '--brand-bg-800' },
      { name: 'Surface 700', value: '#1a2942', var: '--brand-surface-700' },
      { name: 'Surface 100', value: '#2d3e5c', var: '--brand-surface-100' },
    ],
    text: [
      { name: 'Text Primary', value: '#142019', var: '--text-primary' },
      { name: 'Text on Primary', value: '#ffffff', var: '--text-on-primary' },
    ],
    base: [
      { name: 'White', value: '#ffffff', var: '--white' },
      { name: 'Black', value: '#000000', var: '--black' },
    ],
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-bold text-white">
          Brand Color Tokens
        </h1>

        {/* Primary Colors */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Primary Colors (Green)
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.primary.map((color) => (
              <div
                key={color.value}
                className="overflow-hidden rounded-lg border border-[#2d3e5c] bg-[#1a2942]"
              >
                <div
                  className="h-32"
                  style={{ backgroundColor: color.value }}
                />
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">
                    {color.name}
                  </h3>
                  <p className="font-mono text-sm text-[#9ee1c8]">
                    {color.value}
                  </p>
                  <p className="font-mono text-xs text-[#79a488]">
                    {color.var}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Background Colors */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Background Colors
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.backgrounds.map((color) => (
              <div
                key={color.value}
                className="overflow-hidden rounded-lg border border-[#2d3e5c] bg-[#1a2942]"
              >
                <div
                  className="h-32"
                  style={{ backgroundColor: color.value }}
                />
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">
                    {color.name}
                  </h3>
                  <p className="font-mono text-sm text-[#9ee1c8]">
                    {color.value}
                  </p>
                  <p className="font-mono text-xs text-[#79a488]">
                    {color.var}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Text Colors */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Text Colors
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.text.map((color) => (
              <div
                key={color.value}
                className="overflow-hidden rounded-lg border border-[#2d3e5c] bg-[#1a2942]"
              >
                <div
                  className="h-32"
                  style={{ backgroundColor: color.value }}
                />
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">
                    {color.name}
                  </h3>
                  <p className="font-mono text-sm text-[#9ee1c8]">
                    {color.value}
                  </p>
                  <p className="font-mono text-xs text-[#79a488]">
                    {color.var}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Base Colors */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Base Colors
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.base.map((color) => (
              <div
                key={color.value}
                className="overflow-hidden rounded-lg border border-[#2d3e5c] bg-[#1a2942]"
              >
                <div
                  className="h-32 border border-[#2d3e5c]"
                  style={{ backgroundColor: color.value }}
                />
                <div className="p-4">
                  <h3 className="mb-1 font-semibold text-white">
                    {color.name}
                  </h3>
                  <p className="font-mono text-sm text-[#9ee1c8]">
                    {color.value}
                  </p>
                  <p className="font-mono text-xs text-[#79a488]">
                    {color.var}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Examples */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Usage Examples
          </h2>

          <div className="space-y-4">
            {/* Button Examples */}
            <div className="rounded-lg border border-[#2d3e5c] bg-[#1a2942] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-lg bg-[#498b63] px-6 py-3 font-semibold text-white transition hover:bg-[#79a488]">
                  Primary Button
                </button>
                <button className="rounded-lg border-2 border-[#498b63] px-6 py-3 font-semibold text-[#498b63] transition hover:bg-[#498b63] hover:text-white">
                  Outline Button
                </button>
                <button className="rounded-lg bg-[#9ee1c8] px-6 py-3 font-semibold text-[#142019] transition hover:bg-[#cbf0e5]">
                  Light Button
                </button>
              </div>
            </div>

            {/* Card Example */}
            <div className="rounded-lg border border-[#2d3e5c] bg-[#1a2942] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Card Example
              </h3>
              <div className="rounded-lg border border-[#2d3e5c] bg-[#0f1f3a] p-6">
                <h4 className="mb-2 text-xl font-bold text-white">
                  Card Title
                </h4>
                <p className="mb-4 text-[#9ee1c8]">
                  This is a card with brand colors applied. Notice the
                  background, border, and text colors.
                </p>
                <button className="rounded bg-[#498b63] px-4 py-2 font-semibold text-white hover:bg-[#79a488]">
                  Action
                </button>
              </div>
            </div>

            {/* Text on Backgrounds */}
            <div className="rounded-lg border border-[#2d3e5c] bg-[#1a2942] p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">
                Text on Backgrounds
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-[#0a1628] p-4">
                  <p className="text-white">White text on darkest navy bg</p>
                </div>
                <div className="rounded-lg bg-[#498b63] p-4">
                  <p className="text-white">White text on primary</p>
                </div>
                <div className="rounded-lg bg-[#cbf0e5] p-4">
                  <p className="text-[#142019]">Dark text on light mint</p>
                </div>
                <div className="rounded-lg bg-[#2d3e5c] p-4">
                  <p className="text-white">White text on neutral navy</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
