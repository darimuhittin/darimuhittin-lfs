import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirestoreService {
  constructor(
    @Inject('FIRESTORE_CLIENT')
    private readonly firestore: admin.firestore.Firestore,
  ) {}

  collection<T>(collectionName: string) {
    return this.firestore.collection(
      collectionName,
    ) as admin.firestore.CollectionReference<T>;
  }

  async findOne<T>(
    collectionName: string,
    id: string,
  ): Promise<T & { id: string }> {
    const doc = await this.firestore.collection(collectionName).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() } as T & { id: string };
  }

  async findBy<T>(
    collectionName: string,
    field: string,
    value: any,
  ): Promise<Array<T & { id: string }>> {
    const snapshot = await this.firestore
      .collection(collectionName)
      .where(field, '==', value)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Array<T & { id: string }>;
  }

  async create<T>(
    collectionName: string,
    data: T,
  ): Promise<T & { id: string }> {
    const docRef = await this.firestore.collection(collectionName).add(data);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as T & { id: string };
  }

  async update<T>(
    collectionName: string,
    id: string,
    data: Partial<T>,
  ): Promise<void> {
    await this.firestore.collection(collectionName).doc(id).update(data);
  }

  async delete(collectionName: string, id: string): Promise<void> {
    await this.firestore.collection(collectionName).doc(id).delete();
  }
}
