import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-usernav',
  templateUrl: './usernav.component.html',
  styleUrls: ['./usernav.component.css']
})
export class UsernavComponent implements OnInit {
  username: string;
  showFeedbackSubmenu: boolean = false;
  isUserHomePage: boolean = true;
  private dropdownTimeout: any;
  private isMouseOverDropdown: boolean = false;
  private isMouseOverMenu: boolean = false;
  private closeDelay: number = 300;
  private destroy$ = new Subject<void>();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.username = localStorage.getItem('username');
    this.username = this.username ? this.username : '';
    
    // Check current route on component init
    this.checkRoute();
    
    // Listen to route changes
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.checkRoute();
        // Close dropdown when navigating
        this.closeDropdown();
      });
  }

  /**
   * Check if current route is /user (home page)
   * Show home-container only on /user
   * Hide on all other user routes like /user/userviewloan, /user/userappliedloan, etc.
   */
  private checkRoute(): void {
    this.isUserHomePage = this.router.url === '/user';
  }

  onDropdownEnter(): void {
    this.clearDropdownTimeout();
    this.isMouseOverDropdown = true;
    this.showFeedbackSubmenu = true;
  }

  onDropdownLeave(): void {
    this.isMouseOverDropdown = false;
    this.scheduleClose();
  }

  onMenuEnter(): void {
    this.clearDropdownTimeout();
    this.isMouseOverMenu = true;
  }

  onMenuLeave(): void {
    this.isMouseOverMenu = false;
    this.scheduleClose();
  }

  onItemEnter(): void {
    this.clearDropdownTimeout();
  }

  onItemLeave(): void {
    // Don't schedule close when leaving individual items
  }

  private scheduleClose(): void {
    this.clearDropdownTimeout();
    this.dropdownTimeout = setTimeout(() => {
      if (!this.isMouseOverDropdown && !this.isMouseOverMenu) {
        this.showFeedbackSubmenu = false;
      }
    }, this.closeDelay);
  }

  toggleFeedbackSubmenu(): void {
    this.showFeedbackSubmenu = !this.showFeedbackSubmenu;
    this.clearDropdownTimeout();
  }

  closeDropdown(): void {
    this.showFeedbackSubmenu = false;
    this.clearDropdownTimeout();
    this.isMouseOverDropdown = false;
    this.isMouseOverMenu = false;
  }

  onDropdownKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDropdown();
      event.preventDefault();
    } else if (event.key === 'ArrowDown' && this.showFeedbackSubmenu) {
      const firstItem = document.querySelector('.dropdown-item') as HTMLElement;
      if (firstItem) {
        firstItem.focus();
        event.preventDefault();
      }
    }
  }

  private clearDropdownTimeout(): void {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdown = target.closest('.dropdown');
    if (!dropdown && this.showFeedbackSubmenu) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showFeedbackSubmenu) {
      this.closeDropdown();
      event.preventDefault();
    }
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}