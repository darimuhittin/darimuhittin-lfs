import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirestoreService } from './firestore.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIRESTORE_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const serviceAccount = {
          projectId: configService.get('FIREBASE_PROJECT_ID'),
          privateKey: configService
            .get('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
          clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
        };

        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
          });
        }

        return admin.firestore();
      },
    },
    FirestoreService,
  ],
  exports: [FirestoreService, 'FIRESTORE_CLIENT'],
})
export class FirestoreModule {}
