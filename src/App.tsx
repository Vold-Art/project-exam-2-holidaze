import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/venue/:id" element={<Venue />} />
				<Route path="/login" element={<Login />} />
				<Route path="/profile" element={<Profile />} />
			</Route>
		</Routes>
	);
}

export default App;
