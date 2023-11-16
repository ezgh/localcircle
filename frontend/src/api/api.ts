// get listings
export async function getListings(
  accessToken: string | undefined,
  url: string,
  categoryId: string
) {
  const urlObj = new URL(url);
  urlObj.searchParams.append("categoryId", categoryId);
  const response = await fetch(urlObj.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching listings");
  }
}

// get listings by id
export async function getListingById(
  accessToken: string | undefined,
  id: string | undefined
) {
  const response = await fetch(`http://127.0.0.1:8000/api/listings/${id}/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching listing");
  }
}

//create listing
export async function createListing(accessToken: string | undefined, formData: FormData) {
  const response = await fetch("http://127.0.0.1:8000/api/listings/", {
    method: "POST",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json().catch((error) => {
      console.error("Failed to parse JSON in error response:", error);
    });
    throw new Error("Error creating listing: " + JSON.stringify(errorData));
  }
}

//update listing
export async function updateListing(accessToken: string | undefined, formData: FormData, id: string | undefined) {
  const response = await fetch(`http://127.0.0.1:8000/api/listings/${id}/`, {
    method: "PATCH",
    headers: {
      Authorization: `JWT ${accessToken}`,
    },
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    const errorData = await response.json().catch((error) => {
      console.error("Failed to parse JSON in error response:", error);
    });
    throw new Error("Error updating listing: " + JSON.stringify(errorData));
  }
}



//delete a listing
export async function deleteListing(accessToken: string | undefined, listingId: number): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      return Promise.resolve();
    } else {
      return Promise.reject("Failed to delete the listing.");
    }
  } catch (error) {
    console.error("Error deleting listing:", error);
    return Promise.reject("Failed to delete the listing.");
  }
}


// get categories
export async function getCategories(accessToken: string | undefined) {
  const response = await fetch("http://127.0.0.1:8000/api/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.results;
}

// get areas 
export async function getAreas(accessToken: string | undefined) {
  const response = await fetch("http://127.0.0.1:8000/api/areas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });
  const data = await response.json();
  return data.results;
}



// get user info with the given id
export async function getUserInfo(
  accessToken: string | undefined,
  userId: string | undefined
) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/user_info/${userId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching user info");
  }
}

// get authenticated user info
export async function getAuthenticatedUser(accessToken: string | undefined) {
  const response = await fetch(`http://127.0.0.1:8000/auth/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}

// get listings with the given userid
export async function getUserListings(
  accessToken: string | undefined,
  userId: string | undefined
) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/user_listings/${userId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching user listings");
  }
}


//toggle bookmark
export const toggleBookmark = async (
  listingId: number,
  authUserId: number | null,
  accessToken: string | undefined,
  isBookmarked: boolean
) => {
  try {
    if (isBookmarked) {
      await fetch(`http://127.0.0.1:8000/api/bookmarks/listing/${listingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: authUserId }),
      });
    } else {
      await fetch("http://127.0.0.1:8000/api/bookmarks/", {
        method: "POST",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listing: listingId, user: authUserId }),
      });
    }
    return true; 
    console.log("deleted")
  } catch (error) {
    console.error("Error:", error);
    return false; 
  }
};

// get all bookmarks with the auth user id
export async function getUserBookmarks(
  accessToken: string | undefined,
  authUserId: number | null
) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/bookmarks/user/${authUserId}/`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    }
  );
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching user listings");
  }
}


////// MESSAGES ////////


// get messages
export async function getMessages(
  accessToken: string | undefined,
  authUserId: string ,
) {
  const response = await fetch(
    `http://127.0.0.1:8000/api/my-messages/${authUserId}/`,
    {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error("Error fetching messages");
  }
}





/////////// AUTH ///////////

//login
export async function loginUser(email: string, password: string) {
  const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
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

  const response = await fetch("http://127.0.0.1:8000/auth/users/", {
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
    const errorData = await response.json().catch((error) => {
      console.error("Failed to parse JSON in error response:", error);
    });
    throw new Error("User registration failed: " + JSON.stringify(errorData));
  }
}

//activate user
export async function activateUser(
  uid: string | undefined,
  token: string | undefined
) {
  const response = await fetch("http://127.0.0.1:8000/auth/users/activation/", {
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
    "http://127.0.0.1:8000/auth/users/reset_password_confirm/",
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
    "http://127.0.0.1:8000/auth/users/reset_password/",
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

//delete user
export async function deleteUser(accessToken: string | undefined, authUser:number): Promise<void> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/user_info/${authUser}`, {
      method: "DELETE",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },   });

    if (response.status === 204) {
      return Promise.resolve();
    } else {
      return Promise.reject("Failed to delete the user.");
    }
  } catch (error) {
    console.error("Error deleting listing:", error);
    return Promise.reject("Failed to delete the user.");
  }
}