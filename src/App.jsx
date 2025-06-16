import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/store";
import Feed from "./components/Feed";
import Body from "./components/Body";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Premium from "./components/Premium";
import Chat from "./components/Chat";
import CompleteProfile from "./components/CompleteProfile";
import Landing from "./components/Landing";
import Landing from "./components/Landing";

function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          
          <Route path="/app" element={<Body />}>
            <Route index element={<Feed />} /> {/* Default route for /app */}
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requests" element={<Requests />} />
            <Route path="premium" element={<Premium />} />
            <Route path="chat/:targetUserId" element={<Chat />} />
            <Route path="complete-profile" element={<CompleteProfile />} />
          </Route>
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;