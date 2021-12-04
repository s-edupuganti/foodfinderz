const express = require("express");
const { appendFileSync } = require('fs');
const path = require('path');
const app = express()
const { pool } = require("./dbManager");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport"); 
const yelp = require("yelp-fusion");
const initializePass = require("./passportManager");
const geolocation = require("ip-geolocation-api-javascript-sdk");
const apiKey = '***REMOVED***';
const yelpClient = yelp.client(apiKey);
// const geolocationClient = new geolocation("b1873a2844c04d1b95fd55bb47da374e", false);


initializePass(passport);

const PORT = process.env.PORT || 4000;

app.use(express.static("public"));

const request = require('request-promise');

// request('https://api.freegeoip.app/json/?apikey=0dd65850-52eb-11ec-b401-9933d41cf968')
// .then(response => {
//     const result = JSON.parse(response);
//     // const prettyJson = JSON.stringify(result, null, 4);
//     console.log(result.longitude);
//     console.log(result.latitude);
    
//     var userLong = result.longitude;
//     var userLat = result.latitude;
// })
// .catch(error => {
//     console.log(error)
// })


// app.use(express.json());
// app.use(express.urlencoded());

///////////////////////////////////////////////////////////////////////
//                                                                   //
// LOGIN                                                             //
//                                                                   //
///////////////////////////////////////////////////////////////////////

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended : false}))

app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// app.use(bodyParser.urlencoded({extended: true}));

// app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.get("/", (req, res) => {


    res.sendFile(path.join(__dirname, '/index.html'));

});

app.get("/login", (req, res) => {
    res.render('login');
});

// var userLong;
// var userLat;

var latitude;
var longitude;

app.post('/login', function (req, res, next) {
    console.log("Getting to first function!");
    // console.log(req.body);
    console.log();
    longitude = req.body.userLong;
    latitude = req.body.userLat;
    console.log("User Longitude: " + longitude);
    console.log("User latitude: " + latitude);
    console.log();
    next()
}, passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));


// var longitude = -96.31888053128523;
// var latitude = 30.61604025619329;
// var longitude = parseFloat(userLong);
// var latitude = parseFloat(userLat);
// console.log(longitude);
// var longitude = -96.31888053128523;
// var latitude = 30.61604025619329;
var longitude1 = -96.31888053128523;
var latitude1 = 30.61604025619329;
var longitude2 = -96.31888053128523;
var latitude2 = 30.61604025619329;
var longitude3 = -96.31888053128523;
var latitude3 = 30.61604025619329;
var longitude4 = -96.31888053128523;
var latitude4 = 30.61604025619329;
var longitude5 = -96.31888053128523;
var latitude5 = 30.61604025619329;
var name;
var address;
var name1;
var address1;
var name2;
var address2;
var name3;
var address3;
var name4;
var address4;
var name5;
var address5;

var userName = 'hello';


app.get("/dashboard", (req, res) => {
    res.render("dashboard", {longitude: longitude, latitude: latitude, name: name, address: address, longitude1: longitude1, latitude1: latitude1, name1: name1, address1: address1, longitude2: longitude2, latitude2: latitude2, name2: name2, address2: address2, longitude2: longitude2, latitude3: latitude3, name3: name3, address3: address3, longitude3: longitude3, latitude3: latitude3, name3: name3, address3: address3, longitude4: longitude4, latitude4: latitude4, name4: name4, address4: address4, longitude5: longitude5, latitude5: latitude5, name5: name5, address5: address5 });
});

app.post('/register', async (req, res) => {

    let {name, email, password } = req.body;

    console.log( {
        name,
        email,
        password
    });

    let errors = [];

    if (!name || !email || !password) {
        errors.push({message: "Please enter all fields!"});
    }

    if (password.length < 5) {
        errors.push({message: "Password should be at least 5 characters"});
    }

    if (errors.length > 0) {
        res.render('login', {errors});
    } else {
        let hashedPass = await bcrypt.hash(password, 10);
        console.log(hashedPass);

        pool.query(
            `SELECT * FROM users WHERE email = $1`, [email], 
            (err, results) => {
                if (err) {
                    throw err
                }

                console.log(results.rows);

                if (results.rows.length > 0) {
                    errors.push({message: "Email already registered"});
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, 
                        [name, email, hashedPass], 
                        (err, results) => {
                            if (err) {
                                throw err
                            }
                            console.log(results.rows);
                            console.log("Registered!");
                            req.flash('success_msg', "You are now registered. Please login.");
                            res.redirect("/login");
                        }

                    )
                }
            }
        )
    }

});




///////////////////////////////////////////////////////////////////////
//                                                                   //
// Search                                                            //
//                                                                   //
///////////////////////////////////////////////////////////////////////


app.post('/search', async (req, res) => {

    // res.redirect("dashboard");

    console.log("Test!");
    let {search} = req.body;

    console.log( {
        search
    });


    const searchRequest = {
        term: search,
        location: 'college station, tx'
    };
    
    yelpClient.search(searchRequest).then(response => {
    
        longitude = response.jsonBody.businesses[0].coordinates.longitude;
        latitude = response.jsonBody.businesses[0].coordinates.latitude;
        name = response.jsonBody.businesses[0].name;
        address = response.jsonBody.businesses[0].location.address1;
        console.log("hello");
        console.log(latitude);
        console.log(longitude);
        res.redirect("dashboard");

    });

});

app.post('/setUp', async (req, res) => {

    // res.redirect("dashboard");

    console.log("Test!");
    console.log("SetUp")

    const searchRequest = {
        term: 'restaurant',
        location: 'college station, tx'
    };

        
    client.search(searchRequest).then(response => {
        var i = 0;
        longitude = response.jsonBody.businesses[i].coordinates.longitude;
        latitude = response.jsonBody.businesses[i].coordinates.latitude;
        name = response.jsonBody.businesses[i].name;
        address = response.jsonBody.businesses[i].location.address1;
        console.log("hello");
        console.log(latitude);
        console.log(longitude);
        i = i+1;
        while (response.jsonBody.businesses[i].name == response.jsonBody.businesses[i-1].name) {
            i = i+1;
        }
        longitude1 = response.jsonBody.businesses[i].coordinates.longitude;
        latitude1 = response.jsonBody.businesses[i].coordinates.latitude;
        name1 = response.jsonBody.businesses[i].name;
        address1 = response.jsonBody.businesses[i].location.address1;
        console.log("hello");
        console.log(latitude1);
        console.log(longitude1);
        i = i+1;
        while (response.jsonBody.businesses[i].name == response.jsonBody.businesses[i-1].name) {
            i = i+1;
        }
        longitude2 = response.jsonBody.businesses[i].coordinates.longitude;
        latitude2 = response.jsonBody.businesses[i].coordinates.latitude;
        name2 = response.jsonBody.businesses[i].name;
        address2 = response.jsonBody.businesses[i].location.address1;
        console.log("hello");
        console.log(latitude1);
        console.log(longitude1);
        i = i+1;
        while (response.jsonBody.businesses[i].name == response.jsonBody.businesses[i-1].name) {
            i = i+1;
        }
        longitude3 = response.jsonBody.businesses[i].coordinates.longitude;
        latitude3 = response.jsonBody.businesses[i].coordinates.latitude;
        name3 = response.jsonBody.businesses[i].name;
        address3 = response.jsonBody.businesses[i].location.address1;
        console.log("hello");
        console.log(latitude1);
        console.log(longitude1);
        i = i+1;
        while (response.jsonBody.businesses[i].name == response.jsonBody.businesses[i-1].name) {
            i = i+1;
        }
        longitude4 = response.jsonBody.businesses[i].coordinates.longitude;
        latitude4 = response.jsonBody.businesses[i].coordinates.latitude;
        name4 = response.jsonBody.businesses[i].name;
        address4 = response.jsonBody.businesses[i].location.address1;
        console.log("hello");
        console.log(latitude1);
        console.log(longitude1);
        i = i+1;
        console.log(i);
        longitude5 = response.jsonBody.businesses[i].coordinates.longitude;
        latitude5 = response.jsonBody.businesses[i].coordinates.latitude;
        name5 = response.jsonBody.businesses[i].name;
        address5 = response.jsonBody.businesses[i].location.address1;
        console.log("hello2");
        console.log(latitude1);
        console.log(longitude1);
        res.redirect("dashboard");

    });

});



// app.post("/register", (req, res) => {

//     return res.send(req.query);

// });

// app.get("/dashboard", (req, res) => {
//     res.sendFile('public/dashboard.html' , { root : __dirname});
// })

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
