module.exports = {
    getHomePage: (req, res) => {
        let query = "SELECT * FROM `contacts` ORDER BY id ASC"; // query database to get all the contacts

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('index.ejs', {
                title: "Welcome to ContactList | View contacts"
                ,contacts: result
            });
        });
    },
};