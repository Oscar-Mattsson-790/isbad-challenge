import {
  UserPlus,
  CalendarDays,
  Clock,
  Smile,
  Camera,
  Users,
  BarChart,
  Pencil,
  Share2,
  Trophy,
  HelpCircle,
  Settings,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function HowItWorks() {
  const features = [
    {
      icon: <UserPlus className="text-[#157FBF] h-8 w-8" />,
      title: "Create Account",
      description: "Sign up with email or Google to join ISBAD Challenge.",
    },
    {
      icon: <CalendarDays className="text-[#157FBF] h-8 w-8" />,
      title: "Join a Challenge",
      description: "Pick a 15 or 30 day challenge to stay on track.",
    },
    {
      icon: <Clock className="text-[#157FBF] h-8 w-8" />,
      title: "Log Your Baths",
      description: "Log date, time and duration for each bath.",
    },
    {
      icon: <Smile className="text-[#157FBF] h-8 w-8" />,
      title: "Describe the Feeling",
      description: "Add an emoji to describe your mood.",
    },
    {
      icon: <Camera className="text-[#157FBF] h-8 w-8" />,
      title: "Add Photo/Video",
      description: "Upload a photo or video as memory or proof.",
    },
    {
      icon: <Users className="text-[#157FBF] h-8 w-8" />,
      title: "Add Friends",
      description: "Search by email and invite new friends.",
    },
    {
      icon: <BarChart className="text-[#157FBF] h-8 w-8" />,
      title: "Track Progress",
      description: "See your streaks, average and longest baths.",
    },
    {
      icon: <Pencil className="text-[#157FBF] h-8 w-8" />,
      title: "Edit Profile",
      description: "Change name or email from profile tab.",
    },
    {
      icon: <Share2 className="text-[#157FBF] h-8 w-8" />,
      title: "Share Achievements",
      description: "Post your milestones to social media.",
    },
    {
      icon: <Trophy className="text-[#157FBF] h-8 w-8" />,
      title: "Reach Milestones",
      description: "Earn rewards by finishing your challenge.",
    },
    {
      icon: <HelpCircle className="text-[#157FBF] h-8 w-8" />,
      title: "Get Support",
      description: "Need help? Contact info@isbad.se",
    },
    {
      icon: <Settings className="text-[#157FBF] h-8 w-8" />,
      title: "Customize Settings",
      description: "Change language, theme and notifications.",
    },
  ];

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">
        How It Works
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-[#2B2B29] text-white border-none rounded-xl p-4 hover:shadow-[0_4px_20px_0_#157FBF] transition-all"
          >
            <div className="flex flex-col items-start space-y-4">
              <div className="text-[#157FBF] h-7 w-7 sm:h-8 sm:w-8">
                {feature.icon}
              </div>
              <h3 className="text-sm md:text-base font-semibold leading-tight">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm leading-snug text-white">
                {feature.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
