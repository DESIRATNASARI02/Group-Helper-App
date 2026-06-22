import { CheckSquare, CalendarCheck, FileText, MessageCircle, Bell, Users } from "lucide-react";

const features = [
  { icon: CheckSquare,   title: "Task Management",   desc: "Create, assign, and track tasks so everyone stays on track.", iconColor: "text-blue-600",   iconBg: "bg-blue-50"   },
  { icon: CalendarCheck, title: "Study Schedule",    desc: "Plan sessions and never miss an important meeting.",         iconColor: "text-violet-600", iconBg: "bg-violet-50" },
  { icon: FileText,      title: "Shared Notes",      desc: "Upload and share notes easily within your group.",          iconColor: "text-orange-500", iconBg: "bg-orange-50" },
  { icon: MessageCircle, title: "Group Chat",        desc: "Real-time messaging to stay connected with your group.",    iconColor: "text-sky-500",    iconBg: "bg-sky-50"    },
  { icon: Bell,          title: "Smart Reminders",   desc: "Get notified about upcoming tasks and study sessions.",     iconColor: "text-green-600",  iconBg: "bg-green-50"  },
  { icon: Users,         title: "Group Management",  desc: "Create groups, invite members, and manage roles easily.",   iconColor: "text-rose-500",   iconBg: "bg-rose-50"   },
];

export default function Features() {
  return (
    <section id="features" className="py-16">

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-600 mb-4">
          Features
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 lg:text-4xl">
          Everything Your Study Group Needs
        </h2>
        <p className="mt-3 text-base text-slate-400 max-w-md mx-auto">
          All the tools you need to collaborate and achieve more together.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className={`${feature.iconBg} w-11 h-11 rounded-xl flex items-center justify-center mb-4`}>
              <feature.icon size={22} className={feature.iconColor} />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

    </section>
  );
}