import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";

const initialState = {
  questions: [],
  // loading,error,ready,active,finished
  status: "loading",
  currentIndex: 0,
  answer: null,
  points: 0,
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
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [{ questions, status, currentIndex, answer }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Derive state
  const numQustions = questions.length;

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
          <Question
            question={questions[currentIndex]}
            dispatch={dispatch}
            answer={answer}
          />
          <NextButton answer={answer} dispatch={dispatch}/>
          </>
        )}
      </Main>
    </div>
  );
}
