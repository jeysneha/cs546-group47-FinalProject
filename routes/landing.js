const express = require('express');
const router = express.Router();
const validation = require('../helpers');
const data = require('../data');
const usersData = data.users;


// first page of our application, it's an introduction page
router.route('/').get(async (req, res) => {
    res.render('landing', {
        title: 'Landing'
    })
})


// register page
router
    .route('/register')
    .get(async (req, res) => {
        if (req.session.user) {
            //if user is authenticated
            res.redirect('/products');
        }else {
            res.render('userRegister.handlebars', {
                title: 'Sign-up',
                hasErrors: false,
                error: null,
            })
        }
    })
    .post(async (req, res) => {
        let username = req.body.usernameInput;
        let email = req.body.emailInput;
        let password = req.body.passwordInput;

        // input check
        try{
            username = validation.checkUsername(username);
            email = validation.checkEmail(email);
            password = validation.checkPassword(password);
        }catch (e) {
            return res.status(400).render('userRegister.handlebars', {
                title: 'Sign-up',
                hasErrors: true,
                error: e,
            });
        }

        //call db method
        try{
            const createInfo = await usersData.createUser(username, email, password);

            if (!createInfo) {
                return res.status(500).render('userRegister.handlebars', {
                    title: 'Sign-up',
                    hasErrors: true,
                    error: 'Internal Server Error!',
                });
            }

            if (createInfo.insertedUser) {
                return res.status(200).render('userLogin', {
                    title: 'Log-in',
                    hasErrors: false,
                    error: null,
                });
            }
        }catch (e) {
            res.status(500).render('userRegister.handlebars', {
                title: 'Sign-up',
                hasErrors: true,
                error: e,
            });
        }
    })

//login pages
router
    .route('/login')
    .get(async (req, res) => {
        if (req.session.user) {
            res.redirect('/products');
        }else {
            res.render('userLogin', {
                title: 'Log-in',
                hasErrors: false,
                error: null,
            })
        }
    })
    .post(async (req, res) => {
        let username = req.body.usernameInput;
        let password = req.body.passwordInput;

        //input check
        try{
            username = validation.checkUsername(username);
            password = validation.checkPassword(password);
        }catch (e) {
            return res.status(400).render('userLogin', {
                title: 'Log-in',
                hasErrors: true,
                error: e,
            });
        }

        //call db method
        try{
            const authUser = await usersData.checkUser(username, password);

            if (!authUser) {
                return res.status(500).render('userLogin',{
                    title: 'Log-in',
                    hasErrors: true,
                    error: 'Internal Server Error!',
                })
            }

            if (authUser.authenticatedUser) {
                req.session.user = {username: username};
                res.redirect('./products');
            }

        }catch (e) {
            res.status(500).render('userLogin', {
                title: 'Log-in',
                hasErrors: true,
                error: e,
            });
        }
    })


router.route('/products').get(async (req, res) => {
    const user = req.session.user;
    const username = user.username;
    const datetime = new Date().toUTCString();

    res.status(200).render('products', {
        title: 'products',
        username: username,
        datetime: datetime,
    })
})

router
    .route('/logout')
    .get(async (req, res) => {
        req.session.destroy();
        res.render('logout', {
            title: 'Log-out'
        })
    })

module.exports = router;