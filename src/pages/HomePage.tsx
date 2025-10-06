// src/pages/HomePage.tsx
import { motion, useSpring,useTransform, useViewportScroll } from "framer-motion";
import { Clock, Pizza as PizzaIcon,Star, Truck } from "lucide-react";
import React from "react";
import { Helmet } from "react-helmet-async";

import Button from "../components/ui/Button";
import { pizzas } from "../data/pizzas";

const HomePage: React.FC = () => {
  const { scrollY } = useViewportScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, -40]);
  const smoothY = useSpring(parallaxY, { stiffness: 50, damping: 20 });
  const featuredPizzas = pizzas.filter(p => p.popular).slice(0, 3);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div>
      {/* SEO */}
      <Helmet>
        <title>Rapida&Sabrosa | La Mejor Pizza Artesanal</title>
        <meta
          name="description"
          content="Rapida&Sabrosa ofrece pizzas artesanales hechas a mano con ingredientes frescos y recetas italianas auténticas. Pide online y disfruta rápido."
        />
        <meta name="keywords" content="pizza, artesanal, delivery, rápido, ingredientes frescos, comida artesanal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="Rapida&Sabrosa | La Mejor Pizza Artesanal" />
        <meta
          property="og:description"
          content="Rapida&Sabrosa ofrece pizzas artesanales hechas a mano con ingredientes frescos y recetas italianas auténticas."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tu-dominio.com/" />
        <meta property="og:image" content="https://tu-dominio.com/images/pizzas/pizza-hero.jpeg" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rapida&Sabrosa | La Mejor Pizza Artesanal" />
        <meta
          name="twitter:description"
          content="Rapida&Sabrosa ofrece pizzas artesanales hechas a mano con ingredientes frescos y recetas italianas auténticas."
        />
        <meta name="twitter:image" content="https://tu-dominio.com/images/pizzas/pizza-hero.jpeg" />
      </Helmet>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cover bg-center">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ y: smoothY, backgroundImage: "url('/images/pizzas/pizza-hero.jpeg')" }}
        />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />
        <div className="container-custom relative z-20 py-20 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl">
            La más rápida y sabrosa pizza para tu paladar
          </h1>
          <p className="mb-8 text-base text-neutral-100 sm:text-lg md:text-xl">
            Hecho a mano con cariño utilizando los mejores ingredientes y recetas tradicionales.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button to="/catalog" variant="primary">Menú</Button>
            <Button to="/order" variant="accent">Orden</Button>
          </div>
        </div>
      </section>

      {/* POPULAR PIZZAS */}
      <section className="bg-neutral-50 py-16 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-3"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {featuredPizzas.map(p => (
              <motion.div key={p.id} variants={item} className="card">
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                  {p.isNew && (
                    <span className="absolute left-2 top-2 rounded-full bg-accent-500 px-2 py-1 text-xs font-bold text-white">
                      NEW
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white sm:text-xl">{p.name}</h3>
                    <span className="font-bold text-secondary-600">${p.price.toFixed(2)}</span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base">{p.description}</p>
                  <Button to="/catalog" variant="primary">Pedir</Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="container-custom grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.img
            src="https://images.pexels.com/photos/1566837/pexels-photo-1566837.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Traditional pizza making"
            className="overflow-hidden rounded-lg shadow-lg w-full h-full object-cover"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Nuestra Pasión por la Pizza Perfecta
            </h2>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
              Por más de 25 años, Rapidos&Sabrosos ha estado creando auténticas pizzas italianas usando métodos tradicionales y los mejores ingredientes.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center text-accent-600 text-sm sm:text-base">
                <Clock size={20} className="mr-2" />
                <span className="font-medium">25+ Años de Experiencia</span>
              </span>
              <span className="flex items-center text-primary-600 text-sm sm:text-base">
                <Star size={20} className="mr-2" />
                <span className="font-medium">Recetas Italianas Auténticas</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div className="mb-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="mb-4 text-2xl dark:text-white font-bold sm:text-3xl md:text-4xl">¿Porqué Elegirnos?</h2>
            <p className="mx-auto max-w-2xl text-sm text-gray-600 dark:text-gray-300 sm:text-base">
              Nuestro compromiso con la calidad y la tradición nos hace diferentes del resto.
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 gap-8 md:grid-cols-3" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
            {[
              { icon: PizzaIcon, title: "Recetas Auténticas", text: "Elaboradas con técnicas tradicionales y recetas transmitidas a través de generaciones." },
              { icon: Star, title: "Ingredientes Premium", text: "Solo los ingredientes más frescos y de la más alta calidad para un sabor inigualable." },
              { icon: Truck, title: "Entrega Rápida", text: "Pizza caliente y fresca entregada directamente a tu puerta en 30 minutos." },
            ].map((feature, idx) => (
              <motion.div key={idx} variants={item} className="card p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500">
                  <feature.icon size={32} className="text-white" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-yellow-400 to-orange-500 py-16 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} viewport={{ once: true }}>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl md:text-4xl">¿Listo para Probar la Diferencia?</h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm text-white/90 sm:text-base">
              Ordena ahora y experimenta el auténtico sabor de la pizza italiana entregada fresca a tu puerta.
            </p>
            <Button to="/catalog" variant="primary">Ver Carta Completa</Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
