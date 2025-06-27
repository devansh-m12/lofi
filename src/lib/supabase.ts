// Type definitions for chat functionality
// Note: Supabase client calls are now handled via API routes for better security

export interface ChatMessage {
  id: string;
  message: string;
  created_at: string;
  user_name: string;
  user_id?: string;
  room_id: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  created_at: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: string;
}

export interface MessagesResponse {
  messages: ChatMessage[];
}

export interface SendMessageResponse {
  message: ChatMessage;
} 