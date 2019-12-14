import { CounterContainerModel } from '../models/CounterContainerModel';

const initialBoardLayout: CounterContainerModel[] = [...Array(24)].map(() => ({ counters: [] }));

let id = 1;
for (let i = 0; i < 2; i += 1) {
  initialBoardLayout[0].counters.push({ id: id += 1, playerId: 1 });
  initialBoardLayout[23].counters.push({ id: id += 1, playerId: 2 });
}
for (let i = 0; i < 3; i += 1) {
  initialBoardLayout[7].counters.push({ id: id += 1, playerId: 2 });
  initialBoardLayout[16].counters.push({ id: id += 1, playerId: 1 });
}
for (let i = 0; i < 5; i += 1) {
  initialBoardLayout[5].counters.push({ id: id += 1, playerId: 2 });
  initialBoardLayout[11].counters.push({ id: id += 1, playerId: 1 });
  initialBoardLayout[12].counters.push({ id: id += 1, playerId: 2 });
  initialBoardLayout[18].counters.push({ id: id += 1, playerId: 1 });
}

export default initialBoardLayout;
