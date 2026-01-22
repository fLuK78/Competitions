const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ให้ลงทะเบียน
exports.approveRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma.registration.update({
            where: { id: parseInt(id) },
            data: { status: 'approved' }
        });
        res.json({ status: 'success', message: 'อนุมัติการลงทะเบียนเรียบร้อย', data: result });
    } catch (error) {
        res.status(404).json({ status: 'error', message: 'ไม่พบรหัสการลงทะเบียนนี้' });
    }
};

// ไม่ให้ลงทะเบียน
exports.rejectRegistration = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await prisma.registration.update({
            where: { id: parseInt(id) },
            data: { status: 'rejected' }
        });
        res.json({ status: 'success', message: 'ปฏิเสธการลงทะเบียนเรียบร้อย', data: result });
    } catch (error) {
        res.status(404).json({ status: 'error', message: 'ไม่พบรหัสการลงทะเบียนนี้' });
    }
};