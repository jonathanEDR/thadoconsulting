/**
 * Script para generar favicon.ico real desde archivos PNG
 * Esto es necesario porque Google Search requiere un archivo ICO real,
 * no un PNG renombrado.
 */

import pngToIco from 'png-to-ico';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

async function generateFavicon() {
  console.log('Generando favicon.ico real para Google Search...\n');

  // Archivos PNG a incluir en el ICO (de mayor a menor)
  const pngFiles = [
    'favicon-48x48.png',
    'favicon-32x32.png',
    'favicon-16x16.png'
  ];

  const existingFiles = [];

  for (const file of pngFiles) {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      existingFiles.push(filePath);
      console.log(`  ✓ Encontrado: ${file}`);
    } else {
      console.log(`  ✗ No encontrado: ${file}`);
    }
  }

  if (existingFiles.length === 0) {
    console.error('\n❌ Error: No se encontraron archivos PNG para generar el favicon.ico');
    process.exit(1);
  }

  try {
    // Generar el archivo ICO
    const icoBuffer = await pngToIco(existingFiles);

    // Guardar el archivo
    const outputPath = path.join(publicDir, 'favicon.ico');
    fs.writeFileSync(outputPath, icoBuffer);

    // Verificar el resultado
    const stats = fs.statSync(outputPath);

    console.log(`\n✅ favicon.ico generado exitosamente!`);
    console.log(`   Ubicación: ${outputPath}`);
    console.log(`   Tamaño: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`   Incluye: ${existingFiles.length} tamaños de icono`);

    // Verificar que es un ICO real
    const header = fs.readFileSync(outputPath).slice(0, 4);
    if (header[0] === 0 && header[1] === 0 && header[2] === 1 && header[3] === 0) {
      console.log(`   Formato: ICO válido ✓`);
    } else {
      console.log(`   ⚠️ Advertencia: El archivo puede no ser un ICO válido`);
    }

  } catch (error) {
    console.error('\n❌ Error al generar favicon.ico:', error.message);
    process.exit(1);
  }
}

generateFavicon();
