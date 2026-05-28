import Link from "next/link";
export default function Header(){
 return <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/70 backdrop-blur-xl">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
   <Link href="/" className="tracking-[0.35em] text-sm font-semibold text-[#c9a45c]">NOVARA</Link>
   <nav className="hidden items-center gap-8 text-sm text-white/75 md:flex">
    <a href="/#contact" className="hover:text-[#c9a45c]">Contact</a>
    <Link href="/connexion" className="rounded-full border border-[#c9a45c]/60 px-4 py-2 text-[#c9a45c] hover:bg-[#c9a45c] hover:text-black">Accès</Link>
   </nav>
  </div>
 </header>
}
