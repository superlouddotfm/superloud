const { Requester, Validator } = require("@chainlink/external-adapter");

/**
 * 
 * Spinamp API external adapter
 * Here, we use this adapter to get the ethereum address of the artist that created the original song
 * This way, we can index in our smart contract if the curator is the artist (curator wallet address = artist address) or someone else ()
 * 
 */


// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = data => {
  if (data.Response === "Error") return true;
  return false;
};

/**
 *
 * @param {any} input
 * @param {(status:number, result:any)=>{}} callback
 */
const createRequest = (input, callback) => {
  // The Validator helps you validate the Chainlink request data);
  const validator = new Validator(input, {
    idSong: ['idSong']
  }, callback);

  const jobRunID = validator.validated.id;
  const idSong = validator.validated.data.idSong

  // Axios config
  const config = {
    url: "https://spindex-api.spinamp.xyz/v1/graphql",
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        },
    method: 'POST',
    data: { query: `query GetSongCreator {
        processedTrackById(id: "${idSong}") {
          id
          artistByArtistId {
            address
          }
        }
      }
      `
    }
   }  
  
  // The Requester allows API calls be retry in case of timeout
  // or connection failure
  Requester.request(config, customError)
    .then(response => {
      // It's common practice to store the desired value at the top-level
      // result key. This allows different adapters to be compatible with
      // one another.
      response.data = {
        result: response.data,
        date: response.headers.date,
      };

      callback(response.status, Requester.success(jobRunID, response));
    })
    .catch(error => {
        console.error(error.headers)

      callback(500, Requester.errored(jobRunID, error));
    });
};

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false,
    });
  });
};

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest;