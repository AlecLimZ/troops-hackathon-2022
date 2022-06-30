const express = require('express');
//const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5555;

app.use(express.urlencoded(
    {
        extended: true
    }
));
app.use(express.json());



//MySQL
const pool = mysql.createPool(
    {
        connectionLimit :   10,
        host            :   'sql212.epizy.com',
        user            :   'epiz_32069568',
        password        :   'AnWE1QWoyaoWt',
        database        :   'epiz_32069568_troopers'
    }
);

app.get('', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from jobs', (err, rows) =>
        {
            connection.release()

            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
});

// Get by ID
app.get('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from jobs WHERE id = ?', [req.params.id], (err, rows) =>
        {
            connection.release()

            if (!err)
                res.send(rows);
            else
                console.log(err);
        })
    })
});

// Delete a records
app.delete('/:id', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from jobs WHERE id =?', [req.params.id], (err, rows) =>
        {
            connection.release()

            if (!err)
                res.send(`Job ID ${req.params.id} has been removed.`);
            else
                console.log(err);
        })
    })
});

// Add a job
app.post('', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO jobs SET ?', params, (err, rows) =>
        {
            connection.release()

            if (!err)
                res.send(`Company name ${params.company_name} has been added.`);
            else
                console.log(err);
        })
    })

    console.log(req.body)
});

//update post
app.put('', (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { id, company_name, job_req, description, image} = req.body

        connection.query('UPDATE jobs SET company_name = ?, job_req = ?, description = ?, image = ? WHERE id = ?', [company_name, job_req, description, image, id], (err, rows) =>
        {
            connection.release()

            if (!err)
                res.send(`Company name ${company_name} has been updated.`);
            else
                console.log(err);
        })
    })

    console.log(req.body)
});

app.listen(port, () => console.log(`Listen on port ${port}`));