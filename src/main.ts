import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {environment} from './environments/environment';
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import { provideAnimations } from '@angular/platform-browser/animations';


import('./bootstrap').then(() => console.log("initialized application"))
