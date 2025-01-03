'use client'

import { useState } from 'react'
import ConversationList from './ConversationList'
import ChatWindow from './ChatWindow'

export default function Messenger() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const currentUserId = "user123" // Replace with actual user ID from your auth system

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
  }

  const handleBack = () => {
    setSelectedConversation(null)
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div 
        className={`
          w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 bg-white
          ${selectedConversation ? 'hidden md:block' : 'block'}
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>
        <ConversationList 
          onSelectConversation={handleSelectConversation}
          selectedConversation={selectedConversation}
        />
      </div>
      <div 
        className={`
          flex-1 md:w-2/3 lg:w-3/4
          ${selectedConversation ? 'block' : 'hidden md:block'}
        `}
      >
        {selectedConversation ? (
          <ChatWindow 
            conversationId={selectedConversation} 
            onBack={handleBack}
            currentUserId={currentUserId}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 bg-white">
            <p className="text-center">
              <span className="block text-xl font-semibold mb-2">Welcome to Messages</span>
              <span className="text-sm">Select a conversation to start chatting</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

