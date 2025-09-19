import { Injectable } from '@angular/core';

@Injectable()
export abstract class ToastService {
    abstract info(message: string): void;
    abstract error(message: string): void;
    abstract warning(message: string): void;
    abstract show(message: string): void;
    abstract success(message: string): void;
}