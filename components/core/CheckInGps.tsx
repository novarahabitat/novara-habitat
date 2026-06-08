"use client";

import { useState } from "react";

const SITE = {
  name: "Client Martin",
  address: "15 Rue de la République, Saint-Malo",
  latitude: 48.6493,
  longitude: -2.0257,
  allowedRadiusMeters: 500,
};

function getDistanceInMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) {
  const earthRadius = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadius * c);
}

export default function CheckInGps() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "valid" | "invalid" | "error"
  >("idle");

  const [distance, setDistance] = useState<number | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  function handleCheckIn() {
    setStatus("loading");

    if (!navigator.geolocation) {
      setStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const calculatedDistance = getDistanceInMeters(
          userLat,
          userLng,
          SITE.latitude,
          SITE.longitude
        );

        setDistance(calculatedDistance);
        setCheckedAt(
          new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        if (calculatedDistance <= SITE.allowedRadiusMeters) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      },
      () => {
        setStatus("error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

  return (
    <div className="mt-5 rounded-[2rem] bg-white p-5 shadow-lg shadow-[#d9ccff]/20">
      <p className="text-sm font-medium text-[#8d7be8]">Pointage GPS</p>

      <p className="mt-2 text-sm text-[#8a7eaa]">
        Arrivée prévue : 08:30
      </p>

      <button
        onClick={handleCheckIn}
        disabled={status === "loading"}
        className="mt-4 w-full rounded-2xl bg-emerald-500 px-5 py-4 font-semibold text-white disabled:opacity-60"
      >
        {status === "loading" ? "Localisation en cours..." : "Pointer mon arrivée"}
      </button>

      {status === "valid" && (
        <div className="mt-4 rounded-2xl bg-emerald-100 p-4 text-sm text-emerald-700">
          <p className="font-bold">✅ Arrivée validée</p>
          <p className="mt-1">Chantier : {SITE.name}</p>
          <p>Distance : {distance} m</p>
          <p>Heure : {checkedAt}</p>
        </div>
      )}

      {status === "invalid" && (
        <div className="mt-4 rounded-2xl bg-orange-100 p-4 text-sm text-orange-700">
          <p className="font-bold">❌ Pas encore sur site</p>
          <p className="mt-1">Distance : {distance} m</p>
          <p>Adresse prévue : {SITE.address}</p>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              SITE.address
            )}`}
            target="_blank"
            className="mt-3 block rounded-2xl bg-orange-500 px-4 py-3 text-center font-semibold text-white"
          >
            Ouvrir GPS vers le chantier
          </a>
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 rounded-2xl bg-red-100 p-4 text-sm text-red-700">
          <p className="font-bold">Localisation impossible</p>
          <p className="mt-1">
            Vérifie que la localisation est autorisée pour NOVARA Core.
          </p>
        </div>
      )}
    </div>
  );
}
