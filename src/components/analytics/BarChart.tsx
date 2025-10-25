import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const BarChart = () => {
  const categories = [
    { name: "Category 1", width: "w-[321px]" },
    { name: "Category 2", width: "w-[257px]" },
    { name: "Category 3", width: "w-[179px]" },
    { name: "Category 4", width: "w-[133px]" },
    { name: "Category 5", width: "w-[103px]" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
      className="bg-white border border-[#e7e8ea] border-solid h-[245px] min-w-[280px] relative rounded-2xl shrink-0 w-full max-w-[411px]"
    >
      <div className="flex flex-col h-[245px] items-start justify-between min-w-inherit overflow-hidden p-4 relative rounded-[inherit] w-full">
        <div className="flex flex-col gap-4 grow items-start min-h-0 min-w-px relative shrink-0 w-full">
          {/* Header */}
          <div className="flex items-center justify-between relative shrink-0 w-full">
            <div className="flex flex-wrap gap-2 items-center relative rounded shrink-0 w-full max-w-[238px]">
              <div className="flex flex-col items-start justify-center relative rounded shrink-0">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] tracking-[-0.12px] w-full">
                  Bar Chart Title
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center self-stretch">
              <div className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-0 relative rounded-lg shrink-0">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Jan 2025 - Aug 2025
                </p>
                <Calendar className="size-4 text-[#9296a0]" />
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
            {categories.map((category, index) => (
              <div key={category.name} className="bg-white flex flex-col gap-2.5 h-[30px] items-start justify-center overflow-hidden relative rounded shrink-0 w-full">
                <div className={`bg-gradient-to-r flex gap-2.5 grow items-center min-h-0 min-w-px overflow-hidden px-[18px] py-0 relative rounded shrink-0 ${category.width} ${
                  index % 2 === 0 
                    ? 'from-[#e6e8ff] to-[#8a95ff]' 
                    : 'from-[#e6fcf5] to-[#54eebe]'
                }`}>
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default BarChart
