import { useEffect, useState } from "react";
import styled from "styled-components";

import { RiCloseLine } from "react-icons/ri";

import { Category } from "../types/types";

export default function Modal({
  setIsOpen,
  authUserId,
  area,
  categories,
  onCreateListing,
}: {
  area: number;
  setIsOpen: (isOpen: boolean) => void;
  authUserId: number | null;
  categories: Category[];
  onCreateListing: (
    title: string,
    description: string,
    category: number | string,
    area: number,
    user: number | null,
    image: File[]
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<number | string>("");
  const [user, setUser] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    if (authUserId) {
      setUser(authUserId);
    }
  }, [authUserId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);

      if (images.length + newImages.length > 4) {
        console.log("Exceeded the maximum number of images (4)");
        return;
      }

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreateListing(title, description, category, area, user, images);
    setIsOpen(false);
  };

  return (
    <>
      <DarkBackground onClick={() => setIsOpen(false)} />
      <Centered>
        <ModalDiv>
          <ModalBody>
            <ModalHeader>
              <h3>Create a new post</h3>
            </ModalHeader>
            <CloseButton onClick={() => setIsOpen(false)}>
              <RiCloseLine style={{ marginBottom: "-3px" }} />
            </CloseButton>
            <ModalContent>
              <Form onSubmit={handleSubmit}>
                <div className="formGroup">
                  <input
                    className="formControl"
                    type="text"
                    placeholder="Add a title.."
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e?.target.value)}
                    required
                  />
                </div>
                <div className="formGroup">
                  <textarea
                    className="formControl"
                    placeholder="Tell us more..."
                    name="description"
                    rows={10}
                    value={description}
                    onChange={(e) => setDescription(e?.target.value)}
                    required
                  />
                </div>
                <div className="formGroup">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="formGroup">
                  <Picture>
                    <div className="upload">
                      <input
                        type="file"
                        name="file"
                        id="file"
                        className="inputfile"
                        onChange={handleImageChange}
                        multiple
                      />

                      <label htmlFor="file">Photo</label>
                      <p>You can add up to 4 photos.</p>
                    </div>
                    <div className="imagePreviewContainer">
                      {images.map((image, index) => (
                        <img key={index} src={URL.createObjectURL(image)} />
                      ))}
                    </div>
                  </Picture>
                </div>
                <Buttons>
                  <SubmitButton type="submit">Share</SubmitButton>
                  <CancelButton onClick={() => setIsOpen(false)}>
                    Cancel
                  </CancelButton>
                </Buttons>
              </Form>
            </ModalContent>
          </ModalBody>
        </ModalDiv>
      </Centered>
    </>
  );
}

const DarkBackground = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100vw;
  height: 1000vh;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`;

const Centered = styled.div`
  position: fixed;
  z-index: 999;

  top: 50%;
  width: 40%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media (max-width: 1024px) {
    width: 50%;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
  @media (max-width: 425px) {
    width: 98%;
  }
`;

const ModalDiv = styled.div`
  background: white;
  color: white;
  z-index: 10;
  border-radius: 1.25rem;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
  padding: 20px;
`;

const ModalBody = styled.div`
  padding-top: 5px;
  background: #f1f1f1;
  color: white;
  z-index: 10;
  border-radius: 1.25rem;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.04);
`;
const ModalContent = styled.div``;

const ModalHeader = styled.div`
  color: black;
  padding-left: 20px;
`;

const Form = styled.form`
  padding: 0 30px 30px 10px;

  .formGroup {
    margin: 2% 3%;
  }

  input {
    padding: 5px 10px;
    font-size: 18px;
    width: 100%;
    height: 3rem;
    border-radius: 1rem;
    background: #fff;
    border: none;

  }

  textarea {
    width: 100%;
    font-size: 18px;
    border-radius: 1rem;
    background: #fff;
    border: none;
    padding: 20px 10px;
    font-family: 'Montserrat', sans-serif;}

  }

  select {
    padding: 10px;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
  }

  :placeholder {
    font-weight: 200;
  }
`;

const CloseButton = styled.button`
  cursor: pointer;
  border: none;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 18px;
  color: #2c3e50;
  background: white;
  transition: all 0.25s ease;
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.06);
  position: absolute;
  right: 0;
  top: 0;
  align-self: flex-end;
  margin-top: -7px;
  margin-right: -7px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const SubmitButton = styled.button`
  margin: 0rem 1rem 0.5rem 0;
  padding: 1.5% 1%;
  width: 5rem;
  font-size: 1rem;
  border: none;
  border-radius: 1.375rem;
  background: #e73213;
  color: white;
  cursor: pointer;

  &:hover {
    background: #ba2207;
  }

  @media (max-width: 425px) {
    padding: 4%;
    width: 40%;
  }
`;

const CancelButton = styled(SubmitButton)`
  background: #9dbeb7;
  margin: 0 0 0.5rem 0;

  &:hover {
    background: #81a79f;
  }
`;

const Picture = styled.div`
  display: flex;
  flex-direction: column;

  img {
    width: 90px;
    height: 90px;
    padding: 10px;
    background-color: white;
    border-radius: 1.2rem;
    margin: 10px 5px 0 0;
  }

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
    width: 75px;
    height: fix-content;
    border-radius: 1.3rem;
    overflow: hidden;
    white-space: wrap;
    text-overflow: ellipsis;
    text-align: center;
    color: black;
    background-color: white;
    display: inline-block;
    cursor: pointer;
    padding: 10px;
  }

  .inputfile:focus + label,
  .inputfile + label:hover {
    background-color: #f9f9f9;
  }

  .upload {
    display: flex;
    flex-direction: row;
  }

  .upload p {
    margin: 10px 0 0 10px;
    color: black;
    font-size: 0.7rem;
    font-weight: 600;
  }

  .imagePreviewContainer {
  }
`;
