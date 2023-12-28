export default function NextButton({dispatch, answer, numQustions, currentIndex}){
    if(answer === null) return null;

    if(currentIndex < numQustions - 1) return(
        <button onClick={()=> dispatch({type: "nextquestion"})} className="btn btn-ui">NEXT</button>
    );

    if(currentIndex === numQustions - 1) return(
        <button onClick={()=> dispatch({type: "finish"})} className="btn btn-ui">Finish</button>
    );

};