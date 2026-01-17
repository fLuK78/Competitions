exports.processPayment = (req, res) => {
    res.status(201).json({ 
        message: "บันทึกข้อมูลการชำระเงินเรียบร้อย",
        paymentData: req.body 
    });
};
exports.getPaymentDetail = (req, res) => {
    res.status(200).json({ 
        message: `สถานะการชำระเงินรหัส: ${req.params.paymentId}` 
    });
};