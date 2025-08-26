'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';

interface GooeyFilter {
  id: string;
  strength: number;
}

interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  color?: string;
  gooeyFilter?: GooeyFilter;
  className?: string;
  style?: React.CSSProperties;
}

interface Particle {
  x: number;
  y: number;
  age: number;
  opacity: number;
}

export default function PixelTrail({
  gridSize = 50,
  trailSize = 0.1,
  maxAge = 250,
  interpolate = 5,
  color = "#fff",
  gooeyFilter,
  className = '',
  style = {},
}: PixelTrailProps) {
  const [isClient, setIsClient] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  const addParticle = useCallback((x: number, y: number) => {
    const particle: Particle = {
      x,
      y,
      age: 0,
      opacity: 1,
    };
    particlesRef.current.push(particle);
  }, []);

  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    
    // 更新粒子年龄和透明度
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.age += 1;
      particle.opacity = Math.max(0, 1 - particle.age / maxAge);
      
      // 移除过期的粒子
      if (particle.age >= maxAge) {
        particles.splice(i, 1);
      }
    }
  }, [maxAge]);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 设置全局组合模式
    ctx.globalCompositeOperation = 'source-over';
    
    // 绘制粒子
    const particles = particlesRef.current;
    particles.forEach((particle) => {
      const size = trailSize * gridSize * particle.opacity;
      
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      
      // 添加阴影效果，使粒子在任何背景上都可见
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillStyle = color;
      
      // 绘制圆形粒子
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // 绘制白色边框使其在深色背景上更可见
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      ctx.restore();
    });
  }, [gridSize, trailSize, color]);

  const animate = useCallback(() => {
    updateParticles();
    drawParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    
    // 使用document坐标转换为组件坐标
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 检查鼠标是否在组件范围内
    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      return;
    }
    
    // 调试日志
    console.log('Mouse move detected:', { x, y });
    
    // 使用插值来平滑轨迹
    const prevX = mouseRef.current.x;
    const prevY = mouseRef.current.y;
    
    if (prevX !== 0 || prevY !== 0) {
      const distance = Math.sqrt((x - prevX) ** 2 + (y - prevY) ** 2);
      const steps = Math.max(1, Math.floor(distance / interpolate));
      
      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const interpX = prevX + (x - prevX) * progress;
        const interpY = prevY + (y - prevY) * progress;
        addParticle(interpX, interpY);
      }
    } else {
      addParticle(x, y);
    }
    
    mouseRef.current.x = x;
    mouseRef.current.y = y;
  }, [addParticle, interpolate]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    if (!isClient) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    console.log('PixelTrail component mounted and ready');
    
    // 初始化画布大小
    resizeCanvas();
    
    // 开始动画
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // 在document上添加事件监听器
    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);
    
    console.log('Event listeners added to document');
    
    return () => {
      // 清理
      cancelAnimationFrame(animationFrameRef.current);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      particlesRef.current = [];
      console.log('PixelTrail component unmounted');
    };
  }, [isClient, animate, handleMouseMove, resizeCanvas]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'none',
        ...style,
      }}
    >
      {isClient && (
        <>
          {/* SVG 滤镜定义 */}
          {gooeyFilter && (
            <svg
              style={{
                position: 'absolute',
                width: 0,
                height: 0,
                pointerEvents: 'none',
              }}
            >
              <defs>
                <filter id={gooeyFilter.id}>
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation={gooeyFilter.strength}
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="goo"
                  />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
              </defs>
            </svg>
          )}
          
          {/* 画布 */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{
              filter: gooeyFilter ? `url(#${gooeyFilter.id})` : 'none',
            }}
          />
        </>
      )}
    </div>
  );
}