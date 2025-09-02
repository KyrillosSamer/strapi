import Database from 'better-sqlite3';
import fetch from 'node-fetch';

// ===== إعدادات المشروع =====
const LOCAL_DB = './.tmp/data.db'; // ملف SQLite المحلي
const CLOUD_API = 'https://tranquil-positivity-9ec86ca654.strapiapp.com/api'; // رابط Strapi Cloud
const TOKEN = 'efdeca43da55b082987c5a280c031a233c85de5357c7cdf0f34cf69d700bc59c18c676639dd072c8b2bedafb2dfe853bd6da562dfb4d9706b97884f1bfacb546cd064cc32c393e7652affc1de3dea04c3c449a64156e93af352bcbe8330dd21faa1ddf0648dfb159052f148b2327ce95e9c3b06e41ea63e9e5c83056d4efce11';

// ===== Collection Types =====
const collections = ['clients', 'services', 'teams'];

// ===== دالة لقراءة البيانات Local =====
function getLocalData(tableName) {
  const db = new Database(LOCAL_DB);
  const tableExists = db.prepare(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
  ).get(tableName);

  if (!tableExists) {
    db.close();
    return null; // الجدول غير موجود
  }

  const rows = db.prepare(`SELECT * FROM ${tableName}`).all();
  db.close();
  return rows;
}

// ===== دالة رفع البيانات للـ Cloud =====
async function uploadToCloud(tableName, data) {
  for (const item of data) {
    // حذف الحقول الخاصة بالـ SQLite أو الحقول غير الصالحة للـ Cloud
    delete item.id;
    delete item.created_at;
    delete item.updated_at;
    delete item.document_id;

    try {
      const res = await fetch(`${CLOUD_API}/${tableName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({ data: item }),
      });

      const json = await res.json();
      if (json.error) {
        console.error('Error uploading:', tableName, json.error);
      } else {
        console.log('Uploaded:', tableName, json.data);
      }
    } catch (err) {
      console.error('Fetch error for', tableName, err.message);
    }
  }
}

// ===== تنفيذ السكريبت =====
async function main() {
  for (const collection of collections) {
    const localData = getLocalData(collection);
    if (!localData) {
      console.log(`Table "${collection}" does not exist in local DB.`);
      continue;
    }

    if (localData.length === 0) {
      console.log(`No data found for "${collection}".`);
      continue;
    }

    console.log(`Uploading ${localData.length} items for "${collection}"...`);
    await uploadToCloud(collection, localData);
  }

  console.log('All data upload attempt finished!');
}

main();
