const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.processPayment = async (req, res) => {
    try {
        const { registrationId, amount, method } = req.body;
        const payment = await prisma.payment.create({
            data: {
                registrationId: parseInt(registrationId),
                amount: parseFloat(amount),
                method: method
            }
        });
        await prisma.registration.update({
            where: { id: parseInt(registrationId) },
            data: { status: "paid" }
        });
        res.status(201).json({ status: "success", data: payment });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getPaymentDetail = async (req, res) => {
    try {
        const payment = await prisma.payment.findUnique({
            where: { id: parseInt(req.params.paymentId) }
        });
        res.json({ status: "success", data: payment });
    } catch (error) {
        res.status(404).json({ message: "ไม่พบข้อมูลการจ่ายเงิน" });
    }
};