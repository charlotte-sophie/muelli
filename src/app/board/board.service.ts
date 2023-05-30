import {computed, Injectable} from "@angular/core";
import {BehaviorSubject, map, Observable} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

export type FieldType = 'TERMINAL' | 'HORIZONTAL_PATH' | 'VERTICAL_PATH' | 'EMPTY'

export type TerminalPosition =
  'LEFT_BOTTOM_CORNER'
  | 'LEFT_TOP_CORNER'
  | 'RIGHT_BOTTOM_CORNER'
  | 'RIGHT_TOP_CORNER'
  | 'MIDDLE_LEFT'
  | 'MIDDLE_RIGHT'
  | 'MIDDLE_TOP'
  | 'MIDDLE_BOTTOM'
  | 'MIDDLE'
  | 'NONE'

export type Player = 'player1' | 'player2'

export interface Position {
  x: number
  y: number
}


export interface FieldState {
  type: FieldType
  occupied_by?: Player
  terminalPosition: TerminalPosition
  x: number
  y: number
}

export interface PlayerState {
  phase: 'SET' | 'TURN' | 'FLY' | 'KILL'
  color: Player
  figureCount: number
  unsetFigures: number
}

export type BoardState = FieldState[][]

const PLAYER_1: PlayerState = {
  color: "player1",
  figureCount: 9,
  phase: "SET",
  unsetFigures: 9
}
const PLAYER_2: PlayerState = {
  color: "player2",
  figureCount: 9,
  phase: "SET",
  unsetFigures: 9
}

export type GamePhase = 'SELECT' | 'MOVE'

export interface GameState {
  phase: GamePhase
  player1: PlayerState
  player2: PlayerState
  boardState: BoardState
  currentPlayer: Player
  position?: Position
  winner?: Player
}

const INITIAL_BOARD_STATE: BoardState = [
  [{type: 'TERMINAL', terminalPosition: "LEFT_TOP_CORNER", y: 0, x: 0},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 0, x: 1},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 0, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_TOP", y: 0, x: 3},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 0, x: 4},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 0, x: 5},
    {type: 'TERMINAL', terminalPosition: "RIGHT_TOP_CORNER", y: 0, x: 6}],
  [{type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 1, x: 0},
    {type: 'TERMINAL', terminalPosition: "LEFT_TOP_CORNER", y: 1, x: 1},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 1, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE", y: 1, x: 3},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 1, x: 4},
    {type: 'TERMINAL', terminalPosition: "RIGHT_TOP_CORNER", y: 1, x: 5},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 1, x: 6}],
  [{type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 2, x: 0},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 2, x: 1},
    {type: 'TERMINAL', terminalPosition: "LEFT_TOP_CORNER", y: 2, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_BOTTOM", y: 2, x: 3},
    {type: 'TERMINAL', terminalPosition: "RIGHT_TOP_CORNER", y: 2, x: 4},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 2, x: 5},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 2, x: 6}],
  [{type: 'TERMINAL', terminalPosition: "MIDDLE_LEFT", y: 3, x: 0},
    {type: 'TERMINAL', terminalPosition: "MIDDLE", y: 3, x: 1},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_RIGHT", y: 3, x: 2},
    {type: 'EMPTY', terminalPosition: "NONE", y: 3, x: 3},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_LEFT", y: 3, x: 4},
    {type: 'TERMINAL', terminalPosition: "MIDDLE", y: 3, x: 5},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_RIGHT", y: 3, x: 6}],
  [{type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 4, x: 0},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 4, x: 1},
    {type: 'TERMINAL', terminalPosition: "LEFT_BOTTOM_CORNER", y: 4, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_TOP", y: 4, x: 3},
    {type: 'TERMINAL', terminalPosition: "RIGHT_BOTTOM_CORNER", y: 4, x: 4},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 4, x: 5},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 4, x: 6}],
  [{type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 5, x: 0},
    {type: 'TERMINAL', terminalPosition: "LEFT_BOTTOM_CORNER", y: 5, x: 1},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 5, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE", y: 5, x: 3},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 5, x: 4},
    {type: 'TERMINAL', terminalPosition: "RIGHT_BOTTOM_CORNER", y: 5, x: 5},
    {type: 'VERTICAL_PATH', terminalPosition: "NONE", y: 5, x: 6}],
  [{type: 'TERMINAL', terminalPosition: "LEFT_BOTTOM_CORNER", y: 6, x: 0},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 6, x: 1},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 6, x: 2},
    {type: 'TERMINAL', terminalPosition: "MIDDLE_BOTTOM", y: 6, x: 3},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 6, x: 4},
    {type: 'HORIZONTAL_PATH', terminalPosition: "NONE", y: 6, x: 5},
    {type: 'TERMINAL', terminalPosition: "RIGHT_BOTTOM_CORNER", y: 6, x: 6}],
]

