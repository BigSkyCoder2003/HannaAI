interface ChatbaseSource {
  id?: string;
  name: string;
  type: 'text' | 'file' | 'website';
  content?: string;
  file?: Buffer;
  url?: string;
}

interface ChatbaseResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export class ChatbaseService {
  private apiKey: string;
  private baseUrl = 'https://www.chatbase.co/api/v1';

  constructor() {
    this.apiKey = process.env.CHATBASE_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('CHATBASE_API_KEY is required');
    }
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Chatbase API Error: ${errorData.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Chatbase API request failed:', error);
      throw error;
    }
  }

  async addTextSource(chatbotId: string, name: string, content: string): Promise<ChatbaseResponse> {
    try {
      const response = await this.makeRequest('/sources', 'POST', {
        chatbotId,
        name,
        type: 'text',
        content,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add text source',
      };
    }
  }

  async addFileSource(chatbotId: string, name: string, fileBuffer: Buffer, mimeType: string): Promise<ChatbaseResponse> {
    try {
      // For file uploads, we need to use multipart/form-data
      const formData = new FormData();
      formData.append('chatbotId', chatbotId);
      formData.append('name', name);
      formData.append('type', 'file');
      
      // Convert buffer to blob
      const blob = new Blob([fileBuffer], { type: mimeType });
      formData.append('file', blob, name);

      const response = await fetch(`${this.baseUrl}/sources`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`Chatbase API Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to add file source',
      };
    }
  }

  async updateTextSource(sourceId: string, name: string, content: string): Promise<ChatbaseResponse> {
    try {
      const response = await this.makeRequest(`/sources/${sourceId}`, 'PUT', {
        name,
        content,
      });

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update text source',
      };
    }
  }

  async deleteSource(sourceId: string): Promise<ChatbaseResponse> {
    try {
      await this.makeRequest(`/sources/${sourceId}`, 'DELETE');

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete source',
      };
    }
  }

  async listSources(chatbotId: string): Promise<ChatbaseResponse> {
    try {
      const response = await this.makeRequest(`/sources?chatbotId=${chatbotId}`, 'GET');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to list sources',
      };
    }
  }

  async retrainChatbot(chatbotId: string): Promise<ChatbaseResponse> {
    try {
      const response = await this.makeRequest(`/chatbots/${chatbotId}/retrain`, 'POST');

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrain chatbot',
      };
    }
  }

  async syncGoogleDriveFile(
    chatbotId: string, 
    fileName: string, 
    fileContent: string, 
    fileId: string
  ): Promise<ChatbaseResponse> {
    const sourceName = `GoogleDrive_${fileName}_${fileId}`;
    
    try {
      // Check if source already exists
      const sourcesResponse = await this.listSources(chatbotId);
      
      if (sourcesResponse.success && sourcesResponse.data) {
        const existingSource = sourcesResponse.data.find((source: any) => 
          source.name === sourceName
        );

        if (existingSource) {
          // Update existing source
          return await this.updateTextSource(existingSource.id, sourceName, fileContent);
        }
      }

      // Add new source
      return await this.addTextSource(chatbotId, sourceName, fileContent);
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sync Google Drive file',
      };
    }
  }
}

export const chatbaseService = new ChatbaseService(); 