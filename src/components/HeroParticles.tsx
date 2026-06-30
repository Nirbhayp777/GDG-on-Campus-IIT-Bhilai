import React, { useRef, useEffect, useState, useMemo } from 'react';

interface HeroParticlesProps {
  starColor?: string;
  variant?: 'desktop' | 'phone';
}

interface GridParticle {
  id: number;
  col: number;
  row: number;
  colRatio: number;
  rowRatio: number;
  randomX: number;       // For organic jittered layout (non-uniform)
  randomY: number;       // For organic jittered layout (non-uniform)
  randomSpeed: number;   // Variance in individual waving speeds
  sizeMultiplier: number;// Organic particle size variation
  
  // Pre-calculated static terms for performance optimization
  tx: number;
  ty: number;
  txPow: number;
  z3d: number;
  dz_center: number;
  edgeHeightScale: number;
  rightFade: number;
  
  // Static trigonometric factors
  txFactor1: number;
  tyFactor1: number;
  txFactor2: number;
  tyFactor2: number;
  txFactor3: number;
  tyFactor3: number;
  txFactor4: number;
  tyFactor4: number;
  txFactor5: number;
  tyFactor5: number;
  txFactor6: number;
  tyFactor6: number;
  
  txWave1: number;
  tyWave2: number;
  txyWave3: number;
  txWave4: number;
  tyWave5: number;
  txyWave6: number;
  txWave7: number;
  txyWave8: number;
  txWave9: number;
  txyWave10: number;

  spreadFactorX: number;
  offsetFactorX: number;
  spreadFactorY: number;
  offsetFactorY: number;
}

