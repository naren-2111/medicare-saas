import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import api from "../api/axiosClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // profile row incl. role
  const [loading, setLoading] = useState(true);

  async function loadProfile() {
    const { data } = await supabase.auth.getSession();
    if (!data?.session) {
      setUser(null);
      setLoading(false);
      return;
    }
    // Decode role/profile via backend login response is not persisted,
    // so we fetch from supabase directly using the session user id.
    const { data: profile } = await supabase
      .from("users")
      .select("*, roles(name)")
      .eq("id", data.session.user.id)
      .single();
    setUser(profile ? { ...profile, role: profile.roles.name } : null);
    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
    const { data: listener } = supabase.auth.onAuthStateChange(() => loadProfile());
    return () => listener.subscription.unsubscribe();
  }, []);

  // Uses the backend /api/auth/login route, then sets the Supabase
  // client session manually so subsequent calls (RLS reads) work too.
  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    await supabase.auth.setSession({
      access_token: res.data.access_token,
      refresh_token: res.data.refresh_token,
    });
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    await api.post("/auth/register", payload);
    return login(payload.email, payload.password);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
