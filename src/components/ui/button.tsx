import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Button (shadcn/ui, an die Projekt-Tokens angepasst).
 *
 * WICHTIG – Variante "cta":
 * Sie ist die einzige Stelle im gesamten Projekt, die `bg-cta` verwendet, und
 * bleibt dem primaeren Call-to-Action vorbehalten ("Selyvi kennenlernen").
 * Fuer alle anderen Aktionen: "primary" (brand-600), "outline" oder "ghost".
 *
 * Hover-Zustaende arbeiten bewusst mit Deckkraft statt mit zusaetzlichen
 * Farbwerten – so bleibt die Token-Regel unverletzt und es entstehen keine
 * Verlaeufe.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-md text-sm font-medium",
    "transition-[opacity,color,background-color,border-color] duration-150",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        /** NUR primaerer Call-to-Action. Nirgendwo sonst einsetzen. */
        cta: "bg-cta text-surface hover:opacity-90",
        /** Standard-Primaeraktion innerhalb von Inhalten. */
        primary: "bg-brand-600 text-surface hover:opacity-90",
        outline: "border border-gray-200 bg-surface text-ink hover:bg-surface-alt",
        /** Outline-Variante fuer dunkle Flaechen (brand-800), z. B. DSGVO-Sektion. */
        outlineInverse:
          "border border-surface bg-transparent text-surface hover:bg-surface hover:text-brand-800",
        ghost: "text-ink hover:bg-surface-alt",
        link: "text-brand-600 underline-offset-4 hover:underline",
      },
      size: {
        /* Auf dem Telefon mindestens 44 px hoch (WCAG 2.5.8, Target Size).
           „md" war 40 px – in der Vorschau der Knopf „Add", gemessen bei der
           Jank-Jagd. Ab sm bleiben die kompakten Hoehen. */
        sm: "min-h-11 px-3 sm:h-9 sm:min-h-0",
        md: "min-h-11 px-4 sm:h-10 sm:min-h-0",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
export type { ButtonProps };
