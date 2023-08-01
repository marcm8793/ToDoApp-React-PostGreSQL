import { useEffect, useState } from "react";
import Listheader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const authToken = cookies.AuthToken;
  const userEmail = cookies.Email;
  const [tasks, setTasks] = useState(null);

  //!Get all the todos for the connected user
  const getData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVURL}/todos/${userEmail}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  //!If user is logged in, display the todos
  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);
  console.log(tasks);

  //!Sort by date; le ?: if there are some tasks
  const sortedTasks = tasks?.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <>
      <div className="app">
        {!authToken && <Auth />}
        {authToken && (
          <>
            <Listheader listName={"Holiday Tick list"} getData={getData} />

            {/* Display the user on the page */}
            <p className="user-email">Welcome back {userEmail}</p>

            {sortedTasks?.map((task) => (
              <ListItem key={task.id} task={task} getData={getData} />
            ))}
          </>
        )}
        <p className="copyright">Creative Coding LLC</p>
      </div>
    </>
  );
};

export default App;
