import React, { useState } from "react";

// handle todo input

const InputField = ({ addTodo, loading }) => {
  const [newTodo, setNewTodo] = useState("");

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      addTodo(newTodo);
      setNewTodo("");
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control shadow-lg"
        placeholder="New Todo"
        value={newTodo}
        onChange={handleInputChange}
        disabled={loading}
      />
      <button
        className="btn btn-primary shadow-lg"
        type="button"
        onClick={handleAddTodo}
        disabled={loading}
      >
        {loading ? (
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          "Add Todo"
        )}
      </button>
    </div>
  );
};

export default InputField;
