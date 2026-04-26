import { useState } from 'react';

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? 'Chiudi menu' : 'Apri menu'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted transition-smooth"
      >
        {open ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-20 bg-background border-b border-border shadow-soft">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            <a href="/" className="block px-3 py-2 text-base text-muted-foreground hover:text-foreground">
              Home
            </a>
            <div className="pt-2">
              <div className="text-sm font-semibold text-foreground px-3 py-2">Per Chi</div>
              <a
                href="/dirigenti"
                className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Dirigenti & Professionisti
              </a>
              <a
                href="/post-exit"
                className="block px-6 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Post-Exit
              </a>
            </div>
            <a
              href="/servizi"
              className="block px-3 py-2 text-base text-muted-foreground hover:text-foreground"
            >
              Servizi
            </a>
            <a
              href="/risorse"
              className="block px-3 py-2 text-base text-muted-foreground hover:text-foreground"
            >
              Risorse
            </a>
            <a
              href="/contatti"
              className="block px-3 py-2 text-base text-muted-foreground hover:text-foreground"
            >
              Contatti
            </a>
            <a
              href="/chi-siamo"
              className="block px-3 py-2 text-base text-muted-foreground hover:text-foreground"
            >
              Chi Siamo
            </a>
            <div className="pt-3 border-t border-border mt-3">
              <a
                href="https://wa.me/393396005487"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent w-full justify-center"
              >
                Prenota Call
              </a>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
