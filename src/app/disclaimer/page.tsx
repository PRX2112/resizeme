export default function DisclaimerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700/50 p-8 md:p-12 shadow-xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Disclaimer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        <strong>Last updated:</strong> May 27, 2026
                    </p>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">General Information</h2>
                        <p>
                            All the information on this website - <a href="https://resizeme.in">https://resizeme.in</a> - is published in good faith and for general information and utility purposes only. ResizeMe does not make any warranties about the completeness, reliability, and accuracy of this information or the output of our tools. Any action you take upon the information or processed images you find on this website is strictly at your own risk. ResizeMe will not be liable for any losses and/or damages in connection with the use of our website.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Image Processing</h2>
                        <p>
                            ResizeMe operates as a client-side tool, meaning all image processing happens directly within your web browser. While we strive to provide the highest quality compression and resizing algorithms, the final output quality, color accuracy, and file integrity are dependent on various factors including the original image format, your browser capabilities, and the specific settings chosen. We recommend keeping backups of your original, unprocessed images.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">External Links</h2>
                        <p>
                            From our website, you can visit other websites by following hyperlinks to such external sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites. Site owners and content may change without notice and may occur before we have the opportunity to remove a link which may have gone 'bad'.
                        </p>
                        <p>
                            Please be also aware that when you leave our website, other sites may have different privacy policies and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites as well as their "Terms of Service" before engaging in any business or uploading any information.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Consent</h2>
                        <p>
                            By using our website, you hereby consent to our disclaimer and agree to its terms.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Update</h2>
                        <p>
                            Should we update, amend or make any changes to this document, those changes will be prominently posted here.
                        </p>
                        
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-8">Contact Us</h2>
                        <p>
                            If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at <strong>handleresizeme@gmail.com</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
