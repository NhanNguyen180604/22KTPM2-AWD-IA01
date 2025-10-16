import { useState } from 'react'
import Board from './components/board';
import './App.css'
import { SquareSize } from './constants';

function App() {
  const [history, setHistory] = useState([Array(SquareSize * SquareSize).fill('') as string[]]);
  const [locationHistory, setLocationHistory] = useState([-1] as number[]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortMovesAscending, setSortMovesAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares: string[], location: number) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    const nextLocationHistory = [...locationHistory.slice(0, currentMove + 1), location];
    setHistory(nextHistory);
    setLocationHistory(nextLocationHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_, move) => {
    if (move == 0)
      return;

    const currentLocation = locationHistory[move - 1];
    let description = currentMove == move ? 'You are at move #' : 'Go to move #';
    description += move;
    description += `, location (${Math.floor(currentLocation / SquareSize) + 1}, ${currentLocation % SquareSize + 1})`

    if (currentMove === move) {
      return (
        <div className='text-center w-full px-0.5 py-0.25 border-1 mb-0.25 rounded-xl bg-red-100'
          key={`move-${move}`}>
          {description}
        </div>
      );
    }
    else return (
      <button className='w-full px-0.5 py-0.25 border-1 hover:cursor-pointer mb-0.25 rounded-xl bg-blue-100'
        key={`move-${move}`}
        onClick={() => jumpTo(move)}>
        {description}
      </button>
    );
  });

  return (
    <>
      <div className="h-fit lg:h-screen w-screen flex flex-col gap-3 overflow-y-auto">
        <div className='text-3xl w-full text-center font-bold mt-2'>
          <div>IA01 - 22127304 - Nguyễn Thành Nhân</div>
        </div>
        <div className='flex flex-col gap-3 lg:flex-row'>
          <div className="flex flex-col items-center p-1 grow">
            <Board xIsNext={xIsNext} squares={currentSquares} latestMove={locationHistory.at(currentMove)} onPlay={handlePlay} />
          </div>

          <div className="p-1 grow h-full ooverflow-y-auto">
            <div className='px-5 md:px-10 mb-1 flex flex-col items-center'>
              <div className='font-bold text-xl mb-0.5 text-center'>Moves</div>
              <div className='flex justify-between items-center self-stretch'>
                <div className='px-0.5 py-0.25'>
                  Current direction: {sortMovesAscending ? 'Ascending' : 'Descending'}
                </div>
                <button className={`w-fit px-0.5 py-0.25 border-1 hover:cursor-pointer rounded-xl`}
                  onClick={() => setSortMovesAscending(!sortMovesAscending)}>
                  {!sortMovesAscending ? 'Sort Ascending' : 'Sort Descending'}
                </button>
              </div>
            </div>
            <div className='px-5 md:px-10 h-fit'>
              <div key={`move-0`}>
                <button className='w-full px-0.5 py-0.25 border-1 hover:cursor-pointer mb-0.25 rounded-xl'
                  onClick={() => jumpTo(0)}>
                  Move to the start of the game
                </button>
              </div>
              <div className={`flex ${sortMovesAscending ? 'flex-col' : 'flex-col-reverse'}`}>
                {moves}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
