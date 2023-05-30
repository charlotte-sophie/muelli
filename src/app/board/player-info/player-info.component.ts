import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Player, PlayerState} from "../board.service";
import {MatCardModule} from "@angular/material/card";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";

@Component({
  selector: 'app-player-info',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerInfoComponent {

  @Input()
  public info!: PlayerState

  @Input()
  public current!: Player
}
