import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Mail,
} from "lucide-react";

const quickLinks = [
  { title: "Inicio", to: "/home" },
  { title: "Menú", to: "/catalog" },
  { title: "Ordenar", to: "/order" },
  { title: "Sobre Nosotros", to: "#" },
  { title: "Contacto", to: "#" },
] as const;

const hours = [
  { days: "Lunes - Jueves", time: "12:00 - 22:30" },
  { days: "Viernes - Sábado", time: "12:00 - 23:30" },
  { days: "Domingo", time: "12:00 - 22:30" },
] as const;

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/espacio_308/" },
  { icon: Facebook, href: "#" },
  { icon: Twitter, href: "#" },
] as const;

const linkClass =
  "text-gray-300 hover:text-accent-300 dark:hover:text-accent-400 transition-colors";

const Footer: React.FC = () => {
  return (
    <footer className="bg-olive-dark dark:bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Rapida&Sabrosa</h3>
            <p className="mb-4 text-gray-200 dark:text-gray-400">
              Auténticas pizzas artesanales hechas con los mejores ingredientes
              y todo el cariño de nuestro sello profesional, entregadas
              directamente a ti.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`Ir a ${href}`}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <address className="not-italic">
            <h3 className="mb-4 text-xl font-bold">Contáctanos</h3>
            <div className="space-y-3 text-gray-200 dark:text-gray-400">
              <div className="flex items-center">
                <Phone size={18} className="mr-2 text-accent-300" />
                <span>(+56) 9 7431 4602</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="mr-2 text-accent-300" />
                <span>hola@rapidosysabrosos.com</span>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-accent-300" />
                <span>
                  Av. Santelices 200b, Isla de Maipo, Región Metropolitana
                </span>
              </div>
            </div>
          </address>

          {/* Hours */}
          <div>
            <h3 className="mb-4 text-xl font-bold">Horario</h3>
            <div className="space-y-3 text-gray-200 dark:text-gray-400">
              {hours.map(({ days, time }) => (
                <div key={days} className="flex items-start">
                  <Clock size={18} className="mr-2 text-accent-300 mt-1" />
                  <div>
                    <p className="font-medium">{days}</p>
                    <p>{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Enlaces rápidos">
            <h3 className="mb-4 text-xl font-bold">Enlaces</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ title, to }) => (
                <li key={to}>
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

        {/* Bottom */}
        <div className="mt-8 border-t border-olive dark:border-gray-600 pt-6 text-center text-sm text-neutral-300">
          <p>
            &copy; {new Date().getFullYear()} Rapida&Sabrosa. Todos los derechos
            reservados por <span className="font-semibold">Manudev</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
