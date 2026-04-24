import Link from "next/link";
import { Rss } from "lucide-react";
import {
  GithubIcon,
  TwitterXIcon,
  LinkedinIcon,
} from "@/components/SocialIcons";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 print:hidden">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center justify-center md:justify-start gap-2 group"
            >
              <Logo />
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto md:mx-0">
              Building better documentation for developers. Open source and free
              to use.
            </p>
          </div>

          {/* Documentation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Documentation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Browse Docs
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/component-examples"
                  className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Components
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              {siteConfig.social.github && (
                <li>
                  <Link
                    href={siteConfig.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/feed.xml"
                  className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Rss size={14} />
                  RSS Feed
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Connect
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {siteConfig.social.github && (
                <Link
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon size={20} />
                </Link>
              )}
              {siteConfig.social.twitter && (
                <Link
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full transition-all"
                  aria-label="Twitter"
                >
                  <TwitterXIcon size={20} />
                </Link>
              )}
              {siteConfig.social.linkedin && (
                <Link
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">
              {siteConfig.footer.companyName}
            </span>{" "}
            All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}
