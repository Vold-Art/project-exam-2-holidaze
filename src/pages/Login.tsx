import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

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

			window.location.href = "/profile";
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
		<section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
			<h1 className="text-2xl font-bold">Login</h1>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label className="block text-sm font-medium">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-lg bg-gray-900 px-4 py-3 text-white"
				>
					{isLoading ? "Logging in..." : "Login"}
				</button>
			</form>

			{message && <p className="mt-4 text-sm">{message}</p>}
		</section>
	);
}

export default Login;
