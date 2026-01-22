const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.registerCompetition = async (req, res) => {
    try {
        const { userId, competitionId } = req.body;
        const result = await prisma.registration.create({
            data: {
                userId: parseInt(userId),
                competitionId: parseInt(competitionId),
                status: "pending"
            }
        });
        res.status(201).json({ status: "success", data: result });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.getPlayerHistory = async (req, res) => {
    try {
        const { playerId } = req.params;
        const history = await prisma.registration.findMany({
            where: { userId: parseInt(playerId) },
            include: { competition: true } 
        });
        res.json({ status: "success", data: history });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const updated = await prisma.registration.update({
            where: { id: parseInt(req.params.id) },
            data: { status: "cancelled" }
        });
        res.json({ status: "success", message: "ยกเลิกแล้ว", data: updated });
    } catch (error) { res.status(404).json({ message: error.message }); }
};

exports.approveRegistration = async (req, res) => {
    try {
        const updated = await prisma.registration.update({
            where: { id: parseInt(req.params.id) },
            data: { status: "approved" }
        });
        res.json({ status: "success", message: "อนุมัติแล้ว", data: updated });
    } catch (error) { res.status(404).json({ message: error.message }); }
};

exports.rejectRegistration = async (req, res) => {
    try {
        const updated = await prisma.registration.update({
            where: { id: parseInt(req.params.id) },
            data: { status: "rejected" }
        });
        res.json({ status: "success", message: "ปฏิเสธแล้ว", data: updated });
    } catch (error) { res.status(404).json({ message: error.message }); }
};