export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="mb-3">
                When you visit AlgoMaster, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
              </p>
              <p>
                We collect this information to provide you with a better experience and to understand how our website is being used.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide, operate, and maintain our website</li>
                <li>To improve, personalize, and expand our website</li>
                <li>To understand and analyze how you use our website</li>
                <li>To develop new products, services, features, and functionality</li>
                <li>For advertising purposes (through Google AdSense)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Cookies and Tracking Technologies</h2>
              <p className="mb-3">
                We use cookies and similar tracking technologies to track the activity on our website and hold certain information.
              </p>
              <p className="mb-3">
                Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. Google AdSense</h2>
              <p className="mb-3">
                We use Google AdSense to display advertisements on our website. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites.
              </p>
              <p className="mb-3">
                You may opt out of personalized advertising by visiting Google's Ads Settings at: 
                <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline ml-1">
                  https://www.google.com/settings/ads
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Google Analytics</h2>
              <p className="mb-3">
                We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies.
              </p>
              <p>
                You can opt-out of Google Analytics by installing the Google Analytics opt-out browser add-on.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Data Security</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Children's Privacy</h2>
              <p>
                Our website is intended for use by students and educational purposes. We do not knowingly collect personally identifiable information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Email: privacy@algomaster.com</li>
                <li>Website: https://algomaster.com/contact</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
