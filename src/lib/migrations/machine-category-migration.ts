import { collection, getDocs, writeBatch, doc, Timestamp, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { Machine } from '@/types/index';
import { MACHINE_CATEGORIES, WORK_PHASES } from '../constants';
import * as fs from 'fs';
import * as path from 'path';

export async function runMachineMigration() {
  console.log('Starting machine migration...');
  const machinesRef = collection(db, 'machines');
  const batch = writeBatch(db);
  const logPath = path.resolve(__dirname, 'migration-log.txt');
  let successCount = 0;
  let errorCount = 0;

  try {
    const machinesSnapshot = await getDocs(machinesRef);
    const migrationLogs: string[] = [];

    for (const machineDoc of machinesSnapshot.docs) {
      const machineData = machineDoc.data() as Machine;
      
      try {
        // Migração de categoria e subcategoria
        const updatedMachine: DocumentData = {
          ...machineData,
          categories: machineData.category ? [machineData.category] : machineData.categories || [],
          subcategories: machineData.subcategories || [],
          workPhases: machineData.workPhase ? [machineData.workPhase] : machineData.workPhases || [],
          categoryDetails: machineData.categoryDetails || {}
        };

        // Adicionar detalhes de categoria se não existirem
        if (machineData.category && !updatedMachine.categoryDetails?.[machineData.category]) {
          updatedMachine.categoryDetails = {
            ...updatedMachine.categoryDetails,
            [machineData.category]: {
              primaryCategory: true,
              subcategories: machineData.subcategories || [],
              additionalInfo: {}
            }
          };
        }

        // Atualizar documento no Firestore
        const machineDocRef = doc(db, 'machines', machineDoc.id);
        batch.update(machineDocRef, updatedMachine);

        migrationLogs.push(`Migrated machine: ${machineData.name} (${machineDoc.id})`);
        successCount++;
      } catch (migrationError) {
        console.error(`Error migrating machine ${machineDoc.id}:`, migrationError);
        migrationLogs.push(`Error migrating machine: ${machineData.name} (${machineDoc.id})`);
        errorCount++;
      }
    }

    // Commit batch
    await batch.commit();

    // Escrever logs
    const logContent = [
      `Migration Summary:`,
      `Total Machines: ${machinesSnapshot.size}`,
      `Successfully Migrated: ${successCount}`,
      `Errors: ${errorCount}`,
      `\n--- Migration Logs ---\n`,
      ...migrationLogs
    ].join('\n');

    fs.writeFileSync(logPath, logContent);
    console.log('Machine migration completed successfully.');
    console.log(`Log file written to: ${logPath}`);

  } catch (error) {
    console.error('Migration failed:', error);
    fs.writeFileSync(logPath, `Migration Failed: ${error}`);
  }
}

// Executar migração se o script for chamado diretamente
if (require.main === module) {
  runMachineMigration();
}
