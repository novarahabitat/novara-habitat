"use client";

import { useRef, useState } from "react";

type RecordingStatus = "idle" | "recording" | "recorded" | "error";

export default function VoiceNoteRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordedAt, setRecordedAt] = useState<string | null>(null);

  async function startRecording() {
    try {
      setStatus("recording");
      setAudioUrl(null);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        setRecordedAt(
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        setStatus("recorded");

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
    } catch {
      setStatus("error");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
      <h2 className="font-semibold">Nouvelle note vocale</h2>

      <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
        Dictez une note chantier ou une demande de commande. Plus tard, NOVARA
        Core triera automatiquement la note avec l’IA.
      </p>

      {status !== "recording" && (
        <button
          onClick={startRecording}
          className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
        >
          🎙 Démarrer l’enregistrement
        </button>
      )}

      {status === "recording" && (
        <button
          onClick={stopRecording}
          className="mt-4 w-full rounded-2xl bg-red-500 px-5 py-4 font-semibold text-white"
        >
          ⏹ Arrêter l’enregistrement
        </button>
      )}

      {status === "recording" && (
        <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm font-semibold text-red-700">
          Enregistrement en cours...
        </div>
      )}

      {status === "recorded" && audioUrl && (
        <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-sm text-emerald-700">
          <p className="font-bold">✅ Note enregistrée</p>
          <p className="mt-1">Heure : {recordedAt}</p>

          <audio controls src={audioUrl} className="mt-3 w-full" />

          <div className="mt-4 rounded-2xl bg-white/70 p-3 text-[#6f5bd8]">
            Statut : en attente d’analyse IA
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm text-red-700">
          <p className="font-bold">Microphone indisponible</p>
          <p className="mt-1">
            Autorise l’accès au micro pour utiliser les notes vocales.
          </p>
        </div>
      )}
    </div>
  );
}
