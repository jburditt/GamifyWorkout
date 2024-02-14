export class MenuItem {
    displayName: string;
    routerLink: string;
    icon: string | null;
    children: Array<MenuItem> | null = null;
  
    constructor(displayName: string, routerLink: string, icon: string | null = null, children?: Array<MenuItem> | null) {
        this.displayName = displayName;
        this.routerLink = routerLink;
        this.icon = icon;
        this.children = children ?? null;
    }
  }