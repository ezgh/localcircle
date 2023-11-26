const baseUrl = import.meta.env.VITE_BASE_URL;
const authUrl = `${baseUrl}/auth`;

//login
export async function loginUser(email: string, password: string) {
    const response = await fetch(`${authUrl}/jwt/create/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json()
      console.log(errorData)
      throw new Error(errorData.detail)
    }
  }

  
  
  //register
  export async function registerUser(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    re_password: string,
  ) {
    console.log(JSON.stringify({ first_name, last_name, email, password, re_password, }));
  
    const response = await fetch(`${authUrl}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name,
        last_name,
        email,
        password,
        re_password,
        
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      const errorData = await response.json()
      console.log(errorData)
      throw new Error(errorData.email)
    }
  }
  
  //activate user
  export async function activateUser(
    uid: string | undefined,
    token: string | undefined
  ) {
    const response = await fetch(`${authUrl}/users/activation/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        token,
      }),
    });
  
    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json().catch((error) => {
        console.error("Failed to parse JSON in error response:", error);
      });
      throw new Error("User activation failed: " + JSON.stringify(errorData));
    }
  }
  
  //reset password
  export async function resetPassword(
    uid: string | undefined,
    token: string | undefined,
    new_password: string,
    re_new_password: string
  ) {
    const response = await fetch(
      `${authUrl}/users/reset_password_confirm/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          token,
          new_password,
          re_new_password,
        }),
      }
    );
  
    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json().catch((error) => {
        console.error("Failed to parse JSON in error response:", error);
      });
      throw new Error("Password reset failed: " + JSON.stringify(errorData));
    }
  }
  
  //send reset password request
  export async function resetPasswordRequest(email: string) {
    const response = await fetch(
      `${authUrl}/users/reset_password/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
        }),
      }
    );
  
    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json().catch((error) => {
        console.error("Failed to parse JSON in error response:", error);
      });
      throw new Error(
        "Password reset request failed: " + JSON.stringify(errorData)
      );
    }
  }
