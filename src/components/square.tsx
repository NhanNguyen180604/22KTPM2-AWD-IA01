import './../index.css';

type SquareProp = {
    value: string;
    onSquareClick: React.MouseEventHandler<HTMLButtonElement>;
    winning: boolean;
}

function Square({ value, onSquareClick, winning }: SquareProp) {
    return (
        <button className={`w-5 h-5 border-1 mb-0.5 rounded-xl text-2xl hover:cursor-pointer ${winning ? 'bg-blue-600 text-red-100' : ''}`}
            onClick={onSquareClick}>
            {value}
        </button>
    );
}

export default Square;