const INITIAL_GAME_STATE: GameState = {
  boardState: INITIAL_BOARD_STATE,
  player1: PLAYER_1,
  player2: PLAYER_2,
  currentPlayer: "player1",
  phase: "MOVE"
}

@Injectable()
export class BoardService {

  private _gameState$ = new BehaviorSubject<GameState>(INITIAL_GAME_STATE)

  private _selectedField$: BehaviorSubject<Position | null> = new BehaviorSubject<Position | null>(null);
  private _moveableFields$: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([]);
  private _selectableFields$: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([])
  private _killableFields$: BehaviorSubject<Position[]> = new BehaviorSubject<Position[]>([])

  private changeGameState(state: GameState) {
    this._gameState$.next(state)
  }

  get gameStateSignal() {
    return toSignal(this._gameState$)
  }

  public isSelected(x: number, y: number): Observable<boolean> {
    return this._selectedField$.pipe(
      map(position => position ? position.x === x && position.y === y : false)
    )
  }

  public selectFieldColor(x: number, y: number): Observable<Player | undefined> {
    return this._gameState$.pipe(
      map(s => s.boardState.flat().find(f => f.x === x && f.y === y)?.occupied_by)
    )
  }

  public isSelectable(x: number, y: number): Observable<boolean> {
    return this._selectableFields$.pipe(
      map(positions => this.containsPosition(positions, {x, y}))
    )
  }
  public isKillable(x: number, y: number): Observable<boolean> {
    return this._killableFields$.pipe(
      map(positions => this.containsPosition(positions, {x, y}))
    )
  }

  public isNextPossibleMove(x: number, y: number): Observable<boolean> {
    return this._moveableFields$.pipe(
      map(positions => !!positions.find(position => position.x === x && position.y === y)))
  }

  public startGame() {
    this.calculateOptions(this._gameState$.value)
  }

  public resetGame(): void {
    this._gameState$.next(INITIAL_GAME_STATE);
    this.calculateOptions(INITIAL_GAME_STATE)

  }

  public makeMove(game: GameState, {x, y}: Position) {
    const current = game[game.currentPlayer]
    switch (current.phase) {
      case "SET":
        if (this.containsPosition(this._moveableFields$.value, {x, y})) {
          this.setOnField(game, {x, y})
        }
        break
      case "FLY":
      case "TURN":
        if (this.ownsField({x, y}, game)) {
          this.selectField({x, y}, game)
        } else if (this.isPossibleMove({x, y}, game)) {
          this.moveToField({x, y}, game)
        }
        break
      case "KILL":
        if (this.ownsField({x, y}, game, this.swapPlayer(current.color)) && this.isDeletable({x, y})) {
          this.deleteStone({x, y}, game)
        }
        break
    }
  }

  private containsPosition(positions: Position[], {x, y}: Position): boolean {
    return !!positions.find(position => position.x === x && position.y === y)
  }

  private ownsField({x, y}: Position, game: GameState, player: Player = game.currentPlayer): boolean {
    return game.boardState.flat().find(f => f.x === x && f.y === y)?.occupied_by === player
  }

  private deleteStone({x, y}: Position, game: GameState) {
    const nextPlayer = this.swapPlayer(game.currentPlayer)
    const lastPlayerState = game[game.currentPlayer]
    const nextPlayerState = game[nextPlayer]
    const nextBoard = game.boardState.map(r => r
      .map(f => f.x === x && f.y === y ? ({...f, occupied_by: undefined} as FieldState) : f)
    )
    const figureCount = nextPlayerState.figureCount - 1
    let nextState = game
    if (figureCount < 3) {
      nextState = {...game, winner: game.currentPlayer}
    } else {
      nextState = {
        ...game,
        currentPlayer: nextPlayer,
        [nextPlayer]: {
          ...nextPlayerState,
          figureCount,
          phase: figureCount <= 3 ? 'FLY' : nextPlayerState.phase
        },
        [game.currentPlayer]: {
          ...lastPlayerState,
          phase: lastPlayerState.unsetFigures > 0 ? 'SET' : lastPlayerState.figureCount <= 3 ? 'FLY' : 'TURN'
        },
        boardState: nextBoard
      };
    }
    this._gameState$.next(nextState)
    this.calculateOptions(nextState)
  }

