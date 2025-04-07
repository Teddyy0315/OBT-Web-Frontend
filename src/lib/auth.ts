import Cookies from "js-cookie";

export async function validateToken(): Promise<{
  valid: boolean;
  username?: string;
  role?: string;
}> {
  const token = Cookies.get("access_token");
  if (!token) return { valid: false };

  try {
    const res = await fetch(
      "http://api.odensebartech.com/api/v1/auth/validate-token",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) throw new Error("Invalid token");

    const json = await res.json();
    return {
      valid: true,
      username: json.username,
      role: json.role,
    };
  } catch {
    return { valid: false };
  }
}
