/**
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
const AdminMiddleware = async (req, res, next) => {
	try {
		if (!req.currentUser.laAdmin)
			throw new Error("Permisson denied!");

		next();
	} catch (error) {
		res.status(101).send({ message: error.message });
	}
};

module.exports = AdminMiddleware;
