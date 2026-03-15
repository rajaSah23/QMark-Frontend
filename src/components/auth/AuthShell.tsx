import React from 'react';

type AuthShellProps = {
  title: string;
  subtitle: string;
  asideTitle: string;
  asideDescription: string;
  asidePoints: string[];
  children: React.ReactNode;
  footer?: React.ReactNode;
};

const AuthShell = ({
  title,
  subtitle,
  asideTitle,
  asideDescription,
  asidePoints,
  children,
  footer,
}: AuthShellProps) => {
  return (
    <div className="min-h-screen bg-mine-shaft-950 px-4 py-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-[32px] border border-mine-shaft-800 bg-mine-shaft-900/90 shadow-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden border-r border-mine-shaft-800 bg-gradient-to-br from-mine-shaft-950 via-mine-shaft-900 to-mine-shaft-800 p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(242,105,105,0.16),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(242,105,105,0.08),transparent_32%)]" />
          <div className="relative z-10">
            <div className="text-3xl font-bold text-bright-sun-400">
              Q<span className="text-white">Mark</span>
            </div>
            <p className="mt-2 max-w-sm text-sm leading-7 text-mine-shaft-300">
              Questions, quizzes, and revision in one focused workspace.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <img
              src="/signin-banner.png"
              alt="QMark authentication"
              className="mx-auto w-full max-w-md"
            />

            <div>
              <h2 className="text-3xl font-semibold text-white">{asideTitle}</h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-mine-shaft-300">{asideDescription}</p>
            </div>

            <div className="space-y-3">
              {asidePoints.map((point) => (
                <div
                  key={point}
                  className="rounded-2xl border border-mine-shaft-700 bg-mine-shaft-900/70 px-4 py-3 text-sm text-mine-shaft-200"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-mine-shaft-900/90 p-5 sm:p-8">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-3 text-2xl font-bold text-bright-sun-400 lg:hidden">
                Q<span className="text-white">Mark</span>
              </div>
              <h1 className="text-3xl font-semibold text-white">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-mine-shaft-300">{subtitle}</p>
            </div>

            {children}

            {footer && <div className="mt-6">{footer}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthShell;
