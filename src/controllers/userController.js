const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createUser = async (req, res) => {
  try {
    const { username, name, email, password, phone, role } = req.body;
    const newUser = await prisma.user.create({
      data: { username, name, email, password, phone, role }
    });
    res.status(201).json({ status: 'success', data: newUser });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'สร้างไม่สำเร็จ (Username หรือ Email ซ้ำ)' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { 
        id: true, username: true, name: true, 
        email: true, phone: true, role: true, createdAt: true 
      }
    });
    if (!user) return res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้' });
    res.json({ status: 'success', data: user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

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

exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ status: 'success', message: 'ลบผู้ใช้เรียบร้อยแล้ว' });
  } catch (error) {
    res.status(404).json({ status: 'error', message: 'ไม่พบผู้ใช้ที่ต้องการลบ' });
  }
};