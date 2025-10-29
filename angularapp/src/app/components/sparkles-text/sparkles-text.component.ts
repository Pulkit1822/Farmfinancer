import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Sparkle {
  id: string;
  x: string;
  y: string;
  color: string;
  delay: number;
  scale: number;
  lifespan: number;
  opacity: number;
  rotation: number;
}

@Component({
  selector: 'app-sparkles-text',
  templateUrl: './sparkles-text.component.html',
  styleUrls: ['./sparkles-text.component.css']
})
export class SparklesTextComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sparklesContainer', { static: true }) sparklesContainer!: ElementRef;
  
  @Input() sparklesCount: number = 15;
  @Input() colors = { first: '#d4af37', second: '#ffd700' }; // Gold theme colors
  @Input() className: string = '';

  sparkles: Sparkle[] = [];
  private intervalId: any;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeStars();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private generateStar(): Sparkle {
    const starX = `${Math.random() * 100}%`;
    const starY = `${Math.random() * 100}%`;
    const color = Math.random() > 0.5 ? this.colors.first : this.colors.second;
    const delay = Math.random() * 2;
    const scale = Math.random() * 0.7 + 0.3;
    const lifespan = Math.random() * 10 + 5;
    const id = `${starX}-${starY}-${Date.now()}-${Math.random()}`;
    
    return { 
      id, 
      x: starX, 
      y: starY, 
      color, 
      delay, 
      scale, 
      lifespan,
      opacity: 0,
      rotation: 0
    };
  }

  private initializeStars(): void {
    this.sparkles = Array.from({ length: this.sparklesCount }, () => this.generateStar());
    this.renderSparkles();
  }

  private startAnimation(): void {
    this.intervalId = setInterval(() => {
      this.sparkles = this.sparkles.map(star => {
        if (star.lifespan <= 0) {
          return this.generateStar();
        } else {
          return { 
            ...star, 
            lifespan: star.lifespan - 0.1,
            opacity: Math.sin((star.lifespan / 5) * Math.PI) * 0.8,
            rotation: star.rotation + 2
          };
        }
      });
      this.renderSparkles();
    }, 100);
  }

  private renderSparkles(): void {
    if (!this.sparklesContainer) return;

    const container = this.sparklesContainer.nativeElement;
    container.innerHTML = '';

    this.sparkles.forEach(sparkle => {
      const sparkleElement = this.createSparkleElement(sparkle);
      container.appendChild(sparkleElement);
    });
  }

  private createSparkleElement(sparkle: Sparkle): HTMLElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sparkle-svg');
    svg.setAttribute('width', '21');
    svg.setAttribute('height', '21');
    svg.setAttribute('viewBox', '0 0 21 21');
    svg.style.position = 'absolute';
    svg.style.left = sparkle.x;
    svg.style.top = sparkle.y;
    svg.style.opacity = sparkle.opacity.toString();
    svg.style.transform = `scale(${sparkle.scale}) rotate(${sparkle.rotation}deg)`;
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '20';
    svg.style.transition = 'all 0.1s ease';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z');
    path.setAttribute('fill', sparkle.color);

    svg.appendChild(path);
    return svg as unknown as HTMLElement;
  }
}
