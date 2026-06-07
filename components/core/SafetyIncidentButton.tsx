"use client";

import { useEffect, useState } from "react";

export default function SafetyIncidentButton() {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const alreadySeen = localStorage.getItem("novara_safety_intro_seen");

    if (!alreadySeen) {
      setShowInfo(true);
    }
  }, []);

  function closeInfo() {
    localStorage.setItem("novara_safety_intro_seen", "true");
    setShowInfo(false);
  }

  return (
    <>
      <button
        onClick={() => setShowInfo(true)}
        className="fixed left-4 top-4 z-50 flex h-14 w-14 items-center justify-center"
        aria-label="Déclarer un incident ou accident"
      >
        <div className="relative h-0 w-0 border-l-[28px] border-r-[28px] border-b-[48px] border-l-transparent border-r-transparent border-b-[#ffd43b] drop-shadow-lg">
          <span className="absolute left-[-5px] top-[14px] text-2xl font-black text-black">
            !
          </span>
        </div>
      </button>

      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-[2rem] bg-white p-6 text-[#34275f] shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-0 w-0 border-l-[20px] border-r-[20px] border-b-[34px] border-l-transparent border-r-transparent border-b-[#ffd43b]">
                <span className="absolute left-[-4px] top-[9px] text-lg font-black text-black">
                  !
                </span>
              </div>

              <h2 className="text-xl font-bold">
                Incident / Accident
              </h2>
            </div>

            <p className="text-sm leading-6 text-[#756a96]">
              Ce bouton sert à signaler immédiatement un accident, un incident,
              un dommage matériel, un dommage chez le client, un véhicule
              endommagé ou une situation dangereuse.
            </p>

            <div className="mt-4 rounded-2xl bg-[#fff7d6] p-4 text-sm text-[#6b5a1f]">
              À utiliser dès que possible après l’événement. Le signalement
              protège l’employé, le client, NOVARA et les assurances.
            </div>

            <button
              onClick={closeInfo}
              className="mt-5 w-full rounded-2xl bg-[#8d7be8] px-5 py-4 font-semibold text-white"
            >
              J’ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
}
