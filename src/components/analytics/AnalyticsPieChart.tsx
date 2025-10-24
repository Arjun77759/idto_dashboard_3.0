import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// Sample data for the pie chart
const chartData = [
  { name: 'Completed', value: 84, color: '#54eebe' },
  { name: 'Pending', value: 12, color: '#616675' },
  { name: 'Failed', value: 4, color: '#f7f7f8' },
]

const AnalyticsPieChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="h-[245px] w-full min-w-[280px] rounded-2xl border-[#e7e8ea]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-6 pt-6">
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-[#616675] tracking-[-0.12px]">
              Chart Title
            </h3>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[172px] p-0">
          <div className="relative w-[210px] h-[102px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={0}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e7e8ea',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#616675'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center percentage display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[32px] font-medium text-[#131b31] tracking-[-1.5922px] leading-[normal]">
                  84%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AnalyticsPieChart
