import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Manager from "./pages/Manager";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/venue/:id" element={<Venue />} />
				<Route path="/login" element={<Login />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/register" element={<Register />} />
				<Route path="/manager" element={<Manager />} />
			</Route>
		</Routes>
	);
}

export default App;
