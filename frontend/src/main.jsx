import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { ChatProvider } from "./Context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider value={defaultSystem}>
          <App />
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>,
);
