exports.getCompetitions = (req, res) => {
    const { keyword } = req.query;
    res.status(200).json({ 
        message: `เรียกดูรายการการแข่งขัน ${keyword ? 'ค้นหา: ' + keyword : ''}`,
        status: "success" 
    });
};

exports.getCompetitionById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({ 
        message: `ข้อมูลการแข่งขันรหัส: ${id}`,
        status: "success" 
    });
};

exports.getSlots = (req, res) => {
    res.status(200).json({ 
        availableSlots: 15,
        status: "success" 
    });
};

exports.createCompetition = (req, res) => {
    res.status(201).json({ 
        message: "เพิ่มงานแข่งขันใหม่เรียบร้อยแล้ว",
        data: req.body 
    });
};

exports.updateCompetition = (req, res) => {
    res.status(200).json({ 
        message: `แก้ไขการแข่งขันรหัส ${req.params.id} สำเร็จ` 
    });
};

exports.deleteCompetition = (req, res) => {
    res.status(200).json({ 
        message: `ลบการแข่งขันรหัส ${req.params.id} เรียบร้อย` 
    });
};