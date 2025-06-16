import PostGresDataSource from '../../datasource/data-source';

(async (): Promise<void> => {
  try {
    console.log('🚀 Connettendo al database...');
    const dataSource = await PostGresDataSource.initialize(); // Risolvi la Promise

    console.log('🚀 Avviando i Seeder...');
    console.log('✅ Seeder completati con successo!');

    await dataSource.destroy(); // Distruggi la connessione
  } catch (error) {
    console.error("❌ Errore durante l'esecuzione del seeder:", error);
    process.exit(1);
  }
})().catch((error) => {
  console.error("❌ Errore durante l'esecuzione del seeder:", error);
  process.exit(1);
});
