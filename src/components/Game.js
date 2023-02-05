import React, { useReducer } from 'react';
import Board from './Board';
import click from '../sound/click.mp3';

//We define 'reducer' out of the function
//accepts state and action as parameters
const reducer = (state, action) => {
  switch (action.type) {
    case 'JUMP':
      return {
        ...state,
        xIsNext: action.payload.step % 2 === 0,
        history: state.history.slice(0, action.payload.step + 1),
      };
    case 'MOVE':
      return {
        ...state, //we keep previous value of state
        //but change history, we concat the previous history with...
        history: state.history.concat({
          //the new one, an object with squares as element.
          //The value of the squares is coming from action.payload.squares
          squares: action.payload.squares,
        }),
        //The second change is...
        xIsNext: !state.xIsNext,
      };
    default:
      return state;
  }
};

export default function Game() {
  //useReducer accept 2 parameters (the reducer function and
  //default states)

  const [state, dispatch] = useReducer(reducer, {
    //x is the default player
    xIsNext: true,
    //array of actions of the game. The first element is squares, that is
    //an array of 9 elements null
    history: [{ squares: Array(9).fill(null) }],
  });

  //const [isPlayingSound, setIsPlayingSound] = useState(false);
  //from state we get 'xIsNext' and 'history'
  const { xIsNext, history } = state;
  const jumpTo = (step) => {
    dispatch({ type: 'JUMP', payload: { step } });
  };

  const clickSound = new Audio(click);
  
  const handleClick = (i) => {
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winner = calculateWinner(squares);
    //If winner exists or the i position of squares has a value we have to return, to no continue
    if (winner || squares[i]) {
      return;
    }
    //We put after the last if the sound, because if we put the sound before,
    //we could hear it even if it's already selected
    clickSound.play();
    //or... we need to continue playing, filling with X or O...
    squares[i] = xIsNext ? 'X' : 'O';
    //after that we dispatch the MOVE action and set payload passing squares
    dispatch({ type: 'MOVE', payload: { squares } });
  };
  //after handleClick we need to calculate current and winner again
  const current = history[history.length - 1];
  //be careful! we extract squares from current (current.squares)
  const winner = calculateWinner(current.squares);

  //After calculate winner...
  //const status = 'Next player is X';

  const status = winner
    ? winner === 'D'
      ? 'Draw'
      : 'Winner is: ' + winner
    : 'Next player is: ' + (xIsNext ? 'X' : 'O');

  const moves = history.map((step, move) => {
    const desc = move ? 'Go to ' + move : 'Start the game';
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  /* const squares = Array(9).fill(null); */

  return (
    <div className={winner ? 'game disabled' : 'game'}>
      <div className="game-board">
        {/* We pass data to a child component using props */}
        <Board
          onClick={(i) => handleClick(i)}
          squares={current.squares}
        ></Board>{' '}
        {/* Important!, see what it take from current, it was commented the line 'const squares'. 
        current comes from the function 'handeclick' (history), and history comes from the top (state),  */}
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}

const calculateWinner = (squares) => {
  const winnerLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let isDraw = true;
  for (let i = 0; i < winnerLines.length; i++) {
    const [a, b, c] = winnerLines[i];

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
    if (!squares[a] || !squares[b] || !squares[c]) {
      isDraw = false;
    }
  }
  if (isDraw) return 'D';
  return null;
};
