"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import Navigation from "../../components/Navigation";
import { useAuth } from "../../contexts/AuthContext";
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

// Function to remove emojis from text
const removeEmojis = (text: string): string => {
  return text
    // Remove Unicode emojis
    .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]/gu, '')
    // Remove other common emoji patterns
    .replace(/[\u203C\u2049\u20E3\u2122\u2139\u2194-\u2199\u21A9-\u21AA\u231A-\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614-\u2615\u2618\u261D\u2620\u2622-\u2623\u2626\u262A\u262E-\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F-\u2660\u2663\u2665-\u2666\u2668\u267B\u267E-\u267F\u2692-\u2697\u2699\u269B-\u269C\u26A0-\u26A1\u26AA-\u26AB\u26B0-\u26B1\u26BD-\u26BE\u26C4-\u26C5\u26C8\u26CE-\u26CF\u26D1\u26D3-\u26D4\u26E9-\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733-\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]/gu, '')
    // Clean up extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
};

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    { sender: "ai", text: "Hi! I'm HannaAI. How can I help you today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading || !user) return;
    
    const userMessage: Message = { sender: "user", text: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setLoading(true);
    
    try {
      // Get the Firebase ID token
      const token = await user.getIdToken();
      
      const res = await fetch("/api/chatbase", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: userInput })
      });
      
      const data = await res.json();
      
      if (res.ok && data?.message) {
        // Remove emojis from the AI response
        const cleanMessage = removeEmojis(data.message);
        setMessages(prev => [...prev, { 
          sender: "ai", 
          text: cleanMessage, 
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
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Navigation />
        
        <Container maxWidth="lg" sx={{ py: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ mb: 2, textAlign: "center" }}>
            <Typography variant="h4" gutterBottom color="primary" fontWeight="600">
              HannaAI Chat
            </Typography>
            <Chip 
              label="Powered by Chatbase" 
              size="small" 
              variant="outlined" 
              sx={{ bgcolor: 'background.paper' }}
            />
          </Box>
          
          <Paper 
            elevation={2} 
            sx={{ 
              flex: 1, 
              display: "flex", 
              flexDirection: "column", 
              overflow: "hidden",
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            {/* Messages Area */}
            <Box sx={{ 
              flex: 1, 
              p: 3, 
              overflowY: "auto", 
              display: "flex", 
              flexDirection: "column",
              gap: 3,
              backgroundColor: "#fafbfc"
            }}>
              {messages.map((msg, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    display: "flex", 
                    alignItems: "flex-start",
                    gap: 2,
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row"
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: msg.sender === "user" ? "primary.main" : "secondary.main",
                    width: 40, 
                    height: 40,
                    boxShadow: 1
                  }}>
                    {msg.sender === "user" ? <Person /> : <SmartToy />}
                  </Avatar>
                  
                  <Paper 
                    elevation={1}
                    sx={{ 
                      p: 2.5, 
                      maxWidth: "75%",
                      bgcolor: msg.sender === "user" ? "primary.main" : "white",
                      color: msg.sender === "user" ? "white" : "text.primary",
                      borderRadius: 2.5,
                      borderTopLeftRadius: msg.sender === "ai" ? 0.5 : 2.5,
                      borderTopRightRadius: msg.sender === "user" ? 0.5 : 2.5,
                      border: msg.sender === "ai" ? '1px solid' : 'none',
                      borderColor: msg.sender === "ai" ? 'divider' : 'transparent'
                    }}
                  >
                    <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                      {msg.text}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        opacity: 0.7, 
                        display: "block", 
                        mt: 1,
                        fontSize: "0.75rem" 
                      }}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              
              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "secondary.main", width: 40, height: 40, boxShadow: 1 }}>
                    <SmartToy />
                  </Avatar>
                  <Paper elevation={1} sx={{ 
                    p: 2.5, 
                    borderRadius: 2.5, 
                    borderTopLeftRadius: 0.5,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
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
            <Box sx={{ 
              p: 3, 
              borderTop: 1, 
              borderColor: "divider", 
              backgroundColor: "white",
              boxShadow: '0 -2px 8px rgba(0,0,0,0.05)'
            }}>
              <Stack direction="row" spacing={2} alignItems="flex-end">
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
                      backgroundColor: '#f8f9fa',
                      '&:hover': {
                        backgroundColor: 'white'
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white'
                      }
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  sx={{ 
                    minWidth: 60, 
                    height: 56, 
                    borderRadius: 3,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <Send />
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ProtectedRoute>
  );
} 