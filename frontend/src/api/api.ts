const baseUrl = import.meta.env.VITE_BASE_URL;
const apiUrl = `${baseUrl}/api`;
const authUrl = `${baseUrl}/auth`;



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
  const response = await fetch(`${apiUrl}/listings/${id}/`, {
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
  const response = await fetch(`${apiUrl}/listings/`, {
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
  const response = await fetch(`${apiUrl}/listings/${id}/`, {
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
    const response = await fetch(`${apiUrl}/listings/${listingId}`, {
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
  const response = await fetch(`${apiUrl}/categories`, {
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
  const response = await fetch(`${apiUrl}/areas`, {
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
    `${apiUrl}/user_info/${userId}/`,
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
  const response = await fetch(`${authUrl}/users/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
}



//delete user
export async function deleteUser(accessToken: string | undefined, authUser:number): Promise<void> {
  try {
    const response = await fetch(`${apiUrl}/user_info/${authUser}`, {
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

// get listings with the given userid
export async function getUserListings(
  accessToken: string | undefined,
  userId: string | undefined
) {
  const response = await fetch(
    `${apiUrl}/user_listings/${userId}/`,
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
      await fetch(`${apiUrl}/bookmarks/listing/${listingId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `JWT ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: authUserId }),
      });
    } else {
      await fetch(`${apiUrl}/bookmarks/`, {
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
    `${apiUrl}/bookmarks/user/${authUserId}/`,
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
  userId: string ,
) {
  const response = await fetch(
    `${apiUrl}/my-messages/${userId}/`,
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

// get messages between selected user
export async function getMessagesWithSelectedUser(
  accessToken: string | undefined,
  userId: string ,
  id: string | undefined,
  listingId?: string ,
) {
  const response = await fetch(
    `${apiUrl}/get-messages/${userId}/${id}/${listingId}`,
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
    throw new Error("Error fetching messages with the selected user");
  }
}

//send message 
export async function sendMessage(
  accessToken: string | undefined,
  formData: FormData
) {
  const response = await fetch(
    `${apiUrl}/send-message/`,
    {
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
    throw new Error("Error sending message");
  }
}

// mark message as read
export async function markMessageAsRead(
  accessToken: string | undefined,
  messageId: string | undefined
) {
  const response = await fetch(
    `${apiUrl}/mark-message-as-read/${messageId}/`,
    {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `JWT ${accessToken}`,
    },

  });
  if (response.ok) {
    console.log("success")
  } else {
    throw new Error("Error sending message");
  }
}

export const getLeaderboardData = async (accessToken: string | undefined) => {
  try {
    const response = await fetch(`${apiUrl}/leaderboard/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${accessToken}`,
      },
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error; 
  }
};
