const { PrismaClient, Prisma } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('=== 1. Tao Author kem hai Book (mot lan prisma.author.create) ===');
  const author = await prisma.author.create({
    data: {
      name: 'Nguyen Nhat Anh',
      books: {
        create: [
          { title: 'Cho toi xin mot ve di tuoi tho', price: 85000 },
          { title: 'Mat biec', price: 95000 },
        ],
      },
    },
    include: { books: true },
  });
  console.log(JSON.stringify(author, null, 2));

  console.log('\n=== 2. Doc Author kem toan bo Book bang include ===');
  const found = await prisma.author.findUnique({
    where: { id: author.id },
    include: { books: true },
  });
  console.log(JSON.stringify(found, null, 2));

  console.log('\n=== 3. Cap nhat gia mot Book ===');
  const updated = await prisma.book.update({
    where: { id: found.books[0].id },
    data: { price: 99000 },
  });
  console.log(updated);

  console.log('\n=== 4. Xoa mot Book ===');
  const deleted = await prisma.book.delete({ where: { id: found.books[1].id } });
  console.log('Da xoa:', deleted);

  console.log('\n=== 5. Xoa lai id da bi xoa (kiem tra bat loi) ===');
  try {
    await prisma.book.delete({ where: { id: deleted.id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      console.log('Khong the xoa: Book co id ' + deleted.id + ' khong ton tai.');
    } else {
      throw error;
    }
  }
}

main()
  .catch((error) => {
    console.error('Loi:', error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
