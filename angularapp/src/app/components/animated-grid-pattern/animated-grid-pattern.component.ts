import { Component, Input } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

export type GridIntensity = 'default' | 'subtle' | 'moderate' | 'visible' | 'strong' | 'dotted';

@Component({
  selector: 'app-animated-grid-pattern',
  templateUrl: './animated-grid-pattern.component.html',
  styleUrls: ['./animated-grid-pattern.component.css']
})
export class AnimatedGridPatternComponent {
  @Input() gridSize = 24; // Grid cell size in pixels
  @Input() fadeEffect = true; // Whether to apply fade effect at edges
  @Input() intensity: GridIntensity = 'subtle'; // Set to subtle by default

  constructor(public themeService: ThemeService) {}
}
