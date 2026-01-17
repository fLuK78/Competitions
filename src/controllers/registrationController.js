exports.registerCompetition = (req, res) => {
    res.status(201).json({ 
        message: "จองการแข่งขันสำเร็จ (รอชำระเงิน/อนุมัติ)",
        data: req.body 
    });
};
exports.getPlayerHistory = (req, res) => {
    res.status(200).json({ 
        message: `ประวัติการแข่งขันของ Player: ${req.params.playerId}` 
    });
};

exports.cancelRegistration = (req, res) => {
    res.status(200).json({ 
        message: `ยกเลิกการจองรหัส ${req.params.id} สำเร็จ` 
    });
};

exports.approveRegistration = (req, res) => {
    res.status(200).json({ 
        message: `อนุมัติการสมัครรหัส ${req.params.id} แล้ว` 
    });
};

exports.rejectRegistration = (req, res) => {
    res.status(200).json({ 
        message: `ปฏิเสธการสมัครรหัส ${req.params.id} แล้ว` 
    });
};