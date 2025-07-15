import { Inbox } from "@novu/nextjs";

export default function NotificationsPage() {
  return (
    <Inbox
      applicationIdentifier="x8t0GCS0FgCQ"
      subscriberId="68748b8df703d283ddbe4d9c"
      appearance={{
        variables: {
          colorPrimary: "#1AA7EC",
          colorForeground: "#242422",
        },
      }}
    />
  );
}
