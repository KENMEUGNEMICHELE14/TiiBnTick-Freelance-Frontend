'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Maximize2, Minimize2, Send, User, ChevronLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  text: string
  sender: 'user' | 'other'
  timestamp: string
}

interface Contact {
  id: string
  name: string
  role: string
  avatar: string | null
  lastMessage: string
  time: string
  unread: number
  messages: Message[]
}

const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Support TiiBnTick',
    role: 'Assistance',
    avatar: null,
    lastMessage: 'Bonjour ! Comment puis-je vous aider ?',
    time: '10:00',
    unread: 1,
    messages: [
      { id: 'm1', text: 'Bonjour ! Comment puis-je vous aider ?', sender: 'other', timestamp: '10:00' }
    ]
  },
  {
    id: '2',
    name: 'Jean Dupont',
    role: 'Client',
    avatar: null,
    lastMessage: 'Le colis est arrivé, merci !',
    time: 'Hier',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Avez-vous commencé la livraison ?', sender: 'other', timestamp: '14:30' },
      { id: 'm2', text: 'Oui, j\'arrive dans 10 minutes.', sender: 'user', timestamp: '14:35' },
      { id: 'm3', text: 'Le colis est arrivé, merci !', sender: 'other', timestamp: '14:45' }
    ]
  },
  {
    id: '3',
    name: 'Marie Kouassi',
    role: 'Freelancer',
    avatar: null,
    lastMessage: 'Je suis en route.',
    time: 'Lun',
    unread: 0,
    messages: [
      { id: 'm1', text: 'Bonjour Marie, à quelle heure pouvez-vous passer ?', sender: 'user', timestamp: '09:00' },
      { id: 'm2', text: 'Je suis en route.', sender: 'other', timestamp: '09:15' }
    ]
  }
]

