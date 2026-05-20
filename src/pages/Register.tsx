import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";

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
		<section className="mx-auto max-w-md rounded-2xl border-2 border-[var(--color-brand-primary)] bg-white p-6 shadow-lg">
			<h1 className="text-3xl font-normal text-[var(--color-brand-primary)]">
				Register
			</h1>

			<p className="mt-2 text-sm text-[var(--color-text-secondary)]">
				Create an account to start booking venues or managing your own listings.
			</p>

			<form onSubmit={handleSubmit} className="mt-6 space-y-4">
				<div>
					<label htmlFor="name" className="block text-sm font-normal">
						Username
					</label>
					<input
						id="name"
						type="text"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

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
						pattern="^[\w\-.]+@stud\.noroff\.no$"
						title="Please use a stud.noroff.no email address"
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
						minLength={8}
						className="mt-1 w-full rounded-lg border px-4 py-3"
					/>
				</div>

				<label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
					<input
						type="checkbox"
						checked={venueManager}
						onChange={(event) => setVenueManager(event.target.checked)}
					/>
					Register as venue manager
				</label>

				<Button type="submit" disabled={isLoading} className="w-full">
					{isLoading ? "Registering..." : "Register"}
				</Button>
			</form>

			{message && (
				<p className="mt-4 text-sm text-[var(--color-brand-primary)]">
					{message}
				</p>
			)}

			<p className="mt-6 text-sm text-[var(--color-text-secondary)]">
				Already have an account?{" "}
				<Link
					to="/login"
					className="font-normal text-[var(--color-brand-primary)] underline"
				>
					Log in here
				</Link>
			</p>
		</section>
	);
}

export default Register;
