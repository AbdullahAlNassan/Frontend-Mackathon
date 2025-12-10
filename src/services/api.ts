// Dit is de URL van je backend
const API_URL = "http://localhost:3000/api/v1";

export const authApi = {
  // Login functie - stuurt email + wachtwoord naar backend
  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login mislukt");
    }

    return response.json(); // { token, user }
  },

  async logout() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Geen token gevonden");
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Logout mislukt");
    }

    // token verwijderen uit storage
    localStorage.removeItem("accessToken");

    return response.json();
  },
};
