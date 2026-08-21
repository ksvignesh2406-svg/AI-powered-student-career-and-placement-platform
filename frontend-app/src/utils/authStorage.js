const API_URL = "http://localhost:5000/api";

const SESSION_KEY = "campus-os-session";

function normalizeUser(user) {
    if (!user) return null;

    let role = user.role?.toLowerCase();
    if (role === "placement_officer") {
        role = "placement";
    }

    return {
        ...user,
        role
    };
}

export async function signInUser(role, identifier, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier,
                password,
                role: role.toUpperCase(),
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message || "Login failed",
            };
        }

        const session = {
            token: data.token,
            user: normalizeUser(data.user),
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );

        return {
            user: session.user,
            token: data.token,
        };

    } catch (error) {
        console.error("Login error:", error);

        return {
            error: "Unable to connect to the backend.",
        };
    }
}


export async function registerUser(user) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: user.name,
                email: user.email,
                password: user.password,
                role: user.role.toUpperCase(),
                department: user.department || undefined,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                error: data.message || "Registration failed",
            };
        }

        const session = {
            token: data.token,
            user: normalizeUser(data.user),
        };

        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(session)
        );

        return {
            user: session.user,
            token: data.token,
        };

    } catch (error) {
        console.error("Registration error:", error);

        return {
            error: "Unable to connect to the backend.",
        };
    }
}


export function getSessionUser() {
    try {
        const session = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );

        return normalizeUser(session?.user);

    } catch {
        return null;
    }
}


export function getToken() {
    try {
        const session = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );

        return session?.token || null;

    } catch {
        return null;
    }
}


export function clearSession() {
    localStorage.removeItem(SESSION_KEY);
}
