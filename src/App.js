import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";

const initialState = {
  questions: [],
  // loading,error,ready,active,finished
  status: "loading",
  currentIndex: 0,
  answer: null,
  points: 0,
  highscore: 0
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
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
      };
    case "newAnswer":
      const question = state.questions.at(state.currentIndex);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextquestion":
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        answer: null
      };
    case "finish":

      return{
        ...state, 
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore
      }
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [{ questions, status, currentIndex, answer, points, highscore }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Derive state
  const numQustions = questions.length;
  const maxPossiblePoints = questions.reduce((acc, cur) => {
   return  acc + cur.points;
  }, 0);

  useEffect(() => {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailied" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQustions={numQustions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
          <Progress numQustions={numQustions} currentIndex={currentIndex} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer}/>
          <Question
            question={questions[currentIndex]}
            dispatch={dispatch}
            answer={answer}
          />
          <NextButton answer={answer} dispatch={dispatch} numQustions={numQustions} currentIndex={currentIndex}/>
          </>
        )}
         {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore}/>}
      </Main>
    </div>
  );
}
