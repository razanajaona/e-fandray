import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'
import _ from 'lodash'

import { Nav } from '../components/Nav'
import { Sidebar } from '../components/Sidebar'
import { ChatArea } from '../components/ChatArea'
import { sendMessage, getMessages } from '../store/messages.slice'
import {sendThisUserIsTyping, sendThisUserStoppedTyping} from '../store/users.slice'
import { logout } from '../store/auth.slice'
import { getUsers } from '../store/users.slice'
import { RootState, Message } from '../utilities/types'

export const Chat: React.FC = () => {
  const dispatch = useDispatch()
  const [messageInput, setMessageInput] = useState('')

  const { currentUser } = useSelector((state: RootState) => state.authState)
  const { users, loading: usersLoading, onlineUsersByUsername, typingUsers } = useSelector(
    (state: RootState) => state.usersState
  )
  const { messages, loading: messagesLoading } = useSelector(
    (state: RootState) => state.messagesState
  )

  const handleLogoutClick = (event: any) => {
    
    localStorage.removeItem('user')

    dispatch(logout())
  }
  
  const debouncedTypingIndicationEmit = useCallback(
    _.debounce(() => dispatch(sendThisUserIsTyping(currentUser!.username)), 500),
    [], 
  );

  const handleSubmitForm = (event: any) => {
    event.preventDefault()

    if (messageInput && messageInput.trim() !== '') {
      const message: Message = {
        content: messageInput.trim(),
        date: dayjs().format(),
        author: currentUser!.username,
      }

      dispatch(sendThisUserStoppedTyping(currentUser!.username))
      dispatch(sendMessage(message))
      
    }

    setMessageInput('')
  }
  useEffect(()=>{
    if(messageInput===''){
      dispatch(sendThisUserStoppedTyping(currentUser!.username))

      setTimeout(()=>{
        dispatch(sendThisUserStoppedTyping(currentUser!.username))
      },500)
    }
  }, [messageInput, currentUser,dispatch])

  const handleChangeInput = (event: any) => {
    if (event.target.value !== '') debouncedTypingIndicationEmit();

    setMessageInput(event.target.value)
  }

  useEffect(() => {
    dispatch(getUsers())
    dispatch(getMessages())
  }, [dispatch])

  const usersWithOnlineData = useMemo(() => {
    if (users.length < 1) {
      return []
    }

    return users
      .map((user) => ({
        ...user,
        online: onlineUsersByUsername.some((onlineUsername) => onlineUsername === user.username),
      }))
      .sort((a, b) => a.username.localeCompare(b.username))
  }, [users, onlineUsersByUsername])

  const reversedMessages = useMemo(() => {
    if (messages.length < 1) {
      return []
    }

    return [...messages].reverse()
  }, [messages])

  if (messagesLoading || usersLoading) {
    return <div className="flex justify-center items-center h-screen bg-gray-100">miandry kely....</div>
  }

  return (
    <>
      <Nav onClick={handleLogoutClick} />
      <div className="flex m-0 content">
        <Sidebar users={usersWithOnlineData} currentUser={currentUser} typingUsers={typingUsers} />
        <ChatArea
          messages={reversedMessages}
          messageInput={messageInput}
          handleSubmitForm={handleSubmitForm}
          handleChangeInput={handleChangeInput}
        />
      </div>
    </>
  )
}
