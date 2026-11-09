const statisticService = require('../services/statisticService');
const { sendSuccess } = require('../utils/response');

const project = async (req, res, next) => {
  try {
    const statistics = await statisticService.getProjectStatistics(req.project.id);
    return sendSuccess(res, 200, 'Lấy thống kê dự án thành công', statistics);
  } catch (error) {
    return next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const statistics = await statisticService.getPersonalStatistics(req.user.id);
    return sendSuccess(res, 200, 'Lấy thống kê cá nhân thành công', statistics);
  } catch (error) {
    return next(error);
  }
};

module.exports = { project, me };
