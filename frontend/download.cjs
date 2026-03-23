const fs = require('fs');
const https = require('https');

const screens = {
  competitor_discovery: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA5M2UwZmJhMDBkMDQ4NTlhYjBhMWM4NWNiNzIzZmE5EgsSBxCD65PMuhEYAZIBJAoKcHJvamVjdF9pZBIWQhQxODM3Nzk5Nzc5NTE3Nzg1MjM3OQ&filename=&opi=89354086",
  dashboard_overview: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QwYWQ3NjlhYzM2YjRhN2FiY2IzYmQ3YTNmNWZkYjRmEgsSBxCD65PMuhEYAZIBJAoKcHJvamVjdF9pZBIWQhQxODM3Nzk5Nzc5NTE3Nzg1MjM3OQ&filename=&opi=89354086",
  pattern_insights: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M4NzQ1NmU0NDllMjQzNWE5NWU3NDU2ZDU0OGMyMDY0EgsSBxCD65PMuhEYAZIBJAoKcHJvamVjdF9pZBIWQhQxODM3Nzk5Nzc5NTE3Nzg1MjM3OQ&filename=&opi=89354086",
  search_analyze_landing: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U4NjFjZDdmODY5ZjRjNzE4MjYwYjMwODkwMTQ2ZWRhEgsSBxCD65PMuhEYAZIBJAoKcHJvamVjdF9pZBIWQhQxODM3Nzk5Nzc5NTE3Nzg1MjM3OQ&filename=&opi=89354086",
  growth_strategy: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzFiMjk2N2Y3OThiOTQxYmY4NWU3OGQ0MzViNDE4MDVmEgsSBxCD65PMuhEYAZIBJAoKcHJvamVjdF9pZBIWQhQxODM3Nzk5Nzc5NTE3Nzg1MjM3OQ&filename=&opi=89354086"
};

if (!fs.existsSync('src/screens')) {
  fs.mkdirSync('src/screens', { recursive: true });
}

Object.entries(screens).forEach(([name, url]) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      fs.writeFileSync(`src/screens/${name}.html`, data);
      console.log(`Downloaded ${name}.html`);
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${name}:`, err.message);
  });
});
