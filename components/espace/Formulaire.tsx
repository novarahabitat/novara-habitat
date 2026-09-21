"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { EtatAction } from "@/lib/types";

type Action = (etat: EtatAction, fd: FormData) => Promise<EtatAction>;

/**
 * Formulaire relié à une action serveur : affiche l'erreur ou la confirmation
 * renvoyée, et peut se vider après un succès (commentaires, lignes…).
 */
export function Formulaire({
  action,
  children,
  className,
  viderApresSucces = false,
  confirmation,
}: {
  action: Action;
  children: React.ReactNode;
  className?: string;
  viderApresSucces?: boolean;
  /** Message de confirmation demandé avant l'envoi (actions irréversibles). */
  confirmation?: string;
}) {
  const [etat, envoyer] = useActionState(action, undefined);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat?.ok && viderApresSucces) ref.current?.reset();
  }, [etat, viderApresSucces]);

  return (
    <form
      ref={ref}
      action={envoyer}
      className={className}
      onSubmit={(e) => {
        if (confirmation && !window.confirm(confirmation)) e.preventDefault();
      }}
    >
      {children}
      {etat?.erreur && (
        <p role="alert" className="mt-3 text-sm text-alerte">
          {etat.erreur}
        </p>
      )}
      {etat?.ok && !viderApresSucces && <p className="mt-3 text-sm text-foret">{etat.ok}</p>}
    </form>
  );
}

export function BoutonEnvoi({
  children,
  enCours = "Enregistrement…",
  variante = "principal",
  className = "",
}: {
  children: React.ReactNode;
  enCours?: string;
  variante?: "principal" | "secondaire" | "danger";
  className?: string;
}) {
  const { pending } = useFormStatus();
  const classe =
    variante === "principal" ? "bouton" : variante === "secondaire" ? "bouton-secondaire" : "bouton-danger";
  return (
    <button type="submit" disabled={pending} className={`${classe} ${className}`}>
      {pending ? enCours : children}
    </button>
  );
}
