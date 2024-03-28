import React, { useEffect, useState,useRef} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute,host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import {io} from "socket.io-client";

export default function Chat() {
  const socket=useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat,setCurrentChat]=useState(undefined);
  const [isLoaded,setIsLoaded]=useState(false);

    useEffect(() => {
      const fetchData = async () => {
        try {
          if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
          } else {
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            setCurrentUser(user);
            setIsLoaded(true);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }, [navigate]); // Empty dependency array to run the effect only once

    useEffect(()=>{
      if(currentUser){
        socket.current=io(host);
        socket.current.emit("add-user",currentUser._id);

      }
    },[currentUser]);

    useEffect(() => {
        const fetchData = async () => {
        if (currentUser) {
            if (currentUser.isAvatarImageSet) {
            try {
                const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
            } else {
            navigate("/setAvatar");
            }
        }
        };
        fetchData();
    }, [currentUser,navigate]);
  

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts}
           currentUser={currentUser} 
           changeChat={handleChatChange}
          />
          {isLoaded && currentChat===undefined?(
              <Welcome currentUser={currentUser}/> 
          ):(
            <ChatContainer 
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}/>
          )}
          
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
