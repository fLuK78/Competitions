const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET / - ดึงทั้งหมด 
exports.getCompetitions = async (req, res) => {
  try {
    const { keyword, minPlayer, sort, order } = req.query;
    const where = {};
    if (keyword) where.name = { contains: keyword, mode: 'insensitive' };
    if (minPlayer) where.maxPlayer = { gte: parseInt(minPlayer, 10) };

    const competitions = await prisma.competition.findMany({
      where,
      orderBy: { [sort || 'createdAt']: order === 'desc' ? 'desc' : 'asc' }
    });

    res.json({ status: 'success', total: competitions.length, data: competitions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /:id - ดึงตาม ID 
exports.getCompetitionById = async (req, res) => {
  try {
    const data = await prisma.competition.findUnique({
      where: { id: parseInt(req.params.id, 10) }
    });
    if (!data) return res.status(404).json({ status: 'error', message: 'ไม่พบรายการ' });
    res.json({ status: 'success', data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// GET /:id/slots - เช็คที่ว่าง 
exports.getSlots = async (req, res) => {
  try {
    const compId = parseInt(req.params.id, 10);
    const competition = await prisma.competition.findUnique({
      where: { id: compId },
      include: { _count: { select: { registrations: true } } }
    });
    if (!competition) return res.status(404).json({ status: 'error', message: 'ไม่พบรายการ' });
    
    const booked = competition._count.registrations;
    res.json({ 
      status: 'success', 
      maxPlayer: competition.maxPlayer,
      booked: booked,
      remaining: competition.maxPlayer - booked 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// POST / - สร้าง
exports.createCompetition = async (req, res) => {
  const { name, date, maxPlayer, detail } = req.body;
  if (!name || !date || !maxPlayer) return res.status(400).json({ status: 'error', message: 'ข้อมูลไม่ครบ' });

  try {
    const newComp = await prisma.competition.create({
      data: { name, date: new Date(date), maxPlayer: parseInt(maxPlayer, 10), detail: detail || null }
    });
    res.status(201).json({ status: 'success', data: newComp });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'สร้างไม่สำเร็จ' });
  }
};

// PUT /:id - แก้ไข
exports.updateCompetition = async (req, res) => {
  try {
    const updated = await prisma.competition.update({
      where: { id: parseInt(req.params.id, 10) },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
        maxPlayer: req.body.maxPlayer ? parseInt(req.body.maxPlayer, 10) : undefined
      }
    });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'แก้ไขไม่สำเร็จ' });
  }
};

// DELETE /:id - ลบ
exports.deleteCompetition = async (req, res) => {
  try {
    await prisma.competition.delete({ where: { id: parseInt(req.params.id, 10) } });
    res.json({ status: 'success', message: 'ลบเรียบร้อย' });
  } catch (error) {
    res.status(404).json({ status: 'error', message: 'ไม่พบรายการ' });
  }
};