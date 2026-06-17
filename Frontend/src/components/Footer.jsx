import React from 'react';
import { Link } from 'react-router-dom';
import {
  PenToolIcon, FacebookIcon, TwitterIcon, InstagramIcon, GithubIcon,
  MailIcon, PhoneIcon, MapPinIcon, ArrowUpIcon,
} from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const currentYear = new Date().getFullYear();

  return (
    <>
    <footer className="border-t border-border mt-20 relative">
      <button
        onClick={scrollToTop}
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
      >
        <ArrowUpIcon className="h-4 w-4" />
      </button>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <PenToolIcon className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">ThoughtSphere</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              A platform where ideas flourish and creativity knows no bounds.
            </p>
            <div className="flex gap-2">
              {[FacebookIcon, TwitterIcon, InstagramIcon, GithubIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                ['Home', '/'],
                ['Explore Articles', '/explore'],
                ['Write Article', '/add-blog'],
                ['Categories', '/categories'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-2.5">
              {[
                ['About Us', '/about'],
                ['Featured Writers', '/writers'],
                ['Writing Guidelines', '/guidelines'],
                ['Events', '/events'],
              ].map(([label, to]) => (
                <li key={to}>
                  <Link to={to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Stay Connected</h3>
            <div className="space-y-2.5 mb-5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MailIcon className="h-3.5 w-3.5" />
                hello@thoughtsphere.com
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PhoneIcon className="h-3.5 w-3.5" />
                +1 (555) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPinIcon className="h-3.5 w-3.5" />
                San Francisco, CA
              </div>
            </div>

            <h4 className="text-xs font-medium text-foreground mb-2">Subscribe to our newsletter</h4>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-secondary border-0 rounded-md px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-xs text-muted-foreground">
            <p>© {currentYear} ThoughtSphere. Made by Darru.</p>
            <p>Built with React & Tailwind CSS</p>
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;