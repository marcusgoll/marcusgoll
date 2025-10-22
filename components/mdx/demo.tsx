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
    <div className="my-6 rounded-lg border border-gray-300 dark:border-gray-700 p-6 bg-white dark:bg-gray-900">
      {description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>}

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
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Display result */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
        <p className="text-lg font-medium">
          Result: <span className="text-blue-600 dark:text-blue-400">{value}</span>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Character count: {value.length}
        </p>
      </div>

      {/* Interactive button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Click me: {count}
        </button>
        <button
          onClick={() => {
            setValue(initialValue);
            setCount(0);
          }}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
        This is an interactive React component embedded in MDX content. State updates work as expected!
      </p>
    </div>
  );
}
