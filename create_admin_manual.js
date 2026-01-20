
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/userModel.js';
import Tenant from './src/models/tenantModel.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
    console.error("❌ No MONGO_URI found in .env");
    process.exit(1);
}

const createAdmin = async () => {
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // 1. Ensure Tenant
        let tenant = await Tenant.findOne({ name: 'Einsmart' });
        if (!tenant) {
            console.log('Creating Tenant "Einsmart"...');
            tenant = await Tenant.create({
                name: 'Einsmart',
                domain: 'einsmart.cl',
                theme: { primaryColor: '#3b82f6', secondaryColor: '#1e293b' }
            });
        } else {
            console.log('✅ Tenant "Einsmart" found.');
        }

        // 2. Ensure User
        const email = 'yuri@einsmart.cl';
        const password = '123456';

        // Remove existing to be clean? Or update? Update is safer.
        let user = await User.findOne({ email });

        const passwordHash = await bcrypt.hash(password, 10);

        if (user) {
            console.log(`User ${email} found. Updating to Admin...`);
            user.passwordHash = passwordHash;
            user.role = 'admin';
            user.name = 'Yuri Admin';
            user.tenantId = tenant._id;
            await user.save();
            console.log('✅ User updated successfully.');
        } else {
            console.log(`Creating user ${email}...`);
            // Check if rut conflicts exist (although sparse)

            user = await User.create({
                name: 'Yuri Admin',
                email,
                passwordHash,
                role: 'admin',
                tenantId: tenant._id,
                rut: '1-9' // Dummy RUT for admin
            });
            console.log('✅ User created successfully.');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

createAdmin();
