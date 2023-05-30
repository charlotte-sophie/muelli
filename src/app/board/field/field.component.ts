import {ChangeDetectionStrategy, Component, computed, effect, inject, Input, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {BoardService, FieldType, GamePhase, GameState, Player, Position, TerminalPosition} from "../board.service";
import {Observable} from "rxjs";


interface FieldPosition {
  x: number
  y: number
}

@Component({
  selector: 'app-field',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FieldComponent implements OnInit {

  private boardService = inject(BoardService);

  @Input()
  public x!: number

  @Input()
  public y!: number

  @Input()
  public terminalPosition: TerminalPosition = 'NONE'

  public svg: string = ''

  @Input()
  public fieldType!: FieldType

  public isSelected$ !: Observable<boolean>
  public isSelectable$ !: Observable<boolean>
  public isNextPossibleMove$!: Observable<boolean>
  public isKillable$!: Observable<boolean>
  public gameState = this.boardService.gameStateSignal
  public color$!: Observable<Player | undefined>


  ngOnInit(): void {
    this.isNextPossibleMove$ = this.boardService.isNextPossibleMove(this.x, this.y)
    this.isSelected$ = this.boardService.isSelected(this.x, this.y)
    this.isSelectable$ = this.boardService.isSelectable(this.x, this.y)
    this.isKillable$ = this.boardService.isKillable(this.x, this.y)
    this.color$ = this.boardService.selectFieldColor(this.x, this.y)

    this.svg = './assets/svg/horizontal.svg'
    switch (this.terminalPosition) {
      case "LEFT_BOTTOM_CORNER":
        this.svg = './assets/svg/corner_bottom_left.svg';
        break
      case "RIGHT_BOTTOM_CORNER":
        this.svg = './assets/svg/corner_bottom_right.svg';
        break
      case "MIDDLE_BOTTOM":
        this.svg = './assets/svg/middle_bottom.svg';
        break
      case "MIDDLE":
        this.svg = './assets/svg/middle.svg';
        break
      case "MIDDLE_LEFT":
        this.svg = './assets/svg/middle_left.svg';
        break
      case "MIDDLE_RIGHT":
        this.svg = './assets/svg/middle_right.svg';
        break
      case "MIDDLE_TOP":
        this.svg = './assets/svg/middle_top.svg';
        break
      case "LEFT_TOP_CORNER":
        this.svg = './assets/svg/corner_top_left.svg';
        break
      case "RIGHT_TOP_CORNER":
        this.svg = './assets/svg/corner_top_right.svg';
        break
    }
  }

  public clickField(state: GameState, selectedField?: Position) {
    switch (state.phase) {
      case "MOVE":
        return this.moveToField(selectedField!, state)
      case "SELECT":
        return this.selectField(state)

    }
  }

  public selectField(state: GameState) {
    this.boardService.selectField({x: this.x, y: this.y}, state)
  }

  public moveToField(selectedField: Position, state: GameState) {
    if (selectedField.x === this.x && selectedField.y === this.y) {
      this.boardService.unselectField(state)
    }
    this.boardService.moveToField({x: this.x, y: this.y}, state)
  }


  public adjustGame(game: GameState | undefined) {
    if (game && this.fieldType === 'TERMINAL') {
      this.boardService.makeMove(game, {x: this.x, y: this.y})
    }
  }
}
