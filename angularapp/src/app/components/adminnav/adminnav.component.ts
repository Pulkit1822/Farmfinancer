import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-adminnav',
  templateUrl: './adminnav.component.html',
  styleUrls: ['./adminnav.component.css']
})
export class AdminnavComponent implements OnInit {
  username: string;
  showLoanSubmenu: boolean = false;
  isAdminHomePage: boolean = true;
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
   * Check if current route is /admin (home page)
   * Show home-container only on /admin
   * Hide on all other admin routes like /admin/createloan, /admin/viewloan, etc.
   */
  private checkRoute(): void {
    this.isAdminHomePage = this.router.url === '/admin';
  }

  onDropdownEnter(): void {
    this.clearDropdownTimeout();
    this.isMouseOverDropdown = true;
    this.showLoanSubmenu = true;
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
        this.showLoanSubmenu = false;
      }
    }, this.closeDelay);
  }

  toggleLoanSubmenu(): void {
    this.showLoanSubmenu = !this.showLoanSubmenu;
    this.clearDropdownTimeout();
  }

  closeDropdown(): void {
    this.showLoanSubmenu = false;
    this.clearDropdownTimeout();
    this.isMouseOverDropdown = false;
    this.isMouseOverMenu = false;
  }

  onDropdownKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDropdown();
      event.preventDefault();
    } else if (event.key === 'ArrowDown' && this.showLoanSubmenu) {
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
    if (!dropdown && this.showLoanSubmenu) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.showLoanSubmenu) {
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
