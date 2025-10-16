import Square from "./square";
import './../index.css';
import { SquareSize, ConsecutiveToWin } from "../constants";
import { useMemo, useState } from "react";

type BoardProp = {
    xIsNext: boolean;
    squares: string[];
    latestMove: number | undefined;
    onPlay: (nextSquares: string[], location: number) => void;
};

function Board({ xIsNext, squares, latestMove, onPlay }: BoardProp) {
    const [winningSquares, setWinningSquares] = useState([-1]);

    function handleClick(i: number) {
        if (winningSquares.length === ConsecutiveToWin || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares, i);
    }

    function checkWinner(squares: string[], latestMove: number | undefined) {
        if (typeof latestMove === 'undefined' || latestMove < 0) {
            return null;
        }

        const x = Math.floor(latestMove / SquareSize);
        const y = latestMove % SquareSize;
        const symbol = squares[latestMove];

        // check row
        let moveCount = 0;
        let squaresToHighlight = [] as number[];
        for (let i = y; i >= 0; i--) {
            if (symbol === squares[x * SquareSize + i]) {
                moveCount++;
                squaresToHighlight.push(x * SquareSize + i);
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }
        for (let i = y + 1; i < SquareSize; i++) {
            if (symbol === squares[x * SquareSize + i]) {
                moveCount++;
                squaresToHighlight.push(x * SquareSize + i);
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }

        // check col
        moveCount = 0;
        squaresToHighlight = [] as number[];
        for (let j = x; j >= 0; j--) {
            if (symbol === squares[j * SquareSize + y]) {
                moveCount++;
                squaresToHighlight.push(j * SquareSize + y);
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }
        for (let j = x + 1; j < SquareSize; j++) {
            if (symbol === squares[j * SquareSize + y]) {
                moveCount++;
                squaresToHighlight.push(j * SquareSize + y);
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }

        // check diag
        moveCount = 0;
        squaresToHighlight = [] as number[];
        for (let i = 0; x - i >= 0 && y - i >= 0; i++) {
            if (symbol === squares[(x - i) * SquareSize + (y - i)]) {
                moveCount++;
                squaresToHighlight.push((x - i) * SquareSize + (y - i));
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }
        for (let i = 1; x + i < SquareSize && y + i < SquareSize; i++) {
            if (symbol === squares[(x + i) * SquareSize + (y + i)]) {
                moveCount++;
                squaresToHighlight.push((x + i) * SquareSize + (y + i))
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }

        // check anti diag
        moveCount = 0;
        squaresToHighlight = [];
        for (let i = 0; x - i >= 0 && y + i < SquareSize; i++) {
            if (symbol === squares[(x - i) * SquareSize + (y + i)]) {
                moveCount++;
                squaresToHighlight.push((x - i) * SquareSize + (y + i))
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }
        for (let i = 1; x + i < SquareSize && y - i >= 0; i++) {
            if (symbol === squares[(x + i) * SquareSize + (y - i)]) {
                moveCount++;
                squaresToHighlight.push((x + i) * SquareSize + (y - i))
            }
            else break;

            if (moveCount === ConsecutiveToWin)
                return { symbol, squaresToHighlight };
        }

        return null;
    }

    const result = useMemo(() => checkWinner(squares, latestMove), [squares, latestMove]);
    let status;
    if (result) {
        const winner = result.symbol;
        const squaresToHighlight = result.squaresToHighlight;
        status = 'Winner: ' + winner;
        if (winningSquares.length !== ConsecutiveToWin) {
            setWinningSquares(squaresToHighlight);
        }
    } else {
        if (winningSquares.length === ConsecutiveToWin) {
            setWinningSquares([]);
        }
        const movesPerformed = squares.filter(square => square.length).length;
        if (movesPerformed === SquareSize * SquareSize) {
            status = 'Tie!';
        }
        else {
            status = 'Next player: ' + (xIsNext ? 'X' : 'O');
        }
    }

    function createSquareRows(rowIndex: number, noCol: number) {
        return Array.from(Array(noCol).keys()).map((_, index) => {
            const squareValue = rowIndex * noCol + index;
            return (
                <Square value={squares[squareValue]}
                    onSquareClick={() => handleClick(squareValue)}
                    winning={winningSquares.includes(squareValue)}
                    key={`square-${squareValue}`} />
            );
        })
    }

    return (
        <>
            <div className="font-bold text-lg mb-0.75">
                {status}
            </div>
            {Array.from(Array(SquareSize).keys()).map(i => {
                return (
                    <div className="flex gap-0.5" key={`board-row-${i + 1}`}>
                        {createSquareRows(i, SquareSize)}
                    </div>
                );
            })}
        </>
    );
}

export default Board;