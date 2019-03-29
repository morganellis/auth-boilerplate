const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const multer = require("multer");
const multerS3 = require("multer-s3");
var moment = require("moment");
var path = require("path");
// const User = require("../models/user");
// const Properties = require("../schemas/properties");
// const Images = require("../schemas/images");
const Story = require("../models/story.model");


var AWS = require("aws-sdk");
var s3json = "../config/s3_config.json";
AWS.config.loadFromPath("./config/s3_config.json");
var s3 = new AWS.S3({ params: {Bucket: "ariix-tranformation"} });
var bucketParams = {Bucket: "ariix-tranformation"};
s3.createBucket(bucketParams)
var s3Bucket = new AWS.S3( { params: {Bucket: "ariix-tranformation"} } )

let = currDate = new Date().toISOString();
let fullDate = currDate.toLocaleString();
let formatted_date = moment(currDate).format("MM-DD-YYYY");
console.log( formatted_date);

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "video/mp4": "mp4",
  "video/mpg": "mpg",
  "video/mpeg": "mpeg",
  "video/mpe": "mpe",
  "video/mp4": "mp4",
  "video/viv": "viv",
  "video/vivo": "vivo",
  "video/qt": "qt",
  "video/mov": "mov",
  "video/avi": "avi"
};

const s3Url = "https://s3.amazonaws.com/ariix-transformation/"

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'ariix-transformation',
    acl: 'public-read',
    region: 'us-east-1',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
})

router.post("/story",
upload.single("media0"), (req, res, next) => {
 let uname = req.body.fname
 const url = req.protocol + "://" + req.get("host");
  let filepath0 = undefined;
  const transformStory = new Story({
    market: req.body.market,
    fname: req.body.fname,
    repId: req.body.repId,
    age: req.body.age,
    gender: req.body.gender,
    langChoice: req.body.langChoice,
    category: req.body.category,
    storyInput: req.body.storyInput,
    media0: s3Url + req.file.key,
    media1: undefined,
    media2: undefined,
    media3: undefined,
    date: formatted_date
  });
  transformStory
    .save()
    .then(result => {
      res.status(201).json({
        message: "Story submitted",
        result: result
      });
      console.log(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/story", (req, res, next) => {
  Story.find().then(story => {
    if (story) {
      res.status(200).json(story);
    } else {
      res.status(404).json({ message: "No stories found!" });
    }
  });
});

router.get("/story/:id", (req, res, next) => {
  Story.findById(req.params.id).then(story => {
    if (story) {
      res.status(200).json(story);
    } else {
      res.status(404).json({ message: "Story not found!" });
    }
  });
});

module.exports = router;

