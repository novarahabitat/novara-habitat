type ProjectCardProps = {
  client: string;
  address: string;
  status: string;
  progress: number;
};

export default function ProjectCard({
  client,
  address,
  status,
  progress,
}: ProjectCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-[#c8a45d]/20 px-3 py-1 text-xs text-[#c8a45d]">
          {status}
        </span>

        <span className="text-sm text-white/50">
          {progress}%
        </span>
      </div>

      <h3 className="mt-4 text-xl font-semibold">
        {client}
      </h3>

      <p className="mt-2 text-sm text-white/60">
        {address}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-[#c8a45d]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button className="mt-5 w-full rounded-2xl bg-[#c8a45d] px-4 py-3 font-medium text-black">
        Ouvrir le chantier
      </button>
    </div>
  );
}
