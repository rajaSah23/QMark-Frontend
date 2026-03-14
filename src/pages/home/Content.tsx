import { Link } from 'react-router-dom';
import {
  IconBookmark,
  IconChartBar,
  IconChecklist,
} from '@tabler/icons-react';
import ScrollReveal from '../../components/ScrollReveal';

const quickStats = [
  {
    label: 'Save',
    value: 'Important MCQs',
    icon: IconBookmark,
  },
  {
    label: 'Practice',
    value: 'Timed quiz flow',
    icon: IconChecklist,
  },
  {
    label: 'Track',
    value: 'Performance patterns',
    icon: IconChartBar,
  },
];

const Content = () => {
  return (
    <ScrollReveal className="px-6 pt-14 text-white md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/60 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-10">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full border border-bright-sun-400/30 bg-bright-sun-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">
            QMark Workspace
          </span>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Your intelligent <span className="text-bright-sun-400">self-study</span> partner.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-mine-shaft-300 sm:text-base">
              Build your question bank, attempt quizzes with structure, and revise from clear signals instead of scattered notes.
            </p>
          </div>

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
              Start Quiz
            </Link>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {quickStats.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal
                  key={item.label}
                  className="rounded-2xl border border-mine-shaft-800 bg-mine-shaft-950/70 p-4"
                  delay={index * 100}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-bright-sun-400/12 p-2 text-bright-sun-300">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-bright-sun-300">{item.label}</p>
                      <p className="mt-1 text-sm leading-6 text-mine-shaft-300">{item.value}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/banner-image.png"
            alt="QMark study workspace"
            className="motion-float w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
          />
        </div>
      </div>
    </ScrollReveal>
  );
};

export default Content;
