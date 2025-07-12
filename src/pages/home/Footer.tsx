import { IconBrandInstagram, IconBrandTwitter, IconBrandYoutube } from '@tabler/icons-react';

const data = [
  {
    title: 'About',
    links: [
      { label: 'Features', link: '#' },
      { label: 'Pricing', link: '#' },
      { label: 'Support', link: '#' },
      { label: 'Forums', link: '#' },
    ],
  },
  {
    title: 'Project',
    links: [
      { label: 'Contribute', link: '#' },
      { label: 'Media assets', link: '#' },
      { label: 'Changelog', link: '#' },
      { label: 'Releases', link: '#' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Join Discord', link: '#' },
      { label: 'Follow on Twitter', link: '#' },
      { label: 'Email newsletter', link: '#' },
      { label: 'GitHub discussions', link: '#' },
    ],
  },
];

export function FooterLinks() {
  if(window.location.pathname.includes("questions")) return null;
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <a
        key={index}
        href={link.link}
        onClick={(event) => event.preventDefault()}
        className="block text-sm text-mine-shaft-400 hover:text-bright-sun-400 py-1"
      >
        {link.label}
      </a>
    ));

    return (
      <div key={group.title} className="w-40">
        <h3 className="text-lg font-bold mb-2 text-bright-sun-400">{group.title}</h3>
        {links}
      </div>
    );
  });

  return (
    <footer className="pt-16 pb-16 bg-mine-shaft-950  border-mine-shaft-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start">
        <div className="max-w-[200px] mb-8 sm:mb-0">
          <h2 className="text-4xl font-bold "> <span className='text-bright-sun-400'> Q </span> Mark</h2>
          <p className="mt-1 text-xs text-mine-shaft-400 text-center sm:text-left">
            Save important MCQs. Revise efficiently. Master your exams with ease.
          </p>
        </div>
        <div className="flex flex-wrap gap-8 sm:gap-16">{groups}</div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-4  border-t border-mine-shaft-800 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-sm text-mine-shaft-400 mb-4 sm:mb-0">
          © 2025 theqmark.in. All rights reserved.
        </p>
        <div className="flex space-x-4">
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="text-mine-shaft-400 hover:text-bright-sun-400"
          >
            <IconBrandTwitter size={18} stroke={1.5} />
          </a>
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="text-mine-shaft-400 hover:text-bright-sun-400"
          >
            <IconBrandYoutube size={18} stroke={1.5} />
          </a>
          <a
            href="#"
            onClick={(event) => event.preventDefault()}
            className="text-mine-shaft-400 hover:text-bright-sun-400"
          >
            <IconBrandInstagram size={18} stroke={1.5} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default FooterLinks;