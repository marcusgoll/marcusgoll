'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

/**
 * NewsletterSubscribe - Sidebar newsletter signup component
 * Brand-aligned design with Navy/Emerald color scheme
 */
export default function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Implement newsletter subscription API endpoint
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setMessage('Thanks for subscribing!');
      setEmail('');

      // Reset message after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5 text-emerald-500" />
        <h3 className="text-sm font-semibold text-white">
          Subscribe to my newsletter
        </h3>
      </div>
      <p className="mb-4 text-sm text-gray-400">
        Get my latest updates
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          required
          disabled={status === 'loading' || status === 'success'}
          className="w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {/* Status Message */}
        {message && (
          <p className={`text-xs ${status === 'success' ? 'text-emerald-500' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
