import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export const testimonials = [
  {
    name: "Anika K.",
    designation: "Product Lead at ZenStack",
    quote:
      "PulseBoard streamlined our task management and helped us close sprints 30% faster. The AI suggestions are a game-changer.",
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Rahul M.",
    designation: "CTO at CodeBridge",
    quote:
      "The multi-workspace setup is exactly what our agency needed. It's simple, scalable, and extremely intuitive.",
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Lena W.",
    designation: "Project Manager at DevHive",
    quote:
      "Switching to PulseBoard improved visibility across all our projects. Real-time updates and task collaboration are top-notch.",
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Tom S.",
    designation: "CEO at Launchify",
    quote:
      "We love how easy billing and role management are with PulseBoard. Our whole team onboarded in under 30 minutes.",
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const Testimonals = () => {
  return (
    <section className="py-16">
      <h1 className="text-balance text-4xl font-semibold lg:text-5xl text-center">
        Join Thousand of Happy Customer
      </h1>
      <AnimatedTestimonials testimonials={testimonials} />;
    </section>
  );
};
