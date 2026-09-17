"use client";

import React, {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const reducedMotion = usePrefersReducedMotion();
  const isDisabled = disabled || reducedMotion;
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDisabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        const rawX = (e.clientX - centerX) / magnetStrength;
        const rawY = (e.clientY - centerY) / magnetStrength;
        setPosition({
          x: Math.max(-5, Math.min(5, rawX)),
          y: Math.max(-5, Math.min(5, rawY)),
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, isDisabled, magnetStrength]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;
  const displayPosition = isDisabled ? { x: 0, y: 0 } : position;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: isDisabled
            ? undefined
            : `translate3d(${displayPosition.x}px, ${displayPosition.y}px, 0)`,
          transition: isDisabled ? undefined : transitionStyle,
          willChange: isDisabled ? undefined : "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
