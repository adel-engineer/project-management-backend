const Mailgen = require('mailgen');
const nodemailer = require('nodemailer')


/**information that I give */
const emailVerificationMailgenContent = (username, verificationUrl) => {
    return{
        body:{
            name: username,
            intro: "Welcome to our app. We are excited to have you on board.",
            action:{
                instructions:"Click below to verify your account.",
                button:{
                     color: "#22BC66",
                     text: "Verify your email",
                     link: verificationUrl
                }
            },
              outro: "Need help or have questions? Just reply to this email, we would love to help."
        }
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) =>{
    return{
        body:{
            name:username,
            intro:"",
            action:{
                instructions:"",
                button:{
                    color:"#FF5733",
                    text:"Reset Password",
                    link:passwordResetUrl
                }
            },
            outro: "Need help or have questions? Just reply to this email, we would love to help."
        }
    }
}

const sendEmail = async (option) => {
    //1

    const mailGenerator = new Mailgen({
        theme: "default",
        product:{
            name: "Task Manager",
            link:"https://taskmanager.com"
        }
    })
 const emailTextual =  mailGenerator.generatePlaintext(option.mailgenContent)
 const emailHTML =  mailGenerator.generate(option.mailgenContent)

//2
 const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port:process.env.MAILTRAP_SMTP_POST,
    auth:{
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS
    }
 });

 //3
 const mail = {
    from: "adel.s.engineer@gmail.com",
    to: option.email,
    subject: option.subject,
    text: emailTextual,
    html: emailHTML
 }

//4
 try{
    await transporter.sendMail(mail)
 }catch(error){console.error("email service failed. error:",error)
 }
}


module.exports = {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
};

