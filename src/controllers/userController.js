const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * POST /users
 * สร้างผู้ใช้ใหม่
 */
exports.createUser = async (req, res) => {
  const { username, name, email, password, phone, role } = req.body;

  if (!username || !name || !email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'ข้อมูลไม่ครบถ้วน',
      error: {
        detail: 'username, name, email และ password เป็นข้อมูลที่จำเป็น',
      },
    });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        username: String(username),
        name: String(name),
        email: String(email),
        password: String(password), // ⚠️ production ควร hash
        phone: phone ?? null,
        role: role ?? 'user',
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      status: 'success',
      message: 'สร้างผู้ใช้สำเร็จ',
      data: newUser,
    });
  } catch (error) {
    console.error('Create user error:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Username หรือ Email ซ้ำ',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถสร้างผู้ใช้ได้',
    });
  }
};

/**
 * GET /users/:id
 */
exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง',
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบผู้ใช้',
      });
    }

    res.json({
      status: 'success',
      message: 'ดึงข้อมูลผู้ใช้สำเร็จ',
      data: user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้',
    });
  }
};

/**
 * PUT /users/:id
 */
exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง',
    });
  }

  const { username, name, email, password, phone, role } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(username ? { username } : {}),
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        ...(password ? { password } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(role ? { role } : {}),
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      status: 'success',
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบผู้ใช้',
      });
    }

    if (error.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'Username หรือ Email ซ้ำ',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถอัปเดตผู้ใช้ได้',
    });
  }
};

/**
 * DELETE /users/:id
 */
exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง',
    });
  }

  try {
    const deleted = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    res.json({
      status: 'success',
      message: 'ลบผู้ใช้เรียบร้อยแล้ว',
      data: deleted,
    });
  } catch (error) {
    console.error('Delete user error:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบผู้ใช้ที่ต้องการลบ',
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'ไม่สามารถลบผู้ใช้ได้',
    });
  }
};
