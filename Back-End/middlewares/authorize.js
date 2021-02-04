const authorize = () => {

	return (req, res, next) => {

		if (!req.auth) {
			return res.status(401).send('Not authenticated!');
		}
		
		next();

	}
}

module.exports = authorize;