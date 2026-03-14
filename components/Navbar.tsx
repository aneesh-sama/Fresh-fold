import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-center sm:text-left">
          Fresh Fold
        </h1>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-sm">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/schedule">Schedule Pickup</Link>
          <Link href="/track">Track</Link>
        </div>

      </div>
    </nav>
  );
}