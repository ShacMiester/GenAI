import { Component, signal, output } from '@angular/core';
import { Router } from '@angular/router';
import { SideMenuItem } from '../../interfaces/sidemenu.interface';
import { GenAITypography } from "../../ui-elements/gen-ai-typography/gen-ai-typography";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  imports: [GenAITypography]
})
export class Sidebar {
  readonly isOpen = signal(true);
  readonly sidebarToggle = output<boolean>();
  readonly expandedItems = signal<Set<string>>(new Set(['Organization']));

  constructor(private router: Router) {}

  readonly menuItems = signal<SideMenuItem[]>([
    {
      title: 'Dashboard',
      logo: 'images/sidebar/dashboard.svg',
      titleColor: 'primary-tint',
      route: '/dashboard'
    },
    {
      title: 'Report',
      logo: 'images/sidebar/report.svg',
      titleColor: 'btn-nav-prim-text'
    },
    {
      title: 'Organization',
      logo: 'images/sidebar/organization.svg',
      titleColor: 'btn-nav-prim-text',
      subItems: [
        {
          title: 'Users', 
          titleColor: 'btn-nav-prim-text', 
          logo: 'images/sidebar/users.svg', 
          route: '/user-management',
          action: {
            icon: 'images/actions/plus.svg',
            callback: () => this.addNewUser()
          },
        },
      ]
    }
  ]);

  toggle() {
    this.isOpen.update(value => !value);
    this.sidebarToggle.emit(this.isOpen());
  }

  toggleMenuItem(itemTitle: string) {
    this.expandedItems.update(expanded => {
      const newSet = new Set(expanded);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  }

  isItemExpanded(itemTitle: string): boolean {
    return this.expandedItems().has(itemTitle);
  }

  navigateTo(route?: string) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  addNewUser() {
    console.log('Add new user clicked');
    this.router.navigate(['/user-management']);
  }

  getCurrentRouteIcon(): string {
    const currentRoute = this.router.url;
    if (currentRoute.includes('/dashboard')) {
      return 'images/sidebar/dashboard.svg';
    } else if (currentRoute.includes('/user-management')) {
      return 'images/sidebar/users.svg';
    }
    return 'images/sidebar/dashboard.svg'; // default
  }
}