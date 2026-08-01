"use client";

import { motion } from "framer-motion";

/** Atmosphere navy / or — alignée sur l’identité dashboard */
export function GradientBlobs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base wash — sort du blanc plat */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #eef1f7 0%, #f7f4eb 42%, #e8edf5 78%, #f3efe4 100%)",
        }}
      />

      {/* Grille discrète */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(43,58,103,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(43,58,103,0.06) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 30%, black 20%, transparent 75%)",
        }}
      />

      <motion.div
        className="absolute -left-40 -top-48 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(43,58,103,0.45) 0%, transparent 68%)",
        }}
        animate={{ x: [0, 40, 0], y: [0, 24, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -right-32 top-[12%] h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(201,162,39,0.38) 0%, transparent 68%)",
        }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.18, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-[-10%] left-[25%] h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(74,98,148,0.28) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute right-[15%] bottom-[20%] h-64 w-64 rounded-full blur-2xl"
        style={{
          background: "radial-gradient(circle, rgba(201,162,39,0.25) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -28, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
