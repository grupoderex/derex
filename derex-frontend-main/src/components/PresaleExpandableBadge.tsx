"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface PresaleExpandableBadgeProps {
  title?: string;
  description?: string;
}

export function PresaleExpandableBadge({
  title,
  description,
}: PresaleExpandableBadgeProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Medir la altura del contenido cuando se expande
    if (descriptionRef.current && isExpanded) {
      setContentHeight(descriptionRef.current.scrollHeight);
    }
  }, [isExpanded, description]);

  useEffect(() => {
    // Animación inicial: mostrar y ocultar automáticamente
    const timeout1 = setTimeout(() => setIsExpanded(true), 500);
    const timeout2 = setTimeout(() => setIsExpanded(false), 4000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <motion.div
      className="bg-presale-fade rounded-lg flex flex-row items-start cursor-pointer shadow-lg overflow-hidden"
      onHoverStart={() => !isMobile && setIsExpanded(true)}
      onHoverEnd={() => !isMobile && setIsExpanded(false)}
      initial="closed"
      animate={isExpanded || isMobile ? "open" : "closed"}
      variants={{
        open: {
          width: isMobile ? "100%" : "auto",
          height: "auto",
        },
        closed: {
          width: "200px",
          height: "auto",
        },
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 28,
      }}
    >
      {/* SVG */}
      <svg
        width="40"
        height="26"
        style={{ minWidth: "40px", minHeight: "26px" }}
        viewBox="0 0 40 26"
        className="self-start mt-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_216_43"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="40"
          height="26"
        >
          <rect width="40" height="26" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_216_43)">
          <path d="M13 10H17L-7 63H-11L13 10Z" fill="white" />
          <path d="M28 0H32L8 53H4L28 0Z" fill="#CD1019" />
          <path d="M36 14H40L16 67H12L36 14Z" fill="white" />
        </g>
      </svg>

      {/* Contenido */}
      <div className="flex flex-col md:flex-row md:items-start items-start py-3 px-5 flex-1 min-w-0">
        <span className="text-white font-display text-lg font-bold md:mr-4 whitespace-nowrap">
          {title}
        </span>

        <motion.div
          className="overflow-hidden w-full md:w-auto"
          variants={{
            open: {
              height: "auto",
              opacity: 1,
              marginTop: isMobile ? "0.5rem" : 0,
            },
            closed: {
              height: 0,
              opacity: 0,
              marginTop: 0,
            },
          }}
          transition={{
            height: {
              type: "spring",
              stiffness: 280,
              damping: 28,
            },
            opacity: {
              duration: 0.25,
            },
          }}
        >
          <div
            ref={descriptionRef}
            className="text-white font-medium text-md md:max-w-[400px] leading-relaxed"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {description}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
