import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() {
  }



  async getDatabaseInstance() {
    try {
      if (!('indexedDB' in window)) {
        throw new Error('This browser doesn\'t support IndexedDB');
      }
      return await openDB(environment.DB_NAME, 3, {
        upgrade(db, oldVersion, newVersion, transaction) {
          if (!db.objectStoreNames.contains('files')) {
            const usersStore = db.createObjectStore('files', { keyPath: 'name' });
            usersStore.createIndex('name', 'name');
          }
        }
      });
    } catch (err) {
      throw err;
    }
  }

  async writeIntoDatabase(objectStore: string, item) {
    try {

      console.log(item);
      const db = await this.getDatabaseInstance();
      console.log(db);
      var tx = db.transaction(objectStore, 'readwrite');
      console.log(tx, 'Transactions')
      var store = tx.objectStore(objectStore);
      await store.add(item);
      return await tx.done;
    } catch (err) {
      throw err;
    }
  }



}
