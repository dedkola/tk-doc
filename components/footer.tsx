import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white">
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
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto md:mx-0">
              Building better documentation for developers. Open source and free
              to use.
            </p>
          </div>

          {/* Documentation */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Documentation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Components
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>
          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">Connect</h3>
            <div className="flex items-center justify-center md:justify-start gap-4">
              {siteConfig.social.github && (
                <Link
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </Link>
              )}
              {siteConfig.social.twitter && (
                <Link
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-50 rounded-full transition-all"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </Link>
              )}
              {siteConfig.social.linkedin && (
                <Link
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">
              {siteConfig.footer.companyName}
            </span>{" "}
            All rights reserved.
          </p>
          {
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/"
                className="text-slate-500 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          }
        </div>
      </div>
    </footer>
  );
}
