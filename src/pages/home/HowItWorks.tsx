import {
  IconBook2,
  IconClockPlay,
  IconTargetArrow,
} from '@tabler/icons-react';
import ScrollReveal from '../../components/ScrollReveal';

const steps = [
  {
    icon: IconBook2,
    title: 'Build your own question base',
    description: 'Add, filter, bookmark.',
  },
  {
    icon: IconClockPlay,
    title: 'Attempt quizzes with control',
    description: 'Timer, review, resubmit.',
  },
  {
    icon: IconTargetArrow,
    title: 'Study from real signals',
    description: 'Activity, scores, patterns.',
  },
];

const HowItWorks = () => {
  return (
    <ScrollReveal className="px-4 pt-16 text-white md:px-12">
      <div className="mx-auto grid max-w-6xl items-center gap-10 rounded-3xl border border-mine-shaft-800 bg-mine-shaft-900/50 px-6 py-8 sm:px-8 lg:grid-cols-2 lg:px-10">
        <div className="flex justify-center lg:justify-start">
          <img
            src="/man-with-laptop.png"
            alt="Using QMark for revision"
            className="motion-float w-full max-w-xs sm:max-w-sm md:max-w-md"
          />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-bright-sun-300">How it works</p>
            <h2 className="text-3xl font-bold text-white md:text-4xl">
              A simple loop for consistent practice.
            </h2>
            <p className="max-w-xl text-sm leading-7 text-mine-shaft-300 sm:text-base">
              Collect, attempt, review, repeat.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <ScrollReveal
                  key={step.title}
                  className="flex gap-4 rounded-2xl border border-mine-shaft-800 bg-mine-shaft-950/70 p-4"
                  delay={index * 110}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bright-sun-400/12 text-bright-sun-300">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-bright-sun-400 text-xs font-semibold text-mine-shaft-950">
                        {index + 1}
                      </span>
                      <h3 className="text-base font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-mine-shaft-300">{step.description}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default HowItWorks;
