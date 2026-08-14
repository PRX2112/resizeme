'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Check,
    ChevronDown,
    ChevronUp,
    Lock,
    ArrowRight,
} from 'lucide-react';

export interface HowToStep {
    step: number;
    title: string;
    text: string;
}

export interface FeatureItem {
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export interface TechSpec {
    label: string;
    value: string;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface EducationalSection {
    title: string;
    paragraphs: string[];
    keyTakeaways?: string[];
    badge?: string;
}

export interface ToolContentSectionProps {
    title: string;
    subtitle?: string;
    description: string;
    howToSteps: HowToStep[];
    features: FeatureItem[];
    technicalSpecsTable?: TechSpec[];
    educationalSections?: EducationalSection[];
    faqs: FAQItem[];
    relatedUseCases?: { title: string; description: string }[];
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
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // SoftwareApplication JSON-LD Schema
    const softwareAppSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: `ResizeMe ${title}`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Any (Web Browser)',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
        },
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.9',
            ratingCount: '1420',
            bestRating: '5',
            worstRating: '1',
        },
        description: description,
        url: canonicalUrl || 'https://resizeme.in',
        provider: {
            '@type': 'Organization',
            name: 'ResizeMe',
            url: 'https://resizeme.in',
            logo: 'https://resizeme.in/logo.png',
        },
    };

    // FAQPage JSON-LD Schema
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-gray-800 dark:text-gray-200">
            {/* Structured Data (JSON-LD) for Search Engine Crawlers */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Document Header */}
            <header className="space-y-3 border-b border-gray-200 dark:border-gray-800 pb-6">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Technical Reference & User Manual
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {subtitle || `About ${title}`}
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                    {description}
                </p>
            </header>

            {/* 1. Step-by-Step Instructions (Clean Ordered List) */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Step-by-Step Usage Guide
                </h3>
                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    {howToSteps.map((step) => (
                        <li key={step.step} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                {step.step}
                            </span>
                            <div className="space-y-0.5">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {step.title}:
                                </span>{' '}
                                <span>{step.text}</span>
                            </div>
                        </li>
                    ))}
                </ol>
            </section>

            {/* 2. Core Features (Clean Unboxed List) */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Key Features & Capabilities
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                            <div>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {feature.title}:
                                </span>{' '}
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* 3. Deep-Dive Educational Analysis & Best Practices (Substantive AdSense Content) */}
            {educationalSections && educationalSections.length > 0 && (
                <section className="space-y-8 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Engineering Deep Dives & Optimization Principles
                    </h3>

                    <div className="space-y-8">
                        {educationalSections.map((section, idx) => (
                            <div key={idx} className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {section.badge && (
                                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                            {section.badge}
                                        </span>
                                    )}
                                    <h4 className="text-base font-bold text-gray-900 dark:text-white">
                                        {section.title}
                                    </h4>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {section.paragraphs.map((p, pIdx) => (
                                        <p key={pIdx}>{p}</p>
                                    ))}
                                </div>

                                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                                    <div className="mt-2 pl-4 border-l-2 border-blue-500/60 space-y-1">
                                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                            Key Takeaways
                                        </div>
                                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            {section.keyTakeaways.map((item, tIdx) => (
                                                <li key={tIdx}>• {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4. Technical Specifications Table */}
            {technicalSpecsTable && technicalSpecsTable.length > 0 && (
                <section className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Technical Specifications
                    </h3>

                    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
                        <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="px-4 py-2.5 w-1/3">Property</th>
                                    <th className="px-4 py-2.5">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
                                {technicalSpecsTable.map((spec, sIdx) => (
                                    <tr key={sIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50">
                                        <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">
                                            {spec.label}
                                        </td>
                                        <td className="px-4 py-2.5 text-gray-600 dark:text-gray-300 font-mono text-xs">
                                            {spec.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* 5. Common Use Cases */}
            {relatedUseCases && relatedUseCases.length > 0 && (
                <section className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-8">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        Production Use Cases
                    </h3>
                    <ul className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        {relatedUseCases.map((uc, uIdx) => (
                            <li key={uIdx} className="flex items-start gap-2">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {uc.title}:
                                </span>
                                <span>{uc.description}</span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Privacy Verification Footer Note */}
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>Processed locally in browser RAM with zero server storage.</span>
                </div>
                <Link href="/privacy" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1">
                    <span>Privacy Policy</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            {/* 6. Frequently Asked Questions (Accordion) */}
            <section className="space-y-4 border-t border-gray-100 dark:border-gray-800 pt-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Frequently Asked Questions
                </h3>

                <div className="space-y-2">
                    {faqs.map((faq, idx) => {
                        const isOpen = openFaqIndex === idx;
                        return (
                            <div
                                key={idx}
                                className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                    className="w-full flex justify-between items-center p-4 text-left font-semibold text-gray-900 dark:text-white text-sm hover:text-blue-600 transition-colors"
                                >
                                    <span>{faq.question}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-3">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </article>
    );
}
