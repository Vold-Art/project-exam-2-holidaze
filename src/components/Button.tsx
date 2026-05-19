type ButtonProps = {
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	disabled?: boolean;
	variant?: "primary" | "accent" | "danger" | "secondary";
	className?: string;
};

function Button({
	children,
	type = "button",
	onClick,
	disabled = false,
	variant = "primary",
	className = "",
}: ButtonProps) {
	const baseClasses =
		"rounded-lg px-5 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

	const variantClasses = {
		primary:
			"bg-[var(--color-brand-primary)] text-white hover:bg-[var(--color-brand-hover)]",
		accent:
			"bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]",
		danger: "bg-red-600 text-white hover:bg-red-700",
		secondary:
			"border border-[var(--color-text-secondary)] text-[var(--color-text-primary)] hover:bg-gray-100",
	};

	return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled}
			className={`${baseClasses} ${variantClasses[variant]} ${className}`}
		>
			{children}
		</button>
	);
}

export default Button;
