import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import UserProvider from "@/components/UserProvider";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Sapato Fácil",
	description: "Front-end do site Sapato Fácil",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
			>
				<UserProvider />
				<main className="flex-1">
					{children}
				</main>
				<footer className="text-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
					<p>© 2024 Sapato Fácil</p>
				</footer>
			</body>
		</html>
	);
}
