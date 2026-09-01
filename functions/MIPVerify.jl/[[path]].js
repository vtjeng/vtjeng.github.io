import { proxyGitHubPagesProject } from "../../_cloudflare/github-pages-proxy.js";

export const onRequest = (context) => proxyGitHubPagesProject(context, "/MIPVerify.jl");
