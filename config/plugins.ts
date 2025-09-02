export default ({ env }) => ({
  email: {
    config: {
      provider: "sendgrid",
      providerOptions: {
        apiKey: env("SENDGRID_API_KEY"), // لازم يكون متغير بيئة موجود
      },
      settings: {
        defaultFrom: "your-email@example.com",
        defaultReplyTo: "your-email@example.com",
      },
    },
  },
});
