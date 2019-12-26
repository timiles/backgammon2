import { CounterContainerModel } from '../models/CounterContainerModel';
import Player from '../models/Player';

const initialBoardLayout: CounterContainerModel[] = [...Array(24)].map(() => ({ counters: [] }));

let id = 1;
for (let i = 0; i < 2; i += 1) {
  initialBoardLayout[0].counters.push({ id: id += 1, player: Player.Red });
  initialBoardLayout[23].counters.push({ id: id += 1, player: Player.Black });
}
for (let i = 0; i < 3; i += 1) {
  initialBoardLayout[7].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[16].counters.push({ id: id += 1, player: Player.Red });
}
for (let i = 0; i < 5; i += 1) {
  initialBoardLayout[5].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[11].counters.push({ id: id += 1, player: Player.Red });
  initialBoardLayout[12].counters.push({ id: id += 1, player: Player.Black });
  initialBoardLayout[18].counters.push({ id: id += 1, player: Player.Red });
}

export default initialBoardLayout;
