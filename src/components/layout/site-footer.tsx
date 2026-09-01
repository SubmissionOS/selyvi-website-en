import Link from "next/link";

import { footerColumns, socialLinks } from "@/config/site";
import { PRODUCT_NAME } from "@/config/brand";
import { InstagramIcon, LinkedinIcon } from "@/components/icons/brand-icons";

const socialIcons = {
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
};

/**
 * Fussbereich auf brand-800.
 * Die Klasse `on-dark` schaltet den Fokus-Ring aus globals.css auf brand-100 um,
 * damit er auf der dunklen Flaeche sichtbar bleibt.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-brand-800 text-surface">
      <div className="mx-auto w-full max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-semibold tracking-wide text-surface">
                {column.title}
              </h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.items.map((item) => (
                  <li key={`${column.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="text-sm text-brand-100 transition-colors hover:text-surface"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-brand-600 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-brand-100">
            © {year} {PRODUCT_NAME}. All rights reserved.
          </p>

          <ul className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = socialIcons[social.icon];

              return (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${PRODUCT_NAME} on ${social.label}`}
                    className="inline-flex size-10 items-center justify-center rounded-md text-brand-100 transition-colors hover:text-surface"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
