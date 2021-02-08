// ==============================================================================
// DEPENDENCIES
// Series of npm packages that we will use to give our server useful functionality
// ==============================================================================

var express = require("express");
const mongoose = require('mongoose');
var compression = require("compression");
const logger = require("morgan");
// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================
var app = express();
var PORT = process.env.PORT || 8080;

app.use(compression());
app.use(logger("dev"));
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

const db = require('./models');

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mealplanner", {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// ================================================================================
// ROUTER
// ================================================================================
app.get('/', (req,res) => {
    // res.send('howdy there');
    res.sendFile('./index.html')
})

// SEED DATA
const seedMeals = [
    {
        name: 'lasagna',
        servings: 12,
        isTasty: true,
        isHotDog: false,
        spicyLevel: 4
    },
    {
        name: 'fried chicken',
        servings: 4,
        isTasty: true,
        isHotDog: false,
        spicyLevel: 6
    },
    {
        name: 'nefarious fish',
        servings: 2,
        isTasty: false,
        isHotDog: true,
        spicyLevel: 1
    }
]
app.get('/seedplans', (req, res) => {
    db.Meal.create(seedMeals)
        .then(result => {
            console.log(result)
            db.Week.create([
                {
                    name: 'week 1',
                    meals: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'week 2',
                    meals: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'week 3',
                    meals: [
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'week 4',
                    meals: [
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },
                {
                    name: 'week 5',
                    meals: [
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id,
                        result[Math.floor(Math.random() * result.length)]._id
                    ]
                },

            ])
                .then(fullRes => {
                    // console.log(fullRes)
                    res.json(fullRes)
                })
                .catch(err => {
                    res.json(err)
                })
        })
        .catch(err => {
            // console.log(err)
            res.json(err)
        })
})


// VIEW DATA
app.get('/api/meals', (req, res) => {
    db.Meal.find({})
    .then(dbMeals => {
        res.json(dbMeals);
    })
})

app.get('/api/weeks', (req,res) => {
    db.Week.find({})
    .then(dbWeek => {
        res.json(dbWeek)
    })
    .catch(err => {
        console.log(err)
        res.send(err);
    })
})

app.get('/populatedmeals', (req,res) => {
    db.Week.find({})
    .populate('meals')
    .then(dbWeek => {
        res.json(dbWeek)
    })
    .catch(err => {
        console.log(err)
        res.send(err);
    })})

app.post('/api/weeks', ({ body }, res) => {
    db.Week.create(body)
    .then(dbWeek => {
        res.json(dbWeek)
    })
    .catch(err => {
        console.log(err)
        res.send(err);
    })
})

app.post('/api/meals', (req, res) => {
    console.log(req.body);
    
    db.Meal.create(req.body)
    .then(dbMeal => {
        db.Week.findOneAndUpdate({_id:req.body.weekId}, {$push: {meals: dbMeal._id}})
        .then(dbWeek => res.send(dbWeek))
    })
    .catch(err => res.json(err))

})
// =============================================================================
// LISTENER
// =============================================================================

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});