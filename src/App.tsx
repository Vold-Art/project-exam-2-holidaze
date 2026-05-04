import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/venue/:id" element={<Venue />} />
			<Route path="/login" element={<Login />} />
			<Route path="/profile" element={<Profile />} />
		</Routes>
	);
}

export default App;
