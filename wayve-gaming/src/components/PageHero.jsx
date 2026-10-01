export default function PageHero({ imagePath, pageName, heading, description }) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 py-16 sm:px-10 lg:px-12"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, .7), rgba(0, 0, 0, .1)), url('${imagePath}')`,
      }}
    >
      <div className="relative mx-auto max-w-6xl mt-[80px]">
        <p className="mb-4 text-xs uppercase tracking-wide text-primary">- {pageName}</p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight sm:text-5xl text-white">{heading}</h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-gray-300">{description}</p>
      </div>
    </section>
  );
}
