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
import { ChakraProvider, defineStyleConfig } from "@chakra-ui/react";

import io from "socket.io-client";
import { extendTheme } from "@chakra-ui/react";
import Setting from "./routes/Setting";

const Button = defineStyleConfig({
  baseStyle: {
    backgroundColor: "#b4656f",
    _hover: {
      bg: "#B4656F",
      color: "white",
    },
  },
  sizes: {
    sm: {
      fontSize: "12px",
      padding: "4",
    },
    md: {
      fontSize: "16px",
      padding: "4",
    },
    lg: {
      fontSize: "20px",
      padding: "4",
    },
  },
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "#EF767A",
      color: "#b4656f",
    },
    solid: {
      bg: "#b4656f",
      color: "#FBFAF5",
      _hover: {
        bg: "#EF767A",
        color: "#FBFAF5",
      },
    },
  },
  defaultProps: {
    size: "md",
    variant: "solid",
  },
});

const Heading = defineStyleConfig({
  sizes: {
    sm: {
      fontSize: "14px",
    },
    md: {
      fontSize: "18px",
    },
    lg: {
      fontSize: "20px",
    },
  },
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "#EF767A",
      color: "#b4656f",
    },
    solid: {
      bg: "#b4656f",
      color: "#1D2A35",
    },
  },
});

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: "Poppins",
        bg: "#FBFAF5",
        color: "#EF767A",
      },
      h2: {
        color: "#1D2A35",
      },
      h3: {
        color: "#1D2A35",
      },
      p: {
        color: "#1D2A35",
      },
      a: {
        color: "#B4656F",
      },
    },
  },
  components: {
    Container: {
      baseStyle: {
        padding: "4",
      },
      borderRadius: "lg",
    },

    Tag: {
      baseStyle: {
        bg: "#B4656F",
        color: "#FBFAF5",
        _hover: {
          bg: "#EF767A",
          color: "#FBFAF5",
        },
      },
      sizes: {
        sm: {
          fontSize: "12px",
          padding: "4",
        },
        md: {
          fontSize: "16px",
          padding: "4",
        },
        lg: {
          fontSize: "20px",
          padding: "4",
        },
      },

      variants: {
        solid: {
          bg: "#B4656F",
          color: "#FBFAF5",
          _hover: {
            bg: "#EF767A",
            color: "#FBFAF5",
          },
        },
      },
      defaultProps: {
        size: "md",
        variant: "solid",
      },
    },
    Button,
    Heading,
  },
});

// SOCKET IO
const socket = io("http://localhost:3011", {
  autoConnect: false,
});
socket.onAny((event, ...args) => {
  console.log(event, args);
});
socket.on("session", ({ sessionID, userID }) => {
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
    path: "/settings",
    element: <Setting />,
  },

  {
    path: "/chat",
    element: <Chats />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export default socket;
