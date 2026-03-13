"use client";

import { createClient } from "@repo/auth/client";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignUpProps = {
	i18n?: {
		namePlaceholder?: string;
		emailPlaceholder?: string;
		passwordPlaceholder?: string;
		confirmPasswordPlaceholder?: string;
		signUpButton?: string;
		signingUpButton?: string;
		passwordNotMatchError?: string;
		passwordMinLengthError?: string;
	};
};
export const SignUp = (props: SignUpProps) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const supabase = createClient();
	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		// native validation for password match and length
		if (password !== confirmPassword) {
			setError(props.i18n?.passwordNotMatchError || "Passwords do not match");
			setLoading(false);
		}
		if (password.length < 6) {
			setError(
				props.i18n?.passwordMinLengthError ||
				"Password must be at least 6 characters",
			);
			setLoading(false);
		}
		const { error: loginError } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					name,
				},
			},
		});
		if (loginError) {
			setError(loginError.message);
			setLoading(false);
		} else {
			router.push("/verify-email");
			router.refresh();
		}
	};

	return (
		<form onSubmit={handleSignUp}>
			{error && <div className="text-red-500">{error}</div>}
			<Input
				onChange={(e) => setName(e.target.value)}
				placeholder={props.i18n?.namePlaceholder || "Name"}
				required
				type="text"
				value={name}
			/>
			<Input
				onChange={(e) => setEmail(e.target.value)}
				placeholder={props.i18n?.emailPlaceholder || "Email"}
				required
				type="email"
				value={email}
			/>
			<Input
				minLength={6}
				onChange={(e) => setPassword(e.target.value)}
				placeholder={props.i18n?.passwordPlaceholder || "Password"}
				required
				type="password"
				value={password}
			/>
			<Input
				minLength={6}
				onChange={(e) => setConfirmPassword(e.target.value)}
				placeholder={
					props.i18n?.confirmPasswordPlaceholder || "Confirm Password"
				}
				required
				type="password"
				value={confirmPassword}
			/>
			<Button isPending={loading} type="submit">
				{props.i18n?.signUpButton || "Sign Up"}
			</Button>
		</form>
	);
};
