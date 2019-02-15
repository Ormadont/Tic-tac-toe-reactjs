import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={() => props.onClick()}
        >
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
    state = {
        history: [{
            squares: Array(9).fill(null),
            curRowCol: { row: null, col: null }
        }],
        xIsNext: true,
        stepNumber: 0,
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        // const rowCol = {...current.curRowCol};
        const curRowCol = { row: calculateRow(i), col: calculateCol(i) };
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                curRowCol: curRowCol,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const char = (move % 2) ? 'X' : 'O';
            const row = step.curRowCol.row;
            const col = step.curRowCol.col;
            const desc = move ?
                `Перейти к ходу ${move} - ${char} - ${row}:${col} ` :
                'Перейти к началу игры';
            return (
                <li key={move}>
                    <button onClick={() => { this.jumpTo(move) }}>{desc}</button>
                </li>
            )
        })
        let status;
        if (winner) {
            status = `Победа: ${winner}`;
        } else {
            status = `Следующий: ${this.state.xIsNext ? 'X' : 'O'}`;
        }
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

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateRow(i) {
    if (i < 3) return 1
    else if (i < 6) return 2
    else return 3
}

function calculateCol(i) {
    let col = 0;
    switch (i) {
        case 0:
            col = 1;
            break;
        case 3:
            col = 1;
            break;
        case 6:
            col = 1;
            break;
        case 1:
            col = 2;
            break;
        case 4:
            col = 2;
            break;
        case 7:
            col = 2;
            break;
        default:
            col = 3;
            break;
    }
    return col;
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
