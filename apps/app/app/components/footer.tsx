import {
  DiscordLogo,
  EnvelopeSimple,
  GithubLogo,
  Globe,
  Heart,
  Info,
  InstagramLogo,
  Shield,
  TwitterLogo,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Logo } from "./logo";

const SUPPORT_LINKS = [
  { name: "About", href: "/about", icon: Info },
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Terms of Service", href: "/terms", icon: Shield },
  { name: "Contact", href: "/contact", icon: EnvelopeSimple },
];

const SOCIAL_LINKS = [
  { name: "Twitter", href: "#", icon: TwitterLogo },
  { name: "Discord", href: "#", icon: DiscordLogo },
  { name: "Instagram", href: "#", icon: InstagramLogo },
  { name: "GitHub", href: "#", icon: GithubLogo },
];

export function Footer() {
  return (
    <footer className="border-white/5 border-t bg-gradient-to-t from-black via-zinc-950 to-zinc-950">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/">
              <Logo />
            </Link>

            <p className="max-w-sm font-200 text-body text-white/70 leading-relaxed">
              Discover and stream the world's greatest films with our premium
              platform. From blockbusters to indie gems, experience cinema like
              never before.
            </p>
            <div className="flex space-x-4">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="transform text-white/50 transition-colors hover:scale-110 hover:text-blue-400"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="col-start-2 space-y-4 lg:col-start-6">
            <h3 className="font-900 font-mono text-overline text-white/50 uppercase tracking-[0.3em]">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="flex items-center space-x-2 font-400 text-body text-white/70 transition-colors hover:text-blue-400"
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-8 border-white/10 border-y py-12">
          <div className="max-w-2xl">
            <h3 className="mb-4 font-900 text-headline-sm text-white tracking-tight">
              Stay Updated
            </h3>
            <p className="mb-6 font-200 text-body text-white/70">
              Get the latest movie releases, exclusive content, and updates
              delivered to your inbox.
            </p>
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition-colors placeholder:text-white/50 focus:border-blue-400 focus:bg-white/10 focus:outline-none"
              />
              <button className="rounded-xl bg-blue-500 px-6 py-3 font-600 text-white transition-all hover:scale-105 hover:bg-blue-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
          <div className="flex items-center space-x-6 text-white/50">
            <p className="font-mono">© 2026 EcPhim. All rights reserved.</p>
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500" weight="fill" />
              <span>for movie lovers</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-white/50">
              <Globe className="h-4 w-4" />
              <span className="font-mono text-xs uppercase tracking-wider">
                Worldwide Access
              </span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <div className="flex items-center space-x-2 text-green-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="font-mono text-xs uppercase tracking-wider">
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
