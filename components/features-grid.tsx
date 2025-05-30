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
      title: "Kalender",
      description: "Håll koll på alla dina isbad i en överskådlig kalender",
    },
    {
      icon: <Clock className="h-6 w-6 text-[#222831]" />,
      title: "Tid och Varaktighet",
      description: "Registrera när och hur länge du badade",
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-[#222831]" />,
      title: "Känsla",
      description: "Beskriv din upplevelse med enkla emojis",
    },
    {
      icon: <ImageIcon className="h-6 w-6 text-[#222831]" />,
      title: "Bildbevis",
      description: "Ladda upp foton eller korta videos som bevis",
    },
    {
      icon: <Users className="h-6 w-6 text-[#222831]" />,
      title: "Socialt",
      description: "Utmana vänner och se deras progress",
    },
    {
      icon: <LineChart className="h-6 w-6 text-[#222831]" />,
      title: "Statistik",
      description: "Följ din utveckling med detaljerad statistik",
    },
    {
      icon: <Share2 className="h-6 w-6 text-[#222831]" />,
      title: "Dela",
      description: "Dela dina framgångar på sociala medier",
    },
    {
      icon: <Trophy className="h-6 w-6 text-[#222831]" />,
      title: "Utmaningar",
      description: "Klara milstolpar och få belöningar",
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
