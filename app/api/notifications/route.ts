import { NextResponse } from 'next/server';

/**
 * Simple demo notifications feed.
 * Replace later with DB queries (Supabase/Mongo/Postgres).
 */
export async function GET() {
  const items = [
    { id: '1', title: 'Update Profile Details', description: 'We have requested you to update profile settings.', icon: 'settings', when: 'Today 3:00pm' },
    { id: '2', title: 'Review Calendar Changes', description: 'Your calendar has been updated, check for changes.', icon: 'calendar', when: 'Today 1:40pm' },
    { id: '3', title: 'Profile Viewed', description: 'User3 has viewed your profile.', icon: 'photo', when: 'Today 12:35pm' },
  ];
  return NextResponse.json({ items });
}
