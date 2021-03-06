const pool = require('../../databasePool');
const DragonTable = require('./table');
const Dragon = require('./index');

const getDragonWithTraits = ({ dragonId }) => {
	return Promise.all([
		DragonTable.getDragon({ dragonId }),
		new Promise((resolve, reject) => {
			pool.query(
				`SELECT "traitType", "traitValue"
				FROM trait
				INNER JOIN dragonTrait ON trait.id = dragonTrait."traitId"
				WHERE dragonTrait."dragonId" = $1`,
				[dragonId],
				(err, res) => {
					if (err) return reject(err);

					resolve(res.rows);
				}
			);
		})
	])
		.then(([dragon, dragonTraits]) => {
			return new Dragon({ ...dragon, dragonId, traits: dragonTraits });
		})
		.catch(err => console.error('Error', err));
};

module.exports = { getDragonWithTraits };
