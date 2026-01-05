import 'dotenv/config';
import app from './app';
import { connectDatabase } from './config/database';
import { validateEnv } from './config/env';

validateEnv();

const PORT = process.env.PORT || 5000;

connectDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
