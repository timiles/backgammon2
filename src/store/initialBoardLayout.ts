import { BoardModel } from '../models/BoardModel';
import Player from '../models/Player';

const initialBoardLayout: BoardModel = {
  points: [
    // Black 24-point (Red 1-point)
    {
      checkers: [
        { id: 1, player: Player.Black },
        { id: 2, player: Player.Black },
      ],
    },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    // Red 6-point
    {
      checkers: [
        { id: 3, player: Player.Red },
        { id: 4, player: Player.Red },
        { id: 5, player: Player.Red },
        { id: 6, player: Player.Red },
        { id: 7, player: Player.Red },
      ],
    },
    { checkers: [] },
    // Red 8-point
    {
      checkers: [
        { id: 8, player: Player.Red },
        { id: 9, player: Player.Red },
        { id: 10, player: Player.Red },
      ],
    },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    // Black 13-point
    {
      checkers: [
        { id: 11, player: Player.Black },
        { id: 12, player: Player.Black },
        { id: 13, player: Player.Black },
        { id: 14, player: Player.Black },
        { id: 15, player: Player.Black },
      ],
    },
    // Red 13-point
    {
      checkers: [
        { id: 16, player: Player.Red },
        { id: 17, player: Player.Red },
        { id: 18, player: Player.Red },
        { id: 19, player: Player.Red },
        { id: 20, player: Player.Red },
      ],
    },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    // Black 8-point
    {
      checkers: [
        { id: 21, player: Player.Black },
        { id: 22, player: Player.Black },
        { id: 23, player: Player.Black },
      ],
    },
    { checkers: [] },
    // Black 6-point
    {
      checkers: [
        { id: 24, player: Player.Black },
        { id: 25, player: Player.Black },
        { id: 26, player: Player.Black },
        { id: 27, player: Player.Black },
        { id: 28, player: Player.Black },
      ],
    },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    { checkers: [] },
    // Red 24-point
    {
      checkers: [
        { id: 29, player: Player.Red },
        { id: 30, player: Player.Red },
      ],
    },
  ],
  bar: [{ checkers: [] }, { checkers: [] }],
};

export default initialBoardLayout;
