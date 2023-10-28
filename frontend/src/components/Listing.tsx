import styled from "styled-components"

export default function Listing() {
  return (
    <>
    <Post>
        <Info>
            <div className="start">
            <img src="https://picsum.photos/id/22/60/60" alt="" />
            <Name>Name Surname</Name>
            </div>
            <div className="end">
            <Date>22/10/2023</Date>
            </div>
        </Info>
        <Content>
            <h2>Title</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco</p>
        <Buttons>
            <SaveButton>Save</SaveButton>
            <MessageButton>Message</MessageButton>
        </Buttons>
        </Content>
    </Post>
    </>
  )
}

const Post = styled.div`
padding:3rem;
border:1px solid gray;

@media (max-width: 425px) {
    padding:1rem;
    }
`

const Info = styled.div`

display:flex;
flex-direction:row;
justify-content:space-between;

.start {
display:flex;
flex-direction:row;
}

img {
border-radius: 100%;
margin-right:1rem;

@media (max-width: 425px) {
    height: 60px;
    width: 60px;
    }

}

@media (max-width: 600px) {
    flex-direction:column-reverse;
        }
`

const Name = styled.p`
font-size:1.2em;
font-weight:500;

`

const Date =styled.p`
font-weight:200;
@media (max-width: 425px) {
    font-size:0.8em;   
        }

`

const Content = styled.div`
margin-left:4.7rem;

h2 {
    text-decoration:underline;
}
@media (max-width: 768px) {
    margin:0;
    
        }


`
const Buttons = styled.div`
`

const SaveButton = styled.button`
margin: 1rem 1rem 0.5rem 0;
padding: 1.5% 1%;
width: 5rem;
font-size: 1rem;
border: none;
border-radius: 1.375rem;
background: #E73213;
color: white;
cursor:pointer;

&:hover {
    background: #BA2207;
  }

@media (max-width: 425px) {
    padding: 4%;
    width: 40%;
    }
`;

const MessageButton = styled(SaveButton)`
background: #9DBEB7;

&:hover {
    background: #81A79F;
  }
`;



