import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

interface Letter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

@Component({
  selector: 'app-letter-glitch',
  templateUrl: './letter-glitch.component.html',
  styleUrls: ['./letter-glitch.component.css']
})
export class LetterGlitchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() glitchColors: string[] = ['#dc3545', '#ff6b6b', '#ff8787'];
  @Input() glitchSpeed: number = 50;
  @Input() centerVignette: boolean = true;
  @Input() outerVignette: boolean = false;
  @Input() smooth: boolean = true;
  @Input() characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';

  private animationId: number | null = null;
  private letters: Letter[] = [];
  private grid = { columns: 0, rows: 0 };
  private context: CanvasRenderingContext2D | null = null;
  private lastGlitchTime = Date.now();
  private resizeTimeout: any;

  private readonly fontSize = 16;
  private readonly charWidth = 10;
  private readonly charHeight = 20;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCanvas();
    this.resizeCanvas();
    this.animate();
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private initializeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext('2d');
  }

  private setupResizeListener(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    
    this.resizeTimeout = setTimeout(() => {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      this.resizeCanvas();
      this.animate();
    }, 100);
  }

  private getRandomChar(): string {
    const chars = Array.from(this.characters);
    return chars[Math.floor(Math.random() * chars.length)];
  }

  private getRandomColor(): string {
    return this.glitchColors[Math.floor(Math.random() * this.glitchColors.length)];
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  private interpolateColor(
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ): string {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  }

  private calculateGrid(width: number, height: number): { columns: number; rows: number } {
    const columns = Math.ceil(width / this.charWidth);
    const rows = Math.ceil(height / this.charHeight);
    return { columns, rows };
  }

  private initializeLetters(columns: number, rows: number): void {
    this.grid = { columns, rows };
    const totalLetters = columns * rows;
    this.letters = Array.from({ length: totalLetters }, () => ({
      char: this.getRandomChar(),
      color: this.getRandomColor(),
      targetColor: this.getRandomColor(),
      colorProgress: 1
    }));
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (this.context) {
      this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = this.calculateGrid(rect.width, rect.height);
    this.initializeLetters(columns, rows);
    this.drawLetters();
  }

  private drawLetters(): void {
    if (!this.context || this.letters.length === 0) return;
    
    const canvas = this.canvasRef.nativeElement;
    const { width, height } = canvas.getBoundingClientRect();
    
    this.context.clearRect(0, 0, width, height);
    this.context.font = `${this.fontSize}px monospace`;
    this.context.textBaseline = 'top';

    this.letters.forEach((letter, index) => {
      const x = (index % this.grid.columns) * this.charWidth;
      const y = Math.floor(index / this.grid.columns) * this.charHeight;
      this.context!.fillStyle = letter.color;
      this.context!.fillText(letter.char, x, y);
    });
  }

  private updateLetters(): void {
    if (!this.letters || this.letters.length === 0) return;

    const updateCount = Math.max(1, Math.floor(this.letters.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * this.letters.length);
      if (!this.letters[index]) continue;

      this.letters[index].char = this.getRandomChar();
      this.letters[index].targetColor = this.getRandomColor();

      if (!this.smooth) {
        this.letters[index].color = this.letters[index].targetColor;
        this.letters[index].colorProgress = 1;
      } else {
        this.letters[index].colorProgress = 0;
      }
    }
  }

  private handleSmoothTransitions(): void {
    let needsRedraw = false;
    
    this.letters.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = this.hexToRgb(letter.color);
        const endRgb = this.hexToRgb(letter.targetColor);
        
        if (startRgb && endRgb) {
          letter.color = this.interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      this.drawLetters();
    }
  }

  private animate(): void {
    const now = Date.now();
    
    if (now - this.lastGlitchTime >= this.glitchSpeed) {
      this.updateLetters();
      this.drawLetters();
      this.lastGlitchTime = now;
    }

    if (this.smooth) {
      this.handleSmoothTransitions();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }
}
