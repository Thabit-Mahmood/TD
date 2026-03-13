require('dotenv').config({ path: '.env.local' });

async function testTursoAPI() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;
  
  console.log('Testing Turso HTTP API...');
  console.log('URL:', tursoUrl);
  
  // Convert libsql:// URL to https://
  const httpUrl = tursoUrl.replace('libsql://', 'https://');
  
  console.log('HTTP URL:', httpUrl);
  
  try {
    const response = await fetch(httpUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tursoToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        statements: [
          {
            q: "SELECT * FROM blog_posts LIMIT 1",
            params: [],
          },
        ],
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('\nFull response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data[0]) {
      console.log('\nFirst statement result:');
      console.log(JSON.stringify(data[0], null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testTursoAPI();
