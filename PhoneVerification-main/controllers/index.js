const mobileSchema = require('../models')
var jwt = require('jsonwebtoken');

//twillo configuration keys
const accountSid = "ACa240d3977cc6906e93beb3d7f76e3708";
const authToken = "3ad7ed8ba160e5cb28b33247b3dcd685";
const client = require('twilio')(accountSid, authToken);

//here is the encryption token key
const privateKey = "shyam"

// logic of sending the OTP
exports.sendOTP = async (request, response) => {

    try {

        //Generating 4 digit 
        var val = Math.floor(1000 + Math.random() * 9000);



        var token = jwt.sign({ OTP: val }, privateKey, { expiresIn: "1m" });
        //Adding into request json object
        request.body.OTP = token

        //here request.body has all the request payload data
        const objectMobile = new mobileSchema(request.body)

        //here we are saving the data to the mongodb database
        await objectMobile.save()

        // //SMS sending code
        client.messages.create({
            body: `Hey! OTP your 4 digit verification code is ${val}`,
            from: '+16073502616', //message sender phone no.
            to: `+91${request.body.phone}` // message receiver phone no. from request payload
        })
            .then(() => {
                console.log("Your OTP is ",val)

                //here we are sending the response in json format with success message
                return response.json({
                    message: "4 digit number is sended to your mobile no."
                })
            })


    } catch (errorMessage) {
        console.log("Error-->", errorMessage)
        //here we are sending the response in json format with error message
        return response.json({
            errorLog: errorMessage,
            errorMessage: "Unable to send the OTP."
        })
    }
}

//logic of verifying the OTP
exports.verifyOTP = (request, response) => {
    try {

        //finding phone no and OTP both from database
        mobileSchema.find({ phone: request.body.phone })
            .then((data) => {
                //if not found the data then show the error message
                if (data.length === 0) {
                    return response.json({
                        errorMessage: "Invalid verification"
                    })
                }
                const phoneDataFromDB = data[data.length - 1]; //pick the last data
                jwt.verify(phoneDataFromDB.OTP, privateKey, async function (err, decoded) {
                    // console.log(decoded, err)

                    // if error is found
                    if (err != null) {
                        return response.json({
                            errorMessage: "OTP is expired or invalid OTP"
                        })
                    }

                    //OTP is verified successfully then delete the data from database
                    await mobileSchema.findByIdAndDelete(phoneDataFromDB._id)
                    //if data is found and verified then show a success message in response.
                    return response.json({
                        message: "Mobile no. is Verified successfully!"
                    })
                })

            })


    } catch (errorMessage) {
        console.log("Error-->", errorMessage)
        //here we are sending the response in json format with error message
        return response.json({
            errorLog: errorMessage,
            errorMessage: "Unable to verify the phone no."
        })
    }
}