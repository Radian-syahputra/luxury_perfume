import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerService = async (
  name: string,
  email: string,
  password: string
) => {
  // Check Email Apakah Sudah Terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("Email Sudah Terdaftar");
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Buat User Baru
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return newUser;
};

export const loginService = async (email: string, password: string) => {
  // Check Apakah Terdaftar
  const currentUser = await prisma.user.findUnique({
    where: { email },
  });
  if (!currentUser) {
    throw new Error("Email Belum Terdaftar");
  }

  // Compare Password
  const isPassword = await bcrypt.compare(password, currentUser.password);
  if (!isPassword) {
    throw new Error("Password Invalid");
  }

  // Token
  const token = jwt.sign(
    { id: currentUser.id, role: currentUser.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

      // destructuring untuk buang password
    const { password: _, ...userWithoutPassword } = currentUser

    return { token, currentUser: userWithoutPassword }
};

export const getMeService = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
