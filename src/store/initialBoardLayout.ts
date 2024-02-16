import { CheckerContainerModel } from '../models/CheckerContainerModel';
import Player from '../models/Player';

const initialBoardLayout: CheckerContainerModel[] = [...Array(26)].map(() => ({ checkers: [] }));

let id = 1;
for (let i = 0; i < 2; i += 1) {
  initialBoardLayout[1].checkers.push({ id: (id += 1), player: Player.Black });
  initialBoardLayout[24].checkers.push({ id: (id += 1), player: Player.Red });
}
for (let i = 0; i < 3; i += 1) {
  initialBoardLayout[8].checkers.push({ id: (id += 1), player: Player.Red });
  initialBoardLayout[17].checkers.push({ id: (id += 1), player: Player.Black });
}
for (let i = 0; i < 5; i += 1) {
  initialBoardLayout[6].checkers.push({ id: (id += 1), player: Player.Red });
  initialBoardLayout[12].checkers.push({ id: (id += 1), player: Player.Black });
  initialBoardLayout[13].checkers.push({ id: (id += 1), player: Player.Red });
  initialBoardLayout[19].checkers.push({ id: (id += 1), player: Player.Black });
}

export default initialBoardLayout;
