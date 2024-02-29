import React, { useContext, useState } from "react";
import Navbar from "./Navbar";
import Cards from "./Card";
import { ThemeContext } from "./ThemeChanger";
import { Switch } from "antd";

const Todo: React.FC = () => {
  const [todo, setTodo] = useState<any[]>([]); // Assuming any[] for the todo state type
  const { toggleFunction } = useContext(ThemeContext);
console.log(toggleFunction);
  const handleTodoCreated = (newTodo: any) => { // Assuming any for the newTodo parameter type
    setTodo([...todo, newTodo]);
  };

  return (
    <>
      <Switch
        style={{
          width: "6pc",
          marginTop: "2pc",
          marginLeft: "3pc",
        }}
        onChange={toggleFunction}
        checkedChildren={"dark"}
        unCheckedChildren={"light"}
      ></Switch>
      <Navbar onTodoCreated={handleTodoCreated} />
      <Cards todoss={todo} />
    </>
  );
};

export default Todo;
