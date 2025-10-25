'use client';

import { Button } from '@/components/ui/button';
import Container from '@/components/ui/Container';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';

/**
 * Hero component - M2 Design hero section
 * Layout: Centered text
 * Background: Dark background
 */
export default function Hero() {
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter API call
    // For now, just close the dialog
    setEmail('');
    setNewsletterOpen(false);
  };

  return (
    <header className="relative bg-dark-bg text-foreground overflow-hidden">
      <Container className="relative z-10">
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-3 text-foreground">
            Systematic thinking from 30,000 feet
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            Aviation principles applied to software engineering and startups.
            Learn how commercial aviation&apos;s systematic approach to safety
            translates to building resilient systems.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button size="default" variant="default">
              Read Latest Posts
            </Button>
            <Dialog open={newsletterOpen} onOpenChange={setNewsletterOpen}>
              <DialogTrigger asChild>
                <Button size="default" variant="outline">
                  Subscribe to Newsletter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Subscribe to Newsletter</DialogTitle>
                  <DialogDescription>
                    Get systematic thinking insights delivered weekly. Join 500+
                    engineers and founders.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Subscribe</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Container>
    </header>
  );
}
