const Record = require('../models/Record');

const getDashboardSummary = async (req, res) => {
  try {
    // We can use MongoDB Aggregation to get totals
    
    const totals = await Record.aggregate([
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    totals.forEach(t => {
      if (t._id === 'income') totalIncome = t.totalAmount;
      if (t._id === 'expense') totalExpenses = t.totalAmount;
    });

    const netBalance = totalIncome - totalExpenses;

    const categoryTotalsTemp = await Record.aggregate([
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Format category totals
    const categoryTotals = categoryTotalsTemp.map(c => ({
      type: c._id.type,
      category: c._id.category,
      totalAmount: c.totalAmount
    }));

    // Recent activity (last 5 records)
    const recentActivity = await Record.find()
      .sort({ date: -1 })
      .limit(5)
      .populate('createdBy', 'name');

    // Monthly trends (grouping by month/year)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyTrendsData = await Record.aggregate([
      {
        $match: { date: { $gte: sixMonthsAgo } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance,
      },
      categoryTotals,
      recentActivity,
      monthlyTrendsData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardSummary };
