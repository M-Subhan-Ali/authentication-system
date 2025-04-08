import nodemailer from "nodemailer";

const sendWelcomeEmail = async ( name , toEmail ) => {

 try {
   const transporter = nodemailer.createTransport({
     service : "Gmail",
     auth:{
       user : process.env.EMAIL_USER,
       pass : process.env.EMAIL_PASS
     }
   })
 
   const mailOptions = {
          from: `"MERN Auth" <${process.env.EMAIL_USER}>`,
          to: toEmail,
          subject: "🎉 Welcome to MERN Auth!",
          html: `<h3>Hi ${name},</h3><p>Thanks for registering with our app!</p>`,
        };
 
   await transporter.sendMail(mailOptions)

   console.log(`Email was Sent to ${toEmail}`)
 
 } catch (error) {
  console.log("❌ Failed to send Welcome Email",error)
 }

}

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth : {
    user : process.env.EMAIL_USER ,
    pass : process.env.EMAIL_PASS
  }
})

export {sendWelcomeEmail }
















// import nodemailer from "nodemailer";

// const sendWelcomeEmail = async (toEmail, name) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "Gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"MERN Auth" <${process.env.EMAIL_USER}>`,
//       to: toEmail,
//       subject: "🎉 Welcome to MERN Auth!",
//       html: `<h3>Hi ${name},</h3><p>Thanks for registering with our app!</p>`,
//     };

//     await transporter.sendMail(mailOptions);
//     console.log("✅ Welcome email sent to:", toEmail);
//   } catch (error) {
//     console.error("❌ Failed to send welcome email:", error);
//   }
// };

// export default sendWelcomeEmail;