export default function HeroParticles(props: HeroParticlesProps) {
  const {
    // Beautiful glowing Google Blue matching the modern design aesthetic
    starColor = 'rgb(66, 133, 244)',
    variant = 'desktop',
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Intersection Observer to pause particle simulation when out of view
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);
  
  // Track mouse coordinates for elegant interactive hover effects
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const easedMouseRef = useRef({ x: -1000, y: -1000 });
  const globalParallaxRef = useRef({ x: 0, y: 0 });

  // Generate grid structure
  // Optimized columns and rows to create a beautiful, dense full-screen wave mesh with highly performant footprint
  const gridParticles = useMemo(() => {
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    const particles: GridParticle[] = [];
    let id = 0;

    const minZ = 12.0;
    const maxZ = 1900;
    const centerTx = 0.5;
    const centerTxPow = Math.pow(centerTx, 1.45);
    const gridCenterZ = minZ + centerTxPow * (maxZ - minZ);

    if (isSmallScreen) {
      const originalCols = 24;
      const totalCols = 32;
      const rows = 14;

      for (let c = 0; c < totalCols; c++) {
        const colRatio = c / (originalCols - 1);

        for (let r = 0; r < rows; r++) {
          const rowRatio = r / (rows - 1);
          const randomX = (Math.random() - 0.5) * 0.72;
          const randomY = (Math.random() - 0.5) * 0.72;

          const tx = colRatio + randomX * (1.0 / originalCols);
          const ty = rowRatio + randomY * (1.0 / rows);

          // Pre-evaluate rightFade; if a particle is fully faded out on the right, filter it out completely
          const rightFade = tx < 0.82 ? 1.0 : Math.max(0.0, 1.0 - Math.pow((tx - 0.82) / 0.46, 1.6));
          if (rightFade <= 0.001) {
            continue;
          }

          const txPow = Math.pow(tx, 1.45);
          const z3d = minZ + txPow * (maxZ - minZ);
          const dz_center = z3d - gridCenterZ;
          const edgeHeightScale = 1.45 - tx * 0.95;

          particles.push({
            id: id++,
            col: c,
            row: r,
            colRatio,
            rowRatio,
            randomX,
            randomY,
            randomSpeed: Math.random() * 1.8 + 0.6,
            sizeMultiplier: Math.random() * 0.5 + 0.75,
            tx,
            ty,
            txPow,
            z3d,
            dz_center,
            edgeHeightScale,
            rightFade,
            
            txFactor1: tx * Math.PI * 1.85,
            tyFactor1: ty * Math.PI * 1.6,
            txFactor2: tx * Math.PI * 3.2,
            tyFactor2: ty * Math.PI * 2.8,
            txFactor3: tx * Math.PI * 4.5,
            tyFactor3: ty * Math.PI * 3.8,
            txFactor4: tx * Math.PI * 5.8,
            tyFactor4: ty * Math.PI * 5.1,
            txFactor5: 0,
            tyFactor5: 0,
            txFactor6: 0,
            tyFactor6: 0,
            
            txWave1: tx * Math.PI * 1.1,
            tyWave2: ty * Math.PI * 1.6,
            txyWave3: (tx * 2.1 + ty * 1.3) * Math.PI,
            txWave4: 0,
            tyWave5: 0,
            txyWave6: 0,
            txWave7: 0,
            txyWave8: 0,
            txWave9: 0,
            txyWave10: 0,

            spreadFactorX: 1.54 - tx * 0.55,
            offsetFactorX: (1.0 - tx) * 0.48,
            spreadFactorY: 1.68 - tx * 0.65,
            offsetFactorY: (1.0 - tx) * 0.35,
          });
        }
      }
    } else {
      // Desktop: Keep number of particles constant to exactly 2000
      // Spacing is non-linearly mapped so density decreases towards the right side (larger tx)
      const rows = 20;
      const cols = 100; // 20 * 100 = 2000 particles

      for (let c = 0; c < cols; c++) {
        const colRatio = c / (cols - 1);

        for (let r = 0; r < rows; r++) {
          const rowRatio = r / (rows - 1);
          const randomX = (Math.random() - 0.5) * 0.72;
          const randomY = (Math.random() - 0.5) * 0.72;

          const baseTx = colRatio + randomX * (1.0 / cols);
          // Apply power curve to gradually decrease density on the right side (pulling more from right to left)
          const tx = Math.max(0.0, Math.min(1.0, Math.pow(Math.max(0, baseTx), 2.25)));
          const ty = rowRatio + randomY * (1.0 / rows);

          // Gently calculate right fade but don't drop particles, keeping the count perfectly at 2000
          const rightFade = tx < 0.82 ? 1.0 : Math.max(0.0, 1.0 - Math.pow((tx - 0.82) / 0.46, 1.6));

          const txPow = Math.pow(tx, 1.45);
          const z3d = minZ + txPow * (maxZ - minZ);
          const dz_center = z3d - gridCenterZ;
          const edgeHeightScale = 1.45 - tx * 0.95;

          particles.push({
            id: id++,
            col: c,
            row: r,
            colRatio,
            rowRatio,
            randomX,
            randomY,
            randomSpeed: Math.random() * 1.8 + 0.6,
            sizeMultiplier: Math.random() * 0.5 + 0.75,
            tx,
            ty,
            txPow,
            z3d,
            dz_center,
            edgeHeightScale,
            rightFade,
            
            txFactor1: tx * Math.PI * 1.85,
            tyFactor1: ty * Math.PI * 1.6,
            txFactor2: tx * Math.PI * 3.2,
            tyFactor2: ty * Math.PI * 2.8,
            txFactor3: tx * Math.PI * 4.5,
            tyFactor3: ty * Math.PI * 3.8,
            txFactor4: tx * Math.PI * 5.8,
            tyFactor4: ty * Math.PI * 5.1,
            txFactor5: 0,
            tyFactor5: 0,
            txFactor6: 0,
            tyFactor6: 0,
            
            txWave1: tx * Math.PI * 1.1,
            tyWave2: ty * Math.PI * 1.6,
            txyWave3: (tx * 2.1 + ty * 1.3) * Math.PI,
            txWave4: 0,
            tyWave5: 0,
            txyWave6: 0,
            txWave7: 0,
            txyWave8: 0,
            txWave9: 0,
            txyWave10: 0,

            spreadFactorX: 1.54 - tx * 0.55,
            offsetFactorX: (1.0 - tx) * 0.48,
            spreadFactorY: 1.68 - tx * 0.65,
            offsetFactorY: (1.0 - tx) * 0.35,
          });
        }
      }
    }

    // Sort descending by depth: farthest drawing points first (Painter's Algorithm)
    return particles.sort((a, b) => {
      if (Math.abs(b.colRatio - a.colRatio) > 0.0001) {
        return b.colRatio - a.colRatio;
      }
      return b.rowRatio - a.rowRatio;
    });
  }, []);

  // Synchronize Canvas with full viewport dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const logicalWidth = rect.width;
      const logicalHeight = rect.height;

      // Constrain devicePixelRatio scaling to prevent GPU fill-rate overload on high-DPI (Retina/3x) screens while staying sharp
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = logicalWidth * dpr;
      canvas.height = logicalHeight * dpr;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Clear any existing transform matrices
        ctx.scale(dpr, dpr);
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Track hover and mouse motion globally relative to the container to bypass center overlay blocking
  useEffect(() => {
    const container = containerRef.current;
    if (!container || variant === 'phone') return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if mouse is within container boundaries
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseRef.current = { x, y };
      } else {
        mouseRef.current = { x: -1000, y: -1000 };
      }
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [variant]);

  // Canvas render animation loop
  useEffect(() => {
    if (!isVisible) return;

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const width = canvas.clientWidth || (canvas.width / dpr);
      const height = canvas.clientHeight || (canvas.height / dpr);

      ctx.clearRect(0, 0, width, height);

      // Super slow, elegant, calming speed progression
      const time = Date.now() * 0.00038;
      const mouse = mouseRef.current;
      const easedMouse = easedMouseRef.current;
      const isMobile = width < 768;

      // Handle gentle, smooth interpolation of the tracked mouse position
      if (mouse.x === -1000) {
        if (easedMouse.x !== -1000) {
          const dx = -1000 - easedMouse.x;
          const dy = -1000 - easedMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 1) {
            easedMouse.x = -1000;
            easedMouse.y = -1000;
          } else {
            easedMouse.x += dx * 0.025;
            easedMouse.y += dy * 0.025;
          }
        }
      } else {
        if (easedMouse.x === -1000) {
          easedMouse.x = mouse.x;
          easedMouse.y = mouse.y;
        } else {
          easedMouse.x += (mouse.x - easedMouse.x) * 0.025;
          easedMouse.y += (mouse.y - easedMouse.y) * 0.025;
        }
      }

      // Calculate target global offset relative to the screen center (for axis pivoting & rotation)
      const targetParallaxX = (mouse.x !== -1000 && !isMobile) ? (mouse.x - width / 2) : 0;
      const targetParallaxY = (mouse.y !== -1000 && !isMobile) ? (mouse.y - height / 2) : 0;

      // Smoothly interpolate current global parallax shift
      const globalParallax = globalParallaxRef.current;
      globalParallax.x += (targetParallaxX - globalParallax.x) * 0.008;
      globalParallax.y += (targetParallaxY - globalParallax.y) * 0.008;

      // Invariant rotation terms computed ONCE per frame outside the loop
      const rotTheta = (globalParallax.x / (width || 1)) * 0.22; // Pure vertical axis yaw rotation
      const cosT = Math.cos(rotTheta);
      const sinT = Math.sin(rotTheta);

      const minZ = 12.0;
      const maxZ = 1900;
      const centerTx = 0.5;
      const centerTxPow = Math.pow(centerTx, 1.45);
      const gridCenterZ = minZ + centerTxPow * (maxZ - minZ); // Center depth coordinate
      
      const gridCenterXOffset = -1.2 * width;
      const gridCenterXSpread = 1.62 * width;
      const centerProgressiveXOffset = gridCenterXOffset; // ty = 0.5 center means (ty - 0.5) * spread = 0
      const gridCenterX = centerProgressiveXOffset;

      const focalLength = 320;
      const wavePeriod = time * 0.64;
      const hoverRadius = isMobile ? 45 : 90;

      // Vanishing Point (VP) configuration (upper-right vanishing point for dynamic diagonal perspective)
      const vpX = isMobile ? width * 1.08 : width * 1.02;
      const vpY = isMobile ? height * 0.42 : height * 0.46;

      // Plane dimensions in 3D world-space coords
      const xOffset = -1.2 * width;
      const xSpread = 1.62 * width;
      const yOffset = -0.05 * height;
      const ySpread = 1.02 * height;

      gridParticles.forEach((p) => {
        // Skip drawing if opacity is extremely low or right fading is almost complete
        if (p.rightFade < 0.05) return;

        // Highly detailed dynamic 3D wave simulation with extra aggressive bumps and ripple layers
        const bump1 = Math.sin(p.txFactor1 - wavePeriod * 0.6) * Math.sin(p.tyFactor1 + wavePeriod * 0.4) * 180.0;
        const bump2 = Math.cos(p.txFactor2 + wavePeriod * 0.9) * Math.sin(p.tyFactor2 - wavePeriod * 0.5) * 120.0;
        const bump3 = Math.sin(p.txFactor3 - wavePeriod * 1.3) * Math.cos(p.tyFactor3 + wavePeriod * 0.95) * 65.0;
        const bump4 = Math.cos(p.txFactor4 + wavePeriod * 1.8) * Math.sin(p.tyFactor4 - wavePeriod * 1.4) * 40.0;

        const wave1 = Math.sin(p.txWave1 - wavePeriod) * 100; // Large slow longitudinal swell
        const wave2 = Math.cos(p.tyWave2 + wavePeriod * 0.85) * 45; // Transverse wave height
        const wave3 = Math.sin(p.txyWave3 - wavePeriod * 0.7) * 30; // Medium interference

        const waveOffset = (wave1 + wave2 + wave3 + bump1 + bump2 + bump3 + bump4) * p.edgeHeightScale;

        // Pulling the wave towards the bottom-left corner in the foreground (high scale / low tx)
        const progressiveXSpread = xSpread * p.spreadFactorX;
        const progressiveXOffset = xOffset - p.offsetFactorX * width;
        const X_world = progressiveXOffset + (p.ty - 0.5) * progressiveXSpread;

        // Simulating progressive vertical depth spread in foreground
        const progressiveYSpread = ySpread * p.spreadFactorY;
        const progressiveYOffset = yOffset + p.offsetFactorY * height;
        const Y_world = progressiveYOffset + (p.ty - 0.5) * progressiveYSpread + waveOffset;

        // 4. Elegant Pivot Rotation Around a Vertical Axis (Yaw 3D Rotation)
        const dx_center = X_world - gridCenterX;

        // Perform 3D rotation relative to the center, then shift back
        const rotX_world = gridCenterX + (dx_center * cosT + p.dz_center * sinT);
        const rotZ_3d = gridCenterZ + (-dx_center * sinT + p.dz_center * cosT);

        // Compute rotated perspective projection scale
        const rotatedScale = focalLength / (focalLength + Math.max(10, rotZ_3d));

        // Projected 2D screen coordinates - converging perfectly toward the vanishing point using rotated coordinates
        const baseProjRefX = vpX + rotX_world * rotatedScale;
        const baseProjRefY = vpY + Y_world * rotatedScale;

        // Skip drawing early if outside rendering bounds to save cycles before doing further math or cursor interaction
        if (baseProjRefX < -50 || baseProjRefX > width + 50 || baseProjRefY < -50 || baseProjRefY > height + 50) {
          return;
        }

        // 4.5. Proximity size and opacity boosts based on the current rotated depth
        const proximitySizeBoost = Math.max(0.24, Math.pow(rotatedScale, 1.15));
        const proximityOpacityBoost = Math.max(0.48, 1.25 - p.tx * 0.72);

        let finalRenderX = baseProjRefX;
        let finalRenderY = baseProjRefY;
        let opacityBoost = 1.0;
        let sizeBoost = 1.0;

        // 5. Interactive Cursor Attractor/Glow mechanics
        const dx = baseProjRefX - easedMouse.x;
        const dy = baseProjRefY - easedMouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < hoverRadius && !isMobile) {
          const force = 1.0 - distance / hoverRadius;
          const easedForce = force * force * (3.0 - 2.0 * force); // smoothstep curve

          // Gently pull particles toward the cursor
          const pullDistance = easedForce * 12;
          const angle = Math.atan2(dy, dx) || 0;
          finalRenderX -= Math.cos(angle) * pullDistance;
          finalRenderY -= Math.sin(angle) * pullDistance;

          // Interactive surface ripple deflection
          const mouseWave = Math.sin(time * 5.2 + p.randomSpeed * 8) * 4 * easedForce;
          finalRenderY += mouseWave * rotatedScale;

          opacityBoost += easedForce * 2.2;
          sizeBoost += easedForce * 0.95;
        }

        const size = Math.max(0.08, 4.2 * proximitySizeBoost * sizeBoost * p.sizeMultiplier * p.rightFade);
        const opacity = Math.max(0.01, proximityOpacityBoost * Math.pow(rotatedScale, 0.45) * opacityBoost * 0.88 * p.rightFade);

        // Skip drawing if invisible
        if (opacity < 0.05 || size < 0.1) {
          return;
        }

        // 6. Output to graphics context with Google Blue color and premium glowing center cores
        ctx.beginPath();
        ctx.arc(finalRenderX, finalRenderY, size, 0, Math.PI * 2);
        // Extremely crisp Google Blue body with perfectly calibrated opacity for razor-sharp borders
        ctx.fillStyle = `rgba(66, 133, 244, ${Math.min(1.0, opacity * 1.85)})`;
        ctx.fill();

        // Intense glowing white-hot core inside the particle for premium sparkling contrast and definition
        if (rotatedScale > 0.25 && opacity > 0.22) {
          ctx.beginPath();
          ctx.arc(finalRenderX, finalRenderY, size * 0.48, 0, Math.PI * 2);
          // Pure white-hot core with a hint of gold-blue radiance (fully opaque ratio) to look incredibly crisp
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, opacity * 2.0)})`;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gridParticles, isVisible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-transparent"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block bg-transparent"
        style={{ pointerEvents: 'auto' }}
      />
      {/* Dynamic bottom shadows */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-transparent to-transparent pointer-events-none z-10" />
    </div>
  );
}
