"use client";

import { Inbox } from "@novu/nextjs";
import { useSession } from "@supabase/auth-helpers-react";

export default function NovuInbox() {
  const session = useSession();

  const subscriberId = session?.user?.id;

  if (!subscriberId) return null;

  const tabs = [
    { label: "All", filter: { tags: [] } },
    { label: "Promotions", filter: { tags: ["promotions"] } },
    { label: "Security", filter: { tags: ["security", "alert"] } },
    { label: "High Priority", filter: { data: { priority: "high" } } },
    {
      label: "Critical Alerts",
      filter: { tags: ["alert"], data: { priority: "high" } },
    },
  ];

  return (
    <Inbox
      applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID as string}
      subscriberId={subscriberId}
      tabs={tabs}
    />
  );
}
