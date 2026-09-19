import Link from "next/link";
import { Send } from "lucide-react";

import { imprint } from "@/config/legal";
import { DemoForm } from "@/components/sections/demo/demo-form";

/**
 * Sektion 13 – das Projekt-Formular. Ersetzt das reine Kontaktband.
 *
 * ==========================================================================
 * ANPASSUNG AN REGEL A
 * ==========================================================================
 * Die Vorlage schlug „Sie planen bereits ein Forschungsprojekt?" vor. Das
 * schreibt der Leserin zu, was sie tut – Regel A, derselbe Satzbau wie „Sie
 * wollen doch …". Die deutsche Endfassung fragt stattdessen nach der SACHE:
 * „Ein Forschungsprojekt in Planung?" Die englische folgt dieser Haltung.
 *
 * „Three sentences are enough." ist kein Stilmittel, sondern die Antwort auf
 * die Huerde, an der solche Formulare scheitern: Wer glaubt, einen Antrag
 * schreiben zu muessen, schreibt gar nicht.
 */
export function ResearchForm() {
  return (
    <section
      id="research-project-form"
      aria-labelledby="forschung-formular-titel"
      className="scroll-mt-24 bg-surface-alt"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          {/* Anker fuer die Leerraum-Regel – der Formular-Ausschnitt besteht
              sonst aus Ueberschrift und Eingabefeldern. */}
          <Send aria-hidden="true" className="size-8 text-brand-600" />

          <h2
            id="forschung-formular-titel"
            className="mt-6 text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
          >
            A research project in the making? Three sentences are enough.
          </h2>

          <p className="mt-6 text-lg text-gray-500">
            We reply on working days — and say plainly whether it fits technically.
          </p>

          <div className="mt-12">
            <DemoForm source="forschung" />
          </div>

          <p className="mt-10 text-base text-gray-500">
            Rather write it out?{" "}
            <a
              href={`mailto:${imprint.email}`}
              className="text-brand-600 underline underline-offset-4"
            >
              {imprint.email}
            </a>{" "}
            —{" "}
            <Link href="/preview" className="text-brand-600 underline underline-offset-4">
              or try it yourself first
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
