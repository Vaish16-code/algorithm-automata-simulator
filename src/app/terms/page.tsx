export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
              <p>
                By accessing and using AlgoMaster ("we," "our," or "us"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
              <p className="mb-3">
                AlgoMaster is an educational platform that provides interactive algorithm simulations and learning tools for computer science students.
              </p>
              <p>
                Our services include but are not limited to: algorithm visualizations, educational content, practice problems, and study materials.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">3. Educational Use</h2>
              <p>
                This website is intended for educational purposes only. The content provided is for learning algorithms, data structures, and computer science concepts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">4. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Use the website for educational purposes only</li>
                <li>Do not attempt to reverse engineer or copy our algorithms</li>
                <li>Respect intellectual property rights</li>
                <li>Do not use the service for any illegal activities</li>
                <li>Provide accurate information when required</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">5. Intellectual Property Rights</h2>
              <p className="mb-3">
                The service and its original content, features, and functionality are and will remain the exclusive property of AlgoMaster and its licensors.
              </p>
              <p>
                The service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">6. Advertising</h2>
              <p>
                We may display advertisements on our website. These advertisements may be targeted based on your interests and browsing behavior.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">7. Disclaimer</h2>
              <p className="mb-3">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Excludes all representations and warranties relating to this website and its contents</li>
                <li>Does not guarantee the accuracy of educational content</li>
                <li>Will not be liable for any damages arising from use of this website</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>
                In no event shall AlgoMaster, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">9. Termination</h2>
              <p>
                We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">10. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">11. Governing Law</h2>
              <p>
                These Terms shall be interpreted and governed by the laws of India, and you submit to the jurisdiction of the state and federal courts located in Mumbai, India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Email: help.algomaster@gmail.com</li>
                <li>Website: https://algomaster.com/contact</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
