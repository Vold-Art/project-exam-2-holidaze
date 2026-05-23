import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setIsLoading(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/auth/login?_holidaze=true`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email,
						password,
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.errors?.[0]?.message || "Login failed");
			}

			localStorage.setItem("user", JSON.stringify(result.data));
			navigate("/profile");
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Something went wrong during login.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="mx-auto max-w-md rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-6 shadow-lg">
			<h1 className="text-3xl font-normal text-[var(--color-brand-primary)]">
				Login
			</h1>

			<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
				Log in to book venues and manage your profile.
			</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="email" className="block text-sm font-normal">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-normal">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? "Logging in..." : "Login"}
				</Button>
			</form>

			{message && (
				<p className="mt-4 text-sm text-[var(--color-brand-primary)]">
					{message}
				</p>
			)}

			<p className="mt-6 text-sm text-[var(--color-text-secondary)]">
				No account yet?{" "}
				<Link
					to="/register"
					className="font-normal text-[var(--color-brand-primary)] underline"
				>
					Register here
				</Link>
			</p>
		</section>
	);
}

export default Login;
