import  { useState, useEffect, useContext } from "react";
import {
  Card,
  Button,
  Input,
  Pagination,
  Space,
  Modal,
  Form,
  Switch,
  Skeleton,
} from "antd";
import "../components/Card.css";
import { FaRegEdit } from "react-icons/fa";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeContext } from "./ThemeChanger";
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const Cards = ({ todoss }: { todoss: Todo[] }) => {
  const { toggle } = useContext(ThemeContext);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [todosPerPage, setTodosPerPage] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [form] = Form.useForm();
  const baseURL = import.meta.env.VITE_BASE_URL as string;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${baseURL}`)
      .then((res) => {
        const totalCount = Number(res.headers["x-total-count"]);
        setTotalPages(Math.ceil(totalCount / todosPerPage));
      })
      .catch((error) => {
        setError(null);
        console.error("Error fetching todos", error);
        setError("Error fetching todos. Please try again later.");
      });
  }, []);

  useEffect(() => {
    todoss.forEach((todo) => {
      setTodos((prevTodos) => [...prevTodos, todo]);
    });
  }, [todoss]);

  const showEditModal = (todo: Todo) => {
    setSelectedTodo(todo);
    form.setFieldsValue({
      title: todo.title,
      completed: todo.completed,
    });
    setIsEditModalVisible(true);
  };

  const handleEditOk = () => {
    form.submit();
  };

  const handleOk = () => {
    setIsLoading(true);
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setIsLoading(false);
    setLoading(false);
  };

  const onFinish = (values: { title: string; completed: boolean }) => {
    setIsLoading(true);
    setLoading(true);
    handleUpdate(selectedTodo!.id, values.title, values.completed);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}?_page=${currentPage}&_limit=${todosPerPage}`
      );
      setTodos(response.data);
      const totalCount = Number(response.headers["x-total-count"]);
      setTotalPages(Math.ceil(totalCount / todosPerPage));
      setLoading(false);
    } catch (error) {
      setError(null);
      console.error("Error fetching todos", error);
      setError("Error fetching todos. Please try again later.");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`${baseURL}/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
        toast.success("Task is successfully deleted");
        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        setError(null);
        console.error("Error deleting todo", error);
        toast.error("Error deleting task");
      });
  };

  const handleUpdate = (id: number, updatedTitle: string, completed: boolean) => {
    axios
      .put(`${baseURL}/${id}`, { title: updatedTitle, completed })
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, title: updatedTitle, completed } : todo
          )
        );
        setIsEditModalVisible(false);
        setIsLoading(false);
        setLoading(false);
        setError(null);
        toast.success("Task is successfully edited");
      })
      .catch((error) => {
        setIsEditModalVisible(false);
        setIsLoading(false);
        setLoading(false);
        setError(null);
        console.error("Error updating todo", error);
        toast.error("Error updating todo");
        setError("Error updating todo. Please try again later.");
      });
  };

  const completedTodos = todos.filter((todo) => todo.completed);
  const incompleteTodos = todos.filter((todo) => !todo.completed);

  return (
    <>
      {loading ? (
        <Skeleton
          active
          className={toggle}
          style={{
            height: 10,
            width: 298,
            marginLeft: 20,
          }}
        />
      ) : (
        <Space  direction="horizontal" size={16} wrap>
          {incompleteTodos.map((todo) => (
            <Card
              loading={loading}
              key={todo.id}
              title={<span style={{ color: "#ff0000" }}>Incompleted Task</span>}
              size="small"
              style={{
                width: 300,
                borderColor: "black",
              }}
              className={toggle}
            >
              <div id="card-body">
                <p className={toggle}>{todo.title}</p>
                <FaRegEdit
                  style={{ fontSize: "24px" }}
                  className="edit"
                  onClick={() => showEditModal(todo)}
                />
                <DeleteOutlined
                  className="delete"
                  style={{ fontSize: "24px" }}
                  onClick={() => {
                    setLoading(true);
                    handleDelete(todo.id);
                  }}
                />
              </div>
            </Card>
          ))}
        </Space>
      )}
      {loading ? (
        <Skeleton
          active
          style={{
            height: 10,
            width: 298,
            marginLeft: 20,
          }}
        />
      ) : (
        <>
          <Space
            className="card"
            direction="horizontal"
            size={16}
            wrap
            style={{ marginTop: 20 }}
          >
            {completedTodos.map((todo) => (
              <Card
                loading={loading}
                key={todo.id}
                size="small"
                title={<span className={`title-${toggle}`}>Completed Task</span>}
                style={{
                  width: 326,
                  marginLeft: 10,
                  borderColor: "black",
                }}
                className={toggle}
              >
                <div id="card-body">
                  <p className={toggle}>{todo.title}</p>
                  <FaRegEdit
                    style={{ fontSize: "24px" }}
                    className="edit"
                    onClick={() => showEditModal(todo)}
                  />
                  <DeleteOutlined
                    className="delete"
                    style={{ fontSize: "24px" }}
                    onClick={() => {
                      setLoading(true);
                      handleDelete(todo.id);
                    }}
                  />
                </div>
              </Card>
            ))}
          </Space>
          {error && <div style={{ textAlign: "center", color: "red", margin: 11 }}>Error: {error}</div>}
        </>
      )}
      <Pagination
        className={`page-${toggle}`}
        current={currentPage}
        pageSize={todosPerPage}
        total={totalPages * todosPerPage}
        showSizeChanger={true}
        pageSizeOptions={["5", "10", "15", "20", "25", "30", "40", "50", "100"]}
        onChange={handlePageChange}
        onShowSizeChange={( size) => {
          setTodosPerPage(size);
          setCurrentPage(1);
        }}
      />
      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        className={`modal${toggle === "dark" ? "dark" : "light"}`}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => onFinish(values)}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Completed" name="completed" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            {isLoading ? (
              <Button
                type="primary"
                loading
                className="edit-loading"
                onClick={handleOk}
              >
                Editing
              </Button>
            ) : (
              <Button type="primary" htmlType="submit" className="edit-btn">
                Edit
              </Button>
            )}
            <Button className="card-cancel" onClick={handleEditCancel}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Cards;
