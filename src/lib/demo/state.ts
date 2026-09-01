import type { DemoField } from "@/lib/demo/schema";

/**
 * Zustand des Demo-Formulars.
 *
 * Liegt bewusst NICHT in src/app/meet/actions.ts: Eine Datei mit der Direktive
 * "use server" darf ausschliesslich async-Funktionen exportieren. Ein
 * zusaetzlich exportiertes Objekt laesst den Build durchlaufen und die Seite
 * erst zur Laufzeit abstuerzen
 * („A 'use server' file can only export async functions, found object“).
 */
export type DemoFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<DemoField | "consent", string>>;
};

export const INITIAL_DEMO_STATE: DemoFormState = { status: "idle" };
