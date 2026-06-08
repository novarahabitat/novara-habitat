export default function CoreLoginPage() {
  return (
    <main className="min-h-screen bg-[#fbf7ff] px-5 py-8 text-[#34275f]">
      <section className="mx-auto flex min-h-screen max-w-md flex-col justify-center">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-4xl font-bold text-[#8d7be8] shadow-xl shadow-[#d9ccff]/30">
            N
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-[#8d7be8]">
            NOVARA CORE
          </p>

          <h1 className="mt-4 text-3xl font-bold">
            Connexion terrain
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#8a7eaa]">
            Accès réservé aux équipes NOVARA.
          </p>
        </div>

        <div className="rounded-[2rem] bg-white p-5 shadow-xl shadow-[#d9ccff]/25">
          <label className="text-sm font-semibold text-[#6f5bd8]">
            Email professionnel
          </label>

          <input
            type="email"
            placeholder="prenom@novara.fr"
            className="mt-2 w-full rounded-2xl bg-[#f7f2ff] px-4 py-4 outline-none"
          />

          <label className="mt-4 block text-sm font-semibold text-[#6f5bd8]">
            Mot de passe
          </label>

          <input
            type="password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-2xl bg-[#f7f2ff] px-4 py-4 outline-none"
          />

          <a
            href="/core"
            className="mt-6 block w-full rounded-2xl bg-[#8d7be8] px-5 py-4 text-center font-semibold text-white shadow-lg shadow-[#8d7be8]/25"
          >
            Se connecter
          </a>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-[#9a8fb8]">
          Connexion sécurisée. Les données chantier, GPS, pointage et RH sont
          réservées aux utilisateurs autorisés.
        </p>
      </section>
    </main>
  );
}
