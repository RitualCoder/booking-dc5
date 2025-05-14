import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Nettoyer la base de données
  await prisma.reservation.deleteMany();
  await prisma.classroom.deleteMany();
  await prisma.user.deleteMany();

  // Créer des utilisateurs
  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: UserRole.USER,
    },
  });

  // Créer des salles de classe
  const classrooms = await Promise.all([
    prisma.classroom.create({
      data: {
        name: "Salle 101",
        capacity: 30,
        equipment: ["Vidéoprojecteur", "Tableau blanc", "WiFi"],
        isActive: true,
      },
    }),
    prisma.classroom.create({
      data: {
        name: "Salle 102",
        capacity: 20,
        equipment: ["Tableau blanc", "WiFi"],
        isActive: true,
      },
    }),
    prisma.classroom.create({
      data: {
        name: "Salle 103",
        capacity: 50,
        equipment: [
          "Vidéoprojecteur",
          "Tableau blanc",
          "WiFi",
          "Système audio",
        ],
        isActive: true,
      },
    }),
    prisma.classroom.create({
      data: {
        name: "Salle 104",
        capacity: 15,
        equipment: ["Tableau blanc", "WiFi"],
        isActive: false,
      },
    }),
  ]);

  // Créer des réservations
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await Promise.all([
    // Réservation pour aujourd'hui
    prisma.reservation.create({
      data: {
        startTime: new Date(now.setHours(9, 0, 0, 0)),
        endTime: new Date(now.setHours(10, 30, 0, 0)),
        userId: user.id,
        classroomId: classrooms[0].id,
      },
    }),
    // Réservation pour demain
    prisma.reservation.create({
      data: {
        startTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
        endTime: new Date(tomorrow.setHours(16, 0, 0, 0)),
        userId: admin.id,
        classroomId: classrooms[1].id,
      },
    }),
    // Réservation pour la semaine prochaine
    prisma.reservation.create({
      data: {
        startTime: new Date(nextWeek.setHours(10, 0, 0, 0)),
        endTime: new Date(nextWeek.setHours(12, 0, 0, 0)),
        userId: user.id,
        classroomId: classrooms[2].id,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
