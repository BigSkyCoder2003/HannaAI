"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useState } from "react";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Stack, 
  CircularProgress,
  Avatar,
  Chip
} from "@mui/material";
import { Send, Person, SmartToy } from "@mui/icons-material";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hi! I'm HannaAI. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage: Message = { sender: "user", text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setLoading(true);
    
    try {
      const res = await fetch("/api/chatbase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput })
      });
      
      const data = await res.json();
      
      if (res.ok && data?.message) {
        setMessages(prev => [...prev, { 
          sender: "ai", 
          text: data.message, 
          timestamp: new Date() 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          sender: "ai", 
          text: data?.error || "Sorry, I couldn't get a response. Please try again.", 
          timestamp: new Date() 
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        sender: "ai", 
        text: "Error connecting to AI. Please check your internet connection and try again.", 
        timestamp: new Date() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ProtectedRoute fallback={
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Please sign in to access HannaAI Chat
        </Typography>
      </Container>
    }>
      <Container maxWidth="md" sx={{ py: 4, height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom color="primary">
            🤖 HannaAI Chat
          </Typography>
          <Chip label="Powered by Chatbase" size="small" variant="outlined" />
        </Box>
        
        <Paper 
          elevation={3} 
          sx={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column", 
            overflow: "hidden",
            borderRadius: 3 
          }}
        >
          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            p: 2, 
            overflowY: "auto", 
            display: "flex", 
            flexDirection: "column",
            gap: 2,
            backgroundColor: "#fafafa"
          }}>
            {messages.map((msg, idx) => (
              <Box 
                key={idx} 
                sx={{ 
                  display: "flex", 
                  alignItems: "flex-start",
                  gap: 1,
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row"
                }}
              >
                <Avatar sx={{ 
                  bgcolor: msg.sender === "user" ? "primary.main" : "secondary.main",
                  width: 32, 
                  height: 32 
                }}>
                  {msg.sender === "user" ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
                </Avatar>
                
                <Paper 
                  elevation={1}
                  sx={{ 
                    p: 2, 
                    maxWidth: "70%",
                    bgcolor: msg.sender === "user" ? "primary.main" : "white",
                    color: msg.sender === "user" ? "white" : "text.primary",
                    borderRadius: 2,
                    borderTopLeftRadius: msg.sender === "ai" ? 0.5 : 2,
                    borderTopRightRadius: msg.sender === "user" ? 0.5 : 2,
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                    {msg.text}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      display: "block", 
                      mt: 0.5,
                      fontSize: "0.7rem" 
                    }}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            ))}
            
            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
                  <SmartToy fontSize="small" />
                </Avatar>
                <Paper elevation={1} sx={{ p: 2, borderRadius: 2, borderTopLeftRadius: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      HannaAI is thinking...
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
          
          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider", backgroundColor: "white" }}>
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <TextField
                fullWidth
                multiline
                maxRows={4}
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  }
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                sx={{ 
                  minWidth: 56, 
                  height: 56, 
                  borderRadius: 3,
                  p: 1 
                }}
              >
                <Send />
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </ProtectedRoute>
  );
} 