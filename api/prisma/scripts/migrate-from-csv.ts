import prisma from '#core/prisma';
import fs from 'fs';
import path from 'path';

// Define the expected structure of a row in your file
interface DataRow {
  KitapId: number; // Changed to number to match data
  KitapAd: string;
  KitapYazar: string;
  YayınEvi: string;
  // 'SayfaSayısı' is ignored as requested
}

async function main() {
  console.log('Migration script started...');

  const filePath = path.join(__dirname, 'library_database_Backup.csv'); 

  if (!fs.existsSync(filePath)) {
    console.error(`Error: '${path.basename(filePath)}' not found at ${filePath}`);
    console.error('Please make sure the data file is placed in the prisma/scripts directory.');
    return;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // This regex is the core of the fix. It finds anything that looks like a JSON object.
  const objectCandidates = fileContent.match(/\{[^{}]+\}/g);

  if (!objectCandidates) {
    console.error('Could not find any potential data objects in the file.');
    return;
  }
  
  const rows: DataRow[] = [];
  for (const candidate of objectCandidates) {
    try {
      // The second part of the fix: clean up the bad quotes inside the found object.
      const sanitized = candidate.replace(/""/g, '"');
      rows.push(JSON.parse(sanitized));
    } catch (e) {
      console.warn(`Could not parse a data object, skipping. Snippet: ${candidate.substring(0, 100)}...`);
    }
  }

  if (rows.length === 0) {
    console.error('No valid data rows could be parsed from the file. Aborting.');
    return;
  }

  console.log(`Successfully parsed ${rows.length} rows from the data file. Processing...`);

  for (const row of rows) {
    // 1. Clean up the data
    const publisherName = row.YayınEvi?.trim();
    const authorName = row.KitapYazar?.trim();
    const bookTitle = row.KitapAd?.trim();
    const bookIsbn = String(row.KitapId)?.trim(); // Convert number to string for ISBN

    if (!publisherName || !authorName || !bookTitle || !bookIsbn) {
      console.warn('Skipping row due to missing/invalid data:', row);
      continue;
    }

    // 2. Upsert Publisher
    const publisher = await prisma.publisher.upsert({
      where: { name: publisherName },
      update: {},
      create: { name: publisherName },
    });

    // 3. Upsert Author
    const author = await prisma.author.upsert({
      where: { name: authorName },
      update: {},
      create: { name: authorName },
    });

    // 4. Find the book
    const existingBook = await prisma.book.findFirst({
      where: {
        title: {
          equals: bookTitle,
          mode: 'insensitive', // Case-insensitive search
        },
      },
    });
    
    // 5. If book exists, increment totalCopies. Otherwise, create it.
    if (existingBook) {
      await prisma.book.update({
        where: { id: existingBook.id },
        data: { totalCopies: { increment: 1 } },
      });
      console.log(`Updated book: "${bookTitle}" (Total copies: ${existingBook.totalCopies + 1})`);
    } else {
      // Generate a random year between 2020 and 2025
      const publishedYear = Math.floor(Math.random() * 6) + 2020;

      await prisma.book.create({
        data: {
          title: bookTitle,
          isbn: bookIsbn,
          publisherId: publisher.id,
          authorId: author.id,
          publishedYear: publishedYear,
          totalCopies: 1,
        },
      });
      console.log(`Created new book: "${bookTitle}"`);
    }
  }

  console.log('Migration script finished successfully!');
}

main()
  .catch((e) => {
    console.error('An error occurred during migration:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
