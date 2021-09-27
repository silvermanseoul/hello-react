import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      moveNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    // 불변성 유지
    // moveNumber에 따라, 현재 선택된 이동보다 나중의 이동 기록은 history에서 날려버림
    const history = this.state.history.slice(0, this.state.moveNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    // 승자가 결정됐거나 Square가 채워져 있다면 클릭 무시
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{ squares: squares }]),
      moveNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // 이동이 선택되면 moveNumber 변경
  jumpTo(moveId) {
    this.setState({ moveNumber: moveId, xIsNext: moveId % 2 === 0 });
  }

  render() {
    const history = this.state.history;

    // moveNumber에 따라, 현재 선택된 이동을 렌더링
    const current = history[this.state.moveNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    const moves = history.map((move, moveId) => {
      const desc = moveId ? 'Go to move #' + moveId : 'Go to game start';
      return (
        <li key={moveId}>
          <button onClick={() => this.jumpTo(moveId)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
