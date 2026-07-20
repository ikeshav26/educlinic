import React from 'react';
import type { Metadata } from 'next';
import LeadershipMessagesSection from '@/components/About/LeadershipMessage';
import { leadershipMessages } from '@/components/About/messagesData';

export const metadata: Metadata = {
  title: 'About Us | Baba Farid Group of Institutions',
  description: 'Learn about Baba Farid Group of Institutions (BFGI), leadership messages from Chairman Dr. Gurmeet Singh Dhaliwal and Campus Director Prof. (Dr.) M.P. Poonia.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <LeadershipMessagesSection messages={leadershipMessages} />
    </main>
  );
}
