'use client'

import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface BotStat {
  name: string
  _count: {
    _all: number
  }
}

interface BotStatisticsProps {
  botStats: BotStat[]
  totalBots: number
}

export default function BotStatistics({ botStats, totalBots }: BotStatisticsProps) {
  const [chartData, setChartData] = useState({
    labels: botStats.map(stat => stat.name),
    datasets: [
      {
        label: 'عدد الروبوتات',
        data: botStats.map(stat => stat._count._all),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  })

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'إحصائيات الروبوتات',
      },
    },
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">إحصائيات الروبوتات</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">إجمالي الروبوتات: {totalBots}</h2>
        <Bar data={chartData} options={options} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">تفاصيل الروبوتات</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-right">اسم الروبوت</th>
              <th className="text-right">العدد</th>
              <th className="text-right">النسبة المئوية</th>
            </tr>
          </thead>
          <tbody>
            {botStats.map(stat => (
              <tr key={stat.name}>
                <td>{stat.name}</td>
                <td>{stat._count._all}</td>
                <td>{((stat._count._all / totalBots) * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

