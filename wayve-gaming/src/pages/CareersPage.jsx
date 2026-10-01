import { useState } from 'react';
import PageHero from '../components/PageHero';
import { addStoredItem, createClientSubmission, readJsonResponse, productionApiMessage } from '../utils/api';
import careerHero from '../assets/extras/career-hero.webp'

const STEPS = ['Role', 'About You', 'Experience', 'Review'];
const INITIAL_FORM = {
  role: '',
  userName: '',
  email: '',
  location: '',
  experience: '',
  portfolio: '',
  message: '',
};

const FIELD_CLASS = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-500 outline-none transition focus:border-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder-gray-500';

export default function CareersPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const canContinue = () => {
    if (step === 0) return Boolean(form.role);
    if (step === 1) return Boolean(form.userName && form.email && form.location);
    if (step === 2) return Boolean(form.experience && form.message);
    return true;
  };

  const nextStep = (event) => {
    event.preventDefault();
    if (!canContinue()) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const submitApplication = async (event) => {
    event.preventDefault();
    setSubmitError('');

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      await readJsonResponse(response, productionApiMessage('Submitting applications'));
      setSubmitted(true);
    } catch (error) {
      if (error.message === productionApiMessage('Submitting applications')) {
        addStoredItem('wayve:applications', createClientSubmission('application', form));
        setSubmitted(true);
        return;
      }
      setSubmitError(error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-black">
      <PageHero
        imagePath={careerHero}
        pageName="Careers"
        heading={<>Build the next <span className="text-primary-dark">big thing.</span></>}
        description="Bring your ideas, craft, and curiosity to a team making games players remember."
      />

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((label, index) => (
            <div key={label} className="flex flex-1 items-center gap-2">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${index <= step ? 'bg-primary-dark text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                {index + 1}
              </div>
              <span className={`hidden text-xs sm:block ${index <= step ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                {label}
              </span>
              {index < STEPS.length - 1 && <div className={`h-px flex-1 ${index < step ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`} />}
            </div>
          ))}
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-primary bg-orange-50 p-10 text-center dark:bg-gray-950">
            <i className="fas fa-check-circle text-4xl text-primary" />
            <h2 className="mt-5 font-gaming text-3xl text-gray-900 dark:text-white">Application received</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Thanks for reaching out, {form.userName}. Our team will review your application and get back to you soon.
            </p>
            <button type="button" onClick={() => { setForm(INITIAL_FORM); setStep(0); setSubmitted(false); }} className="btn-primary mt-7 rounded-lg px-6 py-3 text-sm font-semibold text-white">
              Send another application
            </button>
          </div>
        ) : (
          <form onSubmit={step === STEPS.length - 1 ? submitApplication : nextStep} className="rounded-2xl border border-gray-300 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-950 sm:p-10">
            {step === 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-dark">Step 1</p>
                <h2 className="mt-3 font-gaming text-3xl text-gray-900 dark:text-white">What role are you applying for?</h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {['Game Developer', 'Game Designer', '3D Artist', 'Project Manager'].map((role) => (
                    <label key={role} className={`cursor-pointer rounded-xl border p-5 transition ${form.role === role ? 'border-primary bg-orange-50 dark:bg-gray-900' : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-black'}`}>
                      <input type="radio" name="role" value={role} checked={form.role === role} onChange={updateField} className="sr-only" />
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{role}</span>
                      <span className="mt-2 block text-xs text-gray-600 dark:text-gray-400">Full time · Remote / On-site</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-dark">Step 2</p>
                <h2 className="mt-3 font-gaming text-3xl text-gray-900 dark:text-white">Tell us about yourself</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <input name="userName" value={form.userName} onChange={updateField} placeholder="Full name" className={FIELD_CLASS} required />
                  <input type="email" name="email" value={form.email} onChange={updateField} placeholder="Email address" className={FIELD_CLASS} required />
                  <input name="location" value={form.location} onChange={updateField} placeholder="City and country" className={`${FIELD_CLASS} sm:col-span-2`} required />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-primary-dark">Step 3</p>
                <h2 className="mt-3 font-gaming text-3xl text-gray-900 dark:text-white">Show us your experience</h2>
                <div className="mt-8 space-y-4">
                  <select name="experience" value={form.experience} onChange={updateField} className={FIELD_CLASS} required>
                    <option value="">Years of relevant experience</option>
                    <option value="0-2 years">0-2 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="6+ years">6+ years</option>
                  </select>
                  <input name="portfolio" value={form.portfolio} onChange={updateField} placeholder="Portfolio or LinkedIn URL (optional)" className={FIELD_CLASS} />
                  <textarea name="message" value={form.message} onChange={updateField} placeholder="Tell us what you would love to build" rows={5} className={`${FIELD_CLASS} resize-none`} required />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-primary">Step 4</p>
                <h2 className="mt-3 font-gaming text-3xl text-gray-900 dark:text-white">Review your application</h2>
                <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-300 bg-white dark:divide-gray-800 dark:border-gray-700 dark:bg-black">
                  {[['Role', form.role], ['User Name', form.userName], ['Email', form.email], ['Location', form.location], ['Experience', form.experience], ['Portfolio', form.portfolio || 'Not provided'], ['Message', form.message]].map(([label, value]) => (
                    <div key={label} className="grid gap-2 px-5 py-4 sm:grid-cols-[140px_1fr]">
                      <span className="text-xs uppercase tracking-wide text-gray-500">{label}</span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button type="button" onClick={previousStep} disabled={step === 0} className="rounded-lg border border-gray-300 px-6 py-3 text-sm text-gray-700 transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300">
                Back
              </button>
              <button type="submit" className="btn-primary rounded-lg px-7 py-3 text-sm font-semibold text-white">
                {step === STEPS.length - 1 ? 'Submit Application' : 'Continue'}
                <i className={`fas ${step === STEPS.length - 1 ? 'fa-check' : 'fa-arrow-right'} ml-2`} />
              </button>
            </div>
            {submitError && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{submitError}</p>}
          </form>
        )}
      </section>
    </div>
  );
}
