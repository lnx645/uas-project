import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss";
import { pluginSvgr } from "@rsbuild/plugin-svgr";
import { pluginTypedCSSModules } from "@rsbuild/plugin-typed-css-modules";
import { pluginImageCompress } from "@rsbuild/plugin-image-compress";

export default defineConfig({
  plugins: [
    pluginTailwindcss({
      optimize: {
        minify: true,
      },
    }),
    pluginReact(),
    pluginTypedCSSModules(),
    pluginImageCompress(),
    pluginSvgr({
      svgrOptions: {
        exportType: "default",
      },
    }),
  ],
  dev: {
    lazyCompilation: true,
  },
  html: {
    inject: true,
  },
  source: {
    entry: {
      app_entry: "./web_app/app.tsx",
    },
  },

  server: {
    publicDir: false,
  },
  splitChunks: {
    preset: "per-package",
  },
  tools: {
    rspack: {
      optimization: {
        splitChunks: false,
        runtimeChunk: false,
      },
    },
  },
  mode: "production",
  output: {
    minify: true,
    sourceMap: {
      js: false,
      css: false,
    },
    manifest: true,
    emitAssets: true,
    emitCss: true,
    cssModules: {
      exportLocalsConvention: "asIs",
      localIdentName: "[hash:base64:6]",
      auto: true,
    },
    target: "web",
    filenameHash: false,
    cleanDistPath: true,
    distPath: {
      root: "./src/main/resources/static",
    },
  },
});
