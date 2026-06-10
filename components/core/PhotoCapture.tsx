"use client";

import { useRef, useState } from "react";

export default function PhotoCapture() {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "review" | "submitted">("idle");

  function handleFileSelected(file?: File) {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setStatus("review");
  }

  function cancelPhoto() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setStatus("idle");
  }

  function submitPhoto() {
    setStatus("submitted");
  }

  return (
    <div className="mt-6 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
      <h2 className="font-semibold">Nouvelle photo</h2>

      <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
        Prenez une photo ou choisissez une image. Vous pourrez vérifier avant
        soumission.
      </p>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(event) => handleFileSelected(event.target.files?.[0])}
      />

      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => handleFileSelected(event.target.files?.[0])}
      />

      {status === "idle" && (
        <>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
          >
            📸 Prendre une photo
          </button>

          <button
            onClick={() => galleryInputRef.current?.click()}
            className="mt-3 w-full rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]"
          >
            📁 Choisir depuis le téléphone
          </button>
        </>
      )}

      {status === "review" && previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl}
            alt="Prévisualisation photo chantier"
            className="h-72 w-full rounded-3xl object-cover"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={cancelPhoto}
              className="rounded-2xl bg-red-100 px-4 py-3 font-semibold text-red-600"
            >
              Annuler
            </button>

            <button
              onClick={submitPhoto}
              className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white"
            >
              Soumettre
            </button>
          </div>

          <button
            onClick={() => cameraInputRef.current?.click()}
            className="mt-3 w-full rounded-2xl bg-[#efe9ff] px-4 py-3 font-semibold text-[#6f5bd8]"
          >
            Reprendre une photo
          </button>
        </div>
      )}

      {status === "submitted" && (
        <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-sm text-emerald-700">
          <p className="font-bold">✅ Photo soumise</p>
          <p className="mt-1">
            La photo est prête pour horodatage, GPS, sauvegarde et analyse IA.
          </p>

          <button
            onClick={cancelPhoto}
            className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
          >
            Ajouter une autre photo
          </button>
        </div>
      )}
    </div>
  );
}
