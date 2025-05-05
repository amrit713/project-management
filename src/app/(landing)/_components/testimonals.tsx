import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export const testimonials = [
  {
    name: "Anika K.",
    designation: "Product Lead at ZenStack",
    quote:
      "PulseBoard streamlined our task management and helped us close sprints 30% faster. The AI suggestions are a game-changer.",
    src: "/img/person01.jpg",
  },
  {
    name: "Rahul M.",
    designation: "CTO at CodeBridge",
    quote:
      "The multi-workspace setup is exactly what our agency needed. It's simple, scalable, and extremely intuitive.",
    src: "/img/person02.jpg",
  },
  {
    name: "Lena W.",
    designation: "Project Manager at DevHive",
    quote:
      "Switching to PulseBoard improved visibility across all our projects. Real-time updates and task collaboration are top-notch.",
    src: "/img/person03.jpg",
  },
  {
    name: "Tom S.",
    designation: "CEO at Launchify",
    quote:
      "We love how easy billing and role management are with PulseBoard. Our whole team onboarded in under 30 minutes.",
    src: "/img/person04.jpg",
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
