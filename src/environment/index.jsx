
const local = {
	BASE_URL: 'http://localhost:8038/api/v1',
};

const staging = {
	BASE_URL: 'http://54.201.160.69:8038/api/v1',
	// BASE_URL: 'https://api.activeage.eu/api/v1',


};

const production = {
	// BASE_URL: 'http://51.21.213.112:8051/api/v1',
	BASE_URL: 'https://api.activeage.eu/api/v1',


};

let Environment = local;
if (process.env.REACT_APP_ENV === "local") Environment = local;
else if (process.env.REACT_APP_ENV === "staging") Environment = staging;
else if (process.env.REACT_APP_ENV === "production") Environment = production;
else module.exports = local;


export default Environment;