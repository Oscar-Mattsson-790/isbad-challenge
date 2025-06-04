import {
  CalendarDays,
  Clock,
  ImageIcon,
  LineChart,
  Share2,
  ThumbsUp,
  Trophy,
  Users,
} from "lucide-react";

export default function FeaturesGrid() {
  const features = [
    {
      icon: <CalendarDays className="h-6 w-6 text-[#222831]" />,
      title: "Calendar",
      description: "Keep track of all your ice baths in a clear calendar view",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#222831]" />,
      title: "Time & Duration",
      description: "Log when and how long you bathed",
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-[#222831]" />,
      title: "Feeling",
      description: "Describe your experience using simple emojis",
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-[#222831]" />,
      title: "Photo Proof",
      description: "Upload photos or short videos as evidence",
    },
    {
      icon: <Users className="h-6 w-6 text-[#222831]" />,
      title: "Social",
      description: "Challenge your friends and track their progress",
    },
    {
      icon: <LineChart className="h-6 w-6 text-[#222831]" />,
      title: "Statistics",
      description: "Track your progress with detailed stats",
    },
    {
      icon: <Share2 className="h-6 w-6 text-[#222831]" />,
      title: "Share",
      description: "Share your achievements on social media",
    },
    {
      icon: <Trophy className="h-6 w-6 text-[#222831]" />,
      title: "Challenges",
      description: "Reach milestones and earn rewards",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl border border-gray-200 border-t-[5px] border-t-[#222831] p-4 transition-all hover:shadow-[0_4px_20px_0_#1AA7EC]"
        >
          <div className="mb-2">{feature.icon}</div>
          <h3 className="mb-1 font-medium">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
