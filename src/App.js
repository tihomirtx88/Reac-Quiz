import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from './Loader';
import Error from './Error';
import StartScreen from "./StartScreen";
import Question from "./Question";

const initialState = {
  questions: [],
  // loading,error,ready,active,finished
  status: "loading",
};

function reducer(state, action) {
  
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailied":
      return{
        ...state,
        status: 'error'
      }
    case "start":
      return{
        ...state,
        status: 'active'
      }
    default:
      throw new Error("Unknown action");
  }

}

export default function App() {
  const [{questions, status}, dispatch] = useReducer(reducer, initialState);

  // Derive state
  const numQustions = questions.length;


  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({type: 'dataFailied'}));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
       {status === "loading" && <Loader/>}
       {status === "error" && <Error/>}
       {status === "ready" && <StartScreen numQustions={numQustions} dispatch={dispatch}/>}
       {status === "active" && <Question/>}
      </Main>
    </div>
  );
}
