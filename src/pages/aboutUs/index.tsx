import { Link } from 'react-router-dom';
import {
  IconBulb,
  IconLayersIntersect,
  IconTargetArrow,
} from '@tabler/icons-react';
import ScrollReveal from '../../components/ScrollReveal';

const highlights = [
  {
    icon: IconBulb,
    title: 'The problem',
    description: 'Important questions get lost across too many places.',
  },
  {
    icon: IconLayersIntersect,
    title: 'The solution',
    description: 'QMark keeps practice and revision in one flow.',
  },
  {
    icon: IconTargetArrow,
    title: 'The result',
    description: 'Cleaner preparation and faster repeat practice.',
  },
];

const capabilities = [
  'Build and manage your own question library',
  'Filter questions subject-wise and topic-wise',
  'Attempt quizzes with timer and review control',
  'Track activity and quiz performance over time',
  'Inspect question-level interaction patterns',
  'Revisit weak or important questions faster',
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-mine-shaft-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <ScrollReveal className="grid items-center gap-10 rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/60 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">About QMark</p>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              QMark is built to make MCQ preparation cleaner, more trackable, and easier to repeat.
            </h1>
            <p className="text-sm leading-7 text-mine-shaft-300 sm:text-base">
              Instead of treating questions, quizzes, and revision as separate tasks, QMark connects them into one
              workflow so users can practice with more clarity and less friction.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/questions"
                className="inline-flex items-center justify-center rounded-xl bg-bright-sun-400 px-5 py-3 text-sm font-semibold text-mine-shaft-950 transition hover:bg-bright-sun-300"
              >
                Explore Questions
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center rounded-xl border border-mine-shaft-700 bg-mine-shaft-950 px-5 py-3 text-sm font-medium text-white transition hover:border-mine-shaft-600 hover:bg-mine-shaft-900"
              >
                Go to Quiz
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/man-with-laptop.png"
              alt="About QMark"
              className="motion-float w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </ScrollReveal>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <ScrollReveal
                key={item.title}
                className="rounded-2xl border border-mine-shaft-800 bg-mine-shaft-900/50 p-5"
                delay={index * 110}
              >
                <div className="mb-4 inline-flex rounded-2xl bg-bright-sun-400/12 p-3 text-bright-sun-300">
                  <Icon size={20} />
                </div>
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-mine-shaft-300">{item.description}</p>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal className="grid gap-6 rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/50 px-6 py-8 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">What the platform covers</p>
            <h2 className="mt-2 text-3xl font-bold text-white">A practical workspace for repeat practice.</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-mine-shaft-300 sm:text-base">
              QMark is useful when preparation depends on collecting the right questions, attempting regularly, and
              looking back at your own performance without maintaining separate systems.
            </p>
          </div>

          <div className="grid gap-3">
            {capabilities.map((item, index) => (
              <ScrollReveal
                key={item}
                className="rounded-2xl border border-mine-shaft-800 bg-mine-shaft-950/70 px-4 py-3 text-sm leading-6 text-mine-shaft-200"
                delay={index * 90}
              >
                {item}
              </ScrollReveal>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default AboutUs;