  public selectField(position: Position, state: GameState) {
    const nextState = {...state, position};
    this._gameState$.next(nextState)
    this.calculateOptions(nextState)
  }


  public unselectField(state: GameState) {
    const nextState = {...state, position: undefined};
    this._gameState$.next(nextState)
    this.calculateOptions(nextState)
  }

  public moveToField(to: Position, state: GameState) {
    const from = state.position!
    const nextBoard = state.boardState.map(r => r
      .map(f => f.x === from.x && f.y === from.y ? ({...f, occupied_by: undefined} as FieldState) : f)
      .map(f => f.x === to.x && f.y === to.y ? ({...f, occupied_by: state.currentPlayer} as FieldState) : f)
    )
    let nextState = {
      ...state,
      position: undefined,
      boardState: nextBoard,
      currentPlayer: this.swapPlayer(state.currentPlayer)
    };
    if (this.hasTrap(to, nextState) && this.findStonesToDelete(nextState.currentPlayer, state).length > 0) {
      const currentPlayer = nextState[state.currentPlayer]
      const updatePlayer: PlayerState = {...currentPlayer, phase: 'KILL'}
      nextState = {...nextState, currentPlayer: state.currentPlayer, [state.currentPlayer]: updatePlayer}
      const stonesToDelete = this.findStonesToDelete(nextState.currentPlayer, state)
    }
    this._gameState$.next(nextState)
    this.calculateOptions(nextState)
  }

  private setOnField(game: GameState, {x, y}: Position): GameState {
    const boardState = game.boardState.map(r => r
      .map(f => f.x === x && f.y === y ? ({...f, occupied_by: game.currentPlayer} as FieldState) : f)
    )
    const currentPlayer = game[game.currentPlayer]
    const unsetFigures = currentPlayer.unsetFigures - 1
    const updatePlayer: PlayerState = {...currentPlayer, unsetFigures, phase: unsetFigures > 0 ? 'SET' : "TURN"}
    let s = {
      ...game,
      boardState,
      currentPlayer: this.swapPlayer(game.currentPlayer),
      [game.currentPlayer]: updatePlayer
    }
    if (this.hasTrap({x, y}, s) && this.findStonesToDelete(s.currentPlayer, game).length > 0) {
      const currentPlayer = s[game.currentPlayer]
      const updatePlayer: PlayerState = {...currentPlayer, phase: 'KILL'}
      s = {...s, currentPlayer: game.currentPlayer, [game.currentPlayer]: updatePlayer}
    }
    this._gameState$.next(s)
    this.calculateOptions(s)
    return s
  }

  private clearFields(state: GameState): GameState {

    return {
      ...state,
      currentPlayer: this.swapPlayer(state.currentPlayer)
    }
  }

  private hasTrap({x, y}: Position, state: GameState): boolean {
    const board = state.boardState
    const current = this.swapPlayer(state.currentPlayer)
    let trapInRow = 0
    let trapInColumn
    if (y === 3 && x < 3) {
      trapInColumn = board[y].slice(0, 3).reduce((acc, f) => f.occupied_by === current ? acc + 1 : acc, 0)
    } else if (y === 3 && x > 3) {
      trapInColumn = board[y].slice(4, 7).reduce((acc, f) => f.occupied_by === current ? acc + 1 : acc, 0)
    } else {
      trapInColumn = board[y].reduce((acc, f) => f.occupied_by === current ? acc + 1 : acc, 0)
    }
    if (x === 3 && y < 3) {
      for (let i = 0; i < board.length / 2 - 1; i++) {
        if (board[i][x].occupied_by === current) trapInRow++
      }
    } else if (x === 3 && y > 3) {
      for (let i = 4; i < board.length; i++) {
        if (board[i][x].occupied_by === current) trapInRow++
      }
    } else {
      for (let i = 0; i < board.length; i++) {
        if (board[i][x].occupied_by === current) trapInRow++
      }
    }
    return trapInColumn === 3 || trapInRow === 3
  }

