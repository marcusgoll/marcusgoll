/**
 * Interactive demo component for MDX
 * Example component to demonstrate React interactivity in MDX content
 * FR-008, US4
 */

'use client';

import { useState } from 'react';

interface DemoProps {
  initialValue?: string;
  description?: string;
}

/**
 * Interactive demo component showing React state in MDX
 *
 * Usage in MDX:
 * <Demo initialValue="Hello" description="Try editing the text below" />
 */
export function Demo({ initialValue = 'Hello, MDX!', description }: DemoProps) {
  const [value, setValue] = useState(initialValue);
  const [count, setCount] = useState(0);

  return (
    <div className="my-6 rounded-lg border border-[var(--border)] p-6 bg-[var(--bg)]">
      {description && <p className="text-sm text-[var(--text-muted)] mb-4">{description}</p>}

      {/* Interactive input */}
      <div className="mb-4">
        <label htmlFor="demo-input" className="block text-sm font-medium mb-2">
          Edit the text:
        </label>
        <input
          id="demo-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--surface)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        />
      </div>

      {/* Display result */}
      <div className="mb-4 p-4 bg-[var(--surface)] rounded-md">
        <p className="text-lg font-medium">
          Result: <span className="text-[var(--secondary)]">{value}</span>
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Character count: {value.length}
        </p>
      </div>

      {/* Interactive button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:bg-[var(--primary-hover)] transition-colors"
        >
          Click me: {count}
        </button>
        <button
          onClick={() => {
            setValue(initialValue);
            setCount(0);
          }}
          className="px-4 py-2 bg-[var(--surface)] text-[var(--text)] rounded-md hover:bg-[var(--surface-muted)] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-[var(--text-muted)] mt-4 italic">
        This is an interactive React component embedded in MDX content. State updates work as expected!
      </p>
    </div>
  );
}
