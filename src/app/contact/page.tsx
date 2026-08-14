'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Send, MessageSquare, Clock, HelpCircle, Check, Copy, Shield, Sparkles, ExternalLink } from 'lucide-react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
    });
    const [copied, setCopied] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('handleresizeme@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mailSubject = encodeURIComponent(`[ResizeMe Contact] ${formData.subject} - from ${formData.name}`);
        const mailBody = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`
        );

        setSubmitted(true);
        window.location.href = `mailto:handleresizeme@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    };

    const topFaqs = [
        {
            q: 'Are my images uploaded to any server or database?',
            a: 'No. All core image manipulation operations run 100% locally on your computer or phone using HTML5 Canvas and WebAssembly. Batch serverless tasks are processed in ephemeral RAM without saving any files.',
        },
        {
            q: 'Is ResizeMe completely free to use?',
            a: 'Yes, 100% free with no hidden fees, subscriptions, or credit card requirements. All 11 tools are accessible without account registration.',
        },
        {
            q: 'What formats can I convert or resize?',
            a: 'We support JPG, JPEG, PNG, WebP, AVIF, GIF, and HEIC across our resizing, compression, and format conversion tools.',
        },
        {
            q: 'How do I report a bug or request a new tool?',
            a: 'Use the message form on this page or email us directly at handleresizeme@gmail.com with your browser version and problem details.',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-16 px-4">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <MessageSquare className="w-4 h-4" /> Support & Contact
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                        Get in Touch with Our Team
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                        Have questions about our tools, feedback, partnership proposals, or bug reports? We are here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Sidebar Information */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Direct Email Card */}
                        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                        Official Support Email
                                    </h2>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 mb-2">
                                        Direct inbox for all inquiries
                                    </p>
                                    <a
                                        href="mailto:handleresizeme@gmail.com"
                                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all block"
                                    >
                                        handleresizeme@gmail.com
                                    </a>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleCopyEmail}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/80 transition-colors"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-green-500" />
                                        <span>Email Copied to Clipboard!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        <span>Copy Email Address</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Response Time Card */}
                        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-600 dark:text-purple-400">
                                    <Clock className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                        Expected Response
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                                        We reply to all inquiries within <strong>24 to 48 hours</strong> on business days.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Assurance */}
                        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 flex items-center justify-center flex-shrink-0 text-teal-600 dark:text-teal-400">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                        Privacy Protection
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
                                        Your email address will only be used to respond to your specific request. We never share or sell contact details.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Policy Links */}
                        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl text-sm">
                            <h2 className="font-bold text-gray-900 dark:text-white mb-3">
                                Helpful Documentation
                            </h2>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between">
                                        <span>Privacy Policy</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between">
                                        <span>Terms of Service</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/cookie-policy" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between">
                                        <span>Cookie Policy</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between">
                                        <span>Legal Disclaimer</span>
                                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Send a Message
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Fill in the details below to dispatch your message directly to our engineering & support team.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                                            placeholder="Jane Doe"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                                            Your Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                                            placeholder="jane@example.com"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div>
                                    <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                                        Subject *
                                    </label>
                                    <select
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Bug Report / Error">Bug Report / Error</option>
                                        <option value="Feature Request">Feature Request / New Tool Suggestion</option>
                                        <option value="Business / Partnership">Business / Partnership</option>
                                        <option value="Privacy / GDPR / CCPA Inquiry">Privacy / GDPR / CCPA Inquiry</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm outline-none resize-none"
                                        placeholder="Please provide as much detail as possible (including tool used and error details if reporting a bug)..."
                                    />
                                </div>

                                {/* Status Feedback */}
                                {submitted && (
                                    <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-300 text-sm flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="font-semibold">Email application opened.</p>
                                            <p className="text-xs text-green-800 dark:text-green-400 mt-1">
                                                If your mail client didn't launch automatically, send your message directly to{' '}
                                                <a href="mailto:handleresizeme@gmail.com" className="underline font-bold">handleresizeme@gmail.com</a>.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send Message via Email</span>
                                </button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    By submitting this form, you acknowledge our{' '}
                                    <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* FAQ Section with Direct Link to Homepage FAQ */}
                <div className="bg-white dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-10 shadow-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                                <HelpCircle className="w-4 h-4" /> Quick Answers
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <Link
                            href="/#faq"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors self-start sm:self-auto"
                        >
                            <span>View All FAQs on Home</span>
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {topFaqs.map((faq, i) => (
                            <div key={i} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base mb-2 flex items-start gap-2">
                                    <span className="text-purple-600 dark:text-purple-400">Q:</span>
                                    <span>{faq.q}</span>
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed pl-6">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
