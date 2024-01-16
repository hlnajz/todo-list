import React, { useState } from "react";

const TodoItem = ({ todo, toggleTodo, deleteTodo }) => {
  const [showFullText, setShowFullText] = useState(false);

  const handleDoneUndone = () => {
    toggleTodo(todo.id);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  // set only 5 words to appear and the rest is in read more for better ui/ux
  const renderTodoText = () => {
    if (showFullText || todo.title.split(" ").length <= 5) {
      return todo.title;
    } else {
      const truncatedText = todo.title.split(" ").slice(0, 5).join(" ");
      return (
        <>
          {truncatedText}...{" "}
          <button className="btn btn-link btn-sm" onClick={toggleText}>
            Read More
          </button>
        </>
      );
    }
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center ">
      <div>
        <span
          style={{ textDecoration: todo.completed ? "line-through" : "none" }}
        >
          {renderTodoText()}
        </span>
      </div>
      <div>
        <button
          className={`btn btn-${
            todo.completed ? "dark" : "success"
          } btn-sm shadow-lg`}
          onClick={handleDoneUndone}
        >
          {todo.completed ? "Undone" : "Done"}
        </button>
        <button
          className="btn btn-danger shadow-lg btn-sm ml-2 mx-2"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
