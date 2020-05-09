import { CounterContainerModel } from '../models/CounterContainerModel';
import Player from '../models/Player';

const initialBoardLayout: CounterContainerModel[] = [...Array(26)].map(() => ({ counters: [] }));

let id = 1;
for (let i = 0; i < 2; i += 1) {
  initialBoardLayout[1].counters.push({ id: id += 1, player: Player.Red });
  initialBoardLayout[24].counters.push({ id: id += 1, player: Player.Black });
}
for (let i = 0; i < 3; i += 1) {
  initialBoardLayout[8].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[17].counters.push({ id: id += 1, player: Player.Red });
}
for (let i = 0; i < 5; i += 1) {
  initialBoardLayout[6].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[12].counters.push({ id: id += 1, player: Player.Red });
  initialBoardLayout[13].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[19].counters.push({ id: id += 1, player: Player.Red });
}

export default initialBoardLayout;
