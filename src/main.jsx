import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import appStore from "./store";

import { ThemeProvider } from "./components/common/ThemeProvider";

createRoot(document.getElementById("root")).render(
    <Provider store={appStore}>
        <ThemeProvider defaultTheme="dark" storageKey="devmate-theme">
            <App />
        </ThemeProvider>
    </Provider>
);


