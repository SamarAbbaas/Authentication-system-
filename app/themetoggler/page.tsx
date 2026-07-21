"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
	if (typeof window === "undefined") return "light";
	const saved = localStorage.getItem("theme");
	if (saved === "light" || saved === "dark") return saved;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("light");
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const initial = getInitialTheme();
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setTheme(initial);
		document.documentElement.classList.toggle("dark", initial === "dark");
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const nextTheme: Theme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		localStorage.setItem("theme", nextTheme);
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
	};

	if (!mounted) {
		return (
			<button
				type="button"
				className="rounded-md border px-3 py-2 text-sm"
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
			className="rounded-md border px-3 py-2 text-sm text-muted-foreground"
			aria-label="Toggle theme"
		>
			{theme === "dark" ? <Icon icon="iconoir:sun-light" width="24" height="24" /> : <Icon icon="solar:moon-linear" width="24" height="24" />}
		</button>
	);
}