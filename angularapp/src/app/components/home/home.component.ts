import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MagicEffectsService, MagicEffectsConfig } from 'src/app/services/magic-effects.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('featuresSection') featuresSection!: ElementRef;
  
  hoveredCard: number | null = null;
  private magicConfig: MagicEffectsConfig = {
    enableParticles: true,
    enableSpotlight: true,
    enableBorderGlow: true,
    enableTilt: false,
    enableMagnetism: false,
    enableClickEffect: true,
    particleCount: 6,
    spotlightRadius: 300,
    glowColor: 'var(--accent-primary)'
  };

  constructor(
    private router: Router,
    private magicEffects: MagicEffectsService,
    public themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Component initialization
  }

  ngAfterViewInit(): void {
    // Initialize spotlight after view is ready
    if (this.featuresSection) {
      this.magicEffects.initializeSpotlight(this.featuresSection.nativeElement, this.magicConfig);
    }
  }

  ngOnDestroy(): void {
    this.magicEffects.cleanup();
  }

  scrollToFeatures(): void {
    if (this.featuresSection) {
      this.featuresSection.nativeElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onCardHover(cardIndex: number): void {
    this.hoveredCard = cardIndex;
  }

  onCardLeave(cardIndex: number): void {
    this.hoveredCard = null;
  }

  onLearnMore(): void {
    this.router.navigate(['/registration']);
  }

  onCardMouseEnter(event: MouseEvent, cardElement: HTMLElement): void {
    this.magicEffects.animateParticles(cardElement, this.magicConfig);
    this.magicEffects.updateSpotlight(event.clientX, event.clientY, 0.8);
  }

  onCardMouseLeave(event: MouseEvent, cardElement: HTMLElement): void {
    this.magicEffects.clearParticles();
    this.magicEffects.resetTilt(cardElement);
    this.magicEffects.resetMagnetism(cardElement);
    this.magicEffects.hideSpotlight();
  }

  onCardMouseMove(event: MouseEvent, cardElement: HTMLElement): void {
    if (this.magicConfig.enableTilt) {
      this.magicEffects.applyTilt(cardElement, event.clientX, event.clientY);
    }
    
    if (this.magicConfig.enableMagnetism) {
      this.magicEffects.applyMagnetism(cardElement, event.clientX, event.clientY);
    }

    this.magicEffects.updateSpotlight(event.clientX, event.clientY, 0.6);
  }

  onCardClick(event: MouseEvent, cardElement: HTMLElement): void {
    if (this.magicConfig.enableClickEffect) {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
      this.magicEffects.createClickRipple(cardElement, event.clientX, event.clientY, color);
    }
  }

  onFeaturesMouseLeave(): void {
    this.magicEffects.hideSpotlight();
  }
}
