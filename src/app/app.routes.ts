import { ExtraOptions, Routes } from '@angular/router';
import { Home } from './component/home/home';
import { Header } from './component/header/header';
import { Footer } from './component/footer/footer';
import { About } from './component/about/about';
import { Contact } from './component/contact/contact';
import { Admission } from './component/admission/admission';
import { Library } from './component/library/library';
import { Events } from './component/events/events';
import { Awards } from './component/awards/awards';
import { Sports } from './component/sports/sports';


export const routes: Routes = [
    { path: 'home', component: Home },
    { path: 'header', component: Header },
    { path: 'footer', component: Footer },
    { path: 'about', component: About },
    { path: 'contact', component: Contact },
    { path: 'admissions', component: Admission },
    { path: 'labs', component: Library },
    { path: 'events', component: Events },
    { path: 'awards', component: Awards },
    { path: 'sports', component: Sports },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
];
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled'
};
