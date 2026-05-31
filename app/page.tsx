function EcoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.045] p-6 transition hover:border-[#c9a45c]/35 hover:bg-white/[0.07]">
      <p className="text-xl font-semibold">{title}</p>
      <p className="mt-3 text-sm leading-6 text-white/55">{text}</p>
    </div>
  );
}
