"use client";

import React from "react";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer location pin shape with green gradient */}
      <path
        d="M50 10C30 10 14 26 14 46C14 68 44 87 47 89C49 90 51 90 53 89C56 87 86 68 86 46C86 26 70 10 50 10Z"
        fill="#16a34a"
      />
      {/* Inner white crop/leaf details */}
      <path
        d="M50 25C50 25 38 38 38 48C38 52 41 55 45 55C49 55 50 50 50 48C50 50 51 55 55 55C59 55 62 52 62 48C62 38 50 25 50 25Z"
        fill="white"
      />
      <path
        d="M50 42V55"
        stroke="#16a34a"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Overlay analytics graph line going up and to the right in dark color */}
      <path
        d="M30 65L45 50L58 58L75 38"
        stroke="#1f2937"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Graph line pointer arrow */}
      <path
        d="M68 38H75V45"
        stroke="#1f2937"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
