import TodoApp from "./components/TodoApp";
import Styles from "../src/components/TodoList.css";

function App() {
  return (
    <div className="gradient d-flex justify-content-center align-items-center vh-100">
      <div
        className="container mp-2"
        style={{ maxWidth: "900px", height: "500px" }}
      >
        <div className="card p-3 ">
          <TodoApp />
        </div>
      </div>
    </div>
  );
}

export default App;
