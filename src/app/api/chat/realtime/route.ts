import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId') || 'general';

  let supabase: any;
  let channel: any;
  let keepAliveInterval: NodeJS.Timeout;
  let isControllerClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      try {
        supabase = createClient(supabaseUrl!, supabaseServiceKey!);

        // Send initial connection message
        controller.enqueue(new TextEncoder().encode('data: {"type":"connected"}\n\n'));

        // Set up real-time subscription
        channel = supabase
          .channel(`chat:${roomId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'chat_messages',
              filter: `room_id=eq.${roomId}`,
            },
            (payload: any) => {
              try {
                // Check if controller is still open before enqueueing
                if (!isControllerClosed) {
                  const data = `data: ${JSON.stringify(payload.new)}\n\n`;
                  controller.enqueue(new TextEncoder().encode(data));
                }
              } catch (error) {
                console.error('Error sending real-time data:', error);
                // If we can't send data, the connection is probably closed
                isControllerClosed = true;
              }
            }
          )
          .subscribe((status: string) => {
            console.log('Subscription status:', status);
            if (status === 'SUBSCRIBED' && !isControllerClosed) {
              controller.enqueue(new TextEncoder().encode('data: {"type":"subscribed"}\n\n'));
            }
          });

        // Keep connection alive
        keepAliveInterval = setInterval(() => {
          try {
            if (!isControllerClosed) {
              controller.enqueue(new TextEncoder().encode(': keepalive\n\n'));
            }
          } catch (error) {
            console.log('Keep-alive failed, connection closed');
            isControllerClosed = true;
            clearInterval(keepAliveInterval);
          }
        }, 30000);

      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        controller.error(error);
      }
    },

    cancel() {
      console.log('Real-time stream cancelled');
      isControllerClosed = true;
      
      // Clean up resources
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      
      if (channel && supabase) {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.error('Error removing channel:', error);
        }
      }
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
} 