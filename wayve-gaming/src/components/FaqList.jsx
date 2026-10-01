import { useState } from 'react';

export default function FaqList({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-white px-6 py-16 text-gray-900 dark:bg-black dark:text-white sm:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-gaming text-3xl text-gray-900 dark:text-white sm:text-5xl">
          <span className="text-primary-dark">Questions About </span> Waywe Gaming
        </h2>
        <p className="mt-3 max-w-4xl text-md leading-relaxed text-gray-900 dark:text-gray-100">
          Learn more about us, the types of games we create, our development experience, and how we approach each project. These answers cover the questions players, partners, and future team members may want to know clearly.
        </p>

        <div className="mt-7 space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`faq-glow-card overflow-hidden rounded-xl ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                >
                  <span>{item.question}</span>
                  <span className="text-xl font-normal text-primary">{isOpen ? '-' : '+'}</span>
                </button>
                {isOpen && (
                  <p className="border-t border-white/15 px-5 py-4 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
