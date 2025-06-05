'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
  Divider,
  Chip,
  CircularProgress,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge
} from '@mui/material';
import { 
  Settings, 
  Save, 
  FolderShared, 
  SmartToy, 
  Sync,
  CheckCircle,
  Error,
  Warning,
  PlayArrow,
  Stop,
  Refresh
} from '@mui/icons-material';

interface SyncLog {
  id: string;
  fileName: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
}

interface SyncJob {
  id: string;
  chatbaseAgentId: string;
  googleDriveFolderId: string;
  isActive: boolean;
  lastSyncTime: Date;
  nextSyncTime: Date;
}

const UserProfile: React.FC = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [chatbaseAgentId, setChatbaseAgentId] = useState(userProfile?.chatbaseAgentId || '');
  const [googleDriveFolderId, setGoogleDriveFolderId] = useState(userProfile?.googleDriveFolderId || '');
  const [loading, setLoading] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (userProfile?.chatbaseAgentId && userProfile?.googleDriveFolderId) {
      loadSyncStatus();
      loadSyncLogs();
    }
  }, [userProfile]);

  const getAuthToken = async () => {
    if (!user) throw Error('User not authenticated');
    return await user.getIdToken();
  };

  const loadSyncStatus = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/sync?type=status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncJobs(data.activeJobs);
        setSyncEnabled(data.activeJobs.length > 0);
      }
    } catch (error) {
      console.error('Error loading sync status:', error);
    }
  };

  const loadSyncLogs = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/sync?type=logs&limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSyncLogs(data.logs.map((log: any) => ({
          ...log,
          timestamp: log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date(log.timestamp),
        })));
      }
    } catch (error) {
      console.error('Error loading sync logs:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await updateUserProfile({
        chatbaseAgentId: chatbaseAgentId.trim() || undefined,
        googleDriveFolderId: googleDriveFolderId.trim() || undefined,
      });
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSyncToggle = async (enabled: boolean) => {
    if (!chatbaseAgentId || !googleDriveFolderId) {
      setMessage({ type: 'error', text: 'Please save your Chatbase Agent ID and Google Drive Folder ID first.' });
      return;
    }

    setLoading(true);
    try {
      const token = await getAuthToken();
      const action = enabled ? 'start' : 'stop';
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          chatbaseAgentId,
          googleDriveFolderId,
        }),
      });

      if (response.ok) {
        setSyncEnabled(enabled);
        setMessage({ 
          type: 'success', 
          text: enabled ? 'Sync started successfully!' : 'Sync stopped successfully!' 
        });
        await loadSyncStatus();
        await loadSyncLogs();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to toggle sync' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle sync. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRestartSync = async () => {
    if (!chatbaseAgentId || !googleDriveFolderId) return;

    setLoading(true);
    try {
      const token = await getAuthToken();
      
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'restart',
          chatbaseAgentId,
          googleDriveFolderId,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Sync restarted successfully!' });
        await loadSyncStatus();
        await loadSyncLogs();
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to restart sync' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to restart sync. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'error':
        return <Error color="error" />;
      case 'warning':
        return <Warning color="warning" />;
      default:
        return null;
    }
  };

  const handleGoogleDriveAuth = async () => {
    setMessage({ 
      type: 'success', 
      text: 'Please sign in with Google to authorize Google Drive access, then enter your folder ID below.' 
    });
  };

  if (!user || !userProfile) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Settings sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" gutterBottom>
            User Profile Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure your AI agent and Google Drive integration
          </Typography>
        </Box>

        {/* Alert Messages */}
        {message && (
          <Alert severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        {/* Profile Info */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              Account Information
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Display Name"
                value={userProfile.displayName}
                disabled
                fullWidth
              />
              <TextField
                label="Email"
                value={userProfile.email}
                disabled
                fullWidth
              />
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`UID: ${userProfile.uid}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`Created: ${userProfile.createdAt.toLocaleDateString()}`} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Chatbase Configuration */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToy color="primary" />
              Chatbase Agent Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter your personal Chatbase agent ID to connect your custom AI assistant.
            </Typography>
            <TextField
              label="Chatbase Agent ID"
              value={chatbaseAgentId}
              onChange={(e) => setChatbaseAgentId(e.target.value)}
              fullWidth
              placeholder="e.g., your-agent-id-here"
              helperText="You can find your agent ID in your Chatbase dashboard"
            />
          </CardContent>
        </Card>

        {/* Google Drive Configuration */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderShared color="primary" />
              Google Drive Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Connect a Google Drive folder to automatically sync files with your AI agent's knowledge base.
            </Typography>
            
            <Stack spacing={2}>
              <Button 
                variant="outlined" 
                onClick={handleGoogleDriveAuth}
                startIcon={<FolderShared />}
                sx={{ alignSelf: 'flex-start' }}
              >
                Authorize Google Drive Access
              </Button>
              
              <TextField
                label="Google Drive Folder ID"
                value={googleDriveFolderId}
                onChange={(e) => setGoogleDriveFolderId(e.target.value)}
                fullWidth
                placeholder="e.g., 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                helperText="Right-click your Google Drive folder, select 'Get link', and copy the folder ID from the URL"
              />
              
              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>How to find your Google Drive Folder ID:</strong><br />
                  1. Go to Google Drive and navigate to your desired folder<br />
                  2. Right-click the folder and select "Get link"<br />
                  3. Copy the folder ID from the URL (the long string after /folders/)
                </Typography>
              </Alert>
            </Stack>
          </CardContent>
        </Card>

        {/* Sync Management */}
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Sync color="primary" />
              Automatic Sync Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Automatically sync new files from your Google Drive folder to your Chatbase agent every 15 minutes.
            </Typography>
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={syncEnabled}
                      onChange={(e) => handleSyncToggle(e.target.checked)}
                      disabled={loading || !chatbaseAgentId || !googleDriveFolderId}
                    />
                  }
                  label="Enable Auto-Sync"
                />
                
                {syncEnabled && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleRestartSync}
                    disabled={loading}
                  >
                    Restart Sync
                  </Button>
                )}
              </Box>

              {syncJobs.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Active Sync Jobs:
                  </Typography>
                  {syncJobs.map((job) => (
                    <Chip
                      key={job.id}
                      label={`Last sync: ${new Date(job.lastSyncTime).toLocaleString()}`}
                      color="success"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Sync Logs */}
        {syncLogs.length > 0 && (
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Sync Activity
              </Typography>
              <List dense>
                {syncLogs.slice(0, 10).map((log) => (
                  <ListItem key={log.id}>
                    <ListItemIcon>
                      {getStatusIcon(log.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={log.fileName || 'System event'}
                      secondary={`${log.message} - ${log.timestamp.toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            onClick={handleSave}
            disabled={loading}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UserProfile;
