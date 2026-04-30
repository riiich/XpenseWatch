import { useReducer, useState } from "react";
import type { AuthView } from "../../types";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
	const { register, login, demo } = useAuth();
	const [errorMsg, setErrorMsg] = useState<string>("");
	const [userRegisterErrors, setUserRegisterErrors] = useState<string[]>([]);
	const [view, setView] = useState<AuthView>("login");
	const [isLoading, setIsLoading] = useState(true);

	// login/signIn credentials
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [loginUsername, setLoginUsername] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [registerUsername, setRegisterUsername] = useState("");
	const [registerPassword, setRegisterPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const inputCls =
		"w-full px-4 py-3 rounded-xl bg-[#060c14] text-slate-100 border border-[#1e293b] text-[12px] " +
		"focus:border-amber-400/50 focus:outline-none transition-colors placeholder:text-slate-600";

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();

		setIsLoading(true);

		if (registerPassword !== confirmPassword) {
			alert("Please confirm that your passwords match!");
			return;
		}

		const res = await register(firstName, lastName, email, registerUsername, registerPassword);
		console.log("res: ", res);

		if (!res.isSuccess) {
			if (res.data.length > 0) setUserRegisterErrors([...userRegisterErrors, ...res.errors]);

			setErrorMsg(res.errorMsg);
		}

		console.log("res in AuthPage: ", res);

		setIsLoading(false);

		// once registered, move over to the login tab
		if (res.status === 201) {
			setView("login");
			return;
		}
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault(); // prevents page from refreshing when button is clicked

		setIsLoading(true);

		const res = await login(loginUsername, loginPassword);

		if (!res.isSuccess) {
			setErrorMsg(res.errorMsg);
		}

		setIsLoading(false);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_30%_20%,_#0f1e35_0%,_#060c14_60%)]">
			<div className="bg-[#0a1422] border border-[#1e293b] rounded-3xl p-11 w-96 animate-fade-in">
				{/* Logo */}
				<div className="font-display text-[28px] font-semibold text-amber-400 tracking-wide mb-2">
					◈ XpenseWatch
				</div>
				<p className="text-[12px] text-slate-500 tracking-wide mb-8">Your finances, tracked.</p>

				{/* Tabs */}
				<div className="flex gap-1 bg-[#060c14] rounded-xl p-1 mb-6">
					{(["login", "signup"] as AuthView[]).map((v) => (
						<button
							key={v}
							onClick={() => setView(v)}
							className={`flex-1 py-2.5 rounded-lg text-[11px] tracking-wide transition-colors ${
								view === v
									? "bg-[#111d2e] text-amber-400"
									: "text-slate-500 hover:text-slate-300"
							}`}
						>
							{v === "login" ? "Sign In" : "Create Account"}
						</button>
					))}
				</div>

				{/* Form */}
				<p className="text-xs text-red-400">{errorMsg}</p>
				<>
					{userRegisterErrors.length > 0
						? userRegisterErrors.map((e, i) => (
								<p className="text-xs text-red-400" key={i}>
									{e}
								</p>
							))
						: ""}
				</>

				<div className="flex flex-col gap-3">
					{/* register */}
					{view === "signup" ? (
						<>
							<input
								className={inputCls}
								type="text"
								value={firstName}
								placeholder="First Name"
								onChange={(e) => {
									setFirstName(e.target.value);
								}}
							/>
							<input
								className={inputCls}
								type="text"
								value={lastName}
								placeholder="Last Name"
								onChange={(e) => {
									setLastName(e.target.value);
								}}
							/>
							<input
								className={inputCls}
								type="email"
								value={email}
								placeholder="Email address"
								onChange={(e) => {
									setEmail(e.target.value);
									setErrorMsg("");
								}}
							/>
							<input
								className={inputCls}
								type="text"
								value={registerUsername}
								placeholder="Username"
								onChange={(e) => {
									setRegisterUsername(e.target.value);
								}}
							/>
							<input
								className={inputCls}
								type="password"
								value={registerPassword}
								placeholder="Password"
								onChange={(e) => {
									setRegisterPassword(e.target.value);
								}}
							/>
							{/* {view === "signup" && ( */}
							<input
								className={inputCls}
								type="password"
								value={confirmPassword}
								placeholder="Confirm password"
								onChange={(e) => {
									setConfirmPassword(e.target.value);
								}}
							/>
						</>
					) : (
						<>
							{/* login */}
							<input
								className={inputCls}
								type="text"
								value={loginUsername}
								placeholder="Username"
								onChange={(e) => {
									setLoginUsername(e.target.value);
								}}
							/>
							<input
								className={inputCls}
								type="password"
								value={loginPassword}
								placeholder="Password"
								onChange={(e) => {
									setLoginPassword(e.target.value);
								}}
							/>
						</>
					)}

					<button
						onClick={view === "login" ? handleLogin : handleRegister}
						className="w-full py-3 rounded-xl bg-amber-400 text-[#060c14] text-[12px] font-medium tracking-wide mt-1 hover:bg-amber-300 transition-colors active:text-[11px]"
					>
						{view === "login" ? "Sign In" : "Create Account"}
					</button>
				</div>

				{/* Demo shortcut */}
				<p
					onClick={demo}
					className="text-center text-[11px] text-slate-500 mt-5 cursor-pointer tracking-wide hover:text-slate-400 transition-colors"
				>
					Continue with demo →
				</p>
			</div>
		</div>
	);
}
