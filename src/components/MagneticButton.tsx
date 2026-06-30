import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useRef, useState, type CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type IconType =
    | "arrow-right"
    | "arrow-up-right"
    | "chevron-right"
    | "plus"
    | "sparkle"
    | "calendar";
type IconAnimation = "slide" | "bounce" | "rotate" | "none";

interface StateStyle {
    backgroundColor: string;
    textColor: string;
    scale: number;
}

export interface MagneticButtonProps {
    // Content
    label: string;
    ariaLabel?: string;

    // Link
    link?: string;
    linkTarget?: "_self" | "_blank";

    // State
    disabled?: boolean;

    // Typography
    font?: CSSProperties;

    // Appearance
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: string;

    // Border
    borderWidth?: number;
    borderColor?: string;
    borderStyle?: "solid" | "dashed" | "dotted" | "double" | "none";

    // Shadow
    boxShadow?: string;

    // Grouped interaction states
    hover?: Partial<StateStyle>;
    pressed?: Partial<StateStyle>;

    // Icon
    showIcon?: boolean;
    icon?: IconType;
    iconSize?: number;
    iconGap?: number;
    iconAnimation?: IconAnimation;

    // Magnet / spring physics
    magnetStrength?: number;
    stiffness?: number;
    damping?: number;

    // Dynamic hover filling
    hoverFill?: boolean;
    hoverFillColor?: string;

    // Glass style options
    glass?: boolean;

    // Disable magnetic effect
    disableMagnet?: boolean;

    // Custom Slide Icon Effect (e.g. rotated diamond sliding out on the right with custom SVG)
    slideIconEffect?: boolean;
    slideIconColor?: string;
    slideIconActiveWidth?: number;
    slideIconInactiveWidth?: number;

    // Events
    onClick?: () => void;

    style?: CSSProperties;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const ICONS: Record<IconType, React.ReactElement> = {
    "arrow-right": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
        >
            <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
    ),
    "arrow-up-right": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
        >
            <path d="M7 17L17 7M7 7h10v10" />
        </svg>
    ),
    "chevron-right": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full"
        >
            <path d="M9 18l6-6-6-6" />
        </svg>
    ),
    plus: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            className="w-full h-full"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    sparkle: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
        </svg>
    ),
    calendar: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-brand-yellow"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
    ),
};

