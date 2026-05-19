import { Link, Outlet } from "react-router-dom";
import holidazeLogo from "../assets/holidaze-logo.png";
import Button from "./Button";

function Layout() {
	const storedUser = localStorage.getItem("user");
	const parsedUser = storedUser ? JSON.parse(storedUser) : null;

	function handleLogout() {
		localStorage.removeItem("user");
		window.location.href = "/";
	}

	return (
		<div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
			<header className="bg-white">
				<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
					<Link
						to="/"
						aria-label="Go to homepage"
						className="flex items-center gap-3"
					>
						<img src={holidazeLogo} alt="" className="h-12 w-auto md:h-18" />

						<span className="leading-none text-3xl font-light tracking-wide text-[var(--color-brand-primary)] md:text-5xl">
							HOLIDAZE
						</span>
					</Link>

					<nav className="flex items-center gap-3 text-sm">
						{parsedUser ? (
							<>
								<Link to="/profile">
									<Button variant="primary" className="px-4 py-2">
										Profile
									</Button>
								</Link>

								{parsedUser.venueManager && (
									<Link to="/manager">
										<Button variant="accent" className="px-4 py-2">
											Manager
										</Button>
									</Link>
								)}

								<Button
									type="button"
									variant="accent"
									onClick={handleLogout}
									className="px-4 py-2"
								>
									Logout
								</Button>
							</>
						) : (
							<>
								<Link to="/login">
									<Button variant="accent" className="px-4 py-2">
										Login
									</Button>
								</Link>

								<Link to="/register">
									<Button variant="primary" className="px-4 py-2">
										Register
									</Button>
								</Link>
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
