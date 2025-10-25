import { motion } from 'framer-motion'
import { Plus, Zap, Code, FileText, BookOpen } from 'lucide-react'

const ActionCards = () => {
  const handleRecharge = () => {
    console.log('Recharge account')
  }

  const handleStartTesting = () => {
    console.log('Start API testing')
  }

  const handleOpenDocs = () => {
    console.log('Open API documentation')
  }

  const cards = [
    {
      title: 'Current Balance',
      value: '11,758',
      description: 'Add funds to your account to continue using verification services without interruptions.',
      buttonText: 'Recharge Now',
      buttonIcon: Plus,
      buttonAction: handleRecharge,
      isPrimary: true,
      icon: null
    },
    {
      title: 'API Testing',
      value: null,
      description: 'Run and validate your integrations in the sandbox environment—risk-free.',
      buttonText: 'Start Testing',
      buttonIcon: Code,
      buttonAction: handleStartTesting,
      isPrimary: false,
      icon: Zap
    },
    {
      title: 'API Documentation',
      value: null,
      description: 'Run and validate your integrations in the sandbox environment—risk-free.',
      buttonText: 'Open Doc',
      buttonIcon: BookOpen,
      buttonAction: handleOpenDocs,
      isPrimary: false,
      icon: FileText
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="flex gap-5 items-start overflow-hidden relative rounded w-full"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          className={`h-[164px] relative rounded-2xl shrink-0 w-[314px] ${
            card.isPrimary 
              ? 'bg-[#e6e8ff] border border-[#e7e8ea] border-solid' 
              : 'bg-white border border-[#e7e8ea] border-solid'
          }`}
        >
          <div className="flex flex-col gap-4 h-[164px] items-start p-4 relative rounded-[inherit] w-[314px]">
            <div className="flex items-start justify-between relative w-full">
              <div className="flex flex-col gap-5 grow items-start min-h-0 min-w-0 relative self-stretch">
                <div className="flex flex-col gap-2 items-start relative w-full">
                  {card.icon && (
                    <div className="flex items-center justify-center shrink-0 size-[35px]">
                      <card.icon className="size-6 text-[#616675]" />
                    </div>
                  )}
                  <p className="font-medium min-w-full relative text-[12px] text-[#616675] tracking-[-0.12px] w-[min-content]">
                    {card.title}
                  </p>
                  {card.value && (
                    <p className="font-medium min-w-full relative text-[32px] text-[#0019ff] tracking-[-0.32px] w-[min-content]">
                      {card.value}
                    </p>
                  )}
                </div>
              </div>
              <div className={`h-10 relative rounded-lg shrink-0 ${
                card.isPrimary 
                  ? 'bg-gradient-to-r from-[#8a95ff] to-[#8a95ff] border border-[#e7e8ea] border-solid'
                  : 'bg-[#e6e8ff]'
              }`}
              style={card.isPrimary ? {
                backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 123 40\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(2.617 -6.5519e-16 1.29e-15 4.7 61.5 20)\\'><foreignObject x=\\'-446.5\\' y=\\'-446.5\\' width=\\\'893\\' height=\\\'893\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(138, 149, 255, 1) 0%, rgba(104, 118, 255, 1) 25%, rgba(69, 87, 255, 1) 50%, rgba(35, 56, 255, 1) 75%, rgba(17, 41, 255, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')"
              } : {}}
              >
                <button
                  onClick={card.buttonAction}
                  className="flex gap-2 h-10 items-center justify-center px-2 py-[14px] relative rounded-[inherit]"
                >
                  <p className={`font-medium leading-[1.4] relative text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre ${
                    card.isPrimary ? 'text-white' : 'text-[#0019ff]'
                  }`}>
                    {card.buttonText}
                  </p>
                  <card.buttonIcon className={`size-4 ${
                    card.isPrimary ? 'text-white' : 'text-[#0019ff]'
                  }`} />
                </button>
              </div>
            </div>
            <p className="font-normal leading-[1.4] relative text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              {card.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ActionCards
