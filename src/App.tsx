import React, { useState } from "react";
import Todo from "./components/Todo";
import { ThemeChanger } from "./components/ThemeChanger";

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0); // Assuming count is of type number

  return (
    <>
      <ThemeChanger>
        <Todo />
      </ThemeChanger>
    </>
  );
}

export default App;
