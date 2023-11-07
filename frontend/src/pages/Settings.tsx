import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";

import ToggleSwitch from "../components/ToggleSwitch";

import { getAreas, getAuthenticatedUser } from "../api/api";
import { Area } from "../types/types";

export default function Settings() {
  const [file, setFile] = useState<string>(
    "https://picsum.photos/seed/picsum/150/150"
  );
  const [areas, setAreas] = useState<Area[]>([]);
  const [authUser, setAuthUser] = useState(null);
  const [fileName, setFileName] = useState("Choose a file");

  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    area: "",
  });
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    getAreas(accessToken)
      .then((areasData) => {
        setAreas(areasData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    getAuthenticatedUser(accessToken)
      .then((userData) => {
        // Set the initial userData state with user data from the server
        setUserData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          area: userData.area || "",
        });
        console.log(userData);
        setAuthUser(userData.id);
      })
      .catch((error) => {
        console.error("Error fetching authenticated user data:", error);
      });
  }, [accessToken]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      console.log(file);
      setFileName(e.target.value || "Choose a file");
    }
  };

  const handleInfoChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    fetch(`http://127.0.0.1:8000/api/user_info/${authUser}/`, {
      method: "PATCH",
      headers: {
        Authorization: `JWT ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Profile updated successfully");
        } else {
          console.error("Profile update failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <SettingsDiv>
        <form action="" onSubmit={handleFormSubmit}>
          <h1>Settings</h1>
          <Profile>
            <h3>Profile Settings</h3>
            <Picture>
              <PictureDiv>
                <ProfilePicture src={file} />
              </PictureDiv>
              <Buttons>
                <input
                  type="file"
                  name="file"
                  id="file"
                  className="inputfile"
                  onChange={handleImageChange}
                />
                <label htmlFor="file">{fileName}</label>{" "}
                <button
                  onClick={() =>
                    setFile("https://picsum.photos/seed/picsum/150/150")
                  }
                >
                  Delete Picture
                </button>
              </Buttons>
            </Picture>
            <Info>
              <div className="together">
                <div className="input">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    className="form-control"
                    type="name"
                    placeholder="First Name"
                    name="first_name"
                    value={userData.first_name}
                    onChange={handleInfoChange}
                  />
                </div>
                <div className="input">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    className="form-control"
                    type="name"
                    placeholder="Last Name"
                    name="last_name"
                    value={userData.last_name}
                    onChange={handleInfoChange}
                  />
                </div>
              </div>
              <div className="separate">
                <div className="input">
                  <label htmlFor="email">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleInfoChange}
                  />
                </div>
                <div className="separate">
                  <div className="input">
                    <label htmlFor="location">Location</label>
                    <select
                      value={userData.area}
                      name="area"
                      onChange={handleInfoChange}
                    >
                      <option value="">Location</option>
                      {areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </Info>
          </Profile>

          <NotificationSettings>
            <h3>Notification Settings</h3>
            <Notifications>
              <p>Email Notifications:</p>
              <ToggleSwitch />
            </Notifications>
            <button type="submit"> Update Profile</button>
          </NotificationSettings>
        </form>

        <DeleteSettings>
          <h3>Danger Zone</h3>
          <p>Delete your account</p>
        </DeleteSettings>
      </SettingsDiv>
    </>
  );
}

const SettingsDiv = styled.div`
  align-self: baseline;
  width: 30rem;

  @media (max-width: 600px) {
    width: auto;
  }
`;

const Profile = styled.div``;

const Picture = styled.div`
  display: flex;
  flex-direction: row;

  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .inputfile + label {
    font-size: 1em;
    font-weight: 400;
    max-width: 120px;
    height: fix-content;
    border-radius: 1.3rem;
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
    text-align: center;
    color: white;
    background-color: #1a1c25;
    display: inline-block;
    cursor: pointer;
    padding: 10px;
  }

  .inputfile:focus + label,
  .inputfile + label:hover {
    background-color: #303342;
  }

  button {
    margin-top: 1rem;
    font-size: 1em;
    font-weight: 400;
    color: black;
    background-color: white;
    display: inline-block;
    cursor: pointer;
    padding: 10px;
    border: 0.5px solid #aaadbe;
    border-radius: 1.3rem;
  }
  button:hover {
    background-color: #f6f6f6;
  }
`;

const ProfilePicture = styled.img`
  border-radius: 100%;
  width: 150px;
  height: 150px;
  margin-right: 2rem;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const PictureDiv = styled.div`
  margin-top: 10px;
`;

const Notifications = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  p {
    margin-right: 10px;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;

  .together {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    @media (max-width: 425px) {
      flex-direction: column;
    }
  }

  .input {
    display: flex;
    flex-direction: column;
  }

  input {
    font-size: 1em;
    font-weight: 400;
    width: auto;
    border-radius: 1.3rem;
    overflow: hidden;
    border: 0.5px solid #aaadbe;
    display: inline-block;
    padding: 10px;
  }

  label {
    font-size: 0.8rem;
  }

  select {
    padding: 10px;
    border: 0.5px solid #aaadbe;
    border-radius: 1rem;
    cursor: pointer;
  }
  select::placeholder {
    font-family: "Montserrat", sans-serif;
    font-weight: 200;
    font-size: 40px;
  }

  .separate {
    margin-top: 10px;
  }
`;

const NotificationSettings = styled.div`
  margin-top: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f1f1;

  button {
    margin-top: 1rem;
    font-size: 1em;
    font-weight: 400;
    color: white;
    background-color: #ba2207;
    display: inline-block;
    cursor: pointer;
    padding: 10px;
    border: 0.5px solid #aaadbe;
    border-radius: 1.3rem;
  }
  button:hover {
    background-color: #f6f6f6;
  }
`;

const DeleteSettings = styled.div`
  p {
    color: #ba2207;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
`;
