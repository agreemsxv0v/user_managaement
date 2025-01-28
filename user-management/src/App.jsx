import React from "react";
import "./App.css";
import UserList from "./components/UserList"; 
import ErrorBoundary from "./components/ErrorBoundary"; 

const App = () => {
  return (
    <div className="App">
      <h1>User Management Application</h1>
      <ErrorBoundary>
        <UserList />
      </ErrorBoundary>
    </div>
  );
};

export default App;
