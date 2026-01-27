const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /payments
 * ชำระเงินค่าสมัครแข่งขัน
 */
exports.processPayment = async (req, res) => {
  const { registrationId, amount, method } = req.body;

  if (!registrationId || !amount || !method) {
    return res.status(400).json({
      status: 'error',
      message: 'registrationId, amount และ method เป็นข้อมูลที่จำเป็น',
    });
  }

  const regId = parseInt(registrationId, 10);
  const payAmount = parseFloat(amount);

  if (isNaN(regId) || isNaN(payAmount) || payAmount <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'ข้อมูลการชำระเงินไม่ถูกต้อง',
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // เช็ค registration
      const registration = await tx.registration.findUnique({
        where: { id: regId },
        include: {
          competition: true,
          user: true,
        },
      });

      if (!registration) {
        throw { code: 'NOT_FOUND', message: 'ไม่พบข้อมูลการสมัคร' };
      }

      if (registration.status === 'paid') {
        throw { code: 'ALREADY_PAID', message: 'รายการนี้ชำระเงินแล้ว' };
      }

      // สร้าง payment
      const payment = await tx.payment.create({
        data: {
          registrationId: regId,
          amount: payAmount,
          method: String(method),
        },
      });

      // อัปเดตสถานะ registration
      const updatedRegistration = await tx.registration.update({
        where: { id: regId },
        data: { status: 'paid' },
      });

      return { payment, updatedRegistration };
    });

    res.status(201).json({
      status: 'success',
      message: 'ชำระเงินสำเร็จ',
      data: result,
    });
  } catch (error) {
    console.error('Payment error:', error);

    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({
        status: 'error',
        message: error.message,
      });
    }

    if (error.code === 'ALREADY_PAID') {
      return res.status(409).json({
        status: 'error',
        message: error.message,
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถดำเนินการชำระเงินได้',
    });
  }
};

/**
 * GET /payments/:paymentId
 */
exports.getPaymentDetail = async (req, res) => {
  const paymentId = parseInt(req.params.paymentId, 10);

  if (isNaN(paymentId)) {
    return res.status(400).json({
      status: 'error',
      message: 'paymentId ไม่ถูกต้อง',
    });
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        registration: {
          include: {
            competition: true,
            user: true,
          },
        },
      },
    });

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบข้อมูลการชำระเงิน',
      });
    }

    res.json({
      status: 'success',
      message: 'ดึงข้อมูลการชำระเงินสำเร็จ',
      data: payment,
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถดึงข้อมูลการชำระเงินได้',
    });
  }
};
