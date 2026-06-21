import { useState } from "react"
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, Download, FileText, FileUp, HelpCircle, LoaderCircle, LockKeyhole, Mail, MessageSquareText, Phone, Save, ShieldCheck, X } from "lucide-react"
import { useUserProfileStore } from "@/store/userProfileStore"
import idtoLogo from "@/assets/idto-logo.svg"

interface SignatoryChoiceFormProps {
  onNext: () => void
  onPrevious?: () => void
  isLoading?: boolean
}

type SignatoryChoice = 'self' | 'other'
type SignatoryPhase = 'choice' | 'invite-signatory' | 'board-resolution' | 'methods' | 'digilocker-handoff' | 'digilocker-waiting' | 'aadhaar-otp' | 'upload-aadhaar' | 'pan-verification-methods' | 'personal-pan-digital'
type VerificationMethod = 'digilocker' | 'aadhaar-otp' | 'upload-aadhaar'
type PanVerificationMethod = 'auto-pan' | 'upload-pan'
type AadhaarSide = 'front' | 'back'
type ResolutionFileKind = 'board' | 'cin'
type AadhaarUploadError = {
  id: string
  side: AadhaarSide
  title: string
  description: string
  action: string
}

const DIGILOCKER_URL = 'https://digilocker.meripehchaan.gov.in/'

