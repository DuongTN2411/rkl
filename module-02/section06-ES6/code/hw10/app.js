import { fetchUsers } from "./apiService.js";

async function main() {
  const users = await fetchUsers();
  const html = users.map(({ name, email, website }) => `
    <div>
      <p>${name}</p>
      <p>${email}</p>
      <p>${website}</p>
    </div>
  `).join("");
  document.getElementById("app").innerHTML = html;
}

main();
