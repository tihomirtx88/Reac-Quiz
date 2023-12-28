export default function NextButton({dispatch, answer}){
    if(answer === null) return null;

    return(
        <button onClick={()=> dispatch({type: "nextquestion"})} className="btn btn-ui">NEXT</button>
    );

};