import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

export interface MagicEffectsConfig {
  enableParticles?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  enableClickEffect?: boolean;
  particleCount?: number;
  spotlightRadius?: number;
  glowColor?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MagicEffectsService {
  private particles: HTMLElement[] = [];
  private timeouts: number[] = []; // Changed from NodeJS.Timeout[] to number[]
  private spotlightElement: HTMLElement | null = null;
  private isInsideContainer = false;

  createParticle(x: number, y: number, color: string): HTMLElement {
    const particle = document.createElement('div');
    particle.className = 'magic-particle';
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 8px ${color}, 0 0 12px ${color}40;
      pointer-events: none;
      z-index: 100;
      left: ${x}px;
      top: ${y}px;
      opacity: 0;
    `;
    return particle;
  }

  animateParticles(container: HTMLElement, config: MagicEffectsConfig): void {
    if (!config.enableParticles) return;

    const rect = container.getBoundingClientRect();
    const particleCount = config.particleCount || 8;
    const glowColor = config.glowColor || 'var(--accent-primary)';

    for (let i = 0; i < particleCount; i++) {
      const timeout = window.setTimeout(() => { // Use window.setTimeout to get number type
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const particle = this.createParticle(x, y, glowColor);
        
        container.appendChild(particle);
        this.particles.push(particle);

        // Animate particle appearance
        gsap.fromTo(particle, 
          { scale: 0, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
        );

        // Animate particle movement
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        // Animate particle opacity
        gsap.to(particle, {
          opacity: 0.4,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, i * 150);

      this.timeouts.push(timeout);
    }
  }

  clearParticles(): void {
    this.timeouts.forEach(timeout => window.clearTimeout(timeout)); // Use window.clearTimeout
    this.timeouts = [];

    this.particles.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }
      });
    });
    this.particles = [];
  }

  applyTilt(element: HTMLElement, mouseX: number, mouseY: number): void {
    const rect = element.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    gsap.to(element, {
      rotateX,
      rotateY,
      duration: 0.2,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  }

  resetTilt(element: HTMLElement): void {
    gsap.to(element, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  applyMagnetism(element: HTMLElement, mouseX: number, mouseY: number): void {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const magnetX = (mouseX - centerX) * 0.03;
    const magnetY = (mouseY - centerY) * 0.03;

    gsap.to(element, {
      x: magnetX,
      y: magnetY,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  resetMagnetism(element: HTMLElement): void {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  }

  createClickRipple(element: HTMLElement, mouseX: number, mouseY: number, color: string): void {
    const rect = element.getBoundingClientRect();
    const x = mouseX - rect.left;
    const y = mouseY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${maxDistance * 2}px;
      height: ${maxDistance * 2}px;
      border-radius: 50%;
      background: radial-gradient(circle, ${color}40 0%, ${color}20 30%, transparent 70%);
      left: ${x - maxDistance}px;
      top: ${y - maxDistance}px;
      pointer-events: none;
      z-index: 1000;
    `;

    element.appendChild(ripple);

    gsap.fromTo(ripple,
      { scale: 0, opacity: 1 },
      {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      }
    );
  }

  initializeSpotlight(container: HTMLElement, config: MagicEffectsConfig): void {
    if (!config.enableSpotlight) return;

    if (this.spotlightElement) {
      this.spotlightElement.remove();
    }

    const spotlight = document.createElement('div');
    spotlight.className = 'magic-spotlight';
    const glowColor = config.glowColor || 'var(--accent-primary)';
    
    spotlight.style.cssText = `
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        ${glowColor}15 0%,
        ${glowColor}08 15%,
        ${glowColor}04 25%,
        ${glowColor}02 40%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: overlay;
    `;
    
    document.body.appendChild(spotlight);
    this.spotlightElement = spotlight;
  }

  updateSpotlight(mouseX: number, mouseY: number, opacity: number = 0.6): void {
    if (!this.spotlightElement) return;

    gsap.to(this.spotlightElement, {
      left: mouseX,
      top: mouseY,
      opacity: opacity,
      duration: 0.1,
      ease: 'power2.out'
    });
  }

  hideSpotlight(): void {
    if (!this.spotlightElement) return;

    gsap.to(this.spotlightElement, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  cleanup(): void {
    this.clearParticles();
    if (this.spotlightElement) {
      this.spotlightElement.remove();
      this.spotlightElement = null;
    }
  }
}
