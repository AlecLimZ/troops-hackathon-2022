const mysql = require('mysql');

//Connection Pool
const pool = mysql.createPool(
    {
        connectionLimit :   100,
        host            :   process.env.DB_HOST,
        user            :   process.env.DB_USER,
        password        :   process.env.DB_PASS,
        database        :   process.env.DB_NAME
    }
);

//View Users
exports.view = (req, res) =>
{
    pool.getConnection((err, connection) =>
    {
        if(err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        //User the connection
        connection.query('SELECT * FROM `creation-jobs` WHERE status = "active"', (err, rows) =>
        {
            // when done with the connection, release it
            connection.release();
            if (!err)
                res.render('home', { rows });
            else
                console.log(err);
            console.log('The data from user table: \n', rows);
        });
    });
}

// Find job by search
exports.find = (req, res) =>
{
    pool.getConnection((err, connection) =>
    {
        if(err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query('SELECT * FROM `creation-jobs` WHERE job_name LIKE ?', ['%' + searchTerm + '%'], (err, rows) =>
        {
            // when done with the connection, release it
            connection.release();
            if (!err)
                res.render('home', { rows });
            else
                console.log(err);
            console.log('The data from user table: \n', rows);
        });
    });
}

exports.form = (req, res) =>
{
    res.render('add-user');
}

// Add new job post
exports.create = (req, res) =>
{
    const { company_name, job_name, job_type, description, working_place, offer} = req.body;
    pool.getConnection((err, connection) =>
    {
        if(err) throw err; // not connected!
        console.log('Connected as ID' + connection.threadId);

        let searchTerm = req.body.search;

        //User the connection
        connection.query('INSERT INTO `creation-jobs` SET company_name = ?, job_name = ?, job_type = ?, description = ?, working_place = ?, offer =?', [company_name, job_name, job_type, description, working_place, offer], (err, rows) =>
        {
            // when done with the connection, release it
            connection.release();
            if (!err)
                res.render('add-user', {alert: 'Job successfully created'});
            else
                console.log(err);
            console.log('The data from user table: \n', rows);
        });
    });
}