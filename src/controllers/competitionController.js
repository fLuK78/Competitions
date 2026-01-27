const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /competitions
 * query: keyword, minPlayer, sort, order
 */
exports.getCompetitions = async (req, res) => {
  try {
    const { keyword, minPlayer, sort, order } = req.query;

    const where = {};

    if (keyword) {
      where.name = { contains: keyword, mode: 'insensitive' };
    }

    if (minPlayer) {
      where.maxPlayer = { gte: parseInt(minPlayer, 10) };
    }

    const competitions = await prisma.competition.findMany({
      where,
      orderBy: {
        [sort || 'createdAt']: order === 'desc' ? 'desc' : 'asc',
      },
      include: {
        _count: { select: { registrations: true } },
        user: true, // ถ้าไม่มี user ใน schema ลบออกได้
      },
    });

    res.json({
      status: 'success',
      message: 'Competitions retrieved successfully',
      total: competitions.length,
      data: competitions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * GET /competitions/:id
 */
exports.getCompetitionById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid competition id',
    });
  }

  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
        registrations: true,
        user: true,
      },
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found',
      });
    }

    res.json({
      status: 'success',
      message: 'Competition retrieved successfully',
      data: competition,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * GET /competitions/:id/slots
 */
exports.getSlots = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid competition id',
    });
  }

  try {
    const competition = await prisma.competition.findUnique({
      where: { id },
      include: {
        _count: { select: { registrations: true } },
      },
    });

    if (!competition) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found',
      });
    }

    const booked = competition._count.registrations;

    res.json({
      status: 'success',
      message: 'Slots retrieved successfully',
      data: {
        maxPlayer: competition.maxPlayer,
        booked,
        remaining: competition.maxPlayer - booked,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * POST /competitions
 */
exports.createCompetition = async (req, res) => {
  const { name, date, maxPlayer, detail, userId } = req.body;

  if (!name || !date || !maxPlayer) {
    return res.status(400).json({
      status: 'error',
      message: 'name, date, maxPlayer are required',
    });
  }

  try {
    const competition = await prisma.competition.create({
      data: {
        name: String(name),
        date: new Date(date),
        maxPlayer: parseInt(maxPlayer, 10),
        detail: detail ? String(detail) : null,
        userId: userId ? Number(userId) : undefined,
      },
      include: {
        _count: { select: { registrations: true } },
        user: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'Competition created successfully',
      data: competition,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * PUT /competitions/:id
 */
exports.updateCompetition = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid competition id',
    });
  }

  const { name, date, maxPlayer, detail } = req.body;

  try {
    // เช็คจำนวนที่ลงทะเบียนแล้ว
    const current = await prisma.competition.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });

    if (!current) {
      return res.status(404).json({
        status: 'error',
        message: 'Competition not found',
      });
    }

    if (maxPlayer && parseInt(maxPlayer, 10) < current._count.registrations) {
      return res.status(400).json({
        status: 'error',
        message: 'maxPlayer cannot be less than registered players',
      });
    }

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        ...(name ? { name: String(name) } : {}),
        ...(date ? { date: new Date(date) } : {}),
        ...(maxPlayer ? { maxPlayer: parseInt(maxPlayer, 10) } : {}),
        ...(detail !== undefined ? { detail } : {}),
      },
      include: {
        _count: { select: { registrations: true } },
        user: true,
      },
    });

    res.json({
      status: 'success',
      message: 'Competition updated successfully',
      data: competition,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

/**
 * DELETE /competitions/:id
 */
exports.deleteCompetition = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid competition id',
    });
  }

  try {
    await prisma.competition.delete({
      where: { id },
    });

    res.json({
      status: 'success',
      message: 'Competition deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};
