import { Link, Outlet } from "react-router-dom";

function Layout() {
	const user = localStorage.getItem("user");
	const parsedUser = user ? JSON.parse(user) : null;

	return (
		<div className="min-h-screen bg-gray-50 text-gray-900">
			<header className="border-b bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<Link to="/" className="text-xl font-bold">
						Holidaze
					</Link>

					<nav className="flex gap-4 text-sm">
						<Link to="/">Home</Link>

						{parsedUser ? (
							<>
								<span className="text-gray-500">{parsedUser?.name}</span>

								<Link to="/profile">Profile</Link>

								<button
									onClick={() => {
										localStorage.removeItem("user");
										window.location.reload();
									}}
								>
									Logout
								</button>
							</>
						) : (
							<>
								<Link to="/login">Login</Link>
								<Link to="/register">Register</Link>
							</>
						)}
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
