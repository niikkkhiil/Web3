const { Transaction } = require('ethereumjs-tx');
var Web3 = require('web3');
var config = require('../js/config');
var TX = require('ethereumjs-tx').Transaction


var password = config.password;
const provider = config.provider;
var web3 = new Web3(provider);
var PrivateKey = Buffer.from(config.PrivateKey, 'hex',)
var contractAddress = config.contractAddress;
var AccountAddress = config.AccountAddress;





let interface = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "aadhar_no",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "gender",
				"type": "string"
			}
		],
		"name": "createPatientRecord",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "aadhar_no",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "report_hash",
				"type": "string"
			}
		],
		"name": "updatePatientReport",
		"outputs": [
			{
				"internalType": "bool",
				"name": "success",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "aadhar_no",
				"type": "uint256"
			}
		],
		"name": "getPatient",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "age",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "gender",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "report_hash",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "flag",
						"type": "bool"
					}
				],
				"internalType": "struct PatientInformation.Patient",
				"name": "patient_details",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patients",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "age",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "gender",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "report_hash",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "flag",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];


exports.getPatient = function (req, res) {
	

    try {

        var aadhar_no = req.query.aadhar_no;
		console.log (aadhar_no)

        if (aadhar_no) {

            const contract = new web3.eth.Contract(interface, contractAddress);
            contract.methods.getPatient(aadhar_no).call((function (error, result) {

                if (result) {
                    res.status(200).send({
                        "StatusCode": 200,
                        "Balance": result
                    });

                } else {

                    res.status(500).send({
                        "StatusCode": 500,
                        "Error": error.toString()
                    });
                }
            })).catch(function (err) {

                res.status(500).send({
                    "StatusCode": 500,
                    "Error": err.toString()
                })
            })

        } else {

            res.status(500).send({
                "statusCode": 500,
                "Data": "Please fill all required fields"
            });
        }

    }
    catch (e) {

        res.status(500).send({
            "statusCode": 500,
            "Error": e.toString()
        });

    }

};

exports.createPatientRecord =async function (req, res){

	try {

        var aadhar_no = req.body.aadhar_no;
        var name = req.body.name;
        var age = req.body.age;
		var gender = req.body.gender
		var _from = AccountAddress;

       

        if (aadhar_no && name && age && gender) {
            
            var contract = new web3.eth.Contract(interface, contractAddress);
            var nonceT = await web3.eth.getTransactionCount(_from);
            var Data = contract.methods.createPatientRecord(aadhar_no, name, age, gender).encodeABI();

            let RawTransaction = {
                "from": _from,
                "to": aadhar_no,
                "Data": Data,
                "nonce": nonceT,
                "value": '0x0',
                "gasPrice": web3.utils.toHex(20 * 1e9),
                "gasLimit": web3.utils.toHex(210000)
            }
             console.log(RawTransaction);
             const transaction = new TX(RawTransaction, {chain: 'rinkeby', hardfork: 'petersburg'});
            transaction.sign(PrivateKey);
            
            const serializeTx = transaction.serialize();
            console.log('hiiiii ',serializeTx);
            
            const TXT = await web3.eth.sendSignedTransaction('0x'+serializeTx.toString('hex')).on('transactionHash', hash => {
                console.log('hash====', hash);
                res.status(200).send({
                    "StatusCode": 200,
                    "Transaction Hash": hash
                });
               // console.log(TXT);
            }).catch(er => {
                console.log(er.toString());

            })

        } else {
            res.status(500).send({
                "StatusCode": 500,
                "Error": "fill the value"
            });
        }
    }
    catch (e) {
       
        res.status(500).send({
            "StatusCode": 500,
            "Error": "this is" + e.toString()

        });
    }
}
	

exports.updatePatientReport = async function(req, res){


	try {

        var aadhar_no = req.body.aadhar_no;
        var report_hash = req.body.report_hash;
        var _from = AccountAddress;

       

        if (aadhar_no && report_hash ) {
            
            var contract = new web3.eth.Contract(interface, contractAddress);
            var nonceT = await web3.eth.getTransactionCount(_from);
            var Data = contract.methods.updatePatientReport(aadhar_no, report_hash).encodeABI();

            let RawTransaction = {
                "from": _from,
                "to": aadhar_no,
                "Data": Data,
                "nonce": nonceT,
                "value": '0x0',
                "gasPrice": web3.utils.toHex(20 * 1e9),
                "gasLimit": web3.utils.toHex(210000)
            }
             console.log(RawTransaction);
             const transaction = new TX(RawTransaction, {chain: 'rinkeby', hardfork: 'petersburg'});
            transaction.sign(PrivateKey);
            
            const serializeTx = transaction.serialize();
            console.log('hiiiii ',serializeTx);
            
            const TXT = await web3.eth.sendSignedTransaction('0x'+serializeTx.toString('hex')).on('transactionHash', hash => {
                console.log('hash====', hash);
                res.status(200).send({
                    "StatusCode": 200,
                    "Transaction Hash": hash
                });
               // console.log(TXT);
            }).catch(er => {
                console.log(er.toString());

            })

        } else {
            res.status(500).send({
                "StatusCode": 500,
                "Error": "fill the value"
            });
        }
    }
    catch (e) {
       
        res.status(500).send({
            "StatusCode": 500,
            "Error": "this is" + e.toString()

        });
    }

	
}



