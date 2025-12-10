import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { X } from 'lucide-react'

interface TermsOfServiceModalProps {
  isOpen: boolean
  onClose: () => void
}

const TermsOfServiceModal = ({ isOpen, onClose }: TermsOfServiceModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e7e8ea]">
          <DialogTitle className="text-2xl font-semibold text-[#131b31]">
            Terms of Service
          </DialogTitle>
          <p className="text-sm text-[#616675] mt-1">idto.ai</p>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6 text-sm text-[#616675] leading-relaxed">
            <p>
              These Terms of Service ("Terms") govern access to and use of the idto.ai platform, APIs, dashboards, and related services ("Services") provided by idto.ai ("idto.ai", "we", "our", or "us").
            </p>
            <p>
              By signing up, creating an account, or using the Services, you ("Merchant", "You", or "Your") agree to be bound by these Terms. If you do not agree, you must not access or use the Services.
            </p>

            <div className="space-y-4">
              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">1. Scope of Services</h3>
                <p>
                  idto.ai provides an identity orchestration and verification platform that enables merchants to build compliant user onboarding and verification journeys.
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                  <li>KYC and identity verifications (Aadhaar, PAN, CKYC, bank account verification)</li>
                  <li>Document and data validations</li>
                  <li>Face match and liveness checks</li>
                  <li>API-based verification workflows</li>
                  <li>Dashboard, reporting, and transaction logs</li>
                  <li>Integrations with third-party verification service providers</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">2. Eligibility and Authority</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You are a legally registered business entity or authorized representative.</li>
                  <li>You have authority to bind the entity to these Terms.</li>
                  <li>Your use of the Services is lawful and aligned with your business purpose.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">3. Account Registration and Security</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>You must provide accurate and complete onboarding information.</li>
                  <li>You are responsible for safeguarding account credentials and API keys.</li>
                  <li>All activity conducted through your account is your responsibility.</li>
                  <li>Unauthorized access must be reported immediately.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">4. Merchant Obligations</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Use the Services only for lawful onboarding and verification purposes.</li>
                  <li>Obtain valid consent from end users before submitting personal data.</li>
                  <li>Comply with DPDP Act, IT Act, and other applicable regulations.</li>
                  <li>Do not misuse, resell, or unlawfully retain verification data.</li>
                  <li>Maintain appropriate privacy policies for end users.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">5. Data Processing and Privacy</h3>
                <p>
                  idto.ai acts as a data processor, while you remain the data fiduciary/controller for end-user data. Data is processed strictly to provide the Services.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">6. Third-Party Dependencies</h3>
                <p>
                  Verification outcomes may depend on government databases and third-party providers. idto.ai does not guarantee uninterrupted availability.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">7. Fees and Billing</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Services operate on a prepaid wallet or agreed commercial model.</li>
                  <li>Fees are non-refundable once a request is initiated.</li>
                  <li>You are responsible for maintaining sufficient wallet balance.</li>
                  <li>Pricing may change with prior notice.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">8. Acceptable Use</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>No fraudulent or unlawful usage.</li>
                  <li>No circumvention of system controls.</li>
                  <li>No reverse engineering or resale.</li>
                  <li>No unlawful profiling of individuals.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">9. Suspension and Termination</h3>
                <p>
                  idto.ai may suspend or terminate accounts for breaches of these Terms or legal requirements. Outstanding dues must be cleared upon termination.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">10. Intellectual Property</h3>
                <p>
                  All platform intellectual property belongs to idto.ai. Merchants receive a limited, non-transferable license for internal business use.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">11. Disclaimer</h3>
                <p>
                  The Services are provided on an "as is" and "as available" basis without warranties of any kind.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">12. Limitation of Liability</h3>
                <p>
                  idto.ai's total liability shall not exceed the fees paid by you in the three (3) months preceding the event giving rise to the claim.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">13. Indemnity</h3>
                <p>
                  You agree to indemnify idto.ai against claims arising from misuse of the Services or legal non-compliance.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">14. Governing Law and Jurisdiction</h3>
                <p>
                  These Terms are governed by the laws of India. Courts in [Bengaluru / New Delhi] shall have exclusive jurisdiction.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">15. Amendments</h3>
                <p>
                  idto.ai may update these Terms from time to time. Continued use constitutes acceptance of revisions.
                </p>
              </section>

              <section>
                <h3 className="text-base font-semibold text-[#131b31] mb-2">16. Contact Information</h3>
                <p>
                  For questions regarding these Terms, contact: <a href="mailto:info@idto.ai" className="text-[#8a95ff] underline">info@idto.ai</a>
                </p>
              </section>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#e7e8ea] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#e6e8ff] text-[#0019ff] text-sm font-medium hover:opacity-90 transition"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TermsOfServiceModal
