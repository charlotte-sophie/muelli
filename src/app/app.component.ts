import {Component, computed, inject} from '@angular/core';
import {MatToolbarModule} from "@angular/material/toolbar";
import {BoardComponent} from "./board/board.component";
import {BoardService} from "./board/board.service";
import {NgClass, NgIf} from "@angular/common";
import {PlayerInfoComponent} from "./board/player-info/player-info.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatToolbarModule,
    BoardComponent,
    NgClass,
    PlayerInfoComponent,
    NgIf
  ],
  standalone: true
})
export class AppComponent {
  title = 'Mülli';

  public boardService = inject(BoardService)
  public game = this.boardService.gameStateSignal
  public currentPlayer = computed(() => this.game()?.currentPlayer)
  public player1 = computed(() => this.game()?.player1)
  public player2 = computed(() => this.game()?.player2)
}
