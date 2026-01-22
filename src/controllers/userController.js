const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ดูข้อมูลผู้ใช้ตาม 
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });
    if (!user) return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// แก้ไขข้อมูลผู้ใช้ 
exports.updateUser = async (req, res) => {
  try {
    const updated = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json({ status: 'success', data: updated });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'อัปเดตไม่สำเร็จ' });
  }
};

// ลบผู้ใช้
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ status: 'success', message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
  } catch (error) {
    res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้ที่ต้องการลบ' });
  }
};