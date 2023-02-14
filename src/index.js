import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { worker } from "@uidotdev/react-query-api";
import "./theme.css";
import "./styles.css";
import App from "./App";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const queryClient = new QueryClient();

worker
  .start({
    quiet: true,
    onUnhandledRequest: "bypass"
  })
  .then(() =>
    fetch("/api/status")
      .then((res) => res.json())
      .catch(() => null)
  )
  .then((res) => {
    if (res?.status !== "ok") {
      window.location.reload();
    }
  })
  .then(() => {
    root.render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <div className="yellow-border" />
          <div className="wrapper">
            <div className="container-outer">
              <div className="container">
                <App />
              </div>
            </div>
            <ReactQueryDevtools initialIsOpen={true} />
          </div>
        </QueryClientProvider>
      </React.StrictMode>
    );
  });
