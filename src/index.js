import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={"square".concat(props.isWinnerSquare ? " winner" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square key={i}
                    value={this.props.squares[i]}
                    isWinnerSquare={this.props.winningLine.includes(i)}
                    onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                {[...Array(3)].map(
                    (_, row) =>
                        <div key={row} className="board-row">
                            {[...Array(3)].map(
                                (_, col) => this.renderSquare(row * 3 + col))}
                        </div>)}
            </div>
        );
    }
}

class Game
    extends React
        .Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                col: null,
                row: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            showMovesAscending: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares)[0] || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: (i % 3) + 1,
                row: Math.floor(i / 3) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    reverseHistory() {
        this.setState({
            showMovesAscending: !this.state.showMovesAscending
        })
    }

    render() {
        const history = this.state.history;
        const stepNumber = this.state.stepNumber;
        const current = history[stepNumber];
        const [winner, winningLine] = calculateWinner(current.squares);
        const draw = !current.squares.includes(null);
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move + ' (' + step.col + ',' + step.row + ')' :
                'Go to game start';
            const selected = (move === stepNumber) ? 'selected-move' : '';
            return (
                <li key={move}>
                    <button className={selected} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });
        const orderedMoves = this.state.showMovesAscending ? moves : moves.reverse();
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (draw) {
            status = 'DRAW !';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningLine={winningLine}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ul style={{listStyle: "none"}}>{orderedMoves}</ul>
                    <div>
                        <button onClick={() => this.reverseHistory()}>{this.state.showMovesAscending ? 'v^' : '^v'}</button>
                    </div>
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
            return [squares[a], lines[i]];
        }
    }
    return [null, []];
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
