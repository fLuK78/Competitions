const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /registrations
 * สมัครแข่งขัน
 */
exports.registerCompetition = async (req, res) => {
  const { userId, competitionId } = req.body;

  if (!userId || !competitionId) {
    return res.status(400).json({
      status: 'error',
      message: 'userId และ competitionId เป็นข้อมูลที่จำเป็น',
    });
  }

  const uid = parseInt(userId, 10);
  const cid = parseInt(competitionId, 10);

  if (isNaN(uid) || isNaN(cid)) {
    return res.status(400).json({
      status: 'error',
      message: 'userId หรือ competitionId ไม่ถูกต้อง',
    });
  }

  try {
    // เช็ค competition
    const competition = await prisma.competition.findUnique({
      where: { id: cid },
      include: { _count: { select: { registrations: true } } },
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบการแข่งขัน',
      });
    }

    // เช็ค slot
    if (competition._count.registrations >= competition.maxPlayer) {
      return res.status(400).json({
        status: 'error',
        message: 'การแข่งขันเต็มแล้ว',
      });
    }

    // เช็คสมัครซ้ำ
    const existed = await prisma.registration.findFirst({
      where: {
        userId: uid,
        competitionId: cid,
        status: { not: 'cancelled' },
      },
    });

    if (existed) {
      return res.status(409).json({
        status: 'error',
        message: 'ผู้ใช้นี้สมัครการแข่งขันนี้แล้ว',
      });
    }

    const registration = await prisma.registration.create({
      data: {
        userId: uid,
        competitionId: cid,
        status: 'pending',
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'สมัครการแข่งขันสำเร็จ',
      data: registration,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดในการสมัครการแข่งขัน',
    });
  }
};

/**
 * GET /registrations/player/:playerId
 * ประวัติการสมัครของผู้เล่น
 */
exports.getPlayerHistory = async (req, res) => {
  const playerId = parseInt(req.params.playerId, 10);

  if (isNaN(playerId)) {
    return res.status(400).json({
      status: 'error',
      message: 'playerId ไม่ถูกต้อง',
    });
  }

  try {
    const history = await prisma.registration.findMany({
      where: { userId: playerId },
      include: {
        competition: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      status: 'success',
      message: 'ดึงประวัติการสมัครสำเร็จ',
      total: history.length,
      data: history,
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถดึงประวัติการสมัครได้',
    });
  }
};

/**
 * PATCH /registrations/:id/cancel
 */
exports.cancelRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'registration id ไม่ถูกต้อง',
    });
  }

  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    res.json({
      status: 'success',
      message: 'ยกเลิกการสมัครเรียบร้อย',
      data: updated,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบข้อมูลการสมัคร',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถยกเลิกการสมัครได้',
    });
  }
};

/**
 * PATCH /registrations/:id/approve
 */
exports.approveRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'registration id ไม่ถูกต้อง',
    });
  }

  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'approved' },
    });

    res.json({
      status: 'success',
      message: 'อนุมัติการสมัครเรียบร้อย',
      data: updated,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบข้อมูลการสมัคร',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถอนุมัติการสมัครได้',
    });
  }
};

/**
 * PATCH /registrations/:id/reject
 */
exports.rejectRegistration = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'registration id ไม่ถูกต้อง',
    });
  }

  try {
    const updated = await prisma.registration.update({
      where: { id },
      data: { status: 'rejected' },
    });

    res.json({
      status: 'success',
      message: 'ปฏิเสธการสมัครเรียบร้อย',
      data: updated,
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบข้อมูลการสมัคร',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถปฏิเสธการสมัครได้',
    });
  }
};
