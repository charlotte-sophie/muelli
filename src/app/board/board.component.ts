import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FieldComponent} from "./field/field.component";
import {BoardService} from "./board.service";
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {WinnerDialogComponent} from "./winner-dialog/winner-dialog.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FieldComponent, MatDialogModule],
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit {

  public dialog: MatDialog = inject(MatDialog)
  private boardService = inject(BoardService)

  public game = this.boardService.gameStateSignal
  public winner = computed(() => this.game()?.winner)
  public current = computed(() => this.game()?.currentPlayer)
  public winnerEffect = effect(() => {
    if (!!this.winner()) this.openDialog()
  });

  ngOnInit(): void {
    this.boardService.startGame()
  }

  openDialog() {
    const dialogRef = this.dialog.open(WinnerDialogComponent, {
      height: '50vh',
      width: '50vw',
      data: {
        winner: this.winner()
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


}
