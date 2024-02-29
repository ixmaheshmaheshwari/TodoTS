import React, { useState, useContext } from "react";
import "../components/Navbar.css";
import { Button, Modal, Form, Input, InputNumber } from "antd";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./ThemeChanger";
import logo from "../components/icons8-todo-list.gif";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

const Navbar: React.FC<{ onTodoCreated: (todo: Todo) => void }> = ({
  onTodoCreated,
}) => {
  const { toggle } = useContext(ThemeContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_URL as string;

  const handleCreate = (values: { title: string; ID: number }) => {
    axios
      .post(baseURL, {
        title: values.title,
        completed: false,
        id: values.ID,
        userId: 201,
      })
      .then((res) => {
        const newTodo: Todo = res.data;
        setIsModalOpen(false);
        onTodoCreated(newTodo);
        setIsLoading(false);
        toast.success("Task is successfully added.");
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error creating todo", error);
        toast.error("Error creating task");
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: { title: string; ID: number }) => {
    setIsLoading(true);
    handleCreate(values);
  };

  return (
    <>
      <div className="header">
        <div className="img">
          <img src={logo} className="image" alt="logo" />
          <h2 className={toggle}>To-Do Tasks</h2>
        </div>
        <div>
          <Button type="primary" onClick={showModal}>
            Add New Task
          </Button>
        </div>
      </div>

      <Modal
        title="Add ToDo"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        className={`modal${toggle === "dark" ? "dark" : "light"}`}
      >
        <Form onFinish={onFinish}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ID"
            name="ID"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <InputNumber min={201} />
          </Form.Item>
          <Form.Item>
            <div style={{ display: "flex", gap: "5px" }}>
              {isLoading ? (
                <Button type="primary" loading className="add-loading">
                  Adding
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    size="small"
                    htmlType="submit"
                    className="add"
                  >
                    Add
                  </Button>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleCancel}
                    className="cancel"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme={toggle}
      />
    </>
  );
};

export default Navbar;
