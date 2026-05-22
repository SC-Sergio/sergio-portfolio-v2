"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type AnimatedSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  delay?: number;
};

export default function AnimatedSection({
  id,
  className,
  children,
  delay = 0,
}: AnimatedSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.5,
        ease: "easeOut",
        delay: shouldReduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.section>
  );
}
