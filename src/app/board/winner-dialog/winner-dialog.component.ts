import {ChangeDetectionStrategy, Component, inject, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {BoardService, Player} from "../board.service";

@Component({
  selector: 'app-winner-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './winner-dialog.component.html',
  styleUrls: ['./winner-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WinnerDialogComponent {

  private boardService = inject(BoardService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: {winner: Player}) {

  }

  public reset() {
    this.boardService.resetGame()
  }


}