function getIconHoverStyle(animation: IconAnimation, icon: IconType) {
    if (animation === "none") return {};
    if (animation === "bounce") return { scale: 1.3 };
    if (animation === "rotate")
        return { rotate: icon === "arrow-up-right" ? -30 : 90 };
    if (animation === "slide") {
        if (icon === "arrow-up-right") return { x: 3, y: -3 };
        if (icon === "sparkle") return { y: -3 };
        return { x: 5 };
    }
    return {};
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MagneticButton(props: MagneticButtonProps) {
    const {
        label,
        ariaLabel,
        link,
        linkTarget = "_self",
        disabled = false,
        font = {
            fontSize: "15px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: "1em",
            fontFamily: "inherit",
        },
        backgroundColor = "#0f0f0f",
        textColor = "#ffffff",
        borderRadius = 100,
        padding = "16px 32px",
        borderWidth = 0,
        borderColor = "#0f0f0f",
        borderStyle = "none",
        boxShadow = "none",
        hover = {
            backgroundColor: "#333333",
            textColor: "#ffffff",
            scale: 1.08,
        },
        pressed = {
            backgroundColor: "#000000",
            textColor: "#ffffff",
            scale: 0.95,
        },
        showIcon = true,
        icon = "arrow-right",
        iconSize = 16,
        iconGap = 8,
        iconAnimation = "slide",
        magnetStrength = 20,
        stiffness = 150,
        damping = 15,
        hoverFill = true,
        hoverFillColor = "#ffffff",
        glass = false,
        disableMagnet = false,
        slideIconEffect = false,
        slideIconColor = "#2ecc71",
        slideIconActiveWidth = 200,
        slideIconInactiveWidth = 250,
        onClick,
        style,
    } = props;

    const isCanvas = false;

    const ref = useRef<HTMLButtonElement & HTMLAnchorElement>(null);

    const [isHovered, setIsHovered] = useState(false);
    const [hoverStartPos, setHoverStartPos] = useState({ x: 0, y: 0 });

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { stiffness, damping };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    const effectiveStrength = disableMagnet ? 0 : Math.max(1, magnetStrength);
    const rotateX = useTransform(y, [-effectiveStrength, effectiveStrength], [8, -8]);
    const rotateY = useTransform(x, [-effectiveStrength, effectiveStrength], [-8, 8]);

    // Glare position logic for interactive glass refraction
    const glareX = useTransform(x, [-effectiveStrength, effectiveStrength], [-80, 80]);
    const glareY = useTransform(y, [-effectiveStrength, effectiveStrength], [-40, 40]);

    const handlePointerEnter = (e: React.PointerEvent) => {
        if (disabled || isCanvas) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setHoverStartPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setIsHovered(true);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        if (disabled || isCanvas) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setHoverStartPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (disabled || isCanvas || disableMagnet) return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - (rect.left + rect.width / 2));
        mouseY.set(e.clientY - (rect.top + rect.height / 2));
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
        setIsHovered(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.();
        }
    };

    const iconHoverStyle = getIconHoverStyle(iconAnimation, icon);

    const Component = link ? motion.a : motion.button;

    const linkProps = link
        ? {
              href: link,
              target: linkTarget,
              rel: linkTarget === "_blank" ? "noopener noreferrer" : undefined,
          }
        : { disabled };

    // Get color based on hover state
    const activeTextColor = glass ? "#ffffff" : (hover.textColor || "#000000");

    return (
        // Wrapper receives Framer's frame styles and provides padding so the
        // magnetic movement never clips against the component boundary.
        <div
            style={{
                ...style,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: disableMagnet ? 0 : magnetStrength,
            }}
        >
            <Component
                ref={ref as any}
                onPointerEnter={handlePointerEnter}
                onPointerDown={handlePointerDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onHoverStart={() =>
                    !disabled && !isCanvas && setIsHovered(true)
                }
                onHoverEnd={() => setIsHovered(false)}
                onClick={() => !disabled && onClick?.()}
                onKeyDown={handleKeyDown}
                aria-label={ariaLabel || label}
                aria-disabled={disabled}
                tabIndex={disabled ? -1 : 0}
                {...(linkProps as any)}
                initial={false}
                style={{
                    x: disableMagnet ? 0 : x,
                    y: disableMagnet ? 0 : y,
                    rotateX: isCanvas || disableMagnet ? 0 : rotateX,
                    rotateY: isCanvas || disableMagnet ? 0 : rotateY,
                    backgroundColor: slideIconEffect
                        ? (isHovered ? "rgba(0, 0, 0, 0)" : (glass ? "rgba(255, 255, 255, 0)" : backgroundColor))
                        : (glass ? (isHovered ? "rgba(255, 255, 255, 0.015)" : "rgba(255, 255, 255, 0)") : backgroundColor),
                    color: slideIconEffect
                        ? (isHovered ? slideIconColor : textColor)
                        : textColor,
                    borderRadius,
                    padding: slideIconEffect ? "0" : padding,
                    borderWidth: slideIconEffect ? 1.5 : (glass ? 1 : borderWidth),
                    borderColor: slideIconEffect
                        ? (isHovered ? slideIconColor : "rgba(255, 255, 255, 0.04)")
                        : (glass ? (isHovered ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.04)") : borderColor),
                    borderStyle: slideIconEffect ? "solid" : (glass ? "solid" : borderStyle),
                    boxShadow: glass 
                        ? "0 4px 24px 0 rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.04)" 
                        : boxShadow,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.5 : 1,
                    outline: "none",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: slideIconEffect ? "center" : "initial",
                    gap: slideIconEffect ? 0 : (showIcon ? iconGap : 0),
                    width: slideIconEffect ? undefined : "max-content",
                    height: slideIconEffect ? "50px" : undefined,
                    lineHeight: slideIconEffect ? "50px" : undefined,
                    overflow: slideIconEffect ? "visible" : "hidden",
                    position: "relative",
                    backdropFilter: glass ? "blur(16px) saturate(180%)" : undefined,
                    WebkitBackdropFilter: glass ? "blur(16px) saturate(180%)" : undefined,
                    ...font,
                }}
                animate={slideIconEffect ? {
                    width: isHovered ? slideIconActiveWidth : slideIconInactiveWidth,
                    borderColor: isHovered ? slideIconColor : "rgba(255, 255, 255, 0.15)",
                    backgroundColor: isHovered ? "rgba(0, 0, 0, 0)" : (glass ? "rgba(28, 28, 30, 0.9)" : backgroundColor),
                    color: isHovered ? slideIconColor : textColor,
                } : undefined}
                whileHover={
                    disabled || isCanvas
                        ? {}
                        : slideIconEffect
                        ? {}
                        : hoverFill
                        ? { scale: hover.scale }
                        : {
                              scale: hover.scale,
                              backgroundColor: hover.backgroundColor,
                              color: hover.textColor,
                          }
                }
                whileTap={
                    disabled || isCanvas
                        ? {}
                        : slideIconEffect
                        ? { scale: pressed.scale }
                        : hoverFill
                        ? { scale: pressed.scale }
                        : {
                              scale: pressed.scale,
                              backgroundColor: pressed.backgroundColor,
                              color: pressed.textColor,
                          }
                }
                whileFocus={{
                    boxShadow: `0 0 0 3px ${textColor}40`,
                }}
                transition={slideIconEffect ? {
                    duration: 0.35,
                    ease: [0.25, 0.1, 0.25, 1.0],
                } : {
                    type: "spring",
                    stiffness,
                    damping,
                }}
            >
                {hoverFill && !slideIconEffect && (
                    <motion.span
                        style={{
                            position: "absolute",
                            left: hoverStartPos.x,
                            top: hoverStartPos.y,
                            borderRadius: "50%",
                            backgroundColor: glass ? "rgba(255, 255, 255, 0.03)" : hoverFillColor,
                            pointerEvents: "none",
                            width: 650,
                            height: 650,
                            x: "-50%",
                            y: "-50%",
                            zIndex: 0,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: isHovered ? 1 : 0 }}
                        transition={{
                            type: "tween",
                            ease: [0.25, 1, 0.5, 1], // premium expo-out style curve
                            duration: 0.5,
                        }}
                    />
                )}

                {/* Clean glass effect text content */}

                <motion.span 
                    style={{ 
                        pointerEvents: "none", 
                        whiteSpace: "nowrap",
                        zIndex: 1,
                        textTransform: "none",
                        letterSpacing: "normal",
                        fontWeight: "inherit",
                    }}
                    animate={{
                        color: slideIconEffect
                            ? (isHovered ? slideIconColor : textColor)
                            : (isHovered && hoverFill ? activeTextColor : textColor),
                    }}
                    transition={{ duration: 0.25 }}
                >
                    {label}
                </motion.span>

                {showIcon && !slideIconEffect && (
                    <motion.span
                        animate={{
                            color: isHovered && hoverFill ? activeTextColor : textColor,
                            ...(isHovered && !isCanvas
                                ? iconHoverStyle
                                : { x: 0, y: 0, scale: 1, rotate: 0 })
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                        }}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: iconSize,
                            height: iconSize,
                            flexShrink: 0,
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    >
                        {ICONS[icon]}
                    </motion.span>
                )}

                {slideIconEffect && (
                    <motion.span
                        animate={{
                            right: isHovered ? "-60px" : "0px",
                            borderColor: isHovered ? slideIconColor : "rgba(0, 0, 0, 0)",
                            opacity: isHovered ? 1 : 0,
                        }}
                        transition={{
                            duration: 0.35,
                            ease: [0.25, 0.1, 0.25, 1.0],
                        }}
                        style={{
                            width: "48px",
                            height: "48px",
                            borderWidth: 1.5,
                            borderStyle: "solid",
                            borderColor: "rgba(0, 0, 0, 0)",
                            position: "absolute",
                            transform: "rotate(45deg)",
                            right: 0,
                            top: "50%",
                            transformOrigin: "center",
                            marginTop: "-24px",
                            zIndex: -1,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pointerEvents: "none",
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 268.832 268.832"
                            style={{
                                width: "24px",
                                height: "24px",
                                transform: "rotate(-45deg)",
                                fill: slideIconColor,
                            }}
                        >
                            <path d="M265.17 125.577l-80-80c-4.88-4.88-12.796-4.88-17.677 0-4.882 4.882-4.882 12.796 0 17.678l58.66 58.66H12.5c-6.903 0-12.5 5.598-12.5 12.5 0 6.903 5.597 12.5 12.5 12.5h213.654l-58.66 58.662c-4.88 4.882-4.88 12.796 0 17.678 2.44 2.44 5.64 3.66 8.84 3.66s6.398-1.22 8.84-3.66l79.997-80c4.883-4.882 4.883-12.796 0-17.678z" />
                        </svg>
                    </motion.span>
                )}
            </Component>
        </div>
    );
}
