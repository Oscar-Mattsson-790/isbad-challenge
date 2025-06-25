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
      icon: <CalendarDays className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Calendar",
      description: "Keep track of all your ice baths in a clear calendar view",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Time & Duration",
      description: "Log when and how long you bathed",
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Feeling",
      description: "Describe your experience using simple emojis",
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Photo Proof",
      description: "Upload photos or short videos as evidence",
    },
    {
      icon: <Users className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Social",
      description: "Challenge your friends and track their progress",
    },
    {
      icon: <LineChart className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Statistics",
      description: "Track your progress with detailed stats",
    },
    {
      icon: <Share2 className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Share",
      description: "Share your achievements on social media",
    },
    {
      icon: <Trophy className="h-6 w-6 text-[#1AA7EC]" />,
      title: "Challenges",
      description: "Reach milestones and earn rewards",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col rounded-xl bg-[#2B2B29] p-4 transition-all hover:shadow-[0_4px_20px_0_#1AA7EC]"
        >
          <div className="mb-2">{feature.icon}</div>
          <h3 className="mb-1 font-medium text-[#1AA7EC]">{feature.title}</h3>
          <p className="text-sm text-white">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}
