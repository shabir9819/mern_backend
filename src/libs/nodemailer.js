import nodemailer from "nodemailer";

const nodemailerAdapter = {
  // Creates a new transporter with the given options
  createTransport: async (options) => {
    try {
      const transporter = nodemailer.createTransport(options);
      return transporter;
    } catch (e) {
      throw new Error(e);
    }
  },

  // Sends an email using the given transporter and mail options
  sendMail: async (transporter, mailOptions) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      return info;
    } catch (e) {
      throw new Error(e);
    }
  },

  // // Verifies the transporter configuration
  // verifyTransport: async (transporter) => {
  //   try {
  //     const result = await transporter.verify();
  //     return result;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // // Gets the test message URL for ethereal email testing
  // getTestMessageUrl: (info) => {
  //   try {
  //     const testMessageUrl = nodemailer.getTestMessageUrl(info);
  //     return testMessageUrl;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // // Sets transporter options dynamically
  // setTransporterOptions: (transporter, options) => {
  //   try {
  //     transporter.set(options);
  //     return transporter;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // // Gets the current transporter options
  // getTransporterOptions: (transporter) => {
  //   try {
  //     const options = transporter.get();
  //     return options;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },

  // // Adds an attachment to the mail options
  // addAttachment: (mailOptions, attachment) => {
  //   try {
  //     if (!mailOptions.attachments) {
  //       mailOptions.attachments = [];
  //     }
  //     mailOptions.attachments.push(attachment);
  //     return mailOptions;
  //   } catch (e) {
  //     throw new Error(e);
  //   }
  // },
};

export default nodemailerAdapter;
