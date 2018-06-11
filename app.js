var Web3 = require('web3');
var express = require('express');
var config = require('config');

var nodeConfig = config.get('node')
var contractConfig = config.get('contract');

var web3 = new Web3(nodeConfig.url + ":" + nodeConfig.port);

var timestampContractABI = require("./build/contracts/Timestamp.json").abi;

var timestampContract = new web3.eth.Contract(timestampContractABI, contractConfig.address, {});

var currentAccount = '';

web3.eth.getAccounts().then((accounts) => {

    currentAccount = accounts[0];

    console.log("Current account: " + currentAccount);

    startServer();

})

function startServer() {

    var app = express();

    app.get('/getCount', function (req, res) {

        timestampContract.methods.getCount().call({
            from: currentAccount
        }, function (error, result) {

            if (error) {

                res.send("ERRORE: " + error);
                return;
            }

            var response = {
                count: result
            }

            res.send(response);
        });
    });

    app.get('/getTimestamp', function (req, res) {

        var id = req.query.id;

        if (id === undefined) {

            res.send("No parameter 'id' catched.");
            return;
        }

        timestampContract.methods.getTimestamp(id).call({
            from: currentAccount
        }, function (error, result) {

            if (error) {

                res.send("ERRORE: " + error);
                return;
            }

            var response = {
                hash: result
            }

            res.send(response);
        });
    });

    app.get('/addTimestamp', function (req, res) {

        var hash = req.query.hash;

        if (hash === undefined) {

            res.send("No parameter 'hash' catched.");
            return;
        }

        timestampContract.methods.addTimestamp(hash).send({
                from: currentAccount
            })

        timestampContract.once('TimestampEvent', function (error, event) {
            
            var result = {
                "txhash" : event.transactionHash,
                "hashID" : event.returnValues.index
            }

            res.send(result);
        });

    });

    app.listen(3000, function () {
        console.log('Server running, listening port 3000!');
    });
}