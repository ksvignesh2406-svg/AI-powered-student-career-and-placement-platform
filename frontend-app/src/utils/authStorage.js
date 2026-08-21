const USERS_KEY = "campus-os-users";
const SESSION_KEY = "campus-os-session";

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function registerUser(user) {
  const users = readUsers();
  const existingUser = users.find(
    (candidate) =>
      candidate.role === user.role &&
      candidate.email.toLowerCase() === user.email.toLowerCase()
  );

  if (existingUser) {
    return { error: "An account already exists for this email." };
  }

  const savedUser = {
    ...user,
    id: `${user.role}-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  window.localStorage.setItem(USERS_KEY, JSON.stringify([...users, savedUser]));
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(savedUser));
  return { user: savedUser };
}

export function signInUser(role, email, password) {
  const user = readUsers().find(
    (candidate) =>
      candidate.role === role &&
      candidate.email.toLowerCase() === email.toLowerCase() &&
      candidate.password === password
  );

  if (!user) {
    return { error: "We could not match those credentials to a registered account." };
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { user };
}

export function getSessionUser() {
  try {
    return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}
