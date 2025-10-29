import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themeModeSubject = new BehaviorSubject<ThemeMode>('system');
  private effectiveThemeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  
  public themeMode$ = this.themeModeSubject.asObservable();
  public effectiveTheme$ = this.effectiveThemeSubject.asObservable();
  public isDark$ = this.effectiveThemeSubject.asObservable();

  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.initializeTheme();
    this.setupSystemThemeListener();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const validThemes: ThemeMode[] = ['light', 'dark', 'system'];
    const themeMode = savedTheme && validThemes.includes(savedTheme) ? savedTheme : 'system';
    
    this.setTheme(themeMode, false);
  }

  private setupSystemThemeListener(): void {
    this.mediaQuery.addEventListener('change', (e) => {
      if (this.themeModeSubject.value === 'system') {
        this.updateEffectiveTheme();
      }
    });
  }

  private updateEffectiveTheme(): void {
    const currentMode = this.themeModeSubject.value;
    let effectiveTheme: 'light' | 'dark';

    if (currentMode === 'system') {
      effectiveTheme = this.mediaQuery.matches ? 'dark' : 'light';
    } else {
      effectiveTheme = currentMode;
    }

    this.effectiveThemeSubject.next(effectiveTheme);
    this.applyThemeToDOM(effectiveTheme);
  }

  private applyThemeToDOM(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const currentMode = this.themeModeSubject.value;
    let nextMode: ThemeMode;

    // Cycle through: system -> light -> dark -> system
    switch (currentMode) {
      case 'system':
        nextMode = 'light';
        break;
      case 'light':
        nextMode = 'dark';
        break;
      case 'dark':
        nextMode = 'system';
        break;
      default:
        nextMode = 'system';
    }

    this.setTheme(nextMode, true);
  }

  setTheme(mode: ThemeMode, animate: boolean = true): void {
    this.themeModeSubject.next(mode);
    localStorage.setItem('theme', mode);
    
    this.updateEffectiveTheme();
    
    if (animate) {
      this.animateThemeTransition();
    }
  }

  private animateThemeTransition(): void {
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  get themeMode(): ThemeMode {
    return this.themeModeSubject.value;
  }

  get effectiveTheme(): 'light' | 'dark' {
    return this.effectiveThemeSubject.value;
  }

  get isDark(): boolean {
    return this.effectiveThemeSubject.value === 'dark';
  }

  get isSystemTheme(): boolean {
    return this.themeModeSubject.value === 'system';
  }
}
