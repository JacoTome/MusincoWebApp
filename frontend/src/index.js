import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import Profile from "./routes/Profile";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Chats from "./routes/Chats";
import { ChakraProvider } from "@chakra-ui/react";
import io from "socket.io-client";
const socket = io("http://localhost:3011", {
  autoConnect: false,
});

socket.onAny((event, ...args) => {
  console.log(event, args);
});
socket.on("session", ({ sessionID, userID }) => {
  console.log(sessionID, userID);
  socket.auth = { sessionID };
  localStorage.setItem("sessionID", sessionID);
  socket.userID = userID;
});
const router = createBrowserRouter([
  {
    path: "/signin",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/chat",
    element: <Chats />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <RouterProvider router={router} />
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export default socket;
