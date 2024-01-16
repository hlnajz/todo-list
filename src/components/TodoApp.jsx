import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; //this new to me but I understand that Axios library communicates with servers and fetch my data
import InputField from "./InputField";
import TodoItem from "./TodoItem";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { debounce } from "lodash"; // performance reasons to stops my addTodo from making too much api calls, set to wait 300ms

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 5; // 6 todos in one page for better interface experinece

  // local todos
  const getLocalTodos = useCallback(() => {
    const localTodos = localStorage.getItem("todos");
    return localTodos ? JSON.parse(localTodos) : [];
  }, []);

  const updateLocalTodos = useCallback((updatedTodos) => {
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }, []);

  const addTodo = debounce(async (newTodo) => {
    setLoading(true);

    try {
      const newTodoObject = {
        userId: 1,
        id: todos.length + 1,
        title: newTodo,
        completed: false,
      };

      const updatedTodos = [newTodoObject, ...todos];
      setTodos(updatedTodos);
      updateLocalTodos(updatedTodos);

      await axios.post("http://localhost:3000/todos", newTodoObject);

      const totalPages = Math.ceil(updatedTodos.length / todosPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, 300);
  // jsonplaceholder todos
  useEffect(() => {
    const fetchTodos = async () => {
      const localTodos = getLocalTodos();

      if (localTodos.length > 0) {
        setTodos(localTodos);
        setLoading(false);
      } else {
        try {
          const response = await axios.get(
            "https://jsonplaceholder.typicode.com/todos"
          );

          setTodos(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTodos();
  }, [getLocalTodos]);

  // using toggle to check if its done or undone
  const toggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    updateLocalTodos(updatedTodos);
  };
  // delete todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    updateLocalTodos(updatedTodos);

    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  // pagination to navigaet todos in pages better not in single long page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  useEffect(() => {
    const localTodos = getLocalTodos();
    if (localTodos.length > 0) {
      setTodos(localTodos);
    } else {
      axios
        .get("https://jsonplaceholder.typicode.com/todos")
        .then((response) => {
          setTodos(response.data);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="container" style={{ maxWidth: "700px", height: "500px" }}>
      <h1 className="text-center titleTodo">Todo List</h1>
      <InputField addTodo={addTodo} loading={loading} />
      <div style={{ marginBottom: "2rem" }}>
        {loading ? (
          <FontAwesomeIcon icon="spinner" spin />
        ) : (
          <ul className="list-group">
            {currentTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="container mb-3" style={{ maxWidth: "700px" }}>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <span
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                Prev
              </span>
            </li>
            <li className="page-item disabled">
              <span className="page-link">{currentPage}</span>
            </li>
            <li
              className={`page-item ${
                currentPage === Math.ceil(todos.length / todosPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              <span
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <footer className="footer text-center">
        made with{" "}
        <FontAwesomeIcon icon={faHeart} style={{ color: "#7525e2" }} /> by{" "}
        <span className="hlnaji">Hamza Labbaalli</span>
      </footer>
    </div>
  );
};

export default TodoApp;
