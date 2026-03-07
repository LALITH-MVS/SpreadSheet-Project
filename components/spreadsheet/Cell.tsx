"use client";

import { useState } from "react";

export default function Cell({ cellId }: { cellId: string }) {
  const [active, setActive] = useState(false);

  return (
    <div
      className={`relative border border-gray-300 h-full w-full ${
        active ? "z-10" : ""
      }`}
    >
      <input
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className={`w-full h-full px-2 outline-none bg-white text-black ${
          active ? "border-2 border-blue-500" : "border-none"
        }`}
      />

      {/* Fill Handle (small blue dot) */}
      {active && (
        <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -bottom-1 -right-1"></div>
      )}
    </div>
  );
}