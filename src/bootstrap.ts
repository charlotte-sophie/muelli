import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideAnimations} from "@angular/platform-browser/animations";
import {BoardService} from "./app/board/board.service";
import {provideGameDomain} from "./app/providers";


bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), provideGameDomain()]
})
