import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

const StatsGrid = () => {
  const stats = [
    {
      title: 'Total Verifications',
      value: '330',
      change: '+12%',
      changeType: 'positive',
      description: 'From last month'
    },
    {
      title: 'Successful Verifications',
      value: '312',
      change: '+8%',
      changeType: 'positive',
      description: 'From last month'
    },
    {
      title: 'Failed Verifications',
      value: '18',
      change: '-7%',
      changeType: 'negative',
      description: 'From last month'
    },
    {
      title: 'Monthly Spend',
      value: '4,200',
      change: '+12%',
      changeType: 'positive',
      description: 'From last month'
    }
  ]

  const getTrendIcon = (changeType: string) => {
    switch (changeType) {
      case 'positive':
        return <TrendingUp className='size-4 text-[#09de13]' />
      case 'negative':
        return <TrendingDown className='size-4 text-[#ff0000]' />
      default:
        return <TrendingUp className='size-4 text-[#09de13]' />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid h-[125px] relative rounded-2xl w-full"
    >
      <div className="grid grid-cols-4 h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            className={`border-r border-[#e7e8ea] border-solid relative shrink-0 ${index === stats.length - 1 ? 'border-r-0' : ''
              }`}
          >
            <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
              <p className="font-medium leading-[1.4] relative text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
                {stat.title}
              </p>
              <div className="flex items-center justify-between relative w-full">
                <p className="font-medium leading-[1.24] relative text-[32px] text-[#131b31] text-nowrap tracking-[-0.32px] whitespace-pre">
                  {stat.value}
                </p>
                <div className="flex flex-col items-end relative">
                  <div className="flex gap-0.5 items-center relative">
                    <div className="overflow-hidden relative shrink-0 size-5">
                      <div className="absolute flex inset-[30%_14.62%_22.91%_10%] items-center justify-center">
                        <div className="flex-none h-1.5 rotate-[345deg] w-3.5">
                          <div className="relative size-full -top-1">
                            {getTrendIcon(stat.changeType)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold leading-[1.4] relative text-[12px] text-[#09de13] text-nowrap whitespace-pre">
                      {stat.change}
                    </p>
                  </div>
                  <p className="font-normal leading-[1.4] relative text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                    {stat.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default StatsGrid
