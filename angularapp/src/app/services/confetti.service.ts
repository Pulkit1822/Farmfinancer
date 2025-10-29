import { Injectable } from '@angular/core';
import * as confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {

  constructor() { }

  // Side cannons effect for registration success
  fireSideCannons(): void {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ['#d4af37', '#ffd700', '#f4e4bc', '#ffed4e']; // Gold theme colors

    const frame = () => {
      if (Date.now() > end) return;

      // Left cannon
      this.fireConfetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
        gravity: 1,
        scalar: 1.2,
        drift: 0
      });

      // Right cannon
      this.fireConfetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
        gravity: 1,
        scalar: 1.2,
        drift: 0
      });

      requestAnimationFrame(frame);
    };

    frame();
  }

  // Burst effect for general celebrations
  fireBurst(originX: number = 0.5, originY: number = 0.5): void {
    const colors = ['#d4af37', '#ffd700', '#f4e4bc', '#ffed4e'];
    
    this.fireConfetti({
      particleCount: 100,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: colors,
      startVelocity: 45,
      gravity: 1.2,
      scalar: 1
    });
  }

  // Success celebration with multiple bursts
  celebrateSuccess(): void {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#d4af37', '#ffd700', '#f4e4bc', '#ffed4e']
    };

    const fire = (particleRatio: number, opts: any) => {
      this.fireConfetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    };

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

  // Registration success combination effect
  celebrateRegistration(): void {
    // Start with side cannons
    this.fireSideCannons();
    
    // Add center burst after 500ms
    setTimeout(() => {
      this.celebrateSuccess();
    }, 500);
  }

  // Helper method to safely call confetti
  private fireConfetti(options: any): void {
    if (typeof confetti !== 'undefined') {
      (confetti as any)(options);
    } else {
      console.warn('Confetti library not loaded');
    }
  }
}
