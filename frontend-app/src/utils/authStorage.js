const API_URL = "http://localhost:5000/api";

const SESSION_KEY = "campus-os-session";
const USERS_KEY = "campus-os-users";

const defaultMockUsers = [
  { id: "usr-1", name: "Aarav Kumar", email: "aarav.k@campus.edu", role: "student", status: "active", createdAt: "2026-08-01" },
  { id: "usr-2", name: "Dr. K. Ramanathan", email: "ramanathan.k@campus.edu", role: "faculty", status: "active", createdAt: "2026-07-15" },
  { id: "usr-3", name: "Sneha Roy", email: "sneha.r@campus.edu", role: "student", status: "active", createdAt: "2026-08-05" },
  { id: "usr-4", name: "Suresh Kumar", email: "suresh.k@campus.edu", role: "security", status: "active", createdAt: "2026-06-20" },
  { id: "usr-5", name: "Ananya Sharma", email: "ananya.s@campus.edu", role: "student", status: "active", createdAt: "2026-08-10" },
  { id: "usr-6", name: "Campus Admin", email: "admin@campusbridge.com", role: "admin", status: "active", createdAt: "2026-01-01" }
];

function readUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) {
      window.localStorage.setItem(USERS_KEY, JSON.stringify(defaultMockUsers));
      return defaultMockUsers;
    }
    return JSON.parse(raw);
  } catch {
    return defaultMockUsers;
  }
}

export function getUsers() {
  return readUsers();
}

export function addUser(user) {
  const users = readUsers();
  const email = user.email.trim().toLowerCase();
  if (users.some((candidate) => candidate.email.toLowerCase() === email)) {
    return { error: "An account already exists for this email." };
  }

  const savedUser = {
    ...user,
    email,
    id: `${user.role || "user"}-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "active",
  };
  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, savedUser]));
  return { user: savedUser };
}

export function updateUser(userId, changes) {
  const users = readUsers();
  const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...changes } : user));
  window.localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  return updatedUsers.find((user) => user.id === userId) || null;
}

export function removeUser(userId) {
  const users = readUsers();
  const removedUser = users.find((user) => user.id === userId) || null;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users.filter((user) => user.id !== userId)));
  return removedUser;
}

function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,
    role: user.role?.toLowerCase(),
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

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

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
        registerNumber: user.registerNumber || undefined,
        studentRegisterNumber: user.studentRegisterNumber || undefined,
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

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));

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
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return normalizeUser(session?.user);
  } catch {
    return null;
  }
}

export function getToken() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.token || null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
