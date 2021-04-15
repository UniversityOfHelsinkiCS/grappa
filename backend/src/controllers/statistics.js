const statisticsService = require('../services/StatisticsService')

export async function getStatistics(req, res) {
    const stats = await statisticsService.getStatistics()
    res.status(200).json(stats).end()
}
