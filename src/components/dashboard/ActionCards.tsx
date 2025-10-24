import { motion } from 'framer-motion'

// Image assets from Figma
const imgEllipse6 = "http://localhost:3845/assets/9987d23bd2395aee51819b8949b957d64fc37122.svg"
const imgPlus = "http://localhost:3845/assets/9c20498018dd0400bf2e895d39386c52a08d840a.svg"
const imgApi = "http://localhost:3845/assets/ceee1ee818b84b59060ff8470a5adbdb86cc4c95.svg"
const imgCode = "http://localhost:3845/assets/a0e85ea45e28b6a1b206e7e200e7f92e988b24c5.svg"
const imgDocs = "http://localhost:3845/assets/cb6d156cf746e25da83eee26b4920cbe91ea0c59.svg"
const imgBook = "http://localhost:3845/assets/a9dc09d4e335baede349ada31f74d3fd3064d6ea.svg"

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
      buttonIcon: imgPlus,
      buttonAction: handleRecharge,
      isPrimary: true,
      icon: null
    },
    {
      title: 'API Testing',
      value: null,
      description: 'Run and validate your integrations in the sandbox environment—risk-free.',
      buttonText: 'Start Testing',
      buttonIcon: imgCode,
      buttonAction: handleStartTesting,
      isPrimary: false,
      icon: imgApi
    },
    {
      title: 'API Documentation',
      value: null,
      description: 'Run and validate your integrations in the sandbox environment—risk-free.',
      buttonText: 'Open Doc',
      buttonIcon: imgBook,
      buttonAction: handleOpenDocs,
      isPrimary: false,
      icon: imgDocs
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
                    <div className="overflow-hidden relative shrink-0 size-[35px]">
                      <div className="absolute inset-[12.5%_8.33%]">
                        <div className="absolute inset-[-3.81%_-3.43%]">
                          <img alt="" className="block max-w-none size-full" src={card.icon} />
                        </div>
                      </div>
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
                  <div className="absolute left-[96px] size-[112px] top-[77px]">
                    <div className="absolute inset-[-122.321%]">
                      <img alt="" className="block max-w-none size-full" src={imgEllipse6} />
                    </div>
                  </div>
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
                  <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                       style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
                    <div className="flex-none rotate-[90deg]">
                      <div className="overflow-hidden relative size-4">
                        <div className="absolute inset-[16.667%]">
                          <img alt="" className="block max-w-none size-full" src={card.buttonIcon} />
                        </div>
                      </div>
                    </div>
                  </div>
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
