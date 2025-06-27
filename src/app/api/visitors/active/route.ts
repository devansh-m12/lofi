import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Get active visitor count
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId') || 'general';

    // Clean up inactive visitors first (older than 5 minutes)
    await supabase
      .from('active_visitors')
      .delete()
      .lt('last_seen', new Date(Date.now() - 5 * 60 * 1000).toISOString());

    // Get current active visitor count
    const { data, error, count } = await supabase
      .from('active_visitors')
      .select('*', { count: 'exact' })
      .eq('room_id', roomId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch visitor count', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      count: count || 0,
      visitors: data || []
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Register or update visitor presence
export async function POST(request: NextRequest) {
  try {
    const { sessionId, roomId = 'general' } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Get client info
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || '';
    const forwarded = headersList.get('x-forwarded-for');
    const realIp = headersList.get('x-real-ip');
    const ipAddress = forwarded?.split(',')[0] || realIp || 'unknown';

    // First, try to update existing session
    const { data: updateData, error: updateError } = await supabase
      .from('active_visitors')
      .update({
        last_seen: new Date().toISOString(),
        user_agent: userAgent,
        ip_address: ipAddress,
        room_id: roomId
      })
      .eq('session_id', sessionId)
      .select();

    // If no rows were updated, insert a new record
    if (!updateError && (!updateData || updateData.length === 0)) {
      const { data: insertData, error: insertError } = await supabase
        .from('active_visitors')
        .insert({
          session_id: sessionId,
          user_agent: userAgent,
          ip_address: ipAddress,
          room_id: roomId,
          last_seen: new Date().toISOString()
        })
        .select();

      if (insertError) {
        console.error('Insert error:', insertError);
        return NextResponse.json(
          { error: 'Failed to register visitor', details: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        action: 'inserted',
        visitor: insertData?.[0] 
      });
    }

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update visitor', details: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      action: 'updated',
      visitor: updateData?.[0] 
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Remove visitor (when they leave)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('active_visitors')
      .delete()
      .eq('session_id', sessionId);

    if (error) {
      console.error('Delete error:', error);
      return NextResponse.json(
        { error: 'Failed to remove visitor', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 