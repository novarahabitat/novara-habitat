"use client";

import { useRef, useState } from "react";

type RecordingStatus =
  | "idle"
  | "recording"
  | "review"
  | "submitted"
  | "error";

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
      setRecordedAt(null);
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

        setStatus("review");

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

  function cancelRecording() {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioUrl(null);
    setRecordedAt(null);
    audioChunksRef.current = [];
    setStatus("idle");
  }

  function submitRecording() {
    setStatus("submitted");
  }

  return (
    <div className="rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
      <h2 className="font-semibold">Nouvelle note vocale</h2>

      <p className="mt-2 text-sm leading-6 text-[#8a7eaa]">
        Enregistrez une note. Après l’enregistrement, vous pourrez réécouter,
        soumettre ou annuler avant envoi.
      </p>

      {status === "idle" && (
        <button
          onClick={startRecording}
          className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
        >
          🎙 Démarrer l’enregistrement
        </button>
      )}

      {status === "recording" && (
        <>
          <button
            onClick={stopRecording}
            className="mt-4 w-full rounded-2xl bg-red-500 px-5 py-4 font-semibold text-white"
          >
            ⏹ Arrêter l’enregistrement
          </button>

          <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm font-semibold text-red-700">
            Enregistrement en cours...
          </div>
        </>
      )}

      {status === "review" && audioUrl && (
        <div className="mt-4 rounded-2xl bg-[#f7f2ff] p-4 text-sm text-[#34275f]">
          <p className="font-bold">Note prête à vérifier</p>
          <p className="mt-1 text-[#8a7eaa]">Heure : {recordedAt}</p>

          <audio controls src={audioUrl} className="mt-3 w-full" />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={cancelRecording}
              className="rounded-2xl bg-red-100 px-4 py-3 font-semibold text-red-600"
            >
              Annuler
            </button>

            <button
              onClick={submitRecording}
              className="rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-white"
            >
              Soumettre
            </button>
          </div>

          <button
            onClick={startRecording}
            className="mt-3 w-full rounded-2xl bg-[#efe9ff] px-4 py-3 font-semibold text-[#6f5bd8]"
          >
            Recommencer l’enregistrement
          </button>
        </div>
      )}

      {status === "submitted" && (
        <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-sm text-emerald-700">
          <p className="font-bold">✅ Note soumise</p>
          <p className="mt-1">
            La note est prête pour transcription, découpage IA et triage.
          </p>

          <button
            onClick={startRecording}
            className="mt-4 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
          >
            🎙 Nouvelle note
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm text-red-700">
          <p className="font-bold">Microphone indisponible</p>
          <p className="mt-1">
            Autorise l’accès au micro pour utiliser les notes vocales.
          </p>

          <button
            onClick={() => setStatus("idle")}
            className="mt-4 w-full rounded-2xl bg-[#efe9ff] px-5 py-4 font-semibold text-[#6f5bd8]"
          >
            Réessayer
          </button>
        </div>
      )}
    </div>
  );
}
