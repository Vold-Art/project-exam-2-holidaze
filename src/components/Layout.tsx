import { Link, Outlet } from "react-router-dom";

function Layout() {
	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<Link to="/" className="text-xl font-bold">
						Holidaze
					</Link>

					<nav className="flex gap-4 text-sm">
						<Link to="/">Home</Link>
						<Link to="/login">Login</Link>
						<Link to="/profile">Profile</Link>
						<Link to="/register">Register</Link>
					</nav>
				</div>
			</header>

			<main className="mx-auto max-w-6xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	);
}

export default Layout;
