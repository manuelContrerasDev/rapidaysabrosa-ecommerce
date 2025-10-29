// src/components/layout/Footer.tsx
import {
  Clock,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const quickLinks = [
  { id: "home", title: "Inicio", to: "/home" },
  { id: "menu", title: "Menú", to: "/catalog" },
  { id: "order", title: "Ordenar", to: "/order" },
  { id: "about", title: "Sobre Nosotros", to: "#" },
  { id: "contact", title: "Contacto", to: "#" },
] as const;

const hours = [
  { id: "weekday", days: "Lunes - Jueves", time: "12:00 - 22:30" },
  { id: "weekend", days: "Viernes - Sábado", time: "12:00 - 23:30" },
  { id: "sunday", days: "Domingo", time: "12:00 - 22:30" },
] as const;

const socialLinks = [
  { id: "instagram", icon: Instagram, href: "https://www.instagram.com/espacio_308/" },
  { id: "facebook", icon: Facebook, href: "#" },
  { id: "twitter", icon: Twitter, href: "#" },
] as const;

const linkClass =
  "text-gray-300 hover:text-[#FFB703] dark:hover:text-[#FFD54F] transition-colors";

const Footer: React.FC = () => {
  return (
    <footer
      role="contentinfo"
      className="bg-[#1a1a1a] dark:bg-gray-950 text-white pt-12 pb-6"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* 🧱 Sobre nosotros */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-[#FFB703]">
              Rápida&Sabrosa
            </h3>
            <p className="mb-4 text-gray-300 dark:text-gray-400">
              Pizzas artesanales con ingredientes de primera y nuestro sello
              inconfundible: sabor, rapidez y pasión por lo que hacemos.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ id, icon: Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`Ir a ${id}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </section>

          {/* ☎️ Contacto */}
          <address className="not-italic">
            <h3 className="mb-4 text-xl font-bold text-[#FFB703]">
              Contáctanos
            </h3>
            <div className="space-y-3 text-gray-300 dark:text-gray-400">
              <p className="flex items-center">
                <Phone size={18} className="mr-2 text-[#FFB703]" /> (+56) 9 7431
                4602
              </p>
              <p className="flex items-center">
                <Mail size={18} className="mr-2 text-[#FFB703]" />{" "}
                hola@rapidaysabrosa.com
              </p>
              <p className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-[#FFB703]" />
                Av. Santelices 200b, Isla de Maipo, Región Metropolitana
              </p>
            </div>
          </address>

          {/* ⏰ Horarios */}
          <section>
            <h3 className="mb-4 text-xl font-bold text-[#FFB703]">Horario</h3>
            <div className="space-y-3 text-gray-300 dark:text-gray-400">
              {hours.map(({ id, days, time }) => (
                <div key={id} className="flex items-start">
                  <Clock size={18} className="mr-2 text-[#FFB703] mt-1" />
                  <div>
                    <p className="font-medium">{days}</p>
                    <p>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 🔗 Enlaces rápidos */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="mb-4 text-xl font-bold text-[#FFB703]">Enlaces</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ id, title, to }) => (
                <li key={id}>
                  {to.startsWith("/") ? (
                    <Link to={to} className={linkClass}>
                      {title}
                    </Link>
                  ) : (
                    <a href={to} className={linkClass}>
                      {title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* 🔻 Footer bottom */}
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Rápida&Sabrosa. Todos los derechos
            reservados por{" "}
            <span className="font-semibold text-[#FFB703]">ManuDev</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
