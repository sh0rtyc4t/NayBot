module.exports = {

    /**
     * @returns {Array<Firestore.DocumentSnapshot.data>} - All data of the documents in the collection.
     */
    "getAll": {
        async value () {
            const snapshotQuery = await this.get();
            return snapshotQuery.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        }
    }
};