const SignatoryChoiceForm = ({ onNext, onPrevious, isLoading = false }: SignatoryChoiceFormProps) => {
  const userProfile = useUserProfileStore((state) => state.data)
  const [choice, setChoice] = useState<SignatoryChoice>('self')
  const [phase, setPhase] = useState<SignatoryPhase>('choice')
  const [method, setMethod] = useState<VerificationMethod>('digilocker')
  const [aadhaarNumber, setAadhaarNumber] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState<File | null>(null)
  const [aadhaarBackFile, setAadhaarBackFile] = useState<File | null>(null)
  const [aadhaarUploadErrors, setAadhaarUploadErrors] = useState<AadhaarUploadError[]>([])
  const [panMethod, setPanMethod] = useState<PanVerificationMethod>('auto-pan')
  const [personalPan, setPersonalPan] = useState('')
  const [isPersonalPanVerified, setIsPersonalPanVerified] = useState(false)
  const [invitee, setInvitee] = useState({
    name: '',
    designation: '',
    email: '',
    mobile: ''
  })
  const [boardResolutionFile, setBoardResolutionFile] = useState<File | null>(null)
  const [cinCertificateFile, setCinCertificateFile] = useState<File | null>(null)
  const [boardResolutionError, setBoardResolutionError] = useState('')

  const progressItems = [
    ['1', 'Company basics', true, false],
    ['2', 'PAN & GST', true, false],
    ['3', 'Authorized signatory', false, true],
    ['4', 'Bank & review', false, false],
  ] as const

  const userName = userProfile?.name || 'Riya Sharma'
  const userEmail = userProfile?.email || 'riya@acmepay.com'
  const progress = phase === 'board-resolution' ? 78 : phase === 'personal-pan-digital' ? 70 : phase === 'pan-verification-methods' ? 58 : phase === 'digilocker-handoff' || phase === 'digilocker-waiting' || phase === 'aadhaar-otp' || phase === 'upload-aadhaar' ? 62 : phase === 'methods' ? 58 : phase === 'invite-signatory' ? 55 : 52
  const aadhaarDigits = aadhaarNumber.replace(/\D/g, '')
  const isAadhaarValid = aadhaarDigits.length === 12
  const otpDigits = otpCode.replace(/\D/g, '').slice(0, 6)
  const isOtpReady = otpDigits.length === 6
  const isPersonalPanValid = /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(personalPan)
  const isInviteeValid = invitee.name.trim().length > 1
    && invitee.designation.trim().length > 1
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitee.email)
    && invitee.mobile.replace(/\D/g, '').length >= 10

  const handleBack = () => {
    if (phase === 'board-resolution') {
      setPhase('invite-signatory')
      return
    }

    if (phase === 'invite-signatory') {
      setPhase('choice')
      return
    }

    if (phase === 'personal-pan-digital') {
      setPhase('pan-verification-methods')
      return
    }

    if (phase === 'pan-verification-methods') {
      setPhase('methods')
      return
    }

    if (phase === 'digilocker-handoff' || phase === 'digilocker-waiting' || phase === 'aadhaar-otp' || phase === 'upload-aadhaar') {
      setPhase('methods')
      return
    }

    if (phase === 'methods') {
      setPhase('choice')
      return
    }

    onPrevious?.()
  }

  const handleContinue = () => {
    if (phase === 'choice') {
      if (choice === 'other') {
        setPhase('invite-signatory')
        return
      }

      setPhase('methods')
      return
    }

    if (phase === 'invite-signatory') {
      if (isInviteeValid) {
        setPhase('board-resolution')
      }
      return
    }

    if (phase === 'board-resolution') {
      if (boardResolutionFile) {
        onNext()
      }
      return
    }

    if (phase === 'methods' && method === 'digilocker') {
      setPhase('digilocker-handoff')
      return
    }

    if (phase === 'methods' && method === 'aadhaar-otp') {
      setPhase('aadhaar-otp')
      return
    }

    if (phase === 'methods' && method === 'upload-aadhaar') {
      setPhase('upload-aadhaar')
      return
    }

    if (phase === 'aadhaar-otp' && isVerifyingOtp) {
      setPhase('pan-verification-methods')
      return
    }

    if (phase === 'upload-aadhaar' && aadhaarFrontFile && aadhaarBackFile) {
      setPhase('pan-verification-methods')
      return
    }

    if (phase === 'pan-verification-methods' && panMethod === 'auto-pan') {
      setPhase('personal-pan-digital')
      return
    }

    if (phase === 'personal-pan-digital' && !isPersonalPanVerified) {
      if (isPersonalPanValid) {
        setIsPersonalPanVerified(true)
      }
      return
    }

    onNext()
  }

  const continueToDigiLocker = () => {
    window.open(DIGILOCKER_URL, '_blank', 'noopener,noreferrer')
    setPhase('digilocker-waiting')
  }

  const openDigiLockerAgain = () => {
    window.open(DIGILOCKER_URL, '_blank', 'noopener,noreferrer')
  }

  const useOtpInstead = () => {
    setMethod('aadhaar-otp')
    setPhase('aadhaar-otp')
  }

  const handleAadhaarChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 12)
    const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
    setAadhaarNumber(formatted)
    setOtpSent(false)
    setOtpCode('')
    setIsVerifyingOtp(false)
  }

  const sendOtp = () => {
    if (!isAadhaarValid) {
      return
    }

    setOtpSent(true)
    setOtpCode('')
    setIsVerifyingOtp(false)
  }

  const handleOtpChange = (value: string) => {
    setOtpCode(value.replace(/\D/g, '').slice(0, 6))
    setIsVerifyingOtp(false)
  }

  const verifyOtp = () => {
    if (!isOtpReady) {
      return
    }

    setIsVerifyingOtp(true)
  }

  const setUploadError = (error: AadhaarUploadError) => {
    setAadhaarUploadErrors(prev => [...prev.filter(item => item.side !== error.side), error])
    if (error.side === 'front') {
      setAadhaarFrontFile(null)
    } else {
      setAadhaarBackFile(null)
    }
  }

  const clearUploadError = (side: AadhaarSide) => {
    setAadhaarUploadErrors(prev => prev.filter(item => item.side !== side))
  }

  const handleAadhaarFile = (side: AadhaarSide, file: File | undefined) => {
    if (!file) {
      return
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
    const allowedExtensions = /\.(pdf|png|jpe?g)$/i
    if (!allowedTypes.includes(file.type) && !allowedExtensions.test(file.name)) {
      setUploadError({
        id: `${side}-format`,
        side,
        title: 'Format not supported',
        description: 'We accept PDF, PNG and JPG only.',
        action: 'Try another file'
      })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError({
        id: `${side}-large`,
        side,
        title: 'File too large',
        description: `${file.name} is ${(file.size / (1024 * 1024)).toFixed(0)} MB. Max is 10 MB.`,
        action: 'Re-upload'
      })
      return
    }

    if (/(blur|dark|low|unreadable|bad)/i.test(file.name)) {
      setUploadError({
        id: `${side}-ocr`,
        side,
        title: "Couldn't read this",
        description: 'OCR confidence is too low. Try a brighter, flatter photo.',
        action: 'Retake / re-upload'
      })
      return
    }

    clearUploadError(side)
    if (side === 'front') {
      setAadhaarFrontFile(file)
    } else {
      setAadhaarBackFile(file)
    }
  }

  const switchToDigiLocker = () => {
    setMethod('digilocker')
    setPhase('digilocker-handoff')
  }

  const handlePersonalPanChange = (value: string) => {
    setPersonalPan(value.toUpperCase().replace(/\s/g, '').slice(0, 10))
    setIsPersonalPanVerified(false)
  }

  const handleInviteeChange = (field: keyof typeof invitee, value: string) => {
    setInvitee(prev => ({ ...prev, [field]: value }))
  }

  const handleResolutionFile = (kind: ResolutionFileKind, file: File | undefined) => {
    if (!file) {
      return
    }

    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    const isCinAllowed = isPdf || ['image/png', 'image/jpeg'].includes(file.type) || /\.(png|jpe?g)$/i.test(file.name)

    if (kind === 'board' && !isPdf) {
      setBoardResolutionError('Upload a PDF board resolution.')
      setBoardResolutionFile(null)
      return
    }

    if (kind === 'cin' && !isCinAllowed) {
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      if (kind === 'board') {
        setBoardResolutionError('File must be under 10 MB.')
        setBoardResolutionFile(null)
      }
      return
    }

    if (kind === 'board') {
      setBoardResolutionError('')
      setBoardResolutionFile(file)
    } else {
      setCinCertificateFile(file)
    }
  }

  const methodCards = [
    {
      id: 'digilocker' as const,
      icon: LockKeyhole,
      title: 'DigiLocker',
      description: 'One-tap government pull. Most secure, zero typing.',
      duration: '~30 seconds',
      badge: 'Recommended . 30 sec',
      accent: true
    },
    {
      id: 'aadhaar-otp' as const,
      icon: MessageSquareText,
      title: 'Aadhaar OTP',
      description: 'Enter Aadhaar number, verify with OTP on registered mobile.',
      duration: '~1 minute'
    },
    {
      id: 'upload-aadhaar' as const,
      icon: FileUp,
      title: 'Upload Aadhaar',
      description: 'Front + back images. Goes to manual review.',
      duration: '24h review',
      tag: 'Slower'
    },
  ]

  const panMethodCards = [
    {
      id: 'auto-pan' as const,
      icon: LockKeyhole,
      title: 'Verify PAN number',
      description: 'We auto-check with NSDL. No upload needed.',
      duration: '~10 seconds',
      badge: 'Recommended . 30 sec'
    },
    {
      id: 'upload-pan' as const,
      icon: FileUp,
      title: 'Upload PAN card',
      description: 'Front image. Goes to manual review.',
      duration: '24h review',
      tag: 'Slower'
    },
  ]

  return (
    <div className="h-full w-full overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
      <div className="grid h-full grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex h-full flex-col gap-6 border-r border-[#e0e5eb] bg-[#f8fafd] px-5 py-5">
          <div className="flex h-10 items-center justify-between">
            <img src={idtoLogo} alt="idto" className="h-10 w-[70px]" />
            <div className="inline-flex h-[21px] items-center gap-1.5 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
              <span className="size-1.5 rounded-full bg-[#3061ef]" />
              GO LIVE
            </div>
          </div>

          <div className="w-full">
            <div className="mb-1.5 flex items-center justify-between text-[11px] leading-[17px] text-[#6a727d]">
              <span>Production setup</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#f0f4f9]">
              <div className="h-full rounded-full bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {progressItems.map(([number, title, completed, active]) => (
              <li key={number} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : completed ? 'bg-[#00a575] text-white' : 'border border-[#e0e5eb] bg-white text-[#6a727d]'}`}>
                  {completed ? <Check className="size-3.5" /> : number}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>{title}</span>
                  <span className="block text-[10.5px] leading-4 text-[#6a727d]">~ under 5 min</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-[#e0e5eb] bg-white px-3 py-5">
            <div className="flex items-center gap-1.5 text-[11px] leading-[17px] text-[#0c121a]">
              <ShieldCheck className="size-3 text-[#3061ef]" />
              Bank-grade encryption
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-[#6a727d]">
              Your documents are encrypted at rest and only seen by our onboarding team.
            </p>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-white">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e0e5eb] px-6">
            <button type="button" onClick={handleBack} className="inline-flex items-center gap-2 text-[12px] leading-[18px] text-[#6a727d]">
              <ArrowLeft className="size-3.5" />
              Save & exit
            </button>
            <div className="flex items-center gap-3 text-[11px] leading-[17px] text-[#6a727d]">
              <span className="inline-flex items-center gap-1">
                <Save className="size-3" />
                auto-saved 4s ago
              </span>
              <span aria-hidden="true">.</span>
              <button type="button" className="inline-flex items-center gap-1">
                <HelpCircle className="size-3" />
                Help
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden px-10 pb-7 pt-[31px]">
            <div className="max-w-[854px]">
              <div className="mb-7">
                <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 3 of 4</p>
                <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.35px] text-[#0c121a]">
                  {phase === 'choice'
                    ? 'Who is the authorized signatory?'
                    : phase === 'invite-signatory'
                      ? 'Tell us about the signatory'
                    : phase === 'board-resolution'
                      ? 'Upload your board resolution'
                    : phase === 'digilocker-handoff'
                      ? "We'll take you to DigiLocker for 30 seconds"
                      : phase === 'digilocker-waiting'
                        ? ''
                        : phase === 'aadhaar-otp'
                          ? 'Verify with Aadhaar OTP'
                          : phase === 'upload-aadhaar'
                            ? 'Upload your Aadhaar'
                            : phase === 'pan-verification-methods'
                              ? "Verify the signatory's identity"
                              : phase === 'personal-pan-digital'
                                ? "Verify the signatory's PAN"
                          : "Verify the signatory's identity"}
                </h2>
              </div>

              {phase === 'choice' ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setChoice('self')}
                    className={`min-h-[141px] rounded-2xl border p-5 text-left transition ${choice === 'self' ? 'border-[#3061ef] bg-[#f8fbff] shadow-[0_0_0_3px_rgba(48,97,239,0.10)]' : 'border-[#e0e5eb] bg-white hover:bg-[#f8fafd]'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`flex size-5 items-center justify-center rounded-full border ${choice === 'self' ? 'border-[#3061ef] bg-[#3061ef] text-white' : 'border-[#cfd6df] bg-white text-transparent'}`}>
                        <Check className="size-3" />
                      </span>
                      <span className="text-[14px] font-bold leading-5 text-[#0c121a]">Yes, that's me</span>
                    </span>
                    <span className="mt-2 block text-[12px] leading-[18px] text-[#6a727d]">
                      We'll use your details ({userName} . {userEmail}) and verify via DigiLocker.
                    </span>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] leading-4 text-[#6a727d]">
                      <Clock3 className="size-2.5" />
                      Fastest path . ~3 min
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setChoice('other')}
                    className={`min-h-[141px] rounded-2xl border p-5 text-left transition ${choice === 'other' ? 'border-[#3061ef] bg-[#f8fbff] shadow-[0_0_0_3px_rgba(48,97,239,0.10)]' : 'border-[#e0e5eb] bg-white hover:bg-[#f8fafd]'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`flex size-5 items-center justify-center rounded-full border ${choice === 'other' ? 'border-[#3061ef] bg-[#3061ef] text-white' : 'border-[#cfd6df] bg-white text-transparent'}`}>
                        <Check className="size-3" />
                      </span>
                      <span className="text-[14px] font-bold leading-5 text-[#0c121a]">No, it's someone else</span>
                    </span>
                    <span className="mt-2 block text-[12px] leading-[18px] text-[#6a727d]">
                      We'll send them a secure link to complete their part. You can keep filling the rest.
                    </span>
                  </button>
                </div>
              ) : phase === 'invite-signatory' ? (
                <div className="-mt-1 max-w-[854px]">
                  <p className="mb-6 text-[11px] font-medium uppercase leading-[16px] tracking-[1.4px] text-[#6a727d]">
                    Signatory . invite
                  </p>

                  <div className="grid grid-cols-2 gap-x-7 gap-y-5">
                    <div>
                      <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                        Full name
                        <span className="ml-1 text-[#6a727d]">(as on PAN)</span>
                      </label>
                      <input
                        type="text"
                        value={invitee.name}
                        onChange={(event) => handleInviteeChange('name', event.target.value)}
                        placeholder="Rohan Mehta"
                        className="h-10 w-full rounded-lg border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={invitee.designation}
                        onChange={(event) => handleInviteeChange('designation', event.target.value)}
                        placeholder="Director"
                        className="h-10 w-full rounded-lg border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                        <input
                          type="email"
                          value={invitee.email}
                          onChange={(event) => handleInviteeChange('email', event.target.value)}
                          placeholder="rohan@acmepay.com"
                          className="h-10 w-full rounded-lg border border-[#e0e5eb] bg-white px-3 pl-9 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                        Mobile
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                        <input
                          type="tel"
                          value={invitee.mobile}
                          onChange={(event) => handleInviteeChange('mobile', event.target.value)}
                          placeholder="+91 98765 43210"
                          className="h-10 w-full rounded-lg border border-[#e0e5eb] bg-white px-3 pl-9 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex min-h-[56px] items-start gap-3 rounded-2xl border border-[#d6e8ff] bg-[#f5faff] px-4 py-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#3061ef] text-white">
                      <Mail className="size-3" />
                    </span>
                    <p className="text-[13px] leading-[20px] text-[#2452b5]">
                      The signatory will get a link valid for 7 days. We'll notify you when they finish their KYC.
                    </p>
                  </div>
                </div>
              ) : phase === 'board-resolution' ? (
                <div className="-mt-2 max-w-[854px]">
                  <div className="flex h-[72px] items-center justify-between rounded-2xl border border-[#e0e5eb] bg-[#f8fafd] px-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#3061ef]">
                        <FileText className="size-4" />
                      </span>
                      <span>
                        <span className="block text-[13px] font-bold leading-5 text-[#0c121a]">Don't have one yet?</span>
                        <span className="block text-[12px] leading-[18px] text-[#6a727d]">
                          Use our template - most teams sign and upload in 10 minutes.
                        </span>
                      </span>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-[#e0e5eb] bg-white px-3 text-[12px] font-bold leading-[18px] text-[#0c121a] hover:bg-[#f8fafd]"
                    >
                      <Download className="size-3" />
                      Download template
                    </button>
                  </div>

                  <div className="mt-4">
                    <div className="mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px]">
                      <label className="text-[#0c121a]">Board resolution</label>
                      <span className="text-[11px] leading-4 text-[#6a727d]">PDF only . max 10 MB</span>
                    </div>
                    <input
                      id="board-resolution-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(event) => handleResolutionFile('board', event.target.files?.[0])}
                    />
                    {boardResolutionFile ? (
                      <div className="flex h-20 items-center gap-3 rounded-2xl border border-[#e0e5eb] bg-[#f8fafd] px-4">
                        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3061ef]">
                          <FileText className="size-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[12px] font-medium leading-[18px] text-[#0c121a]">{boardResolutionFile.name}</span>
                          <span className="block text-[11px] leading-4 text-[#6a727d]">
                            {(boardResolutionFile.size / (1024 * 1024)).toFixed(1)} MB . Ready for review
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setBoardResolutionFile(null)}
                          className="rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                          aria-label="Remove board resolution"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="board-resolution-upload"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault()
                          handleResolutionFile('board', event.dataTransfer.files?.[0])
                        }}
                        className={`flex h-28 cursor-pointer items-center justify-center rounded-2xl border border-dashed bg-white text-[#3061ef] transition hover:border-[#3061ef] ${boardResolutionError ? 'border-[#ef4444]' : 'border-[#cfd6df]'}`}
                      >
                        <span className="flex flex-col items-center gap-1 text-[12px] font-medium leading-[18px]">
                          <FileUp className="size-4" />
                          Drop PDF or browse
                        </span>
                      </label>
                    )}
                    {boardResolutionError && (
                      <p className="mt-1.5 text-[11px] leading-4 text-[#ef4444]">{boardResolutionError}</p>
                    )}
                  </div>

                  <div className="mt-3 flex h-[43px] items-center gap-2 rounded-xl border border-[#e0e5eb] bg-[#f8fafd] px-3 text-[12px] leading-[18px] text-[#6a727d]">
                    <FileText className="size-3.5 text-[#3061ef]" />
                    CIN / Certificate of Incorporation is optional and doesn't change your review time.
                  </div>

                  <div className="mt-3">
                    <div className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px]">
                      <label className="text-[#0c121a]">CIN certificate</label>
                      <span className="ml-1 text-[11px] leading-4 text-[#6a727d]">(optional)</span>
                    </div>
                    <input
                      id="cin-certificate-upload"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                      className="hidden"
                      onChange={(event) => handleResolutionFile('cin', event.target.files?.[0])}
                    />
                    {cinCertificateFile ? (
                      <div className="flex h-16 items-center gap-3 rounded-2xl border border-[#e0e5eb] bg-[#f8fafd] px-4">
                        <FileText className="size-5 shrink-0 text-[#3061ef]" />
                        <span className="min-w-0 flex-1 truncate text-[12px] font-medium leading-[18px] text-[#0c121a]">{cinCertificateFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setCinCertificateFile(null)}
                          className="rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                          aria-label="Remove CIN certificate"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="cin-certificate-upload"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          event.preventDefault()
                          handleResolutionFile('cin', event.dataTransfer.files?.[0])
                        }}
                        className="flex h-16 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#cfd6df] bg-white text-[#3061ef] transition hover:border-[#3061ef]"
                      >
                        <span className="flex flex-col items-center gap-0.5 text-[12px] font-medium leading-[18px]">
                          <FileUp className="size-3.5" />
                          Optional . drop or browse
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              ) : phase === 'methods' ? (
                <>
                  <h3 className="mb-2 text-[13px] font-bold leading-[19px] text-[#0c121a]">Aadhaar verification . pick one</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {methodCards.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMethod(item.id)}
                        className={`relative min-h-[155px] rounded-2xl border p-4 text-left transition ${method === item.id ? 'border-[#3061ef] bg-[#f8fbff] shadow-[0_0_0_3px_rgba(48,97,239,0.10)]' : 'border-[#e0e5eb] bg-white hover:bg-[#f8fafd]'}`}
                      >
                        {item.badge && (
                          <span className="absolute -top-3 left-4 inline-flex h-[21px] items-center gap-1 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
                            <Check className="size-2.5" />
                            {item.badge}
                          </span>
                        )}
                        <span className="flex items-start gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f9] text-[#0c121a]">
                            <item.icon className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-[14px] font-bold leading-[21px] text-[#0c121a]">
                              {item.title}
                              {method === item.id && <Check className="size-3.5 text-[#00a575]" />}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-[18px] text-[#6a727d]">{item.description}</span>
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] leading-4 text-[#6a727d]">
                              <Clock3 className="size-3" />
                              {item.duration}
                            </span>
                            {item.tag && (
                              <span className="mt-2 block w-fit rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] leading-4 text-[#6a727d]">
                                {item.tag}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : phase === 'personal-pan-digital' ? (
                <div className="-mt-5 max-w-[672px]">
                  <p className="text-[11px] leading-[17px] text-[#6a727d]">PAN . digital</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6a727d]">
                    We'll check it against NSDL. Most PANs verify in under 5 seconds.
                  </p>

                  <div className="mt-7 w-[448px]">
                    <div className="mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px]">
                      <label className="text-[#0c121a]">Personal PAN</label>
                      <span className="text-[11px] leading-4 text-[#6a727d]">As per PAN card</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={personalPan}
                        onChange={(event) => handlePersonalPanChange(event.target.value)}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className={`h-10 w-full rounded-lg border bg-white px-3 pr-9 text-[13px] leading-5 text-[#0c121a] uppercase outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10 ${personalPan && !isPersonalPanValid ? 'border-[#ef4444]' : 'border-[#e0e5eb]'}`}
                      />
                      {isPersonalPanValid && (
                        <Check className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />
                      )}
                    </div>
                    {personalPan && !isPersonalPanValid && (
                      <p className="mt-1.5 text-[11px] leading-4 text-[#ef4444]">Enter a valid 10-character PAN</p>
                    )}

                    {isPersonalPanVerified && (
                      <div className="mt-4 rounded-xl border border-[#b8e6c8] bg-[#effaf3] px-3 py-3">
                        <div className="flex items-center gap-2 text-[12px] font-bold leading-[18px] text-[#047857]">
                          <Check className="size-3.5" />
                          Verified . RIYA SHARMA
                        </div>
                        <p className="mt-1 text-[11px] leading-[17px] text-[#6a727d]">
                          Matches the name on Aadhaar (RIYA SHARMA). Good to go.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : phase === 'pan-verification-methods' ? (
                <div className="-mt-5 max-w-[854px]">
                  <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 3 of 4</p>
                  <h3 className="mt-5 mb-3 text-[13px] font-bold leading-[19px] text-[#0c121a]">
                    PAN verification . pick one
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {panMethodCards.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setPanMethod(item.id)}
                        className={`relative min-h-[138px] rounded-2xl border p-4 text-left transition ${panMethod === item.id ? 'border-[#3061ef] bg-[#f8fbff] shadow-[0_0_0_3px_rgba(48,97,239,0.10)]' : 'border-[#e0e5eb] bg-white hover:bg-[#f8fafd]'}`}
                      >
                        {item.badge && (
                          <span className="absolute -top-3 left-4 inline-flex h-[21px] items-center gap-1 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
                            <Check className="size-2.5" />
                            {item.badge}
                          </span>
                        )}
                        <span className="flex items-start gap-3">
                          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f9] text-[#0c121a]">
                            <item.icon className="size-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-2 text-[14px] font-bold leading-[21px] text-[#0c121a]">
                              {item.title}
                              {panMethod === item.id && <Check className="size-3.5 text-[#00a575]" />}
                            </span>
                            <span className="mt-0.5 block text-[12px] leading-[18px] text-[#6a727d]">{item.description}</span>
                            <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] leading-4 text-[#6a727d]">
                              <Clock3 className="size-3" />
                              {item.duration}
                            </span>
                            {item.tag && (
                              <span className="mt-2 block w-fit rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] leading-4 text-[#6a727d]">
                                {item.tag}
                              </span>
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : phase === 'aadhaar-otp' ? (
                <div className="-mt-5 max-w-[854px]">
                  <p className="text-[11px] leading-[17px] text-[#6a727d]">Aadhaar . OTP</p>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6a727d]">
                    We'll send a one-time password to the mobile linked to this Aadhaar.
                  </p>

                  <div className={`mt-7 grid gap-6 ${otpSent ? 'grid-cols-2' : 'grid-cols-[415px]'}`}>
                    <div className="w-[415px]">
                      <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                        Aadhaar number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={aadhaarNumber}
                        onChange={(event) => handleAadhaarChange(event.target.value)}
                        placeholder="1234 5678 9012"
                        className={`h-10 w-full rounded-lg border bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10 ${aadhaarNumber && !isAadhaarValid ? 'border-[#ef4444]' : 'border-[#e0e5eb]'}`}
                      />
                      {aadhaarNumber && !isAadhaarValid && (
                        <p className="mt-1.5 text-[11px] leading-4 text-[#ef4444]">Enter a valid 12-digit Aadhaar number</p>
                      )}
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={!isAadhaarValid}
                        className="mt-2 flex h-8 w-full items-center justify-center rounded-lg bg-[#0019ff] text-[12px] font-bold leading-[18px] text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:bg-[#dfe4ff] disabled:text-[#7a86d8]"
                      >
                        {otpSent ? 'Send OTP again' : 'Send OTP'}
                      </button>
                      <p className="mt-2 text-[11px] leading-4 text-[#6a727d]">
                        By continuing you authorise idto to verify your Aadhaar via UIDAI.
                      </p>
                    </div>

                    {otpSent && (
                      <div className="w-[415px]">
                        <div className="mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px]">
                          <label className="text-[#0c121a]">Enter OTP</label>
                          <span className="text-[11px] leading-4 text-[#6a727d]">Sent to ***** 43210</span>
                        </div>

                        <div className="relative">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={otpCode}
                            onChange={(event) => handleOtpChange(event.target.value)}
                            className="sr-only"
                            autoFocus
                            aria-label="Enter OTP"
                          />
                          <button
                            type="button"
                            onClick={(event) => {
                              const input = event.currentTarget.parentElement?.querySelector('input')
                              input?.focus()
                            }}
                            className="flex h-10 items-center gap-1.5"
                          >
                            {Array.from({ length: 6 }).map((_, index) => (
                              <span
                                key={index}
                                className={`flex h-10 w-9 items-center justify-center rounded-lg border text-[14px] font-bold leading-[21px] text-[#0c121a] ${index === otpDigits.length ? 'border-[#3061ef] bg-white shadow-[0_0_0_3px_rgba(48,97,239,0.10)]' : 'border-[#e0e5eb] bg-white'}`}
                              >
                                {otpDigits[index] || ''}
                              </span>
                            ))}
                          </button>
                        </div>

                        <div className="mt-2 flex h-4 items-center justify-between text-[11px] leading-4 text-[#6a727d]">
                          <span>Resend in 0:24</span>
                          <button
                            type="button"
                            onClick={() => {
                              setOtpSent(false)
                              setOtpCode('')
                              setIsVerifyingOtp(false)
                            }}
                            className="font-medium text-[#3061ef] hover:text-[#0019ff]"
                          >
                            Change number
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={verifyOtp}
                          disabled={!isOtpReady}
                          className="mt-2 flex h-8 w-full items-center justify-center gap-2 rounded-lg bg-[#0019ff] text-[12px] font-bold leading-[18px] text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:bg-[#dfe4ff] disabled:text-[#7a86d8]"
                        >
                          {isVerifyingOtp && <LoaderCircle className="size-3.5 animate-spin" />}
                          {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : phase === 'upload-aadhaar' ? (
                <div className="-mt-5 max-w-[854px]">
                  <p className="text-[11px] leading-[17px] text-[#6a727d]">Aadhaar . upload</p>

                  <input
                    id="aadhaar-front-error-picker"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={(event) => handleAadhaarFile('front', event.target.files?.[0])}
                  />
                  <input
                    id="aadhaar-back-error-picker"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                    className="hidden"
                    onChange={(event) => handleAadhaarFile('back', event.target.files?.[0])}
                  />

                  {aadhaarUploadErrors.length > 0 ? (
                    <div className="mt-7">
                      <p className="mb-3 text-[11px] font-medium uppercase leading-[16.5px] tracking-[1.54px] text-[#1034b1]">
                        Upload errors
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {aadhaarUploadErrors.map((error) => (
                          <div key={error.id} className="flex min-h-[173px] flex-col items-start rounded-2xl border border-[#ffd1c8] bg-[#fff7f5] p-[17px]">
                            <span className="flex size-7 items-center justify-center rounded-full bg-[#ffe3dc] text-[#d01d21]">
                              <AlertCircle className="size-4" />
                            </span>
                            <p className="mt-2 text-[12.5px] font-bold leading-[18.75px] text-[#0c121a]">{error.title}</p>
                            <p className="mt-1 min-h-[35px] text-[11.5px] leading-[17.25px] text-[#6a727d]">{error.description}</p>
                            <button
                              type="button"
                              onClick={() => document.getElementById(`aadhaar-${error.side}-error-picker`)?.click()}
                              className="mt-auto inline-flex h-8 items-center justify-center gap-2 rounded-xl border border-[#e0e5eb] bg-white px-3 text-[12px] leading-[18px] text-[#0c121a] hover:bg-[#f8fafd]"
                            >
                              <FileUp className="size-3" />
                              {error.action}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                  <>
                  <div className="mt-4 flex h-[35px] items-center justify-between rounded-lg border border-[#f4d49b] bg-[#fff8eb] px-3 text-[12px] leading-[18px] text-[#7c4a03]">
                    <span className="inline-flex items-center gap-2">
                      <Clock3 className="size-3.5" />
                      Goes to manual review . approval in ~24h
                    </span>
                    <button
                      type="button"
                      onClick={switchToDigiLocker}
                      className="font-bold text-[#3061ef] hover:text-[#0019ff]"
                    >
                      Switch to DigiLocker
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {([
                      ['front', 'Aadhaar - front side', aadhaarFrontFile],
                      ['back', 'Aadhaar - back side', aadhaarBackFile],
                    ] as const).map(([side, title, file]) => (
                      <div key={side} className="h-[152px] rounded-2xl border border-[#e0e5eb] bg-white p-5">
                        <p className="text-[12px] font-medium leading-[18px] text-[#0c121a]">{title}</p>
                        <input
                          id={`aadhaar-${side}`}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                          className="hidden"
                          onChange={(event) => handleAadhaarFile(side, event.target.files?.[0])}
                        />

                        {file ? (
                          <div className="mt-3 flex h-[74px] items-center gap-3 rounded-xl border border-[#e0e5eb] bg-[#f8fafd] px-3">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#3061ef]">
                              <FileText className="size-5" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[12px] font-medium leading-[18px] text-[#0c121a]">{file.name}</span>
                              <span className="block text-[11px] leading-4 text-[#6a727d]">
                                {(file.size / (1024 * 1024)).toFixed(1)} MB . OCR matched name
                              </span>
                            </span>
                            <button
                              type="button"
                              onClick={() => side === 'front' ? setAadhaarFrontFile(null) : setAadhaarBackFile(null)}
                              className="rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                              aria-label={`Remove ${title}`}
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor={`aadhaar-${side}`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              event.preventDefault()
                              handleAadhaarFile(side, event.dataTransfer.files?.[0])
                            }}
                            className="mt-3 flex h-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#cfd6df] bg-[#f8fafd] text-[#3061ef] transition hover:border-[#3061ef] hover:bg-white"
                          >
                            <span className="flex flex-col items-center gap-1 text-[12px] font-medium leading-[18px]">
                              <FileUp className="size-4" />
                              Drop or browse
                            </span>
                          </label>
                        )}
                      </div>
                    ))}
                  </div>
                  </>
                  )}
                </div>
              ) : phase === 'digilocker-handoff' ? (
                <div className="max-w-[760px]">
                  <p className="-mt-5 mb-4 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6a727d]">
                    Aadhaar . DigiLocker
                  </p>

                  <div className="grid grid-cols-[1fr_64px_1fr] items-center">
                    <div className="flex h-[188px] flex-col items-center justify-center rounded-[20px] border border-[#e0e5eb] bg-white px-6 text-center shadow-[0_1px_2px_rgba(12,18,26,0.03)]">
                      <img src={idtoLogo} alt="idto.ai" className="h-10 w-[72px]" />
                      <p className="mt-4 text-[13px] font-bold leading-5 text-[#0c121a]">idto.ai</p>
                      <p className="text-[12px] leading-[18px] text-[#6a727d]">production setup</p>
                    </div>

                    <div className="flex justify-center">
                      <span className="flex size-10 items-center justify-center rounded-full border border-[#d6dde7] bg-[#f8fafd] text-[#3061ef]">
                        <ArrowRight className="size-4" />
                      </span>
                    </div>

                    <div className="flex h-[188px] flex-col items-center justify-center rounded-[20px] border border-[#e0e5eb] bg-white px-6 text-center shadow-[0_1px_2px_rgba(12,18,26,0.03)]">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f0f4ff] text-[#0019ff]">
                        <LockKeyhole className="size-5" />
                      </div>
                      <p className="mt-4 text-[13px] font-bold leading-5 text-[#0c121a]">DigiLocker</p>
                      <p className="text-[12px] leading-[18px] text-[#6a727d]">digilocker.gov.in</p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#d6e8ff] bg-[#f5faff] px-4 py-3 text-[13px] leading-[20px] text-[#2452b5]">
                    <span className="font-bold text-[#1034b1]">What we'll receive:</span> Name . DOB . gender . masked Aadhaar . address. Nothing else.
                  </div>
                </div>
              ) : (
                <div className="-mt-10 flex h-[368px] flex-col items-center justify-center text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#eef4ff] text-[#3061ef]">
                    <LoaderCircle className="size-6 animate-spin" />
                  </div>
                  <h3 className="mt-6 text-[21px] font-bold leading-[27px] text-[#0c121a]">
                    Waiting for DigiLocker...
                  </h3>
                  <p className="mt-1.5 max-w-[384px] text-[13px] leading-[19.5px] text-[#6a727d]">
                    Complete the sign-in in the other tab. We'll bring you back automatically when you're done.
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={openDigiLockerAgain}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e0e5eb] bg-white px-3 text-[12px] font-bold leading-[18px] text-[#0c121a] hover:bg-[#f8fafd]"
                    >
                      Open DigiLocker again
                    </button>
                    <button
                      type="button"
                      onClick={useOtpInstead}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e0e5eb] bg-white px-3 text-[12px] font-bold leading-[18px] text-[#0c121a] hover:bg-[#f8fafd]"
                    >
                      Cancel & switch to OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {phase !== 'digilocker-waiting' && (
          <footer className="mx-10 flex h-[65px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button
              onClick={handleBack}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e0e5eb] bg-white px-4 text-[13px] font-medium leading-5 text-[#6a727d] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            {phase === 'digilocker-handoff' ? (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={useOtpInstead}
                  disabled={isLoading}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e0e5eb] bg-white px-4 text-[13px] font-bold leading-5 text-[#0c121a] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Use OTP instead
                </button>
                <button
                  onClick={continueToDigiLocker}
                  disabled={isLoading}
                  className="flex h-10 w-[180px] items-center justify-center gap-2 rounded-lg bg-[#0019ff] text-[13px] font-bold leading-5 text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to DigiLocker
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleContinue}
                disabled={isLoading || (phase === 'choice' ? !choice : phase === 'invite-signatory' ? !isInviteeValid : phase === 'board-resolution' ? !boardResolutionFile : phase === 'aadhaar-otp' ? !isVerifyingOtp : phase === 'upload-aadhaar' ? (!aadhaarFrontFile || !aadhaarBackFile) : phase === 'personal-pan-digital' ? (!isPersonalPanValid && !isPersonalPanVerified) : !method)}
                className={`flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0019ff] text-[13px] font-bold leading-5 text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50 ${phase === 'invite-signatory' ? 'w-[156px]' : 'w-[110px]'}`}
              >
                {phase === 'invite-signatory' ? 'Send secure link' : 'Continue'}
                <ArrowRight className="size-3.5" />
              </button>
            )}
          </footer>
          )}
        </main>
      </div>
    </div>
  )
}

export default SignatoryChoiceForm
