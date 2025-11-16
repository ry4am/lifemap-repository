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
    { id: '4', title: 'Network Request', description: 'User4 would like to connect with you.', icon: 'user-plus', when: 'Yesterday 4:10pm' },
    { id: '5', title: 'System Updates', description: 'We updated some systems, check socials for more.', icon: 'wrench', when: '14/06 11:30am' },
    { id: '6', title: 'Review Calendar Changes', description: 'Your calendar has been updated, check for changes.', icon: 'calendar', when: '14/06 11:10am' },
    { id: '7', title: 'Profile Viewed', description: 'User2 has viewed your profile.', icon: 'photo', when: '13/06 4:45pm' },
    { id: '8', title: 'Network Request', description: 'User2 would like to connect with you.', icon: 'user-plus', when: '13/06 1:30pm' },
  ];
  return NextResponse.json({ items });
}
