export const checkTokenExpiry = (token: string): { isExpired: boolean; expirationTime: number } => {
	if (!token) return { isExpired: true, expirationTime: 0 };

	try {
		const base64Url = token.split(".")[1];
		const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

		const jsonPayload = JSON.parse(atob(base64));

		const { exp } = jsonPayload;

		const currTime = Math.floor(Date.now() / 1000);

		return { isExpired: exp < currTime, expirationTime: (exp - currTime) * 1000 };
	} catch (e) {
		console.error(e);
		return { isExpired: true, expirationTime: 0 };
	}
};
