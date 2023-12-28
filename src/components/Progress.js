export default function Progress({currentIndex, numQustions, points, maxPossiblePoints, answer}){
    return(
        <header className="progress">
            <progress max={numQustions} value={currentIndex + Number(answer !== null)}/>
            <p>Question <strong>{currentIndex + 1} / {numQustions}</strong></p>
            <p>Points <strong>{points} / {maxPossiblePoints}</strong></p>
        </header>
    );
};