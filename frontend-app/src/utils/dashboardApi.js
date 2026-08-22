import { clearSession, getToken } from "./authStorage";

const API_URL = "http://localhost:5000/api";

export async function fetchDashboard(role) {
    const token = getToken();

    if (!token) {
        return {
            error: "Please sign in again."
        };
    }

    try {
        const response = await fetch(`${API_URL}/dashboard/${role}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            clearSession();
        }

        if (!response.ok) {
            return {
                error: data.message || "Unable to load dashboard."
            };
        }

        return data;
    } catch (error) {
        console.error("Dashboard load error:", error);

        return {
            error: "Unable to connect to the backend."
        };
    }
}

export async function fetchAdminUsers({ search = "", role = "ALL" } = {}) {
    const token = getToken();

    if (!token) {
        return { error: "Please sign in again." };
    }

    try {
        const queryParams = new URLSearchParams();
        if (search) queryParams.append("search", search);
        if (role && role !== "ALL") queryParams.append("role", role);

        const response = await fetch(`${API_URL}/admin/users?${queryParams.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.status === 401) {
            clearSession();
        }

        if (!response.ok) {
            return { error: data.message || "Failed to fetch users" };
        }

        return data;
    } catch (error) {
        console.error("Fetch users error:", error);
        return { error: "Unable to connect to the backend." };
    }
}

export async function createAdminUser(userData) {
    const token = getToken();

    if (!token) {
        return { error: "Please sign in again." };
    }

    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Failed to create user" };
        }

        return data;
    } catch (error) {
        console.error("Create user error:", error);
        return { error: "Unable to connect to the backend." };
    }
}

export async function toggleUserStatus(userId, isActive) {
    const token = getToken();

    if (!token) {
        return { error: "Please sign in again." };
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ isActive })
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Failed to update user status" };
        }

        return data;
    } catch (error) {
        console.error("Toggle user status error:", error);
        return { error: "Unable to connect to the backend." };
    }
}

export async function deleteAdminUser(userId) {
    const token = getToken();

    if (!token) {
        return { error: "Please sign in again." };
    }

    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "Failed to delete user" };
        }

        return data;
    } catch (error) {
        console.error("Delete user error:", error);
        return { error: "Unable to connect to the backend." };
    }
}

export async function askCampusAI(message, context = {}) {
    const token = getToken();

    if (!token) {
        return {
            error: "Please sign in again."
        };
    }

    try {
        const response = await fetch(`${API_URL}/ai/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                message,
                context
            })
        });

        const data = await response.json();

        if (response.status === 401) {
            clearSession();
        }

        if (!response.ok) {
            return {
                error: data.message || "AI request failed."
            };
        }

        return data;

    } catch (error) {
        console.error("Campus AI error:", error);

        return {
            error: "Unable to connect to Campus AI."
        };
    }
}