export default function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeContactId, setActiveContactId] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>(initialContacts)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeContact = contacts.find(c => c.id === activeContactId) || null
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Scroll to bottom when new messages arrive or when switching contacts
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [contacts, isOpen, activeContactId])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageInput.trim() || !activeContactId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: messageInput,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Update contacts state
    setContacts(prev => prev.map(c => {
      if (c.id === activeContactId) {
        return {
          ...c,
          lastMessage: messageInput,
          time: newMessage.timestamp,
          messages: [...c.messages, newMessage]
        }
      }
      return c
    }))

    setMessageInput('')

    // Fake response
    setTimeout(() => {
      setContacts(prev => prev.map(c => {
        if (c.id === activeContactId) {
          const replyText = "D'accord, c'est noté."
          const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          return {
            ...c,
            lastMessage: replyText,
            time: replyTime,
            messages: [
              ...c.messages,
              {
                id: (Date.now() + 1).toString(),
                text: replyText,
                sender: 'other',
                timestamp: replyTime
              }
            ]
          }
        }
        return c
      }))
    }, 1500)
  }

  // Handle opening chat icon
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (isOpen) {
      setIsExpanded(false)
    }
  }

  // Handle expanding to full screen
  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded && !activeContactId && contacts.length > 0) {
      // Auto-select first contact if expanding and none is selected
      setActiveContactId(contacts[0].id)
    }
  }

  const selectContact = (id: string) => {
    setActiveContactId(id)
    // Mark as read
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c))
  }

  const renderContactList = () => (
    <div className={`flex flex-col h-full bg-white ${isExpanded ? 'w-80 border-r border-gray-200 shrink-0' : 'w-full'}`}>
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white flex items-center justify-between shrink-0 cursor-move">
        <h3 className="font-semibold">Messages</h3>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleExpand}>
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={toggleChat}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..." 
            className="pl-9 bg-gray-50 border-transparent focus-visible:ring-orange-500 rounded-xl text-sm h-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm">Aucun contact trouvé</div>
        ) : (
          filteredContacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => selectContact(contact.id)}
              className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-orange-50 transition-colors border-b border-gray-50 ${activeContactId === contact.id ? 'bg-orange-50/50' : ''}`}
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center border border-orange-200">
                  <User className="w-6 h-6 text-orange-600" />
                </div>
                {contact.unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
                    {contact.unread}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{contact.name}</h4>
                  <span className="text-[10px] text-gray-500 shrink-0">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const renderChatView = () => {
    if (!activeContact) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 text-gray-400">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-10 h-10 text-orange-400" />
          </div>
          <p>Sélectionnez un contact pour commencer</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col h-full flex-1 bg-gray-50 relative">
        {/* Chat Header */}
        <div className={`bg-white p-3 md:p-4 flex items-center justify-between border-b border-gray-200 shrink-0 shadow-sm z-10 ${!isExpanded ? 'cursor-move' : ''}`}>
          <div className="flex items-center gap-2">
            {!isExpanded && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-orange-50 hover:text-orange-600 mr-1" onClick={() => setActiveContactId(null)}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center shrink-0">
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm md:text-base">{activeContact.name}</h3>
              <p className="text-[10px] md:text-xs text-gray-500">{activeContact.role}</p>
            </div>
          </div>
          {!isExpanded && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-orange-50 hover:text-orange-600" onClick={toggleExpand}>
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:bg-orange-50 hover:text-orange-600" onClick={toggleChat}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Chat Body */}
        <div 
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 bg-[url('https://www.transparenttextures.com/patterns/always-grey.png')] bg-repeat"
        >
          {activeContact.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
            >
              <div 
                className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 px-1 font-medium">{msg.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={handleSendMessage}
          className="p-3 md:p-4 bg-white border-t border-gray-200 flex items-center gap-2 shrink-0 z-10"
        >
          <Input 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Écrivez un message..."
            className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-orange-500 rounded-full px-4 h-11"
          />
          <Button 
            type="submit"
            size="icon"
            disabled={!messageInput.trim()}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shrink-0 rounded-full h-11 w-11 shadow-md disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    )
  }

  // Provide boundary for drag
  const dragConstraints = typeof window !== 'undefined' ? { 
    left: 0, 
    right: window.innerWidth - (isExpanded ? 0 : 350), 
    top: 0, 
    bottom: window.innerHeight - (isExpanded ? 0 : 500) 
  } : undefined

  const iconDragConstraints = typeof window !== 'undefined' ? {
    left: 20, right: window.innerWidth - 80, top: 20, bottom: window.innerHeight - 80
  } : undefined

  return (
    <div className="fixed z-50 pointer-events-none inset-0 overflow-hidden">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            dragConstraints={iconDragConstraints}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-6 right-6 pointer-events-auto"
            style={{ touchAction: "none" }}
          >
            <Button
              onClick={toggleChat}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl flex items-center justify-center text-white cursor-pointer relative"
            >
              <MessageSquare className="w-6 h-6" />
              {/* Unread badge total */}
              {contacts.reduce((acc, c) => acc + c.unread, 0) > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
                  {contacts.reduce((acc, c) => acc + c.unread, 0)}
                </span>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            drag={!isExpanded}
            dragMomentum={false}
            dragConstraints={dragConstraints}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={isExpanded ? {
              opacity: 1,
              scale: 1,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100vw',
              height: '100vh',
              x: 0,
              y: 0,
            } : {
              opacity: 1,
              y: 0,
              scale: 1,
              width: '350px',
              height: '550px',
              bottom: '24px',
              right: '24px',
            }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            className={`pointer-events-auto bg-white shadow-2xl overflow-hidden flex ${isExpanded ? 'rounded-none' : 'rounded-2xl border border-gray-200'}`}
            style={{ 
              ...(isExpanded ? { position: 'fixed', inset: 0 } : {}),
              touchAction: "none"
            }}
          >
            {isExpanded ? (
              // Split Pane layout for expanded view
              <>
                {renderContactList()}
                {renderChatView()}
              </>
            ) : (
              // Single Pane layout for window view
              <>
                {!activeContactId ? renderContactList() : renderChatView()}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
