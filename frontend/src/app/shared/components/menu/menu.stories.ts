import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { MenuComponent } from './menu.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MenuItem } from '@app/shared/models/menu-item.model';
import { NgFor } from '@angular/common';
import { RouterLink, provideRouter } from '@angular/router';

const routes = [
    { path: 'home', component: MenuComponent },
    { path: 'about', component: MenuComponent },
    { path: 'contact', component: MenuComponent },
];

const meta: Meta<typeof MenuComponent> = {
    title: 'Menu',
    component: MenuComponent,
    tags: ['autodocs'],
    decorators: [
        applicationConfig({
             providers: [provideAnimations(), provideRouter(routes)],
        }),
        moduleMetadata({
            imports: [NgFor, RouterLink]
        })
    ]
};

export default meta;
type Story = StoryObj<MenuComponent>;

export const Primary: Story = {
    render: () => ({
        props: {
            items: [
                new MenuItem('Home', '/home', 'home'),
                new MenuItem('About', '/about', 'info'),
                new MenuItem('Contact', '/contact', 'contact_mail'),
            ]
        },
    }),
};

export const NoIcon: Story = {
    render: () => ({
        props: {
            items: [
                new MenuItem('Home', '/home', 'home'),
                new MenuItem('About', '/about', 'info'),
                new MenuItem('No Icon', '/contact'),
            ]
        },
    }),
};