// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src",
  runtimeConfig: {
    public: {
      appName: "Coding Assistent",
    },
  },
  css: ["~/assets/scss/main.scss", "~/assets/scss/helperClasses.scss"],
});
