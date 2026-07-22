"use client";

import { Icon } from "@iconify/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	if (!mounted) {
		return (
			<button
				type="button"
				className="inline-flex items-center justify-center rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground shadow-sm"
				aria-label="Toggle theme"
			>
				Theme
			</button>
		);
	}

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="inline-flex size-10 items-center justify-center rounded-md border bg-background text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
			aria-label="Toggle theme"
		>
			{theme === "dark" ? <Icon icon="iconoir:sun-light" width="24" height="24" /> : <Icon icon="solar:moon-linear" width="24" height="24" />}
		</button>
	);
}