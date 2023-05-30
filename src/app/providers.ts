import {EnvironmentProviders, makeEnvironmentProviders} from "@angular/core";
import {BoardService} from "./board/board.service";

export const provideGameDomain = (): EnvironmentProviders => makeEnvironmentProviders([
  BoardService
])
