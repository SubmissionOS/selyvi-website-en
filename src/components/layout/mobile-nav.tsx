"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNav, primaryCta } from "@/config/site";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Wordmark } from "@/components/layout/wordmark";

/**
 * Burger-Menue fuer schmale Viewports.
 * Enthaelt dieselben Navigationspunkte wie die Desktop-Leiste sowie den
 * primaeren Call-to-Action.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0">
        <SheetHeader className="flex-row items-center justify-between border-b border-gray-200 pb-6">
          <SheetTitle asChild>
            <span>
              <Wordmark />
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">Website navigation</SheetDescription>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close menu">
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </SheetHeader>

        <nav aria-label="Mobile navigation" className="px-6">
          <ul className="flex flex-col">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block py-3 text-base font-medium",
                        isActive ? "text-brand-600" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <SheetFooter>
          {/* Primaerer CTA – einzige Verwendung von --cta im mobilen Menue. */}
          <SheetClose asChild>
            <Button asChild variant="cta" size="lg" className="w-full">
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
