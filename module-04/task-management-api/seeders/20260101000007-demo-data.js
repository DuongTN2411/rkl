'use strict';

const bcrypt = require('bcrypt');

const dateOffset = (days) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const password = bcrypt.hashSync('123456', 10);

    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('attachments', null, {});
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('project_members', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'Nguyen Van An',
        email: 'owner@example.com',
        password,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: 'Tran Thi Binh',
        email: 'member@example.com',
        password,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: 'Le Van Chi',
        email: 'chi@example.com',
        password,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        name: 'Pham Van Dung',
        email: 'dung@example.com',
        password,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('projects', [
      {
        id: 1,
        name: 'Website ban hang',
        description: 'Xay dung website ban hang cho cua hang noi that',
        start_date: dateOffset(-30),
        end_date: dateOffset(60),
        owner_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        name: 'Ung dung noi bo',
        description: 'He thong quan ly cong viec va cham cong noi bo',
        start_date: dateOffset(-10),
        end_date: dateOffset(90),
        owner_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        name: 'Chien dich Marketing',
        description: 'Chien dich quang ba san pham mua thu',
        start_date: dateOffset(-5),
        end_date: dateOffset(45),
        owner_id: 2,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('project_members', [
      { project_id: 1, user_id: 1, created_at: now, updated_at: now },
      { project_id: 1, user_id: 2, created_at: now, updated_at: now },
      { project_id: 1, user_id: 3, created_at: now, updated_at: now },
      { project_id: 2, user_id: 1, created_at: now, updated_at: now },
      { project_id: 2, user_id: 2, created_at: now, updated_at: now },
      { project_id: 3, user_id: 2, created_at: now, updated_at: now },
      { project_id: 3, user_id: 1, created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('tasks', [
      {
        id: 1,
        project_id: 1,
        title: 'Thiet ke trang chu',
        description: 'Thiet ke giao dien trang chu responsive',
        status: 'done',
        priority: 'high',
        due_date: dateOffset(-10),
        assignee_id: 3,
        created_at: now,
        updated_at: now,
      },
      {
        id: 2,
        project_id: 1,
        title: 'Xay dung API gio hang',
        description: 'API them, sua, xoa san pham trong gio hang',
        status: 'doing',
        priority: 'high',
        due_date: dateOffset(5),
        assignee_id: 2,
        created_at: now,
        updated_at: now,
      },
      {
        id: 3,
        project_id: 1,
        title: 'Tich hop cong thanh toan',
        description: 'Tich hop cong thanh toan noi dia',
        status: 'todo',
        priority: 'medium',
        due_date: dateOffset(20),
        assignee_id: 2,
        created_at: now,
        updated_at: now,
      },
      {
        id: 4,
        project_id: 1,
        title: 'Kiem thu giao dien',
        description: 'Kiem thu cac man hinh tren thiet bi di dong',
        status: 'todo',
        priority: 'low',
        due_date: dateOffset(-3),
        assignee_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 5,
        project_id: 1,
        title: 'Viet tai lieu huong dan',
        description: 'Huong dan su dung cho quan tri vien',
        status: 'todo',
        priority: 'low',
        due_date: null,
        assignee_id: null,
        created_at: now,
        updated_at: now,
      },
      {
        id: 6,
        project_id: 2,
        title: 'Phan tich yeu cau',
        description: 'Tong hop yeu cau tu cac phong ban',
        status: 'done',
        priority: 'medium',
        due_date: dateOffset(-15),
        assignee_id: 2,
        created_at: now,
        updated_at: now,
      },
      {
        id: 7,
        project_id: 2,
        title: 'Thiet ke co so du lieu',
        description: 'Thiet ke ERD cho he thong cham cong',
        status: 'doing',
        priority: 'high',
        due_date: dateOffset(10),
        assignee_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 8,
        project_id: 2,
        title: 'Xay dung module cham cong',
        description: 'API cham cong va tinh gio lam viec',
        status: 'todo',
        priority: 'high',
        due_date: dateOffset(30),
        assignee_id: 2,
        created_at: now,
        updated_at: now,
      },
      {
        id: 9,
        project_id: 3,
        title: 'Lap ke hoach noi dung',
        description: 'Xac dinh thong diep va kenh truyen thong',
        status: 'doing',
        priority: 'medium',
        due_date: dateOffset(7),
        assignee_id: 1,
        created_at: now,
        updated_at: now,
      },
      {
        id: 10,
        project_id: 3,
        title: 'Thiet ke banner quang cao',
        description: 'Bo banner cho fanpage va website',
        status: 'todo',
        priority: 'low',
        due_date: dateOffset(-1),
        assignee_id: 2,
        created_at: now,
        updated_at: now,
      },
    ]);

    await queryInterface.bulkInsert('comments', [
      {
        task_id: 2,
        user_id: 1,
        content: 'Can bo sung them API ap dung ma giam gia.',
        created_at: now,
        updated_at: now,
      },
      {
        task_id: 2,
        user_id: 2,
        content: 'Da ghi nhan, toi se cap nhat trong hom nay.',
        created_at: now,
        updated_at: now,
      },
      {
        task_id: 7,
        user_id: 1,
        content: 'Can them bang lich su chinh sua cham cong.',
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('attachments', null, {});
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('project_members', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