  private findStonesToDelete(player: Player, game: GameState): Position[] {
    return game.boardState
      .flat()
      .filter(f => f.occupied_by === player)
      .map(f => ({x: f.x, y: f.y}))
      .filter(f => !this.hasTrap(f, game))
  }

  private swapPlayer(player: Player): Player {
    return player === 'player2' ? 'player1' : "player2"
  }

  private calculateOptions(s: GameState) {
    const current = s[s.currentPlayer]
    switch (current.phase) {
      case "SET":
        this._selectableFields$.next([])
        this._selectedField$.next(null)
        this._killableFields$.next([])
        this._moveableFields$.next(
          s.boardState
            .flat()
            .filter(f => f.type === "TERMINAL")
            .filter(f => !f.occupied_by)
            .map(({x, y}) => ({x, y}))
        )
        break
      case "FLY":
        if (s.position) {
          this._selectableFields$.next([])
          this._selectedField$.next(s.position)
          this._killableFields$.next([])
          this._moveableFields$.next(
            s.boardState
              .flat()
              .filter(f => f.type === "TERMINAL")
              .filter(f => !f.occupied_by)
              .map(({x, y}) => ({x, y}))
          )
        } else {
          this._selectedField$.next(null)
          this._moveableFields$.next([])
          this._killableFields$.next([])
          this._selectableFields$.next(
            s.boardState
              .flat()
              .filter(f => f.occupied_by === current.color)
              .map(({x, y}) => ({x, y}))
          )
        }
        break
      case "TURN":
        if (s.position) {
          this._selectableFields$.next([])
          this._selectedField$.next(s.position)
          this._killableFields$.next([])
          this._moveableFields$.next(
            this.findPossibleMoves(s.position, s)
          )
        } else {
          this._selectedField$.next(null)
          this._moveableFields$.next([])
          this._killableFields$.next([])
          this._selectableFields$.next(
            s.boardState
              .flat()
              .filter(f => f.occupied_by === current.color)
              .map(({x, y}) => ({x, y}))
          )
        }
        break
      case "KILL":
        this._killableFields$.next(this.findStonesToDelete(this.swapPlayer(s.currentPlayer), s))
        this._selectedField$.next(null)
        this._moveableFields$.next([])
        this._selectableFields$.next([])
        break
    }
  }

  private findPossibleMoves({x, y}: Position, game: GameState): Position[] {
    const elements: Position[] = []
    const board = game.boardState
    let elem = board[y][x]
    while (elem != null && (elem.type === 'HORIZONTAL_PATH' || elem.type === 'TERMINAL')) {
      if (elem.x + 1 > 6) break
      elem = board[y][elem.x + 1]
      if (!!elem.occupied_by) break
      if (elem.type === 'TERMINAL') {
        elements.push(elem)
        break
      }
    }
    elem = board[y][x]
    while (elem != null && (elem.type === 'HORIZONTAL_PATH' || elem.type === 'TERMINAL')) {
      if (elem.x - 1 < 0) break
      elem = board[y][elem.x - 1]
      if (!!elem.occupied_by) break
      if (elem.type === 'TERMINAL') {
        elements.push(elem)
        break
      }
    }
    elem = board[y][x]
    while (elem != null && (elem.type === 'VERTICAL_PATH' || elem.type === 'TERMINAL')) {
      if (elem.y - 1 < 0) break
      elem = board[elem.y - 1][x]
      if (!!elem.occupied_by) break
      if (elem.type === 'TERMINAL') {
        elements.push(elem)
        break
      }
    }
    elem = board[y][x]
    while (elem != null && (elem.type === 'VERTICAL_PATH' || elem.type === 'TERMINAL')) {
      if (elem.y + 1 > 6) break
      elem = board[elem.y + 1][x]
      if (!!elem.occupied_by) break
      if (elem.type === 'TERMINAL') {
        elements.push(elem)
        break
      }
    }
    return elements
  }

  private isPossibleMove({x, y}: Position, game: GameState): boolean {
    return !!this._moveableFields$.value.find(f => f.x === x && f.y === y)
  }

  private isDeletable({x, y}: Position) {
    return !!this._killableFields$.value.find(f => f.x === x && f.y === y);
  }
}
