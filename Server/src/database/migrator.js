import { Umzug, SequelizeStorage } from 'umzug';

export async function migrateUp(sequelize) {
    const umzug = new Umzug({
        migrations: { 
            glob: 'Server/src/database/migrations/*.cjs'
        },
        storage: new SequelizeStorage({ sequelize }),
        context: sequelize.getQueryInterface(),
        logger: console,
    });
    
    try {
        await umzug.up();
        console.log('Migrations applied successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}