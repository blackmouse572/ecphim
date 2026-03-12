import {
	FilmReel,
	GithubLogo,
	TwitterLogo,
	DiscordLogo,
	InstagramLogo,
	EnvelopeSimple,
	Heart,
	Globe,
	Shield,
	Info,
} from "@phosphor-icons/react/ssr";
import Link from "next/link";

const QUICK_LINKS = [
	{ name: "Home", href: "/" },
	{ name: "Discover", href: "/discover" },
	{ name: "Trending", href: "/browse/trending" },
	{ name: "New Releases", href: "/browse/new" },
	{ name: "Premium", href: "/browse/premium" },
];

const CATEGORIES = [
	{ name: "Action", href: "/browse/genre/action" },
	{ name: "Drama", href: "/browse/genre/drama" },
	{ name: "Comedy", href: "/browse/genre/comedy" },
	{ name: "Horror", href: "/browse/genre/horror" },
	{ name: "Sci-Fi", href: "/browse/genre/sci-fi" },
	{ name: "Romance", href: "/browse/genre/romance" },
];

const COUNTRIES = [
	{ name: "Hàn Quốc", href: "/browse/country/han-quoc" },
	{ name: "Nhật Bản", href: "/browse/country/nhat-ban" },
	{ name: "Trung Quốc", href: "/browse/country/trung-quoc" },
	{ name: "Thái Lan", href: "/browse/country/thai-lan" },
	{ name: "Âu Mỹ", href: "/browse/country/au-my" },
];

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
		<footer className="bg-gradient-to-t from-black via-zinc-950 to-zinc-950 border-t border-white/5">
			<div className="container mx-auto max-w-7xl px-6 py-16">
				{/* Main Footer Content */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
					{/* Brand */}
					<div className="lg:col-span-2 space-y-4">
						<Link href="/" className="flex items-center space-x-3 group">
							<div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-3 rounded-2xl group-hover:scale-105 transition-transform">
								<FilmReel className="h-8 w-8 text-white" weight="bold" />
							</div>
							<div>
								<span className="text-headline-sm font-900 text-white tracking-tight">
									Ec<span className="text-blue-400">Phim</span>
								</span>
								<p className="text-caption text-white/50 font-mono uppercase tracking-wider">
									Premium Cinema Experience
								</p>
							</div>
						</Link>
						<p className="text-body font-200 text-white/70 leading-relaxed max-w-sm">
							Discover and stream the world's greatest films with our premium
							platform. From blockbusters to indie gems, experience cinema like
							never before.
						</p>
						<div className="flex space-x-4">
							{SOCIAL_LINKS.map((social) => (
								<Link
									key={social.name}
									href={social.href}
									className="text-white/50 hover:text-blue-400 transition-colors hover:scale-110 transform"
									aria-label={social.name}
								>
									<social.icon className="h-5 w-5" />
								</Link>
							))}
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50">
							Quick Links
						</h3>
						<ul className="space-y-3">
							{QUICK_LINKS.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="text-body font-400 text-white/70 hover:text-blue-400 transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Categories */}
					<div className="space-y-4">
						<h3 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50">
							Categories
						</h3>
						<ul className="space-y-3">
							{CATEGORIES.map((category) => (
								<li key={category.name}>
									<Link
										href={category.href}
										className="text-body font-400 text-white/70 hover:text-blue-400 transition-colors"
									>
										{category.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Countries */}
					<div className="space-y-4">
						<h3 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50">
							Countries
						</h3>
						<ul className="space-y-3">
							{COUNTRIES.map((country) => (
								<li key={country.name}>
									<Link
										href={country.href}
										className="text-body font-400 text-white/70 hover:text-blue-400 transition-colors"
									>
										{country.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Support */}
					<div className="space-y-4">
						<h3 className="text-overline font-mono font-900 uppercase tracking-[0.3em] text-white/50">
							Support
						</h3>
						<ul className="space-y-3">
							{SUPPORT_LINKS.map((link) => (
								<li key={link.name}>
									<Link
										href={link.href}
										className="flex items-center space-x-2 text-body font-400 text-white/70 hover:text-blue-400 transition-colors"
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
				<div className="border-y border-white/10 py-12 mb-8">
					<div className="max-w-2xl">
						<h3 className="text-headline-sm font-900 text-white mb-4 tracking-tight">
							Stay Updated
						</h3>
						<p className="text-body font-200 text-white/70 mb-6">
							Get the latest movie releases, exclusive content, and updates
							delivered to your inbox.
						</p>
						<div className="flex space-x-4">
							<input
								type="email"
								placeholder="Enter your email address"
								className="flex-1 bg-white/5 border border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 focus:border-blue-400 focus:outline-none focus:bg-white/10 transition-colors"
							/>
							<button className="bg-blue-500 hover:bg-blue-600 text-white font-600 px-6 py-3 rounded-xl hover:scale-105 transition-all">
								Subscribe
							</button>
						</div>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 text-sm">
					<div className="flex items-center space-x-6 text-white/50">
						<p className="font-mono">
							© {new Date().getFullYear()} EcPhim. All rights reserved.
						</p>
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
							<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
