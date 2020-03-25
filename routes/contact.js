const fs = require('fs');

module.exports = {
    addcontactPage: (req, res) => {
        res.render('add-contact.ejs', {
            title: "Welcome to ContactList | Add a new contact"
            ,message: ''
        });
    },
    addcontact: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let name = req.body.name;
        let email = req.body.email;
        let phone = req.body.phone;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = name + '.' + fileExtension;

        // check the filetype before uploading it
        if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
            // upload the file to the /public/assets/img directory
            uploadedFile.mv(`public/assets/img/${image_name}`, (err ) => {
            if (err) {
                return res.status(500).send(err);
            }
            // send the player's details to the database
            let query = "INSERT INTO `contacts` (name, email, phone, image) VALUES ('" + name + "', '" + email + "', '" + phone + "', '" + image_name + "')";
            db.query(query, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
            });
        } else {
            message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
            res.render('add-contact.ejs', {
                message,
                title: "Welcome to ContactList | Add a new contact"
            });
        }
    },
    editcontactPage: (req, res) => {
        let contactId = req.params.id;
        let query = "SELECT * FROM `contacts` WHERE id = '" + contactId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-contact.ejs', {
                title: "Edit  contact"
                ,contact: result[0]
                ,message: ''
            });
        });
    },
    editcontact: (req, res) => {
        let contactId = req.params.id;
        let name = req.body.name;
        let email = req.body.email;
        let phone = req.body.phone;

        let query = "UPDATE `contacts` SET `name` = '" + name + "', `email` = '" + email + "', `phone` = '" + phone + "' WHERE `contacts`.`id` = '" + contactId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deletecontact: (req, res) => {
        let contactId = req.params.id;
        let getImageQuery = 'SELECT image from `contacts` WHERE id = "' + contactId + '"';
        let deleteUserQuery = 'DELETE FROM contacts WHERE id = "' + contactId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
