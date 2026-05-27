import Link from "next/link";
export default function Footer(){
 return <footer className="border-t border-white/10 bg-black px-6 py-10 text-center text-sm text-white/50">
  <p className="tracking-[0.25em] text-[#c9a45c]">NOVARA HABITAT</p>
  <p className="mt-3">Habitat · Studio · Voltis · Core · Sales</p>
  <div className="mt-6 flex justify-center gap-5 text-xs text-white/25">
   <Link href="/core" className="hover:text-[#c9a45c]">NOVARA Core</Link>
   <Link href="/sales" className="hover:text-[#c9a45c]">NOVARA Sales</Link>
  </div>
 </footer>
}
