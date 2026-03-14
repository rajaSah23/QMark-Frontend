import { Link } from 'react-router-dom';
import {
  IconActivityHeartbeat,
  IconBookmarks,
  IconChartHistogram,
  IconChevronRight,
  IconFiles,
  IconHourglassLow,
  IconRouteAltLeft,
} from '@tabler/icons-react';
import Content from './Content';
import HowItWorks from './HowItWorks';
import ScrollReveal from '../../components/ScrollReveal';

const featureBlocks = [
  {
    icon: IconFiles,
    title: 'Question Library',
    description: 'Subject-wise, topic-wise, searchable.',
  },
  {
    icon: IconHourglassLow,
    title: 'Quiz Practice',
    description: 'Timed attempts with review flow.',
  },
  {
    icon: IconChartHistogram,
    title: 'Learning Analytics',
    description: 'Activity, scores, question insights.',
  },
];

const focusItems = [
  {
    icon: IconBookmarks,
    title: 'Save what matters',
    description: 'Bookmark tricky questions and keep them close.',
  },
  {
    icon: IconRouteAltLeft,
    title: 'Come back with context',
    description: 'Review marked questions and weak areas faster.',
  },
  {
    icon: IconActivityHeartbeat,
    title: 'Study with feedback',
    description: 'Track how practice changes over time.',
  },
];

const HomePage = () => {
  return (
    <div className='min-h-screen bg-mine-shaft-950 font-["poppins"] pt-20 text-white'>
      <Content />
      <HowItWorks />

      <ScrollReveal className="px-4 pb-16 pt-16 md:px-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/50 px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">What you can do</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Keep the workflow clean from start to revision.</h2>
            </div>
            <Link
              to="/about"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-mine-shaft-700 bg-mine-shaft-950 px-5 py-3 text-sm font-medium text-white transition hover:border-mine-shaft-600 hover:bg-mine-shaft-900"
            >
              Learn more about QMark
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {featureBlocks.map((item, index) => {
              const Icon = item.icon;
              return (
                <ScrollReveal
                  key={item.title}
                  className="rounded-2xl border border-mine-shaft-800 bg-mine-shaft-950/70 p-5"
                  delay={index * 110}
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-bright-sun-400/12 p-3 text-bright-sun-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mine-shaft-300">{item.description}</p>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="px-4 pb-16 md:px-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/50 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">Built for repeat practice</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Less switching. More revision.</h2>
            </div>

            <div className="space-y-3">
              {focusItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal
                    key={item.title}
                    className="flex items-start gap-4 rounded-2xl border border-mine-shaft-800 bg-mine-shaft-950/70 p-4"
                    delay={index * 110}
                  >
                    <div className="rounded-2xl bg-bright-sun-400/12 p-3 text-bright-sun-300">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-mine-shaft-300">{item.description}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <Link
              to="/questions/analytics"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-mine-shaft-700 bg-mine-shaft-950 px-5 py-3 text-sm font-medium text-white transition hover:border-mine-shaft-600 hover:bg-mine-shaft-900"
            >
              View analytics
              <IconChevronRight size={16} />
            </Link>
          </div>

          <div className="flex justify-center lg:justify-end">
            <img
              src="/banner-image.png"
              alt="QMark learning flow"
              className="motion-float w-full max-w-xs sm:max-w-sm md:max-w-md"
            />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="px-4 pb-20 md:px-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-mine-shaft-800 bg-gradient-to-r from-mine-shaft-900/70 to-mine-shaft-900/40 px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">QMark thought</p>
              <h2 className="mt-2 text-3xl font-bold text-white">One workspace for the full MCQ cycle.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-mine-shaft-300 sm:text-base">
                Capture good questions, practice with discipline, and revisit the ones that still need work.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-xl border border-mine-shaft-700 bg-mine-shaft-950 px-5 py-3 text-sm font-medium text-white transition hover:border-mine-shaft-600 hover:bg-mine-shaft-900"
              >
                About QMark
              </Link>
              <Link
                to="/quiz"
                className="inline-flex items-center justify-center rounded-xl bg-bright-sun-400 px-5 py-3 text-sm font-semibold text-mine-shaft-950 transition hover:bg-bright-sun-300"
              >
                Start practicing
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default HomePage;
