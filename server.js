const express = require('express');
const app = express()
const mysql = require('mysql2');
const dotenv = require('dotenv');

//configure environment vairable 
dotenv.config();

//create a connection 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})


//test connection
db.connect((err) => {
    if (err){
        return console.log('Erro connecting to database: ', err)
    }

    console.log('successfully connected to mysql: ', db.threadId)
})

// connect to port
const PORT = 3000
app.listen(PORT, () => {
    console.log('server is running on http://localhost: 3000')
})

//retrieve all patients
app.get('', (req, res) => {
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
    const getProviders = "SELECT first_name, last_name, provider_specialty FROM providers";
    const getPatients2 = "SELECT first_name FROM Patients";
    const getProviders2 = "SELECT provider_specialty FROM providers"

    // First query to get patients
    db.query(getPatients, (err, patientData) => {
        if (err) {
            return res.status(400).send("Fail to fetch patients", err);
        }

        // Nested query to get providers after fetching patients
        db.query(getProviders, (err, providerData) => {
            if (err) {
                return res.status(400).send("Fail to fetch providers", err);
            }

            // Nested query to get patients first_name 
            db.query(getPatients2, (err, Patients2Data) => {
                if (err) {
                    return res.status(400).send("Fail to fetch patients first name", err);
                }

                // Nested query to get provider_specialty 
                db.query(getProviders2, (err, providers2Data) => {
                    if (err) {
                        return res.status(400).send("Fail to fetch providers specialty", err);
                    }

                    // Send combined result as a single response
                    res.status(200).json({
                        patients: patientData,
                        providers: providerData,
                        patients2: Patients2Data,
                        Providers2: providers2Data

                    });
                });
            });
        });
    });
});

