import { BoardHalf } from './BoardHalf';

export function CheckersArea() {
  return (
    <>
      <BoardHalf side="top" />
      <BoardHalf side="bottom" />
    </>
  );
}
