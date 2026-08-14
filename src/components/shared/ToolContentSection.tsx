import React from 'react';
import Link from 'next/link';
import {
    CheckCircle2,
    HelpCircle,
    Sliders,
    Sparkles,
    ShieldCheck,
    Layers,
    BookOpen,
    Info,
    Zap,
    Cpu,
    ArrowRight,
    Lock
} from 'lucide-react';

export interface HowToStep {
    step: number;
    title: string;
    text: string;
}

export interface ToolFeature {
    title: string;
    description: string;
    icon?: string;
}

export interface TechnicalSpec {
    label: string;
    value: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface EducationalSection {
    title: string;
    badge?: string;
    paragraphs: string[];
    keyTakeaways?: string[];
}

export interface ToolContentSectionProps {
    title: string;
    subtitle?: string;
    description: string;
    howToSteps: HowToStep[];
    features: ToolFeature[];
    technicalSpecsTable?: TechnicalSpec[];
    educationalSections?: EducationalSection[];
    faqs: FAQItem[];
    relatedUseCases?: Array<{ title: string; description: string }>;
    canonicalUrl?: string;
}

export default function ToolContentSection({
    title,
    subtitle,
    description,
    howToSteps,
    features,
    technicalSpecsTable,
    educationalSections,
    faqs,
    relatedUseCases,
    canonicalUrl,
}: ToolContentSectionProps) {
    // SoftwareApplication JSON-LD Schema
    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": `ResizeMe ${title}`,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any (Web Browser)",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
        },
        "description": description,
        "url": canonicalUrl || "https://resizeme.in",
        "provider": {
            "@type": "Organization",
            "name": "ResizeMe",
            "url": "https://resizeme.in",
            "logo": "https://resizeme.in/logo.png"
        }
    };

    // FAQPage JSON-LD Schema
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    };

    return (
        <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-gray-800 dark:text-gray-200">
            {/* Structured Data (JSON-LD) for SEO & AdSense compliance */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Top Overview & Editorial Intro */}
            <header className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-200/60 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>Free Professional Tool</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {subtitle || `Complete Guide to ${title}`}
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                </p>
            </header>

            {/* How-To Step-by-Step Guide */}
            <section className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        <Sliders className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            How to Use the {title} Online
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Follow these easy steps to process your images in seconds
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {howToSteps.map((step) => (
                        <div
                            key={step.step}
                            className="relative p-5 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 flex flex-col justify-between hover:border-blue-500/40 transition-colors group"
                        >
                            <div className="space-y-2.5">
                                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-md group-hover:scale-105 transition-transform">
                                    {step.step}
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-base">
                                    {step.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {step.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Features & Highlights */}
            <section className="space-y-6">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Key Features & Capabilities
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Engineered with modern web technologies for uncompromising speed and clarity.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="p-6 rounded-2xl bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg transition-all space-y-3"
                        >
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-lg">
                                {feature.icon || <Zap className="w-5 h-5" />}
                            </div>
                            <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                {feature.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Deep-Dive Educational Articles & Tech Explanations (Substantive Content for AdSense) */}
            {educationalSections && educationalSections.length > 0 && (
                <section className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-xs font-semibold uppercase tracking-wider">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>In-Depth Educational Guide</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Technical Deep Dive & Best Practices
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {educationalSections.map((section, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-lg space-y-4"
                            >
                                {section.badge && (
                                    <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold">
                                        {section.badge}
                                    </span>
                                )}
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {section.title}
                                </h4>
                                <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {section.paragraphs.map((p, pIdx) => (
                                        <p key={pIdx}>{p}</p>
                                    ))}
                                </div>

                                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                                    <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/70 dark:border-gray-700/60 space-y-2">
                                        <h5 className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                                            <Info className="w-3.5 h-3.5 text-blue-500" />
                                            <span>Key Takeaways</span>
                                        </h5>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                            {section.keyTakeaways.map((item, tIdx) => (
                                                <li key={tIdx} className="flex items-start gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Technical Specifications Table */}
            {technicalSpecsTable && technicalSpecsTable.length > 0 && (
                <section className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Technical Specifications & Engine Details
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Platform capabilities, format support, and algorithm parameters
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-800/60 text-gray-900 dark:text-white font-semibold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-5 py-3.5 w-1/3">Specification</th>
                                    <th className="px-5 py-3.5">Details & Standards</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {technicalSpecsTable.map((spec, sIdx) => (
                                    <tr
                                        key={sIdx}
                                        className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">
                                            {spec.label}
                                        </td>
                                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">
                                            {spec.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Related Real-World Use Cases */}
            {relatedUseCases && relatedUseCases.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Common Real-World Use Cases
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {relatedUseCases.map((uc, uIdx) => (
                            <div
                                key={uIdx}
                                className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md space-y-1"
                            >
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                    <span>{uc.title}</span>
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {uc.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Privacy & Security Guarantee Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                        <Lock className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-base">
                            100% Client-Side Privacy Guarantee
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            Files are processed in your browser memory. We never store, inspect, or retain user media on remote servers.
                        </p>
                    </div>
                </div>
                <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm self-start sm:self-auto flex-shrink-0"
                >
                    <span>Read Privacy Policy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* Frequently Asked Questions (FAQ Section) */}
            <section className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            Frequently Asked Questions
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            Everything you need to know about using the {title}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50 space-y-2"
                        >
                            <h4 className="text-base font-bold text-gray-900 dark:text-white flex items-start gap-2">
                                <span className="text-purple-600 dark:text-purple-400 font-extrabold">Q:</span>
                                <span>{faq.question}</span>
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-6">
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </article>
    );
}
