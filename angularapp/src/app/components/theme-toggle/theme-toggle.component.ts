import { Component, ElementRef, ViewChild } from '@angular/core';
import { ThemeService, ThemeMode } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css']
})
export class ThemeToggleComponent {
  @ViewChild('toggleButton', { static: true }) toggleButton!: ElementRef;

  public themeMode$: Observable<ThemeMode>;
  public effectiveTheme$: Observable<'light' | 'dark'>;

  constructor(public themeService: ThemeService) {
    this.themeMode$ = this.themeService.themeMode$;
    this.effectiveTheme$ = this.themeService.effectiveTheme$;
  }

  async toggleTheme(): Promise<void> {
    if (!this.toggleButton?.nativeElement) return;

    // Get button position for animation
    const button = this.toggleButton.nativeElement;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Create circular reveal animation
    this.createRevealAnimation(x, y);
    
    // Toggle theme
    this.themeService.toggleTheme();
  }

  private createRevealAnimation(x: number, y: number): void {
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Create overlay for smooth transition
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = this.themeService.isDark ? '#ffffff' : '#1a1a1a';
    overlay.style.clipPath = `circle(0px at ${x}px ${y}px)`;
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'clip-path 0.4s ease-in-out';

    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.style.clipPath = `circle(${maxRadius}px at ${x}px ${y}px)`;
    });

    // Clean up
    setTimeout(() => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }, 400);
  }

  getAriaLabel(themeMode: ThemeMode): string {
    switch (themeMode) {
      case 'system':
        return 'Switch to light mode';
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to system theme';
      default:
        return 'Toggle theme';
    }
  }
}
