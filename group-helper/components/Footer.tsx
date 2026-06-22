import Image from "next/image";
import Link from "next/link";

const links = {
  Product: ["Features", "How It Works", "Pricing", "Changelog"],
  Company: ["About Us", "Blog", "Careers", "Contact"],
  Support: ["Help Center", "Community", "Privacy Policy", "Terms of Service"],
};

const socials = ["T", "I", "L"];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
     <div className="px-16 py-14">

        {/* Top */}
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/group-helper-logo.png" alt="Group Helper" width={40} height={40} />
              <span className="text-xl font-extrabold">
                <span className="text-blue-600">group</span>
                <span className="text-green-600">-helper</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              The all-in-one platform for students to organize their study groups and collaborate more effectively.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <Link
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-colors text-xs font-semibold"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-slate-800 mb-4">{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-slate-400 hover:text-slate-700 transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © 2025 Group Helper. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}