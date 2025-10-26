import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const USERS = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "hruser", password: "user123", role: "hr" }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const validUser = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (validUser) {
      const userData = { username: validUser.username, role: validUser.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
