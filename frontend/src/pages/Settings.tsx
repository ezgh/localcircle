import { useState } from "react";
import styled from "styled-components";
import ToggleSwitch from "../components/ToggleSwitch";

export default function Settings() {
  const [file, setFile] = useState<string>(
    "https://picsum.photos/seed/picsum/150/150"
  );
  const [fileName, setFileName] = useState("Choose a file");
  const [info, setInfo] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setFile(URL.createObjectURL(e.target.files[0]));
      setFileName(e.target.value || "Choose a file");
    }
  }

  const handleInfoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <SettingsDiv>
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
            <form action="">
              <div className="together">
                <div className="input">
                  <label htmlFor="firstname">First Name</label>
                  <input
                    className="form-control"
                    type="name"
                    placeholder="First Name"
                    name="first_name"
                    value={info.first_name}
                    onChange={handleInfoChange}
                    required
                  />
                </div>
                <div className="input">
                  <label htmlFor="lastname">Last Name</label>
                  <input
                    className="form-control"
                    type="name"
                    placeholder="Last Name"
                    name="last_name"
                    value={info.last_name}
                    onChange={handleInfoChange}
                    required
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
                    value={info.email}
                    onChange={handleInfoChange}
                    required
                  />
                </div>
              </div>
            </form>
          </Info>
        </Profile>
        <NotificationSettings>
          <h3>Notification Settings</h3>
          <Notifications>
            <p>Email Notifications:</p>
            <ToggleSwitch />
          </Notifications>
        </NotificationSettings>
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
    border-radius: 1.3rem;
    overflow: hidden;
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
    margin-bottom: 10px;

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
`;

const NotificationSettings = styled.div`
  margin-top: 50px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f1f1;
`;

const DeleteSettings = styled.div`
  p {
    color: #ba2207;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
  }
`;
