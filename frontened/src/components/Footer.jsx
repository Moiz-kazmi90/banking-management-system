import { Link } from "react-router-dom";
import { Landmark, Shield, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
                <Landmark size={20} className="text-navy-800" />
              </div>
              <span className="font-display text-xl text-white font-semibold">
                Nov<span className="text-gold-400">Bank</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Your trusted partner for modern digital banking. Secure, fast, and always available.
            </p>
            <div className="flex items-center gap-2 mt-5 text-xs text-green-400">
              <Shield size={14} />
              <span>256-bit SSL Encrypted &amp; RDA Secured</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/",           label: "Home" },
                { to: "/login",      label: "Login" },
                { to: "/signup",     label: "Create Account" },
                { to: "/admin/login",label: "Admin Portal" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-gold-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-widest">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={13} className="text-gold-400 shrink-0" />
                +92 300 0000000
              </li>
              <li className="flex items-center gap-2">
                <Mail size={13} className="text-gold-400 shrink-0" />
                support@novbank.pk
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} className="text-gold-400 shrink-0 mt-0.5" />
                I.I. Chundrigar Road, Karachi
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-700 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
          <p>© {new Date().getFullYear()} NovBank. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-gold-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gold-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}