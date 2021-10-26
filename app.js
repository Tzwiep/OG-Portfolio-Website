var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// required modules for sending an email from the contact form: nodemailer and multiparty
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");


var indexRouter = require('./routes/index');
var projectsRouter = require('./routes/projects');
var contactsRouter = require('./routes/contact');
var successRouter = require('./routes/success');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/contact', contactsRouter);
app.use('/success', successRouter);


/**
 *  Contact Form - Using Nodemailer
 *  https://www.npmjs.com/package/nodemailer
 */
// create transporter object using Nodemailer - a transporter is an object that can send emails
// Nodemailer's createTransport() function connects to a SMTP (Simple Mail Transfer Protocol) server using my creds
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ACCOUNT,
    pass: process.env.GMAIL_PASSWORD,
  },
});
// route defined for HTTP POST request
app.post("/send", (req, res) => {
  // initialize variables for multiparty middeleware functions
  let form = new multiparty.Form();
  let data = {};
  // multiparty parses the user's information entered into the contact form into usable data
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
    });
    //  creating a mail object from the contact form fields -
    //  using my website's email address as the fixed recipient... and using a fixed subject line
    const mail = {
      sender: `${data.name} <${data.email}>`,
      to: process.env.GMAIL_ACCOUNT,
      subject: 'Contact Submission',
      text: `${data.name} <${data.email}> \n${data.message}`,
    };
    // use the transporter object and Nodemailer's sendMail() function to send the email (mail object)
    transporter.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
  });
  // after email is sent, redirect user to success page
  res.redirect(301, '/success');
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
