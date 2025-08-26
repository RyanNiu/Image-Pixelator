'use client';

import React, { ReactNode } from 'react';
import FaultyTerminal from './FaultyTerminal';

interface TerminalBackgroundProps {
  children: ReactNode;
  className?: string;
  height?: string;
  opacity?: number;
  // FaultyTerminal组件的属性
  scale?: number;
  gridMul?: [number, number];
  digitSize?: number;
  timeScale?: number;
  pause?: boolean;
  scanlineIntensity?: number;
  glitchAmount?: number;
  flickerAmount?: number;
  noiseAmp?: number;
  chromaticAberration?: number;
  dither?: number | boolean;
  curvature?: number;
  tint?: string;
  mouseReact?: boolean;
  mouseStrength?: number;
  pageLoadAnimation?: boolean;
  brightness?: number;
}

export default function TerminalBackground({
  children,
  className = '',
  height = '600px',
  opacity = 0.4,
  scale = 1.5,
  gridMul = [2, 1],
  digitSize = 1.2,
  timeScale = 1,
  pause = false,
  scanlineIntensity = 1,
  glitchAmount = 1,
  flickerAmount = 1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0,
  tint = "#ffffff",
  mouseReact = true,
  mouseStrength = 0.5,
  pageLoadAnimation = false,
  brightness = 1,
}: TerminalBackgroundProps) {
  return (
    <div className={`relative ${className}`} style={{ width: '100%', height }}>
      {/* 背景 WebGL 终端效果 */}
      <div className="absolute inset-0">
        <FaultyTerminal
          scale={scale}
          gridMul={gridMul}
          digitSize={digitSize}
          timeScale={timeScale}
          pause={pause}
          scanlineIntensity={scanlineIntensity}
          glitchAmount={glitchAmount}
          flickerAmount={flickerAmount}
          noiseAmp={noiseAmp}
          chromaticAberration={chromaticAberration}
          dither={dither}
          curvature={curvature}
          tint={tint}
          mouseReact={mouseReact}
          mouseStrength={mouseStrength}
          pageLoadAnimation={pageLoadAnimation}
          brightness={brightness}
        />
      </div>
      
      {/* 内容层 */}
      <div className="relative z-10 h-full">
        {/* 半透明遮罩，确保文本可读性 */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity }}
        ></div>
        
        {/* 实际内容 */}
        <div className="relative z-20 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}