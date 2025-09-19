import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { MenuItem } from '@app/shared/models/menu-item.model';

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    imports: [RouterLink, MatMenuModule, MatIconModule, MatButtonModule]
})
export class MenuComponent {
    @Input() items: Array<MenuItem> = [];
}
