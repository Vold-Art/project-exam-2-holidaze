import { useState } from "react";

function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [venueManager, setVenueManager] = useState(false);
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setMessage("");
		setIsLoading(true);

		try {
			const response = await fetch(
				`${import.meta.env.VITE_API_BASE_URL}/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name,
						email,
						password,
						venueManager,
					}),
				},
			);

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.errors?.[0]?.message || "Registration failed");
			}

			setMessage("Registration successful. You can now log in.");
			setName("");
			setEmail("");
			setPassword("");
			setVenueManager(false);
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: "Something went wrong during registration.",
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow">
			<h1 className="text-2xl font-bold">Register</h1>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-medium">
						Username
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="email" className="block text-sm font-medium">
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						required
						pattern="^[\w\-.]+@stud\.noroff\.no$"
						title="Please use a stud.noroff.no email address"
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<div>
					<label htmlFor="password" className="block text-sm font-medium">
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(event) => setPassword(event.target.value)}
						required
						minLength={8}
						className="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>

				<label className="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={venueManager}
						onChange={(event) => setVenueManager(event.target.checked)}
					/>
					Register as venue manager
				</label>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full rounded-lg bg-gray-900 px-4 py-3 text-white hover:bg-gray-700 disabled:bg-gray-400"
				>
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>

			{message && <p className="mt-4 text-sm">{message}</p>}
		</section>
	);
}

export default Register;
