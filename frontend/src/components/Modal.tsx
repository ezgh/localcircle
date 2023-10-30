import { useState, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import styled from "styled-components";

type Category = {
  id: number;
  name: string;
};

export default function Modal({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<number | string>("");

  const area= 1;
  const user=1;

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMjQ5MDQwLCJpYXQiOjE2OTg2NTcwNDAsImp0aSI6ImRlZjJlZTFjMjgzZDRhZTI4YzhhZWRiZDU4Nzg5N2QxIiwidXNlcl9pZCI6Mn0.retgww9rF0vTw5KvPusH8GX5t9rjTQO8ugdaCruzRPc",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched categories:", data.results); 
        setCategories(data.results);
      })
      .catch((error) => console.error("Error fetching categories: ", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/api/listings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAxMjQ5MDQwLCJpYXQiOjE2OTg2NTcwNDAsImp0aSI6ImRlZjJlZTFjMjgzZDRhZTI4YzhhZWRiZDU4Nzg5N2QxIiwidXNlcl9pZCI6Mn0.retgww9rF0vTw5KvPusH8GX5t9rjTQO8ugdaCruzRPc",
      },
      body: JSON.stringify({
        area,
        user,
        title,
        description,
        category,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setIsOpen(false);
    } else {
      const data = await res.json();
      console.error(data);
    }
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
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Buttons>
                  <SubmitButton type="submit">Share</SubmitButton>
                  <CancelButton>Cancel</CancelButton>
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
  height: 100vh;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
`;

const Centered = styled.div`
  position: fixed;
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
  }

  select {
    padding: 10px;
    border: none;
    border-radius: 1rem;
    cursor: pointer;
  }

  ::placeholder {
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
