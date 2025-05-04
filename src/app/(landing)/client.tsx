import React from "react";

export function Client() {
  return (
    <div className="bg-white text-gray-900">
      {/* Hero */}
      <section className="py-24 px-6 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h1 className="text-5xl font-bold mb-4">
          Manage Projects with Clarity
        </h1>
        <p className="text-xl mb-6 max-w-xl mx-auto">
          PulseBoard helps teams plan, track, and deliver better—together.
        </p>
        <a
          href="/signup"
          className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-xl shadow-lg hover:bg-gray-100 transition"
        >
          Get Started Free →
        </a>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-12">Why PulseBoard?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {[
            {
              title: "Multi-Workspace",
              desc: "Switch between multiple workspaces seamlessly.",
            },
            {
              title: "AI Assistant",
              desc: "Smart suggestions, summaries, and due dates powered by AI.",
            },
            {
              title: "Real-Time Collaboration",
              desc: "Update tasks and projects in real time with your team.",
            },
            {
              title: "Granular Roles",
              desc: "Assign roles and permissions per workspace.",
            },
            {
              title: "Billing Built-In",
              desc: "Subscription support with Stripe integration.",
            },
            {
              title: "Secure & Scalable",
              desc: "Built with Prisma, PostgreSQL, and Vercel.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 transition"
            >
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Simple Pricing</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          <div className="border rounded-2xl p-8 shadow-sm bg-white">
            <h3 className="text-xl font-bold mb-4">Free</h3>
            <p className="text-4xl font-bold mb-4">$0</p>
            <p className="mb-4 text-gray-600">
              For individuals and small teams
            </p>
            <ul className="text-left mb-6">
              <li>✓ 1 workspace</li>
              <li>✓ 5 members</li>
              <li>✓ AI summaries</li>
            </ul>
            <a
              href="/signup"
              className="block bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold"
            >
              Start Free
            </a>
          </div>
          <div className="border-2 border-indigo-600 rounded-2xl p-8 bg-white shadow-lg">
            <h3 className="text-xl font-bold mb-4">Pro</h3>
            <p className="text-4xl font-bold mb-4">
              $10<span className="text-lg">/user</span>
            </p>
            <p className="mb-4 text-gray-600">
              For growing teams & AI power users
            </p>
            <ul className="text-left mb-6">
              <li>✓ Unlimited workspaces</li>
              <li>✓ Unlimited members</li>
              <li>✓ Priority AI + Slack integration</li>
            </ul>
            <a
              href="/signup"
              className="block bg-indigo-600 text-white py-2 px-4 rounded-xl font-semibold"
            >
              Upgrade Now
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-10">What Our Users Say</h2>
        <div className="bg-white rounded-2xl shadow p-8 italic text-gray-700">
          “PulseBoard helped us manage sprints more efficiently and the AI
          assistant saves us hours every week.”
          <div className="mt-4 text-right font-semibold">
            – Aayush Shrestha, Project Manager
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-10 text-center text-sm text-gray-500">
        <div>© 2025 PulseBoard. Built with 💡 by your team.</div>
        <div className="mt-2">
          <a href="/privacy" className="underline">
            Privacy
          </a>{" "}
          ·{" "}
          <a href="/terms" className="underline">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
